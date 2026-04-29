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
const { SUPPORTED_PLATFORMS, PRODUCT_CATEGORIES } = require('../shared/config.js');


// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

/**
 * HTTP headers to send with every scraping request.
 * A realistic User-Agent is critical — without it, Amazon returns 503.
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
 * Entry point for product extraction.
 * Detects the platform from the URL, routes to the correct scraper,
 * and returns a structured product object.
 *
 * @param {string} url - Amazon.in or Flipkart.com product URL
 * @returns {Promise<Object>} - Structured product object (see shape above)
 * @throws {Error} - If URL is invalid, platform unsupported, or scraping fails
 */
async function extractProduct(url) {
  // 1. Validate the URL
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    throw new Error('Invalid URL: must be a non-empty string starting with http.');
  }

  // 2. Parse hostname
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch {
    throw new Error(`Malformed URL: ${url}`);
  }

  // 3. Route to the correct platform scraper
  if (hostname.includes('amazon.in')) {
    return await scrapeAmazon(url);
  } else if (hostname.includes('flipkart.com')) {
    return await scrapeFlipkart(url);
  } else {
    throw new Error(`Unsupported platform: ${hostname}. Use Amazon.in or Flipkart.com`);
  }
}


// ---------------------------------------------------------------------------
// PLATFORM-SPECIFIC SCRAPERS
// ---------------------------------------------------------------------------

/**
 * scrapeAmazon(url)
 *
 * Fetches and parses an Amazon India product page.
 *
 * @param {string} url
 * @returns {Promise<Object>}
 */
