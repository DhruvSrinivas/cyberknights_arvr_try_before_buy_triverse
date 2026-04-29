# data-service/ — TRIVERSE Product Data & Price Extraction

**Owner: Shoaib**

---

## Your Responsibilities

You own all data extraction and price comparison logic. Your job is to:

1. **Detect the platform** from a given URL (Amazon, Flipkart, etc.)
2. **Scrape product data** from Amazon.in and Flipkart using Axios + Cheerio
3. **Parse the dimensions string** into a structured `dimensions` object
4. **Fetch price comparisons** across platforms for a given product name
5. **Return well-typed JSON** matching the exact shape the backend expects

You do NOT handle UI, Firebase writes, or 3D models. You export two async functions:
- `extractProduct(url)` → product data object
- `getPrices(productName)` → array of platform prices

---

## What JSON Shape You Must Return

### `extractProduct(url)` — Success Response
```json
{
  "name": "Wakefit Orthopaedic Memory Foam Sofa",
  "platform": "Amazon India",
  "originalPrice": 24999,
  "currency": "INR",
  "imageUrl": "https://m.media-amazon.com/images/I/...",
  "category": "sofa",
  "dimensions": {
    "raw": "210 x 85 x 90 cm (L x W x H)",
    "lengthCm": 210,
    "widthCm": 85,
    "heightCm": 90
  },
  "productUrl": "https://www.amazon.in/dp/XXXXXX",
  "fetchedAt": "2024-01-15T10:30:00.000Z"
}
```

### `extractProduct(url)` — Error Response
Throw an Error with a descriptive message. The backend will catch it and forward it.
```js
throw new Error('Could not extract product. Amazon may have blocked the request.');
```

### `getPrices(productName)` — Response
```json
[
  {
    "platform": "Amazon India",
    "price_inr": 24999,
    "url": "https://www.amazon.in/s?k=...",
    "in_stock": true
  },
  {
    "platform": "Flipkart",
    "price_inr": 23499,
    "url": "https://www.flipkart.com/search?q=...",
    "in_stock": true
  }
]
```

---

## Install Instructions

Run this once from the `data-service/` directory:

```bash
npm init -y
npm install axios cheerio
```

This creates `package.json` and `node_modules/` in `data-service/`.
The backend's `functions/index.js` will `require()` your files.

---

## Amazon Scraping Notes

Amazon aggressively blocks bots. Strategies to handle this:
1. **Set a realistic User-Agent header** in every Axios request:
   ```js
   headers: {
     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
   }
   ```
2. **Add a delay** between requests if fetching multiple URLs
3. **Use Amazon's Product Advertising API** if scraping keeps failing (ask Dhruv for credentials)
4. **Cache aggressively** — the backend caches for 24h so you don't re-scrape the same URL

### Useful Cheerio Selectors for Amazon
```js
// Product title
$('#productTitle').text().trim()

// Price
$('.a-price-whole').first().text()

// Main image
$('#imgTagWrappingLink img').attr('src')

// Product details table (dimensions live here)
$('#productDetails_techSpec_section_1 tr')
  .filter((_, el) => $(el).find('th').text().includes('Dimensions'))
  .find('td').text()
```

---

## Flipkart Scraping Notes

Flipkart is more scraping-friendly but renders some content with JS.
For Phase 2, start with static HTML extraction:
```js
// Product title
$('._35KyD6').text()   // Note: Flipkart changes class names frequently

// Price  
$('._30jeq3').text()

// Dimensions are usually in a spec table
$('._3npa0d').filter((_, el) => $(el).text().includes('Dimensions'))
```

**Important:** Flipkart class names change often. Test your selectors manually before committing.

---

## Files You Own

| File | Purpose |
|------|---------|
| `extractor.js` | Platform detection + scraping logic |
| `priceCompare.js` | Cross-platform price fetching |

---

## How to Test Locally

```bash
# Test extractor with a real URL
node -e "
  const { extractProduct } = require('./extractor.js');
  extractProduct('https://www.amazon.in/dp/B08XYZ123')
    .then(p => console.log(JSON.stringify(p, null, 2)))
    .catch(err => console.error(err.message));
"

# Test price comparison
node -e "
  const { getPrices } = require('./priceCompare.js');
  getPrices('Wakefit Orthopaedic Memory Foam Sofa')
    .then(prices => console.log(JSON.stringify(prices, null, 2)));
"
```
