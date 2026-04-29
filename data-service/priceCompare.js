/**
 * data-service/priceCompare.js — TRIVERSE Price Comparison Service
 * OWNER: Shoaib
 *
 * NOTE: Amazon and Flipkart block server-side scraping (bot detection).
 * This file attempts real scraping first. If blocked, it returns realistic
 * mock price data so the hackathon demo works end-to-end.
 *
 * For production: replace with the official affiliate/partner APIs.
 */

// ---------------------------------------------------------------------------
// IMPORTS
// ---------------------------------------------------------------------------
const axios   = require('axios');
const cheerio = require('cheerio');
const { SUPPORTED_PLATFORMS } = require('../shared/config.js');

const SCRAPE_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-IN,en;q=0.9',
};

const REQUEST_TIMEOUT_MS = 12000;

// ---------------------------------------------------------------------------
// MOCK PRICES — realistic fallback when scraping is blocked
// ---------------------------------------------------------------------------
function getMockPrices(productName) {
  const lower = (productName || '').toLowerCase();

  // Pick a base price based on category keywords
  let base = 24999;
  if (/chair|stool/.test(lower)) base = 8999;
  else if (/table|desk/.test(lower)) base = 14999;
  else if (/lamp|light/.test(lower)) base = 3499;
  else if (/bed|mattress/.test(lower)) base = 19999;

  // Add slight variation between platforms
  const amazonPrice   = base;
  const flipkartPrice = Math.round(base * 0.96); // Flipkart is slightly cheaper in mock

  return [
    {
      platform:  SUPPORTED_PLATFORMS['flipkart.com'],
      price_inr: flipkartPrice,
      url:       `https://www.flipkart.com/search?q=${encodeURIComponent(productName)}`,
      in_stock:  true,
    },
    {
      platform:  SUPPORTED_PLATFORMS['amazon.in'],
      price_inr: amazonPrice,
      url:       `https://www.amazon.in/s?k=${encodeURIComponent(productName)}`,
      in_stock:  true,
    },
  ].sort((a, b) => a.price_inr - b.price_inr);
}


// ---------------------------------------------------------------------------
// MAIN EXPORTED FUNCTION
// ---------------------------------------------------------------------------
async function getPrices(productName) {
  if (!productName || typeof productName !== 'string') {
    return [];
  }

  // Try real scraping in parallel
  const results = await Promise.allSettled([
    searchAmazon(productName),
    searchFlipkart(productName),
  ]);

  const prices = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)
    .filter(Boolean);

  // Log failures
  results
    .filter(r => r.status === 'rejected')
    .forEach(r => console.warn('[priceCompare] Platform search failed:', r.reason?.message));

  // If we got at least one real result, use real data
  if (prices.length > 0) {
    console.log(`[priceCompare] Got ${prices.length} real price result(s)`);
    return prices.sort((a, b) => a.price_inr - b.price_inr);
  }

  // Both platforms blocked us — return mock data
  console.log('[priceCompare] All platforms blocked scraping, returning mock prices');
  return getMockPrices(productName);
}


// ---------------------------------------------------------------------------
// PLATFORM-SPECIFIC SEARCH FUNCTIONS
// ---------------------------------------------------------------------------
async function searchAmazon(productName) {
  const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(productName)}`;

  const res = await axios.get(searchUrl, {
    headers: SCRAPE_HEADERS,
    timeout: REQUEST_TIMEOUT_MS,
  });

  const $ = cheerio.load(res.data);

  const firstResult = $('[data-component-type="s-search-result"]').first();
  if (!firstResult.length) return null;

  const priceStr = firstResult.find('.a-price-whole').first().text().trim();
  if (!priceStr) return null;

  const price_inr = parsePriceString(priceStr);

  let href =
    firstResult.find('a.a-link-normal.s-no-outline').attr('href') ||
    firstResult.find('h2 a').attr('href') ||
    '';
  const url = href.startsWith('http') ? href : `https://www.amazon.in${href}`;

  return {
    platform: SUPPORTED_PLATFORMS['amazon.in'],
    price_inr,
    url,
    in_stock: price_inr > 0,
  };
}

async function searchFlipkart(productName) {
  const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(productName)}`;

  const res = await axios.get(searchUrl, {
    headers: SCRAPE_HEADERS,
    timeout: REQUEST_TIMEOUT_MS,
  });

  const $ = cheerio.load(res.data);

  const priceStr =
    $('div._30jeq3').first().text().trim() ||
    $('div._25b18c ._30jeq3').first().text().trim() ||
    '';

  if (!priceStr) return null;

  const price_inr = parsePriceString(priceStr);

  let href =
    $('a._1fQZEK').first().attr('href') ||
    $('a.s1Q9rs').first().attr('href')  ||
    $('div._4rR01T a').first().attr('href') ||
    '';
  const url = href ? `https://www.flipkart.com${href}` : searchUrl;

  return {
    platform: SUPPORTED_PLATFORMS['flipkart.com'],
    price_inr,
    url,
    in_stock: price_inr > 0,
  };
}


// ---------------------------------------------------------------------------
// UTILITY
// ---------------------------------------------------------------------------
function parsePriceString(priceStr) {
  if (!priceStr) return 0;
  const cleaned = priceStr
    .replace(/\bINR\b\s*/gi, '')
    .replace(/Rs\.?\s*/gi, '')
    .replace(/[₹]/g, '')
    .replace(/,(?=\d{3}(?!\d))/g, '')
    .replace(/\s+/g, '')
    .trim();
  const value = parseFloat(cleaned);
  return isNaN(value) ? 0 : Math.round(value);
}


// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------
module.exports = { getPrices };
