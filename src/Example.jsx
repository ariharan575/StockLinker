import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, ShieldCheck, Package, Phone, MessageSquare,
  X, Star, Truck, TrendingDown, ChevronRight, BarChart3,
  Info, ArrowRight, Building2, Calendar, CheckCircle2, Clock,
  Filter, SlidersHorizontal, ChevronDown, Eye, BadgeCheck,
  AlertCircle, RefreshCw, MessageCircle, FileText, ThumbsUp,
  ArrowDown, Zap, Award, ArrowUpDown,
} from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const PROFILE_IMAGE_URL = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150";

const MOCK_MARKET_DATA = {
  productName: "Samsung Galaxy S25 Ultra 5G",
  category: "Electronics > Smartphones",
  sku: "SAMSUNG-S25U-512GB",
  marketAverage: 69999,
  lowestPrice: 67499,
  highestPrice: 74999,
  suppliersAvailable: 156,
  updatedAt: "2 mins ago"
};

const MOCK_BULK_INSIGHTS = [
  { id: 1, title: "Best Match", requirement: "For 50kg requirement", supplier: "ABC Traders", qty: "50kg", total: 1000, effective: 20, savings: 0, gradient: "from-slate-100 to-slate-50", badge: "Standard" },
  { id: 2, title: "Better Bulk Saving", requirement: "Step up tier", supplier: "XYZ Traders", qty: "75kg", total: 1100, effective: 14.6, savings: 400, gradient: "from-blue-50 to-indigo-50", badge: "Recommended" },
  { id: 3, title: "Maximum Saving", requirement: "Best value tier", supplier: "PQR Traders", qty: "100kg", total: 1300, effective: 13, savings: 700, gradient: "from-rose-50 to-orange-50", badge: "Best Value" }
];

const SUPPLIERS = [
  {
    id: 1, name: "Reliance Digital B2B", initials: "RD", color: "#2563EB",
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
    id: 2, name: "TechMart Wholesale", initials: "TW", color: "#7C3AED",
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
    id: 3, name: "Galaxy Electronics Hub", initials: "GE", color: "#059669",
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
    id: 4, name: "Prime Tech Suppliers", initials: "PT", color: "#DC2626",
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
    id: 5, name: "Sunrise Distributors", initials: "SD", color: "#D97706",
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
  best_overall:  { label: "Best Overall",  color: "#2563EB", bg: "#DBEAFE" },
  lowest_price:  { label: "Lowest Price",  color: "#DC2626", bg: "#FEE2E2" },
  bulk_saving:   { label: "Bulk Saving",   color: "#059669", bg: "#D1FAE5" },
  nearby_seller: { label: "Nearby Seller", color: "#D97706", bg: "#FEF3C7" },
  fast_delivery: { label: "Fast Delivery", color: "#7C3AED", bg: "#EDE9FE" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => "₹" + n.toLocaleString("en-IN");

// ─── Sub-components ───────────────────────────────────────────────────────────

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    primary: "bg-blue-50 text-blue-700 border border-blue-200",
    highlight: "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-sm"
  };
  return (
    <span className={`px-2 py-1 rounded text-[11px] font-semibold tracking-tight uppercase ${variants[variant]}`}>
      {children}
    </span>
  );
};

const HighlightBadge = ({ type }) => {
  const c = HIGHLIGHT_CONFIG[type];
  if (!c) return null;
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ color: c.color, background: c.bg }}
    >
      {c.label}
    </span>
  );
};

const StarRating = ({ rating }) => {
  return (
    <span className="inline-flex items-center gap-1 text-amber-500 font-semibold text-sm">
      <Star size={13} fill="#F59E0B" strokeWidth={0} />
      {rating}
    </span>
  );
};

const StatCard = ({ label, value, sub, accent }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col gap-1 shadow-sm"
    >
      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">{label}</span>
      <span className={`text-2xl font-bold tracking-tight ${accent || "text-slate-800"}`}>{value}</span>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </motion.div>
  );
};

