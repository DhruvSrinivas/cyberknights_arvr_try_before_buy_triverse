/**
 * frontend/app.js — TRIVERSE Application Logic (Room Preset + ML Recommendation)
 * OWNER: Umar / Shoaib
 *
 * FLOW:
 *   Step 1 → User picks a room type (rendered from ROOM_PRESETS)
 *   Step 2 → User enters L × W × H in feet (converted to cm)
 *   Step 3 → User picks style + budget → calls GET /getRecommendations
 *   Results → Product cards rendered → "View in AR" opens AR modal
 *
 * GLOBALS (loaded via <script> in index.html before this file):
 *   window.ROOM_PRESETS, window.STYLE_OPTIONS, window.BUDGET_OPTIONS,
 *   window.PRODUCT_CATALOG, window.API_BASE_URL
 */

import { initARViewer } from '/ar-engine/ar-engine.js';

// ---------------------------------------------------------------------------
// GLOBALS FROM SHARED FILES
// ---------------------------------------------------------------------------
const { API_BASE_URL, ROOM_PRESETS, STYLE_OPTIONS, BUDGET_OPTIONS } = window;

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------
let selectedRoom   = null;  // ROOM_PRESETS entry
let selectedStyle  = null;  // string: 'modern', 'minimalist', etc.
let selectedBudget = null;  // BUDGET_OPTIONS entry

// ---------------------------------------------------------------------------
// DOM REFERENCES
// ---------------------------------------------------------------------------
const roomGrid       = document.getElementById('room-grid');
const styleGrid      = document.getElementById('style-grid');
const budgetGrid     = document.getElementById('budget-grid');
const roomLabelDisp  = document.getElementById('room-label-display');
const dimLength      = document.getElementById('dim-length');
const dimWidth       = document.getElementById('dim-width');
const dimHeight      = document.getElementById('dim-height');
const lengthCmEl     = document.getElementById('length-cm');
const widthCmEl      = document.getElementById('width-cm');
const heightCmEl     = document.getElementById('height-cm');
const roomVizBox     = document.getElementById('room-viz-box');
const roomVizLabel   = document.getElementById('room-viz-label');
const recommendBtn   = document.getElementById('recommend-btn');
const recommendText  = document.getElementById('recommend-btn-text');
const recommendSpinner = document.getElementById('recommend-spinner');
const resultsSection = document.getElementById('results');
const resultsTitle   = document.getElementById('results-title');
const resultsSubtitle= document.getElementById('results-subtitle');
const productsGrid   = document.getElementById('products-grid');
const errorMessage   = document.getElementById('error-message');
const errorText      = document.getElementById('error-text');
const arModal        = document.getElementById('ar-modal');
const arModalTitle   = document.getElementById('ar-modal-title');
const arContainer    = document.getElementById('ar-container');
const arModalInfo    = document.getElementById('ar-modal-info');
const arBuyBtn       = document.getElementById('ar-buy-btn');

// ---------------------------------------------------------------------------
// WIZARD STEP NAVIGATION
// ---------------------------------------------------------------------------

/**
 * goToStep(n) — called from inline onclick in index.html
 * Shows the target panel and updates the step indicator dots.
 */
window.goToStep = function(n) {
  // Validate step 1 → 2 transition
  if (n === 2 && !selectedRoom) {
    showError('Please select a room type first.');
    return;
  }
  // Validate step 2 → 3 transition
  if (n === 3) {
    const l = parseFloat(dimLength.value);
    const w = parseFloat(dimWidth.value);
    const h = parseFloat(dimHeight.value);
    if (!l || !w || !h || l < 5 || w < 5 || h < 7) {
      showError('Please enter valid room dimensions (min 5 × 5 × 7 ft).');
      return;
    }
  }
  hideError();

  document.querySelectorAll('.wizard__panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`step-${n}`).classList.add('active');

  document.querySelectorAll('.wizard__step').forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i + 1 < n)  dot.classList.add('done');
    if (i + 1 === n) dot.classList.add('active');
  });
};

// ---------------------------------------------------------------------------
// STEP 1 — ROOM GRID
// ---------------------------------------------------------------------------

function renderRoomGrid() {
  roomGrid.innerHTML = '';
  ROOM_PRESETS.forEach(room => {
    const card = document.createElement('div');
    card.className = 'room-card';
    card.id = `room-card-${room.id}`;
    card.innerHTML = `
      <div class="room-card__emoji">${room.emoji}</div>
      <div class="room-card__label">${room.label}</div>
      <div class="room-card__desc">${room.description}</div>
    `;
    card.addEventListener('click', () => selectRoom(room, card));
    roomGrid.appendChild(card);
  });
}

