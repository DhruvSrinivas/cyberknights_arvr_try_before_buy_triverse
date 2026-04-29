/**
 * shared/config.js — TRIVERSE Central Configuration
 *
 * PURPOSE:
 *   Single source of truth for all constants used across every directory.
 *   All 4 modules (frontend, ar-engine, data-service, backend) import from here.
 *   NO hardcoded strings, URLs, or keys anywhere else in the project.
 *
 * HOW TO IMPORT (examples):
 *   Browser (frontend / ar-engine):
 *     import { API_BASE_URL, PRODUCT_CATEGORIES } from '../../shared/config.js';
 *
 *   Node.js (data-service / backend):
 *     const { FIREBASE_CONFIG, SUPPORTED_PLATFORMS } = require('../../shared/config.js');
 *
 * OWNERSHIP:
 *   Dhruv is responsible for keeping this file up to date.
 *   Any member who needs a new constant should ask Dhruv to add it here.
 */

// ---------------------------------------------------------------------------
// API BASE URL
// ---------------------------------------------------------------------------
// Points to the Firebase Cloud Functions base URL.
// In local development this is the emulator URL.
// In production, replace with your actual Cloud Functions region URL.
// Example prod URL: 'https://us-central1-triverse-xxxx.cloudfunctions.net'
const isProd = (typeof process !== 'undefined') && process.env && (process.env.NODE_ENV === 'production');
const API_BASE_URL =
  isProd
    ? 'https://us-central1-cyberknights-arvr.cloudfunctions.net'
    : 'http://127.0.0.1:5001/cyberknights-arvr/us-central1';

// ---------------------------------------------------------------------------
// FIREBASE CONFIG
// ---------------------------------------------------------------------------
// Placeholder values — Dhruv replaces these with real values from Firebase Console.
// Go to: Firebase Console → Project Settings → Your apps → Web app → Config snippet
// NEVER commit real API keys to a public repo. Use environment variables in prod.
const FIREBASE_CONFIG = {
  apiKey:            'AIzaSyA9r3HiwaTRB30oaFPfxtGt_gywfkv9O2Q',
  authDomain:        'cyberknights-arvr.firebaseapp.com',
  projectId:         'cyberknights-arvr',
  storageBucket:     'cyberknights-arvr.firebasestorage.app',
  messagingSenderId: '616199867398',
  appId:             '1:616199867398:web:017ef7a68b9db38efdc787',
  measurementId:     'G-P72B8Q7GB4',
};

// ---------------------------------------------------------------------------
// SUPPORTED PLATFORMS
// ---------------------------------------------------------------------------
// Platforms that data-service/extractor.js and priceCompare.js can handle.
// Shoaib: add a new entry here if you add support for a new site.
// Key = hostname substring to match against. Value = display name.
const SUPPORTED_PLATFORMS = {
  'amazon.in': 'Amazon India',
  'flipkart.com': 'Flipkart',
  // Future platforms (Phase 4+):
  // 'myntra.com': 'Myntra',
  // 'pepperfry.com': 'Pepperfry',
};

// ---------------------------------------------------------------------------
// PRODUCT CATEGORIES
// ---------------------------------------------------------------------------
// Maps a product category string (as returned by extractor.js) to a
// default GLB model URL for that category.
// Atul: replace the placeholder GLB URLs with real hosted model URLs.
// Shoaib: make sure extractProduct() returns a `category` field matching these keys.
const PRODUCT_CATEGORIES = {
  sofa: {
    label: 'Sofa / Couch',
    defaultGlbUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Replace with real sofa GLB
  },
  chair: {
    label: 'Chair',
    defaultGlbUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Replace with real chair GLB
  },
  table: {
    label: 'Table',
    defaultGlbUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Replace with real table GLB
  },
  lamp: {
    label: 'Lamp / Light',
    defaultGlbUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Replace with real lamp GLB
  },
  bed: {
    label: 'Bed',
    defaultGlbUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Replace with real bed GLB
  },
  // Add more categories as needed — coordinate with Shoaib on category names
};

// ---------------------------------------------------------------------------
// FIRESTORE COLLECTION NAMES
// ---------------------------------------------------------------------------
// Dhruv: use these constants in backend/functions/index.js for all Firestore calls.
// Changing a collection name here updates it everywhere.
const FIRESTORE_COLLECTIONS = {
  products: 'products',   // Cached product extractions
  prices: 'prices',       // Cached price comparisons
};

// ---------------------------------------------------------------------------
// CACHE TTL (Time-To-Live in milliseconds)
// ---------------------------------------------------------------------------
// How long a cached Firestore document is considered fresh before re-fetching.
const CACHE_TTL_MS = {
  product: 24 * 60 * 60 * 1000,   // 24 hours for product data
  prices: 60 * 60 * 1000,          //  1 hour for price data (prices change often)
};

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------
// Supports both ES Module (import) and CommonJS (require) environments.
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS (Node.js — data-service, backend)
  module.exports = {
    API_BASE_URL,
    FIREBASE_CONFIG,
    SUPPORTED_PLATFORMS,
    PRODUCT_CATEGORIES,
    FIRESTORE_COLLECTIONS,
    CACHE_TTL_MS,
  };
} else if (typeof window !== 'undefined') {
  // Browser (frontend, ar-engine) — attach as globals
  window.API_BASE_URL          = API_BASE_URL;
  window.FIREBASE_CONFIG       = FIREBASE_CONFIG;
  window.SUPPORTED_PLATFORMS   = SUPPORTED_PLATFORMS;
  window.PRODUCT_CATEGORIES    = PRODUCT_CATEGORIES;
  window.FIRESTORE_COLLECTIONS = FIRESTORE_COLLECTIONS;
  window.CACHE_TTL_MS          = CACHE_TTL_MS;
}