// ─── Supplier Drawer ──────────────────────────────────────────────────────────
function SupplierDrawer({ supplier, onClose }) {
  if (!supplier) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      <motion.div
        key="drawer"
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: supplier.color }}>
              {supplier.initials}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{supplier.name}</p>
              <p className="text-xs text-slate-400">{supplier.businessType}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Price + CTA */}
          <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0]">
            <p className="text-xs text-slate-400 mb-1">Base Price</p>
            <p className="text-3xl font-bold text-slate-800 tracking-tight">{fmt(supplier.price)}</p>
            <p className="text-xs text-slate-400 mb-4">{supplier.priceUnit}</p>
            <div className="flex gap-2">
              <a href={`tel:${supplier.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-[#2563EB] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#1D4ED8] transition-colors">
                <Phone size={14} /> Call Now
              </a>
              <button className="flex-1 flex items-center justify-center gap-2 border border-[#E2E8F0] text-slate-700 rounded-xl py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors">
                <MessageCircle size={14} /> Message
              </button>
            </div>
          </div>

          {/* Bulk Pricing */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Quantity Pricing</h4>
            <div className="space-y-2">
              {supplier.bulkPrices.map((bp, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-sm text-slate-600">{bp.qty}+ units</span>
                  <span className="text-sm font-semibold text-slate-800">{fmt(bp.price)} / pc</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Business Trust</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: BadgeCheck, label: "GST Verified", val: supplier.gst.slice(0, 10) + "…", ok: true },
                { icon: ShieldCheck, label: "KYC Status", val: supplier.kyc ? "Completed" : "Pending", ok: supplier.kyc },
                { icon: Building2, label: "Experience", val: supplier.experience, ok: true },
                { icon: Package, label: "Orders Done", val: supplier.orders.toLocaleString(), ok: true },
                { icon: ThumbsUp, label: "Response Rate", val: supplier.responseRate, ok: true },
                { icon: Truck, label: "On-Time Delivery", val: supplier.deliveryPerf, ok: true },
              ].map(({ icon: Icon, label, val, ok }, i) => (
                <div key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={12} className={ok ? "text-emerald-500" : "text-amber-500"} />
                    <span className="text-[10px] text-slate-400 font-medium">{label}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Delivery */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Terms</h4>
            <div className="space-y-2">
              <div className="flex justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-sm text-slate-500">Payment Terms</span>
                <span className="text-sm font-medium text-slate-700">{supplier.paymentTerms}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-sm text-slate-500">Est. Delivery</span>
                <span className="text-sm font-medium text-slate-700">{supplier.delivery}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-sm text-slate-500">Location</span>
                <span className="text-sm font-medium text-slate-700">{supplier.location}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-[13px] text-slate-500">
      <span className="font-medium text-slate-700 cursor-pointer">Home</span>
      <ChevronRight size={13} className="text-slate-500" />
      <span className="font-medium text-slate-700 cursor-pointer">Search</span>
      <ChevronRight size={13} className="text-slate-500" />
      <span className="font-medium text-slate-800">Compare Price</span>
    </nav>
  );
}


// ─── Supplier Row ─────────────────────────────────────────────────────────────
function SupplierRow({ supplier, onViewDetails, index }) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-0"
    >
      {/* Supplier */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0">
            <img src={PROFILE_IMAGE_URL} alt="" className='rounded-full object-center'/>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{supplier.name}</p>
            <p className="text-xs text-slate-400">{supplier.businessType}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {supplier.highlights.map(h => <HighlightBadge key={h} type={h} />)}
            </div>
          </div>
        </div>
      </td>

      {/* Location */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1 text-slate-600 text-sm">
          <MapPin size={11} className="text-slate-400 shrink-0" />
          <span className="truncate max-w-[120px]">{supplier.location}</span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5 pl-3.5">{supplier.distance}</p>
      </td>

      {/* Stock */}
      <td className="px-4 py-4">
        <p className="text-sm font-medium text-slate-700">{supplier.stock.toLocaleString()} {supplier.unit}</p>
        <p className="text-xs text-slate-400">available</p>
      </td>

      {/* MOQ */}
      <td className="px-4 py-4">
        <p className="text-sm font-medium text-slate-700">{supplier.minOrder} {supplier.unit}</p>
        <p className="text-xs text-slate-400">min order</p>
      </td>

      {/* Price */}
      <td className="px-4 py-4">
        <p className="text-base font-bold text-slate-800">{fmt(supplier.price)}</p>
        <p className="text-xs text-slate-400">{supplier.priceUnit}</p>
      </td>

      {/* Bulk Price */}
      <td className="px-4 py-4">
        <div className="space-y-1">
          {supplier.bulkPrices.slice(0, 2).map((bp, i) => (
            <div key={i} className="text-xs">
              <span className="text-slate-400">{bp.qty}+</span>
              <span className="text-slate-700 font-medium ml-1">{fmt(bp.price)}</span>
            </div>
          ))}
        </div>
      </td>

      {/* Rating */}
      <td className="px-4 py-4">
        <StarRating rating={supplier.rating} />
        <p className="text-xs text-slate-400 mt-0.5">{supplier.reviews.toLocaleString()} reviews</p>
      </td>

      {/* Delivery */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1 text-slate-600 text-sm">
          <Truck size={11} className="text-slate-400" />
          {supplier.delivery}
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => onViewDetails(supplier)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] border border-[#2563EB]/30 bg-[#EFF6FF] hover:bg-[#2563EB] hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <Eye size={11} /> View Details
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            href={`tel:${supplier.phone}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 border border-[#E2E8F0] hover:bg-slate-800 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <Phone size={11} /> Call
          </motion.a>
        </div>
      </td>
    </motion.tr>
  );
}

