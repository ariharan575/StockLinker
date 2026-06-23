import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Package as Pack, MapPin, ShoppingCart, FileText, MessageSquare,
  RotateCcw, BarChart2, Bookmark, Settings, HelpCircle,
  Search, Globe, Bell, ChevronDown, Menu, Navigation,
  Star, Phone, ArrowRight, CheckCircle, Plus, ChevronRight,
  LayoutGrid, TrendingUp, Zap, Clock, Filter, Store, Shield, X, Truck, Warehouse, Radio
} from "lucide-react";

import { FaGithub, FaLinkedin , FaInstagram} from "react-icons/fa";

import HeroImges from "../../assets/Store.png";
import Surf from "../../assets/SurfExcel.jpg";

// ─── DESIGN TOKENS ──────────────────────────────────────────────────
const C = {
  brand:   '#EC4899',   // Pink-500 — primary identity accent (icon bg, active states, links)
  brandH:  '#DB2777',   // Pink-600 hover
  bLight:  '#FCE7F3',   // Pink-100 tint (icon bg — "important place" pink, per spec)
  bMid:    '#FBCFE8',   // Pink-200 (borders w/ brand tint)
  green:   '#0EA5E9',   // Sky-500 — secondary accent (value/info: verified, best-price, links)
  greenH:  '#0284C7',   // Sky-600 hover
  gLight:  '#E0F2FE',   // Sky-100 tint
  page:    '#FAFAFA',   // Outer page bg — neutral off-white
  card:    '#FFFFFF',   // Card / container
  head:    '#121214',   // Heading text — true near-black
  body:    '#52525B',   // Body text — neutral slate
  muted:   '#A1A1AA',   // Muted text
  bdr:     '#E4E4E7',   // Border
  sub:     '#F4F4F5',   // Section divider / subtle bg
};
// Primary CTA gradient — pink → rose → orange (the signature button treatment)
const CTA_GRAD = 'linear-gradient(to right, #EC4899, #F43F5E, #F97316)';
// Sidebar / dark-surface gradient — deep navy family
const SIDEBAR_GRAD = 'linear-gradient(to bottom, #132238, #17304d, #1b1b3a)';
// Lighter sky shades for readability against the dark navy surface
const SKY_300 = '#7DD3FC';
const SKY_400 = '#38BDF8';

// ─── TYPE SYSTEM ─────────────────────────────────────────────────────
const FONT_DISPLAY = "'Sora', 'Inter', sans-serif";   // headings — geometric, premium, distinctive
const FONT_BODY    = "'Inter', sans-serif";            // body copy — neutral, legible
const FONT_MONO    = "'JetBrains Mono', 'Menlo', monospace"; // prices, stats, data — fintech precision

const SMOOTH_EASE = [0.16, 1, 0.3, 1];

// ─── ELEVATION SYSTEM (violet-tinted, not flat black) ────────────────
const SHADOW = {
  xs:   '0 1px 2px rgba(18,18,20,0.05)',
  sm:   '0 2px 8px rgba(18,18,20,0.05), 0 1px 2px rgba(236,72,153,0.04)',
  md:   '0 8px 24px rgba(18,18,20,0.07), 0 2px 8px rgba(236,72,153,0.05)',
  lg:   '0 20px 48px rgba(18,18,20,0.12), 0 4px 16px rgba(236,72,153,0.08)',
  glow: '0 10px 30px rgba(236,72,153,0.35), 0 4px 14px rgba(249,115,22,0.20)',
  navy: '0 20px 50px rgba(19,34,56,0.35)',
};

// ─── MOTION SYSTEM ────────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1]; // premium "easeOutExpo" feel
const fadeUp   = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: EASE },
});
const lift = { y: -6, scale: 1.012, transition: { type: 'spring', stiffness: 320, damping: 22 } };

// ─── DATA ────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'home',     label: 'Home',              Icon: Home },
  { id: 'cat',      label: 'Product Categories', Icon: LayoutGrid },
  { id: 'compare',  label: 'Compare Price',      Icon: BarChart2 },
  { id: 'nearby',   label: 'Nearby Sellers',     Icon: MapPin },
  { id: 'orders',   label: 'My Orders',          Icon: ShoppingCart },
  { id: 'invoice',  label: 'Invoice',            Icon: FileText },
  { id: 'msg',      label: 'Messages',           Icon: MessageSquare, badge: 3 },
  // { id: 'reorder',  label: 'Reorder',            Icon: RotateCcw },
  { id: 'saved',    label: 'Saved Suppliers',    Icon: Bookmark },
  { id: 'settings', label: 'Settings',           Icon: Settings },
  { id: 'help',     label: 'Help & Support',     Icon: HelpCircle },
];

const QUICK_ACTIONS = [
  { id: 1, label: 'Find Products',   desc: 'Browse wholesale items',     Icon: Search,       color: C.brand, bg: C.bLight },
  { id: 2, label: 'Compare Prices',  desc: 'Best deals across suppliers',     Icon: BarChart2,    color: C.green, bg: C.gLight },
  { id: 3, label: 'Nearby Sellers',  desc: '24 suppliers within 5km',         Icon: MapPin,       color: C.brand, bg: C.bLight },
  { id: 4, label: 'My Orders',       desc: '3 orders in progress',            Icon: ShoppingCart, color: C.green, bg: C.gLight },
  { id: 5, label: 'Saved Suppliers', desc: '12 saved for quick access',       Icon: Bookmark,     color: C.brand, bg: C.bLight },
  { id: 6, label: 'Messages',        desc: '3 unread conversations',          Icon: MessageSquare,color: C.green, bg: C.gLight },
];

const CATEGORIES = [
  {
    name:"Grocery",
    sup:156,
    image:"https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=85"
  },
  {
    name:"Beverages",
    sup:89,
    image:"https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=500&q=85"
  },
  {
    name:"Snacks",
    sup:67,
    image:"https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=500&q=85"
  },
  {
    name:"Dairy",
    sup:45,
    image:"https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=85"
  },
  {
    name:"Personal Care",
    sup:123,
    image:"https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=85"
  },
  {
    name:"Household",
    sup:98,
    image:"https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=500&q=85"
  },
  {
    name:"Hardware",
    sup:145,
    image:"https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=500&q=85"
  },
  {
    name:"Electronics",
    sup:78,
    image:"https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=500&q=85"
  },
  {
    name:"Stationery",
    sup:56,
    image:"https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=500&q=85"
  },
  {
    name:"Medical",
    sup:167,
    image:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&q=85"
  },
  {
    name:"Agriculture",
    sup:89,
    image:"https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&q=85"
  },
  {
    name:"Packaging",
    sup:43,
    image:"https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=500&q=85"
  }
];