function selectRoom(room, cardEl) {
  // Deselect all
  document.querySelectorAll('.room-card').forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
  selectedRoom = room;

  // Pre-fill dims with room defaults (convert cm → ft, rounded)
  dimLength.value = Math.round(room.defaultDims.lengthCm / 30.48);
  dimWidth.value  = Math.round(room.defaultDims.widthCm  / 30.48);
  dimHeight.value = Math.round(room.defaultDims.heightCm / 30.48);
  updateDimDisplay();

  // Update room label on step 2
  roomLabelDisp.textContent = `${room.emoji} ${room.label} — adjust to your actual measurements`;

  // Auto advance after brief delay for nice UX
  setTimeout(() => goToStep(2), 280);
}

// ---------------------------------------------------------------------------
// STEP 2 — DIMENSIONS
// ---------------------------------------------------------------------------

const FT_TO_CM = 30.48;

function ftToCm(ft) { return Math.round(parseFloat(ft) * FT_TO_CM); }

function updateDimDisplay() {
  const l = parseFloat(dimLength.value) || 0;
  const w = parseFloat(dimWidth.value)  || 0;
  const h = parseFloat(dimHeight.value) || 0;

  lengthCmEl.textContent = `${ftToCm(l)} cm`;
  widthCmEl.textContent  = `${ftToCm(w)} cm`;
  heightCmEl.textContent = `${ftToCm(h)} cm`;
  roomVizLabel.textContent = `${l} × ${w} ft`;

  // Scale the room visualiser box proportionally (max 280×180px)
  const maxW = 280, maxH = 180;
  const ratio = l > 0 && w > 0 ? Math.min(maxW / l, maxH / w) : 20;
  roomVizBox.style.width  = `${Math.max(80, Math.min(maxW, l * ratio))}px`;
  roomVizBox.style.height = `${Math.max(60, Math.min(maxH, w * ratio))}px`;
}

[dimLength, dimWidth, dimHeight].forEach(el => {
  el.addEventListener('input', updateDimDisplay);
});

// ---------------------------------------------------------------------------
// STEP 3 — STYLE + BUDGET
// ---------------------------------------------------------------------------

