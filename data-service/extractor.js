/**
 * data-service/extractor.js — TRIVERSE Product Data Extractor
 * OWNER: Shoaib
 *
 * NOTE: Amazon and Flipkart block direct server-side scraping (bot detection).
 * This file attempts real scraping first. If the site blocks us (no product
 * name extracted), it falls back to realistic mock data so the demo works.
 *
 * For production: replace scraping with the official affiliate APIs.
 */

// ---------------------------------------------------------------------------
// IMPORTS
// ---------------------------------------------------------------------------
const axios   = require('axios');
const cheerio = require('cheerio');
const { SUPPORTED_PLATFORMS, PRODUCT_CATEGORIES } = require('../shared/config.js');

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------
const SCRAPE_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-IN,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
};

const REQUEST_TIMEOUT_MS = 12000;

// ---------------------------------------------------------------------------
// MOCK DATA — used when scraping is blocked (hackathon demo fallback)
// ---------------------------------------------------------------------------
const MOCK_PRODUCTS = {
  'amazon.in': {
    name: 'Wakefit Orthopaedic Memory Foam 3-Seater Sofa (Space Grey)',
    platform: 'Amazon India',
    originalPrice: 24999,
    currency: 'INR',
    // Using Wikipedia Commons image (no hotlink protection)
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Soffa_grupp_p%C3%A5_Ikea.jpg/640px-Soffa_grupp_p%C3%A5_Ikea.jpg',
    category: 'sofa',
    dimensions: {
      raw: '210 x 85 x 90 cm (L x W x H)',
      lengthCm: 210,
      widthCm: 85,
      heightCm: 90,
    },
    glbUrl: PRODUCT_CATEGORIES.sofa.defaultGlbUrl,
    productUrl: '',
  },
  'flipkart.com': {
    name: 'Nilkamal Wooden 3-Seater Fabric Sofa (Beige)',
    platform: 'Flipkart',
    originalPrice: 19999,
    currency: 'INR',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Soffa_grupp_p%C3%A5_Ikea.jpg/640px-Soffa_grupp_p%C3%A5_Ikea.jpg',
    category: 'sofa',
    dimensions: {
      raw: '190 x 80 x 85 cm (L x W x H)',
      lengthCm: 190,
      widthCm: 80,
      heightCm: 85,
    },
    glbUrl: PRODUCT_CATEGORIES.sofa.defaultGlbUrl,
    productUrl: '',
  },
};

// ---------------------------------------------------------------------------
// MAIN EXPORTED FUNCTION
// ---------------------------------------------------------------------------
async function extractProduct(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    throw new Error('Invalid URL: must be a non-empty string starting with http.');
  }

  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch {
    throw new Error(`Malformed URL: ${url}`);
  }

  let platformKey = null;
  if (hostname.includes('amazon.in') || hostname.includes('amazon.com')) {
    platformKey = 'amazon.in';
  } else if (hostname.includes('flipkart.com')) {
    platformKey = 'flipkart.com';
  } else {
    throw new Error(`Unsupported platform: ${hostname}. Use Amazon.in or Flipkart.com`);
  }

  // Try real scraping first
  try {
    const result = platformKey === 'amazon.in'
      ? await scrapeAmazon(url)
      : await scrapeFlipkart(url);

    // If scraping succeeded and we got a name, return real data
    if (result && result.name) {
      console.log(`[extractor] Real scrape succeeded for ${url}`);
      return { ...result, productUrl: url };
    }
  } catch (err) {
    console.warn(`[extractor] Real scrape failed (${err.message}), using mock data`);
  }

  // Fallback: return mock data with the actual URL attached
  console.log(`[extractor] Returning mock data for ${platformKey}`);
  const mock = MOCK_PRODUCTS[platformKey];
  return {
    ...mock,
    productUrl: url,
    fetchedAt: new Date().toISOString(),
  };
}