const SUPPLIERS_TABLE = [
  {
    rank: 1,
    name: "Metro Traders",
    rating: 4.9,
    reviews: 245,
    qty: "12 Units",
    brand: "Surf Excel",
    price: 238,
    isBest: true,
    connected: true,
  },
  {
    rank: 2,
    name: "Global Mart Supply",
    rating: 4.7,
    reviews: 184,
    qty: "12 Units",
    brand: "Surf Excel",
    price: 241,
  },
  {
    rank: 3,
    name: "Raj Wholesale Hub",
    rating: 4.8,
    reviews: 156,
    qty: "12 Units",
    brand: "Surf Excel",
    price: 245,
  },
  {
    rank: 4,
    name: "Sri Venkat Stores",
    rating: 4.5,
    reviews: 98,
    qty: "12 Units",
    brand: "Surf Excel",
    price: 252,
  },
  {
    rank: 5,
    name: "Pioneer Wholesale",
    rating: 4.4,
    reviews: 76,
    qty: "12 Units",
    brand: "Surf Excel",
    price: 260,
  },
  {
    rank: 6,
    name: "Prime Distribution",
    rating: 4.6,
    reviews: 112,
    qty: "12 Units",
    brand: "Surf Excel",
    price: 264,
  },
  {
    rank: 7,
    name: "City Wholesale Mart",
    rating: 4.3,
    reviews: 65,
    qty: "12 Units",
    brand: "Surf Excel",
    price: 270,
  },
  {
    rank: 8,
    name: "Royal Supply Chain",
    rating: 4.5,
    reviews: 89,
    qty: "12 Units",
    brand: "Surf Excel",
    price: 275,
  },
];

const FEATURED_PRODUCTS = [
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

const NEARBY_SELLERS = [
  { id: 1, name: 'Raj Wholesale Hub',    cats: ['Grocery','Beverages','Snacks'],   items: ['Biscuits','Dal','Rice','Oil'],      rating: 4.8, reviews: 234, dist: '0.8 km', verified: true,  delivery: 'Same Day' },
  { id: 2, name: 'Metro Super Traders',  cats: ['Household','Personal Care'],      items: ['Detergent','Soap','Shampoo'],       rating: 4.6, reviews: 187, dist: '1.2 km', verified: true,  delivery: '2–4 Hours' },
  { id: 3, name: 'Sri Venkat Stores',    cats: ['Dairy','Beverages'],              items: ['Milk','Curd','Paneer','Butter'],    rating: 4.5, reviews: 156, dist: '2.1 km', verified: false, delivery: 'Next Day' },
];

const RECENT_VIEWED = [
  {
    id:1,
    name:'Surf Excel 1KG',
    brand:'HUL',
    cat:'Household',
    price:238,
    orig:260,
    img:'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400'
  },

  {
    id:2,
    name:'Aashirvaad Atta 5KG',
    brand:'ITC',
    cat:'Grocery',
    price:285,
    orig:310,
    img:'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'
  },

  {
    id:3,
    name:'Haldirams Bhujia',
    brand:'Haldirams',
    cat:'Snacks',
    price:145,
    orig:165,
    img:'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400'
  },

  {
    id:4,
    name:'Amul Butter 500G',
    brand:'Amul',
    cat:'Dairy',
    price:248,
    orig:268,
    img:'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400'
  },

{
  id:5,
  name:'Dettol Soap 125G',
  brand:'Reckitt',
  cat:'Personal Care',
  price:58,
  orig:68,
  img:'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400'
}
];

const REORDERS = [
  { 
    id:'#1023',
    date:'Jun 14, 2025',
    supplier:'Raj Wholesale Hub',
    items:['Surf Excel 1KG ×12','Aashirvaad Atta 5KG ×5'],
    prev:3240,
    curr:3180,
    diff:-60
  },

  { 
    id:'#1018',
    date:'Jun 8, 2025',
    supplier:'Metro Super Traders',
    items:['Amul Butter 500G ×24','Britannia Milk Bikis ×30'],
    prev:7800,
    curr:7950,
    diff:+150
  },

  {
    id:'#1009',
    date:'May 28, 2025',
    supplier:'Fresh Mart Wholesale',
    items:['Tata Salt 1KG ×20','Dettol Soap 125G ×40'],
    prev:4560,
    curr:4420,
    diff:-140
  },

  {
    id:'#0998',
    date:'May 20, 2025',
    supplier:'City Wholesale Store',
    items:['Maggi Noodles ×50','Parle-G Biscuit ×40'],
    prev:2800,
    curr:2920,
    diff:+120
  }
];

const WHY_FEATURES = [
  { Icon: TrendingUp,    title: 'Better Pricing',      desc: 'Compare across 500+ suppliers', color: C.brand },
  { Icon: Zap,           title: 'Fast Procurement',    desc: 'Order in under 2 minutes',      color: C.green },
  { Icon: MapPin,        title: 'Nearby Discovery',    desc: 'Suppliers within your area',    color: C.brand },
  { Icon: MessageSquare, title: 'Direct Connect',      desc: 'Chat & call suppliers directly',color: C.green },
  { Icon: RotateCcw,     title: 'Smart Reordering',    desc: 'Repeat orders with one tap',    color: C.brand },
  { Icon: BarChart2,     title: 'Price Intelligence',  desc: 'Market insights at a glance',   color: C.green },
];


const HOW_IT_WORKS = [
  {
    Icon: TrendingUp,
    title: 'Compare Smart Pricing',
    desc: 'Instantly compare 500+ suppliers and find the best deal',
    color: C.brand,
  },
  {
    Icon: MapPin,
    title: 'Discover Nearby Suppliers',
    desc: 'See verified suppliers available in your area in real time',
    color: C.green,
  },
  {
    Icon: MessageSquare,
    title: 'Connect & Order Instantly',
    desc: 'Chat, negotiate, and place orders without delays',
    color: C.brand,
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────
function SectionHead({ title, sub, action }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: C.head, fontFamily: FONT_DISPLAY }}>{title}</h2>
        {sub && <p className="text-sm mt-1" style={{ color: C.muted, fontFamily: FONT_BODY }}>{sub}</p>}
      </div>
      {action && (
        <button className="flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: C.brand }}>
          {action} <ArrowRight style={{ width: 14, height: 14 }} />
        </button>
      )}
    </div>
  );
}

