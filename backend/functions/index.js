/**
 * backend/functions/index.js — TRIVERSE Firebase Cloud Functions
 * OWNER: Dhruv
 *
 * ENDPOINTS:
 *   POST /extractProduct  — extracts product data from a URL (Amazon/Flipkart)
 *   GET  /getPrices       — fetches price comparison results for a product name
 *
 * STACK:
 *   firebase-functions v2, firebase-admin, cors, md5
 *
 * RUN LOCALLY:
 *   cd backend && firebase emulators:start
 *
 * TEST WITH CURL:
 *   curl -X POST http://127.0.0.1:5001/YOUR_PROJECT_ID/us-central1/extractProduct \
 *     -H "Content-Type: application/json" \
 *     -d '{"url":"https://www.amazon.in/dp/B08XYZ"}'
 *
 *   curl "http://127.0.0.1:5001/YOUR_PROJECT_ID/us-central1/getPrices?productName=Wakefit+Sofa"
 */

// ---------------------------------------------------------------------------
// IMPORTS
// ---------------------------------------------------------------------------
const { onRequest } = require('firebase-functions/v2/https');
const admin          = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');
const cors           = require('cors');
const md5            = require('md5');

// Data-service modules (Shoaib's code).
// Path: functions/ → ../../ → triverse/data-service/
const { extractProduct: extractProductData } = require('../../data-service/extractor.js');
const { getPrices: getPricesData }           = require('../../data-service/priceCompare.js');

// Shared config — collection names and cache TTLs
const { FIRESTORE_COLLECTIONS, CACHE_TTL_MS } = require('../../shared/config.js');


// ---------------------------------------------------------------------------
// FIREBASE ADMIN INIT
// ---------------------------------------------------------------------------
// Call once. In the emulator this auto-connects to the local Firestore.
admin.initializeApp();
const db = admin.firestore();


// ---------------------------------------------------------------------------
// CORS CONFIGURATION
// ---------------------------------------------------------------------------
// Allow localhost variants for local dev, plus the Firebase Hosting .web.app
// domain for production. Update the .web.app line with your real project ID.
const corsHandler = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, Postman, same-origin)
    if (!origin) return callback(null, true);

    const allowed = [
      /^http:\/\/localhost(:\d+)?$/,
      /^http:\/\/127\.0\.0\.1(:\d+)?$/,
      /^https:\/\/[a-z0-9-]+\.web\.app$/,         // Firebase Hosting prod
      /^https:\/\/[a-z0-9-]+\.firebaseapp\.com$/,  // Firebase Hosting alt
    ];

    const isAllowed = allowed.some((pattern) => pattern.test(origin));
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin not allowed — ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // cache preflight for 24 h
});


// ---------------------------------------------------------------------------
// RATE LIMITER  (simple in-memory, per-IP, max 20 req/min)
// ---------------------------------------------------------------------------
// NOTE: In-memory means limits reset on cold start. Good enough for hackathon.
// For production, use Firestore or Redis-based rate limiting.
const rateMap = new Map(); // { ip: { count, windowStart } }
const RATE_LIMIT_MAX     = 20;           // max requests per window
const RATE_LIMIT_WINDOW  = 60 * 1000;   // 1-minute window in ms

/**
 * checkRateLimit(ip)
 * Returns true if the IP is within the allowed rate, false if exceeded.
 */
function checkRateLimit(ip) {
  const now    = Date.now();
  const record = rateMap.get(ip);

  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW) {
    // New window
    rateMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false; // Rate limit exceeded
  }

  record.count += 1;
  return true;
}

/**
 * getClientIp(req)
 * Extracts real client IP, accounting for Firebase/GCP proxy headers.
 */
function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}


// ---------------------------------------------------------------------------
// FIRESTORE CACHE HELPERS
// ---------------------------------------------------------------------------

/**
 * getCachedDoc(collection, docId, ttlMs)
 *
 * Fetches a Firestore document and checks whether it is still within the TTL.
 * Returns the document data if fresh, or null if expired / missing.
 *
 * @param {string} collection - Firestore collection name
 * @param {string} docId      - Document ID (MD5 hash of key)
 * @param {number} ttlMs      - Time-to-live in milliseconds
 * @returns {Promise<Object|null>}
 */
