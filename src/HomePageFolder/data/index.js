import {
  Home, LayoutGrid, BarChart2, MapPin, ShoppingCart, FileText,
  MessageSquare, RotateCcw, Bookmark, Settings, HelpCircle,
  Search, TrendingUp, Zap, Clock
} from 'lucide-react';

// Import C from constants (named export)
import { C } from '../common/constants';

// ─── NAVIGATION ITEMS ────────────────────────────────────────────────
export const NAV_ITEMS = [
  { id: 'home',     label: 'Home',              Icon: Home },
  { id: 'cat',      label: 'Product Categories', Icon: LayoutGrid },
  { id: 'compare',  label: 'Compare Price',      Icon: BarChart2 },
  { id: 'nearby',   label: 'Nearby Sellers',     Icon: MapPin },
  { id: 'orders',   label: 'My Orders',          Icon: ShoppingCart },
  { id: 'invoice',  label: 'Invoice',            Icon: FileText },
  { id: 'msg',      label: 'Messages',           Icon: MessageSquare, badge: 3 },
  { id: 'saved',    label: 'Saved Suppliers',    Icon: Bookmark },
  { id: 'settings', label: 'Settings',           Icon: Settings },
  { id: 'help',     label: 'Help & Support',     Icon: HelpCircle },
];

// ─── QUICK ACTIONS ────────────────────────────────────────────────────
export const QUICK_ACTIONS = [
  { id: 1, label: 'Find Products',   desc: 'Browse wholesale items',     Icon: Search,       color: C.brand, bg: C.bLight },
  { id: 2, label: 'Compare Prices',  desc: 'Best deals across suppliers', Icon: BarChart2,    color: C.green, bg: C.gLight },
  { id: 3, label: 'Nearby Sellers',  desc: '24 suppliers within 5km',     Icon: MapPin,       color: C.brand, bg: C.bLight },
  { id: 4, label: 'My Orders',       desc: '3 orders in progress',        Icon: ShoppingCart, color: C.green, bg: C.gLight },
  { id: 5, label: 'Saved Suppliers', desc: '12 saved for quick access',   Icon: Bookmark,     color: C.brand, bg: C.bLight },
  { id: 6, label: 'Messages',        desc: '3 unread conversations',      Icon: MessageSquare,color: C.green, bg: C.gLight },
];

