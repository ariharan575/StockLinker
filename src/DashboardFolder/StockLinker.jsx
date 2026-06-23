import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Package as Pack, MapPin, ShoppingCart, FileText, MessageSquare,
  RotateCcw, BarChart2, Bookmark, Settings, HelpCircle,
  Search, Globe, Bell, ChevronDown, Menu, Navigation,
  Star, Phone, ArrowRight, CheckCircle, Plus, ChevronRight,
  LayoutGrid, TrendingUp, Zap, Clock, Filter, Store, Shield, X
} from "lucide-react";

import { FaGithub, FaLinkedin , FaInstagram} from "react-icons/fa";


// ─── DESIGN TOKENS ──────────────────────────────────────────────────
const C = {
  brand:   '#7C3AED',   // Electric Violet — primary accent (identity & action)
  brandH:  '#6D28D9',   // Violet hover
  bLight:  '#F3EBFF',   // Violet tint (icon bg, active nav)
  bMid:    '#DDD0FB',   // Violet mid (borders w/ brand tint)
  green:   '#EC4899',   // Pink — secondary accent (value & urgency: best price, savings)
  greenH:  '#DB2777',   // Pink hover
  gLight:  '#FDF0F7',   // Pink tint (best-price badge bg)
  page:    '#FAFAFA',   // Outer page bg — neutral off-white
  card:    '#FFFFFF',   // Card / container
  head:    '#121214',   // Heading text — true near-black
  body:    '#52525B',   // Body text — neutral slate
  muted:   '#A1A1AA',   // Muted text
  bdr:     '#E4E4E7',   // Border
  sub:     '#F4F4F5',   // Section divider / subtle bg
};
const VIOLET_GRAD = 'linear-gradient(135deg, #7C3AED, #A855F7)';
const PINK_GRAD   = 'linear-gradient(135deg, #EC4899, #F472B6)';

// ─── TYPE SYSTEM ─────────────────────────────────────────────────────
const FONT_DISPLAY = "'Sora', 'Inter', sans-serif";   // headings — geometric, premium, distinctive
const FONT_BODY    = "'Inter', sans-serif";            // body copy — neutral, legible
const FONT_MONO    = "'JetBrains Mono', 'Menlo', monospace"; // prices, stats, data — fintech precision

// ─── ELEVATION SYSTEM (violet-tinted, not flat black) ────────────────
const SHADOW = {
  xs:   '0 1px 2px rgba(18,18,20,0.05)',
  sm:   '0 2px 8px rgba(18,18,20,0.05), 0 1px 2px rgba(124,58,237,0.04)',
  md:   '0 8px 24px rgba(18,18,20,0.07), 0 2px 8px rgba(124,58,237,0.05)',
  lg:   '0 20px 48px rgba(18,18,20,0.12), 0 4px 16px rgba(124,58,237,0.08)',
  glow: '0 8px 28px rgba(124,58,237,0.30)',
  glowPink: '0 8px 28px rgba(236,72,153,0.28)',
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
  { id: 'nearby',   label: 'Nearby Sellers',     Icon: MapPin },
  { id: 'orders',   label: 'My Orders',          Icon: ShoppingCart },
  { id: 'invoice',  label: 'Invoice',            Icon: FileText },
  { id: 'msg',      label: 'Messages',           Icon: MessageSquare, badge: 3 },
  { id: 'reorder',  label: 'Reorder',            Icon: RotateCcw },
  { id: 'compare',  label: 'Compare Price',      Icon: BarChart2 },
  { id: 'saved',    label: 'Saved Suppliers',    Icon: Bookmark },
  { id: 'settings', label: 'Settings',           Icon: Settings },
  { id: 'help',     label: 'Help & Support',     Icon: HelpCircle },
];

