# TRIVERSE — WebAR Try-Before-You-Buy for Home Décor

> Paste a product link. See it in your room. Buy with confidence.

TRIVERSE lets users paste an Amazon or Flipkart product URL, extracts real product details (name, dimensions, image), loads a matched 3D GLB model into WebAR via `<model-viewer>`, and displays a live price comparison panel across platforms.

---

## Team

| Member | Directory | Role |
|--------|-----------|------|
| **Umar** | `frontend/` | UI, URL input, product card, price panel display, AR button |
| **Atul** | `ar-engine/` | `<model-viewer>` setup, GLB loading, WebAR mode, scale from dimensions |
| **Shoaib** | `data-service/` | URL detection, Amazon/Flipkart scraping (Cheerio), price comparison |
| **Dhruv** | `backend/` | Firebase init, Cloud Functions (HTTPS), Firestore, hosting, CORS |

---

## How the 4 Directories Connect

```
User pastes URL
      │
      ▼
[frontend/app.js]  →  POST /extractProduct  →  [backend/functions/index.js]
                                                         │
                                              calls [data-service/extractor.js]
                                                         │
                                              saves result to Firestore
                                                         │
                                              returns product JSON to frontend
      │
      ▼
[frontend/app.js]  →  displayProduct()  →  renders product card
                   →  GET /getPrices    →  [backend/functions/index.js]
                                                         │
                                              calls [data-service/priceCompare.js]
                                                         │
                                              returns prices array
      │
      ▼
[frontend/app.js]  →  displayPrices()  →  renders price panel
                   →  initARViewer()   →  [ar-engine/ar-engine.js]
                                                         │
                                              loads <model-viewer> into #ar-container
                                              sets GLB src + real-world scale
```

**The only cross-directory import allowed is `shared/config.js`.**
All API URLs, Firebase config, and constants live there — nowhere else.

---

## One-Line Setup (per directory)

```bash
# Backend (Dhruv) — installs Firebase CLI + emulator
cd triverse/backend && npm install -g firebase-tools && firebase emulators:start

# Data Service (Shoaib) — installs scraping deps
cd triverse/data-service && npm install axios cheerio

# Frontend (Umar) — open in browser, no build step needed
open triverse/frontend/index.html

# AR Engine (Atul) — standalone test page, open in browser
open triverse/ar-engine/ar-viewer.html
```

---

## Tech Stack

- **Frontend**: Vanilla JS + HTML/CSS (no framework)
- **AR**: [`<model-viewer>`](https://modelviewer.dev/) via CDN
- **Scraping**: Node.js + [Cheerio](https://cheerio.js.org/) + [Axios](https://axios-http.com/)
- **Backend**: Firebase Cloud Functions v2 (Node.js 18)
- **Database**: Firestore (cache product data)
- **Hosting**: Firebase Hosting → serves `frontend/`