// ─── LOGO ─────────────────────────────────────────────────────────────
function Logo({ sm }) {
  const sz = sm ? 26 : 32;
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg width={sz} height={sz} viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#7C3AED"/>
            <stop offset="100%" stopColor="#A855F7"/>
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="#121214"/>
        <circle cx="10" cy="16" r="4.5" fill="white" opacity="0.95"/>
        <circle cx="22" cy="16" r="4.5" fill="white" opacity="0.95"/>
        <rect x="12" y="14" width="8" height="4" rx="2" fill="white"/>
        <circle cx="10" cy="16" r="2" fill="#121214"/>
        <circle cx="22" cy="16" r="2" fill="#121214"/>
        <circle cx="16" cy="7.5" r="2.5" fill="url(#logoGrad)"/>
        <rect x="15.25" y="10" width="1.5" height="3" rx="0.75" fill="url(#logoGrad)" opacity="0.7"/>
        <circle cx="16" cy="24.5" r="2.5" fill="#EC4899"/>
        <rect x="15.25" y="19" width="1.5" height="3" rx="0.75" fill="#EC4899" opacity="0.7"/>
      </svg>
      <span className={`font-bold tracking-tight ${sm ? 'text-base' : 'text-xl'}`} style={{ color: C.head, fontFamily: FONT_DISPLAY }}>
        Stock<span style={{
          backgroundImage: CTA_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Linker</span>
      </span>
    </div>
  );
}

// ─── HEADER ──────────────────────────────────────────────────────────
function Header({ open, setOpen }) {
  const [lang, setLang]   = useState(false);
  const [loc, setLoc]     = useState(false);
  const [notif, setNotif] = useState(false);
  const [prof, setProf]   = useState(false);

  const closeAll = () => { setLang(false); setLoc(false); setNotif(false); setProf(false); };

  const NOTIFS = [
    { msg: 'Price drop on Surf Excel 1KG',  time: '2 min ago',  dot: C.green  },
    { msg: 'New supplier in your area',      time: '1 hr ago',   dot: C.brand  },
    { msg: 'Order #1023 has been delivered', time: '3 hrs ago',  dot: C.green  },
    { msg: 'Invoice #INV-047 due tomorrow',  time: 'Yesterday',  dot: C.green },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        borderColor: C.bdr,
        boxShadow: SHADOW.sm,
        backgroundColor: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
      }}>
      <div className="flex items-center h-16 px-4 gap-3">

        {/* Hamburger + Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)}>
            <Menu style={{ width: 20, height: 20, color: C.body }} />
          </button>
          <div className="hidden lg:block"><Logo /></div>
          <div className="lg:hidden"><Logo sm /></div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl mx-2 lg:mx-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              style={{ width: 16, height: 16 }} />
            <input placeholder="Search products, suppliers, categories..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200"
              style={{ borderColor: C.bdr, color: C.body, fontFamily: FONT_BODY }}
              onFocus={e => { e.target.style.boxShadow = `0 0 0 3px ${C.bLight}`; e.target.style.borderColor = C.bMid; }}
              onBlur={e => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = C.bdr; }} />
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 ml-auto">

          {/* Language */}
          <div className="relative hidden md:block">
            <button onClick={() => { closeAll(); setLang(v => !v); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm"
              style={{ color: C.body }}>
              <Globe style={{ width: 15, height: 15 }} />
              <span className="hidden lg:inline font-medium text-xs ">ENG</span>
              <ChevronDown style={{ width: 12, height: 12 }} />
            </button>
            <AnimatePresence>
              {lang && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl border py-1 z-50"
                  style={{ borderColor: C.bdr, boxShadow: SHADOW.md }}>
                  {['English', 'தமிழ் (Tamil)'].map(l => (
                    <button key={l} onClick={() => setLang(false)}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors"
                      style={{ color: C.body }}>{l}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Location */}
          <div className="relative hidden md:block">
            <button onClick={() => { closeAll(); setLoc(v => !v); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm"
              style={{ color: C.body }}>
              <MapPin style={{ width: 15, height: 15 }} />
              <span className="hidden lg:inline text-sm font-medium">Chennai</span>
              <ChevronDown style={{ width: 12, height: 12 }} />
            </button>
            <AnimatePresence>
              {loc && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border py-1 z-50"
                  style={{ borderColor: C.bdr, boxShadow: SHADOW.md }}>
                  {[['Current Location', Navigation], ['Nearby Areas', MapPin], ['Search Location', Search]].map(([label, LIcon]) => (
                    <button key={label} onClick={() => setLoc(false)}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-2.5"
                      style={{ color: C.body }}>
                      <LIcon style={{ width: 13, height: 13, color: C.muted }} />{label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Settings style={{ width: 22, height: 22, color: C.muted }} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => { closeAll(); setNotif(v => !v); }}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
              <Bell style={{ width: 22, height: 22, color: C.muted }} />
              <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">4</span>
            </button>
            <AnimatePresence>
              {notif && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border py-2 z-50"
                  style={{ borderColor: C.bdr, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}>
                  <div className="px-4 py-2 border-b flex items-center justify-between" style={{ borderColor: C.sub }}>
                    <span className="text-sm font-bold" style={{ color: C.head }}>Notifications</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: C.bLight, color: C.brand }}>4 new</span>
                  </div>
                  {NOTIFS.map((n, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-slate-50 flex gap-3 cursor-pointer transition-colors">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: n.dot }} />
                      <div>
                        <p className="text-sm" style={{ color: C.body }}>{n.msg}</p>
                        <p className="text-xs mt-0.5" style={{ color: C.muted }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => { closeAll(); setProf(v => !v); }}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-sm"
                  style={{
                    background: "linear-gradient(135deg,#64748B,#334155)"
                  }}
                >
                  A
                </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold leading-none" style={{ color: C.head }}>Boomathi</p>
                <p className="text-[10px] mt-0.5" style={{ color: C.muted }}>Retailer</p>
              </div>
              <ChevronDown style={{ width: 12, height: 12, color: C.muted }} />
            </button>
            <AnimatePresence>
              {prof && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border py-1 z-50"
                  style={{ borderColor: C.bdr, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: C.sub }}>
                    <p className="text-sm font-bold" style={{ color: C.head }}>Boomathi S</p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>boomathi@kirana.in</p>
                  </div>
                  {['My Profile','Business Profile','Account Settings'].map(item => (
                    <button key={item} className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors"
                      style={{ color: C.body }}>{item}</button>
                  ))}
                  <div className="border-t mx-2 my-1" style={{ borderColor: C.sub }} />
                  <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 transition-colors text-red-500">
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────
function Sidebar({ open, setOpen, active, setActive }) {
  return (
    <>
      {/* OVERLAY FOR MOBILE */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden "
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 z-40 flex flex-col
          bg-gradient-to-b from-[#0f1b2d] via-[#132a44] to-[#101426] mt-3.5 border-r border-white/[0.04]
          transition-transform duration-300 ease-in-out rounded-r-xl
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
        }}
      >
        {/* NAV */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, Icon, badge }) => {
            const isActive = active === id;

            return (
              <motion.button
                key={id}
                onClick={() => {
                  setActive(id);
                  // Optional: Automatically close sidebar on mobile after clicking a link
                  if (window.innerWidth < 1024) setOpen(false);
                }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium relative group transition-all duration-200
                  ${
                    isActive
                      ? "text-white bg-white/[0.08] border border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
                      : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
                  }
                `}
                style={{ fontFamily: typeof FONT_BODY !== 'undefined' ? FONT_BODY : 'inherit' }}
              >
                {/* ICON */}
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-white/40 group-hover:text-white/80"
                  }`}
                />

                {/* LABEL */}
                <span className="flex-1 text-left tracking-wide">
                  {label}
                </span>

                {/* BADGE */}
                {badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-indigo-500/15 text-indigo-300 group-hover:bg-indigo-500/25"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* LOGOUT SECTION */}
        <div className="p-4 border-t border-white/[0.04] mt-auto">
          <motion.button
            onClick={() => {
              // Add your logout logic here
              console.log("Logout clicked");
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium relative group transition-all duration-200 text-white/70 hover:text-red-400 hover:bg-red-500/[0.08] border border-transparent"
            style={{ fontFamily: typeof FONT_BODY !== 'undefined' ? FONT_BODY : 'inherit' }}
          >
            {/* LOGOUT ICON */}
            <svg
              className="w-[18px] h-[18px] flex-shrink-0 text-white/40 group-hover:text-red-400/80 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>

            {/* LOGOUT LABEL */}
            <span className="flex-1 text-left tracking-wide">
              Logout
            </span>
          </motion.button>
        </div>
      </aside>
    </>
  );
}

function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative w-full overflow-hidden rounded-[24px] lg:rounded-[32px] mb-8 bg-white border border-[#F1F1F4]"
      style={{ height: "320px", boxShadow: "0 30px 70px rgba(15,23,42,0.06)" }}
    >
      {/* Premium Aura Gradients */}
      <div 
        className="absolute -top-40 -right-20 w-[450px] h-[450px] rounded-full blur-[100px] opacity-[0.12] pointer-events-none z-0" 
        style={{ background: "#FF4D8D" }} 
      />
      <div 
        className="absolute -bottom-32 -left-20 w-[350px] h-[350px] rounded-full blur-[100px] opacity-[0.10] pointer-events-none z-0" 
        style={{ background: "#e1d6d3" }} 
      />

      {/* MAIN WRAPPER */}
      <div className="relative z-10 flex h-full w-full">
        
        {/* LEFT COLUMN (Text & Search) */}
        <div className="w-full lg:w-[55%] h-full px-6 sm:px-10 lg:px-10 flex flex-col justify-center relative z-20">
          
{/* Typographic Hierarchy */}
<div className="flex flex-col gap-1">
  <h2 className="text-[12px] sm:text-[13px] font-bold tracking-[0.25em] uppercase text-[#8CA3BA]">
    Welcome Back,
  </h2>

  <h1 className="text-[42px] sm:text-[48px] lg:text-[54px] ps-0.5 font-black leading-[1.05] tracking-[-0.025em] select-none" style={{fontFamily:'"Clash Display","Satoshi","Plus Jakarta Sans","Inter",sans-serif'}}>
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF3D81] via-[#FF5C7A] to-[#FF9A5C] drop-shadow-[0_6px_18px_rgba(255,77,141,0.18)]">
      Boomathi
    </span>
  </h1>
</div>

          {/* Description */}
          <p className="mt-3 lg:mt-4 text-[14px] sm:text-[15px] text-[#6B7280] font-medium leading-relaxed max-w-[480px]">
            Discover verified wholesalers, compare prices instantly, and manage every purchase from one intelligent sourcing platform.
          </p>

          {/* Search Bar Action */}
          <motion.div 
            whileHover={{ y: -2 }} 
            className="mt-6 flex items-center w-full max-w-[500px] h-[52px] sm:h-[56px] rounded-full bg-white border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:shadow-[0_8px_30px_rgba(255,77,141,0.12)] focus-within:border-[#FF4D8D]/30 transition-all duration-300 overflow-hidden"
          >
            <Search className="ml-5 w-5 h-5 text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search products, suppliers, categories..." 
              className="flex-1 h-full px-3 bg-transparent text-[14px] font-medium text-gray-800 placeholder:text-gray-400 outline-none border-none focus:ring-0"
              style={{ fontFamily: '"Inter", -apple-system, sans-serif' }}
            />
            <button 
              className="mr-1.5 w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] rounded-full flex items-center justify-center text-white transition-transform duration-300 hover:scale-105 active:scale-95 shrink-0 shadow-md" 
              style={{ background: "linear-gradient(135deg, #FF4D8D, #FF7A59)" }}
            >
              <Search className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* RIGHT COLUMN (Image - Strictly Hidden on Mobile/Tablet) */}
        <div className="hidden lg:flex relative w-[45%] h-full items-center justify-center p-3.5 z-10">
          <motion.img 
            initial={{ scale: 1.05, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 1, ease: EASE }} 
            src={HeroImges} 
            alt="StockLinker Platform" 
            className="w-full h-full object-cover object-center rounded-[24px] shadow-sm" 
          />
          {/* Luxury Blend Fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent pointer-events-none" />
        </div>
        
      </div>
    </motion.section>
  );
}


// ─── QUICK ACTIONS ───────────────────────────────────────────────────
function QuickActions() {
  return (
    <section className="mb-8 ps-2">
      <SectionHead title="Quick Actions" sub="Jump right into what you need" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {QUICK_ACTIONS.map((a, i) => (
          <motion.button
            key={a.id}
            {...fadeUp(i * 0.05)}
            whileHover={{
              y: -5,
              scale: 1.02,
              boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
              transition: { duration: 0.15, ease: "easeOut" }
            }}
            whileTap={{
              scale: 0.96,
              y: 0,
              boxShadow: "0 5px 15px rgba(41, 105, 255, 0.12)"
            }}
            className="
              group bg-white rounded-2xl p-4 text-left
              border border-slate-100
              hover:border-slate-300
              active:border-slate-400
              transition-all duration-150
              ease-out
              focus:outline-none
            "
            style={{
              boxShadow: "5px 8px 24px rgba(44, 47, 52, 0.15)"
            }}
          >
            <div
              className="
                w-11 h-11 rounded-xl flex items-center justify-center mb-3
                transition-all duration-150
                group-hover:scale-110
                group-hover:shadow-md
              "
              style={{ backgroundColor: a.bg }}
            >
              <a.Icon
                className="transition-transform duration-150 group-hover:rotate-6"
                style={{ width: 20, height: 20, color: a.color }}
              />
            </div>

            <p
              className="
                text-sm font-semibold leading-tight
                tracking-tight
                transition-colors duration-150
                group-hover:text-slate-900
              "
              style={{ color: C.head }}
            >
              {a.label}
            </p>

            <p
              className="text-xs mt-1 leading-snug"
              style={{ color: C.muted }}
            >
              {a.desc}
            </p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

// ─── PRODUCT CATEGORIES ──────────────────────────────────────────────
function Categories() {
  return (
    <section className="mb-8">

      <SectionHead
        title="Product Categories"
        sub="Browse wholesale products by category"
        action="View All"
      />


      <div className="
        grid
        grid-cols-3
        sm:grid-cols-4
        md:grid-cols-6
        gap-3
      ">

        {CATEGORIES.map((cat,i)=>(

          <motion.button

            key={cat.name}

            initial={{
              opacity:0,
              y:15
            }}

            whileInView={{
              opacity:1,
              y:0
            }}

            viewport={{
              once:true
            }}

            transition={{
              delay:i*.03,
              duration:.45,
              ease:[.22,1,.36,1]
            }}


            whileHover={{
              y:-7,
              scale:1.03
            }}

            whileTap={{
              scale:.97
            }}


            className="
              group
              relative
              overflow-hidden

              rounded-[24px]

              bg-white

              border
              border-slate-200/80

              p-2.5

              shadow-[0_8px_25px_rgba(15,23,42,.06)]

              hover:border-pink-200

              hover:shadow-[0_22px_55px_rgba(236,72,153,.16)]

              transition-all
              duration-200
            "
          >


            <div
              className="
                absolute
                inset-0

                opacity-0
                group-hover:opacity-100

                bg-gradient-to-br
                from-pink-50/80
                via-transparent
                to-blue-50/70

                transition-opacity
                duration-200
              "
            />



            <div className="relative z-10">


              {/* Product Image */}

              <div
                className="
                  w-full
                  h-[78px]

                  rounded-[18px]

                  overflow-hidden

                  bg-slate-100

                  border
                  border-slate-100

                  mb-3

                  shadow-sm
                "
              >

                <img

                  src={cat.image}

                  alt={cat.name}

                  className="
                    w-full
                    h-full

                    object-cover

                    group-hover:scale-110

                    transition-transform
                    duration-500
                  "

                />


                <div
                  className="
                    absolute
                    inset-x-0
                    top-0

                    h-16

                    bg-gradient-to-b
                    from-white/20
                    to-transparent
                  "
                />

              </div>




              {/* Category Name */}

              <p
                className="
                  text-[11px]
                  sm:text-xs

                  font-semibold

                  text-slate-800

                  tracking-tight

                  truncate

                  group-hover:text-pink-600

                  transition-colors
                "
              >
                {cat.name}
              </p>



              {/* Supplier */}

              <span
                className="
                  inline-flex

                  mt-2

                  rounded-full

                  px-2.5
                  py-[3px]

                  text-[9px]

                  font-semibold

                  bg-emerald-50

                  text-emerald-600

                  border
                  border-emerald-100

                  group-hover:bg-emerald-100

                  transition
                "
              >

                {cat.sup} suppliers

              </span>



            </div>


          </motion.button>

        ))}

      </div>

    </section>
  );
}

// ─── PRICE COMPARISON TABLE ──────────────────────────────────────────

function PriceComparison(){
const [showMore,setShowMore]=useState(false);
const suppliers=showMore?SUPPLIERS_TABLE:SUPPLIERS_TABLE.slice(0,5);

return(
<section className="mb-8">
<SectionHead title="Compare Supplier Prices" sub="Find the best wholesale deal instantly" action="View All"/>

<div className="bg-white rounded-3xl border overflow-hidden" style={{borderColor:C.sub,boxShadow:"0 15px 40px rgba(15,23,42,.06)"}}>
<div className="p-3 sm:p-4 lg:p-5 flex flex-col xl:flex-row gap-4">

<div className="w-full xl:w-[270px] shrink-0 rounded-2xl border bg-slate-50/70 p-3" style={{borderColor:C.sub}}>

<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center overflow-hidden shrink-0 xl:w-full h-25 w-30 xl:h-56" style={{borderColor:C.sub}}>
<img src={Surf} alt="Surf Excel Matic Liquid" className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition"/>
</div>

<div className="xl:hidden flex-1 min-w-0">
<h3 className="text-xs font-semibold truncate" style={{color:C.head}}>Surf Excel Matic Liquid</h3>
<p className="text-[10px]" style={{color:C.muted}}>1 KG · Pack of 12 Units</p>
<div className="flex gap-3 mt-1">
<span className="text-[10px]" style={{color:C.muted}}>₹290</span>
<span className="text-[10px] font-semibold" style={{color:"#FF2D7A"}}>Save ₹52 (18%)</span>
</div>
</div>
</div>

<div className="hidden xl:block">
<h3 className="text-sm font-semibold mt-3" style={{color:C.head}}>Surf Excel Matic Liquid</h3>
<p className="text-[11px]" style={{color:C.muted}}>1 KG · Pack of 12 Units</p>
<div className="mt-3 pt-3 border-t flex justify-between" style={{borderColor:C.sub}}>
<div>
<p className="text-[9px]" style={{color:C.muted}}>Market Price</p>
<p className="text-xs font-bold text-gray-400 line-through">₹290</p>
</div>
<div className="text-right">
<p className="text-[9px]" style={{color:C.muted}}>You Save</p>
<p className="text-xs font-bold" style={{color:"#FF2D7A"}}>₹52 (18%)</p>
</div>
</div>
</div>

</div>

<div className="flex-1 min-w-0">

<div className="hidden md:grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-bold uppercase" style={{color:C.muted}}>
<div className="col-span-5">Supplier</div>
<div className="col-span-2 text-center">Qty</div>
<div className="col-span-2 text-center">Brand</div>
<div className="col-span-1 text-center">Price</div>
<div className="col-span-2 text-right">Action</div>
</div>

<div className="overflow-x-auto custom-scroll pb-2">
<div className="min-w-[720px] space-y-2">

{suppliers.map((s,i)=>
<motion.div key={s.rank} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*.03}}
className="grid grid-cols-12 items-center gap-2 px-3 py-2 rounded-xl border hover:shadow-lg transition"
style={{borderColor:s.isBest?"#10B981":C.sub,background:s.isBest?"linear-gradient(90deg,#F0FDFA,#fff)":"white"}}>

<div className="col-span-5 flex items-center gap-2">
<div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0" style={{background:"linear-gradient(135deg,#38BDF8,#EC4899,#FB7185)"}}>
{s.name.slice(0,2)}
</div>
<div>
<p className="text-xs font-semibold truncate" style={{color:C.head}}>{s.name}</p>
<div className="flex items-center gap-1">
<Star className="w-3 h-3" fill="#FBBF24" color="#FBBF24"/>
<span className="text-[10px]" style={{color:C.muted}}>{s.rating} ({s.reviews})</span>
</div>
</div>
</div>

<div className="col-span-2 text-center text-xs">{s.qty}</div>
<div className="col-span-2 text-center text-xs">{s.brand}</div>

<div className="col-span-1 text-center">
<span className="text-sm font-bold" style={{color:s.isBest?"#10B981":C.head}}>₹{s.price}</span>
</div>

<div className="col-span-2 flex justify-end gap-1.5">
<button className="p-1.5 rounded-lg border" style={{borderColor:C.sub}}><MessageSquare className="w-3.5 h-3.5" color={C.muted}/></button>
<button className="p-1.5 rounded-lg border" style={{borderColor:C.sub}}><Phone className="w-3.5 h-3.5" color={C.muted}/></button>
<button className="px-3 py-1.5 rounded text-[11px] font-bold text-white whitespace-nowrap" style={{background:CTA_GRAD}}>Order Now</button>
</div>

</motion.div>
)}

</div>
</div>

<button onClick={()=>setShowMore(!showMore)} className="mt-3 w-full py-2 rounded-xl border text-xs font-semibold" style={{borderColor:C.sub,color:C.muted}}>
{showMore?"Show Less Suppliers":"View More Suppliers"}
<ChevronDown className={`inline ml-1 w-3.5 h-3.5 ${showMore?"rotate-180":""}`}/>
</button>

</div>
</div>
</div>

<style jsx>{`
.custom-scroll::-webkit-scrollbar{
height:1px;
}
.custom-scroll::-webkit-scrollbar-thumb{
background:#f472b6;
border-radius:20px;
}
.custom-scroll::-webkit-scrollbar-track{
background:transparent;
}
.custom-scroll{
scrollbar-width:thin;
}
`}</style>

</section>
)
}

// ─── FEATURED PRODUCT COMPARISONS ────────────────────────────────────
function FeaturedComparisons() {
  return (
    <section className="mb-8">
      <SectionHead title="Featured Comparisons" sub="Top products with live supplier pricing" action="View All" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURED_PRODUCTS.map((p, i) => (
          <motion.div
            key={p.name}
            whileHover={{
              y: -6,
              scale: 1.015,
              boxShadow: "0 22px 50px rgba(15,23,42,0.12)"
            }}
            transition={{
              duration:0.18,
              ease:"easeOut"
            }}
            className="
              bg-white
              rounded-2xl
              p-4
              border
              border-slate-100
              transition-all
              duration-200
              hover:border-slate-200
            "
            style={{
              boxShadow:"0 8px 30px rgba(15,23,42,0.06)"
            }}
          >


            <div className="flex items-center gap-3 mb-4">

              <div
                className="
                  w-14
                  h-14
                  rounded-xl
                  overflow-hidden
                  flex
                  items-center
                  justify-center
                  bg-gradient-to-br
                  from-slate-50
                  to-slate-100
                  shadow-sm
                "
              >
                <img
                  src={Surf}
                  alt={p.name}
                  className="
                    w-full
                    h-full
                    object-contain
                    p-1
                    transition-transform
                    duration-300
                    hover:scale-110
                  "
                />
              </div>


              <div className="min-w-0">
                <p
                  className="text-sm font-semibold leading-tight truncate"
                  style={{color:C.head}}
                >
                  {p.name}
                </p>

                <p
                  className="text-xs mt-1"
                  style={{color:C.muted}}
                >
                  {p.brand}
                </p>
              </div>

            </div>



            <div className="space-y-2 mb-4">

              {p.suppliers.map((s,pi)=>(

                <motion.div
                  key={s.name}
                  whileHover={{
                    x:3,
                    scale:1.01
                  }}
                  transition={{
                    duration:0.15
                  }}
                  className="
                    flex
                    items-center
                    justify-between
                    px-3
                    py-2
                    rounded-xl
                    border
                    transition-all
                  "
                  style={{
                    backgroundColor:pi===0 ? "#F0FDF4" : "#F8FAFC",
                    borderColor:pi===0 ? "#22c55e40" : "#E5E7EB"
                  }}
                >

                  <span className="text-[11px] font-medium text-slate-500 truncate max-w-[120px]">
                    {s.name}
                  </span>


                  <div className="flex items-center gap-1.5">

                    <span
                      className="text-sm font-bold"
                      style={{
                        color:pi===0 ? C.green : C.head,
                        fontFamily:FONT_MONO
                      }}
                    >
                      ₹{s.price}
                    </span>


                    {pi===0 && (
                      <span
                        className="
                          text-[9px]
                          font-bold
                          px-1.5
                          py-0.5
                          rounded
                        "
                        style={{
                          background:
                          "linear-gradient(135deg,#ec4899,#f43f5e,#fb923c)",
                          color:"#fff"
                        }}
                      >
                        BEST
                      </span>
                    )}

                  </div>

                </motion.div>

              ))}

            </div>




            <div className="flex gap-2">


              <button
                onClick={()=>{}}
                className="
                  flex-1
                  flex
                  items-center
                  justify-center
                  py-2.5
                  text-xs
                  font-semibold
                  rounded
                  border
                  border-slate-200
                  text-slate-700
                  bg-white
                  cursor-pointer
                  transition-all
                  duration-200
                  hover:bg-slate-50
                  hover:-translate-y-0.5
                  active:scale-95
                "
              >
                Compare
              </button>



              <button
                onClick={()=>{}}
                className="
                  flex-1
                  py-2
                  text-xs
                  font-bold
                  text-white
                  rounded
                  cursor-pointer
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-lg
                  active:scale-95
                "
                style={{
                  background:
                  "linear-gradient(135deg,#ec4899,#f43f5e,#fb923c)"
                }}
              >
                Details
              </button>


            </div>


          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── NEARBY SELLERS ───────────────────────────────────────────────────
function NearbySellers() {
  return (
    <section className="mb-8">
      <SectionHead title="Nearby Sellers" sub="Suppliers within your delivery zone" action="View All" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {NEARBY_SELLERS.map((s, i) => (
          <motion.div
            key={s.id}
            {...fadeUp(i * 0.09)}
            whileHover={{ y: -4, boxShadow: "0 18px 45px rgba(15,23,42,0.12)" }}
            className="bg-white rounded-2xl p-5 border border-slate-100 transition-all"
            style={{ boxShadow: "0 8px 25px rgba(15,23,42,0.06)" }}
          >

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">

                {/* Premium Logo */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-sm"
                  style={{
                    background: "linear-gradient(135deg,#64748B,#334155)"
                  }}
                >
                  {s.name[0]}
                </div>


                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-slate-900">
                      {s.name}
                    </p>

                    {s.verified && (
                      <CheckCircle
                        style={{
                          width:14,
                          height:14,
                          color:"#22C55E"
                        }}
                      />
                    )}
                  </div>


                  <div className="flex items-center gap-1 mt-0.5">
                    <Star
                      style={{
                        width:11,
                        height:11,
                        fill:"#FBBF24",
                        color:"#FBBF24"
                      }}
                    />

                    <span className="text-xs font-semibold text-slate-700">
                      {s.rating}
                    </span>

                    <span className="text-xs text-slate-400">
                      ({s.reviews} reviews)
                    </span>
                  </div>

                </div>
              </div>


              {/* Distance */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100">

                <Navigation
                  style={{
                    width:12,
                    height:12,
                    color:"#64748B"
                  }}
                />

                <span className="text-xs font-semibold text-slate-600">
                  {s.dist}
                </span>

              </div>

            </div>


            {/* Categories */}
            <div className="flex flex-wrap gap-1.5 mb-3">

              {s.cats.map(c => (
                <span
                  key={c}
                  className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-rose-50 text-rose-600"
                >
                  {c}
                </span>
              ))}

            </div>


            <p className="text-xs mb-3 text-slate-400">
              {s.items.slice(0,3).join(" · ")} &amp; more
            </p>



            {/* Delivery */}
            <div className="flex items-center gap-1.5 mb-4">

              <Clock
                style={{
                  width:13,
                  height:13,
                  color:"#94A3B8"
                }}
              />

              <span className="text-xs text-slate-400">
                Delivery:
              </span>

              <span className="text-xs font-semibold text-slate-700">
                {s.delivery}
              </span>

            </div>



            {/* Actions */}
            <div className="flex gap-2">


              {/* Call */}
              <button
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all"
              >
                <Phone size={13}/>
                Call
              </button>



              {/* Message */}
              <button
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all"
              >
                <MessageSquare size={13}/>
                Message
              </button>



              {/* Visit Store */}
              <button
                className="flex-1 py-2.5 text-xs font-bold text-white rounded hover:opacity-90 transition-all shadow-sm"
                style={{
                  background:
                  "linear-gradient(135deg,#ec4899,#f43f5e,#f97316)"
                }}
              >
                Visit Store
              </button>


            </div>


          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── RECENTLY VIEWED ──────────────────────────────────────────────────
function RecentlyViewed() {
  return (
    <section className="mb-8">

      <SectionHead 
        title="Recently Viewed" 
        sub="Continue where you left off" 
        action="View All" 
      />


      <div 
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth:'none' }}
      >

        {RECENT_VIEWED.map((p,i)=>(
          <motion.div
            key={p.id}
            initial={{opacity:0,x:16}}
            whileInView={{opacity:1,x:0}}
            viewport={{once:true,margin:"-40px"}}
            transition={{
              delay:i*0.06,
              duration:0.45,
              ease:EASE
            }}

            whileHover={{
              y:-5,
              boxShadow:"0 20px 45px rgba(15,23,42,0.12)"
            }}

            className="
              flex-shrink-0 
              bg-white 
              rounded-2xl 
              p-4 
              border 
              border-slate-100
              transition-all
            "

            style={{
              width:168,
              boxShadow:"0 8px 25px rgba(15,23,42,0.06)"
            }}
          >


            {/* Product Image */}

            <div
              className="
                w-full 
                h-20 
                rounded-xl 
                bg-slate-50
                flex 
                items-center 
                justify-center 
                mb-3
                overflow-hidden
              "
            >

              <img
                src={p.img}
                alt={p.name}
                className="
                  h-full
                  w-full
                  object-contain
                  p-2
                  hover:scale-105
                  transition-transform
                "
              />

            </div>



            {/* Product Info */}

            <p className="text-xs font-semibold text-slate-900 leading-snug">
              {p.name}
            </p>


            <p className="text-[10px] mt-0.5 text-slate-400">
              {p.brand} · {p.cat}
            </p>



            {/* Price */}

            <div className="flex items-center gap-2 mt-2 mb-3">

              <span 
                className="text-sm font-bold text-emerald-600"
                style={{fontFamily:FONT_MONO}}
              >
                ₹{p.price}
              </span>


              <span
                className="text-[10px] line-through text-slate-400"
                style={{fontFamily:FONT_MONO}}
              >
                ₹{p.orig}
              </span>


              <span
                className="
                  text-[10px]
                  font-bold
                  px-1.5
                  py-0.5
                  rounded-full
                  bg-emerald-50
                  text-emerald-600
                "
              >
                {Math.round((p.orig-p.price)/p.orig*100)}% off
              </span>

            </div>




            {/* Buttons */}

            <div className="flex gap-1.5">


              <button
                className="
                  flex-1
                  py-1.5
                  text-[10px]
                  font-semibold
                  rounded
                  border
                  border-slate-200
                  text-slate-700
                  bg-white
                  hover:bg-slate-50
                  transition-all
                "
              >
                View
              </button>



              <button
                className="
                  flex-1
                  py-1.5
                  text-[10px]
                  font-bold
                  text-white
                  rounded
                  transition-all
                  hover:opacity-90
                  shadow-sm
                "

                style={{
                  background:
                  "linear-gradient(135deg,#ec4899,#f43f5e,#f97316)"
                }}
              >
                Order
              </button>


            </div>


          </motion.div>
        ))}

      </div>

    </section>
  );
}

// ─── REORDER ─────────────────────────────────────────────────────────
function ReorderSection() {
  return (
    <section className="mb-8">

      <SectionHead
        title="Quick Reorder"
        sub="Repeat your recent purchases instantly"
        action="Order History"
      />


      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          xl:grid-cols-3
          gap-5
        "
      >

        {REORDERS.map((o, i) => (

          <motion.div

            key={o.id}

            {...fadeUp(i * 0.1)}

            className={`
              bg-white
              rounded-2xl
              p-5
              border
              border-slate-100
              transition-all

              ${i === 3 ? "hidden sm:block" : ""}
              xl:${i === 3 ? "hidden" : ""}
            `}


            whileHover={{
              y:-5,
              boxShadow:"0 22px 50px rgba(15,23,42,0.12)"
            }}

            transition={{
              duration:0.35,
              ease:EASE
            }}

            style={{
              boxShadow:"0 8px 28px rgba(15,23,42,0.06)"
            }}

          >



            {/* Header */}

            <div className="flex items-center justify-between mb-3">


              <div className="flex items-center gap-2">


                <span className="text-sm font-semibold text-slate-900">
                  Order {o.id}
                </span>


                <span
                  className="
                    px-2
                    py-0.5
                    text-[10px]
                    font-medium
                    rounded-full
                    bg-slate-100
                    text-slate-500
                  "
                >
                  {o.date}
                </span>


              </div>



              <span className="text-xs font-medium text-slate-400">
                {o.supplier}
              </span>


            </div>






            {/* Items */}

            <div className="space-y-1.5 mb-4">


              {o.items.map(item => (

                <div
                  key={item}
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <div
                    className="
                      w-1.5
                      h-1.5
                      rounded-full
                      bg-slate-300
                      flex-shrink-0
                    "
                  />


                  <span className="text-xs text-slate-600">
                    {item}
                  </span>


                </div>

              ))}


            </div>






            {/* Price Comparison */}


            <div
              className="
                flex
                items-center
                gap-3
                p-3.5
                rounded-2xl
                mb-4
                bg-slate-50
                border
                border-slate-100
              "
            >


              <div className="flex-1">


                <p className="text-xs text-slate-400">
                  Previous Price
                </p>


                <p className="text-sm font-bold text-slate-800">
                  ₹{o.prev.toLocaleString()}
                </p>


              </div>




              <ChevronRight
                size={16}
                className="text-slate-400"
              />





              <div className="flex-1 text-right">


                <p className="text-xs text-slate-400">
                  Current Price
                </p>


                <p
                  className={`
                    text-sm
                    font-bold

                    ${
                      o.diff < 0
                      ? "text-emerald-600"
                      : "text-red-500"
                    }
                  `}
                >

                  ₹{o.curr.toLocaleString()}

                </p>


              </div>






              <span
                className={`
                  px-2
                  py-1
                  text-xs
                  font-bold
                  rounded-xl

                  ${
                    o.diff < 0
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                  }
                `}
              >

                {o.diff < 0 ? "↓" : "↑"} ₹{Math.abs(o.diff)}

              </span>



            </div>







            {/* Buttons */}


            <div className="flex gap-3">


              <motion.button

                whileHover={{
                  scale:1.04,
                  y:-2
                }}

                whileTap={{
                  scale:0.96
                }}

                transition={{
                  duration:0.25
                }}


                className="
                  flex-1
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  rounded
                  cursor-pointer
                  shadow-sm
                "


                style={{
                  background:
                  "linear-gradient(135deg,#ec4899,#f43f5e,#f97316)"
                }}

              >

                Reorder Now

              </motion.button>






              <motion.button


                whileHover={{
                  scale:1.04,
                  y:-2
                }}


                whileTap={{
                  scale:0.96
                }}


                transition={{
                  duration:0.25
                }}



                className="
                  flex-1
                  py-2.5
                  text-sm
                  font-semibold
                  rounded
                  cursor-pointer
                  border
                  border-slate-200
                  bg-white
                  text-slate-700
                  hover:bg-slate-50
                "


              >

                Compare Prices


              </motion.button>



            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── TRUSTED SUPPLIERS ───────────────────────────────────────────────
function TrustedSuppliers() {
  const [connected, setConnected] = useState(true);

  return (
    <section className="mb-8">
      <SectionHead 
        title="Trusted & Connected Suppliers" 
        sub="Your personal supplier network" 
        action="Browse Network" 
      />

      {!connected ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 text-center"
          style={{
            border: `2px dashed ${C.bdr}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: C.bLight }}
          >
            <Plus style={{ width: 28, height: 28, color: C.brand }} />
          </div>

          <h3
            className="text-base font-bold mb-2"
            style={{ color: C.head }}
          >
            No Connected Suppliers Yet
          </h3>

          <p
            className="text-sm mb-6 max-w-sm mx-auto leading-relaxed"
            style={{ color: C.muted }}
          >
            Connect with trusted wholesalers nearby to build your supply network and unlock exclusive pricing deals.
          </p>

          <button
            onClick={() => setConnected(true)}
            className="px-7 py-2.5 text-sm font-bold text-white rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: CTA_GRAD,
              boxShadow: SHADOW.glow
            }}
          >
            Find & Connect Suppliers
          </button>
        </motion.div>
      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {NEARBY_SELLERS.map((s, i) => (

            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1"
              style={{
                boxShadow: SHADOW.sm,
                border: "1px solid rgba(0,0,0,0.04)"
              }}
            >

              {/* Top supplier info */}
              <div className="flex items-center gap-3 mb-4">

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-sm"
                  style={{
                    background: "linear-gradient(135deg,#64748B,#334155)"
                  }}
                >
                  {s.name[0]}
                </div>


                <div className="flex-1 min-w-0">

                  <p
                    className="text-sm font-bold truncate"
                    style={{ color: C.head }}
                  >
                    {s.name}
                  </p>

                  <p
                    className="text-xs"
                    style={{ color: C.muted }}
                  >
                    {s.dist} • {s.category || "Wholesale Supplier"}
                  </p>

                </div>


                <span
                  className="text-[11px] px-2 py-1 rounded-full font-semibold"
                  style={{
                    background: "#ECFDF5",
                    color: C.green
                  }}
                >
                  Active
                </span>

              </div>



              {/* Extra details */}

            <div className="flex flex-wrap gap-1.5 mb-3">

              {s.cats.map(c => (
                <span
                  key={c}
                  className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-rose-50 text-rose-600"
                >
                  {c}
                </span>
              ))}

            </div>



              {/* Action buttons */}

            <div className="flex gap-2">


              {/* Call */}
              <button
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all"
              >
                <Phone size={13}/>
                Call
              </button>



              {/* Message */}
              <button
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all"
              >
                <MessageSquare size={13}/>
                Message
              </button>



              {/* Visit Store */}
              <button
                className="flex-1 py-2.5 text-xs font-bold text-white rounded hover:opacity-90 transition-all shadow-sm"
                style={{
                  background:
                  "linear-gradient(135deg,#ec4899,#f43f5e,#f97316)"
                }}
              >
                Visit Store
              </button>


            </div>


            </motion.div>

          ))}

        </div>

      )}

    </section>
  );
}

// ─── WHY STOCKLINKER ─────────────────────────────────────────────────
function WhyStockLinkers() {
  return (
    <section className="mb-8">
      <div className="text-center mb-8">
        <h2 className="font-bold mb-2 tracking-tight" style={{ color: C.head, fontFamily: FONT_DISPLAY, fontSize: 'clamp(22px, 3vw, 28px)' }}>Why Choose StockLinker?</h2>
        <p className="text-sm" style={{ color: C.muted }}>Everything your retail business needs, in one platform</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {WHY_FEATURES.map((f, i) => (
          <motion.div key={f.title}
            {...fadeUp(i * 0.06)}
            whileHover={{ ...lift, boxShadow: SHADOW.lg }}
            className="bg-white rounded-2xl p-4 text-center"
            style={{ boxShadow: SHADOW.sm }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: f.color + '16' }}>
              <f.Icon style={{ width: 20, height: 20, color: f.color }} />
            </div>
            <p className="text-xs font-bold mb-1" style={{ color: C.head }}>{f.title}</p>
            <p className="text-[11px] leading-snug" style={{ color: C.muted }}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function WhyStockLinker() {
  return (
    <section className="mb-10">

      {/* Header */}
      <div className="text-center mb-10">
        <h2
          className="font-bold tracking-tight mb-2"
          style={{
            color: C.head,
            fontFamily: FONT_DISPLAY,
            fontSize: 'clamp(22px, 3vw, 30px)',
          }}
        >
          How StockLinker Works
        </h2>

        <p className="text-sm" style={{ color: C.muted }}>
          From search to procurement in seconds — not hours
        </p>
      </div>

      {/* Flow Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

        {/* Connector line (desktop only) */}
        <div className="hidden md:block absolute top-10 left-0 right-0 h-[1px] bg-gray-200 z-0" />

        {HOW_IT_WORKS.map((step, i) => (
          <motion.div
            key={step.title}
            {...fadeUp(i * 0.08)}
            whileHover={{ ...lift, boxShadow: SHADOW.lg }}
            className="relative bg-white rounded-2xl p-6 text-left border border-gray-100"
            style={{ boxShadow: SHADOW.sm }}
          >

            {/* Step number */}
            <div className="absolute -top-3 left-6 bg-white px-2 text-[11px] font-bold text-gray-400">
              0{i + 1}
            </div>

            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: step.color + '16' }}
            >
              <step.Icon style={{ width: 22, height: 22, color: step.color }} />
            </div>

            {/* Content */}
            <h3 className="text-sm font-bold mb-1" style={{ color: C.head }}>
              {step.title}
            </h3>

            <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
              {step.desc}
            </p>

          </motion.div>
        ))}
      </div>

      {/* Bottom trust strip */}
      <div className="mt-8 text-center text-xs" style={{ color: C.muted }}>
        Built for fast-moving retail businesses • Reduce procurement time by up to 70%
      </div>

    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { head: 'Categories',    links: ['Grocery','Beverages','Dairy','Hardware','Medical','Packaging'] },
    { head: 'For Businesses',links: ['Retailers','Suppliers','Distributors','Wholesalers'] },
    { head: 'Technology',    links: ['React.js','Spring Boot','MySQL','Redis','REST API'] },
    { head: 'Resources',     links: ['Help Center','Support','Contact Us','Privacy Policy','Terms'] },
  ];
  return (
    <footer className="bg-gradient-to-b from-[#132238] via-[#17304d] to-[#1b1b3a]">
      <div className="px-6 lg:px-10 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#footerGrad)"/>
                <defs><linearGradient id="footerGrad" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#EC4899"/><stop offset="100%" stopColor="#F97316"/></linearGradient></defs>
                <circle cx="10" cy="16" r="4.5" fill="white" opacity="0.95"/>
                <circle cx="22" cy="16" r="4.5" fill="white" opacity="0.95"/>
                <rect x="12" y="14" width="8" height="4" rx="2" fill="white"/>
                <circle cx="10" cy="16" r="2" fill="#1b1b3a"/>
                <circle cx="22" cy="16" r="2" fill="#1b1b3a"/>
              </svg>
              <span className="font-bold text-xl text-white">Stock<span style={{ color: SKY_300 }}>Linker</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Hyperlocal B2B wholesale marketplace connecting retailers with nearby suppliers for smarter, faster procurement.
            </p>
            <div className="flex gap-2">
              {[FaInstagram, FaLinkedin, FaGithub].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'}>
                  <Icon style={{ width: 16, height: 16, color: '#64748B' }} />
                </button>
              ))}
            </div>
          </div>

          {cols.map(col => (
            <div key={col.head}>
              <h4 className="text-sm font-bold mb-4 text-slate-200">{col.head}</h4>
              {col.links.map(l => (
                <p key={l} className="text-sm mb-2.5 cursor-pointer transition-colors" style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#CBD5E1'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>{l}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>© 2025 StockLinker. All rights reserved. Made with ❤️ in Chennai, India 🇮🇳</p>
          <div className="flex gap-5">
            {['Privacy','Terms','Cookies'].map(l => (
              <span key={l} className="text-xs cursor-pointer transition-colors" style={{ color: '#52525B' }}
                onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
                onMouseLeave={e => e.currentTarget.style.color = '#475569'}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────
// A tiny Package icon since Package2 may not exist
function Packages({ style }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
  </svg>;
}

export default function StockLinker() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav,   setActiveNav]   = useState('home');

  return (
    <div style={{ backgroundColor: C.page, minHeight: '100vh', fontFamily: FONT_BODY, color: C.body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
        * { -webkit-font-smoothing: antialiased; }
        ::selection { background: ${C.bLight}; color: ${C.brand}; }
        :focus-visible { outline: none }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* Sticky header */}
      <Header open={sidebarOpen} setOpen={setSidebarOpen}/>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} active={activeNav} setActive={setActiveNav} />

      {/* Main scrollable content */}
      <div className="pt-16 lg:pl-60">
        <main className="px-4 md:px-6 lg:px-8 py-3.5" style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Hero />
          <QuickActions />
          <Categories />
          <PriceComparison />
          <FeaturedComparisons />
          <NearbySellers />
          <RecentlyViewed />
          <ReorderSection />
          <TrustedSuppliers />
          {/* <WhyStockLinker /> */}
          <WhyStockLinkers/>
        </main>
        <Footer />
      </div>
    </div>
  );
}
