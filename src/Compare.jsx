import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronDown, MapPin, Clock, X,
  ShieldCheck, Building2, CalendarDays, ExternalLink,
  MessageCircle, ShoppingBag, Star, Package,
  Zap, ArrowRight, Shield, CheckCircle2, ChevronRight, Phone,
  TrendingDown, Boxes, Truck, BarChart3, Info, Wallet,Check,Building, 
  Mic,
  ChevronUp,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   PREMIUM THEME SYSTEM & CSS
───────────────────────────────────────────── */

const C = {
  bgBase: "#F8FAFC",
  bgSurface: "#FFFFFF",
  border: "rgba(15,23,42,0.08)",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#64748B",
  gradientCTA: "linear-gradient(to right, #EC4899, #F43F5E, #F97316)",
  gradientCTAHover: "linear-gradient(to right, #F43F5E, #E11D48, #EA580C)",
  pink: "#EC4899",
  orange: "#F97316",
  success: "#10B981",
};

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

// Dynamic pricing logic based on quantity tiers
function priceForTier(base, qty) {
  if (qty >= 500) return Math.round(base * 0.94);
  if (qty >= 100) return Math.round(base * 0.96);
  if (qty >= 50) return Math.round(base * 0.98);
  if (qty >= 25) return Math.round(base * 0.99);
  return base;
}

const FONTS = {
  display: "'Sora', sans-serif",
  body: "'Inter', sans-serif",
};

const PRODUCT = {
  name: "Samsung Galaxy S25 Ultra 5G",
  recommended: 67499,
};

const COLORS = {
  bg: '#F8FAFC',
  border: 'rgba(15,23,42,0.08)',
  primary: '#0F172A',
  softSurface: '#FDFDFE',
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const CTA_GRAD = 'linear-gradient(135deg, #EC4899 0%, #F43F5E 50%, #F97316 100%)';

const typographyStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@400;600;700;800&display=swap');
  
  .font-sora { font-family: 'Sora', sans-serif; }
  .font-inter { font-family: 'Inter', sans-serif; }
  
  body { 
    background-color: ${COLORS.bg}; 
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #CBD5E1 transparent;
  }
  .custom-scrollbar::-webkit-scrollbar {
    height: 10px;
    width: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #F8FAFC;
    border-radius: 12px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #CBD5E1;
    border-radius: 12px;
    border: 2px solid #F8FAFC;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #94A3B8;
  }

  /* Sticky shadow effect for table header */
  .table-header-shadow {
    box-shadow: 0 4px 20px -10px rgba(15,23,42,0.1);
  }
`;

/* ─────────────────────────────────────────────
   DATA (UPGRADED)
───────────────────────────────────────────── */
const SUPPLIERS = [
  {
    id: 1, name: 'ABC Wholesale', initials: 'ABC',
    verified: true, location: 'Chennai, TN',
    moq: 5, moqUnit: 'Units', moqPrice: 67499,
    stock: 840, stockUnit: 'Units',
    bulkDeal: { qty: 100, price: 64500, saving: 2999 },
    rating: 4.9, reviews: 245,
    delivery: '2 Days', score: 96,
    badge: 'BEST DEAL',
  },
  {
    id: 2, name: 'XYZ Traders', initials: 'XYZ',
    verified: true, location: 'Mumbai, MH',
    moq: 10, moqUnit: 'Units', moqPrice: 68299,
    stock: 320, stockUnit: 'Units',
    bulkDeal: { qty: 50, price: 66800, saving: 1499 },
    rating: 4.8, reviews: 198,
    delivery: '3 Days', score: 92,
    badge: null,
  },
  {
    id: 3, name: 'PQR Distributors', initials: 'PQR',
    verified: false, location: 'Delhi, DL',
    moq: 20, moqUnit: 'Units', moqPrice: 69250,
    stock: 1200, stockUnit: 'Units',
    bulkDeal: { qty: 200, price: 65000, saving: 4250 },
    rating: 4.7, reviews: 162,
    delivery: '2 Days', score: 89,
    badge: 'FAST DELIVERY',
  },
  {
    id: 4, name: 'Global Mobile Hub', initials: 'GM',
    verified: false, location: 'Bengaluru, KA',
    moq: 5, moqUnit: 'Units', moqPrice: 70499,
    stock: 55, stockUnit: 'Units',
    bulkDeal: { qty: 100, price: 67999, saving: 2500 },
    rating: 4.6, reviews: 134,
    delivery: '4 Days', score: 86,
    badge: null,
  },
  {
    id: 5, name: 'Superb Deals', initials: 'SD',
    verified: true, location: 'Hyderabad, TS',
    moq: 10, moqUnit: 'Units', moqPrice: 71999,
    stock: 200, stockUnit: 'Units',
    bulkDeal: { qty: 50, price: 69999, saving: 2000 },
    rating: 4.5, reviews: 111,
    delivery: '3 Days', score: 82,
    badge: null,
  },
  {
    id: 6, name: 'Metro Electronics', initials: 'ME',
    verified: true, location: 'Pune, MH',
    moq: 15, moqUnit: 'Units', moqPrice: 68500,
    stock: 430, stockUnit: 'Units',
    bulkDeal: { qty: 150, price: 66000, saving: 2500 },
    rating: 4.9, reviews: 312,
    delivery: '2 Days', score: 94,
    badge: null,
  },
  {
    id: 7, name: 'Tech Vision', initials: 'TV',
    verified: true, location: 'Kolkata, WB',
    moq: 5, moqUnit: 'Units', moqPrice: 67900,
    stock: 80, stockUnit: 'Units',
    bulkDeal: { qty: 50, price: 66500, saving: 1400 },
    rating: 4.7, reviews: 145,
    delivery: '4 Days', score: 88,
    badge: null,
  },
  {
    id: 8, name: 'Prime Suppliers', initials: 'PS',
    verified: false, location: 'Surat, GJ',
    moq: 25, moqUnit: 'Units', moqPrice: 69000,
    stock: 1500, stockUnit: 'Units',
    bulkDeal: { qty: 500, price: 64000, saving: 5000 },
    rating: 4.6, reviews: 98,
    delivery: '5 Days', score: 85,
    badge: null,
  },
  {
    id: 9, name: 'Alpha Connect', initials: 'AC',
    verified: true, location: 'Ahmedabad, GJ',
    moq: 10, moqUnit: 'Units', moqPrice: 68800,
    stock: 210, stockUnit: 'Units',
    bulkDeal: { qty: 100, price: 65900, saving: 2900 },
    rating: 4.8, reviews: 267,
    delivery: '3 Days', score: 91,
    badge: null,
  },
  {
    id: 10, name: 'Omega Trading', initials: 'OT',
    verified: true, location: 'Noida, UP',
    moq: 5, moqUnit: 'Units', moqPrice: 69999,
    stock: 45, stockUnit: 'Units',
    bulkDeal: { qty: 50, price: 68000, saving: 1999 },
    rating: 4.4, reviews: 76,
    delivery: '2 Days', score: 80,
    badge: null,
  },
];

const SUPPLIER_DETAILS = {
  1: { businessType: 'Wholesaler', experience: '8+ Years', gst: '33ABCDE1234F1Z5', responseRate: '98%', orders: '2,450+', onTime: '96%', terms: 'Advance / COD / Net 15', warranty: '1 Year Brand Warranty', kyc: true, gstVerified: true, bizVerified: true, phone: '+91 98765 43210' },
  2: { businessType: 'Distributor', experience: '6+ Years', gst: '27XYZTR5678G2A1', responseRate: '95%', orders: '1,820+', onTime: '94%', terms: 'Advance / Net 30', warranty: '1 Year Brand Warranty', kyc: true, gstVerified: true, bizVerified: true, phone: '+91 98765 43211' },
  // Default fallback for others...
};
for (let i = 3; i <= 10; i++) {
  SUPPLIER_DETAILS[i] = SUPPLIER_DETAILS[1];
}

/* ─────────────────────────────────────────────
   SHARED REUSABLE COMPONENTS
───────────────────────────────────────────── */
const FloatingSurface = ({ children, className = "", delay = 0, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
    whileHover={onClick ? { translateY: -3, boxShadow: '0 20px 50px rgba(15,23,42,0.08)' } : {}}
    onClick={onClick}
    className={`bg-[#FFFFFF] shadow-sm w-full relative ${onClick ? 'cursor-pointer' : ''} ${className}`}
    style={{ border: `1px solid ${COLORS.border}`, borderRadius: '24px' }}
  >
    {children}
  </motion.div>
);

const GradientButton = ({ children, onClick, className = "", icon: Icon }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`relative inline-flex items-center justify-center font-inter font-semibold text-white transition-all overflow-hidden group ${className}`}
    style={{
      background: CTA_GRAD,
      borderRadius: '5px',
      boxShadow: '0 8px 24px -6px rgba(244,63,94,0.4)',
    }}
  >
    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
    <span className="relative z-10 flex items-center justify-center">
      {Icon && <Icon size={18} className="mr-2" />}
      {children}
    </span>
  </motion.button>
);