async function getCachedDoc(collection, docId, ttlMs) {
  const docRef = db.collection(collection).doc(docId);
  const snap   = await docRef.get();

  if (!snap.exists) return null;

  const data = snap.data();

  // fetchedAt is a Firestore Timestamp — convert to millis for comparison
  if (!data.fetchedAt) return null;
  const fetchedAtMs = data.fetchedAt.toMillis
    ? data.fetchedAt.toMillis()
    : new Date(data.fetchedAt).getTime();

  const ageMs = Date.now() - fetchedAtMs;
  if (ageMs > ttlMs) return null; // Cache expired

  return data;
}

/**
 * setCachedDoc(collection, docId, data)
 *
 * Writes data to Firestore, adding a server-side fetchedAt timestamp.
 * Uses set() with merge: false so the document is fully replaced each time.
 *
 * @param {string} collection
 * @param {string} docId
 * @param {Object} data
 */
async function setCachedDoc(collection, docId, data) {
  const docRef = db.collection(collection).doc(docId);
  await docRef.set({
    ...data,
    fetchedAt: FieldValue.serverTimestamp(),
  });
}


// ---------------------------------------------------------------------------
// CLOUD FUNCTION 1: extractProduct
// POST /extractProduct
// Body: { "url": "https://www.amazon.in/dp/XXXXXX" }
// ---------------------------------------------------------------------------

/**
 * extractProduct
 *
 * Flow:
 *   1. CORS + preflight
 *   2. Rate limit check (429 if exceeded)
 *   3. Validate method is POST (405 otherwise)
 *   4. Validate req.body.url exists (400 if missing)
 *   5. MD5-hash the URL → Firestore doc ID
 *   6. Check Firestore cache (products/) — return immediately if < 24h old
 *   7. Call extractProductData(url) from data-service/extractor.js
 *   8. Persist result to Firestore with fetchedAt timestamp
 *   9. Return product JSON
 *
 * Firestore schema written:
 *   products/{urlHash}: {
 *     name, platform, originalPrice, currency, imageUrl,
 *     category, dimensions{raw,lengthCm,widthCm,heightCm},
 *     glbUrl, productUrl, fetchedAt
 *   }
 */
exports.extractProduct = onRequest(
  {
    timeoutSeconds: 30,
    memory: '256MiB',
    region: 'us-central1', // change to 'asia-south1' once project is set up in Mumbai
  },
  (req, res) => {
    corsHandler(req, res, async () => {
      // ── Preflight ──────────────────────────────────────────────────────────
      if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
      }

      // ── Rate limit ─────────────────────────────────────────────────────────
      const clientIp = getClientIp(req);
      if (!checkRateLimit(clientIp)) {
        return res.status(429).json({
          error: 'Too many requests. Limit is 20 requests per minute.',
        });
      }

      // ── Method guard ───────────────────────────────────────────────────────
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
      }

      // ── Input validation ───────────────────────────────────────────────────
      const url = req.body?.url;
      if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        return res.status(400).json({
          error: 'URL is required and must be a valid http(s) URL.',
        });
      }

      // ── Cache key ──────────────────────────────────────────────────────────
      const docId = md5(url.trim());

      try {
        // ── Cache check (skip gracefully if Firestore is unavailable) ─────────
        let cached = null;
        try {
          cached = await getCachedDoc(
            FIRESTORE_COLLECTIONS.products,
            docId,
            CACHE_TTL_MS.product   // 24 hours
          );
        } catch (cacheErr) {
          console.warn('[extractProduct] Firestore cache unavailable, skipping:', cacheErr.message);
        }

        if (cached) {
          console.log(`[extractProduct] Cache HIT for ${url} (docId: ${docId})`);
          return res.status(200).json(cached);
        }

        console.log(`[extractProduct] Cache MISS for ${url} — calling extractor`);

        // ── Scrape ────────────────────────────────────────────────────────────
        const product = await extractProductData(url.trim());

        // ── Build doc ────────────────────────────────────────────────────────
        const doc = {
          name:          product.name          || '',
          platform:      product.platform      || '',
          originalPrice: product.originalPrice || 0,
          currency:      product.currency      || 'INR',
          imageUrl:      product.imageUrl      || '',
          category:      product.category      || '',
          dimensions: {
            raw:      product.dimensions?.raw      || '',
            lengthCm: product.dimensions?.lengthCm || 0,
            widthCm:  product.dimensions?.widthCm  || 0,
            heightCm: product.dimensions?.heightCm || 0,
          },
          glbUrl:     product.glbUrl     || '',
          productUrl: product.productUrl || url.trim(),
        };

        // ── Persist to Firestore (skip gracefully if unavailable) ─────────────
        try {
          await setCachedDoc(FIRESTORE_COLLECTIONS.products, docId, doc);
          console.log(`[extractProduct] Saved product "${doc.name}" to Firestore`);
        } catch (saveErr) {
          console.warn('[extractProduct] Could not save to Firestore cache:', saveErr.message);
        }

        return res.status(200).json({
          ...doc,
          fetchedAt: new Date().toISOString(),
        });

      } catch (error) {
        console.error('[extractProduct] Error:', error.message);

        // Platform not supported → 422
        if (error.message && error.message.toLowerCase().includes('unsupported platform')) {
          return res.status(422).json({ error: error.message });
        }

        // All other errors → 500
        return res.status(500).json({
          error: 'Failed to extract product.',
          details: error.message,
        });
      }
    });
  }
);


