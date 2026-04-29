/**
 * ar-engine/ar-engine.js — TRIVERSE WebAR Engine
 * OWNER: Atul  |  Implemented by Dhruv (hackathon fallback)
 *
 * EXPORTS:
 *   initARViewer(glbUrl, dimensions, containerId)
 *
 * DEPENDENCIES:
 *   <model-viewer> Web Component (loaded via CDN in index.html — do NOT move it)
 */

// Default GLB to use when the product has no glbUrl set yet.
// This is the Google model-viewer sample model — replace with real product GLBs in Phase 3.
const DEFAULT_GLB = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
//https://www.amazon.in/Wakefit-Orthopaedic-Fabric-Seater-Space/dp/B0BD8N9QJ6
/**
 * initARViewer(glbUrl, dimensions, containerId)
 *
 * Creates and injects a <model-viewer> element into the specified container.
 * Sets the GLB source, scale from real product dimensions, and all AR attributes.
 * Called by frontend/app.js when the user clicks "View in AR".
 *
 * @param {string} glbUrl       - URL to the .glb 3D model file (can be empty → uses default)
 * @param {Object} dimensions   - { raw, lengthCm, widthCm, heightCm }
 * @param {string} containerId  - ID of the container div (without '#')
 */
export function initARViewer(glbUrl, dimensions, containerId) {
  console.log('[AR Engine] initARViewer called');
  console.log('[AR Engine] GLB URL:', glbUrl);
  console.log('[AR Engine] Dimensions:', dimensions);
  console.log('[AR Engine] Container ID:', containerId);

  // ── Step 1: Get container ──────────────────────────────────────────────────
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[AR Engine] Container #${containerId} not found in DOM.`);
    return;
  }

  // ── Step 2: Clear previous viewer ─────────────────────────────────────────
  container.innerHTML = '';

  // ── Step 3: Resolve GLB URL ────────────────────────────────────────────────
  const modelSrc = (glbUrl && glbUrl.startsWith('http')) ? glbUrl : DEFAULT_GLB;

  // ── Step 4: Create <model-viewer> element ──────────────────────────────────
  const viewer = document.createElement('model-viewer');

  // Required attributes
  viewer.setAttribute('src', modelSrc);
  viewer.setAttribute('alt', 'Product 3D Model — view in your room with AR');
  viewer.setAttribute('camera-controls', '');
  viewer.setAttribute('auto-rotate', '');
  viewer.setAttribute('ar', '');
  viewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
  viewer.setAttribute('shadow-intensity', '1');
  viewer.setAttribute('exposure', '0.8');
  viewer.setAttribute('loading', 'eager');

  // ── Step 5: AR Scaling & Quality ───────────────────────────────────────────
  // We remove the manual scale override because proper GLB models are already true-to-scale.
  // Instead, we let WebXR handle the real-world sizing automatically.
  viewer.setAttribute('ar-scale', 'auto');
  viewer.setAttribute('environment-image', 'neutral'); // Improves lighting and reflections
  viewer.setAttribute('shadow-softness', '1.5');
  viewer.setAttribute('camera-orbit', '45deg 55deg 2.5m'); // Better default camera angle

  // ── Step 6: Size the viewer ────────────────────────────────────────────────
  viewer.style.width = '100%';
  viewer.style.height = '420px';
  viewer.style.background = 'transparent';
  viewer.style.borderRadius = '12px';

  // ── Step 7: Custom AR button ───────────────────────────────────────────────
  const arBtn = document.createElement('button');
  arBtn.setAttribute('slot', 'ar-button');
  arBtn.textContent = '📱 Place In My Room';
  arBtn.style.cssText = `
    background: linear-gradient(135deg, #6c63ff, #3ecf8e);
    color: white;
    border: none;
    border-radius: 24px;
    padding: 12px 24px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 4px 16px rgba(108,99,255,0.4);
  `;
  viewer.appendChild(arBtn);

  // ── Step 8: AR not-supported fallback message ──────────────────────────────
  const fallback = document.createElement('div');
  fallback.setAttribute('slot', 'ar-failure');
  fallback.style.cssText = `
    padding: 8px 16px;
    background: rgba(255,100,100,0.15);
    border-radius: 8px;
    color: #ff6b6b;
    font-size: 13px;
    text-align: center;
    margin-top: 8px;
  `;
  fallback.textContent = 'AR is not available on this device. You can still view the 3D model above.';
  viewer.appendChild(fallback);

  // ── Step 9: Error handling ─────────────────────────────────────────────────
  viewer.addEventListener('error', (e) => {
    console.error('[AR Engine] model-viewer load error:', e.detail);
    container.innerHTML = `
      <div style="padding:24px;text-align:center;color:#ff6b6b;background:rgba(255,107,107,0.1);border-radius:12px;">
        <p>⚠️ Could not load 3D model.</p>
        <small>The model file may be unavailable or the format is unsupported.</small>
      </div>
    `;
  });

  viewer.addEventListener('load', () => {
    console.log('[AR Engine] Model loaded successfully');
  });

  // ── Step 10: Inject into DOM ───────────────────────────────────────────────
  container.classList.remove('hidden');
  container.appendChild(viewer);

  console.log('[AR Engine] model-viewer injected into #' + containerId);
}