// ─── CATEGORIES ──────────────────────────────────────────────────────
export const CATEGORIES = [
  { name:"Grocery", sup:156, image:"https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=85" },
  { name:"Beverages", sup:89, image:"https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=500&q=85" },
  { name:"Snacks", sup:67, image:"https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=500&q=85" },
  { name:"Dairy", sup:45, image:"https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=85" },
  { name:"Personal Care", sup:123, image:"https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=85" },
  { name:"Household", sup:98, image:"https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=500&q=85" },
  { name:"Hardware", sup:145, image:"https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=500&q=85" },
  { name:"Electronics", sup:78, image:"https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=500&q=85" },
  { name:"Stationery", sup:56, image:"https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=500&q=85" },
  { name:"Medical", sup:167, image:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&q=85" },
  { name:"Agriculture", sup:89, image:"https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&q=85" },
  { name:"Packaging", sup:43, image:"https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=500&q=85" }
];

// ─── SUPPLIERS TABLE ─────────────────────────────────────────────────
export const SUPPLIERS_TABLE = [
  { rank: 1, name: "Metro Traders", rating: 4.9, reviews: 245, qty: "12 Units", brand: "Surf Excel", price: 238, isBest: true, connected: true },
  { rank: 2, name: "Global Mart Supply", rating: 4.7, reviews: 184, qty: "12 Units", brand: "Surf Excel", price: 241 },
  { rank: 3, name: "Raj Wholesale Hub", rating: 4.8, reviews: 156, qty: "12 Units", brand: "Surf Excel", price: 245 },
  { rank: 4, name: "Sri Venkat Stores", rating: 4.5, reviews: 98, qty: "12 Units", brand: "Surf Excel", price: 252 },
  { rank: 5, name: "Pioneer Wholesale", rating: 4.4, reviews: 76, qty: "12 Units", brand: "Surf Excel", price: 260 },
  { rank: 6, name: "Prime Distribution", rating: 4.6, reviews: 112, qty: "12 Units", brand: "Surf Excel", price: 264 },
  { rank: 7, name: "City Wholesale Mart", rating: 4.3, reviews: 65, qty: "12 Units", brand: "Surf Excel", price: 270 },
  { rank: 8, name: "Royal Supply Chain", rating: 4.5, reviews: 89, qty: "12 Units", brand: "Surf Excel", price: 275 },
];

// ─── FEATURED PRODUCTS ───────────────────────────────────────────────
export const FEATURED_PRODUCTS = [
  {
    name: 'Aashirvaad Atta 5KG',
    brand: 'ITC',
    image: 'https://www.starquik.com/cdn/shop/products/AashirvaadAtta5Kg.jpg',
    suppliers: [
      { name: 'Chennai Food Mart', price: 285 },
      { name: 'Tamil Nadu Wholesale Hub', price: 291 },
      { name: 'Sri Lakshmi Traders', price: 298 },
    ],
  },
  {
    name: 'Amul Butter 500G',
    brand: 'Amul',
    image: 'https://www.starquik.com/cdn/shop/products/AmulUnsaltedButter500gm.jpg',
    suppliers: [
      { name: 'Coimbatore Dairy Supply', price: 248 },
      { name: 'Madurai Retail Source', price: 255 },
      { name: 'Metro Provision Store', price: 262 },
    ],
  },
  {
    name: 'Haldirams Bhujia 400G',
    brand: 'Haldirams',
    image: 'https://m.media-amazon.com/images/I/71Y7y5c2RJL._SL1500_.jpg',
    suppliers: [
      { name: 'Salem Snack Distributors', price: 145 },
      { name: 'TN Grocery Network', price: 152 },
      { name: 'Royal Wholesale Mart', price: 158 },
    ],
  },
  {
    name: 'Tata Tea Premium 500G',
    brand: 'Tata',
    image: 'https://m.media-amazon.com/images/I/61g5qYQ7ZHL._SL1500_.jpg',
    suppliers: [
      { name: 'Chennai Beverage Traders', price: 198 },
      { name: 'Kovai Super Supply', price: 205 },
      { name: 'Sri Murugan Wholesale', price: 212 },
    ],
  },
];

// ─── NEARBY SELLERS ──────────────────────────────────────────────────
export const NEARBY_SELLERS = [
  { id: 1, name: 'Raj Wholesale Hub', cats: ['Grocery','Beverages','Snacks'], items: ['Biscuits','Dal','Rice','Oil'], rating: 4.8, reviews: 234, dist: '0.8 km', verified: true, delivery: 'Same Day' },
  { id: 2, name: 'Metro Super Traders', cats: ['Household','Personal Care'], items: ['Detergent','Soap','Shampoo'], rating: 4.6, reviews: 187, dist: '1.2 km', verified: true, delivery: '2–4 Hours' },
  { id: 3, name: 'Sri Venkat Stores', cats: ['Dairy','Beverages'], items: ['Milk','Curd','Paneer','Butter'], rating: 4.5, reviews: 156, dist: '2.1 km', verified: false, delivery: 'Next Day' },
];

// ─── RECENTLY VIEWED ─────────────────────────────────────────────────
export const RECENT_VIEWED = [
  { id:1, name:'Surf Excel 1KG', brand:'HUL', cat:'Household', price:238, orig:260, img:'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400' },
  { id:2, name:'Aashirvaad Atta 5KG', brand:'ITC', cat:'Grocery', price:285, orig:310, img:'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
  { id:3, name:'Haldirams Bhujia', brand:'Haldirams', cat:'Snacks', price:145, orig:165, img:'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400' },
  { id:4, name:'Amul Butter 500G', brand:'Amul', cat:'Dairy', price:248, orig:268, img:'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400' },
  { id:5, name:'Dettol Soap 125G', brand:'Reckitt', cat:'Personal Care', price:58, orig:68, img:'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400' }
];

// ─── REORDERS ─────────────────────────────────────────────────────────
export const REORDERS = [
  { id:'#1023', date:'Jun 14, 2025', supplier:'Raj Wholesale Hub', items:['Surf Excel 1KG ×12','Aashirvaad Atta 5KG ×5'], prev:3240, curr:3180, diff:-60 },
  { id:'#1018', date:'Jun 8, 2025', supplier:'Metro Super Traders', items:['Amul Butter 500G ×24','Britannia Milk Bikis ×30'], prev:7800, curr:7950, diff:+150 },
  { id:'#1009', date:'May 28, 2025', supplier:'Fresh Mart Wholesale', items:['Tata Salt 1KG ×20','Dettol Soap 125G ×40'], prev:4560, curr:4420, diff:-140 },
  { id:'#0998', date:'May 20, 2025', supplier:'City Wholesale Store', items:['Maggi Noodles ×50','Parle-G Biscuit ×40'], prev:2800, curr:2920, diff:+120 }
];

// ─── WHY FEATURES ────────────────────────────────────────────────────
export const WHY_FEATURES = [
  { Icon: TrendingUp, title: 'Better Pricing', desc: 'Compare across 500+ suppliers', color: '#EC4899' },
  { Icon: Zap, title: 'Fast Procurement', desc: 'Order in under 2 minutes', color: '#0EA5E9' },
  { Icon: MapPin, title: 'Nearby Discovery', desc: 'Suppliers within your area', color: '#EC4899' },
  { Icon: MessageSquare, title: 'Direct Connect', desc: 'Chat & call suppliers directly', color: '#0EA5E9' },
  { Icon: RotateCcw, title: 'Smart Reordering', desc: 'Repeat orders with one tap', color: '#EC4899' },
  { Icon: BarChart2, title: 'Price Intelligence', desc: 'Market insights at a glance', color: '#0EA5E9' },
];

// ─── HOW IT WORKS ────────────────────────────────────────────────────
export const HOW_IT_WORKS = [
  { Icon: TrendingUp, title: 'Compare Smart Pricing', desc: 'Instantly compare 500+ suppliers and find the best deal', color: '#EC4899' },
  { Icon: MapPin, title: 'Discover Nearby Suppliers', desc: 'See verified suppliers available in your area in real time', color: '#0EA5E9' },
  { Icon: MessageSquare, title: 'Connect & Order Instantly', desc: 'Chat, negotiate, and place orders without delays', color: '#EC4899' },
];