const QUICK_ACTIONS = [
  { id: 1, label: 'Find Products',   desc: 'Browse 50K+ wholesale items',     Icon: Search,       color: C.brand, bg: C.bLight },
  { id: 2, label: 'Compare Prices',  desc: 'Best deals across suppliers',     Icon: BarChart2,    color: C.green, bg: C.gLight },
  { id: 3, label: 'Nearby Sellers',  desc: '24 suppliers within 5km',         Icon: MapPin,       color: C.brand, bg: C.bLight },
  { id: 4, label: 'My Orders',       desc: '3 orders in progress',            Icon: ShoppingCart, color: C.green, bg: C.gLight },
  { id: 5, label: 'Saved Suppliers', desc: '12 saved for quick access',       Icon: Bookmark,     color: C.brand, bg: C.bLight },
  { id: 6, label: 'Messages',        desc: '3 unread conversations',          Icon: MessageSquare,color: C.green, bg: C.gLight },
];

const CATEGORIES = [
  { name: 'Grocery',       emoji: '🛒', count: 2840, sup: 156 },
  { name: 'Beverages',     emoji: '🥤', count: 1240, sup: 89  },
  { name: 'Snacks',        emoji: '🍿', count: 980,  sup: 67  },
  { name: 'Dairy',         emoji: '🥛', count: 560,  sup: 45  },
  { name: 'Personal Care', emoji: '🧴', count: 1890, sup: 123 },
  { name: 'Household',     emoji: '🏠', count: 2100, sup: 98  },
  { name: 'Hardware',      emoji: '🔧', count: 3200, sup: 145 },
  { name: 'Electronics',   emoji: '💡', count: 1560, sup: 78  },
  { name: 'Stationery',    emoji: '📝', count: 890,  sup: 56  },
  { name: 'Medical',       emoji: '💊', count: 2340, sup: 167 },
  { name: 'Agriculture',   emoji: '🌾', count: 1120, sup: 89  },
  { name: 'Packaging',     emoji: '📦', count: 780,  sup: 43  },
];

const SUPPLIERS_TABLE = [
  { rank: 1, name: 'Metro Traders',        rating: 4.6, qty: '12 Units', brand: 'Surf Excel', price: 238, isBest: true  },
  { rank: 2, name: 'Global Mart Supply',   rating: 4.7, qty: '12 Units', brand: 'Surf Excel', price: 241, isBest: false },
  { rank: 3, name: 'Raj Wholesale Hub',    rating: 4.8, qty: '12 Units', brand: 'Surf Excel', price: 245, isBest: false },
  { rank: 4, name: 'Sri Venkat Stores',    rating: 4.5, qty: '12 Units', brand: 'Surf Excel', price: 252, isBest: false },
  { rank: 5, name: 'Pioneer Wholesale',    rating: 4.3, qty: '12 Units', brand: 'Surf Excel', price: 260, isBest: false },
];

const FEATURED_PRODUCTS = [
  { name: 'Aashirvaad Atta 5KG',      brand: 'ITC',       emoji: '🌾', prices: [285, 291, 298] },
  { name: 'Amul Butter 500G',         brand: 'Amul',      emoji: '🧈', prices: [248, 255, 262] },
  { name: 'Haldirams Bhujia 400G',    brand: 'Haldirams', emoji: '🍿', prices: [145, 152, 158] },
  { name: 'Tata Tea Premium 500G',    brand: 'Tata',      emoji: '☕', prices: [198, 205, 212] },
];

const NEARBY_SELLERS = [
  { id: 1, name: 'Raj Wholesale Hub',    cats: ['Grocery','Beverages','Snacks'],   items: ['Biscuits','Dal','Rice','Oil'],      rating: 4.8, reviews: 234, dist: '0.8 km', verified: true,  delivery: 'Same Day' },
  { id: 2, name: 'Metro Super Traders',  cats: ['Household','Personal Care'],      items: ['Detergent','Soap','Shampoo'],       rating: 4.6, reviews: 187, dist: '1.2 km', verified: true,  delivery: '2–4 Hours' },
  { id: 3, name: 'Sri Venkat Stores',    cats: ['Dairy','Beverages'],              items: ['Milk','Curd','Paneer','Butter'],    rating: 4.5, reviews: 156, dist: '2.1 km', verified: false, delivery: 'Next Day' },
];