async function scrapeAmazon(url) {
  let res;
  try {
    res = await axios.get(url, {
      headers: SCRAPE_HEADERS,
      timeout: REQUEST_TIMEOUT_MS,
    });
  } catch (err) {
    throw new Error(`Failed to fetch Amazon page: ${err.message}`);
  }

  const $ = cheerio.load(res.data);

  // --- Product name ---
  const name = $('#productTitle').text().trim();
  if (!name) {
    throw new Error('Could not extract product name. Amazon may have blocked the request or the page structure changed.');
  }

  // --- Price ---
  // Primary: .a-price-whole (e.g. "24,999")
  // Fallback: #priceblock_ourprice, #priceblock_dealprice
  let priceStr =
    $('.a-price-whole').first().text().trim() ||
    $('#priceblock_ourprice').text().trim() ||
    $('#priceblock_dealprice').text().trim() ||
    '';
  const originalPrice = parsePriceString(priceStr);

  // --- Main image ---
  // Try the main high-res image first, fall back to thumbnail
  const imageUrl =
    $('#imgTagWrappingLink img').attr('src') ||
    $('#landingImage').attr('src') ||
    $('#main-image').attr('src') ||
    '';

  // --- Dimensions ---
  // Amazon stores product details in a tech spec table
  let rawDimStr = '';
  $('#productDetails_techSpec_section_1 tr, #productDetails_db_sections tr, #detailBullets_feature_div li').each((_, el) => {
    const text = $(el).text();
    if (/dimensions|size/i.test(text)) {
      // Extract the value cell
      rawDimStr = $(el).find('td').text().trim() ||
                  text.replace(/.*dimensions.*?:/i, '').trim();
      return false; // break
    }
  });

  // Also try the feature bullets (some listings put dimensions there)
  if (!rawDimStr) {
    $('#feature-bullets li').each((_, el) => {
      const text = $(el).text();
      if (/dimensions|size/i.test(text)) {
        rawDimStr = text.trim();
        return false;
      }
    });
  }

  const dimensions = parseDimensions(rawDimStr);

  // --- Category ---
  const category = detectCategory(name);

  // --- Build result ---
  return {
    name,
    platform: SUPPORTED_PLATFORMS['amazon.in'],
    originalPrice,
    currency: 'INR',
    imageUrl,
    category,
    dimensions,
    productUrl: url,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * scrapeFlipkart(url)
 *
 * Fetches and parses a Flipkart product page.
 * Note: Flipkart changes class names frequently — selectors may need updating.
 *
 * @param {string} url
 * @returns {Promise<Object>}
 */
async function scrapeFlipkart(url) {
  let res;
  try {
    res = await axios.get(url, {
      headers: SCRAPE_HEADERS,
      timeout: REQUEST_TIMEOUT_MS,
    });
  } catch (err) {
    throw new Error(`Failed to fetch Flipkart page: ${err.message}`);
  }

  const $ = cheerio.load(res.data);

  // --- Product name ---
  // Flipkart class names: ._35KyD6 or .B_NuCI or h1.yhB1nd
  const name =
    $('h1._35KyD6').text().trim() ||
    $('h1.B_NuCI').text().trim()  ||
    $('h1.yhB1nd').text().trim()  ||
    $('span.B_NuCI').text().trim() ||
    '';
  if (!name) {
    throw new Error('Could not extract product name from Flipkart. The page structure may have changed.');
  }

  // --- Price ---
  // ._30jeq3 (most product pages) or ._16Jk6d (some variants)
  const priceStr =
    $('div._30jeq3').first().text().trim() ||
    $('div._16Jk6d').first().text().trim() ||
    '';
  const originalPrice = parsePriceString(priceStr);

  // --- Main image ---
  // ._396cs4 img or .CXW8mj img
  const imageUrl =
    $('div._396cs4 img').attr('src') ||
    $('div.CXW8mj img').attr('src') ||
    $('img._396cs4').attr('src')    ||
    '';

  // --- Dimensions ---
  let rawDimStr = '';
  // Flipkart spec table rows
  $('table._14cfVK tr, div._3npa0d, div.RmoJPd').each((_, el) => {
    const text = $(el).text();
    if (/dimensions|size/i.test(text)) {
      rawDimStr = $(el).find('td').last().text().trim() || text.trim();
      return false;
    }
  });

  const dimensions = parseDimensions(rawDimStr);

  // --- Category ---
  const category = detectCategory(name);

  return {
    name,
    platform: SUPPORTED_PLATFORMS['flipkart.com'],
    originalPrice,
    currency: 'INR',
    imageUrl,
    category,
    dimensions,
    productUrl: url,
    fetchedAt: new Date().toISOString(),
  };
}


// ---------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * parseDimensions(rawString)
 *
 * Converts a raw dimensions string into a structured object.
 *
 * Examples:
 *   "210 x 85 x 90 cm (L x W x H)" → { raw, lengthCm: 210, widthCm: 85, heightCm: 90 }
 *   "85.0 x 210.0 x 90.0 Centimeters" → same logic, left-to-right
 *
 * @param {string} rawString
 * @returns {{ raw: string, lengthCm: number, widthCm: number, heightCm: number }}
 */
function parseDimensions(rawString) {
  if (!rawString) {
    return { raw: '', lengthCm: 0, widthCm: 0, heightCm: 0 };
  }

  const nums = (rawString.match(/[\d.]+/g) || []).map(Number).filter(n => !isNaN(n));

  if (nums.length < 3) {
    // Can't determine three dimensions — return what we have
    return {
      raw: rawString,
      lengthCm: nums[0] || 0,
      widthCm:  nums[1] || 0,
      heightCm: nums[2] || 0,
    };
  }

  // Check if the string explicitly labels L x W x H order
  // Otherwise just use left-to-right (Phase 2 heuristic)
  const [a, b, c] = nums;
  return {
    raw: rawString,
    lengthCm: a,
    widthCm:  b,
    heightCm: c,
  };
}

/**
 * detectCategory(productName)
 *
 * Guesses the product category from the product name.
 * Returns a key matching PRODUCT_CATEGORIES in shared/config.js.
 *
 * @param {string} productName
 * @returns {string} - Category key
 */
function detectCategory(productName) {
  const lower = (productName || '').toLowerCase();

  if (/sofa|couch|settee|loveseat/.test(lower))  return 'sofa';
  if (/chair|recliner|stool|ottoman/.test(lower)) return 'chair';
  if (/table|desk|console|counter/.test(lower))  return 'table';
  if (/lamp|light|bulb|lantern|chandelier/.test(lower)) return 'lamp';
  if (/bed|mattress|cot|bunk/.test(lower))       return 'bed';

  return 'sofa'; // default — most common home décor product
}


// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------
module.exports = { extractProduct };
