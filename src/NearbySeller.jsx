import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, ShieldCheck, Package, Phone,
  X, Star, Truck, ChevronRight,
  ArrowRight, Building2, CheckCircle2, Clock,
  Filter, SlidersHorizontal, Eye, BadgeCheck,
  MessageCircle, ThumbsUp, Zap
} from 'lucide-react';

// ─── Constants & Brand System ───────────────────────────────────────────────
export const CTA_GRAD = 'linear-gradient(to right, #EC4899, #F43F5E, #F97316)';

const COLORS = {
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  softSurface: '#FDFDFE',
  border: 'rgba(15,23,42,0.08)',
  primary: '#0F172A',
  secondary: '#475569',
  muted: '#94A3B8'
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const PROFILE_IMAGE_URL = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150";

const MOCK_MARKET_DATA = {
  productName: "Samsung Galaxy S25 Ultra 5G",
  category: "Electronics / Smartphones",
  sku: "SAMSUNG-S25U-512GB",
  marketAverage: 69999,
  lowestPrice: 67499,
  highestPrice: 74999,
  suppliersAvailable: 156,
  updatedAt: "2 mins ago"
};

const MOCK_BULK_INSIGHTS = [
  { id: 1, title: "Best Match", requirement: "For 50kg requirement", supplier: "ABC Traders", qty: "50kg", total: 1000, effective: 20, savings: 0, badge: "STANDARD" },
  { id: 2, title: "Better Bulk Saving", requirement: "Step up tier", supplier: "XYZ Traders", qty: "75kg", total: 1100, effective: 14.6, savings: 400, badge: "RECOMMENDED" },
  { id: 3, title: "Maximum Saving", requirement: "Best value tier", supplier: "PQR Traders", qty: "100kg", total: 1300, effective: 13, savings: 700, badge: "MAX SAVING" }
];

const SUPPLIERS = [
  {
    id: 1, name: "Reliance Digital B2B", initials: "RD", color: "#0F172A",
    location: "Andheri, Mumbai", distance: "1.2 km",
    verified: true, gst: "27AABCR1234A1ZV", kyc: true,
    stock: 850, minOrder: 10, unit: "pcs",
    price: 68200, priceUnit: "per pc",
    bulkPrices: [{ qty: 10, price: 68200 }, { qty: 50, price: 66800 }, { qty: 100, price: 65500 }],
    rating: 4.9, reviews: 1240, delivery: "1-2 days",
    experience: "12 years", orders: 18400, responseRate: "98%",
    deliveryPerf: "99.1%", paymentTerms: "Net 30 / Advance",
    businessType: "Authorized Distributor",
    highlights: ["best_overall", "fast_delivery"],
    phone: "+91 98200 12345",
  },
  {
    id: 2, name: "TechMart Wholesale", initials: "TW", color: "#0F172A",
    location: "Kurla, Mumbai", distance: "3.8 km",
    verified: true, gst: "27AABCT5678B2ZW", kyc: true,
    stock: 320, minOrder: 5, unit: "pcs",
    price: 67500, priceUnit: "per pc",
    bulkPrices: [{ qty: 5, price: 67500 }, { qty: 25, price: 66200 }, { qty: 75, price: 64800 }],
    rating: 4.7, reviews: 892, delivery: "2-3 days",
    experience: "8 years", orders: 9600, responseRate: "95%",
    deliveryPerf: "96.4%", paymentTerms: "Advance / COD",
    businessType: "Regional Distributor",
    highlights: ["lowest_price"],
    phone: "+91 98765 43210",
  },
  {
    id: 3, name: "Galaxy Electronics Hub", initials: "GE", color: "#0F172A",
    location: "Dharavi, Mumbai", distance: "5.1 km",
    verified: true, gst: "27AABCG9012C3ZX", kyc: false,
    stock: 1200, minOrder: 50, unit: "pcs",
    price: 67800, priceUnit: "per pc",
    bulkPrices: [{ qty: 50, price: 67800 }, { qty: 200, price: 65900 }, { qty: 500, price: 63500 }],
    rating: 4.6, reviews: 2110, delivery: "3-5 days",
    experience: "15 years", orders: 31000, responseRate: "91%",
    deliveryPerf: "94.0%", paymentTerms: "Net 15 / LC",
    businessType: "National Wholesale",
    highlights: ["bulk_saving"],
    phone: "+91 99001 67890",
  },
  {
    id: 4, name: "Prime Tech Suppliers", initials: "PT", color: "#0F172A",
    location: "Vashi, Navi Mumbai", distance: "12.4 km",
    verified: false, gst: "27AABCP3456D4ZY", kyc: true,
    stock: 200, minOrder: 20, unit: "pcs",
    price: 69200, priceUnit: "per pc",
    bulkPrices: [{ qty: 20, price: 69200 }, { qty: 80, price: 67900 }],
    rating: 4.3, reviews: 450, delivery: "4-6 days",
    experience: "5 years", orders: 3800, responseRate: "88%",
    deliveryPerf: "91.2%", paymentTerms: "Advance only",
    businessType: "Reseller",
    highlights: [],
    phone: "+91 91234 56789",
  },
  {
    id: 5, name: "Sunrise Distributors", initials: "SD", color: "#0F172A",
    location: "Thane West", distance: "8.9 km",
    verified: true, gst: "27AABCS7890E5ZZ", kyc: true,
    stock: 640, minOrder: 15, unit: "pcs",
    price: 68800, priceUnit: "per pc",
    bulkPrices: [{ qty: 15, price: 68800 }, { qty: 60, price: 67200 }, { qty: 150, price: 65800 }],
    rating: 4.5, reviews: 678, delivery: "2-3 days",
    experience: "9 years", orders: 7200, responseRate: "94%",
    deliveryPerf: "95.6%", paymentTerms: "Net 7 / Advance",
    businessType: "Regional Distributor",
    highlights: ["nearby_seller"],
    phone: "+91 98123 45678",
  },
];

const HIGHLIGHT_CONFIG = {
  best_overall:  { label: "Best Overall",  icon: Zap },
  lowest_price:  { label: "Lowest Price",  icon: Zap },
  bulk_saving:   { label: "Bulk Saving",   icon: Zap },
  nearby_seller: { label: "Nearby Seller", icon: MapPin },
  fast_delivery: { label: "Fast Delivery", icon: Truck },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => "₹" + n.toLocaleString("en-IN");

// ─── Typography Setup (Simulating premium web fonts) ──────────────────────────
const typographyStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@400;600;700&display=swap');
  .font-sora { font-family: 'Sora', sans-serif; }
  .font-inter { font-family: 'Inter', sans-serif; }
`;

// ─── Reusable Components ──────────────────────────────────────────────────────

const FloatingSurface = ({ children, className = "", delay = 0, noHover = false, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
    whileHover={noHover ? {} : { translateY: -3, boxShadow: '0 20px 50px rgba(15,23,42,0.08)' }}
    className={`bg-white shadow-sm ${className}`}
    style={{
      border: `1px solid ${COLORS.border}`,
      ...style
    }}
  >
    {children}
  </motion.div>
);

const GradientButton = ({ children, onClick, className = "", style = {}, href }) => {
  const Wrapper = href ? motion.a : motion.button;
  return (
    <Wrapper
      href={href}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative inline-flex items-center justify-center font-inter font-semibold text-white ${className}`}
      style={{
        background: CTA_GRAD,
        borderRadius: '16px',
        boxShadow: '0 8px 24px -6px rgba(244,63,94,0.4)',
        ...style
      }}
    >
      {children}
    </Wrapper>
  );
};

