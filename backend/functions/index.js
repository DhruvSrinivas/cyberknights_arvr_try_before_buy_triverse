/**
 * backend/functions/index.js — TRIVERSE Firebase Cloud Functions
 * OWNER: Dhruv
 *
 * ENDPOINTS:
 *   POST /extractProduct      — extracts product data from a URL (Amazon/Flipkart)
 *   GET  /getPrices           — fetches price comparison results for a product name
 *   GET  /getRecommendations  — ML-scored product recommendations from preset catalog
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
 *   curl "http://127.0.0.1:5001/YOUR_PROJECT_ID/us-central1/getRecommendations?roomType=living&lengthCm=400&widthCm=300&style=modern&budget=30000"
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

// Shared config — collection names, cache TTLs, product catalog, room presets
const { FIRESTORE_COLLECTIONS, CACHE_TTL_MS } = require('../../shared/config.js');
const { PRODUCT_CATALOG }                      = require('../../shared/productCatalog.js');
const { ROOM_PRESETS }                         = require('../../shared/roomPresets.js');


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


// ---------------------------------------------------------------------------
// CLOUD FUNCTION 3: getRecommendations
// GET /getRecommendations?roomType=living&lengthCm=400&widthCm=300&style=modern&budget=30000
// ---------------------------------------------------------------------------

/**
 * scoreProduct(product, params)
 *
 * Rule-based ML scoring pipeline.
 * Returns a score in [0, 1].
 *
 * score = (spaceScore × 0.25) + (styleScore × 0.35) + (budgetScore × 0.25) + (roomTypeScore × 0.15)
 *
 * spaceScore:    1.0 if footprint < 20% of room area, linearly decays to 0 at 80%
 * styleScore:    1.0 if style tag matches, 0.0 otherwise
 * budgetScore:   1.0 if price <= budget, 0.5 at 125% of budget, 0.0 at 200%+
 * roomTypeScore: 1.0 if roomType in product.roomTypes, 0.5 if 'any', 0.0 otherwise
 *
 * @param {Object} product  - Product entry from PRODUCT_CATALOG
 * @param {Object} params   - { roomType, lengthCm, widthCm, style, budget }
 * @returns {number}        - Score in [0, 1]
 */
function scoreProduct(product, { roomType, lengthCm, widthCm, style, budget }) {
  // ── spaceScore ──────────────────────────────────────────────────────────
  const roomAreaCm2    = lengthCm * widthCm;
  const productAreaCm2 = (product.dimensions?.lengthCm || 0) * (product.dimensions?.widthCm || 0);
  let spaceScore = 1.0;
  if (roomAreaCm2 > 0 && productAreaCm2 > 0) {
    const occupancyRatio = productAreaCm2 / roomAreaCm2;
    if (occupancyRatio >= 0.8) {
      spaceScore = 0.0;
    } else if (occupancyRatio > 0.2) {
      // Linear decay: 1.0 at 0.2 → 0.0 at 0.8
      spaceScore = Math.max(0, 1 - (occupancyRatio - 0.2) / 0.6);
    }
  }

  // ── styleScore ───────────────────────────────────────────────────────────
  const styleScore = (product.styles || []).includes(style) ? 1.0 : 0.0;

  // ── budgetScore ──────────────────────────────────────────────────────────
  const price = product.price_inr || 0;
  let budgetScore = 1.0;
  if (price > budget) {
    const overshoot = price / budget; // e.g. 1.25 = 25% over
    if (overshoot >= 2.0) {
      budgetScore = 0.0;
    } else {
      budgetScore = Math.max(0, 1 - (overshoot - 1.0));
    }
  }

  // ── roomTypeScore ─────────────────────────────────────────────────────────
  const roomTypes = product.roomTypes || [];
  let roomTypeScore = 0.0;
  if (roomTypes.includes(roomType))  roomTypeScore = 1.0;
  else if (roomTypes.includes('any')) roomTypeScore = 0.5;

  // ── Weighted sum ─────────────────────────────────────────────────────────
  const score =
    spaceScore    * 0.25 +
    styleScore    * 0.35 +
    budgetScore   * 0.25 +
    roomTypeScore * 0.15;

  return parseFloat(score.toFixed(4));
}

/**
 * getRecommendations
 *
 * Scores all products in PRODUCT_CATALOG against the user's room params,
 * sorts by score descending, returns the top 5.
 * No scraping, no Firestore needed — all from the preset catalog.
 *
 * Query params:
 *   roomType  (string) — e.g. 'living'
 *   lengthCm  (number) — room length in cm
 *   widthCm   (number) — room width in cm
 *   style     (string) — e.g. 'modern'
 *   budget    (number) — max price in INR
 */
exports.getRecommendations = onRequest(
  {
    timeoutSeconds: 10,
    memory: '128MiB',
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
        return res.status(429).json({ error: 'Too many requests. Please slow down.' });
      }

      // ── Method guard ───────────────────────────────────────────────────────
      if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed. Use GET.' });
      }

      // ── Parse + validate query params ──────────────────────────────────────
      const { roomType, style } = req.query;
      const lengthCm = parseFloat(req.query.lengthCm);
      const widthCm  = parseFloat(req.query.widthCm);
      const budget   = parseFloat(req.query.budget);

      const validRoomTypes = ROOM_PRESETS.map(r => r.id);
      const VALID_STYLES   = ['modern', 'minimalist', 'bohemian', 'industrial', 'traditional', 'scandinavian'];

      if (!roomType || !validRoomTypes.includes(roomType)) {
        return res.status(400).json({
          error: `roomType is required. Valid values: ${validRoomTypes.join(', ')}`,
        });
      }
      if (!style || !VALID_STYLES.includes(style)) {
        return res.status(400).json({
          error: `style is required. Valid values: ${VALID_STYLES.join(', ')}`,
        });
      }
      if (!lengthCm || !widthCm || lengthCm < 50 || widthCm < 50) {
        return res.status(400).json({
          error: 'lengthCm and widthCm are required and must be at least 50 cm.',
        });
      }
      if (!budget || budget < 500) {
        return res.status(400).json({
          error: 'budget is required and must be at least ₹500.',
        });
      }

      const params = { roomType, lengthCm, widthCm, style, budget };
      console.log('[getRecommendations] Params:', params);

      try {
        // ── Score all products ────────────────────────────────────────────────
        const scored = PRODUCT_CATALOG
          .map((product, idx) => ({
            ...product,
            price_inr: product.price_inr,  // expose price_inr top-level for frontend
            _score: scoreProduct(product, params),
            _rank:  idx,
          }))
          .filter(p => p._score > 0)        // exclude zero-score products
          .sort((a, b) => b._score - a._score)
          .slice(0, 5);                      // top 5

        console.log(`[getRecommendations] Returning ${scored.length} results for roomType=${roomType}, style=${style}`);

        return res.status(200).json(scored);

      } catch (error) {
        console.error('[getRecommendations] Error:', error.message);
        return res.status(500).json({
          error: 'Recommendation engine failed.',
          details: error.message,
        });
      }
    });
  }
);

