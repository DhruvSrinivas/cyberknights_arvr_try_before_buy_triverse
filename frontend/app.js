/**
 * frontend/app.js — TRIVERSE Application Logic
 * OWNER: Umar
 *
 * RESPONSIBILITIES:
 * - Wire all DOM event listeners
 * - Call backend API endpoints (extractProduct, getPrices)
 * - Update the DOM with product data and prices
 * - Trigger the AR viewer via initARViewer()
 *
 * IMPORTS:
 * - API_BASE_URL from shared/config.js  (backend URL)
 * - initARViewer from ar-engine/ar-engine.js  (AR viewer setup)
 *
 * DO NOT:
 * - Hardcode any URLs or product data
 * - Implement scraping or Firebase logic here
 * - Modify ar-engine.js or data-service files
 */

// ---------------------------------------------------------------------------
// IMPORTS
// ---------------------------------------------------------------------------

/**
 * API_BASE_URL: The base URL for the Firebase Cloud Functions.
 * In local dev: http://127.0.0.1:5001/YOUR_PROJECT_ID/us-central1
 * In production: https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net
 * Value comes from shared/config.js — do NOT hardcode it here.
 */
import { API_BASE_URL } from '../shared/config.js';

/**
 * initARViewer: Atul's function. Injects <model-viewer> into a container div.
 * Signature: initARViewer(glbUrl: string, dimensions: object, containerId: string)
 * See ar-engine/README.md for full details.
 */
import { initARViewer } from '../ar-engine/ar-engine.js';


// ---------------------------------------------------------------------------
// DOM ELEMENT REFERENCES
// ---------------------------------------------------------------------------
// These IDs must match exactly what is in index.html.
// If an ID changes in index.html, update it here too.

const urlInput        = document.getElementById('url-input');         // <input> for product URL
const analyzeBtn      = document.getElementById('analyze-btn');       // "Analyze Product" button
const productCard     = document.getElementById('product-card');      // Product display section
const productName     = document.getElementById('product-name');      // Product name <h2>
const productImage    = document.getElementById('product-image');     // Product <img>
const productPrice    = document.getElementById('product-price');     // Price display
const productCategory = document.getElementById('product-category');  // Category badge
const productPlatform = document.getElementById('product-platform');  // "Found on Amazon India"
const productDims     = document.getElementById('product-dimensions');// Dimensions string
const viewArBtn       = document.getElementById('view-ar-btn');       // "View in AR" button
const pricePanel      = document.getElementById('price-panel');       // Price comparison section
const priceList       = document.getElementById('price-list');        // <ul> for price rows
const arContainer     = document.getElementById('ar-container');      // AR viewer wrapper div
const loadingSpinner  = document.getElementById('loading-spinner');   // Loading indicator
const errorMessage    = document.getElementById('error-message');     // Error display area
const errorText       = document.getElementById('error-text');        // Error text span


// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------
// Umar: you can store the current product data here after fetching it,
// so other functions (displayPrices, AR) can access it without re-fetching.

let currentProduct = null; // Will hold the product JSON after extractProduct succeeds


// ---------------------------------------------------------------------------
// EVENT LISTENERS
// ---------------------------------------------------------------------------

/**
 * "Analyze Product" button click → triggers the full product fetch flow.
 * The URL in #url-input is read and passed to handleUrlSubmit().
 */
analyzeBtn.addEventListener('click', () => {
  const url = urlInput.value.trim();
  handleUrlSubmit(url);
});

/**
 * Also trigger on Enter key press inside the URL input field.
 */
urlInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const url = urlInput.value.trim();
    handleUrlSubmit(url);
  }
});

/**
 * "View in AR" button click → triggers AR viewer with current product data.
 * Only wired after displayProduct() has been called (currentProduct is set).
 */
viewArBtn.addEventListener('click', () => {
  if (!currentProduct) return;

  // TODO (Umar): Remove .hidden from #ar-container before calling initARViewer
  // arContainer.classList.remove('hidden');

  initARViewer(
    currentProduct.glbUrl,       // string: URL to the .glb model
    currentProduct.dimensions,   // object: { lengthCm, widthCm, heightCm, raw }
    'ar-container'               // string: the container div ID
  );
});