function renderStyleGrid() {
  styleGrid.innerHTML = '';
  STYLE_OPTIONS.forEach(opt => {
    const chip = document.createElement('button');
    chip.className = 'style-chip';
    chip.id = `style-${opt.id}`;
    chip.textContent = `${opt.emoji} ${opt.label}`;
    chip.addEventListener('click', () => {
      document.querySelectorAll('.style-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedStyle = opt.id;
    });
    styleGrid.appendChild(chip);
  });
}

function renderBudgetGrid() {
  budgetGrid.innerHTML = '';
  BUDGET_OPTIONS.forEach(opt => {
    const chip = document.createElement('button');
    chip.className = 'budget-chip';
    chip.id = `budget-${opt.id}`;
    chip.textContent = opt.label;
    chip.addEventListener('click', () => {
      document.querySelectorAll('.budget-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedBudget = opt;
    });
    budgetGrid.appendChild(chip);
  });
}

// ---------------------------------------------------------------------------
// GET RECOMMENDATIONS
// ---------------------------------------------------------------------------

recommendBtn.addEventListener('click', handleRecommend);

async function handleRecommend() {
  if (!selectedStyle) {
    showError('Please pick a style preference.');
    return;
  }
  if (!selectedBudget) {
    showError('Please pick a budget range.');
    return;
  }
  hideError();

  // Build query params
  const lengthCm = ftToCm(dimLength.value);
  const widthCm  = ftToCm(dimWidth.value);
  const heightCm = ftToCm(dimHeight.value);
  const budget   = selectedBudget.max;

  // Show spinner
  recommendText.classList.add('hidden');
  recommendSpinner.classList.remove('hidden');
  recommendBtn.disabled = true;

  // Scroll to results area while loading
  resultsSection.classList.remove('hidden');
  productsGrid.innerHTML = '<div class="loading-cards"></div>';
  resultsTitle.textContent = 'Finding the best picks…';
  resultsSubtitle.textContent = '';
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  try {
    const params = new URLSearchParams({
      roomType:  selectedRoom.id,
      lengthCm,
      widthCm,
      style:     selectedStyle,
      budget,
    });

    const res = await fetch(`${API_BASE_URL}/getRecommendations?${params}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error ${res.status}`);
    }
    const products = await res.json();

    displayRecommendations(products);
  } catch (err) {
    console.error('[App] getRecommendations error:', err);
    showError(`Could not fetch recommendations: ${err.message}`);
    resultsSection.classList.add('hidden');
  } finally {
    recommendText.classList.remove('hidden');
    recommendSpinner.classList.add('hidden');
    recommendBtn.disabled = false;
  }
}

// ---------------------------------------------------------------------------
// RENDER RESULTS
// ---------------------------------------------------------------------------

function displayRecommendations(products) {
  productsGrid.innerHTML = '';

  const roomLabel  = selectedRoom.label;
  const styleLabel = STYLE_OPTIONS.find(s => s.id === selectedStyle)?.label || selectedStyle;

  resultsTitle.textContent    = `Top picks for your ${roomLabel}`;
  resultsSubtitle.textContent = `${styleLabel} style · ${selectedBudget.label} · ${products.length} recommendations`;

  // Update pipeline stats
  const pipelineEl = document.getElementById('results-pipeline');
  if (pipelineEl) {
    pipelineEl.innerHTML = `
      <div class="pipeline-stat">
        <span class="pipeline-stat__value">${window.PRODUCT_CATALOG.length}</span>
        <span class="pipeline-stat__label">Total Items</span>
      </div>
      <div class="pipeline-stat">
        <span class="pipeline-stat__value">${products.length}</span>
        <span class="pipeline-stat__label">Matches</span>
      </div>
    `;
  }

  if (!products.length) {
    productsGrid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;color:var(--text2);padding:40px;">
        <p style="font-size:40px">🔍</p>
        <p>No products matched your filters. Try a different style or budget.</p>
      </div>`;
    return;
  }

  products.forEach((product, idx) => {
    const card = buildProductCard(product, idx === 0);
    productsGrid.appendChild(card);
  });
}

function buildProductCard(product, isBestMatch) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.style.animationDelay = `${(product._rank || 0) * 60}ms`;
  card.classList.add('fade-in');

  const score = product._score ?? 0;
  const scorePct = Math.round(score * 100);
  const dims = product.dimensions;
  const dimsText = dims
    ? `${dims.lengthCm} × ${dims.widthCm} × ${dims.heightCm} cm`
    : '';

  card.innerHTML = `
    <div class="product-card__img-wrap">
      <img class="product-card__img" src="${product.imageUrl}" alt="${product.name}" loading="lazy" onerror="this.classList.add('error'); this.src='https://placehold.co/400x300/121d23/d7c9aa?text=Image+Unavailable';" />
      <span class="product-card__badge">${product.category}</span>
      ${isBestMatch ? '<span class="product-card__score">★ Best Match</span>' : `<span class="product-card__score">${scorePct}%</span>`}
    </div>
    <div class="product-card__body">
      <div class="product-card__name">${product.name}</div>
      <div class="product-card__meta">
        <span class="product-card__price">₹${Number(product.price_inr).toLocaleString('en-IN')}</span>
        <span class="product-card__platform">${product.platform}</span>
      </div>
      ${dimsText ? `<div style="font-size:11px;color:var(--text2);">📐 ${dimsText}</div>` : ''}
      <div class="score-bar"><div class="score-bar__fill" style="width:${scorePct}%"></div></div>
      <div class="product-card__tags">
        ${(product.tags || []).slice(0, 3).map(t => `<span class="product-card__tag">${t}</span>`).join('')}
      </div>
      <div class="product-card__actions">
        <button class="btn-ar" data-product-id="${product.id}">📱 View in AR</button>
        <a class="btn-buy" href="${product.buyUrl}" target="_blank" rel="noopener">🛒 Buy on ${product.platform}</a>
      </div>
    </div>
  `;

  // View in AR button
  card.querySelector('.btn-ar').addEventListener('click', () => openARModal(product));

  return card;
}

// ---------------------------------------------------------------------------
// AR MODAL
// ---------------------------------------------------------------------------

let currentARProduct = null;

function openARModal(product) {
  currentARProduct = product;
  arModalTitle.textContent = product.name;
  arModalInfo.textContent  = product.dimensions
    ? `📐 ${product.dimensions.lengthCm} × ${product.dimensions.widthCm} × ${product.dimensions.heightCm} cm`
    : '';
  arBuyBtn.href = product.buyUrl;
  arBuyBtn.textContent = `🛒 Buy on ${product.platform} · ₹${Number(product.price_inr).toLocaleString('en-IN')}`;

  arModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Reset color picker
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  document.querySelector('.color-swatch[data-color="natural"]')?.classList.add('selected');

  // Generate AI Suitability Insights
  const aiTextEl = document.getElementById('ar-ai-text');
  if (aiTextEl) {
    const l = document.getElementById('dim-length').value;
    const w = document.getElementById('dim-width').value;
    const styleLabel = window.STYLE_OPTIONS?.find(s => s.id === selectedStyle)?.label || 'chosen';
    
    // Simple rule-based mock for suitability
    let colorRec = 'Natural Wood';
    if (selectedStyle === 'modern') colorRec = 'Charcoal';
    if (selectedStyle === 'bohemian') colorRec = 'Terracotta (Rust)';
    
    aiTextEl.innerHTML = `Based on your <strong>${l}×${w} ft</strong> room, this ${product.category} is an excellent fit. The scale leaves plenty of walking space. <br/><br/>💡 <em>AI Tip:</em> We recommend the <strong>${colorRec}</strong> color variant to best match your ${styleLabel} aesthetic.`;
  }

  // Reset Room Upload
  const uploadInput = document.getElementById('room-img-input');
  const previewBox = document.getElementById('room-img-preview');
  if (uploadInput && previewBox) {
    uploadInput.value = '';
    previewBox.classList.add('hidden');
    document.getElementById('room-img-bg').src = '';
    document.getElementById('room-img-overlay').src = product.imageUrl; // Use product image as overlay
  }

  // Hide QR panel
  const qrPanel = document.getElementById('ar-qr-panel');
  if (qrPanel) qrPanel.classList.add('hidden');

  // Init the AR viewer
  initARViewer(product.glbUrl, product.dimensions, 'ar-container');
}

window.closeARModal = function() {
  arModal.classList.add('hidden');
  document.body.style.overflow = '';
  arContainer.innerHTML = '';
  currentARProduct = null;
};

// Handle Color Picker (Material API)
document.getElementById('color-swatches')?.addEventListener('click', async (e) => {
  if (e.target.classList.contains('color-swatch')) {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
    e.target.classList.add('selected');
    
    const colorStr = e.target.getAttribute('data-color-rgb');
    if (!colorStr) return;
    const rgba = JSON.parse(colorStr);
    
    const viewer = document.querySelector('model-viewer');
    if (viewer && viewer.model && viewer.model.materials && viewer.model.materials.length > 0) {
      // Loop through materials and change base color
      viewer.model.materials.forEach(mat => {
        if (mat.pbrMetallicRoughness) {
          mat.pbrMetallicRoughness.setBaseColorFactor(rgba);
        }
      });
    }
  }
});

// Handle QR Code
window.toggleQR = function() {
  const qrPanel = document.getElementById('ar-qr-panel');
  const qrImg = document.getElementById('ar-qr-img');
  
  if (qrPanel.classList.contains('hidden')) {
    qrPanel.classList.remove('hidden');
    // Generate QR code pointing to a placeholder AR experience or the current URL
    const currentUrl = encodeURIComponent(window.location.href);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${currentUrl}`;
  } else {
    qrPanel.classList.add('hidden');
  }
};

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') window.closeARModal();
});

