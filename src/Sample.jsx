import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingDown,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  Clock,
  Star,
  MapPin,
  MessageSquare,
  FileText,
  ShoppingCart,
  ChevronRight,
  Truck,
  Zap,
  Award,
  CheckCircle2,
  ArrowRight,
  Package,
  Activity
} from "lucide-react";

import MainPage from './MainPage'


/* ----------------------------------------------------------------------- */
/* DESIGN TOKENS — Premium Light SaaS System                              */
/* ----------------------------------------------------------------------- */

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
  pinkSoft: "rgba(236, 72, 153, 0.08)",
  rose: "#F43F5E",
  orange: "#F97316",
  success: "#16A34A",
  successSoft: "rgba(22, 163, 74, 0.1)",
  shadowPremium: "0 20px 50px rgba(15,23,42,0.08)",
  shadowHover: "0 25px 60px rgba(15,23,42,0.12)",
};

const FONTS = {
  display: "'Sora', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

function useGoogleFonts() {
  useEffect(() => {
    if (document.getElementById("sl-fonts-light")) return;
    const link = document.createElement("link");
    link.id = "sl-fonts-light";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* ----------------------------------------------------------------------- */
/* DATA                                                                   */
/* ----------------------------------------------------------------------- */

const PRODUCT = {
  name: "Samsung Galaxy S25 Ultra 5G",
  category: "Smartphones · 256GB · Titanium Black",
  sku: "SM-S928B",
  marketAvg: 69999,
  recommended: 67499,
  suppliers: 156,
  trend: -8,
};

const SUPPLIERS = [
  {
    id: "abc",
    name: "ABC Wholesale",
    location: "Chennai, TN",
    rating: 4.8,
    orders: 1240,
    gst: true,
    kyc: true,
    delivery: "2–3 days",
    moq: 10,
    tags: ["best", "lowest"],
    priceBase: 67499,
  },
  {
    id: "xyz",
    name: "XYZ Distributors",
    location: "Coimbatore, TN",
    rating: 4.6,
    orders: 860,
    gst: true,
    kyc: true,
    delivery: "1–2 days",
    moq: 50,
    tags: ["fast"],
    priceBase: 68200,
  },
  {
    id: "vrt",
    name: "Vertex Traders",
    location: "Bengaluru, KA",
    rating: 4.5,
    orders: 540,
    gst: true,
    kyc: false,
    delivery: "3–4 days",
    moq: 20,
    tags: [],
    priceBase: 68750,
  },
];

const QUANTITY_TIERS = [10, 50, 100, 500];

function priceForTier(base, qty) {
  if (qty >= 500) return Math.round(base * 0.977);
  if (qty >= 100) return Math.round(base * 0.989);
  if (qty >= 50) return Math.round(base * 0.996);
  return base;
}

function bestSupplierForQty(qty) {
  const priced = SUPPLIERS.map((s) => ({ ...s, unitPrice: priceForTier(s.priceBase, qty) }));
  return priced.reduce((a, b) => (b.unitPrice < a.unitPrice ? b : a));
}

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

/* ----------------------------------------------------------------------- */
/* SHARED PRIMITIVES                                                      */
/* ----------------------------------------------------------------------- */

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

function Eyebrow({ children, color = C.pink, bg = C.pinkSoft }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
      style={{ background: bg }}
    >
      <span
        style={{
          color: color,
          fontSize: 12,
          letterSpacing: "0.06em",
          fontWeight: 700,
          fontFamily: FONTS.mono,
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function GradientButton({ children, icon: Icon, className = "", onClick, fullWidth = false }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, boxShadow: "0 12px 24px -8px rgba(244,63,94,0.4)" }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[20px] font-semibold text-sm ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      style={{
        background: C.gradientCTA,
        color: "#FFFFFF",
        fontFamily: FONTS.body,
        border: "none",
        boxShadow: "0 8px 16px -6px rgba(244,63,94,0.3)",
      }}
    >
      {Icon && <Icon size={18} strokeWidth={2.5} />}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

function GhostButton({ children, icon: Icon, onClick, className = "" }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ background: "#F1F5F9", y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[20px] font-semibold text-sm ${className}`}
      style={{
        background: C.bgSurface,
        border: `1px solid ${C.border}`,
        color: C.textPrimary,
        fontFamily: FONTS.body,
        boxShadow: "0 2px 4px rgba(15,23,42,0.02)",
      }}
    >
      {Icon && <Icon size={18} color={C.textSecondary} />}
      {children}
    </motion.button>
  );
}

function FloatingSurface({ children, className = "", style = {}, hover = false, ...rest }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: C.shadowHover } : undefined}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`rounded-[24px] ${className}`}
      style={{
        background: C.bgSurface,
        border: `1px solid ${C.border}`,
        boxShadow: C.shadowPremium,
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------------------------- */
/* 1. PRODUCT INTELLIGENCE HEADER                                         */
/* ----------------------------------------------------------------------- */

function ProductHeader({ qty, setQty }) {
  const savings = PRODUCT.marketAvg - PRODUCT.recommended;
  return (
    <div className="pt-8 pb-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Product Details */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Eyebrow color={C.success} bg={C.successSoft}>
              <div className="flex items-center gap-1.5">
                <Zap size={14} /> AI Recommended Buy
              </div>
            </Eyebrow>
          </div>
          <h1
            style={{
              fontFamily: FONTS.display,
              color: C.textPrimary,
              fontSize: 48,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {PRODUCT.name}
          </h1>
          <p
            style={{
              fontFamily: FONTS.body,
              color: C.textSecondary,
              fontSize: 18,
              marginTop: 16,
              lineHeight: 1.5,
            }}
          >
            {PRODUCT.category}
          </p>

          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-baseline gap-3">
              <span
                style={{
                  fontFamily: FONTS.mono,
                  color: C.textPrimary,
                  fontSize: 36,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {inr(PRODUCT.recommended)}
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  color: C.textMuted,
                  fontSize: 16,
                  textDecoration: "line-through",
                }}
              >
                {inr(PRODUCT.marketAvg)}
              </span>
              <span style={{ fontFamily: FONTS.body, color: C.textMuted, fontSize: 14 }}>
                / unit
              </span>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-3">
             <span style={{ fontFamily: FONTS.body, color: C.textSecondary, fontSize: 14, fontWeight: 500 }}>
                Select Quantity:
             </span>
             <div className="flex items-center bg-white border rounded-[16px] p-1" style={{ borderColor: C.border, boxShadow: "0 2px 8px rgba(15,23,42,0.03)" }}>
                {QUANTITY_TIERS.map(t => (
                  <button 
                    key={t}
                    onClick={() => setQty(t)}
                    className="px-4 py-2 rounded-[12px] text-sm font-semibold transition-all"
                    style={{ 
                      background: qty === t ? C.textPrimary : "transparent",
                      color: qty === t ? "#FFF" : C.textSecondary,
                      fontFamily: FONTS.body
                    }}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Right: AI Intelligence Summary */}
        <div className="relative">
          <div 
            className="absolute -inset-4 rounded-[32px] opacity-20 blur-2xl" 
            style={{ background: C.gradientCTA, zIndex: 0 }} 
          />
          <FloatingSurface className="p-8 relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={18} color={C.pink} />
              <h3 style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.textPrimary }}>
                Market Intelligence
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <IntelligenceStat 
                label="You Save per unit" 
                value={`₹${savings.toLocaleString("en-IN")}`} 
                accent={C.success} 
              />
              <IntelligenceStat 
                label="Market Trend" 
                value={`${Math.abs(PRODUCT.trend)}% Dropped`} 
                accent={C.success} 
                icon={TrendingDown} 
              />
              <IntelligenceStat 
                label="Verified Suppliers" 
                value={PRODUCT.suppliers} 
                accent={C.textPrimary} 
              />
              <IntelligenceStat 
                label="SKU Code" 
                value={PRODUCT.sku} 
                accent={C.textSecondary} 
              />
            </div>
          </FloatingSurface>
        </div>
      </div>
    </div>
  );
}

function IntelligenceStat({ label, value, accent, icon: Icon }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span style={{ fontFamily: FONTS.body, color: C.textMuted, fontSize: 12, fontWeight: 500 }}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} style={{ color: accent }} />}
        <span style={{ fontFamily: FONTS.mono, color: accent, fontSize: 20, fontWeight: 700 }}>
          {value}
        </span>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* 2. AI RECOMMENDATION AREA (HERO WIDGET)                                */
/* ----------------------------------------------------------------------- */

function ConfidenceRing({ score = 96 }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
      <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-md">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#F1F5F9" strokeWidth="8" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="url(#confidenceGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          transform="rotate(-90 50 50)"
        />
        <defs>
          <linearGradient id="confidenceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontFamily: FONTS.mono, color: C.textPrimary, fontSize: 22, fontWeight: 800 }}>
          {score}
        </span>
        <span style={{ fontFamily: FONTS.body, color: C.textMuted, fontSize: 10, fontWeight: 600, marginTop: -2 }}>
          SCORE
        </span>
      </div>
    </div>
  );
}

function RecommendationHero({ qty, onSend }) {
  const best = useMemo(() => bestSupplierForQty(qty), [qty]);
  const total = best.unitPrice * qty;
  const savings = (PRODUCT.marketAvg - best.unitPrice) * qty;

  return (
    <FloatingSurface className="p-10 relative overflow-hidden mb-16">
      {/* Soft gradient background decoration */}
      <div 
        className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none"
        style={{ background: C.gradientCTA }}
      />
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-10 justify-between items-center">
        {/* Left: Supplier Info */}
        <div className="flex-1 w-full">
          <Eyebrow color={C.pink} bg={C.pinkSoft}>#1 AI Recommendation</Eyebrow>
          
          <div className="flex items-center gap-6 mt-2">
            <div 
              className="w-20 h-20 rounded-[20px] flex items-center justify-center shadow-sm"
              style={{ background: "#F8FAFC", border: `1px solid ${C.border}` }}
            >
               <span style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 800, color: C.textPrimary }}>
                 {best.name.charAt(0)}
               </span>
            </div>
            <div>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={best.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ fontFamily: FONTS.display, color: C.textPrimary, fontSize: 32, fontWeight: 800 }}
                >
                  {best.name}
                </motion.h2>
              </AnimatePresence>
              <div className="flex items-center gap-4 mt-2">
                <span style={{ fontFamily: FONTS.body, color: C.textSecondary, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
                  <MapPin size={16} color={C.textMuted} /> {best.location}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, background: C.successSoft, color: C.success, padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 600, fontFamily: FONTS.body }}>
                  <ShieldCheck size={14} /> Verified Supplier
                </span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {["Lowest matched price for this tier", "98% on-time delivery record", "GST & KYC fully verified", "High response rate (< 2 hrs)"].map((r, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                key={i} 
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white shadow-sm" style={{ border: `1px solid ${C.border}`}}>
                  <CheckCircle2 size={14} color={C.success} />
                </div>
                <span style={{ fontFamily: FONTS.body, color: C.textSecondary, fontSize: 14, fontWeight: 500 }}>{r}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Pricing & CTA */}
        <div className="w-full lg:w-[400px] bg-[#F8FAFC] rounded-[24px] p-8 border border-slate-100 flex flex-col items-center text-center shadow-inner">
          <div className="flex justify-between w-full items-start mb-6">
            <ConfidenceRing score={96} />
            <div className="text-right">
              <span style={{ fontFamily: FONTS.body, color: C.textMuted, fontSize: 13, fontWeight: 500, display: "block", marginBottom: 4 }}>
                Total Order Value
              </span>
              <span style={{ fontFamily: FONTS.mono, color: C.textPrimary, fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em" }}>
                {inr(total)}
              </span>
              <div className="mt-2 inline-flex" style={{ background: C.successSoft, padding: "4px 10px", borderRadius: 8 }}>
                <span style={{ fontFamily: FONTS.mono, color: C.success, fontSize: 13, fontWeight: 700 }}>
                  Save {inr(savings)}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
             <GradientButton icon={ShoppingCart} fullWidth>
               Proceed to Checkout
             </GradientButton>
             <div className="grid grid-cols-2 gap-3">
               <GhostButton icon={FileText} onClick={onSend}>Request Quote</GhostButton>
               <GhostButton icon={MessageSquare}>Live Chat</GhostButton>
             </div>
          </div>
        </div>
      </div>
    </FloatingSurface>
  );
}

/* ----------------------------------------------------------------------- */
/* 3. SUPPLIER COMPARISON ROWS (Enterprise SaaS style)                    */
/* ----------------------------------------------------------------------- */

function SupplierRow({ supplier, qty, isBest }) {
  const unitPrice = priceForTier(supplier.priceBase, qty);
  
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 10px 30px rgba(15,23,42,0.04)" }}
      className="flex flex-col lg:flex-row items-center justify-between p-6 bg-white border-b last:border-b-0 transition-all"
      style={{ borderColor: C.border }}
    >
      {/* Identity */}
      <div className="flex items-center gap-5 w-full lg:w-[30%] mb-4 lg:mb-0">
        <div 
          className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
          style={{ background: C.bgBase, border: `1px solid ${C.border}` }}
        >
          <span style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.textPrimary }}>
            {supplier.name.charAt(0)}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: FONTS.display, color: C.textPrimary, fontSize: 16, fontWeight: 700 }}>
              {supplier.name}
            </span>
            {isBest && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider" style={{ background: C.pinkSoft, color: C.pink, fontFamily: FONTS.mono }}>
                BEST MATCH
              </span>
            )}
          </div>
          <span style={{ fontFamily: FONTS.body, color: C.textMuted, fontSize: 13, display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
            <MapPin size={12} /> {supplier.location}
          </span>
        </div>
      </div>

      {/* Trust & Metrics */}
      <div className="flex items-center gap-8 w-full lg:w-[40%] mb-4 lg:mb-0">
        <div className="flex flex-col">
          <span style={{ fontFamily: FONTS.body, color: C.textMuted, fontSize: 12, marginBottom: 2 }}>Rating</span>
          <div className="flex items-center gap-1.5">
            <Star size={14} fill={C.orange} color={C.orange} />
            <span style={{ fontFamily: FONTS.mono, color: C.textPrimary, fontSize: 14, fontWeight: 600 }}>{supplier.rating}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span style={{ fontFamily: FONTS.body, color: C.textMuted, fontSize: 12, marginBottom: 2 }}>Delivery</span>
          <div className="flex items-center gap-1.5">
            <Truck size={14} color={C.textSecondary} />
            <span style={{ fontFamily: FONTS.body, color: C.textPrimary, fontSize: 14, fontWeight: 600 }}>{supplier.delivery}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span style={{ fontFamily: FONTS.body, color: C.textMuted, fontSize: 12, marginBottom: 2 }}>MOQ</span>
          <span style={{ fontFamily: FONTS.mono, color: C.textPrimary, fontSize: 14, fontWeight: 600 }}>{supplier.moq} pcs</span>
        </div>
      </div>

      {/* Price & Action */}
      <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-[30%]">
        <div className="text-right">
          <span style={{ fontFamily: FONTS.body, color: C.textMuted, fontSize: 12, display: "block", marginBottom: 2 }}>Unit Price</span>
          <span style={{ fontFamily: FONTS.mono, color: C.textPrimary, fontSize: 20, fontWeight: 800 }}>
            {inr(unitPrice)}
          </span>
        </div>
        <button 
          className="px-5 py-2.5 rounded-[16px] text-sm font-semibold transition-all hover:scale-105"
          style={{ 
            background: isBest ? C.textPrimary : C.bgBase, 
            color: isBest ? "#FFFFFF" : C.textPrimary,
            border: isBest ? "none" : `1px solid ${C.border}`,
            fontFamily: FONTS.body
          }}
        >
          Select
        </button>
      </div>
    </motion.div>
  );
}

function SupplierComparison({ qty }) {
  const bestSupplier = bestSupplierForQty(qty);
  
  return (
    <div className="mb-16">
      <div className="mb-8">
        <h2 style={{ fontFamily: FONTS.display, color: C.textPrimary, fontSize: 32, fontWeight: 800 }}>
          Supplier Directory
        </h2>
        <p style={{ fontFamily: FONTS.body, color: C.textSecondary, fontSize: 16, marginTop: 8 }}>
          Compare verified wholesalers offering {PRODUCT.sku}.
        </p>
      </div>
      
      <FloatingSurface className="overflow-hidden">
        {SUPPLIERS.map((s) => (
          <SupplierRow key={s.id} supplier={s} qty={qty} isBest={s.id === bestSupplier.id} />
        ))}
      </FloatingSurface>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* 4. PRICE ANALYTICS                                                     */
/* ----------------------------------------------------------------------- */

function AnalyticsWidget({ qty }) {
  const priced = SUPPLIERS.map((s) => ({ ...s, unitPrice: priceForTier(s.priceBase, qty) })).sort(
    (a, b) => a.unitPrice - b.unitPrice
  );
  const max = Math.max(...priced.map((p) => p.unitPrice));
  const min = Math.min(...priced.map((p) => p.unitPrice));
  const avg = Math.round(priced.reduce((a, b) => a + b.unitPrice, 0) / priced.length);

  return (
    <FloatingSurface className="p-8 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <Activity color={C.pink} size={24} />
        <h3 style={{ fontFamily: FONTS.display, color: C.textPrimary, fontSize: 24, fontWeight: 700 }}>
          Price Distribution
        </h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-10 p-6 rounded-[20px]" style={{ background: C.bgBase, border: `1px solid ${C.border}` }}>
        <div>
          <span style={{ fontFamily: FONTS.body, color: C.textMuted, fontSize: 12, fontWeight: 500 }}>Lowest Offer</span>
          <div style={{ fontFamily: FONTS.mono, color: C.success, fontSize: 22, fontWeight: 700, marginTop: 4 }}>{inr(min)}</div>
        </div>
        <div className="border-l pl-4" style={{ borderColor: C.border }}>
          <span style={{ fontFamily: FONTS.body, color: C.textMuted, fontSize: 12, fontWeight: 500 }}>Market Average</span>
          <div style={{ fontFamily: FONTS.mono, color: C.textPrimary, fontSize: 22, fontWeight: 700, marginTop: 4 }}>{inr(avg)}</div>
        </div>
        <div className="border-l pl-4" style={{ borderColor: C.border }}>
          <span style={{ fontFamily: FONTS.body, color: C.textMuted, fontSize: 12, fontWeight: 500 }}>Highest Offer</span>
          <div style={{ fontFamily: FONTS.mono, color: C.textSecondary, fontSize: 22, fontWeight: 700, marginTop: 4 }}>{inr(max)}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-6">
        {priced.map((s, idx) => {
          // Calculate relative percentage for visual bar length
          const baseline = min * 0.98; // Visual offset so lowest isn't zero
          const range = max - baseline;
          const pct = Math.max(10, ((s.unitPrice - baseline) / range) * 100);
          const isBest = s.unitPrice === min;

          return (
            <div key={s.id} className="flex items-center gap-4">
              <div style={{ width: 120, fontFamily: FONTS.body, color: C.textSecondary, fontSize: 13, fontWeight: 500 }} className="truncate">
                {s.name}
              </div>
              <div className="flex-1 h-[10px] rounded-full overflow-hidden bg-[#F1F5F9]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.1 }}
                  className="h-full rounded-full"
                  style={{ background: isBest ? C.gradientCTA : "#CBD5E1" }}
                />
              </div>
              <div style={{ width: 90, textAlign: "right", fontFamily: FONTS.mono, color: C.textPrimary, fontSize: 14, fontWeight: 700 }}>
                {inr(s.unitPrice)}
              </div>
            </div>
          );
        })}
      </div>
    </FloatingSurface>
  );
}

/* ----------------------------------------------------------------------- */
/* 5. TRUST INTELLIGENCE                                                  */
/* ----------------------------------------------------------------------- */

const TRUST_METRICS = [
  { label: "GST Registration", icon: ShieldCheck, value: "Verified Active", color: C.success },
  { label: "KYC Documents", icon: BadgeCheck, value: "Complete", color: C.success },
  { label: "Operating History", icon: Clock, value: "6+ Years", color: C.textPrimary },
  { label: "Platform Orders", icon: Package, value: "1,240 Delivered", color: C.textPrimary },
  { label: "Message Response", icon: MessageSquare, value: "< 2 Hours", color: C.textPrimary },
  { label: "Delivery Success", icon: Truck, value: "98.5% On-Time", color: C.textPrimary },
];

function TrustDashboard() {
  return (
    <FloatingSurface className="p-8 h-full">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck color={C.success} size={24} />
        <h3 style={{ fontFamily: FONTS.display, color: C.textPrimary, fontSize: 24, fontWeight: 700 }}>
          Verification Dashboard
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TRUST_METRICS.map(({ label, icon: Icon, value, color }, i) => (
          <div 
            key={i} 
            className="flex items-start gap-4 p-5 rounded-[20px]" 
            style={{ background: C.bgBase, border: `1px solid ${C.border}` }}
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border" style={{ borderColor: C.border }}>
              <Icon size={18} color={color === C.success ? C.success : C.textSecondary} />
            </div>
            <div>
              <span style={{ fontFamily: FONTS.body, color: C.textMuted, fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 }}>
                {label}
              </span>
              <span style={{ fontFamily: FONTS.body, color: C.textPrimary, fontSize: 15, fontWeight: 700 }}>
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </FloatingSurface>
  );
}

/* ----------------------------------------------------------------------- */
/* 6. BULK NEGOTIATION CRM PANEL                                          */
/* ----------------------------------------------------------------------- */

function NegotiationCRM({ qty, sentSignal }) {
  const [negQty, setNegQty] = useState(qty);
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => setNegQty(qty), [qty]);
  useEffect(() => {
    if (sentSignal) {
      document.getElementById("neg-message")?.focus();
    }
  }, [sentSignal]);

  function handleSend() {
    if (!price || !msg) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setPrice("");
      setMsg("");
    }, 3000);
  }

  const inputClass = "w-full px-5 py-4 rounded-[16px] text-sm outline-none transition-all shadow-sm";
  const inputStyle = {
    background: "#FFFFFF",
    border: `1px solid #E2E8F0`,
    color: C.textPrimary,
    fontFamily: FONTS.body,
  };

  return (
    <FloatingSurface className="p-10 mb-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full" style={{ background: C.gradientCTA }} />
      
      <div className="max-w-3xl">
        <h2 style={{ fontFamily: FONTS.display, color: C.textPrimary, fontSize: 32, fontWeight: 800 }}>
          Request Custom Quote
        </h2>
        <p style={{ fontFamily: FONTS.body, color: C.textSecondary, fontSize: 16, marginTop: 8, marginBottom: 8 }}>
          Negotiate directly with top suppliers. Responses typically arrive within 2 hours.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div>
            <label style={{ fontFamily: FONTS.body, color: C.textPrimary, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
              Target Quantity
            </label>
            <input
              type="number"
              value={negQty}
              onChange={(e) => setNegQty(e.target.value)}
              className={inputClass}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = C.pink}
              onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
            />
          </div>
          <div>
            <label style={{ fontFamily: FONTS.body, color: C.textPrimary, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
              Target Price (per unit)
            </label>
            <input
              type="number"
              placeholder={`Suggest below ${inr(priceForTier(PRODUCT.recommended, negQty))}`}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = C.pink}
              onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label style={{ fontFamily: FONTS.body, color: C.textPrimary, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
            Message to Supplier
          </label>
          <textarea
            id="neg-message"
            rows={4}
            placeholder="Specify payment terms, delivery timelines, or custom requirements..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className={`${inputClass} resize-none`}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = C.pink}
            onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
          />
        </div>

        <div className="mt-8 flex items-center gap-4">
          <GradientButton icon={sent ? CheckCircle2 : ArrowRight} onClick={handleSend}>
            {sent ? "Quote Request Sent Successfully" : "Submit Negotiation Request"}
          </GradientButton>
          <span style={{ fontFamily: FONTS.body, color: C.textMuted, fontSize: 13 }}>
            No commitment required until you accept the offer.
          </span>
        </div>
      </div>
    </FloatingSurface>
  );
}

/* ----------------------------------------------------------------------- */
/* MAIN PAGE COMPONENT                                                    */
/* ----------------------------------------------------------------------- */

export default function ComparePrice() {
  useGoogleFonts();
  const [qty, setQty] = useState(10);
  const [pulse, setPulse] = useState(0);

  return (
    <div
      style={{ background: C.bgBase, minHeight: "100vh", fontFamily: FONTS.body }}
      className="w-full pb-40"
    >
      <div className="mx-auto px-4 sm:px-8" style={{ maxWidth: 1200 }}>
        
        <motion.div {...fadeUp}>
          <ProductHeader qty={qty} setQty={setQty} />
        </motion.div>

        <motion.div {...fadeUp}>
          <RecommendationHero qty={qty} onSend={() => setPulse((p) => p + 1)} />
        </motion.div>

        <motion.div {...fadeUp}>
          <SupplierComparison qty={qty} />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <motion.div {...fadeUp} className="h-full">
            <AnalyticsWidget qty={qty} />
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="h-full">
            <TrustDashboard />
          </motion.div>
        </div>
      </div>

      
    <MainPage/>

        <motion.div {...fadeUp} className="mx-auto px-4 sm:px-8 mt-5" style={{ maxWidth: 1200 }}>
          <NegotiationCRM qty={qty} sentSignal={pulse} />
        </motion.div>
    </div>
    
  );
}