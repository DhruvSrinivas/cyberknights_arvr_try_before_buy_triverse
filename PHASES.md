# TRIVERSE — Build Phases

This document defines 4 build phases across 8 weeks.
Each phase has a clear goal, per-member deliverables, a team checkpoint, and a test condition.
**A phase is only "done" when its test condition passes.**

---

## Phase 1 — Static Shell + Working 3D Viewer (Week 1–2)

### Goal
Get the project skeleton running in a browser with a hardcoded 3D model visible.
No real data. No backend calls. Prove the stack works end-to-end visually.

### What Each Member Delivers

| Member | Deliverable |
|--------|-------------|
| **Umar** | `frontend/index.html` fully marked up with all IDs; `styles.css` CSS variables filled in with real color values; static layout renders in browser |
| **Atul** | `ar-engine/ar-viewer.html` opens in Chrome with a hardcoded GLB model visible, rotating; AR button present |
| **Shoaib** | `data-service/extractor.js` and `priceCompare.js` stubs confirmed importable (no crashes on `require()`); `README.md` install steps verified |
| **Dhruv** | Firebase project created; `firebase.json` validates (`firebase --version` returns); local emulator boots with `firebase emulators:start` |

### Meeting Checkpoint
**End of Week 2 — Team screen share.**
Everyone shows their piece working independently before integration.

### ✅ Test Condition (Phase 1 is done when…)
- `frontend/index.html` opens in Chrome → page renders without console errors
- `ar-engine/ar-viewer.html` opens in Chrome → 3D model spins on screen
- `firebase emulators:start` runs without error
- `node -e "require('./data-service/extractor.js')"` exits without crashing

---

## Phase 2 — URL Input + Real Product Data (Week 3–4)

### Goal
Paste a real Amazon or Flipkart URL → the app fetches real product name, price, image, and dimensions from the backend.

### What Each Member Delivers

| Member | Deliverable |
|--------|-------------|
| **Umar** | `handleUrlSubmit()` in `app.js` reads the URL input, calls `POST /extractProduct`, receives JSON, calls `displayProduct()` to render the product card |
| **Atul** | No changes this phase — AR viewer stays hardcoded; Atul reviews what `dimensions` object shape looks like so he's ready for Phase 3 |
| **Shoaib** | `extractProduct(url)` works for amazon.in URLs — returns real product name, price, image URL, and dimensions string; tested with at least 3 product URLs |
| **Dhruv** | `extractProduct` Cloud Function deployed to emulator: accepts POST with `{ url }`, calls Shoaib's extractor, saves result to Firestore, returns product JSON |

### Meeting Checkpoint
**End of Week 3 — Live demo on a test URL.**
Paste `https://www.amazon.in/dp/XXXXXX` → product name appears on screen.

### ✅ Test Condition (Phase 2 is done when…)
- Paste any amazon.in sofa/chair URL → product card shows: name, price, image
- Firestore console shows the cached product document
- No hardcoded product data anywhere in `frontend/app.js`

---

## Phase 3 — Price Comparison + Dynamic GLB (Week 5–6)

### Goal
Price panel shows the same product across platforms. The AR viewer loads a GLB matched to the product category, scaled to real dimensions.

### What Each Member Delivers

| Member | Deliverable |
|--------|-------------|
| **Umar** | `displayPrices()` renders the `.price-panel` with rows for each platform; calls `initARViewer()` from `ar-engine.js` with real GLB URL + dimensions |
| **Atul** | `initARViewer(glbUrl, dimensions, containerId)` fully implemented: injects `<model-viewer>` into container, sets `src`, converts `dimensions.cm` to meters for `scale` attribute |
| **Shoaib** | `getPrices(productName)` returns at least 2 platforms' data; `extractProduct` also works for flipkart.com URLs |
| **Dhruv** | `getPrices` Cloud Function deployed to emulator; Firestore caching for prices (1-hour TTL); CORS headers working so frontend can call from `localhost` |

### Meeting Checkpoint
**End of Week 5 — Integration demo.**
Paste URL → product card → price panel with multiple platforms → AR model appears in `#ar-container`.

### ✅ Test Condition (Phase 3 is done when…)
- Price panel shows ≥ 2 platforms with prices in ₹
- `<model-viewer>` element exists in `#ar-container` with a real GLB loaded
- Clicking the AR button on a supported device triggers WebAR (or shows "AR not supported" gracefully on desktop)

---

## Phase 4 — Mobile Polish + Error Handling + Demo Prep (Week 7–8)

### Goal
App works cleanly on mobile. All error states handled. Ready to demo to the audience.

### What Each Member Delivers

| Member | Deliverable |
|--------|-------------|
| **Umar** | Responsive CSS for mobile viewports; `.spinner` shows during loading; `.error` message shows on bad URL; all console errors cleared |
| **Atul** | AR mode tested on Android Chrome (WebXR); fallback message on iOS/desktop; model scale feels natural in a real room |
| **Shoaib** | Graceful failure if product not found (returns `{ error: "..." }` not a crash); handles rate limiting / bot detection with retry logic |
| **Dhruv** | Rate limiting on Cloud Functions (max 100 req/min); Firebase Hosting deployed with custom domain or `.web.app` URL; env variables in `.env` not hardcoded |

### Meeting Checkpoint
**End of Week 7 — Full run-through on a real Android phone.**
One complete user flow: paste URL → see product → see prices → tap AR → model appears in room.

### ✅ Test Condition (Phase 4 is done when…)
- App URL opens on Android Chrome without layout breaks
- Pasting a bad URL shows `.error` message (not a blank screen or crash)
- Firebase Hosting URL is live and publicly accessible
- Demo script (≤ 3 minutes) rehearsed at least once by the full team