const SecondaryButton = ({ children, onClick, className = "", style = {} }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02, backgroundColor: COLORS.softSurface }}
    whileTap={{ scale: 0.98 }}
    className={`inline-flex items-center justify-center font-inter font-semibold text-[#0F172A] bg-white transition-colors ${className}`}
    style={{ border: `2px solid ${COLORS.border}`, borderRadius: '5px', ...style }}
  >
    {children}
  </motion.button>
);

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function ScoreRing({ score, size = 48 }) {
  const r = size * 0.38;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="50%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
          <linearGradient id="scoreGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS.border} strokeWidth={size * 0.08} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" 
          stroke={score >= 90 ? "url(#scoreGradGreen)" : "url(#scoreGrad)"} 
          strokeWidth={size * 0.08}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-sora font-bold text-[13px] text-[#0F172A]">{score}</span>
    </div>
  );
}

function PremiumBadge({ text }) {
  const isGradient = text === 'BEST DEAL' || text === 'FAST DELIVERY';
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-sora font-bold uppercase tracking-widest shadow-sm"
      style={{
        background: isGradient ? CTA_GRAD : COLORS.softSurface,
        color: isGradient ? '#FFFFFF' : COLORS.primary,
        border: isGradient ? 'none' : `1px solid ${COLORS.border}`
      }}>
      {isGradient && <Zap size={12} className="fill-white" />}
      {text}
    </span>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT HEADER
───────────────────────────────────────────── */
function ProductHeader({ qty, setQty }) {
  const tags = ["SKU: SM-S928B", "EAN: 88060953", "256GB", "Titanium Black"];
  const sellers = [
    { name: "ABC Wholesale", price: "₹67,499", match: 98, verified: true },
    { name: "SK Distributors", price: "₹68,200", match: 85, verified: true },
    { name: "Global Trade", price: "₹69,300", match: 72, verified: true }
  ];

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const cardVars = {
    hidden: { opacity: 0, x: -15 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 400, damping: 30 } }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-6 w-full"
    >
      <div className="flex flex-col xl:flex-row bg-[#FFFFFF] rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
        
        {/* ================= LEFT SIDE ================= */}
        <div className="flex-1 p-4 sm:p-5 xl:p-6 flex flex-col">
          <div className="flex overflow-x-auto items-center gap-3 text-[11px] sm:text-[12px] font-inter font-medium text-[#94A3B8] mb-4 pb-1 whitespace-nowrap [&::-webkit-scrollbar]:hidden">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[10px] sm:text-[11px] font-sora font-bold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 uppercase tracking-widest shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Live Market
            </span>
            <span className="text-slate-300 shrink-0">•</span>
            <span className="flex items-center gap-1.5 shrink-0"><CheckCircle2 size={14} className="text-[#10B981]" /> 156 verified suppliers</span>
            <span className="text-slate-300 shrink-0">•</span>
            <span className="flex items-center gap-1.5 shrink-0"><TrendingDown size={14} className="text-[#0F172A]" /> Best price detected</span>
          </div>

          <div className="mb-5">
            <h1 className="text-[22px] sm:text-[28px] md:text-[32px] font-sora font-extrabold tracking-tight text-[#0F172A] leading-tight mb-3">
              {PRODUCT.name}
            </h1>
            <div className="flex overflow-x-auto gap-2 pb-1 [&::-webkit-scrollbar]:hidden">
              {tags.map((tag, i) => (
                <span key={tag} className={`shrink-0 px-2.5 py-1 sm:py-1.5 rounded-[6px] text-[11px] sm:text-[12px] font-inter font-semibold border ${i < 2 ? "bg-[#F8FAFC] text-[#475569] border-slate-200" : "bg-white text-[#0F172A] border-slate-200 shadow-sm"}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <motion.div variants={containerVars} initial="hidden" animate="show" className="flex overflow-x-auto md:grid md:grid-cols-2 xl:grid-cols-4 gap-3 mb-5 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
            {/* Cards omitted for brevity - Keep as original if possible, but minimal implementation here to save space */}
            <motion.div variants={cardVars} className="shrink-0 w-[220px] md:w-auto p-4 rounded-[14px] bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={14} className="text-[#94A3B8]" />
                  <span className="text-[10px] font-inter font-bold text-[#94A3B8] uppercase tracking-widest">Supplier Network</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[24px] font-sora font-extrabold text-[#0F172A] leading-none">156</span>
                  <span className="text-[13px] font-inter font-semibold text-[#475569]">Suppliers</span>
                </div>
              </div>
            </motion.div>
            <motion.div variants={cardVars} className="shrink-0 w-[220px] md:w-auto p-4 rounded-[14px] bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown size={14} className="text-[#94A3B8]" />
                  <span className="text-[10px] font-inter font-bold text-[#94A3B8] uppercase tracking-widest">Best Price</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[24px] font-sora font-extrabold text-[#0F172A] leading-none">₹67,499</span>
                </div>
              </div>
            </motion.div>
            <motion.div variants={cardVars} className="shrink-0 w-[220px] md:w-auto p-4 rounded-[14px] bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Wallet size={14} className="text-[#94A3B8]" />
                  <span className="text-[10px] font-inter font-bold text-[#94A3B8] uppercase tracking-widest">You Save</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[24px] font-sora font-extrabold text-[#0F172A] leading-none">₹2,500</span>
                  <span className="text-[#10B981] text-[12px] font-inter font-bold">3.6% ↓</span>
                </div>
              </div>
            </motion.div>
            <motion.div variants={cardVars} className="shrink-0 w-[220px] md:w-auto p-4 rounded-[14px] bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package size={14} className="text-[#94A3B8]" />
                  <span className="text-[10px] font-inter font-bold text-[#94A3B8] uppercase tracking-widest">Bulk Advantage</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[24px] font-sora font-extrabold text-[#0F172A] leading-none">MOQ 10</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="mt-auto pt-4 border-t border-slate-200">
            <div className="flex flex-row items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col mr-1">
                  <span className="text-[11px] font-inter font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Procurement Volume</span>
                  <span className="text-[12px] font-inter font-medium text-[#475569]">Calculate landed cost</span>
                </div>
                <div className="flex items-center h-10 rounded-[10px] bg-white border border-slate-200 shadow-sm overflow-hidden shrink-0">
                  <button onClick={() => setQty(Math.max(10, qty - 1))} className="w-10 h-full flex items-center justify-center text-[#475569] hover:bg-[#F8FAFC] font-sora font-bold">−</button>
                  <input value={qty} readOnly className="w-12 text-center font-sora font-bold text-[14px] text-[#0F172A] outline-none border-x border-slate-200 bg-white" />
                  <button onClick={() => setQty(qty + 1)} className="w-10 h-full flex items-center justify-center text-[#475569] hover:bg-[#F8FAFC] font-sora font-bold">+</button>
                </div>
                <div className="hidden md:flex gap-1.5">
                  {[25, 50, 75, 100].map((q) => (
<button
  key={q}
  onClick={() => setQty(q)}
  className={`
    px-2.5 
    py-1.5 
    rounded-[8px] 
    text-[12px] 
    font-inter 
    font-bold 
    transition-all 
    border
    ${
      qty === q
        ? "bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white border-transparent shadow-md hover:shadow-lg"
        : "bg-white text-[#475569] border-slate-200 hover:bg-[#F8FAFC] hover:border-pink-200"
    }
  `}
>
  {q}
</button>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-inter font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Est. Value</p>
                <p className="text-[24px] md:text-[28px] font-sora font-extrabold text-[#0F172A] tracking-tight leading-none">
                  {inr(priceForTier(67499, qty) * qty)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="w-full xl:w-[320px] bg-[#F8FAFC] border-t xl:border-t-0 xl:border-l border-slate-200 p-4 sm:p-5 xl:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-sora font-bold text-[18px] text-[#0F172A] mb-1 tracking-tight">Supplier Matrix</h3>
                <p className="text-[12px] font-inter font-medium text-[#475569] flex items-center gap-1"><Info size={12} className="text-[#94A3B8]" /> Top 3 matches</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-[11px] font-inter font-bold uppercase tracking-widest text-[#94A3B8] mb-2">Verified Sellers</h4>
              {sellers.map((s, idx) => (
                <div key={s.name} className="group cursor-pointer">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-inter font-bold text-[#0F172A] group-hover:text-[#EC4899] transition-colors truncate max-w-[150px]">{s.name}</span>
                      {s.verified && <CheckCircle2 size={12} className="text-[#10B981] shrink-0" />}
                    </div>
                    <span className="text-[14px] font-sora font-extrabold text-[#0F172A] tracking-tight shrink-0">{s.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${s.match}%` }} transition={{ duration: 0.8, delay: 0.2 + (idx * 0.1), ease: "easeOut" }} className={`h-full rounded-full ${s.match > 90 ? "bg-[#0F172A]" : "bg-[#94A3B8]"}`} />
                    </div>
                    <span className="text-[11px] font-sora font-bold text-[#475569] w-7 text-right shrink-0">{s.match}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-200">
            <GradientButton className="w-full group flex items-center justify-between py-2.5 px-4 rounded-[12px] bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow transition-all">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} />
                <span className="text-[13px] font-inter font-bold" >Compare 156 Suppliers</span>
              </div>
              <ChevronRight size={14} className="text-[#94A3B8] group-hover:text-[#0F172A] group-hover:translate-x-1 transition-all" />
            </GradientButton>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────
   AI BULK DEAL WIDGET
───────────────────────────────────────────── */
function BulkDealSection() {
  const bulk = [
    { rank: 1, name: 'ABC Wholesale Mart', minQty: '1,000 Units', unitPrice: '₹64,500', saving: '₹2,999 / unit' },
    { rank: 2, name: 'SK Distributors', minQty: '500 Units', unitPrice: '₹65,800', saving: '₹1,699 / unit' },
    { rank: 3, name: 'Global Trade Hub', minQty: '2,000 Units', unitPrice: '₹63,200', saving: '₹4,299 / unit' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12 w-full">
      <FloatingSurface className="xl:col-span-1 p-8 overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#EC4899]/10 via-[#F97316]/10 to-transparent blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 flex-1">
          {/* Top Header */}
          <div className="flex items-center justify-between mb-4">
            <PremiumBadge text="BEST MATCH" />
            <span className="text-[12px] font-inter text-[#0F172A] font-semibold px-3 py-1.5 bg-white shadow-sm rounded-lg border border-slate-200">
              50 Units Req.
            </span>
          </div>

          {/* Supplier Profile Section */}
          <div className="mb-4">
            <p className="text-[18px] font-sora font-bold text-[#0F172A] mb-2">Sri Lakshmi Traders</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[13px] font-inter font-medium text-[#64748B]">
                <MapPin size={16} />
                <span>Chennai, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] font-inter font-medium text-[#64748B]">
                <Star size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-[#0F172A] font-bold">4.8</span>
                <span>245 Reviews</span>
              </div>
            </div>
          </div>

          {/* Price Area */}
          <div className="mb-3 flex flex-col items-start">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[36px] font-sora font-extrabold text-[#0F172A] tracking-tight">₹67,200</span>
              <span className="text-[14px] font-inter font-medium text-[#94A3B8]">/ unit</span>
            </div>
            <span className="px-2 py-1 bg-slate-100 text-[#64748B] text-[11px] font-inter font-bold rounded-md uppercase tracking-wider">
              AI Recommended Price
            </span>
          </div>

          {/* Saving Section */}
          <div className="inline-block px-3 py-1.5 rounded-lg bg-orange-50 mb-4 border border-orange-100">
            <p className="text-[13px] font-inter font-bold bg-clip-text text-transparent" style={{ backgroundImage: CTA_GRAD }}>
              Save ₹1,39,950 total vs Market Avg.
            </p>
          </div>

          {/* Contact Action Area */}
          <div className="flex items-center gap-3 mb-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-inter font-bold text-[#0F172A] shadow-sm hover:bg-slate-50 transition-all">
              <MessageCircle size={16} />
              Message
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#0F172A] rounded-lg text-[13px] font-inter font-bold text-white shadow-sm hover:bg-[#1E293B] transition-all">
              <Phone size={16} />
              Call Now
            </button>
          </div>
        </div>

        {/* Main CTA Update */}
        <GradientButton className="w-full py-3">
          <div className="flex items-center justify-center gap-3">
            <ShoppingBag size={20} className="text-white" />
            <div className="flex flex-col items-start text-left">
              <span className="text-[16px] font-sora font-bold text-white leading-tight">Place Order</span>
            </div>
          </div>
        </GradientButton>
      </FloatingSurface>

<FloatingSurface className="xl:col-span-2 p-8 flex flex-col justify-between">
  
  {/* Header */}
  <div className="flex items-center gap-4 mb-8">
    <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] flex items-center justify-center border border-slate-200 shadow-sm">
      <TrendingDown size={22} className="text-[#0F172A]" />
    </div>

    <div>
      <h3 className="text-[20px] font-sora font-bold text-[#0F172A]">
        Volume Pricing Intelligence
      </h3>
      <p className="text-[15px] font-inter text-[#475569] mt-1">
        Scale your order quantity to unlock deeper supplier discounts.
      </p>
    </div>
  </div>

  {/* Table */}
  <div className="space-y-3">
    {bulk.map((b) => (
      <div
        key={b.rank}
        className="grid grid-cols-12 gap-4 items-center p-5 rounded-[20px] bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
      >
        
        {/* Rank + Name */}
        {/* min-w-0 on the wrapper is crucial for flex children to truncate correctly */}
        <div className="col-span-12 md:col-span-3 flex items-center gap-3 min-w-0">
          <span className="w-7 h-7 flex-shrink-0 rounded-full bg-[#0F172A] text-white text-[12px] font-sora font-bold flex items-center justify-center shadow-md">
            {b.rank}
          </span>

          <span className="font-inter font-bold text-[15px] text-[#0F172A] truncate flex-1 block">
            {b.name}
          </span>
        </div>

        {/* MOQ */}
        <div className="col-span-4 md:col-span-2 mt-4 md:mt-0">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            MOQ
          </p>
          <p className="text-[15px] font-bold text-[#475569] truncate">
            {b.minQty}
          </p>
        </div>

        {/* Price */}
        <div className="col-span-4 md:col-span-3 mt-4 md:mt-0">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Unit Price
          </p>
          <p className="text-[18px] font-sora font-extrabold text-[#0F172A] truncate">
            {b.unitPrice}
          </p>
        </div>

        {/* Savings */}
        <div className="col-span-4 md:col-span-2 mt-4 md:mt-0">
          <p className="text-[11px] font-semibold text-[#10B981] uppercase tracking-wider">
            Savings
          </p>
          <p className="text-[15px] font-bold text-[#10B981] truncate">
            ↓ {b.saving}
          </p>
        </div>

        {/* CTA */}
        <div className="col-span-12 md:col-span-2 flex justify-end mt-5 md:mt-0">
          <button
            onClick={() => openBulkDetails?.(b)}
            className="group/btn flex items-center justify-center gap-2 px-4 w-full md:w-auto h-[40px] 
            bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500
             rounded text-[13px] font-bold text-white transition-all duration-200
              hover:shadow-[0_4px_12px_rgba(244,63,94,0.3)] hover:-translate-y-0.5"
          >
            View
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover/btn:translate-x-1"
            />
          </button>
        </div>

      </div>
    ))}
  </div>

</FloatingSurface>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION 4: SUPPLIER TABLE & COMPARISON
───────────────────────────────────────────── */
const COL_HEADERS = [
  { label: '#', w: 'w-[60px]' },
  { label: 'Supplier', w: 'w-[280px]' },
  { label: 'Location', w: 'w-[150px]' },
  { label: 'MOQ', w: 'w-[160px]' },
  { label: 'Your Quantity', w: 'w-[160px]' },
  { label: 'Bulk Deal', w: 'w-[160px]' },
  { label: 'Rating', w: 'w-[120px]' },
  { label: 'Delivery', w: 'w-[130px]' },
  { label: 'Score', w: 'w-[100px]' },
  { label: 'Available Stock', w: 'w-[140px]' },
  { label: 'Actions', w: 'w-[240px] text-right' },
];

function SupplierRow({ supplier, rank, qty, onSelect, delay }) {
  const dynamicPrice = priceForTier(supplier.moqPrice, qty);
  const totalPurchaseValue = dynamicPrice * qty;
  const isSelected = false; // Add select logic if needed

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`group relative hover:bg-[#FDFDFE] transition-all border-b border-slate-100 last:border-b-0 whitespace-nowrap z-10 hover:z-20
        hover:-translate-y-[2px] hover:shadow-[0_10px_40px_rgba(15,23,42,0.06)] h-[90px] bg-white
        ${isSelected ? 'outline outline-2 outline-pink-500/50' : ''}`}
    >
      <td className="py-2 pl-8 pr-4 align-middle rounded-l-[16px]">
        <span className="w-8 h-8 rounded-[10px] bg-white border border-slate-200 group-hover:bg-[#0F172A] text-[13px] font-sora font-bold text-[#475569] group-hover:text-white group-hover:border-[#0F172A] flex items-center justify-center transition-all shadow-sm">
          {rank}
        </span>
      </td>
      <td className="py-2 px-4 align-middle">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[16px] bg-[#0F172A] text-white font-sora font-bold text-[15px] flex items-center justify-center shadow-md shrink-0">
            {supplier.initials}
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-sora font-bold text-[15px] text-[#0F172A] leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#EC4899] group-hover:to-[#F97316] transition-all">
                {supplier.name}
              </span>
              {supplier.verified && <ShieldCheck size={16} className="text-[#10B981]" />}
            </div>
            {supplier.badge && <PremiumBadge text={supplier.badge} />}
          </div>
        </div>
      </td>
      <td className="py-2 px-4 align-middle">
        <span className="flex items-center gap-1.5 text-[14px] font-inter font-medium text-[#475569]">
          <MapPin size={16} className="text-[#94A3B8] shrink-0" />
          {supplier.location}
        </span>
      </td>

      {/* NEW COLUMN 1: MOQ PRICE */}
      <td className="py-2 px-4 align-middle border-l border-slate-100">
        <div className="flex flex-col">
          <span className="text-[10px] font-inter font-bold text-[#94A3B8] mt-1 tracking-widest uppercase">Min {supplier.moq} Units</span>
          <span className="text-[16px] font-sora font-extrabold text-[#0F172A]">{inr(supplier.moqPrice)}</span>
        </div>
      </td>

      {/* NEW COLUMN 2: YOUR QUANTITY */}
      <td className="py-2 px-4 align-middle bg-[#F8FAFC]/50">
        <div className="flex flex-col relative group/tooltip">
          <span className="flex items-center gap-1 text-[10px] font-inter font-bold text-[#94A3B8] uppercase tracking-widest mb-1">
            Your Order ({qty})
            <Info size={10} className="text-[#94A3B8]" />
          </span>
          <span className="text-[18px] font-sora font-extrabold text-[#10B981] tabular-nums">{inr(dynamicPrice)}</span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover/tooltip:block w-48 p-2 bg-[#0F172A] text-white text-[11px] font-inter rounded-lg shadow-lg z-50">
            AI calculated based on supplier volume discount
          </div>
        </div>
      </td>

      {/* NEW COLUMN 3: BULK DEAL */}
      <td className="py-2 px-4 align-middle border-r border-slate-100">
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-inter font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Bulk {supplier.bulkDeal.qty}+ Units</span>
          <span className="text-[16px] font-sora font-extrabold text-[#0F172A] mb-1">{inr(supplier.bulkDeal.price)}</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] bg-emerald-50 text-emerald-600 text-[9px] font-sora font-bold uppercase tracking-widest border border-emerald-100">
            Save {inr(supplier.bulkDeal.saving)}
          </span>
        </div>
      </td>

      <td className="py-2 px-4 align-middle">
        <div className="flex flex-col">
          <span className="flex items-center gap-1.5 text-[14px] font-sora font-bold text-[#0F172A]">
            ⭐ {supplier.rating}
          </span>
          <span className="text-[12px] font-inter font-medium text-[#94A3B8] mt-1">{supplier.reviews} reviews</span>
        </div>
      </td>
      <td className="py-2 px-4 align-middle">
        <span className="flex items-center gap-2 text-[14px] font-inter font-semibold text-[#0F172A]">
          <Truck size={16} className="text-[#94A3B8]" /> {supplier.delivery}
        </span>
      </td>
      <td className="py-2 px-4 align-middle">
        <ScoreRing score={supplier.score} size={46} />
      </td>
      <td className="py-2 px-4 align-middle">
        <div className="flex flex-col">
          <span className={`text-[18px] font-sora font-bold ${supplier.stock < 100 ? 'text-[#F97316]' : 'text-[#0F172A]'}`}>
            {supplier.stock.toLocaleString()} <span className="text-[12px] font-inter text-[#94A3B8] font-medium ml-0.5">{supplier.stockUnit}</span>
          </span>
          {supplier.stock < 100 && (
            <span className="text-[10px] font-inter font-bold text-[#F97316] mt-0.5 tracking-wide uppercase">Low stock</span>
          )}
        </div>
      </td>
      <td className="py-2 pl-4 pr-8 align-middle text-right">
        <div className="flex items-center justify-end gap-2 ">
          <SecondaryButton 
            onClick={(e) => { e.stopPropagation(); onSelect(supplier); }} 
            className="h-10 px-3 rounded text-[13px] border-slate-200 hover:border-slate-300"
          >
            Details <ExternalLink size={14} className="ml-1.5 text-[#94A3B8]" />
          </SecondaryButton>
          <button className="h-10 px-4 rounded bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white flex items-center justify-center gap-2 text-[13px] font-inter font-bold hover:bg-[#1E293B] shadow-md hover:shadow-lg transition-all active:scale-95">
            <Phone size={14} className="opacity-80" /> Call Now
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

function SupplierTable({ qty, onSelect }) {
  const [visibleCount, setVisibleCount] = useState(5);
  
  const handleLoadMore = () => {
    setVisibleCount(10);
  };

  const handleLessSeller = () => {
    setVisibleCount(5);
  }

  return (
    <div className="w-full flex flex-col mt-4">
      {/* Scrollable Table Container */}
      <div className="w-full overflow-x-auto overflow-y-auto custom-scrollbar relative max-h-[600px] border-b border-slate-200">
        <table className="w-full text-left border-collapse min-w-[1400px]">
          <thead className="sticky top-0 z-30 table-header-shadow">
            <tr className="bg-[#F8FAFC] border-y border-slate-200">
              {COL_HEADERS.map((h, i) => (
                <th 
                  key={h.label} 
                  className={`py-4 px-4 ${i === 0 ? 'pl-8' : ''} ${i === COL_HEADERS.length - 1 ? 'pr-8' : ''} text-[11px] font-inter font-bold uppercase tracking-widest text-[#94A3B8] whitespace-nowrap bg-[#F8FAFC] backdrop-blur-md ${h.w}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {SUPPLIERS.slice(0, visibleCount).map((s, i) => (
              <SupplierRow key={s.id} supplier={s} rank={i + 1} qty={qty} onSelect={onSelect} delay={i * 0.05} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 md:px-8 py-5 bg-[#FDFDFE] flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-[28px]">
        <span className="text-[14px] font-inter font-medium text-[#475569]">
          Showing <strong className="text-[#0F172A]">{visibleCount}</strong> of 156 verified suppliers
        </span>
        
        {visibleCount < 10 ? (
          <button 
            onClick={handleLoadMore}
            className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-white border border-slate-200 text-[14px] font-inter font-semibold text-[#0F172A] hover:bg-[#F8FAFC] hover:shadow-sm transition-all"
          >
            View All Seller <ChevronDown size={16} className="text-[#94A3B8]" />
          </button>
        ) : (
          <button className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-white border border-slate-200 text-[14px] font-inter font-semibold text-[#0F172A] hover:bg-[#F8FAFC] hover:shadow-sm transition-all"
          onClick={handleLessSeller}>
            <ChevronUp size={16} /> Less All Seller
          </button>
        )}
      </div>
    </div>
  );
}

const FILTER_OPTS = ['Location', 'Seller Type', 'MOQ', 'Delivery', 'Rating', 'Price Range'];
const SORT_OPTS = ['Lowest Price', 'Best Value', 'Nearest Seller', 'Fast Delivery'];

function PriceComparisonSection({ sortBy, setSortBy, onSelect, qty }) {
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-slate-200 rounded-[28px] shadow-[0_20px_50px_rgba(15,23,42,0.08)] flex flex-col w-full overflow-hidden mb-16"
    >
      <div className="px-6 pt-6 md:px-8 md:pt-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-sora font-bold text-[#0F172A] tracking-tight">Compare Verified Suppliers</h2>
          <p className="text-[15px] font-inter font-medium text-[#475569] mt-1.5 max-w-2xl">
            Review live quotes, supplier trust score, pricing intelligence and secure procurement deals.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[12px] bg-[#F8FAFC] border border-slate-200 shadow-sm shrink-0">
          <ShieldCheck size={16} className="text-[#10B981]" />
          <span className="text-[13px] font-sora font-bold text-[#0F172A]">156 Verified Suppliers</span>
        </div>
      </div>

      <div className="px-6 md:px-8 mt-6 w-full">
        <div className="relative w-full group">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#0F172A] transition-colors order " />
          <input
            type="text"
            placeholder="Search supplier, location, SKU, GST, product..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full h-[52px] rounded-[16px] bg-[#F8FAFC] pl-12 pr-16 text-[15px]
             font-inter font-medium text-[#0F172A] placeholder-[#94A3B8] outline-none border border-slate-200 focus:border-pink-300
             focus:ring-0.5 focus:ring-pink-300 transition-all shadow-[inset_0_2px_4px_rgba(15,23,42,0.02)]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center px-2 py-1 rounded-[8px] bg-white border border-slate-200 shadow-sm text-[#94A3B8] text-[12px] font-bold font-mono">
            <Mic height={20}/>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 mt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 lg:pb-0">
          <span className="text-[13px] font-inter font-bold text-[#475569] uppercase tracking-wider shrink-0">Filter By</span>
          <div className="w-px h-6 bg-slate-200 hidden md:block shrink-0 mx-1" />
          {FILTER_OPTS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(activeFilter === f ? null : f)}
              className={`flex items-center gap-2 h-[42px] px-4 rounded-[14px] text-[13px] font-inter font-bold transition-all shrink-0 border ${
                activeFilter === f
                  ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md'
                  : 'text-[#475569] bg-white border-slate-200 hover:bg-[#F8FAFC] hover:-translate-y-0.5 hover:shadow-sm'
              }`}
            >
              {f} <ChevronDown size={14} className={`transition-transform duration-200 ${activeFilter === f ? 'text-white rotate-180' : 'text-[#94A3B8]'}`} />
            </button>
          ))}
        </div>

        <div className="relative shrink-0 w-full lg:w-[220px] z-40">
          <button
            onClick={() => setSortOpen(o => !o)}
            className="flex items-center justify-between w-full h-[42px] px-4 rounded-[14px] bg-white text-[13px] font-inter font-bold text-[#0F172A] border border-slate-200 hover:bg-[#F8FAFC] hover:-translate-y-0.5 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-[#94A3B8]" />
              Sort: {sortBy}
            </div>
            <ChevronDown size={16} className={`text-[#94A3B8] transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-[calc(100%+8px)] w-full rounded-[16px] bg-white shadow-xl overflow-hidden border border-slate-200"
              >
                {SORT_OPTS.map(o => (
                  <button key={o} onClick={() => { setSortBy(o); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-[13px] font-inter transition-colors ${sortBy === o ? 'bg-[#F8FAFC] text-[#0F172A] font-bold border-l-2 border-l-[#0F172A]' : 'text-[#475569] font-medium hover:bg-[#F8FAFC] border-l-2 border-l-transparent'}`}>
                    {o}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <SupplierTable onSelect={onSelect} qty={qty} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   NEGOTIATION & DRAWER
───────────────────────────────────────────── */
function DrawerStatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[20px] bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2.5 mb-3">
        <Icon size={18} className="text-[#94A3B8]" />
        <span className="text-[11px] font-inter font-bold uppercase tracking-widest text-[#94A3B8]">{label}</span>
      </div>
      <p className="text-[20px] font-sora font-bold text-[#0F172A]">{value}</p>
    </div>
  );
}

function SupplierDrawer({ supplier, details, onClose }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    if (supplier) document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', fn);
      document.body.style.overflow = 'unset';
    };
  }, [supplier, onClose]);

  if (!supplier || !details) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
<motion.div
  initial={{ opacity: 0, scale: 0.97, y: 15 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.97, y: 15 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
  className="relative w-full max-w-[680px] rounded-xl bg-white shadow-[0_20px_40px_-15px_rgba(15,23,42,0.1)] border border-slate-200 text-slate-700 antialiased"
>
  {/* Header Section */}
  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center rounded-t-xl">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center text-white font-medium text-sm shadow-sm ring-1 ring-slate-900/5">
        {supplier.initials}
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-900 leading-none">{supplier.name}</h2>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="flex items-center gap-1 text-slate-500 text-[11px] font-medium">
            <MapPin size={12} className="text-slate-400" /> {supplier.location}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100 flex items-center gap-1">
            <Zap size={10} /> {supplier.badge}
          </span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <div className="px-2.5 py-1 rounded-md border border-slate-200 bg-white flex items-center gap-1.5 shadow-sm">
        <Star className="fill-yellow-400 text-yellow-400" size={12} />
        <span className="text-xs font-semibold text-slate-900">{supplier.rating}</span>
        <span className="text-[10px] font-medium text-slate-500">({supplier.reviews})</span>
      </div>
      <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors">
        <X size={16} />
      </button>
    </div>
  </div>

  {/* Main Content Body */}
  <div className="p-5 flex flex-col gap-5">
    
    {/* Core Pricing & Inventory (Ultra-compact) */}
    <div className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-slate-100 p-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Base Unit Price</p>
          <div className="flex items-baseline gap-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{inr(supplier.moqPrice)}</h1>
            <span className="text-xs text-slate-500 font-medium">/ unit</span>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-slate-600 text-[11px] font-medium">
            <Boxes size={12} className="text-slate-400" /> MOQ: {supplier.moq} {supplier.moqUnit}
          </div>
        </div>
        <div className="pl-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Availability</p>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{supplier.stock}</h1>
          <p className="mt-1.5 text-slate-600 flex items-center gap-1 text-[11px] font-medium">
            <Truck size={12} className="text-slate-400" /> Ships in {supplier.delivery}
          </p>
        </div>
      </div>

      {/* Bulk Deal Strip */}
      <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Deal</span>
          <span className="text-slate-700 text-xs font-medium">{supplier.bulkDeal.qty} Units @ {inr(supplier.bulkDeal.price)}</span>
        </div>
        <span className="text-green-600 font-semibold text-[11px]">Save {inr(supplier.bulkDeal.saving)}</span>
      </div>
    </div>

    {/* Supplier Metrics Grid */}
    <div>
      <h3 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wide">Supplier Metrics</h3>
      <div className="grid grid-cols-4 gap-2">
        {/* Inline DrawerStatCards for max compactness */}
        <div className="border border-slate-100 rounded-md bg-slate-50 p-2.5 flex flex-col gap-1 text-left">
          <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1"><Package size={10} /> Completed</span>
          <span className="text-sm font-semibold text-slate-900">{details.orders}</span>
        </div>
        <div className="border border-slate-100 rounded-md bg-slate-50 p-2.5 flex flex-col gap-1 text-left">
          <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1"><MessageCircle size={10} /> Response</span>
          <span className="text-sm font-semibold text-slate-900">{details.responseRate}</span>
        </div>
        <div className="border border-slate-100 rounded-md bg-slate-50 p-2.5 flex flex-col gap-1 text-left">
          <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1"><Clock size={10} /> On-Time</span>
          <span className="text-sm font-semibold text-slate-900">{details.onTime}</span>
        </div>
        <div className="border border-slate-100 rounded-md bg-slate-50 p-2.5 flex flex-col gap-1 text-left">
          <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1"><Shield size={10} /> Warranty</span>
          <span className="text-sm font-semibold text-slate-900">{details.warranty}</span>
        </div>
      </div>
    </div>

    {/* Trust Badges */}
    <div className="flex gap-2">
      <span className="px-2 py-1 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Verified Partner</span>
      <span className="px-2 py-1 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">Secure Checkout</span>
      <span className="px-2 py-1 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">Quality Checked</span>
    </div>

    {/* Bottom Action Row (Combined for space-saving) */}
    <div className="pt-3 border-t border-slate-100 flex gap-3">
      <div className="flex gap-2 w-1/2">
        <button className="flex-1 border border-slate-200 rounded-lg py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-1.5">
          <MessageCircle size={14} /> Chat
        </button>
        <button className="flex-1 border border-slate-200 rounded-lg py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-1.5">
          <Phone size={14} /> Call
        </button>
      </div>
      <button className="w-1/2 py-2 rounded-lg font-semibold text-xs text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all flex items-center justify-center gap-1.5">
        <ShoppingBag size={14} /> Initialize Order
      </button>
    </div>

  </div>
</motion.div>
      </div>
    </AnimatePresence>
  );
}

function NegotiationCRM({ qty }) {
  const [negQty, setNegQty] = useState(qty);
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setNegQty(qty);
  }, [qty]);


  function handleSend() {
    if (!price || !msg) return;

    setSent(true);

    setTimeout(() => {
      setSent(false);
      setPrice("");
      setMsg("");
    }, 3000);
  }


  const input =
    "w-full h-[52px] md:h-[56px] px-4 md:px-5 rounded-[14px] bg-white border border-slate-200 outline-none text-[14px] md:text-[15px] font-inter font-medium text-[#0F172A] placeholder:text-slate-400 transition-all focus:border-[#EC4899] focus:ring-2 focus:ring-pink-500/10";


  return (

    <motion.section
      initial={{opacity:0,y:30}}
      whileInView={{opacity:1,y:0}}
      viewport={{once:true}}
      transition={{duration:.5}}
      className="w-full max-w-[1440px] mx-auto px-0"
    >

      <FloatingSurface
        className="
        relative 
        overflow-hidden
        p-4
        sm:p-6
        md:p-8
        lg:p-10
        mb-8
        "
      >


        {/* Premium gradient accent */}
        <div
          className="
          absolute 
          top-0 
          left-0 
          w-full 
          h-[4px]
          "
          style={{
            background:C.gradientCTA
          }}
        />



        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-8">


          <div>


            <div className="
            inline-flex
            items-center
            gap-2
            px-3
            py-1.5
            rounded-full
            bg-pink-50
            border
            border-pink-100
            mb-4
            ">

              <Zap size={14} className="text-pink-500"/>

              <span className="
              text-[11px]
              font-sora
              font-bold
              uppercase
              tracking-widest
              text-pink-600
              ">
                Supplier Negotiation
              </span>

            </div>



            <h2
            className="
            text-[22px]
            sm:text-[26px]
            md:text-[32px]
            font-sora
            font-extrabold
            text-[#0F172A]
            tracking-tight
            "
            >

              Request Custom Quote

            </h2>


            <p
            className="
            mt-2
            text-[13px]
            md:text-[15px]
            font-inter
            text-[#475569]
            "
            >

              Negotiate directly with verified suppliers and get the best bulk pricing.

            </p>


          </div>




          {/* PRODUCT SUMMARY */}

          <div
          className="
          w-full
          lg:w-[360px]
          p-4
          rounded-[18px]
          bg-[#F8FAFC]
          border
          border-slate-200
          "
          >


            <p className="
            text-[10px]
            uppercase
            tracking-widest
            font-bold
            text-slate-400
            mb-2
            ">
              Product
            </p>


            <h3
            className="
            text-[15px]
            md:text-[17px]
            font-sora
            font-bold
            text-[#0F172A]
            "
            >

              {PRODUCT.name}

            </h3>



            <div
            className="
            flex
            items-center
            gap-3
            mt-3
            flex-wrap
            "
            >

              <span
              className="
              px-3
              py-1.5
              rounded-lg
              bg-white
              border
              border-slate-200
              text-[12px]
              font-bold
              text-slate-600
              "
              >
                Qty: {negQty} Units
              </span>


              <span
              className="
              px-3
              py-1.5
              rounded-lg
              bg-white
              border
              border-slate-200
              text-[12px]
              font-bold
              text-slate-600
              "
              >

                Market:
                {" "}
                {inr(priceForTier(PRODUCT.recommended,negQty))}

              </span>


            </div>


          </div>


        </div>





        {/* FORM GRID */}

        <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-4
        md:gap-6
        "
        >



          {/* Quantity */}

          <div>

            <label className="
            block
            text-[12px]
            font-bold
            text-slate-500
            uppercase
            tracking-widest
            mb-2
            ">
              Required Quantity
            </label>


            <div className="relative">

            <input

              type="number"

              value={negQty}

              onChange={(e)=>setNegQty(e.target.value)}

              className={input}

            />

            <span
            className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-xs
            font-bold
            text-slate-400
            "
            >
              Units
            </span>


            </div>


          </div>





          {/* Price */}


          <div>


          <label className="
            block
            text-[12px]
            font-bold
            text-slate-500
            uppercase
            tracking-widest
            mb-2
            ">

              Target Price / Unit

          </label>



          <input

          type="number"

          value={price}

          onChange={(e)=>setPrice(e.target.value)}

          placeholder={
            `Below ${inr(
              priceForTier(
                PRODUCT.recommended,
                negQty
              )
            )}`
          }

          className={input}

          />


          </div>



        </div>





        {/* MESSAGE */}


        <div className="mt-5">


        <label className="
        block
        text-[12px]
        font-bold
        text-slate-500
        uppercase
        tracking-widest
        mb-2
        ">

          Message To Supplier

        </label>
        <textarea

        rows={4}

        value={msg}

        onChange={(e)=>setMsg(e.target.value)}

        placeholder="
        Mention payment terms, delivery requirements, warranty, customization...
        "

        className="
        w-full
        px-4
        md:px-5
        py-4
        rounded-[16px]
        bg-white
        border
        border-slate-200
        outline-none
        text-[14px]
        font-inter
        resize-none
        focus:border-pink-500
        focus:ring-2
        focus:ring-pink-500/10
        "

        />
        </div>
        {/* FOOTER CTA */}

        <div
        className="
        mt-6
        flex
        flex-col
        sm:flex-row
        sm:items-center
        gap-4
        "
        >
        <GradientButton
        icon={sent ? CheckCircle2 : ArrowRight}
        onClick={handleSend}
        className="
        w-full
        sm:w-auto
        px-6
        py-3.5
        text-[14px]
        md:text-[15px]
        "
        >
          {
            sent
            ?
            "Quote Sent Successfully"
            :
            "Send Negotiation Request"
          }
        </GradientButton>
        <div
        className="
        flex
        items-center
        gap-2
        text-[12px]
        md:text-[13px]
        text-slate-500
        font-inter
        "
        >
          <ShieldCheck size={16} className="text-emerald-500"/>
          No commitment until supplier accepts
        </div>
        </div>
      </FloatingSurface>
    </motion.section>

  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ComparePrice() {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [sortBy, setSortBy] = useState('Lowest Price');
  const [qty, setQty] = useState(50); // Lifted state

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: typographyStyles }} />
      <div className="min-h-screen font-inter antialiased selection:bg-[#EC4899]/20 selection:text-[#0F172A] flex flex-col w-full overflow-x-hidden">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[1440px] mx-auto sm:px-1 lg:px-1  space-y-6"
        >
          <ProductHeader qty={qty} setQty={setQty} />

          <div className="mb-14 w-full">
            <h2 className="text-[24px] font-sora font-bold text-[#0F172A] mb-8">AI Purchase Intelligence</h2>
            <BulkDealSection />
          </div>

          <PriceComparisonSection 
            sortBy={sortBy} 
            setSortBy={setSortBy} 
            onSelect={setSelectedSupplier} 
            qty={qty}
          />
        </motion.main>

        <SupplierDrawer
          supplier={selectedSupplier}
          details={selectedSupplier ? SUPPLIER_DETAILS[selectedSupplier.id] : null}
          onClose={() => setSelectedSupplier(null)}
        />
      </div>

      <motion.div {...fadeUp} className="mx-auto px-4 sm:px-8 w-full max-w-[1200px]">
        <NegotiationCRM qty={qty} />
      </motion.div>
    </>
  );
}