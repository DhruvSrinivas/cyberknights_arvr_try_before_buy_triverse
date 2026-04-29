/**
 * backend/test.js — TRIVERSE Backend API Test Runner
 *
 * Run with: node test.js
 * Make sure the Firebase emulator is running first:
 *   cd backend && firebase emulators:start
 */

const BASE = 'http://127.0.0.1:5001/cyberknights-arvr/us-central1';

async function run() {

  // ── Test 1: getRecommendations ──────────────────────────────────────────
  console.log('═══════════════════════════════════════════════');
  console.log('TEST 1 — GET /getRecommendations');
  console.log('Params: living room, 400×300 cm, modern, ₹30000');
  console.log('───────────────────────────────────────────────');
  try {
    const url = `${BASE}/getRecommendations?roomType=living&lengthCm=400&widthCm=300&style=modern&budget=30000`;
    const res  = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data)) {
      console.log(`✅ Got ${data.length} recommendations`);
      data.forEach((p, i) => {
        console.log(`  ${i+1}. [${(p._score*100).toFixed(0)}%] ${p.name} — ₹${p.price_inr.toLocaleString('en-IN')}`);
      });
    } else {
      console.log('❌ Unexpected response:', data);
    }
  } catch (e) {
    console.log('❌ ERROR:', e.message);
  }

  // ── Test 2: getRecommendations — bedroom minimalist ────────────────────
  console.log('\n───────────────────────────────────────────────');
  console.log('TEST 2 — GET /getRecommendations');
  console.log('Params: bedroom, 350×300 cm, minimalist, ₹25000');
  console.log('───────────────────────────────────────────────');
  try {
    const url = `${BASE}/getRecommendations?roomType=bedroom&lengthCm=350&widthCm=300&style=minimalist&budget=25000`;
    const res  = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data)) {
      console.log(`✅ Got ${data.length} recommendations`);
      data.forEach((p, i) => {
        console.log(`  ${i+1}. [${(p._score*100).toFixed(0)}%] ${p.name} — ₹${p.price_inr.toLocaleString('en-IN')}`);
      });
    } else {
      console.log('❌ Unexpected response:', data);
    }
  } catch (e) {
    console.log('❌ ERROR:', e.message);
  }

  // ── Test 3: getRecommendations — validation error ──────────────────────
  console.log('\n───────────────────────────────────────────────');
  console.log('TEST 3 — GET /getRecommendations (bad roomType)');
  console.log('───────────────────────────────────────────────');
  try {
    const url = `${BASE}/getRecommendations?roomType=INVALID&lengthCm=400&widthCm=300&style=modern&budget=30000`;
    const res  = await fetch(url);
    const data = await res.json();
    console.log(res.status === 400 ? '✅ Correctly returned 400:' : '❌ Expected 400, got ' + res.status, data.error);
  } catch (e) {
    console.log('❌ ERROR:', e.message);
  }

  // ── Test 4: getPrices ───────────────────────────────────────────────────
  console.log('\n───────────────────────────────────────────────');
  console.log('TEST 4 — GET /getPrices');
  console.log('───────────────────────────────────────────────');
  try {
    const res  = await fetch(`${BASE}/getPrices?productName=Wakefit+Orthopaedic+Sofa`);
    const data = await res.json();
    console.log(Array.isArray(data) ? `✅ Got ${data.length} price result(s)` : '⚠️ Empty or unexpected');
    if (data.length) console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('❌ ERROR:', e.message);
  }

  // ── Test 5: extractProduct (POST) ───────────────────────────────────────
  console.log('\n───────────────────────────────────────────────');
  console.log('TEST 5 — POST /extractProduct');
  console.log('───────────────────────────────────────────────');
  try {
    const res  = await fetch(`${BASE}/extractProduct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://www.amazon.in/Wakefit-Orthopaedic-Fabric-Seater-Space/dp/B0BD8N9QJ6' }),
    });
    const data = await res.json();
    if (data.name) {
      console.log(`✅ Extracted: "${data.name}" — ₹${data.originalPrice}`);
    } else {
      console.log('⚠️ Response:', JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.log('❌ ERROR:', e.message);
  }

  console.log('\n═══════════════════════════════════════════════');
  console.log('Tests complete.');
}

run();
