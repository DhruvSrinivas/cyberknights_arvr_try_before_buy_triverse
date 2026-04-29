/**
 * shared/productCatalog.js — TRIVERSE Product Preset Catalog
 * Overhauled to ensure 1:1 mapping with distinct 3D models.
 * Includes Caviar-level luxury descriptions for high-end items.
 *
 * 20 products used by the ML recommendation engine.
 *
 * GLB models available (KhronosGroup glTF samples):
 *   GlamVelvetSofa.glb  → sofa / couch / seating
 *   SheenChair.glb      → chair / accent chair / armchair
 *   IridescenceLamp.glb → lamp / light / floor lamp
 *
 * Products are named to match their 3D model so the AR viewer makes sense.
 * Prices are spread across all 4 budget tiers:
 *   Under ₹10K  → items ≤ 9,999
 *   ₹10K–₹30K  → items 10,000–29,999
 *   ₹30K–₹75K  → items 30,000–74,999
 *   ₹75K+       → items ≥ 75,000
 *
 * Dual export: CommonJS (backend) + browser global (frontend).
 */

const SOFA_GLB  = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb';
const CHAIR_GLB = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb';
const LAMP_GLB  = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb';

const PRODUCT_CATALOG = [

  // ── SOFAS (GlamVelvetSofa model) ──────────────────────────────────────────

  {

    "id": "furn-01",
    "name": "Modern Velvet 3-Seater Sofa",
    "category": "furniture",
    "styles": ["modern", "minimalist"],
    "roomTypes": ["living", "studio"],
    "price_inr": 89999,
    "imageUrl": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb",
    "dimensions": { "lengthCm": 210, "widthCm": 85, "heightCm": 90 },
    "platform": "Amazon",
    "buyUrl": "https://amazon.in/dp/B08XYZSOFA",
    "tags": ["sofa", "velvet", "3-seater"],
    "description": "An uncompromising masterpiece of interior design. Hand-upholstered in genuine Italian velvet, this bespoke 3-seater sofa offers an unparalleled fusion of avant-garde aesthetics and supreme ergonomic comfort. Designed for the elite."
  },
  {
    "id": "furn-02",
    "name": "Scandinavian Accent Chair",
    "category": "furniture",
    "styles": ["scandinavian", "minimalist"],
    "roomTypes": ["living", "bedroom", "study"],
    "price_inr": 8500,
    "imageUrl": "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb",
    "dimensions": { "lengthCm": 70, "widthCm": 70, "heightCm": 85 },
    "platform": "Flipkart",
    "buyUrl": "https://flipkart.com/item/chair123",
    "tags": ["chair", "accent", "fabric"],
    "description": "A functional and stylish addition to your daily living space. Features durable fabric and a clean, minimalist silhouette."
  },
  {
    "id": "decor-01",
    "name": "Iridescent Table Lamp",
    "category": "lighting",
    "styles": ["modern", "industrial", "scandinavian"],
    "roomTypes": ["study", "bedroom", "living"],
    "price_inr": 14200,
    "imageUrl": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb",
    "dimensions": { "lengthCm": 20, "widthCm": 20, "heightCm": 50 },
    "platform": "Amazon",
    "buyUrl": "https://amazon.in/dp/B08LAMP123",
    "tags": ["lamp", "lighting", "table"],
    "description": "Exquisitely engineered with an iridescent dichroic glass shade that fractures light into a breathtaking spectrum. This premium luminaire is a true statement of modern architectural luxury."
  },
  {
    "id": "decor-02",
    "name": "Vintage Brass Lantern",
    "category": "lighting",
    "styles": ["bohemian", "traditional"],
    "roomTypes": ["balcony", "living"],
    "price_inr": 2100,
    "imageUrl": "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/53b688f8-6aaf-5cc1-83be-3b3d0c6669c9/33e63cb7-6bec-5a59-9604-99b24d7554ee.jpg",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb",
    "dimensions": { "lengthCm": 25, "widthCm": 25, "heightCm": 45 },
    "platform": "Flipkart",
    "buyUrl": "https://flipkart.com/item/lantern999",
    "tags": ["lantern", "decor", "vintage"],
    "description": "Add a touch of warm, bohemian charm to your evenings with this charming and practical brass-finish lantern."
  },
  {
    "id": "decor-03",
    "name": "Antique 1950s Camera Decor",
    "category": "decoration",
    "styles": ["industrial", "traditional"],
    "roomTypes": ["study", "living"],
    "price_inr": 35500,
    "imageUrl": "https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb",
    "dimensions": { "lengthCm": 15, "widthCm": 15, "heightCm": 20 },
    "platform": "Amazon",
    "buyUrl": "https://amazon.in/dp/B08CAMERA",
    "tags": ["camera", "antique", "decor"],
    "description": "A meticulously restored 1950s cinematic relic. Exhibiting pristine mechanical craftsmanship, this rare artifact is tailored for collectors who demand exclusivity and historical provenance."
  },
  {
    "id": "decor-04",
    "name": "Retro Studio Boombox",
    "category": "electronics",
    "styles": ["industrial", "bohemian"],
    "roomTypes": ["studio", "living", "kids"],
    "price_inr": 8999,
    "imageUrl": "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/9afdbb1c-6db2-5898-8089-a7328be0d56f/f34c67e5-6117-5179-a837-c65bcb905b33.jpg",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb",
    "dimensions": { "lengthCm": 40, "widthCm": 15, "heightCm": 25 },
    "platform": "Amazon",
    "buyUrl": "https://amazon.in/dp/B08BOOMBOX",
    "tags": ["audio", "retro", "boombox"],
    "description": "A vibrant blast from the past. This retro boombox brings fun energy and decent acoustics to your personal space."
  },
  {
    "id": "decor-05",
    "name": "Hand-Carved Wooden Duck",
    "category": "decoration",
    "styles": ["scandinavian", "minimalist", "traditional"],
    "roomTypes": ["kids", "bedroom"],
    "price_inr": 1200,
    "imageUrl": "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/ab000e2c-6a38-5b36-8c56-996da1145fbe/0af98422-8d5d-5204-9f00-361f34eddb23.jpg",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
    "dimensions": { "lengthCm": 15, "widthCm": 10, "heightCm": 15 },
    "platform": "Flipkart",
    "buyUrl": "https://flipkart.com/item/wooden-duck",
    "tags": ["toy", "wooden", "decor"],
    "description": "A simple, hand-carved wooden ornament perfect for adding a subtle touch of nature to a child's room."
  },
  {
    "id": "decor-06",
    "name": "Minimalist Hydro Flask",
    "category": "accessories",
    "styles": ["modern", "minimalist"],
    "roomTypes": ["study", "office", "bedroom"],
    "price_inr": 1500,
    "imageUrl": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb",
    "dimensions": { "lengthCm": 10, "widthCm": 10, "heightCm": 25 },
    "platform": "Amazon",
    "buyUrl": "https://amazon.in/dp/B08FLASK",
    "tags": ["bottle", "desk", "minimalist"],
    "description": "Keep your beverages at the perfect temperature with this sleek, vacuum-insulated everyday companion."
  },
  {
    "id": "decor-07",
    "name": "Classic Wooden Toy Train",
    "category": "decoration",
    "styles": ["traditional", "bohemian"],
    "roomTypes": ["kids", "living"],
    "price_inr": 2500,
    "imageUrl": "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/a7430b5b-21df-592b-96d8-a9727b92a209/c7562025-858a-52f9-9b87-56d12b452965.jpg",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyTrain/glTF-Binary/ToyTrain.glb",
    "dimensions": { "lengthCm": 30, "widthCm": 10, "heightCm": 12 },
    "platform": "Amazon",
    "buyUrl": "https://amazon.in/dp/B08TRAIN",
    "tags": ["toy", "wood", "train"],
    "description": "A delightful, nostalgic wooden train set. Crafted to endure playtime while looking charming on a nursery shelf."
  },
  {
    "id": "decor-08",
    "name": "Geometric Fox Sculpture",
    "category": "decoration",
    "styles": ["modern", "minimalist"],
    "roomTypes": ["living", "study"],
    "price_inr": 48000,
    "imageUrl": "https://images.unsplash.com/photo-1606707765187-573e034e3aeb?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb",
    "dimensions": { "lengthCm": 40, "widthCm": 15, "heightCm": 30 },
    "platform": "CaviarDecor",
    "buyUrl": "https://amazon.in/dp/B08FOXART",
    "tags": ["sculpture", "art", "modern"],
    "description": "An opulent geometric study cast in precious metallic alloys. This elite sculptural centerpiece commands attention, reflecting the pinnacle of contemporary avant-garde artistry."
  },
  {
    "id": "decor-09",
    "name": "Ceramic Avocado Kitchen Decor",
    "category": "decoration",
    "styles": ["bohemian", "modern"],
    "roomTypes": ["dining", "balcony"],
    "price_inr": 900,
    "imageUrl": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb",
    "dimensions": { "lengthCm": 10, "widthCm": 8, "heightCm": 10 },
    "platform": "Flipkart",
    "buyUrl": "https://flipkart.com/item/avocado",
    "tags": ["ceramic", "kitchen", "quirky"],
    "description": "A fun, playful ceramic avocado that adds a quirky pop of color to any modern dining setting."
  },
  {
    "id": "decor-10",
    "name": "Sci-Fi Damaged Helmet Replica",
    "category": "decoration",
    "styles": ["industrial", "modern"],
    "roomTypes": ["studio", "study"],
    "price_inr": 125000,
    "imageUrl": "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
    "dimensions": { "lengthCm": 30, "widthCm": 30, "heightCm": 35 },
    "platform": "CaviarDecor",
    "buyUrl": "https://amazon.in/dp/B08HELMET",
    "tags": ["sci-fi", "replica", "collectible"],
    "description": "Forged for the ultimate collector. This hyper-realistic, battle-scarred helmet replica incorporates carbon-fiber detailing and distressed metallurgy, representing the absolute zenith of luxury cinematic memorabilia."
  },
  {
    "id": "decor-11",
    "name": "Vintage Corset Mannequin",
    "category": "furniture",
    "styles": ["traditional", "bohemian"],
    "roomTypes": ["bedroom", "studio"],
    "price_inr": 24000,
    "imageUrl": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Corset/glTF-Binary/Corset.glb",
    "dimensions": { "lengthCm": 40, "widthCm": 40, "heightCm": 160 },
    "platform": "Amazon",
    "buyUrl": "https://amazon.in/dp/B08CORSET",
    "tags": ["fashion", "vintage", "bedroom"],
    "description": "An elegant sartorial statement piece featuring rich silk brocade and hand-stitched detailing, evoking the lavish extravagance of Victorian haute couture."
  },
  {
    "id": "decor-12",
    "name": "Glazed Ceramic Barramundi Fish",
    "category": "decoration",
    "styles": ["scandinavian", "traditional"],
    "roomTypes": ["dining", "living", "balcony"],
    "price_inr": 2200,
    "imageUrl": "https://images.unsplash.com/photo-1534043464124-3be32fe000cb?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb",
    "dimensions": { "lengthCm": 25, "widthCm": 8, "heightCm": 12 },
    "platform": "Flipkart",
    "buyUrl": "https://flipkart.com/item/fish",
    "tags": ["ceramic", "marine", "decor"],
    "description": "A charming, coastal-inspired glazed ceramic fish ornament that beautifully catches the natural light."
  },
  {
    "id": "decor-13",
    "name": "Anatomical Brain Stem Model",
    "category": "decoration",
    "styles": ["industrial", "modern"],
    "roomTypes": ["study", "studio"],
    "price_inr": 6500,
    "imageUrl": "https://images.unsplash.com/photo-1559757175-903ec41fbd68?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BrainStem/glTF-Binary/BrainStem.glb",
    "dimensions": { "lengthCm": 10, "widthCm": 10, "heightCm": 20 },
    "platform": "Amazon",
    "buyUrl": "https://amazon.in/dp/B08BRAIN",
    "tags": ["science", "medical", "study"],
    "description": "A detailed, clinical-grade anatomical model. Ideal for the discerning intellectual seeking an unconventional, thought-provoking desk accessory."
  },
  {
    "id": "decor-14",
    "name": "Designer Sneaker Display",
    "category": "accessories",
    "styles": ["modern", "industrial"],
    "roomTypes": ["bedroom", "studio"],
    "price_inr": 85000,
    "imageUrl": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb",
    "dimensions": { "lengthCm": 35, "widthCm": 15, "heightCm": 20 },
    "platform": "CaviarDecor",
    "buyUrl": "https://amazon.in/dp/B08SHOE",
    "tags": ["sneaker", "hype", "display"],
    "description": "A spectacular exhibition of modern streetwear luxury. Encased in museum-grade acrylic, this ultra-rare designer silhouette represents the absolute pinnacle of contemporary urban wealth."
  },
  {
    "id": "decor-15",
    "name": "Antique Water Canteen",
    "category": "decoration",
    "styles": ["bohemian", "traditional"],
    "roomTypes": ["balcony", "living"],
    "price_inr": 4100,
    "imageUrl": "https://images.unsplash.com/photo-1558980394-4c7c9299fe96?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb",
    "dimensions": { "lengthCm": 15, "widthCm": 15, "heightCm": 25 },
    "platform": "Amazon",
    "buyUrl": "https://amazon.in/dp/B08CANTEEN",
    "tags": ["vintage", "canteen", "rustic"],
    "description": "A rugged, historically inspired rustic canteen that brings an authentic touch of adventure to your outdoor or living spaces."
  },
  {
    "id": "decor-16",
    "name": "Bespoke Golden Table Lamp",
    "category": "lighting",
    "styles": ["modern", "minimalist"],
    "roomTypes": ["bedroom", "study", "living"],
    "price_inr": 210000,
    "imageUrl": "https://images.unsplash.com/photo-1507676184212-d0330a151f15?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb",
    "dimensions": { "lengthCm": 25, "widthCm": 25, "heightCm": 60 },
    "platform": "CaviarDecor",
    "buyUrl": "https://amazon.in/dp/B08GOLDLAMP",
    "tags": ["luxury", "gold", "lamp"],
    "description": "An artifact of profound prestige. Hand-gilded in 24-karat gold with precision micro-engineering, this elite luminaire is not merely a light source, but a testament to unimaginable wealth and uncompromising taste."
  },
  {
    id: 'sofa-01',
    name: 'Glam Velvet 3-Seater Sofa — Teal',
    category: 'furniture',
    styles: ['modern', 'minimalist'],
    roomTypes: ['living', 'bedroom'],
    price_inr: 28999,                          // ₹10K–₹30K tier
    imageUrl: 'https://placehold.co/600x400/0B7A75/FFFFFF?text=Glam+Velvet+Sofa+Teal',
    glbUrl: SOFA_GLB,
    dimensions: { lengthCm: 210, widthCm: 85, heightCm: 90 },
    platform: 'Amazon',
    buyUrl: 'https://www.amazon.in/s?k=velvet+3+seater+sofa',
    tags: ['sofa', 'velvet', '3-seater'],
  },
  {
    id: 'sofa-02',
    name: 'Glam Velvet 2-Seater Loveseat — Charcoal',
    category: 'furniture',
    styles: ['modern', 'industrial'],
    roomTypes: ['living', 'study'],
    price_inr: 18500,                          // ₹10K–₹30K tier
    imageUrl: 'https://placehold.co/600x400/3D3D3D/FFFFFF?text=Velvet+Loveseat+Charcoal',
    glbUrl: SOFA_GLB,
    dimensions: { lengthCm: 155, widthCm: 80, heightCm: 88 },
    platform: 'Flipkart',
    buyUrl: 'https://www.flipkart.com/search?q=2+seater+velvet+sofa',
    tags: ['sofa', 'loveseat', '2-seater'],
  },
  {
    id: 'sofa-03',
    name: 'Glam Velvet L-Shape Corner Sofa — Rust',
    category: 'furniture',
    styles: ['bohemian', 'traditional'],
    roomTypes: ['living'],
    price_inr: 54999,                          // ₹30K–₹75K tier
    imageUrl: 'https://placehold.co/600x400/C05A3A/FFFFFF?text=L-Shape+Corner+Sofa+Rust',
    glbUrl: SOFA_GLB,
    dimensions: { lengthCm: 270, widthCm: 170, heightCm: 90 },
    platform: 'Pepperfry',
    buyUrl: 'https://www.pepperfry.com/sofas.html',
    tags: ['sofa', 'L-shape', 'corner'],
  },
  {
    id: 'sofa-04',
    name: 'Glam Velvet Luxury Sectional Sofa — Pearl',
    category: 'furniture',
    styles: ['modern', 'scandinavian'],
    roomTypes: ['living'],
    price_inr: 89999,                          // ₹75K+ tier
    imageUrl: 'https://placehold.co/600x400/F0EDE8/333333?text=Luxury+Sectional+Pearl',
    glbUrl: SOFA_GLB,
    dimensions: { lengthCm: 320, widthCm: 200, heightCm: 92 },
    platform: 'UrbanLadder',
    buyUrl: 'https://www.urbanladder.com/sofas',
    tags: ['sofa', 'sectional', 'luxury'],
  },
  {
    id: 'sofa-05',
    name: 'Compact Velvet Studio Sofa — Forest Green',
    category: 'furniture',
    styles: ['minimalist', 'scandinavian'],
    roomTypes: ['bedroom', 'study'],
    price_inr: 8999,                           // Under ₹10K tier
    imageUrl: 'https://placehold.co/600x400/2D6A4F/FFFFFF?text=Studio+Sofa+Green',
    glbUrl: SOFA_GLB,
    dimensions: { lengthCm: 130, widthCm: 75, heightCm: 82 },
    platform: 'Amazon',
    buyUrl: 'https://www.amazon.in/s?k=compact+sofa+studio',
    tags: ['sofa', 'compact', 'studio'],
  },

  // ── CHAIRS (SheenChair model) ─────────────────────────────────────────────

  {
    id: 'chair-01',
    name: 'Sheen Fabric Accent Chair — Natural',
    category: 'furniture',
    styles: ['scandinavian', 'minimalist'],
    roomTypes: ['living', 'bedroom'],
    price_inr: 8500,                           // Under ₹10K tier
    imageUrl: 'https://placehold.co/600x400/C4A882/333333?text=Sheen+Accent+Chair+Natural',
    glbUrl: CHAIR_GLB,
    dimensions: { lengthCm: 70, widthCm: 70, heightCm: 85 },
    platform: 'Flipkart',
    buyUrl: 'https://www.flipkart.com/search?q=accent+chair+fabric',
    tags: ['chair', 'accent', 'fabric'],
  },
  {
    id: 'chair-02',
    name: 'Sheen Fabric Lounge Chair — Ocean Blue',
    category: 'furniture',
    styles: ['modern', 'industrial'],
    roomTypes: ['living', 'study'],
    price_inr: 14999,                          // ₹10K–₹30K tier
    imageUrl: 'https://placehold.co/600x400/2E4057/FFFFFF?text=Lounge+Chair+Ocean+Blue',
    glbUrl: CHAIR_GLB,
    dimensions: { lengthCm: 80, widthCm: 78, heightCm: 90 },
    platform: 'Amazon',
    buyUrl: 'https://www.amazon.in/s?k=lounge+chair+blue',
    tags: ['chair', 'lounge', 'armchair'],
  },
  {
    id: 'chair-03',
    name: 'Sheen Velvet Wingback Chair — Terracotta',
    category: 'furniture',
    styles: ['traditional', 'bohemian'],
    roomTypes: ['living', 'bedroom'],
    price_inr: 22500,                          // ₹10K–₹30K tier
    imageUrl: 'https://placehold.co/600x400/C05A3A/FFFFFF?text=Wingback+Chair+Terracotta',
    glbUrl: CHAIR_GLB,
    dimensions: { lengthCm: 82, widthCm: 80, heightCm: 105 },
    platform: 'Pepperfry',
    buyUrl: 'https://www.pepperfry.com/chairs.html',
    tags: ['chair', 'wingback', 'velvet'],
  },
  {
    id: 'chair-04',
    name: 'Sheen Designer Recliner Chair — Charcoal',
    category: 'furniture',
    styles: ['modern', 'industrial'],
    roomTypes: ['living', 'study'],
    price_inr: 38000,                          // ₹30K–₹75K tier
    imageUrl: 'https://placehold.co/600x400/3D3D3D/FFFFFF?text=Recliner+Chair+Charcoal',
    glbUrl: CHAIR_GLB,
    dimensions: { lengthCm: 90, widthCm: 85, heightCm: 100 },
    platform: 'UrbanLadder',
    buyUrl: 'https://www.urbanladder.com/recliners',
    tags: ['chair', 'recliner', 'motorised'],
  },
  {
    id: 'chair-05',
    name: 'Sheen Premium Egg Chair with Ottoman — Pearl',
    category: 'furniture',
    styles: ['modern', 'scandinavian'],
    roomTypes: ['living', 'bedroom'],
    price_inr: 76000,                          // ₹75K+ tier
    imageUrl: 'https://placehold.co/600x400/F0EDE8/333333?text=Egg+Chair+Pearl',
    glbUrl: CHAIR_GLB,
    dimensions: { lengthCm: 95, widthCm: 90, heightCm: 115 },
    platform: 'Amazon',
    buyUrl: 'https://www.amazon.in/s?k=egg+chair+premium',
    tags: ['chair', 'egg chair', 'ottoman'],
  },

  // ── LAMPS (IridescenceLamp model) ─────────────────────────────────────────

  {
    id: 'lamp-01',
    name: 'Iridescence Arc Floor Lamp — Brushed Gold',
    category: 'items',
    styles: ['modern', 'minimalist'],
    roomTypes: ['living', 'bedroom'],
    price_inr: 4999,                           // Under ₹10K tier
    imageUrl: 'https://placehold.co/600x400/C4A882/333333?text=Arc+Floor+Lamp+Gold',
    glbUrl: LAMP_GLB,
    dimensions: { lengthCm: 35, widthCm: 35, heightCm: 165 },
    platform: 'Amazon',
    buyUrl: 'https://www.amazon.in/s?k=arc+floor+lamp+gold',
    tags: ['lamp', 'floor lamp', 'arc'],
  },
  {
    id: 'lamp-02',
    name: 'Iridescence Tripod Floor Lamp — Matte Black',
    category: 'items',
    styles: ['industrial', 'modern'],
    roomTypes: ['living', 'study'],
    price_inr: 7500,                           // Under ₹10K tier
    imageUrl: 'https://placehold.co/600x400/1A1A1A/FFFFFF?text=Tripod+Floor+Lamp+Black',
    glbUrl: LAMP_GLB,
    dimensions: { lengthCm: 40, widthCm: 40, heightCm: 155 },
    platform: 'Flipkart',
    buyUrl: 'https://www.flipkart.com/search?q=tripod+floor+lamp',
    tags: ['lamp', 'tripod', 'industrial'],
  },
  {
    id: 'lamp-03',
    name: 'Iridescence Designer Table Lamp — Teal',
    category: 'items',
    styles: ['bohemian', 'traditional'],
    roomTypes: ['bedroom', 'study', 'dining'],
    price_inr: 2800,                           // Under ₹10K tier
    imageUrl: 'https://placehold.co/600x400/0B7A75/FFFFFF?text=Table+Lamp+Teal',
    glbUrl: LAMP_GLB,
    dimensions: { lengthCm: 25, widthCm: 25, heightCm: 55 },
    platform: 'Amazon',
    buyUrl: 'https://www.amazon.in/s?k=designer+table+lamp+teal',
    tags: ['lamp', 'table lamp', 'bedside'],
  },
  {
    id: 'lamp-04',
    name: 'Iridescence Smart LED Floor Lamp — White',
    category: 'items',
    styles: ['modern', 'scandinavian', 'minimalist'],
    roomTypes: ['living', 'bedroom', 'study'],
    price_inr: 12999,                          // ₹10K–₹30K tier
    imageUrl: 'https://placehold.co/600x400/F0EDE8/333333?text=Smart+LED+Floor+Lamp',
    glbUrl: LAMP_GLB,
    dimensions: { lengthCm: 30, widthCm: 30, heightCm: 160 },
    platform: 'Amazon',
    buyUrl: 'https://www.amazon.in/s?k=smart+led+floor+lamp',
    tags: ['lamp', 'smart', 'LED', 'dimmable'],
  },
  {
    id: 'lamp-05',
    name: 'Iridescence Luxury Chandelier Floor Lamp — Brass',
    category: 'items',
    styles: ['traditional', 'bohemian'],
    roomTypes: ['living', 'dining'],
    price_inr: 32000,                          // ₹30K–₹75K tier
    imageUrl: 'https://placehold.co/600x400/B8860B/FFFFFF?text=Chandelier+Floor+Lamp+Brass',
    glbUrl: LAMP_GLB,
    dimensions: { lengthCm: 50, widthCm: 50, heightCm: 180 },
    platform: 'Pepperfry',
    buyUrl: 'https://www.pepperfry.com/lamps.html',
    tags: ['lamp', 'chandelier', 'brass', 'luxury'],
  },

  // ── SOFA + CHAIR COMBOS — higher price tiers ──────────────────────────────

  {
    id: 'set-01',
    name: 'Velvet Sofa + Accent Chair Set — Teal & Natural',
    category: 'furniture',
    styles: ['modern', 'scandinavian'],
    roomTypes: ['living'],
    price_inr: 42000,                          // ₹30K–₹75K tier
    imageUrl: 'https://placehold.co/600x400/0B7A75/FFFFFF?text=Sofa+%2B+Chair+Set',
    glbUrl: SOFA_GLB,
    dimensions: { lengthCm: 210, widthCm: 85, heightCm: 90 },
    platform: 'UrbanLadder',
    buyUrl: 'https://www.urbanladder.com/living-room-sets',
    tags: ['sofa', 'chair', 'set', 'combo'],
  },
  {
    id: 'set-02',
    name: 'Velvet Sofa + 2 Chairs Living Room Set — Charcoal',
    category: 'furniture',
    styles: ['industrial', 'modern'],
    roomTypes: ['living'],
    price_inr: 68000,                          // ₹30K–₹75K tier
    imageUrl: 'https://placehold.co/600x400/3D3D3D/FFFFFF?text=Living+Room+Set+Charcoal',
    glbUrl: SOFA_GLB,
    dimensions: { lengthCm: 210, widthCm: 85, heightCm: 90 },
    platform: 'Pepperfry',
    buyUrl: 'https://www.pepperfry.com/living-room-sets.html',
    tags: ['sofa', 'set', '3-piece', 'living room'],
  },
  {
    id: 'set-03',
    name: 'Premium Velvet Sofa Set — 3+1+1 Configuration',
    category: 'furniture',
    styles: ['traditional', 'modern'],
    roomTypes: ['living'],
    price_inr: 95000,                          // ₹75K+ tier
    imageUrl: 'https://placehold.co/600x400/7B2D26/FFFFFF?text=Premium+Sofa+Set+3%2B1%2B1',
    glbUrl: SOFA_GLB,
    dimensions: { lengthCm: 210, widthCm: 85, heightCm: 90 },
    platform: 'UrbanLadder',
    buyUrl: 'https://www.urbanladder.com/sofa-sets',
    tags: ['sofa', 'set', '5-seater', 'premium'],
  },
  {
    id: 'set-04',
    name: 'Luxury Chesterfield Sofa — Deep Teal',
    category: 'furniture',
    styles: ['traditional', 'bohemian'],
    roomTypes: ['living', 'study'],
    price_inr: 9500,                           // Under ₹10K tier
    imageUrl: 'https://placehold.co/600x400/19535F/FFFFFF?text=Chesterfield+Sofa+Teal',
    glbUrl: SOFA_GLB,
    dimensions: { lengthCm: 185, widthCm: 82, heightCm: 88 },
    platform: 'Amazon',
    buyUrl: 'https://www.amazon.in/s?k=chesterfield+sofa',
    tags: ['sofa', 'chesterfield', 'tufted'],
  },
  {
    id: 'set-05',
    name: 'Ergonomic Study Chair with Lumbar Support — Grey',
    category: 'furniture',
    styles: ['minimalist', 'modern', 'industrial'],
    roomTypes: ['study', 'bedroom'],
    price_inr: 6200,                           // Under ₹10K tier
    imageUrl: 'https://placehold.co/600x400/6B8089/FFFFFF?text=Ergonomic+Study+Chair',
    glbUrl: CHAIR_GLB,
    dimensions: { lengthCm: 65, widthCm: 65, heightCm: 95 },
    platform: 'Flipkart',
    buyUrl: 'https://www.flipkart.com/search?q=ergonomic+study+chair',
    tags: ['chair', 'ergonomic', 'study', 'office'],
  },

];

// Export setup
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCT_CATALOG };
} else if (typeof window !== 'undefined') {
  window.PRODUCT_CATALOG = PRODUCT_CATALOG;
}