// ---------------------------------------------------------------------------
// CORE FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * handleUrlSubmit(url)
 *
 * PURPOSE:
 *   Called when the user submits a product URL.
 *   Validates the URL, shows the spinner, calls the backend extractProduct
 *   endpoint, then calls displayProduct() with the result.
 *   Also triggers the getPrices call → displayPrices().
 *
 * WHAT TO IMPLEMENT:
 *   1. Validate url is not empty — show error if blank
 *   2. Validate url starts with http:// or https:// — show error if invalid
 *   3. Hide any existing error message
 *   4. Hide product card + price panel (reset from previous search)
 *   5. Show loading spinner (.spinner, remove .hidden)
 *   6. POST to `${API_BASE_URL}/extractProduct` with body: { url }
 *      - Set Content-Type: application/json header
 *   7. Parse the JSON response
 *   8. If response has { error: "..." }, call showError(response.error) and return
 *   9. Store result in `currentProduct`
 *  10. Call displayProduct(currentProduct)
 *  11. Call getPrices(currentProduct.name) to fetch and display prices
 *  12. Hide spinner
 *  13. Wrap everything in try/catch — call showError() on any fetch error
 *
 * @param {string} url - The product URL from the input field
 */
async function handleUrlSubmit(url) {
  // Umar: implement this function
}

/**
 * displayProduct(product)
 *
 * PURPOSE:
 *   Renders the product card with data from the backend.
 *   Shows #product-card by removing .hidden.
 *
 * WHAT TO IMPLEMENT:
 *   1. Set productName.textContent = product.name
 *   2. Set productImage.src = product.imageUrl
 *   3. Set productImage.alt = product.name
 *   4. Set productPrice.textContent = formatPrice(product.originalPrice) — e.g. "₹24,999"
 *   5. Set productCategory.textContent = product.category  (or capitalize it)
 *   6. Set productPlatform.textContent = `Found on ${product.platform}`
 *   7. Set productDims.textContent = product.dimensions.raw
 *   8. Remove .hidden from productCard
 *
 * HELPER — you may want a formatPrice() helper:
 *   function formatPrice(amount) {
 *     return '₹' + amount.toLocaleString('en-IN');
 *   }
 *
 * @param {Object} product - Product JSON from the backend (see frontend/README.md for shape)
 */
async function displayProduct(product) {
  // Umar: implement this function
}

/**
 * displayPrices(prices)
 *
 * PURPOSE:
 *   Renders the price comparison panel from the prices array.
 *   Each item in the array is: { platform, price_inr, url, in_stock }
 *
 * WHAT TO IMPLEMENT:
 *   1. Clear priceList.innerHTML = ''
 *   2. Find the lowest price in the array (for highlighting)
 *   3. For each price object, create an <li> element with:
 *      - Platform name
 *      - Price formatted as ₹XX,XXX
 *      - "In Stock" (green) or "Out of Stock" (red) badge
 *      - "Buy Now" link (opens in new tab) to price.url
 *      - Add class .price-panel__item--best if it's the lowest price
 *   4. Append each <li> to priceList
 *   5. Remove .hidden from pricePanel
 *
 * @param {Array} prices - Array of price objects from the backend
 */
async function displayPrices(prices) {
  // Umar: implement this function
}


// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * showError(message)
 *
 * PURPOSE:
 *   Displays an error message below the URL input bar.
 *   Shows #error-message by removing .hidden and sets the error text.
 *   Hides the spinner and product card if visible.
 *
 * Umar: implement this — it will be called from handleUrlSubmit's catch block
 * and from any place that detects a data error.
 *
 * @param {string} message - Human-readable error message
 */
function showError(message) {
  // Umar: implement this helper
}

/**
 * hideError()
 * Clears and hides the error message. Called at the start of a new submission.
 */
function hideError() {
  // Umar: implement this helper
}

/**
 * formatPrice(amount)
 * Formats a number as an Indian Rupee string.
 * Example: formatPrice(24999) → "₹24,999"
 *
 * @param {number} amount
 * @returns {string}
 */
function formatPrice(amount) {
  // Umar: implement — use toLocaleString('en-IN')
}


// ---------------------------------------------------------------------------
// INITIALIZATION
// ---------------------------------------------------------------------------

/**
 * Called once when the page loads.
 * Currently just logs that the app is ready.
 * Umar: add any startup logic here (e.g. check for saved URL in localStorage).
 */
function init() {
  console.log('[TRIVERSE] App initialized. API base:', API_BASE_URL);
  // Umar: add startup logic here if needed
}

init();
