/**
 * shared/roomPresets.js — TRIVERSE Room Preset Definitions
 * 6 room types with default dimensions, style suggestions, and environment data.
 * Dual export: CommonJS (backend) + browser global (frontend).
 */

const ROOM_PRESETS = [
  {
    id: 'living',
    label: 'Living Room',
    emoji: '🛋️',
    description: 'Main family space — sofas, coffee tables, TV units',
    defaultDims: { lengthCm: 400, widthCm: 350, heightCm: 280 },
    suggestedCategories: ['sofa', 'table', 'lamp', 'storage'],
    suggestedStyles: ['modern', 'traditional', 'scandinavian'],
    environmentImg: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80',
    accentColor: '#6c63ff',
  },
  {
    id: 'bedroom',
    label: 'Bedroom',
    emoji: '🛏️',
    description: 'Personal retreat — beds, wardrobes, bedside tables',
    defaultDims: { lengthCm: 350, widthCm: 300, heightCm: 270 },
    suggestedCategories: ['bed', 'storage', 'lamp', 'table'],
    suggestedStyles: ['minimalist', 'modern', 'bohemian'],
    environmentImg: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
    accentColor: '#e879f9',
  },
  {
    id: 'study',
    label: 'Study / Office',
    emoji: '💼',
    description: 'Productive workspace — desks, ergonomic chairs, shelves',
    defaultDims: { lengthCm: 300, widthCm: 250, heightCm: 270 },
    suggestedCategories: ['table', 'chair', 'storage', 'lamp'],
    suggestedStyles: ['minimalist', 'industrial', 'modern'],
    environmentImg: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80',
    accentColor: '#3ecf8e',
  },
  {
    id: 'dining',
    label: 'Dining Room',
    emoji: '🍽️',
    description: 'Gathering space — dining tables, chairs, pendant lights',
    defaultDims: { lengthCm: 350, widthCm: 300, heightCm: 270 },
    suggestedCategories: ['table', 'chair', 'lamp'],
    suggestedStyles: ['modern', 'traditional', 'industrial'],
    environmentImg: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=80',
    accentColor: '#f59e0b',
  },
  {
    id: 'kids',
    label: "Kid's Room",
    emoji: '🎨',
    description: 'Fun and functional — beds, study desks, storage',
    defaultDims: { lengthCm: 300, widthCm: 280, heightCm: 260 },
    suggestedCategories: ['bed', 'table', 'storage', 'chair'],
    suggestedStyles: ['modern', 'scandinavian', 'minimalist'],
    environmentImg: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=80',
    accentColor: '#ef4444',
  },
  {
    id: 'balcony',
    label: 'Balcony / Terrace',
    emoji: '🌿',
    description: 'Outdoor oasis — plant stands, outdoor chairs, small tables',
    defaultDims: { lengthCm: 200, widthCm: 150, heightCm: 250 },
    suggestedCategories: ['decor', 'chair', 'table'],
    suggestedStyles: ['bohemian', 'minimalist', 'scandinavian'],
    environmentImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    accentColor: '#22c55e',
  },
];

const STYLE_OPTIONS = [
  { id: 'modern',        label: 'Modern',        emoji: '🏙️' },
  { id: 'minimalist',    label: 'Minimalist',     emoji: '⬜' },
  { id: 'bohemian',      label: 'Bohemian',       emoji: '🌸' },
  { id: 'industrial',    label: 'Industrial',     emoji: '🔩' },
  { id: 'traditional',   label: 'Traditional',    emoji: '🏛️' },
  { id: 'scandinavian',  label: 'Scandinavian',   emoji: '🌲' },
];

const BUDGET_OPTIONS = [
  { id: 'budget',   label: 'Under ₹10K',    max: 10000  },
  { id: 'mid',      label: '₹10K – ₹30K',   max: 30000  },
  { id: 'premium',  label: '₹30K – ₹75K',   max: 75000  },
  { id: 'luxury',   label: '₹75K+',          max: 999999 },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ROOM_PRESETS, STYLE_OPTIONS, BUDGET_OPTIONS };
} else if (typeof window !== 'undefined') {
  window.ROOM_PRESETS    = ROOM_PRESETS;
  window.STYLE_OPTIONS   = STYLE_OPTIONS;
  window.BUDGET_OPTIONS  = BUDGET_OPTIONS;
}