// ─── Mobile Supplier Card ─────────────────────────────────────────────────────
function SupplierCard({ supplier, onViewDetails, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs" style={{ background: supplier.color }}>
            {supplier.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{supplier.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={10} className="text-slate-400" />
              <span className="text-xs text-slate-400">{supplier.location} · {supplier.distance}</span>
            </div>
          </div>
        </div>
        {supplier.verified && <BadgeCheck size={16} className="text-emerald-500 shrink-0" />}
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {supplier.highlights.map(h => <HighlightBadge key={h} type={h} />)}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-[#F8FAFC] rounded-xl">
          <p className="text-xs text-slate-400">Price</p>
          <p className="text-sm font-bold text-slate-800">{fmt(supplier.price)}</p>
        </div>
        <div className="text-center p-2 bg-[#F8FAFC] rounded-xl">
          <p className="text-xs text-slate-400">MOQ</p>
          <p className="text-sm font-bold text-slate-800">{supplier.minOrder}</p>
        </div>
        <div className="text-center p-2 bg-[#F8FAFC] rounded-xl">
          <p className="text-xs text-slate-400">Rating</p>
          <p className="text-sm font-bold text-amber-500">{supplier.rating}★</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onViewDetails(supplier)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#2563EB]/20 rounded-xl py-2.5 hover:bg-[#2563EB] hover:text-white transition-colors">
          <Eye size={12} /> View Details
        </button>
        <a href={`tel:${supplier.phone}`} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-[#E2E8F0] rounded-xl py-2.5 hover:bg-slate-800 hover:text-white transition-colors">
          <Phone size={12} /> Call Now
        </a>
      </div>
    </motion.div>
  );
}

// ─── Product Header ──────────────────────────────────────────────────────────
const ProductHeader = () => (
  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="primary">Live Pricing</Badge>
          <span className="text-sm text-slate-500">{MOCK_MARKET_DATA.category}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-1">
          {MOCK_MARKET_DATA.productName}
        </h1>
        <p className="text-sm text-slate-500">SKU: {MOCK_MARKET_DATA.sku}</p>
      </div>
      <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
        <Clock className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-500">Updated {MOCK_MARKET_DATA.updatedAt}</span>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-tight">Market Average</p>
        <p className="text-xl font-bold text-slate-900">{fmt(MOCK_MARKET_DATA.marketAverage)}</p>
      </div>
      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
        <p className="text-xs font-medium text-emerald-600 uppercase tracking-tight">Lowest Price</p>
        <p className="text-xl font-bold text-emerald-700">{fmt(MOCK_MARKET_DATA.lowestPrice)}</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <p className="text-xs font-medium text-blue-600 uppercase tracking-tight">Active Suppliers</p>
        <p className="text-xl font-bold text-blue-700">{MOCK_MARKET_DATA.suppliersAvailable}</p>
      </div>
    </div>
  </motion.div>
);

const FilterToolbars = () => (
  <div className="flex flex-wrap items-center gap-3 mb-6">
    <div className="flex-1 min-w-[200px] relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder="Search suppliers..."
        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
      />
    </div>
    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
      <Filter className="w-4 h-4" />
      Filter
    </button>
    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
      <SlidersHorizontal className="w-4 h-4" />
      Sort
    </button>
  </div>
);

// ─── Bulk Insight ────────────────────────────────────────────────────────────
const BulkInsight = () => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-slate-900">Bulk Purchase Insights</h2>
      <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {MOCK_BULK_INSIGHTS.map((insight) => (
        <motion.div
          key={insight.id}
          whileHover={{ y: -2, scale: 1.01 }}
          className={`bg-gradient-to-br ${insight.gradient} p-5 rounded-xl border border-slate-200/60 cursor-pointer transition-all`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
              <p className="text-xs text-slate-500">{insight.requirement}</p>
            </div>
            <Badge variant={insight.id === 3 ? "highlight" : insight.id === 2 ? "primary" : "default"}>
              {insight.badge}
            </Badge>
          </div>
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-2xl font-semibold tracking-tight text-slate-900">{fmt(insight.total)}</p>
              <p className="text-sm font-medium text-slate-500">for {insight.qty}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold tracking-tight text-blue-600">₹{insight.effective}/kg</p>
              <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-tight">Effective Price</p>
            </div>
          </div>
          {insight.savings > 0 && (
            <div className="mb-3 p-2 bg-emerald-100/50 rounded-lg">
              <p className="text-xs text-emerald-700 font-medium">Save {fmt(insight.savings)} vs Best Match</p>
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
            <div className="flex items-center gap-2">
              <img src={PROFILE_IMAGE_URL} alt="" className="w-6 h-6 rounded-full" />
              <span className="text-sm font-semibold text-slate-700">{insight.supplier}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ComparePrice() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("best_value");
  const [filterVerified, setFilterVerified] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const filtered = SUPPLIERS
    .filter(s => {
      if (filterVerified && !s.verified) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) &&
          !s.location.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "lowest_price") return a.price - b.price;
      if (sortBy === "nearest") return parseFloat(a.distance) - parseFloat(b.distance);
      if (sortBy === "fast_delivery") return parseInt(a.delivery) - parseInt(b.delivery);
      // best value: highlight score + rating
      const score = (s) => (s.highlights.length * 2) + s.rating;
      return score(b) - score(a);
    });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* Drawer */}
      <SupplierDrawer supplier={activeDrawer} onClose={() => setActiveDrawer(null)} />
        

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                <Breadcrumb/>

        
        <ProductHeader />

        <BulkInsight />

      

        {/* ── Supplier Table (Desktop) ──────────────────────────────── */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Supplier Comparison</h2>
            <SlidersHorizontal size={15} className="text-slate-400" />
          </div>
            <FilterToolbars/>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    {["Supplier", "Location", "Stock", "MOQ", "Price", "Bulk Pricing", "Rating", "Delivery", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <SupplierRow key={s.id} supplier={s} index={i} onViewDetails={setActiveDrawer} />
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={10} className="text-center py-12 text-slate-400 text-sm">No suppliers match your filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Mobile Cards ────────────────────────────────────────────── */}
        <div className="md:hidden space-y-3">
          <h2 className="text-lg font-semibold text-slate-800">Supplier Comparison</h2>
          {filtered.map((s, i) => (
            <SupplierCard key={s.id} supplier={s} index={i} onViewDetails={setActiveDrawer} />
          ))}
          {filtered.length === 0 && (
            <p className="text-center py-8 text-slate-400 text-sm">No suppliers match your filters.</p>
          )}
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}