// ---------------------------------------------------------------------------
// CLOUD FUNCTION 2: getPrices
// GET /getPrices?productName=Wakefit+Orthopaedic+Sofa
// ---------------------------------------------------------------------------

/**
 * getPrices
 *
 * Flow:
 *   1. CORS + preflight
 *   2. Rate limit check (429 if exceeded)
 *   3. Validate method is GET (405 otherwise)
 *   4. Validate req.query.productName exists (400 if missing)
 *   5. MD5-hash the productName → Firestore doc ID
 *   6. Check Firestore cache (prices/) — return results array if < 1h old
 *   7. Call getPricesData(productName) from data-service/priceCompare.js
 *   8. Persist { results, fetchedAt } to Firestore
 *   9. Return prices array
 *
 * Firestore schema written:
 *   prices/{productNameHash}: {
 *     results: [{ platform, price_inr, url, in_stock }],
 *     fetchedAt
 *   }
 */
exports.getPrices = onRequest(
  {
    timeoutSeconds: 30,
    memory: '256MiB',
    region: 'us-central1',
  },
  (req, res) => {
    corsHandler(req, res, async () => {
      // ── Preflight ──────────────────────────────────────────────────────────
      if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
      }

      // ── Rate limit ─────────────────────────────────────────────────────────
      const clientIp = getClientIp(req);
      if (!checkRateLimit(clientIp)) {
        return res.status(429).json({
          error: 'Too many requests. Limit is 20 requests per minute.',
        });
      }

      // ── Method guard ───────────────────────────────────────────────────────
      if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed. Use GET.' });
      }

      // ── Input validation ───────────────────────────────────────────────────
      const productName = req.query?.productName;
      if (!productName || typeof productName !== 'string' || !productName.trim()) {
        return res.status(400).json({
          error: 'productName query parameter is required.',
        });
      }

      const cleanName = productName.trim();

      // ── Cache key ──────────────────────────────────────────────────────────
      const docId = md5(cleanName);

      try {
        // ── Cache check (skip gracefully if Firestore is unavailable) ─────────
        let cached = null;
        try {
          cached = await getCachedDoc(
            FIRESTORE_COLLECTIONS.prices,
            docId,
            CACHE_TTL_MS.prices   // 1 hour
          );
        } catch (cacheErr) {
          console.warn('[getPrices] Firestore cache unavailable, skipping:', cacheErr.message);
        }

        if (cached) {
          console.log(`[getPrices] Cache HIT for "${cleanName}" (docId: ${docId})`);
          return res.status(200).json(cached.results || []);
        }

        console.log(`[getPrices] Cache MISS for "${cleanName}" — calling priceCompare`);

        // ── Fetch prices ─────────────────────────────────────────────────────
        const prices = await getPricesData(cleanName);
        const safeResults = Array.isArray(prices) ? prices : [];

        // ── Persist to Firestore (skip gracefully if unavailable) ─────────────
        try {
          await setCachedDoc(FIRESTORE_COLLECTIONS.prices, docId, { results: safeResults });
          console.log(`[getPrices] Saved ${safeResults.length} price result(s) for "${cleanName}"`);
        } catch (saveErr) {
          console.warn('[getPrices] Could not save to Firestore cache:', saveErr.message);
        }

        return res.status(200).json(safeResults);

      } catch (error) {
        console.error('[getPrices] Error:', error.message);
        return res.status(500).json({
          error: 'Failed to fetch prices.',
          details: error.message,
        });
      }
    });
  }
);
