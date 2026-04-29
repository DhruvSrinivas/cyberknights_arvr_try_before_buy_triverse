/**
 * data-service/extractor.js — TRIVERSE Product Data Extractor
 * OWNER: Shoaib
 *
 * RESPONSIBILITIES:
 *   - Detect whether a URL is Amazon.in or Flipkart.com
 *   - Scrape product name, price, image, dimensions, and category
 *   - Return a structured product object
 *   - Throw a descriptive Error if scraping fails
 *
 * INSTALL DEPENDENCIES (run once from data-service/ directory):
 *   npm install axios cheerio
 *
 * USAGE (from backend/functions/index.js):
 *   const { extractProduct } = require('./extractor.js');
 *   const product = await extractProduct('https://www.amazon.in/dp/XXXXXX');
 *
 * RETURN SHAPE — the backend and frontend expect this exact structure:
 * {
 *   name:          string,   // Full product name
 *   platform:      string,   // "Amazon India" or "Flipkart"
 *   originalPrice: number,   // Price in INR as a number (not a string)
 *   currency:      string,   // Always "INR"
 *   imageUrl:      string,   // Direct URL to the product main image
 *   category:      string,   // One of: "sofa" | "chair" | "table" | "lamp" | "bed"
 *   dimensions: {
 *     raw:       string,     // e.g. "210 x 85 x 90 cm (L x W x H)"
 *     lengthCm:  number,
 *     widthCm:   number,
 *     heightCm:  number,
 *   },
 *   productUrl:    string,   // The original URL (normalized)
 *   fetchedAt:     string,   // ISO 8601 timestamp: new Date().toISOString()
 * }
 */

// ---------------------------------------------------------------------------
// IMPORTS
// ---------------------------------------------------------------------------
const axios   = require('axios');   // HTTP client — npm install axios
const cheerio = require('cheerio'); // HTML parser — npm install cheerio

// Shared config — for SUPPORTED_PLATFORMS and PRODUCT_CATEGORIES
// Shoaib: use SUPPORTED_PLATFORMS to validate URLs, and PRODUCT_CATEGORIES
// to map the detected category to the correct config key.
const { SUPPORTED_PLATFORMS, PRODUCT_CATEGORIES } = require('../shared/config.js');


// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

/**
 * HTTP headers to send with every scraping request.
 * A realistic User-Agent is critical — without it, Amazon returns 503.
 * Shoaib: update USER_AGENT if requests start failing.
 */
const SCRAPE_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'en-IN,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

/** Timeout for scraping requests (milliseconds) */
const REQUEST_TIMEOUT_MS = 10000;


// ---------------------------------------------------------------------------
// MAIN EXPORTED FUNCTION
// ---------------------------------------------------------------------------

/**
 * extractProduct(url)
 *
 * PURPOSE:
 *   Entry point for product extraction.
 *   Detects the platform from the URL, routes to the correct scraper,
 *   and returns a structured product object.
 *
 * WHAT TO IMPLEMENT:
 *   1. Validate the URL (not empty, is a string, starts with http)
 *   2. Parse the URL to get the hostname: new URL(url).hostname
 *   3. Detect platform:
 *      - If hostname includes 'amazon.in' → call scrapeAmazon(url)
 *      - If hostname includes 'flipkart.com' → call scrapeFlipkart(url)
 *      - Otherwise → throw new Error(`Unsupported platform: ${hostname}`)
 *   4. Return the result from the platform-specific scraper
 *
 * @param {string} url - Amazon.in or Flipkart.com product URL
 * @returns {Promise<Object>} - Structured product object (see shape above)
 * @throws {Error} - If URL is invalid, platform unsupported, or scraping fails
 */
async function extractProduct(url) {
  // Shoaib: implement platform detection and routing here

  /*
   * PLACEHOLDER:
   * Platform detection example:
   *
   *   const hostname = new URL(url).hostname;
   *
   *   if (hostname.includes('amazon.in')) {
   *     return await scrapeAmazon(url);
   *   } else if (hostname.includes('flipkart.com')) {
   *     return await scrapeFlipkart(url);
   *   } else {
   *     throw new Error(`Unsupported platform. Use Amazon.in or Flipkart.com`);
   *   }
   */

  // Return empty shape so the file is importable without crashing (Phase 1)
  return {
    name:          '',
    platform:      '',
    originalPrice: 0,
    currency:      'INR',
    imageUrl:      '',
    category:      '',
    dimensions: {
      raw:      '',
      lengthCm: 0,
      widthCm:  0,
      heightCm: 0,
    },
    productUrl: url,
    fetchedAt:  new Date().toISOString(),
  };
}


