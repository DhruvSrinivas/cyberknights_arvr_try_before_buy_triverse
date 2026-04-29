# frontend/ — TRIVERSE UI Layer

**Owner: Umar**

---

## Your Responsibilities

You own everything the user sees and touches. Your job is to:

1. **Render the URL input bar** — user pastes a product link and hits "Analyze"
2. **Display the product card** — name, image, original price, category badge
3. **Render the price comparison panel** — table/cards of platform prices in ₹
4. **Trigger the AR viewer** — call `initARViewer()` from `ar-engine.js` with the right data
5. **Handle loading and error states** — show `.spinner` while fetching, `.error` on failure

You do NOT handle scraping, Firebase, or 3D model logic. Those come in via the backend API.

---

## What You Receive From the Backend

### From `POST /extractProduct`
The backend returns this JSON shape. Assume it always matches this structure:

```json
{
  "id": "firestore-doc-id-string",
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
  "glbUrl": "https://your-cdn.com/models/sofa-generic.glb",
  "productUrl": "https://www.amazon.in/dp/XXXXXX",
  "fetchedAt": "2024-01-15T10:30:00Z"
}
```

If the extraction fails, the backend returns:
```json
{ "error": "Could not extract product. Check URL and try again." }
```

### From `GET /getPrices?productName=...`
```json
[
  { "platform": "Amazon India", "price_inr": 24999, "url": "https://...", "in_stock": true },
  { "platform": "Flipkart",     "price_inr": 23499, "url": "https://...", "in_stock": true }
]
```

---

## What Functions You Call From ar-engine.js

```js
// Import at top of app.js:
import { initARViewer } from '../ar-engine/ar-engine.js';

// Call when product data is ready:
initARViewer(
  product.glbUrl,          // string: URL to the .glb model file
  product.dimensions,      // object: { lengthCm, widthCm, heightCm }
  'ar-container'           // string: ID of the div in index.html
);
```

You do NOT need to know how `initARViewer` works internally. Just pass the right data.

---

## Files You Own

| File | Purpose |
|------|---------|
| `index.html` | All HTML structure — nav, input, product card, price panel, AR container |
| `styles.css` | All visual design — colors, layout, components |
| `app.js` | All interactivity — event listeners, API calls, DOM updates |

---

## IDs You Must Keep in index.html
These IDs are referenced by `app.js`. Do not rename them:

| ID | Element |
|----|---------|
| `#url-input` | The text input for the product URL |
| `#analyze-btn` | The submit button |
| `#product-card` | The product display section |
| `#price-panel` | The price comparison section |
| `#ar-container` | The div where `<model-viewer>` gets injected |
| `#loading-spinner` | The loading indicator |
| `#error-message` | The error display area |

---

## CSS Classes You Must Style
See `styles.css` for the skeleton. These are the key classes:

- `.navbar` — top navigation bar
- `.url-input` — the input + button group
- `.product-card` — the product display card
- `.price-panel` — price comparison display
- `.ar-container` — the AR viewer wrapper
- `.btn-primary` — main action button style
- `.btn-ar` — the "View in AR" button style
- `.hidden` — utility class to hide elements (`display: none`)
- `.spinner` — loading animation

---

## How to Run Locally

No build step needed. Just open `index.html` in a browser.

For API calls to work, the Firebase emulator must be running:
```bash
cd ../backend && firebase emulators:start
```

Then set `API_BASE_URL` in `shared/config.js` to `http://127.0.0.1:5001/...` (already done by default).
