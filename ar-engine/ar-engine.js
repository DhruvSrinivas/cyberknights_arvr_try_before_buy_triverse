/**
 * ar-engine/ar-engine.js — TRIVERSE WebAR Engine
 * OWNER: Atul
 *
 * EXPORTS:
 *   initARViewer(glbUrl, dimensions, containerId)
 *
 * DEPENDENCIES:
 *   - <model-viewer> Web Component (loaded via CDN in index.html)
 *   - No npm packages needed — model-viewer is a CDN script
 *
 * HOW THIS IS CALLED (from frontend/app.js):
 *   import { initARViewer } from '../ar-engine/ar-engine.js';
 *
 *   initARViewer(
 *     product.glbUrl,       // e.g. 'https://cdn.example.com/models/sofa.glb'
 *     product.dimensions,   // { raw, lengthCm, widthCm, heightCm }
 *     'ar-container'        // ID of the div in index.html
 *   );
 */


/**
 * initARViewer
 *
 * PURPOSE:
 *   Creates and injects a <model-viewer> element into the specified container div.
 *   Sets the GLB source, scale (from real dimensions), and AR attributes.
 *   Called by frontend/app.js after product data is fetched.
 *
 * WHAT TO IMPLEMENT (Atul — fill in the function body):
 *
 *   Step 1 — Get the container element:
 *     const container = document.getElementById(containerId);
 *     If container is null, log an error and return early.
 *
 *   Step 2 — Clear any previous model-viewer in the container:
 *     container.innerHTML = '';
 *
 *   Step 3 — Create a <model-viewer> element:
 *     const viewer = document.createElement('model-viewer');
 *
 *   Step 4 — Set required attributes:
 *     viewer.setAttribute('src', glbUrl);
 *     viewer.setAttribute('alt', 'Product 3D Model');
 *     viewer.setAttribute('camera-controls', '');
 *     viewer.setAttribute('auto-rotate', '');
 *     viewer.setAttribute('ar', '');
 *     viewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
 *     viewer.setAttribute('shadow-intensity', '1');
 *
 *   Step 5 — Set real-world scale from dimensions:
 *     Dimensions come in cm. model-viewer uses meters.
 *     Convert: scaleX = dimensions.lengthCm / 100
 *              scaleY = dimensions.heightCm / 100
 *              scaleZ = dimensions.widthCm  / 100
 *
 *     IMPORTANT: model-viewer `scale` is relative to the model's native size.
 *     If the GLB is already 1m tall and the product is 90cm, you need scale < 1.
 *     You'll need to know the native size of the GLB to calculate the right scale.
 *     For Phase 3, coordinate with Shoaib on what GLB file maps to what category,
 *     and document the native size of each GLB in the PRODUCT_CATEGORIES config.
 *
 *     For now, a simple approach:
 *     viewer.setAttribute('scale', `${scaleX} ${scaleY} ${scaleZ}`);
 *
 *   Step 6 — Set dimensions on the element (for styling):
 *     viewer.style.width = '100%';
 *     viewer.style.height = '400px';
 *
 *   Step 7 — Add an AR button slot (optional, for custom AR button appearance):
 *     const arBtn = document.createElement('button');
 *     arBtn.setAttribute('slot', 'ar-button');
 *     arBtn.textContent = '📱 View in Your Room';
 *     viewer.appendChild(arBtn);
 *
 *   Step 8 — Add error handling:
 *     viewer.addEventListener('error', (e) => {
 *       console.error('[AR Engine] model-viewer error:', e.detail);
 *       // Atul: show a user-friendly error message inside the container
 *     });
 *
 *   Step 9 — Add AR not supported fallback:
 *     <model-viewer> hides the AR button automatically when AR isn't available.
 *     But show a text fallback inside the container for desktop users:
 *     viewer.innerHTML += '<div slot="ar-failure">AR is not available on this device.</div>';
 *
 *   Step 10 — Inject into the DOM:
 *     container.appendChild(viewer);
 *
 * @param {string} glbUrl       - URL to the .glb 3D model file
 * @param {Object} dimensions   - { raw: string, lengthCm: number, widthCm: number, heightCm: number }
 * @param {string} containerId  - ID of the container div (without '#')
 */
export function initARViewer(glbUrl, dimensions, containerId) {
  // Atul: implement this function using the step-by-step guide above.
  // Keep the console.log lines during development — they help with debugging.
  console.log('[AR Engine] initARViewer called');
  console.log('[AR Engine] GLB URL:', glbUrl);
  console.log('[AR Engine] Dimensions:', dimensions);
  console.log('[AR Engine] Container ID:', containerId);
}
