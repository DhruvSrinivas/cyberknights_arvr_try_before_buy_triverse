/**
 * shared/productCatalog.js — TRIVERSE Product Preset Catalog
 * Overhauled to ensure 1:1 mapping with distinct 3D models.
 * Dual export: CommonJS (backend) + browser global (frontend).
 */

const PRODUCT_CATALOG = [
  {
    "id": "furn-01",
    "name": "Modern Velvet 3-Seater Sofa",
    "category": "furniture",
    "styles": ["modern", "minimalist"],
    "roomTypes": ["living", "studio"],
    "price_inr": 28999,
    "imageUrl": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb",
    "dimensions": { "lengthCm": 210, "widthCm": 85, "heightCm": 90 },
    "platform": "Amazon",
    "buyUrl": "https://amazon.in/dp/B08XYZSOFA",
    "tags": ["sofa", "velvet", "3-seater"]
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
    "tags": ["chair", "accent", "fabric"]
  },
  {
    "id": "decor-01",
    "name": "Iridescent Table Lamp",
    "category": "lighting",
    "styles": ["modern", "industrial", "scandinavian"],
    "roomTypes": ["study", "bedroom", "living"],
    "price_inr": 4200,
    "imageUrl": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb",
    "dimensions": { "lengthCm": 20, "widthCm": 20, "heightCm": 50 },
    "platform": "Amazon",
    "buyUrl": "https://amazon.in/dp/B08LAMP123",
    "tags": ["lamp", "lighting", "table"]
  },
  {
    "id": "decor-02",
    "name": "Vintage Brass Lantern",
    "category": "lighting",
    "styles": ["bohemian", "traditional"],
    "roomTypes": ["balcony", "living"],
    "price_inr": 2100,
    "imageUrl": "https://images.unsplash.com/photo-1543880572-132d72960950?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb",
    "dimensions": { "lengthCm": 25, "widthCm": 25, "heightCm": 45 },
    "platform": "Flipkart",
    "buyUrl": "https://flipkart.com/item/lantern999",
    "tags": ["lantern", "decor", "vintage"]
  },
  {
    "id": "decor-03",
    "name": "Antique 1950s Camera Decor",
    "category": "decoration",
    "styles": ["industrial", "traditional"],
    "roomTypes": ["study", "living"],
    "price_inr": 5500,
    "imageUrl": "https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb",
    "dimensions": { "lengthCm": 15, "widthCm": 15, "heightCm": 20 },
    "platform": "Amazon",
    "buyUrl": "https://amazon.in/dp/B08CAMERA",
    "tags": ["camera", "antique", "decor"]
  },
  {
    "id": "decor-04",
    "name": "Retro Studio Boombox",
    "category": "electronics",
    "styles": ["industrial", "bohemian"],
    "roomTypes": ["studio", "living", "kids"],
    "price_inr": 8999,
    "imageUrl": "https://images.unsplash.com/photo-1559124467-33f7ed18b209?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb",
    "dimensions": { "lengthCm": 40, "widthCm": 15, "heightCm": 25 },
    "platform": "Amazon",
    "buyUrl": "https://amazon.in/dp/B08BOOMBOX",
    "tags": ["audio", "retro", "boombox"]
  },
  {
    "id": "decor-05",
    "name": "Hand-Carved Wooden Duck",
    "category": "decoration",
    "styles": ["scandinavian", "minimalist", "traditional"],
    "roomTypes": ["kids", "bedroom"],
    "price_inr": 1200,
    "imageUrl": "https://images.unsplash.com/photo-1582210515152-19e4ffc61099?auto=format&fit=crop&w=600&q=80",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
    "dimensions": { "lengthCm": 15, "widthCm": 10, "heightCm": 15 },
    "platform": "Flipkart",
    "buyUrl": "https://flipkart.com/item/wooden-duck",
    "tags": ["toy", "wooden", "decor"]
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
    "tags": ["bottle", "desk", "minimalist"]
  }
];

// Export setup
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCT_CATALOG };
} else if (typeof window !== 'undefined') {
  window.PRODUCT_CATALOG = PRODUCT_CATALOG;
}