const SecondaryButton = ({ children, onClick, className = "", href }) => {
  const Wrapper = href ? motion.a : motion.button;
  return (
    <Wrapper
      href={href}
      onClick={onClick}
      whileHover={{ scale: 1.03, backgroundColor: COLORS.softSurface }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center font-inter font-medium text-[#0F172A] bg-white transition-colors ${className}`}
      style={{ border: `1px solid ${COLORS.border}`, borderRadius: '16px' }}
    >
      {children}
    </Wrapper>
  );
};

const AIRecommendationBadge = ({ label, isPremium }) => (
  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sora font-semibold tracking-wide uppercase"
    style={{
      background: isPremium ? CTA_GRAD : COLORS.softSurface,
      color: isPremium ? '#FFF' : COLORS.primary,
      border: isPremium ? 'none' : `1px solid ${COLORS.border}`
    }}>
    {isPremium && <Zap size={10} className="fill-white" />}
    {label}
  </div>
);

// ─── Header Redesign ─────────────────────────────────────────────────────────

const ProductIntelligenceHeader = () => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    className="mb-12"
  >
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[13px] font-inter font-medium text-[#475569] cursor-pointer hover:text-[#0F172A] transition-colors">Workspace</span>
      <ChevronRight size={14} color={COLORS.muted} />
      <span className="text-[13px] font-inter font-medium text-[#475569] cursor-pointer hover:text-[#0F172A] transition-colors">Procurement</span>
      <ChevronRight size={14} color={COLORS.muted} />
      <span className="text-[13px] font-inter font-medium text-[#0F172A]">{MOCK_MARKET_DATA.category.split('/')[1].trim()}</span>
    </div>

    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-50 text-emerald-600 text-xs font-semibold tracking-wide font-inter">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LIVE PRICING
          </div>
          <span className="text-[13px] font-inter text-[#475569] flex items-center gap-1.5">
            <Clock size={14} /> Updated {MOCK_MARKET_DATA.updatedAt}
          </span>
        </div>
        
        <h1 className="text-[36px] md:text-[42px] leading-tight font-sora font-bold text-[#0F172A] mb-2 tracking-tight">
          {MOCK_MARKET_DATA.productName}
        </h1>
        <p className="text-[15px] font-inter text-[#475569]">
          SKU: <span className="font-mono text-[#0F172A] bg-white px-2 py-0.5 rounded-md border border-[#0F172A]/[0.08]">{MOCK_MARKET_DATA.sku}</span>
        </p>
      </div>

      {/* Pricing Intelligence Widget */}
      <div className="flex gap-4 p-2 bg-white rounded-[24px] shadow-sm" style={{ border: `1px solid ${COLORS.border}` }}>
        <div className="px-5 py-3 rounded-[16px] bg-[#F8FAFC]">
          <p className="text-[11px] font-inter font-semibold text-[#475569] uppercase tracking-wider mb-1">Market Avg</p>
          <p className="text-[20px] font-sora font-semibold text-[#0F172A]">{fmt(MOCK_MARKET_DATA.marketAverage)}</p>
        </div>
        <div className="px-5 py-3 rounded-[16px] bg-[#F8FAFC]">
          <p className="text-[11px] font-inter font-semibold text-[#475569] uppercase tracking-wider mb-1">Lowest Price</p>
          <p className="text-[20px] font-sora font-semibold text-emerald-600">{fmt(MOCK_MARKET_DATA.lowestPrice)}</p>
        </div>
        <div className="px-5 py-3 rounded-[16px] bg-[#F8FAFC]">
          <p className="text-[11px] font-inter font-semibold text-[#475569] uppercase tracking-wider mb-1">Suppliers</p>
          <p className="text-[20px] font-sora font-semibold text-[#0F172A]">{MOCK_MARKET_DATA.suppliersAvailable}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── AI Bulk Purchase Insights ───────────────────────────────────────────────

const InsightCard = ({ insight, index }) => {
  const isPremium = insight.badge === "MAX SAVING" || insight.badge === "RECOMMENDED";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ translateY: -4, boxShadow: '0 20px 40px rgba(15,23,42,0.06)' }}
      className="relative p-6 rounded-[24px] bg-white overflow-hidden group cursor-pointer flex flex-col justify-between"
      style={{ border: `1px solid ${COLORS.border}` }}
    >
      {isPremium && (
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-rose-400/10 via-orange-400/5 to-transparent blur-2xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      )}
      
      <div>
        <div className="flex items-start justify-between mb-6 relative z-10">
          <AIRecommendationBadge label={insight.badge} isPremium={isPremium} />
          <span className="text-[12px] font-inter text-[#475569] font-medium px-2 py-1 bg-[#F8FAFC] rounded-lg">
            {insight.qty}
          </span>
        </div>

        <div className="mb-8 relative z-10">
          <p className="text-[14px] font-inter text-[#475569] mb-1">{insight.title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-sora font-bold text-[#0F172A] tracking-tight">{fmt(insight.total)}</span>
            <span className="text-[14px] font-inter text-[#475569]">total</span>
          </div>
          <p className="text-[14px] font-inter font-medium mt-2" style={{ background: isPremium ? CTA_GRAD : '#0F172A', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ₹{insight.effective}/unit effective
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-5 border-t relative z-10" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-3">
          <img src={PROFILE_IMAGE_URL} alt="" className="w-8 h-8 rounded-full object-cover" />
          <div>
            <p className="text-[13px] font-inter font-semibold text-[#0F172A]">{insight.supplier}</p>
            {insight.savings > 0 && (
              <p className="text-[11px] font-inter font-semibold text-emerald-600">Saves {fmt(insight.savings)}</p>
            )}
          </div>
        </div>
        <motion.div
          className="w-8 h-8 rounded-full bg-[#F8FAFC] flex items-center justify-center group-hover:bg-[#0F172A] transition-colors"
        >
          <ArrowRight size={14} className="text-[#0F172A] group-hover:text-white transition-colors" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// ─── Filter Toolbar Redesign ─────────────────────────────────────────────────

const FilterToolbar = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
    className="flex flex-col md:flex-row items-center gap-4 mb-8"
  >
    <div className="relative w-full md:w-[380px]">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
      <input
        type="text"
        placeholder="Search intelligence directory..."
        className="w-full pl-12 pr-4 py-3.5 bg-white font-inter text-[15px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-shadow"
        style={{ border: `1px solid ${COLORS.border}`, borderRadius: '100px', boxShadow: '0 2px 10px rgba(15,23,42,0.02)' }}
      />
    </div>
    
    <div className="flex items-center gap-3 w-full md:w-auto">
      <SecondaryButton className="px-5 py-3.5 rounded-full text-[14px] flex gap-2 w-full md:w-auto">
        <Filter size={16} /> Filters
      </SecondaryButton>
      <SecondaryButton className="px-5 py-3.5 rounded-full text-[14px] flex gap-2 w-full md:w-auto">
        <SlidersHorizontal size={16} /> Sort: Best Match
      </SecondaryButton>
    </div>
  </motion.div>
);

// ─── Supplier Row (Directory) ────────────────────────────────────────────────

const SupplierDirectoryRow = ({ supplier, onViewDetails, index }) => {
  return (
    <FloatingSurface 
      delay={0.3 + (index * 0.08)}
      className="p-6 rounded-[24px] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 relative group"
    >
      {/* Left: Profile */}
      <div className="flex items-start gap-4 xl:w-[30%]">
        <div className="relative">
          <img src={PROFILE_IMAGE_URL} alt="" className="w-14 h-14 rounded-2xl object-cover" />
          {supplier.verified && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
              <BadgeCheck size={16} className="text-emerald-500 fill-emerald-50" />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-[18px] font-sora font-semibold text-[#0F172A] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#EC4899] group-hover:to-[#F97316] transition-all duration-300">
            {supplier.name}
          </h3>
          <p className="text-[14px] font-inter text-[#475569] mb-2">{supplier.businessType}</p>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 text-[12px] font-inter text-[#475569] bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#0F172A]/[0.04]">
              <MapPin size={12} /> {supplier.location}
            </div>
            {supplier.highlights.map(h => {
              const config = HIGHLIGHT_CONFIG[h];
              if (!config) return null;
              const Icon = config.icon;
              return (
                <div key={h} className="flex items-center gap-1 text-[12px] font-inter text-[#0F172A] font-medium bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#0F172A]/[0.04]">
                  <Icon size={12} /> {config.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Center: Business Intel Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full xl:w-[45%] bg-[#FDFDFE] p-4 rounded-[16px] border border-[#0F172A]/[0.04]">
        <div>
          <p className="text-[11px] font-inter font-medium text-[#94A3B8] uppercase tracking-wider mb-1">Trust Score</p>
          <div className="flex items-center gap-1.5 text-[15px] font-sora font-semibold text-[#0F172A]">
            <Star size={14} className="fill-[#F59E0B] text-[#F59E0B]" /> {supplier.rating}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-inter font-medium text-[#94A3B8] uppercase tracking-wider mb-1">Delivery</p>
          <p className="text-[15px] font-sora font-semibold text-[#0F172A]">{supplier.delivery}</p>
        </div>
        <div>
          <p className="text-[11px] font-inter font-medium text-[#94A3B8] uppercase tracking-wider mb-1">MOQ</p>
          <p className="text-[15px] font-sora font-semibold text-[#0F172A]">{supplier.minOrder} {supplier.unit}</p>
        </div>
        <div>
          <p className="text-[11px] font-inter font-medium text-[#94A3B8] uppercase tracking-wider mb-1">In Stock</p>
          <p className="text-[15px] font-sora font-semibold text-emerald-600">{supplier.stock.toLocaleString()}</p>
        </div>
      </div>

      {/* Right: Pricing & Action */}
      <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between w-full xl:w-[20%] gap-4">
        <div className="text-left xl:text-right">
          <p className="text-[12px] font-inter font-medium text-[#94A3B8] uppercase tracking-wider mb-1">Unit Price</p>
          <p className="text-[24px] font-sora font-bold text-[#0F172A] leading-none">{fmt(supplier.price)}</p>
        </div>
        <div className="flex gap-2 w-full xl:w-auto">
          <GradientButton onClick={() => onViewDetails(supplier)} className="px-5 py-3 w-full xl:w-auto text-[14px]">
            Review Deal
          </GradientButton>
        </div>
      </div>
    </FloatingSurface>
  );
};

// ─── Modern SaaS Drawer ──────────────────────────────────────────────────────

function PremiumDrawer({ supplier, onClose }) {
  if (!supplier) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-[#0F172A]/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        key="drawer"
        initial={{ x: "100%", opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-[500px] bg-white z-50 shadow-[-20px_0_50px_rgba(15,23,42,0.1)] overflow-y-auto rounded-l-[32px] border-l"
        style={{ borderColor: COLORS.border }}
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 flex items-center justify-between z-10 border-b" style={{ borderColor: COLORS.border }}>
          <h2 className="text-[20px] font-sora font-semibold text-[#0F172A]">Supplier Intelligence</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F8FAFC] transition-colors border" style={{ borderColor: COLORS.border }}>
            <X size={18} className="text-[#475569]" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Profile Header */}
          <div className="flex items-start gap-5">
            <img src={PROFILE_IMAGE_URL} alt="" className="w-16 h-16 rounded-[20px] object-cover border" style={{ borderColor: COLORS.border }} />
            <div>
              <h3 className="text-[22px] font-sora font-bold text-[#0F172A] mb-1">{supplier.name}</h3>
              <p className="text-[15px] font-inter text-[#475569] flex items-center gap-1.5">
                <Building2 size={15} /> {supplier.businessType}
              </p>
            </div>
          </div>

          {/* Core Pricing Widget */}
          <div className="bg-[#FDFDFE] rounded-[24px] p-6 border relative overflow-hidden" style={{ borderColor: COLORS.border }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#EC4899]/10 to-[#F97316]/10 blur-xl rounded-full -translate-y-1/2 translate-x-1/2" />
            <p className="text-[12px] font-inter font-semibold text-[#94A3B8] uppercase tracking-widest mb-2 relative z-10">Base Quoted Price</p>
            <p className="text-[40px] font-sora font-bold text-[#0F172A] leading-none mb-1 relative z-10">{fmt(supplier.price)}</p>
            <p className="text-[14px] font-inter text-[#475569] mb-6 relative z-10">{supplier.priceUnit}</p>
            
            <div className="flex gap-3 relative z-10">
              <GradientButton href={`tel:${supplier.phone}`} className="flex-1 py-4 text-[15px]">
                <Phone size={16} className="mr-2" /> Connect
              </GradientButton>
              <SecondaryButton className="flex-1 py-4 text-[15px]">
                <MessageCircle size={16} className="mr-2" /> Message
              </SecondaryButton>
            </div>
          </div>

          {/* Volume Tiers */}
          <div>
            <h4 className="text-[13px] font-inter font-semibold text-[#0F172A] uppercase tracking-wider mb-4">Volume Intelligence</h4>
            <div className="space-y-3">
              {supplier.bulkPrices.map((bp, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-[16px] bg-[#F8FAFC] border" style={{ borderColor: COLORS.border }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border shadow-sm" style={{ borderColor: COLORS.border }}>
                      <Package size={14} className="text-[#0F172A]" />
                    </div>
                    <span className="text-[15px] font-inter font-medium text-[#475569]">{bp.qty}+ units</span>
                  </div>
                  <span className="text-[16px] font-sora font-semibold text-[#0F172A]">{fmt(bp.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Metrics */}
          <div>
            <h4 className="text-[13px] font-inter font-semibold text-[#0F172A] uppercase tracking-wider mb-4">Verification Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BadgeCheck, label: "GST Status", val: supplier.gst.slice(0, 10) + "…", ok: true },
                { icon: ShieldCheck, label: "KYC Status", val: supplier.kyc ? "Verified" : "Pending", ok: supplier.kyc },
                { icon: ThumbsUp, label: "Response", val: supplier.responseRate, ok: true },
                { icon: CheckCircle2, label: "Fulfillment", val: supplier.deliveryPerf, ok: true },
              ].map(({ icon: Icon, label, val, ok }, i) => (
                <div key={i} className="bg-white border rounded-[16px] p-4 shadow-sm" style={{ borderColor: COLORS.border }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} className={ok ? "text-emerald-500" : "text-amber-500"} />
                    <span className="text-[12px] font-inter text-[#475569] font-medium">{label}</span>
                  </div>
                  <p className="text-[15px] font-sora font-semibold text-[#0F172A]">{val}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pb-8"></div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Application ─────────────────────────────────────────────────────────

export default function ComparePrice() {
  const [activeDrawer, setActiveDrawer] = useState(null);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (activeDrawer) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeDrawer]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: typographyStyles }} />
      <div className="min-h-screen font-inter" style={{ backgroundColor: COLORS.bg }}>
        <PremiumDrawer supplier={activeDrawer} onClose={() => setActiveDrawer(null)} />
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
          
          <ProductIntelligenceHeader />

          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-sora font-semibold text-[#0F172A]">AI Purchase Insights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_BULK_INSIGHTS.map((insight, index) => (
                <InsightCard key={insight.id} insight={insight} index={index} />
              ))}
            </div>
          </div>

          <div className="mb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-[24px] font-sora font-semibold text-[#0F172A]">Supplier Directory</h2>
                <p className="text-[15px] font-inter text-[#475569] mt-1">Compare evaluated suppliers for your procurement needs.</p>
              </div>
            </div>
            
            <FilterToolbar />

            <div className="space-y-4">
              {SUPPLIERS.map((s, i) => (
                <SupplierDirectoryRow key={s.id} supplier={s} index={i} onViewDetails={setActiveDrawer} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}