// ---------------------------------------------------------------------------
// PLATFORM-SPECIFIC SCRAPERS
// ---------------------------------------------------------------------------

/**
 * scrapeAmazon(url)
 *
 * WHAT TO IMPLEMENT:
 *   1. Fetch HTML: const res = await axios.get(url, { headers: SCRAPE_HEADERS, timeout: REQUEST_TIMEOUT_MS })
 *   2. Load into Cheerio: const $ = cheerio.load(res.data)
 *   3. Extract fields using CSS selectors (see data-service/README.md for selectors)
 *   4. Parse price string to a number: remove '₹', commas → parseFloat()
 *   5. Parse dimensions string → call parseDimensions(rawDimStr)
 *   6. Detect category → call detectCategory(productName)
 *   7. Get GLB URL from PRODUCT_CATEGORIES[category].defaultGlbUrl
 *   8. Return structured product object
 *
 * @param {string} url
 * @returns {Promise<Object>}
 */
async function scrapeAmazon(url) {
  // Shoaib: implement Amazon scraping here
}

/**
 * scrapeFlipkart(url)
 *
 * Same structure as scrapeAmazon — just different CSS selectors.
 * See data-service/README.md for Flipkart selectors.
 *
 * @param {string} url
 * @returns {Promise<Object>}
 */
async function scrapeFlipkart(url) {
  // Shoaib: implement Flipkart scraping here
}


// ---------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * parseDimensions(rawString)
 *
 * PURPOSE:
 *   Converts a raw dimensions string into a structured object.
 *
 * EXAMPLES:
 *   parseDimensions("210 x 85 x 90 cm (L x W x H)")
 *   → { raw: "210 x 85 x 90 cm (L x W x H)", lengthCm: 210, widthCm: 85, heightCm: 90 }
 *
 *   parseDimensions("85.0 x 210.0 x 90.0 Centimeters")
 *   → { raw: "...", lengthCm: 210, widthCm: 85, heightCm: 90 }
 *
 * HINT:
 *   Use a regex to extract all numbers: rawString.match(/[\d.]+/g)
 *   The order (L x W x H) varies by listing — you may need heuristics
 *   (longest = length, middle = width, largest vertical = height for sofas).
 *   For Phase 2, a simple left-to-right assignment is fine.
 *
 * @param {string} rawString - Raw dimensions string from the product page
 * @returns {Object} - { raw, lengthCm, widthCm, heightCm }
 */
function parseDimensions(rawString) {
  // Shoaib: implement dimension parsing here
  return { raw: rawString, lengthCm: 0, widthCm: 0, heightCm: 0 };
}

/**
 * detectCategory(productName)
 *
 * PURPOSE:
 *   Guesses the product category from the product name string.
 *   Returns a key matching the keys in PRODUCT_CATEGORIES (config.js).
 *
 * EXAMPLES:
 *   detectCategory("Wakefit Orthopaedic 3-Seater Sofa") → "sofa"
 *   detectCategory("Nilkamal Wooden Center Table")       → "table"
 *   detectCategory("Unknown Widget Pro Max")             → "sofa" (default)
 *
 * HINT:
 *   Check if the product name (lowercased) contains keywords:
 *   'sofa', 'couch', 'settee' → 'sofa'
 *   'chair', 'recliner'       → 'chair'
 *   'table', 'desk'           → 'table'
 *   'lamp', 'light', 'bulb'   → 'lamp'
 *   'bed', 'mattress'         → 'bed'
 *   Default: 'sofa' (most common in home décor)
 *
 * @param {string} productName
 * @returns {string} - Category key matching PRODUCT_CATEGORIES in config.js
 */
function detectCategory(productName) {
  // Shoaib: implement category detection here
  return 'sofa'; // default placeholder
}


// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------
module.exports = { extractProduct };