const RECENT_VIEWED = [
  { id: 1, name: 'Surf Excel 1KG',       brand: 'HUL',      cat: 'Household',    price: 238, orig: 260 },
  { id: 2, name: 'Aashirvaad Atta 5KG',  brand: 'ITC',      cat: 'Grocery',      price: 285, orig: 310 },
  { id: 3, name: 'Haldirams Bhujia',     brand: 'Haldirams',cat: 'Snacks',       price: 145, orig: 165 },
  { id: 4, name: 'Amul Butter 500G',     brand: 'Amul',     cat: 'Dairy',        price: 248, orig: 268 },
  { id: 5, name: 'Dettol Soap 125G',     brand: 'Reckitt',  cat: 'Personal Care',price:  58, orig:  68 },
];

const REORDERS = [
  { id: '#1023', date: 'Jun 14, 2025', supplier: 'Raj Wholesale Hub',   items: ['Surf Excel 1KG ×12','Aashirvaad Atta 5KG ×5'],        prev: 3240, curr: 3180, diff: -60  },
  { id: '#1018', date: 'Jun 8, 2025',  supplier: 'Metro Super Traders', items: ['Amul Butter 500G ×24','Britannia Milk Bikis ×30'],    prev: 7800, curr: 7950, diff: +150 },
];