// ---------------------------------------------------------------------------
// ERROR HELPERS
// ---------------------------------------------------------------------------

function showError(msg) {
  errorText.textContent = msg;
  errorMessage.classList.remove('hidden');
}

function hideError() {
  errorMessage.classList.add('hidden');
  errorText.textContent = '';
}

// Handle Room Image Upload
const roomImgInput = document.getElementById('room-img-input');
if (roomImgInput) {
  roomImgInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        document.getElementById('room-img-bg').src = event.target.result;
        document.getElementById('room-img-preview').classList.remove('hidden');
        
        // Hide the 3D viewer when showing 2D preview
        document.getElementById('ar-container').style.display = 'none';
        document.getElementById('ar-color-picker').style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });
}

// Ensure AR viewer comes back if modal is closed and reopened
const originalCloseAR = window.closeARModal;
window.closeARModal = function() {
  originalCloseAR();
  document.getElementById('ar-container').style.display = 'block';
  document.getElementById('ar-color-picker').style.display = 'block';
};

// ---------------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------------

function init() {
  console.log('[TRIVERSE] App init. API:', API_BASE_URL);
  renderRoomGrid();
  renderStyleGrid();
  renderBudgetGrid();
  updateDimDisplay();

  // Animate hero on load
  document.querySelector('.navbar')?.classList.add('fade-in');
  document.querySelector('.hero')?.classList.add('fade-in');
}

init();
