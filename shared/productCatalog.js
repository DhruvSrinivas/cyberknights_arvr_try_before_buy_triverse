/**
 * shared/productCatalog.js — TRIVERSE Product Preset Catalog
 * 20 products used by the ML recommendation engine.
 * Dual export: CommonJS (backend) + browser global (frontend).
 */

const PRODUCT_CATALOG = [
  {
    "id": "furn-01",
    "name": "Modern Velvet 3-Seater Sofa",
    "category": "furniture",
    "styles": [
      "modern",
      "minimalist"
    ],
    "roomTypes": [
      "living",
      "studio"
    ],
    "price_inr": 28999,
    "imageUrl": "https://placehold.co/600x400/0B7A75/FFFFFF?text=Modern+Velvet+3-Seater+Sofa",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb",
    "dimensions": {
      "lengthCm": 210,
      "widthCm": 85,
      "heightCm": 90
    },
    "platform": "Amazon",
    "buyUrl": "#",
    "tags": [
      "sofa",
      "velvet",
      "3-seater"
    ]
  },
  {
    "id": "furn-02",
    "name": "Scandinavian Accent Chair",
    "category": "furniture",
    "styles": [
      "scandinavian",
      "minimalist"
    ],
    "roomTypes": [
      "living",
      "bedroom"
    ],
    "price_inr": 8500,
    "imageUrl": "https://placehold.co/600x400/0B7A75/FFFFFF?text=Scandinavian+Accent+Chair",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb",
    "dimensions": {
      "lengthCm": 70,
      "widthCm": 70,
      "heightCm": 85
    },
    "platform": "Flipkart",
    "buyUrl": "#",
    "tags": [
      "chair",
      "accent"
    ]
  },
  {
    "id": "furn-03",
    "name": "Industrial Wooden Chair",
    "category": "furniture",
    "styles": [
      "industrial",
      "modern"
    ],
    "roomTypes": [
      "living"
    ],
    "price_inr": 6500,
    "imageUrl": "https://placehold.co/600x400/0B7A75/FFFFFF?text=Industrial+Wooden+Chair",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb",
    "dimensions": {
      "lengthCm": 60,
      "widthCm": 60,
      "heightCm": 85
    },
    "platform": "UrbanLadder",
    "buyUrl": "#",
    "tags": [
      "chair",
      "wooden"
    ]
  },
  {
    "id": "furn-04",
    "name": "Bohemian Rattan Chair",
    "category": "furniture",
    "styles": [
      "bohemian"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "price_inr": 12000,
    "imageUrl": "https://placehold.co/600x400/0B7A75/FFFFFF?text=Bohemian+Rattan+Chair",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb",
    "dimensions": {
      "lengthCm": 75,
      "widthCm": 75,
      "heightCm": 90
    },
    "platform": "Amazon",
    "buyUrl": "#",
    "tags": [
      "chair",
      "rattan",
      "boho"
    ]
  },
  {
    "id": "furn-05",
    "name": "Traditional Bookshelf",
    "category": "furniture",
    "styles": [
      "traditional"
    ],
    "roomTypes": [
      "study",
      "living"
    ],
    "price_inr": 12000,
    "imageUrl": "https://placehold.co/600x400/0B7A75/FFFFFF?text=Traditional+Bookshelf",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb",
    "dimensions": {
      "lengthCm": 80,
      "widthCm": 35,
      "heightCm": 180
    },
    "platform": "Pepperfry",
    "buyUrl": "#",
    "tags": [
      "shelf",
      "storage"
    ]
  },
  {
    "id": "plant-01",
    "name": "Large Indoor Monstera Plant",
    "category": "plants",
    "styles": [
      "bohemian",
      "modern",
      "minimalist"
    ],
    "roomTypes": [
      "living",
      "bedroom",
      "study",
      "studio"
    ],
    "price_inr": 1500,
    "imageUrl": "https://placehold.co/600x400/2D6A4F/FFFFFF?text=Large+Indoor+Monstera",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb",
    "dimensions": {
      "lengthCm": 50,
      "widthCm": 50,
      "heightCm": 120
    },
    "platform": "Ugaoo",
    "buyUrl": "#",
    "tags": [
      "plant",
      "indoor",
      "monstera"
    ]
  },
  {
    "id": "plant-02",
    "name": "Fiddle Leaf Fig in Ceramic Pot",
    "category": "plants",
    "styles": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living",
      "studio"
    ],
    "price_inr": 2200,
    "imageUrl": "https://placehold.co/600x400/2D6A4F/FFFFFF?text=Fiddle+Leaf+Fig",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb",
    "dimensions": {
      "lengthCm": 45,
      "widthCm": 45,
      "heightCm": 150
    },
    "platform": "Amazon",
    "buyUrl": "#",
    "tags": [
      "plant",
      "tall",
      "fig"
    ]
  },
  {
    "id": "plant-03",
    "name": "Snake Plant Set",
    "category": "plants",
    "styles": [
      "industrial",
      "minimalist"
    ],
    "roomTypes": [
      "bedroom",
      "study"
    ],
    "price_inr": 800,
    "imageUrl": "https://placehold.co/600x400/2D6A4F/FFFFFF?text=Snake+Plant+Set",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb",
    "dimensions": {
      "lengthCm": 20,
      "widthCm": 20,
      "heightCm": 60
    },
    "platform": "NurseryLive",
    "buyUrl": "#",
    "tags": [
      "plant",
      "air-purifying"
    ]
  },
  {
    "id": "plant-04",
    "name": "Hanging Pothos Basket",
    "category": "plants",
    "styles": [
      "bohemian"
    ],
    "roomTypes": [
      "living",
      "kitchen",
      "balcony"
    ],
    "price_inr": 650,
    "imageUrl": "https://placehold.co/600x400/2D6A4F/FFFFFF?text=Hanging+Pothos",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb",
    "dimensions": {
      "lengthCm": 30,
      "widthCm": 30,
      "heightCm": 100
    },
    "platform": "Ugaoo",
    "buyUrl": "#",
    "tags": [
      "plant",
      "hanging"
    ]
  },
  {
    "id": "plant-05",
    "name": "Bonsai Tree Desk Plant",
    "category": "plants",
    "styles": [
      "traditional",
      "minimalist"
    ],
    "roomTypes": [
      "study",
      "office"
    ],
    "price_inr": 3000,
    "imageUrl": "https://placehold.co/600x400/2D6A4F/FFFFFF?text=Bonsai+Tree",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb",
    "dimensions": {
      "lengthCm": 35,
      "widthCm": 25,
      "heightCm": 40
    },
    "platform": "Amazon",
    "buyUrl": "#",
    "tags": [
      "plant",
      "bonsai",
      "desk"
    ]
  },
  {
    "id": "decor-01",
    "name": "Abstract Canvas Wall Art",
    "category": "decoration",
    "styles": [
      "modern",
      "minimalist"
    ],
    "roomTypes": [
      "living",
      "bedroom"
    ],
    "price_inr": 4500,
    "imageUrl": "https://placehold.co/600x400/C05A3A/FFFFFF?text=Abstract+Canvas+Art",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb",
    "dimensions": {
      "lengthCm": 120,
      "widthCm": 5,
      "heightCm": 80
    },
    "platform": "Flipkart",
    "buyUrl": "#",
    "tags": [
      "art",
      "wall",
      "canvas"
    ]
  },
  {
    "id": "decor-02",
    "name": "Macrame Wall Hanging",
    "category": "decoration",
    "styles": [
      "bohemian"
    ],
    "roomTypes": [
      "bedroom",
      "studio"
    ],
    "price_inr": 1200,
    "imageUrl": "https://placehold.co/600x400/C05A3A/FFFFFF?text=Macrame+Wall+Hanging",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb",
    "dimensions": {
      "lengthCm": 50,
      "widthCm": 2,
      "heightCm": 90
    },
    "platform": "Amazon",
    "buyUrl": "#",
    "tags": [
      "decor",
      "macrame",
      "handmade"
    ]
  },
  {
    "id": "decor-03",
    "name": "Vintage Round Mirror",
    "category": "decoration",
    "styles": [
      "traditional",
      "industrial"
    ],
    "roomTypes": [
      "living",
      "hallway"
    ],
    "price_inr": 3800,
    "imageUrl": "https://placehold.co/600x400/C05A3A/FFFFFF?text=Vintage+Round+Mirror",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb",
    "dimensions": {
      "lengthCm": 80,
      "widthCm": 5,
      "heightCm": 80
    },
    "platform": "Pepperfry",
    "buyUrl": "#",
    "tags": [
      "mirror",
      "wall"
    ]
  },
  {
    "id": "decor-04",
    "name": "Geometric Table Lamp",
    "category": "items",
    "styles": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living",
      "bedroom"
    ],
    "price_inr": 1999,
    "imageUrl": "https://placehold.co/600x400/C05A3A/FFFFFF?text=Geometric+Lamp",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb",
    "dimensions": {
      "lengthCm": 20,
      "widthCm": 20,
      "heightCm": 45
    },
    "platform": "Amazon",
    "buyUrl": "#",
    "tags": [
      "lamp",
      "table",
      "geometric"
    ]
  },
  {
    "id": "decor-05",
    "name": "Ceramic Vase Set",
    "category": "decoration",
    "styles": [
      "minimalist",
      "bohemian"
    ],
    "roomTypes": [
      "living",
      "dining"
    ],
    "price_inr": 2100,
    "imageUrl": "https://placehold.co/600x400/C05A3A/FFFFFF?text=Ceramic+Vase+Set",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb",
    "dimensions": {
      "lengthCm": 15,
      "widthCm": 15,
      "heightCm": 30
    },
    "platform": "Flipkart",
    "buyUrl": "#",
    "tags": [
      "vase",
      "ceramic",
      "tabletop"
    ]
  },
  {
    "id": "item-01",
    "name": "Minimalist Floor Lamp",
    "category": "items",
    "styles": [
      "minimalist",
      "modern"
    ],
    "roomTypes": [
      "living",
      "studio"
    ],
    "price_inr": 4999,
    "imageUrl": "https://placehold.co/600x400/F0EDE8/000000?text=Minimalist+Floor+Lamp",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb",
    "dimensions": {
      "lengthCm": 30,
      "widthCm": 30,
      "heightCm": 160
    },
    "platform": "Amazon",
    "buyUrl": "#",
    "tags": [
      "lamp",
      "lighting",
      "floor"
    ]
  },
  {
    "id": "item-02",
    "name": "Industrial Pendant Light",
    "category": "items",
    "styles": [
      "industrial"
    ],
    "roomTypes": [
      "dining",
      "kitchen"
    ],
    "price_inr": 2500,
    "imageUrl": "https://placehold.co/600x400/F0EDE8/000000?text=Pendant+Light",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb",
    "dimensions": {
      "lengthCm": 25,
      "widthCm": 25,
      "heightCm": 40
    },
    "platform": "Flipkart",
    "buyUrl": "#",
    "tags": [
      "light",
      "ceiling",
      "industrial"
    ]
  },
  {
    "id": "item-03",
    "name": "Smart Desk Organizer",
    "category": "items",
    "styles": [
      "modern",
      "minimalist"
    ],
    "roomTypes": [
      "study",
      "office"
    ],
    "price_inr": 1500,
    "imageUrl": "https://placehold.co/600x400/F0EDE8/000000?text=Desk+Organizer",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb",
    "dimensions": {
      "lengthCm": 30,
      "widthCm": 15,
      "heightCm": 10
    },
    "platform": "Amazon",
    "buyUrl": "#",
    "tags": [
      "organizer",
      "desk",
      "smart"
    ]
  },
  {
    "id": "item-04",
    "name": "Boho Floor Cushions (Set of 2)",
    "category": "items",
    "styles": [
      "bohemian"
    ],
    "roomTypes": [
      "living",
      "bedroom",
      "studio"
    ],
    "price_inr": 3200,
    "imageUrl": "https://placehold.co/600x400/F0EDE8/000000?text=Floor+Cushions",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb",
    "dimensions": {
      "lengthCm": 60,
      "widthCm": 60,
      "heightCm": 15
    },
    "platform": "UrbanLadder",
    "buyUrl": "#",
    "tags": [
      "cushion",
      "seating",
      "boho"
    ]
  },
  {
    "id": "item-05",
    "name": "Classic Table Clock",
    "category": "items",
    "styles": [
      "traditional",
      "industrial"
    ],
    "roomTypes": [
      "study",
      "bedroom"
    ],
    "price_inr": 900,
    "imageUrl": "https://placehold.co/600x400/F0EDE8/000000?text=Table+Clock",
    "glbUrl": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb",
    "dimensions": {
      "lengthCm": 15,
      "widthCm": 8,
      "heightCm": 15
    },
    "platform": "Amazon",
    "buyUrl": "#",
    "tags": [
      "clock",
      "tabletop",
      "vintage"
    ]
  }
];

// Export setup
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCT_CATALOG };
} else if (typeof window !== 'undefined') {
  window.PRODUCT_CATALOG = PRODUCT_CATALOG;
}