const WHY_FEATURES = [
  { Icon: TrendingUp,    title: 'Better Pricing',      desc: 'Compare across 500+ suppliers', color: C.brand },
  { Icon: Zap,           title: 'Fast Procurement',    desc: 'Order in under 2 minutes',      color: C.green },
  { Icon: MapPin,        title: 'Nearby Discovery',    desc: 'Suppliers within your area',    color: C.brand },
  { Icon: MessageSquare, title: 'Direct Connect',      desc: 'Chat & call suppliers directly',color: C.green },
  { Icon: RotateCcw,     title: 'Smart Reordering',    desc: 'Repeat orders with one tap',    color: C.brand },
  { Icon: BarChart2,     title: 'Price Intelligence',  desc: 'Market insights at a glance',   color: C.green },
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
          backgroundImage: VIOLET_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
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
              <Globe style={{ width: 16, height: 16 }} />
              <span className="hidden lg:inline font-medium">EN</span>
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
              <Navigation style={{ width: 15, height: 15 }} />
              <span className="hidden lg:inline text-xs font-medium">Chennai, TN</span>
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
            <Settings style={{ width: 18, height: 18, color: C.muted }} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => { closeAll(); setNotif(v => !v); }}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
              <Bell style={{ width: 18, height: 18, color: C.muted }} />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">4</span>
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
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{ background: VIOLET_GRAD }}>A</div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold leading-none" style={{ color: C.head }}>Ariharan</p>
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
                    <p className="text-sm font-bold" style={{ color: C.head }}>Ariharan R</p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>ariharan@kirana.in</p>
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
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/25 z-40 lg:hidden"
            onClick={() => setOpen(false)} />
        )}
      </AnimatePresence>

      <aside className={`fixed left-0 top-16 bottom-0 w-60 bg-white border-r z-40 overflow-y-auto flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ borderColor: C.bdr }}>

        <nav className="flex-1 py-4 px-3">
          {NAV_ITEMS.map(({ id, label, Icon, badge }) => {
            const isActive = active === id;
            return (
              <button key={id} onClick={() => { setActive(id); setOpen(false); }}
                className="w-full flex items-center gap-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all group"
                style={{
                  paddingLeft: isActive ? '10px' : '12px',
                  paddingRight: '12px',
                  backgroundColor: isActive ? C.bLight : 'transparent',
                  color: isActive ? C.brand : C.body,
                  borderLeft: isActive ? `3px solid ${C.brand}` : '3px solid transparent',
                }}>
                <Icon style={{ width: 17, height: 17, color: isActive ? C.brand : C.muted, flexShrink: 0 }} />
                <span className="flex-1 text-left">{label}</span>
                {badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: C.brand, color: 'white' }}>{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Upgrade Card */}
        <div className="mx-3 mb-4 p-4 rounded-2xl" style={{ background: `linear-gradient(135deg, ${C.bLight}, #FDF0F7)` }}>
          <p className="text-xs font-bold mb-1" style={{ color: C.brand }}>Upgrade to Pro</p>
          <p className="text-[11px] mb-3" style={{ color: C.brand }}>Unlimited comparisons &amp; analytics</p>
          <button className="w-full py-2 text-xs font-bold text-white rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: C.brand }}>
            Upgrade Now →
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────
function Hero() {
  const STATS = [
    { label: 'Active Suppliers', val: '2,847', note: '+12% this month', Icon: Store,       color: C.brand,   bg: C.bLight },
    { label: 'Products Listed',  val: '52.4K', note: '+8% growth',      Icon: Pack,     color: C.green,   bg: C.gLight },
    { label: 'Nearby Sellers',   val: '24',    note: 'Within 5km',      Icon: MapPin,       color: C.brand,   bg: C.bLight },
    { label: 'Recent Orders',    val: '18',    note: '3 active now',     Icon: ShoppingCart, color: C.green,   bg: C.gLight },
  ];
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
      className="rounded-2xl p-6 mb-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #F3EBFF 0%, #FAFAFA 55%, #FDF0F7 100%)' }}>
      {/* Subtle decorative blobs */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20"
        style={{ background: `radial-gradient(circle, ${C.brand}, transparent)` }} />
      <div className="absolute -bottom-8 right-32 w-24 h-24 rounded-full opacity-10"
        style={{ background: `radial-gradient(circle, ${C.green}, transparent)` }} />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <span className="text-sm font-semibold" style={{ color: C.brand, fontFamily: FONT_BODY }}>Good morning 👋</span>
          <h1 className="font-bold mt-1 tracking-tight" style={{ color: C.head, fontFamily: FONT_DISPLAY, fontSize: 'clamp(22px, 3.4vw, 30px)', lineHeight: 1.15 }}>Welcome back, Ariharan</h1>
          <p className="text-sm mt-1.5" style={{ color: C.body }}>Here's your retail activity overview for today</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <motion.button whileHover={{ scale: 1.035 }} whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="px-5 py-2.5 text-sm font-bold text-white rounded-xl"
            style={{ background: VIOLET_GRAD, boxShadow: SHADOW.glow, fontFamily: FONT_BODY }}>
            + New Order
          </motion.button>
          <button className="px-4 py-2.5 text-sm font-semibold rounded-xl border transition-colors hover:bg-white"
            style={{ color: C.brand, borderColor: C.bMid, backgroundColor: 'rgba(255,255,255,0.65)' }}>
            View Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {STATS.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 + 0.2 }}
            className="bg-white rounded-2xl p-4 flex items-center gap-3"
            style={{ boxShadow: SHADOW.sm }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.bg }}>
              <s.Icon style={{ width: 20, height: 20, color: s.color }} />
            </div>
            <div>
              <p className="font-bold leading-none" style={{ color: C.head, fontFamily: FONT_MONO, fontSize: 'clamp(18px, 2.2vw, 22px)' }}>{s.val}</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>{s.label}</p>
              <p className="text-[11px] font-semibold mt-0.5" style={{ color: s.color }}>{s.note}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── QUICK ACTIONS ───────────────────────────────────────────────────
function QuickActions() {
  return (
    <section className="mb-8">
      <SectionHead title="Quick Actions" sub="Jump right into what you need" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {QUICK_ACTIONS.map((a, i) => (
          <motion.button key={a.id}
            {...fadeUp(i * 0.05)}
            whileHover={{ ...lift, boxShadow: SHADOW.lg }} whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-4 text-left"
            style={{ boxShadow: SHADOW.sm }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: a.bg }}>
              <a.Icon style={{ width: 20, height: 20, color: a.color }} />
            </div>
            <p className="text-sm font-bold leading-tight" style={{ color: C.head }}>{a.label}</p>
            <p className="text-xs mt-1 leading-snug" style={{ color: C.muted }}>{a.desc}</p>
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
      <SectionHead title="Product Categories" sub="Browse 52,000+ wholesale products" action="View All" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {CATEGORIES.map((cat, i) => (
          <motion.button key={cat.name}
            initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.03, duration: 0.4, ease: EASE }}
            whileHover={{ y: -4, scale: 1.02, boxShadow: SHADOW.md }} whileTap={{ scale: 0.97 }}
            className="bg-white rounded-2xl p-3 text-center"
            style={{ boxShadow: SHADOW.sm }}>
            <div className="text-3xl mb-2">{cat.emoji}</div>
            <p className="text-xs font-bold" style={{ color: C.head }}>{cat.name}</p>
            <p className="text-[10px] mt-0.5" style={{ color: C.muted, fontFamily: FONT_MONO }}>{cat.count.toLocaleString()} items</p>
            <p className="text-[10px] font-semibold mt-0.5" style={{ color: C.green, fontFamily: FONT_MONO }}>{cat.sup} suppliers</p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

// ─── PRICE COMPARISON TABLE ──────────────────────────────────────────
function PriceComparison() {
  return (
    <section className="mb-8">
      <SectionHead title="Compare Supplier Prices" sub="Real-time pricing from local wholesalers" action="All Products" />
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: SHADOW.sm }}>

        {/* Product header */}
        <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center gap-4" style={{ borderColor: C.sub }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${C.bLight}, #FDF0F7)` }}>🧺</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-base font-bold" style={{ color: C.head }}>Surf Excel Matic Liquid — 1 KG</h3>
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full" style={{ backgroundColor: C.gLight, color: C.green }}>Active Comparison</span>
            </div>
            <p className="text-sm" style={{ color: C.muted }}>HUL · Liquid Detergent · Pack of 12 units · MRP ₹290</p>
          </div>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-colors hover:bg-slate-50 flex-shrink-0"
            style={{ color: C.brand, borderColor: C.bMid }}>
            <Filter style={{ width: 14, height: 14 }} /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#FAFBFF' }}>
                {['#','Supplier','Qty / Pack','Brand','Price / Unit','Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SUPPLIERS_TABLE.map((s, i) => (
                <motion.tr key={s.rank}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  className="border-t transition-colors hover:bg-slate-50"
                  style={{ borderColor: C.sub, backgroundColor: s.isBest ? '#F0FDF9' : undefined }}>
                  <td className="px-5 py-4">
                    {s.isBest
                      ? <span className="inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: C.green }}>★</span>
                      : <span className="text-sm font-medium" style={{ color: C.muted }}>{s.rank}</span>}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: VIOLET_GRAD }}>{s.name[0]}</div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: C.head }}>{s.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star style={{ width: 11, height: 11, fill: '#FBBF24', color: '#FBBF24' }} />
                          <span className="text-[11px]" style={{ color: C.muted }}>{s.rating}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: C.body }}>{s.qty}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: C.body }}>{s.brand}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold" style={{ color: s.isBest ? C.green : C.head, fontFamily: FONT_MONO }}>₹{s.price}</span>
                      {s.isBest && <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full" style={{ backgroundColor: C.gLight, color: C.green }}>BEST</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="Message">
                        <MessageSquare style={{ width: 14, height: 14, color: C.muted }} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="Call">
                        <Phone style={{ width: 14, height: 14, color: C.muted }} />
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-85"
                        style={{ backgroundColor: s.isBest ? C.green : C.brand }}>
                        Order
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURED PRODUCT COMPARISONS ────────────────────────────────────
function FeaturedComparisons() {
  return (
    <section className="mb-8">
      <SectionHead title="Featured Comparisons" sub="Top products with live supplier pricing" action="View All" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURED_PRODUCTS.map((p, i) => (
          <motion.div key={p.name}
            {...fadeUp(i * 0.07)}
            whileHover={{ ...lift, boxShadow: SHADOW.lg }}
            className="bg-white rounded-2xl p-4"
            style={{ boxShadow: SHADOW.sm }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: C.bLight }}>
                {p.emoji}
              </div>
              <div>
                <p className="text-sm font-bold leading-tight" style={{ color: C.head }}>{p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>{p.brand}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {p.prices.map((price, pi) => (
                <div key={pi} className="flex items-center justify-between px-3 py-2 rounded-xl"
                  style={{ backgroundColor: pi === 0 ? C.gLight : C.sub }}>
                  <span className="text-xs" style={{ color: C.muted }}>Supplier {pi + 1}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold" style={{ color: pi === 0 ? C.green : C.head, fontFamily: FONT_MONO }}>₹{price}</span>
                    {pi === 0 && <span className="text-[9px] font-bold px-1 py-0.5 rounded" style={{ backgroundColor: C.green, color: 'white' }}>BEST</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 text-xs font-bold rounded-xl border transition-colors hover:bg-slate-50"
                style={{ color: C.brand, borderColor: C.bMid }}>Compare</button>
              <button className="flex-1 py-2 text-xs font-bold rounded-xl text-white transition-opacity hover:opacity-85"
                style={{ backgroundColor: C.brand }}>Details</button>
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
          <motion.div key={s.id}
            {...fadeUp(i * 0.09)}
            whileHover={{ ...lift, boxShadow: SHADOW.lg }}
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: SHADOW.sm }}>
            {/* Seller header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                  style={{ background: VIOLET_GRAD }}>{s.name[0]}</div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold" style={{ color: C.head }}>{s.name}</p>
                    {s.verified && <CheckCircle style={{ width: 14, height: 14, color: C.green }} />}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star style={{ width: 11, height: 11, fill: '#FBBF24', color: '#FBBF24' }} />
                    <span className="text-xs font-semibold" style={{ color: C.body }}>{s.rating}</span>
                    <span className="text-xs" style={{ color: C.muted }}>({s.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl" style={{ backgroundColor: C.sub }}>
                <Navigation style={{ width: 12, height: 12, color: C.muted }} />
                <span className="text-xs font-semibold" style={{ color: C.body }}>{s.dist}</span>
              </div>
            </div>

            {/* Category tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {s.cats.map(c => (
                <span key={c} className="px-2 py-0.5 text-[11px] font-semibold rounded-full"
                  style={{ backgroundColor: C.bLight, color: C.brand }}>{c}</span>
              ))}
            </div>

            <p className="text-xs mb-3" style={{ color: C.muted }}>
              {s.items.slice(0, 3).join(' · ')} &amp; more
            </p>

            <div className="flex items-center gap-1.5 mb-4">
              <Clock style={{ width: 13, height: 13, color: C.muted }} />
              <span className="text-xs" style={{ color: C.muted }}>Delivery:</span>
              <span className="text-xs font-semibold" style={{ color: C.body }}>{s.delivery}</span>
            </div>

            <div className="flex gap-2">
              {[['Call', Phone], ['Message', MessageSquare]].map(([label, LIcon]) => (
                <button key={label} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl border transition-colors hover:bg-slate-50"
                  style={{ color: C.brand, borderColor: C.bMid }}>
                  <LIcon style={{ width: 13, height: 13 }} />{label}
                </button>
              ))}
              <button className="flex-1 py-2.5 text-xs font-bold text-white rounded-xl transition-opacity hover:opacity-85"
                style={{ backgroundColor: C.brand }}>
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
      <SectionHead title="Recently Viewed" sub="Continue where you left off" action="View All" />
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {RECENT_VIEWED.map((p, i) => (
          <motion.div key={p.id}
            initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.06, duration: 0.45, ease: EASE }}
            whileHover={{ ...lift, boxShadow: SHADOW.lg }}
            className="bg-white rounded-2xl p-4 flex-shrink-0"
            style={{ width: 168, boxShadow: SHADOW.sm }}>
            <div className="w-full h-20 rounded-xl flex items-center justify-center text-3xl mb-3"
              style={{ backgroundColor: C.bLight }}>🛍️</div>
            <p className="text-xs font-bold leading-snug" style={{ color: C.head }}>{p.name}</p>
            <p className="text-[10px] mt-0.5" style={{ color: C.muted }}>{p.brand} · {p.cat}</p>
            <div className="flex items-center gap-2 mt-2 mb-3">
              <span className="text-sm font-bold" style={{ color: C.green, fontFamily: FONT_MONO }}>₹{p.price}</span>
              <span className="text-[10px] line-through" style={{ color: C.muted, fontFamily: FONT_MONO }}>₹{p.orig}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: C.gLight, color: C.green }}>
                {Math.round((p.orig - p.price) / p.orig * 100)}% off
              </span>
            </div>
            <div className="flex gap-1.5">
              <button className="flex-1 py-1.5 text-[10px] font-bold rounded-lg border transition-colors"
                style={{ color: C.brand, borderColor: C.bMid }}>View</button>
              <button className="flex-1 py-1.5 text-[10px] font-bold text-white rounded-lg transition-opacity hover:opacity-85"
                style={{ backgroundColor: C.brand }}>Order</button>
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
      <SectionHead title="Quick Reorder" sub="Repeat your recent purchases instantly" action="Order History" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {REORDERS.map((o, i) => (
          <motion.div key={o.id}
            {...fadeUp(i * 0.1)}
            whileHover={{ boxShadow: SHADOW.md }}
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: SHADOW.sm }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: C.head }}>Order {o.id}</span>
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full" style={{ backgroundColor: C.sub, color: C.muted }}>{o.date}</span>
              </div>
              <span className="text-xs font-medium" style={{ color: C.muted }}>{o.supplier}</span>
            </div>

            <div className="space-y-1.5 mb-4">
              {o.items.map(item => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: C.bMid }} />
                  <span className="text-xs" style={{ color: C.body }}>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl mb-4" style={{ backgroundColor: C.sub }}>
              <div className="flex-1">
                <p className="text-xs mb-0.5" style={{ color: C.muted }}>Previous Price</p>
                <p className="text-sm font-bold" style={{ color: C.body, fontFamily: FONT_MONO }}>₹{o.prev.toLocaleString()}</p>
              </div>
              <ChevronRight style={{ width: 16, height: 16, color: C.muted }} />
              <div className="flex-1 text-right">
                <p className="text-xs mb-0.5" style={{ color: C.muted }}>Current Price</p>
                <p className="text-sm font-bold" style={{ color: o.diff < 0 ? C.green : '#EF4444', fontFamily: FONT_MONO }}>
                  ₹{o.curr.toLocaleString()}
                </p>
              </div>
              <span className="px-2 py-1 text-xs font-bold rounded-xl flex-shrink-0"
                style={o.diff < 0
                  ? { backgroundColor: C.gLight, color: C.green }
                  : { backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                {o.diff < 0 ? '↓' : '↑'} ₹{Math.abs(o.diff)}
              </span>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl transition-opacity hover:opacity-90"
                style={{ backgroundColor: C.brand }}>Reorder Now</button>
              <button className="flex-1 py-2.5 text-sm font-bold rounded-xl border transition-colors hover:bg-slate-50"
                style={{ color: C.brand, borderColor: C.bMid }}>Compare Prices</button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── TRUSTED SUPPLIERS ───────────────────────────────────────────────
function TrustedSuppliers() {
  const [connected, setConnected] = useState(false);
  return (
    <section className="mb-8">
      <SectionHead title="Trusted & Connected Suppliers" sub="Your personal supplier network" action="Browse Network" />
      {!connected ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 text-center"
          style={{ border: `2px dashed ${C.bdr}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: C.bLight }}>
            <Plus style={{ width: 28, height: 28, color: C.brand }} />
          </div>
          <h3 className="text-base font-bold mb-2" style={{ color: C.head }}>No Connected Suppliers Yet</h3>
          <p className="text-sm mb-6 max-w-sm mx-auto leading-relaxed" style={{ color: C.muted }}>
            Connect with trusted wholesalers nearby to build your supply network and unlock exclusive pricing deals.
          </p>
          <button onClick={() => setConnected(true)}
            className="px-7 py-2.5 text-sm font-bold text-white rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: VIOLET_GRAD, boxShadow: SHADOW.glow }}>
            Find & Connect Suppliers
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {NEARBY_SELLERS.map((s, i) => (
            <motion.div key={s.id}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-4 flex items-center gap-3"
              style={{ boxShadow: SHADOW.sm }}>
              <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ background: VIOLET_GRAD }}>{s.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: C.head }}>{s.name}</p>
                <p className="text-xs" style={{ color: C.muted }}>{s.dist}</p>
              </div>
              <button className="px-3 py-1.5 text-xs font-bold text-white rounded-lg transition-opacity hover:opacity-85 flex-shrink-0"
                style={{ backgroundColor: C.green }}>View</button>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── WHY STOCKLINKER ─────────────────────────────────────────────────
function WhyStockLinker() {
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

// ─── FOOTER ──────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { head: 'Categories',    links: ['Grocery','Beverages','Dairy','Hardware','Medical','Packaging'] },
    { head: 'For Businesses',links: ['Retailers','Suppliers','Distributors','Wholesalers'] },
    { head: 'Technology',    links: ['React.js','Spring Boot','MySQL','Redis','REST API'] },
    { head: 'Resources',     links: ['Help Center','Support','Contact Us','Privacy Policy','Terms'] },
  ];
  return (
    <footer style={{ backgroundColor: '#0A0A0B' }}>
      <div className="px-6 lg:px-10 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#18181B"/>
                <circle cx="10" cy="16" r="4.5" fill="white" opacity="0.95"/>
                <circle cx="22" cy="16" r="4.5" fill="white" opacity="0.95"/>
                <rect x="12" y="14" width="8" height="4" rx="2" fill="white"/>
                <circle cx="10" cy="16" r="2" fill="#18181B"/>
                <circle cx="22" cy="16" r="2" fill="#18181B"/>
              </svg>
              <span className="font-bold text-xl text-white">Stock<span style={{ color: '#C084FC' }}>Linker</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#71717A' }}>
              Hyperlocal B2B wholesale marketplace connecting retailers with nearby suppliers for smarter, faster procurement.
            </p>
            <div className="flex gap-2">
              {[FaInstagram, FaLinkedin, FaGithub].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  style={{ backgroundColor: '#27272A' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3F3F46'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#27272A'}>
                  <Icon style={{ width: 16, height: 16, color: '#64748B' }} />
                </button>
              ))}
            </div>
          </div>

          {cols.map(col => (
            <div key={col.head}>
              <h4 className="text-sm font-bold mb-4 text-slate-200">{col.head}</h4>
              {col.links.map(l => (
                <p key={l} className="text-sm mb-2.5 cursor-pointer transition-colors" style={{ color: '#71717A' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#CBD5E1'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>{l}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderColor: '#27272A' }}>
          <p className="text-xs" style={{ color: '#52525B' }}>© 2025 StockLinker. All rights reserved. Made with ❤️ in Chennai, India 🇮🇳</p>
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
        :focus-visible { outline: 2px solid ${C.brand}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* Sticky header */}
      <Header open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} active={activeNav} setActive={setActiveNav} />

      {/* Main scrollable content */}
      <div className="pt-16 lg:pl-60">
        <main className="px-4 md:px-6 lg:px-8 py-6" style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Hero />
          <QuickActions />
          <Categories />
          <PriceComparison />
          <FeaturedComparisons />
          <NearbySellers />
          <RecentlyViewed />
          <ReorderSection />
          <TrustedSuppliers />
          <WhyStockLinker />
        </main>
        <Footer />
      </div>
    </div>
  );
}


