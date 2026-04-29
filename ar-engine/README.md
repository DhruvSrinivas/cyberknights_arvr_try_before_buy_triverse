# ar-engine/ — TRIVERSE WebAR Engine

**Owner: Atul**

---

## Your Responsibilities

You own the 3D viewing and WebAR experience. Your job is to:

1. **Load a GLB model** into a specified container using `<model-viewer>`
2. **Enable AR mode** so users on supported Android devices can place the model in their room
3. **Scale the model to real dimensions** using the `dimensions` object (convert cm → meters)
4. **Handle gesture controls** — rotate, zoom, pan in 3D view
5. **Handle unsupported devices** gracefully — show a fallback message if WebAR isn't available

You do NOT handle scraping, pricing, UI forms, or Firebase. You receive a GLB URL and dimensions, and you make the AR experience work.

---

## What Input You Receive

`frontend/app.js` calls your exported function with exactly this data:

```js
initARViewer(
  glbUrl,       // string: URL to the .glb 3D model file
                // Example: 'https://your-cdn.com/models/sofa-generic.glb'

  dimensions,   // object: real product dimensions from the product data
                // Shape:
                // {
                //   raw: "210 x 85 x 90 cm",     ← human-readable string
                //   lengthCm: 210,                ← number
                //   widthCm:  85,                 ← number
                //   heightCm: 90                  ← number
                // }

  containerId   // string: the ID of the div to inject <model-viewer> into
                // Will always be 'ar-container' from index.html
);
```

---

## What Function You Export

```js
// ar-engine/ar-engine.js
export function initARViewer(glbUrl, dimensions, containerId) {
  // Your implementation goes here.
  // See the function stub in ar-engine.js for guidance.
}
```

This is the ONLY function you need to export. The frontend imports and calls it directly.

---

## Key Implementation Notes

### Scaling
`<model-viewer>` uses meters. Product dimensions come in centimeters.
Convert like this:
```js
const scaleFactor = dimensions.lengthCm / 100; // 210 cm → 2.1 m
```
You may need to set the `scale` attribute on `<model-viewer>`:
```js
viewer.setAttribute('scale', `${scaleX} ${scaleY} ${scaleZ}`);
// Or use CSS transforms if the model's internal scale is known
```

### AR Mode
`<model-viewer>` enables AR on Android Chrome (WebXR) automatically when you add:
```html
<model-viewer ar ar-modes="webxr scene-viewer quick-look" ...>
```

On iOS: use `ar-modes="quick-look"` with a `.usdz` file (Phase 4 goal).
On desktop: AR button should be hidden or disabled with a tooltip.

### Useful `<model-viewer>` Attributes
```html
<model-viewer
  src="..."
  alt="Product 3D Model"
  ar
  ar-modes="webxr scene-viewer quick-look"
  camera-controls
  auto-rotate
  shadow-intensity="1"
  exposure="1"
  style="width: 100%; height: 400px;"
>
```

---

## Files You Own

| File | Purpose |
|------|---------|
| `ar-viewer.html` | Standalone test page — use this to test without the full frontend |
| `ar-engine.js` | The exported `initARViewer()` function |

---

## How to Test Locally

Open `ar-viewer.html` directly in Chrome. No server needed.
For AR mode, you'll need an Android device. Use Chrome DevTools → Remote Debugging
or serve over HTTPS (required for WebXR):

```bash
# Serve with HTTPS using a quick tool (install once):
npx serve . --ssl-cert ... 
# Or use ngrok:
ngrok http 3000
```

---

## Useful Resources
- [`<model-viewer>` docs](https://modelviewer.dev/)
- [WebXR Device API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)
- [Free GLB models for testing](https://modelviewer.dev/examples/webxr/)
- [Sketchfab](https://sketchfab.com/search?features=downloadable&type=models) — free GLB downloads