// ---------------------------------------------------------------------------
// PLATFORM-SPECIFIC SCRAPERS
// ---------------------------------------------------------------------------
async function scrapeAmazon(url) {
  const res = await axios.get(url, {
    headers: SCRAPE_HEADERS,
    timeout: REQUEST_TIMEOUT_MS,
  });

  const $ = cheerio.load(res.data);

  const name = $('#productTitle').text().trim();
  if (!name) {
    throw new Error('Amazon blocked the request or page structure changed.');
  }

  let priceStr =
    $('.a-price-whole').first().text().trim() ||
    $('#priceblock_ourprice').text().trim() ||
    $('#priceblock_dealprice').text().trim() ||
    '';
  const originalPrice = parsePriceString(priceStr);

  const imageUrl =
    $('#imgTagWrappingLink img').attr('src') ||
    $('#landingImage').attr('src') ||
    $('#main-image').attr('src') ||
    '';

  let rawDimStr = '';
  $('#productDetails_techSpec_section_1 tr, #productDetails_db_sections tr, #detailBullets_feature_div li').each((_, el) => {
    const text = $(el).text();
    if (/dimensions|size/i.test(text)) {
      rawDimStr = $(el).find('td').text().trim() || text.replace(/.*dimensions.*?:/i, '').trim();
      return false;
    }
  });
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
  const category = detectCategory(name);

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

async function scrapeFlipkart(url) {
  const res = await axios.get(url, {
    headers: SCRAPE_HEADERS,
    timeout: REQUEST_TIMEOUT_MS,
  });

  const $ = cheerio.load(res.data);

  const name =
    $('h1._35KyD6').text().trim() ||
    $('h1.B_NuCI').text().trim()  ||
    $('h1.yhB1nd').text().trim()  ||
    $('span.B_NuCI').text().trim() ||
    $('h1').first().text().trim() ||
    '';
  if (!name) {
    throw new Error('Flipkart blocked the request or page structure changed.');
  }

  const priceStr =
    $('div._30jeq3').first().text().trim() ||
    $('div._16Jk6d').first().text().trim() ||
    '';
  const originalPrice = parsePriceString(priceStr);

  const imageUrl =
    $('div._396cs4 img').attr('src') ||
    $('div.CXW8mj img').attr('src') ||
    $('img._396cs4').attr('src')    ||
    '';

  let rawDimStr = '';
  $('table._14cfVK tr, div._3npa0d, div.RmoJPd').each((_, el) => {
    const text = $(el).text();
    if (/dimensions|size/i.test(text)) {
      rawDimStr = $(el).find('td').last().text().trim() || text.trim();
      return false;
    }
  });

  const dimensions = parseDimensions(rawDimStr);
  const category = detectCategory(name);
  const glbUrl   = (PRODUCT_CATEGORIES[category] || PRODUCT_CATEGORIES.sofa).defaultGlbUrl;

  return {
    name,
    platform: SUPPORTED_PLATFORMS['flipkart.com'],
    originalPrice,
    currency: 'INR',
    imageUrl,
    category,
    dimensions,
    glbUrl,
    productUrl: url,
    fetchedAt: new Date().toISOString(),
  };
}


// ---------------------------------------------------------------------------
// UTILITY FUNCTIONS
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

function parseDimensions(rawString) {
  if (!rawString) {
    return { raw: '', lengthCm: 0, widthCm: 0, heightCm: 0 };
  }

  const nums = (rawString.match(/[\d.]+/g) || []).map(Number).filter(n => !isNaN(n));

  if (nums.length < 3) {
    return {
      raw: rawString,
      lengthCm: nums[0] || 0,
      widthCm:  nums[1] || 0,
      heightCm: nums[2] || 0,
    };
  }

  const [a, b, c] = nums;
  return { raw: rawString, lengthCm: a, widthCm: b, heightCm: c };
}

function detectCategory(productName) {
  const lower = (productName || '').toLowerCase();
  if (/sofa|couch|settee|loveseat/.test(lower))        return 'sofa';
  if (/chair|recliner|stool|ottoman/.test(lower))      return 'chair';
  if (/table|desk|console|counter/.test(lower))        return 'table';
  if (/lamp|light|bulb|lantern|chandelier/.test(lower)) return 'lamp';
  if (/bed|mattress|cot|bunk/.test(lower))             return 'bed';
  return 'sofa';
}


// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------
module.exports = { extractProduct };
