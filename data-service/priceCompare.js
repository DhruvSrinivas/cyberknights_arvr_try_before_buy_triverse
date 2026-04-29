/**
 * data-service/priceCompare.js — TRIVERSE Price Comparison Service
 * OWNER: Shoaib
 *
 * RESPONSIBILITIES:
 *   - Given a product name, search for it across supported platforms
 *   - Return price data from each platform
 *   - Handle cases where a platform has no results or is unreachable
 *
 * USAGE (from backend/functions/index.js):
 *   const { getPrices } = require('./priceCompare.js');
 *   const prices = await getPrices('Wakefit Orthopaedic Memory Foam Sofa');
 *
 * RETURN SHAPE — the backend and frontend expect this exact array structure:
 * [
 *   {
 *     platform:  string,   // e.g. "Amazon India"
 *     price_inr: number,   // Price in INR as a number (e.g. 24999)
 *     url:       string,   // Direct link to the product/search page
 *     in_stock:  boolean,  // true if the item is available
 *   },
 *   ...
 * ]
 *
 * The array may have 0 items if no prices are found — the frontend handles that.
 * Sort the array by price_inr ascending (lowest price first) before returning.
 */

// ---------------------------------------------------------------------------
// IMPORTS
// ---------------------------------------------------------------------------
const axios   = require('axios');
const cheerio = require('cheerio');

const { SUPPORTED_PLATFORMS } = require('../shared/config.js');

/** Standard scraping headers — same as extractor.js */
const SCRAPE_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'en-IN,en;q=0.9',
};

const REQUEST_TIMEOUT_MS = 10000;


// ---------------------------------------------------------------------------
// MAIN EXPORTED FUNCTION
// ---------------------------------------------------------------------------

/**
 * getPrices(productName)
 *
 * Searches for the product by name on each supported platform
 * and returns price results as a sorted array.
 *
 * Uses Promise.allSettled so that if one platform fails (e.g. Flipkart is
 * down), we still return the results from the others.
 *
 * @param {string} productName - Product name to search for
 * @returns {Promise<Array>} - Array of price objects sorted by price_inr asc
 */
async function getPrices(productName) {
  if (!productName || typeof productName !== 'string') {
    return [];
  }

  const results = await Promise.allSettled([
    searchAmazon(productName),
    searchFlipkart(productName),
  ]);

  const prices = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)
    .filter(Boolean); // remove nulls — platform returned no results

  // Log any failures for debugging
  results
    .filter(r => r.status === 'rejected')
    .forEach(r => console.error('[priceCompare] Platform search failed:', r.reason?.message));

  // Sort ascending by price (lowest first)
  return prices.sort((a, b) => a.price_inr - b.price_inr);
}


// ---------------------------------------------------------------------------
// PLATFORM-SPECIFIC SEARCH FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * searchAmazon(productName)
 *
 * Searches Amazon India and returns the first result's price data.
 *
 * @param {string} productName
 * @returns {Promise<Object|null>}
 */
async function searchAmazon(productName) {
  const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(productName)}`;

  let res;
  try {
    res = await axios.get(searchUrl, {
      headers: SCRAPE_HEADERS,
      timeout: REQUEST_TIMEOUT_MS,
    });
  } catch (err) {
    throw new Error(`Amazon search request failed: ${err.message}`);
  }

  const $ = cheerio.load(res.data);

  // First search result container
  const firstResult = $('[data-component-type="s-search-result"]').first();
  if (!firstResult.length) {
    // No results found for this query
    return null;
  }

  // --- Price ---
  const priceStr = firstResult.find('.a-price-whole').first().text().trim();
  if (!priceStr) {
    // No price means out of stock or sponsored/promoted with no price shown
    return null;
  }
  const price_inr = parsePriceString(priceStr);

  // --- Product link ---
  let href = firstResult.find('a.a-link-normal.s-no-outline').attr('href') ||
             firstResult.find('h2 a').attr('href') ||
             '';
  // Amazon hrefs can be relative (/dp/...) or absolute
  const url = href.startsWith('http')
    ? href
    : `https://www.amazon.in${href}`;

  return {
    platform: SUPPORTED_PLATFORMS['amazon.in'], // "Amazon India"
    price_inr,
    url,
    in_stock: price_inr > 0,
  };
}

/**
 * searchFlipkart(productName)
 *
 * Searches Flipkart and returns the first result's price data.
 * Note: Flipkart blocks scraping more aggressively — results may be unreliable.
 * Consider using Flipkart Affiliate API as a fallback (ask Dhruv for credentials).
 *
 * @param {string} productName
 * @returns {Promise<Object|null>}
 */
async function searchFlipkart(productName) {
  const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(productName)}`;

  let res;
  try {
    res = await axios.get(searchUrl, {
      headers: SCRAPE_HEADERS,
      timeout: REQUEST_TIMEOUT_MS,
    });
  } catch (err) {
    throw new Error(`Flipkart search request failed: ${err.message}`);
  }

  const $ = cheerio.load(res.data);

  // Flipkart search result cards — class names change often, try multiple selectors
  const firstResult =
    $('div._1AtVbE div._2kHMtA').first().parent() ||
    $('div[data-id]').first();

  // --- Price ---
  // ._30jeq3 is the primary price class on search results
  const priceStr =
    $('div._30jeq3').first().text().trim() ||
    $('div._25b18c ._30jeq3').first().text().trim() ||
    '';

  if (!priceStr) {
    return null;
  }
  const price_inr = parsePriceString(priceStr);

  // --- Product link ---
  // First anchor inside a product card, prefixed with Flipkart domain
  let href =
    $('a._1fQZEK').first().attr('href') ||
    $('a.s1Q9rs').first().attr('href')  ||
    $('div._4rR01T a').first().attr('href') ||
    $('a._2rpwqI').first().attr('href') ||
    '';
  const url = href
    ? `https://www.flipkart.com${href}`
    : searchUrl; // fallback to search page

  return {
    platform: SUPPORTED_PLATFORMS['flipkart.com'], // "Flipkart"
    price_inr,
    url,
    in_stock: price_inr > 0,
  };
}


// ---------------------------------------------------------------------------
// UTILITY
// ---------------------------------------------------------------------------

/**
 * parsePriceString(priceStr)
 *
 * Converts "₹24,999" or "24,999.00" or "24999" to the number 24999.
 *
 * @param {string} priceStr
 * @returns {number}
 */
function parsePriceString(priceStr) {
  if (!priceStr) return 0;
  // Step 1: Remove currency symbols (₹, Rs, INR) and whitespace
  // Step 2: Remove commas used as thousands separators (NOT the decimal point)
  // Step 3: Parse as float and round to nearest rupee
  const cleaned = priceStr
    .replace(/\bINR\b\s*/gi, '')     // strip "INR" + any trailing space
    .replace(/Rs\.?\s*/gi, '')       // strip "Rs" / "Rs." + trailing space
    .replace(/[₹]/g, '')            // strip ₹ symbol
    .replace(/,(?=\d{3}(?!\d))/g, '') // remove thousands-separator commas
    .replace(/\s+/g, '')            // remove all remaining whitespace
    .trim();
  const value = parseFloat(cleaned);
  return isNaN(value) ? 0 : Math.round(value);
}


// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------
module.exports = { getPrices };
