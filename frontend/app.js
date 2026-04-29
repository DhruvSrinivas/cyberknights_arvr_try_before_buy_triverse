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

// API_BASE_URL and PRODUCT_CATEGORIES come from shared/config.js loaded via <script> in index.html
const { API_BASE_URL, PRODUCT_CATEGORIES } = window;

// initARViewer is loaded as a module import below.
// Using a module-level import so it resolves correctly relative to app.js.
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
 * PURPOSE: Validates URL, calls APIs, and updates UI state.
 */
async function handleUrlSubmit(url) {
  // 1. Validation
  if (!url) {
    showError("Please paste a product URL to analyze.");
    return;
  }
  try {
    new URL(url); // basic validity check
  } catch (e) {
    showError("Invalid URL format. Please include http:// or https://");
    return;
  }

  // 2. UI State Reset
  hideError();
  productCard.classList.add('hidden');
  pricePanel.classList.add('hidden');
  arContainer.classList.add('hidden');
  
  // 3. Show Spinner
  loadingSpinner.classList.remove('hidden');

  try {
    // 4. Call /extractProduct
    const extractRes = await fetch(`${API_BASE_URL}/extractProduct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    if (!extractRes.ok) {
      // Read the actual error message from the backend response
      let errMsg = 'Failed to fetch product data.';
      try {
        const errBody = await extractRes.json();
        if (errBody.error) errMsg = errBody.error;
      } catch (_) {}
      throw new Error(errMsg);
    }
    const productData = await extractRes.json();

    if (productData.error) {
      showError(productData.error);
      loadingSpinner.classList.add('hidden');
      return;
    }

    // 5. Success! Save and Display
    currentProduct = productData;
    displayProduct(currentProduct);

    // 6. Fetch Prices asynchronously
    const pricesRes = await fetch(`${API_BASE_URL}/getPrices?productName=${encodeURIComponent(currentProduct.name)}`);
    if (pricesRes.ok) {
      const pricesData = await pricesRes.json();
      if (Array.isArray(pricesData) && pricesData.length > 0) {
        displayPrices(pricesData);
      }
    }
  } catch (error) {
    console.error("Error during extraction:", error);
    showError("An unexpected error occurred while analyzing the product.");
  } finally {
    // 7. Hide Spinner
    loadingSpinner.classList.add('hidden');
  }
}

/**
 * displayProduct(product)
 */
async function displayProduct(product) {
  productName.textContent = product.name || "Unknown Product";
  productImage.src = product.imageUrl || "";
  productImage.alt = product.name || "Product Image";
  productPrice.textContent = formatPrice(product.originalPrice);
  productCategory.textContent = product.category ? product.category.toUpperCase() : "DÉCOR";
  productPlatform.textContent = `Found on ${product.platform}`;
  
  if (product.dimensions && product.dimensions.raw) {
    productDims.textContent = product.dimensions.raw;
  } else {
    productDims.textContent = "Dimensions unknown";
  }

  // Show with fade-in animation
  productCard.classList.remove('hidden');
  productCard.classList.add('fade-in');
}

/**
 * displayPrices(prices)
 */
async function displayPrices(prices) {
  priceList.innerHTML = '';
  
  // Find the lowest price
  let minPrice = Infinity;
  prices.forEach(p => {
    if (p.price_inr < minPrice) minPrice = p.price_inr;
  });

  prices.forEach(priceObj => {
    const isBest = priceObj.price_inr === minPrice;
    const stockClass = priceObj.in_stock ? 'stock-in' : 'stock-out';
    const stockText = priceObj.in_stock ? 'In Stock' : 'Out of Stock';
    const highlightClass = isBest ? 'price-panel__item--best' : '';

    const li = document.createElement('li');
    li.className = `price-panel__item ${highlightClass}`;
    
    li.innerHTML = `
      <span class="price-platform">${priceObj.platform}</span>
      <span class="price-stock ${stockClass}">${stockText}</span>
      <span class="price-amount">${formatPrice(priceObj.price_inr)}</span>
      <a href="${priceObj.url}" target="_blank" rel="noopener noreferrer" class="price-buy-btn">Buy Now</a>
    `;
    priceList.appendChild(li);
  });

  // Show with fade-in animation
  pricePanel.classList.remove('hidden');
  pricePanel.classList.add('fade-in');
}


// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

function showError(message) {
  errorText.textContent = message;
  errorMessage.classList.remove('hidden');
  errorMessage.classList.add('fade-in');
}

function hideError() {
  errorMessage.classList.add('hidden');
  errorMessage.classList.remove('fade-in');
  errorText.textContent = '';
}

function formatPrice(amount) {
  if (!amount || isNaN(amount)) return '₹ --';
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// ---------------------------------------------------------------------------
// INITIALIZATION
// ---------------------------------------------------------------------------

function init() {
  console.log('[TRIVERSE] App initialized. API base:', API_BASE_URL);
  
  // Add fade-in to the initial navbar & hero
  document.querySelector('.navbar').classList.add('fade-in');
  document.querySelector('.hero').classList.add('fade-in');
  
  // Make view AR button show container
  viewArBtn.addEventListener('click', () => {
    if (!currentProduct) return;
    arContainer.classList.remove('hidden');
    // The main event listener is already bound at the top of this file,
    // it will call initARViewer there. We just ensure the container is visible.
    // Wait, the main listener is in this file above, it doesn't remove hidden. Let me just remove hidden here.
  });
}

init();

