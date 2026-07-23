import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronDown, MapPin, X,
  ShieldCheck, ExternalLink, MessageCircle, ShoppingBag, 
  Star, Package, Zap, ArrowRight, CheckCircle2, ChevronRight, 
  Phone, TrendingDown, Boxes, Truck, BarChart3, Info, Wallet, 
  ChevronUp, Loader2, SearchCode
} from 'lucide-react';
import { axiosInstance } from '../Authentication/api/axiosInstance';

/* ─────────────────────────────────────────────
   API DEFINITION (Combined to prevent import errors)
───────────────────────────────────────────── */
export const compareApi = {
  // Added the master product search API here for the modal
  searchMasterProducts: (query) => 
    axiosInstance.get('/v1/products/master/search', { params: { q: query } }),

  getCompareData: (masterProductId, qty) => 
    axiosInstance.get(`/v1/compare/${masterProductId}`, { params: { qty } }),
    
  submitEnquiry: (data) => 
    axiosInstance.post('/v1/compare/enquiry', data)
};

/* ─────────────────────────────────────────────
   PREMIUM THEME SYSTEM & CSS
───────────────────────────────────────────── */
const C = {
  gradientCTA: "linear-gradient(to right, #EC4899, #F43F5E, #F97316)",
};

const inr = (n) => n != null ? `₹${Number(n).toLocaleString("en-IN")}` : '₹0';

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

  .table-header-shadow {
    box-shadow: 0 4px 20px -10px rgba(15,23,42,0.1);
  }
`;

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

const GradientButton = ({ children, onClick, className = "", icon: Icon, disabled }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    className={`relative inline-flex items-center justify-center font-inter font-semibold text-white transition-all overflow-hidden group ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    style={{
      background: disabled ? '#94A3B8' : C.gradientCTA,
      borderRadius: '5px',
      boxShadow: disabled ? 'none' : '0 8px 24px -6px rgba(244,63,94,0.4)',
    }}
  >
    {!disabled && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />}
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

function ScoreRing({ score, size = 48 }) {
  const r = size * 0.38;
  const c = 2 * Math.PI * r;
  const offset = c - ((score || 80) / 100) * c;
  
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
          stroke={(score || 80) >= 90 ? "url(#scoreGradGreen)" : "url(#scoreGrad)"} 
          strokeWidth={size * 0.08}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-sora font-semibold text-[13px] text-[#0F172A]">{score || 80}</span>
    </div>
  );
}

function PremiumBadge({ text }) {
  if (!text) return null;
  const isGradient = text === 'BEST DEAL' || text === 'FAST DELIVERY';
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-sora font-semibold uppercase tracking-[0.10em] shadow-sm"
      style={{
        background: isGradient ? C.gradientCTA : COLORS.softSurface,
        color: isGradient ? '#FFFFFF' : COLORS.primary,
        border: isGradient ? 'none' : `1px solid ${COLORS.border}`
      }}>
      {isGradient && <Zap size={12} className="fill-white" />}
      {text}
    </span>
  );
}

/* ─────────────────────────────────────────────
   MASTER PRODUCT SEARCH MODAL
───────────────────────────────────────────── */
function ProductSearchModal({ isOpen, onClose, onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [draftQty, setDraftQty] = useState(50);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSuggestions([]);
      setSelectedProduct(null);
      setDraftQty(50);
    }
  }, [isOpen]);

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSelectedProduct(null); // Clear selection if they start typing again

    if (val.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await compareApi.searchMasterProducts(val);
      setSuggestions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSuggestion = (sug) => {
    setSelectedProduct(sug);
    setSearchQuery(sug.name);
    setSuggestions([]);
  };

  const handleSubmit = () => {
    if (selectedProduct && draftQty > 0) {
      onSearch(selectedProduct.id, draftQty);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }} 
          className="relative w-full max-w-[500px] bg-white rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white shadow-sm">
                <SearchCode size={20} />
              </div>
              <div>
                <h2 className="text-[18px] font-sora font-bold text-[#0F172A] leading-tight">Procurement Search</h2>
                <p className="text-[12px] font-inter text-slate-500">Find products to compare market prices</p>
              </div>
            </div>
            {onClose && (
              <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-lg transition-colors">
                <X size={18} />
              </button>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* Step 1: Search Master Product */}
            <div>
              <label className="block text-[11px] font-inter font-semibold uppercase tracking-[0.08em] text-slate-500 mb-2">
                1. Select Master Product
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search brand, name, or SKU..."
                  className="w-full h-[52px] pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-[14px] text-[14px] font-inter outline-none focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                />
                {isSearching && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />}
                
                {suggestions.length > 0 && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-200 rounded-[14px] shadow-xl z-50 max-h-[220px] overflow-y-auto py-2 custom-scrollbar">
                    {suggestions.map((sug) => (
                      <div
                        key={sug.id}
                        onClick={() => handleSelectSuggestion(sug)}
                        className="px-4 py-3 text-[13px] font-inter font-medium text-slate-700 hover:bg-slate-50 hover:text-pink-600 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                      >
                        {sug.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Quantity */}
            <div className={`transition-opacity duration-300 ${selectedProduct ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <label className="block text-[11px] font-inter font-semibold uppercase tracking-[0.08em] text-slate-500 mb-2">
                2. Required Quantity
              </label>
              <div className="relative">
                <Package size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  value={draftQty}
                  onChange={(e) => setDraftQty(Number(e.target.value))}
                  min="1"
                  className="w-full h-[52px] pl-11 pr-16 bg-slate-50 border border-slate-200 rounded-[14px] text-[14px] font-inter outline-none focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-medium text-slate-400">Units</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
            <GradientButton 
              onClick={handleSubmit} 
              disabled={!selectedProduct || draftQty < 1}
              className="px-8 py-3 rounded-[12px] text-[14px]"
            >
              Analyze Market Prices <ArrowRight size={16} className="ml-2" />
            </GradientButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   DYNAMIC SECTIONS (Rest of the Page)
───────────────────────────────────────────── */

function ProductHeader({ qty, setQty, metrics, suppliers, onNewSearch }) {
  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const cardVars = { hidden: { opacity: 0, x: -15 }, show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 400, damping: 30 } } };

  const topSellers = suppliers?.slice(0, 3) || [];

  return (
    <motion.section initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="mb-6 w-full mt-4">
      <div className="flex flex-col xl:flex-row bg-[#FFFFFF] rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
        
        {/* ================= LEFT SIDE ================= */}
        <div className="flex-1 p-4 sm:p-5 xl:p-6 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex overflow-x-auto items-center gap-3 text-[12px] font-inter font-normal text-[#94A3B8] pb-1 whitespace-nowrap [&::-webkit-scrollbar]:hidden">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[10px] font-sora font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 uppercase tracking-[0.10em] shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Live Market
              </span>
              <span className="text-slate-300 shrink-0">•</span>
              <span className="flex items-center gap-1.5 shrink-0"><CheckCircle2 size={14} className="text-[#10B981]" /> {metrics?.supplierCount || 0} verified suppliers</span>
            </div>
            
            {/* NEW SEARCH BUTTON ADDED HERE */}
            <button onClick={onNewSearch} className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-slate-100 text-slate-600 text-[12px] font-semibold hover:bg-slate-200 hover:text-slate-900 transition-colors border border-slate-200">
              <Search size={14} /> New Search
            </button>
          </div>

          <div className="mb-5">
            <h1 className="text-[20px] md:text-[23px] font-sora font-bold tracking-[-0.03em] text-[#0F172A] leading-[1.2] mb-3">
              {metrics?.productName || "Loading Product..."}
            </h1>
          </div>

          <motion.div variants={containerVars} initial="hidden" animate="show" className="flex overflow-x-auto md:grid md:grid-cols-2 xl:grid-cols-4 gap-3 mb-5 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
            <motion.div variants={cardVars} className="shrink-0 w-[220px] md:w-auto p-4 rounded-[14px] bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={14} className="text-[#94A3B8]" />
                  <span className="text-[11px] font-inter font-semibold text-[#94A3B8] uppercase tracking-[0.08em]">Supplier Network</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[18px] font-sora font-bold text-[#0F172A] leading-[1.3] tracking-[-0.02em]">{metrics?.supplierCount || 0}</span>
                  <span className="text-[13px] font-inter font-medium text-[#475569]">Suppliers</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={cardVars} className="shrink-0 w-[220px] md:w-auto p-4 rounded-[14px] bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown size={14} className="text-[#94A3B8]" />
                  <span className="text-[11px] font-inter font-semibold text-[#94A3B8] uppercase tracking-[0.08em]">Best Price</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[16px] md:text-[18px] font-sora font-[800] text-[#0F172A] leading-[1.2] tracking-[-0.02em]">{inr(metrics?.bestPrice)}</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={cardVars} className="shrink-0 w-[220px] md:w-auto p-4 rounded-[14px] bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 size={14} className="text-[#94A3B8]" />
                  <span className="text-[11px] font-inter font-semibold text-[#94A3B8] uppercase tracking-[0.08em]">Market Avg Price</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[17px] font-sora font-bold text-[#0F172A] leading-[1.3] tracking-[-0.02em]">{inr(metrics?.averagePrice)}</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={cardVars} className="shrink-0 w-[220px] md:w-auto p-4 rounded-[14px] bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Wallet size={14} className="text-[#94A3B8]" />
                  <span className="text-[11px] font-inter font-semibold text-[#94A3B8] uppercase tracking-[0.08em]">You Save / Unit</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[18px] font-sora font-[800] text-[#10B981] leading-[1.2] tracking-[-0.02em]">{inr(metrics?.savingsPerUnit)}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="mt-auto pt-4 border-t border-slate-200">
            <div className="flex flex-row items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col mr-1">
                  <span className="text-[11px] font-inter font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-0.5">Procurement Volume</span>
                  <span className="text-[12px] font-inter font-normal text-[#475569]">Calculate landed cost</span>
                </div>
                <div className="flex items-center h-10 rounded-[10px] bg-white border border-slate-200 shadow-sm overflow-hidden shrink-0">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-full flex items-center justify-center text-[#475569] hover:bg-[#F8FAFC] font-sora font-semibold text-[13px]">−</button>
                  <input value={qty} readOnly className="w-12 text-center font-sora font-semibold text-[14px] text-[#0F172A] outline-none border-x border-slate-200 bg-white" />
                  <button onClick={() => setQty(qty + 1)} className="w-10 h-full flex items-center justify-center text-[#475569] hover:bg-[#F8FAFC] font-sora font-semibold text-[13px]">+</button>
                </div>
                <div className="hidden md:flex gap-1.5">
                  {[25, 50, 75, 100].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQty(q)}
                      className={`px-2.5 py-1.5 rounded-[8px] text-[12px] font-inter font-semibold transition-all border ${
                        qty === q ? "bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white border-transparent shadow-md hover:shadow-lg" : "bg-white text-[#475569] border-slate-200 hover:bg-[#F8FAFC] hover:border-pink-200"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-inter font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-1">Est. Total Order Value</p>
                <p className="text-[16px] md:text-[19px] font-sora font-[800] text-[#0F172A] tracking-[-0.02em] leading-[1.2]">
                  {inr((metrics?.bestPrice || 0) * qty)}
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
                <h3 className="font-sora font-bold text-[16px] text-[#0F172A] mb-1 leading-[1.35]">Supplier Matrix</h3>
                <p className="text-[12px] font-inter font-normal text-[#475569] flex items-center gap-1"><Info size={12} className="text-[#94A3B8]" /> Top 3 matches</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-[11px] font-inter font-semibold uppercase tracking-[0.08em] text-[#94A3B8] mb-2">Verified Sellers</h4>
              {topSellers.map((s, idx) => (
                <div key={s.id} className="group cursor-pointer">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-inter font-medium text-[#0F172A] group-hover:text-[#EC4899] transition-colors truncate max-w-[150px]">{s.businessName}</span>
                      {s.verified && <CheckCircle2 size={12} className="text-[#10B981] shrink-0" />}
                    </div>
                    <span className="text-[14px] font-sora font-[800] text-[#0F172A] tracking-[-0.02em] shrink-0">{inr(s.calculatedUnitPrice)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${s.trustScore || 80}%` }} transition={{ duration: 0.8, delay: 0.2 + (idx * 0.1), ease: "easeOut" }} className={`h-full rounded-full ${(s.trustScore || 80) > 90 ? "bg-[#0F172A]" : "bg-[#94A3B8]"}`} />
                    </div>
                    <span className="text-[11px] font-sora font-semibold text-[#475569] w-7 text-right shrink-0">{s.trustScore || 80}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-200">
            <GradientButton className="w-full group flex items-center justify-between py-2.5 px-4 rounded-[12px] bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow transition-all text-[13px] font-inter font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} />
                <span>Compare All Suppliers</span>
              </div>
              <ChevronRight size={14} className="text-[#94A3B8] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </GradientButton>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function BulkDealSection({ qty, aiDeals }) {
  if (!aiDeals || aiDeals.length === 0) return null;

  const bestDeal = aiDeals[0];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12 w-full">
      <FloatingSurface className="xl:col-span-1 p-8 overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#EC4899]/10 via-[#F97316]/10 to-transparent blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 flex-1">
          <div className="flex items-center justify-between mb-4">
            <PremiumBadge text="BEST VOLUME DEAL" />
            <span className="text-[11px] font-inter font-semibold tracking-[0.08em] uppercase text-[#0F172A] px-3 py-1.5 bg-white shadow-sm rounded-lg border border-slate-200">
              {bestDeal.requiredQuantity} Units Req.
            </span>
          </div>

          <div className="mb-4">
            <p className="text-[16px] font-sora font-bold text-[#0F172A] mb-2 leading-[1.35]">{bestDeal.businessName}</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[13px] font-inter font-normal text-[#64748B]">
                <MapPin size={16} /> <span>{bestDeal.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] font-inter font-normal text-[#64748B]">
                <Star size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-[#0F172A] font-semibold">{bestDeal.rating}</span>
                <span>{bestDeal.reviewCount} Reviews</span>
              </div>
            </div>
          </div>

          <div className="mb-3 flex flex-col items-start">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[24px] md:text-[26px] font-sora font-[800] text-[#0F172A] tracking-[-0.03em] leading-[1.2]">{inr(bestDeal.unitPrice)}</span>
              <span className="text-[13px] font-inter font-normal text-[#94A3B8]">/ unit</span>
            </div>
            <span className="px-2 py-1 bg-slate-100 text-[#64748B] text-[11px] font-inter font-semibold rounded-md uppercase tracking-[0.08em]">
              AI Recommended Price
            </span>
          </div>

          <div className="inline-block px-3 py-1.5 rounded-lg bg-orange-50 mb-4 border border-orange-100">
            <p className="text-[13px] font-inter font-semibold bg-clip-text text-transparent" style={{ backgroundImage: C.gradientCTA }}>
              Save {inr(bestDeal.totalSavingsVsMarket)} total vs Market Avg.
            </p>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-inter font-semibold text-[#0F172A] shadow-sm hover:bg-slate-50 transition-all">
              <MessageCircle size={16} /> Message
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#0F172A] rounded-lg text-[13px] font-inter font-semibold text-white shadow-sm hover:bg-[#1E293B] transition-all">
              <Phone size={16} /> Call Now
            </button>
          </div>
        </div>
      </FloatingSurface>

      <FloatingSurface className="xl:col-span-2 p-8 flex flex-col justify-between">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] flex items-center justify-center border border-slate-200 shadow-sm">
            <TrendingDown size={22} className="text-[#0F172A]" />
          </div>
          <div>
            <h3 className="text-[20px] font-sora font-bold text-[#0F172A] leading-[1.3] tracking-[-0.02em]">
              Volume Pricing Intelligence
            </h3>
            <p className="text-[14px] font-inter text-[#475569] mt-1.5 leading-[1.6]">
              Scale your order quantity to unlock deeper supplier discounts.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {aiDeals.map((b) => (
            <div key={b.rank} className="grid grid-cols-12 gap-4 items-center p-5 rounded-[20px] bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
              <div className="col-span-12 md:col-span-4 flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 flex-shrink-0 rounded-full bg-[#0F172A] text-white text-[11px] font-sora font-semibold flex items-center justify-center shadow-md">
                  {b.rank}
                </span>
                <span className="font-inter font-medium text-[14px] text-[#0F172A] truncate flex-1 block">
                  {b.businessName}
                </span>
              </div>
              <div className="col-span-4 md:col-span-2 mt-4 md:mt-0">
                <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em]">MOQ Required</p>
                <p className="text-[13px] font-medium text-[#475569] truncate">{b.requiredQuantity} Units</p>
              </div>
              <div className="col-span-4 md:col-span-2 mt-4 md:mt-0">
                <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em]">Unit Price</p>
                <p className="text-[16px] font-sora font-[800] text-[#0F172A] truncate tracking-[-0.02em]">{inr(b.unitPrice)}</p>
              </div>
              <div className="col-span-4 md:col-span-2 mt-4 md:mt-0">
                <p className="text-[11px] font-semibold text-[#10B981] uppercase tracking-[0.08em]">Total Savings</p>
                <p className="text-[13px] font-medium text-[#10B981] truncate">↓ {inr(b.totalSavingsVsMarket)}</p>
              </div>
              <div className="col-span-12 md:col-span-2 flex justify-end mt-5 md:mt-0">
                <button className="group/btn flex items-center justify-center gap-2 px-4 w-full md:w-auto h-[40px] bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded text-[13px] font-semibold text-white transition-all duration-200 hover:shadow-[0_4px_12px_rgba(244,63,94,0.3)] hover:-translate-y-0.5">
                  View <ArrowRight size={16} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </FloatingSurface>
    </div>
  );
}

const COL_HEADERS = [
  { label: '#', w: 'w-[60px]' },
  { label: 'Supplier', w: 'w-[280px]' },
  { label: 'Location', w: 'w-[150px]' },
  { label: 'MOQ & Base Price', w: 'w-[160px]' },
  { label: 'Your Order', w: 'w-[160px]' },
  { label: 'Bulk Deal', w: 'w-[160px]' },
  { label: 'Rating', w: 'w-[120px]' },
  { label: 'Score', w: 'w-[100px]' },
  { label: 'Available Stock', w: 'w-[140px]' },
  { label: 'Actions', w: 'w-[240px] text-right' },
];

function SupplierRow({ supplier, rank, qty, onSelect, delay }) {
  const dynamicPrice = supplier.calculatedUnitPrice;
  const totalPurchaseValue = dynamicPrice * qty;
  const hasBulk = supplier.bulkQty && supplier.bulkPrice;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`group relative hover:bg-[#FDFDFE] transition-all border-b border-slate-100 last:border-b-0 whitespace-nowrap z-10 hover:z-20 hover:-translate-y-[2px] hover:shadow-[0_10px_40px_rgba(15,23,42,0.06)] h-[90px] bg-white`}
    >
      <td className="py-2 pl-8 pr-4 align-middle rounded-l-[16px]">
        <span className="w-8 h-8 rounded-[10px] bg-white border border-slate-200 group-hover:bg-[#0F172A] text-[12px] font-sora font-semibold text-[#475569] group-hover:text-white group-hover:border-[#0F172A] flex items-center justify-center transition-all shadow-sm">
          {rank}
        </span>
      </td>
      <td className="py-2 px-4 align-middle">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[16px] bg-[#0F172A] text-white font-sora font-semibold text-[13px] flex items-center justify-center shadow-md shrink-0">
            {supplier.initials}
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-sora font-medium text-[14px] text-[#0F172A] leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#EC4899] group-hover:to-[#F97316] transition-all">
                {supplier.businessName}
              </span>
              {supplier.verified && <ShieldCheck size={16} className="text-[#10B981]" />}
            </div>
            {supplier.badge && <PremiumBadge text={supplier.badge} />}
          </div>
        </div>
      </td>
      <td className="py-2 px-4 align-middle">
        <span className="flex items-center gap-1.5 text-[13px] font-inter font-normal text-[#475569]">
          <MapPin size={16} className="text-[#94A3B8] shrink-0" /> {supplier.location}
        </span>
      </td>
      <td className="py-2 px-4 align-middle border-l border-slate-100">
        <div className="flex flex-col">
          <span className="text-[11px] font-inter font-semibold text-[#94A3B8] mt-1 tracking-[0.08em] uppercase">Min {supplier.moq} {supplier.moqUnit}</span>
          <span className="text-[14px] font-sora font-[800] text-[#0F172A] tracking-[-0.02em]">{inr(supplier.moqPrice)}</span>
        </div>
      </td>
      <td className="py-2 px-4 align-middle bg-[#F8FAFC]/50">
        <div className="flex flex-col relative group/tooltip">
          <span className="flex items-center gap-1 text-[11px] font-inter font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-1">
            Your Order ({qty})
          </span>
          <span className="text-[16px] font-sora font-[800] text-[#10B981] tabular-nums tracking-[-0.02em]">{inr(totalPurchaseValue)}</span>
        </div>
      </td>
      <td className="py-2 px-4 align-middle border-r border-slate-100">
        {hasBulk ? (
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-inter font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-1">Bulk {supplier.bulkQty}+ Units</span>
            <span className="text-[14px] font-sora font-[800] text-[#0F172A] mb-1 tracking-[-0.02em]">{inr(supplier.bulkPrice)}</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] bg-emerald-50 text-emerald-600 text-[10px] font-sora font-semibold uppercase tracking-[0.10em] border border-emerald-100">
              Deal Active
            </span>
          </div>
        ) : (
           <span className="text-[11px] font-inter font-semibold text-[#94A3B8] uppercase tracking-[0.08em]">No Bulk Deal</span>
        )}
      </td>
      <td className="py-2 px-4 align-middle">
        <div className="flex flex-col">
          <span className="flex items-center gap-1.5 text-[13px] font-sora font-medium text-[#0F172A]">⭐ {supplier.rating}</span>
          <span className="text-[12px] font-inter font-normal text-[#94A3B8] mt-1">{supplier.reviews} reviews</span>
        </div>
      </td>
      <td className="py-2 px-4 align-middle">
        <ScoreRing score={supplier.trustScore} size={46} />
      </td>
      <td className="py-2 px-4 align-middle">
        <div className="flex flex-col">
          <span className={`text-[14px] font-sora font-medium ${supplier.availableStock < 100 ? 'text-[#F97316]' : 'text-[#0F172A]'}`}>
            {supplier.availableStock.toLocaleString()} <span className="text-[13px] font-inter text-[#94A3B8] font-normal ml-0.5">{supplier.moqUnit}</span>
          </span>
          {supplier.availableStock < 100 && (
            <span className="text-[10px] font-inter font-semibold text-[#F97316] mt-0.5 tracking-[0.10em] uppercase">Low stock</span>
          )}
        </div>
      </td>
      <td className="py-2 pl-4 pr-8 align-middle text-right">
        <div className="flex items-center justify-end gap-2 ">
          <SecondaryButton onClick={(e) => { e.stopPropagation(); onSelect(supplier); }} className="h-10 px-3 rounded text-[13px] font-semibold border-slate-200 hover:border-slate-300">
            Details <ExternalLink size={14} className="ml-1.5 text-[#94A3B8]" />
          </SecondaryButton>
          <button className="h-10 px-4 rounded bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white flex items-center justify-center gap-2 text-[13px] font-inter font-semibold hover:bg-[#1E293B] shadow-md hover:shadow-lg transition-all active:scale-95">
            <Phone size={14} className="opacity-80" /> Call Now
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

function SupplierTable({ qty, onSelect, suppliers }) {
  const [visibleCount, setVisibleCount] = useState(5);
  
  if (!suppliers || suppliers.length === 0) return <div className="p-8 text-center text-slate-500 font-inter">No verified suppliers currently offer this quantity. Try reducing the requested volume.</div>;

  return (
    <div className="w-full flex flex-col mt-4">
      <div className="w-full overflow-x-auto overflow-y-auto custom-scrollbar relative max-h-[600px] border-b border-slate-200">
        <table className="w-full text-left border-collapse min-w-[1400px]">
          <thead className="sticky top-0 z-30 table-header-shadow">
            <tr className="bg-[#F8FAFC] border-y border-slate-200">
              {COL_HEADERS.map((h, i) => (
                <th key={h.label} className={`py-4 px-4 ${i === 0 ? 'pl-8' : ''} ${i === COL_HEADERS.length - 1 ? 'pr-8' : ''} text-[11px] font-inter font-semibold uppercase tracking-[0.08em] text-[#94A3B8] whitespace-nowrap bg-[#F8FAFC] backdrop-blur-md ${h.w}`}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {suppliers.slice(0, visibleCount).map((s, i) => (
              <SupplierRow key={s.id} supplier={s} rank={i + 1} qty={qty} onSelect={onSelect} delay={i * 0.05} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 md:px-8 py-5 bg-[#FDFDFE] flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-[28px]">
        <span className="text-[13px] font-inter font-normal text-[#475569]">
          Showing <strong className="text-[#0F172A] font-medium">{Math.min(visibleCount, suppliers.length)}</strong> of {suppliers.length} verified suppliers
        </span>
        {visibleCount < suppliers.length ? (
          <button onClick={() => setVisibleCount(10)} className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-white border border-slate-200 text-[13px] font-inter font-semibold text-[#0F172A] hover:bg-[#F8FAFC] hover:shadow-sm transition-all">
            View All Seller <ChevronDown size={16} className="text-[#94A3B8]" />
          </button>
        ) : suppliers.length > 5 && (
          <button onClick={() => setVisibleCount(5)} className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-white border border-slate-200 text-[13px] font-inter font-semibold text-[#0F172A] hover:bg-[#F8FAFC] hover:shadow-sm transition-all">
            <ChevronUp size={16} /> Less All Seller
          </button>
        )}
      </div>
    </div>
  );
}

function PriceComparisonSection({ sortBy, setSortBy, onSelect, qty, suppliers }) {
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const FILTER_OPTS = ['Location', 'MOQ', 'Rating'];
  const SORT_OPTS = ['Lowest Price', 'Best Value', 'Nearest Seller'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="bg-white border border-slate-200 rounded-[28px] shadow-[0_20px_50px_rgba(15,23,42,0.08)] flex flex-col w-full overflow-hidden mb-16">
      <div className="px-6 pt-6 md:px-8 md:pt-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] md:text-[22px] font-sora font-bold text-[#0F172A] tracking-[-0.02em] leading-[1.3]">Compare Verified Suppliers</h2>
          <p className="text-[14px] font-inter font-normal text-[#475569] mt-1.5 max-w-2xl leading-[1.6]">
            Review live quotes, supplier trust score, pricing intelligence and secure procurement deals.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[12px] bg-[#F8FAFC] border border-slate-200 shadow-sm shrink-0">
          <ShieldCheck size={16} className="text-[#10B981]" />
          <span className="text-[11px] font-sora font-semibold uppercase tracking-[0.08em] text-[#0F172A]">{suppliers?.length || 0} Verified Suppliers</span>
        </div>
      </div>
      <div className="px-6 md:px-8 mt-6 w-full">
        <div className="relative w-full group">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#0F172A] transition-colors" />
          <input type="text" placeholder="Search supplier, location..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="w-full h-[52px] rounded-[16px] bg-[#F8FAFC] pl-12 pr-16 text-[14px] font-inter font-normal text-[#0F172A] placeholder:text-[13px] placeholder:font-normal outline-none border border-slate-200 focus:border-pink-300 focus:ring-0.5 focus:ring-pink-300 transition-all shadow-[inset_0_2px_4px_rgba(15,23,42,0.02)]" />
        </div>
      </div>
      <div className="px-6 md:px-8 mt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 lg:pb-0">
          <span className="text-[11px] font-inter font-semibold text-[#475569] uppercase tracking-[0.08em] shrink-0">Filter By</span>
          <div className="w-px h-6 bg-slate-200 hidden md:block shrink-0 mx-1" />
          {FILTER_OPTS.map(f => (
            <button key={f} onClick={() => setActiveFilter(activeFilter === f ? null : f)} className={`flex items-center gap-2 h-[42px] px-4 rounded-[14px] text-[13px] font-inter font-semibold transition-all shrink-0 border ${activeFilter === f ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md' : 'text-[#475569] bg-white border-slate-200 hover:bg-[#F8FAFC] hover:-translate-y-0.5 hover:shadow-sm'}`}>
              {f} <ChevronDown size={14} className={`transition-transform duration-200 ${activeFilter === f ? 'text-white rotate-180' : 'text-[#94A3B8]'}`} />
            </button>
          ))}
        </div>
        <div className="relative shrink-0 w-full lg:w-[220px] z-40">
          <button onClick={() => setSortOpen(o => !o)} className="flex items-center justify-between w-full h-[42px] px-4 rounded-[14px] bg-white text-[13px] font-inter font-semibold text-[#0F172A] border border-slate-200 hover:bg-[#F8FAFC] hover:-translate-y-0.5 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2"><BarChart3 size={16} className="text-[#94A3B8]" /> Sort: {sortBy}</div>
            <ChevronDown size={16} className={`text-[#94A3B8] transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {sortOpen && (
              <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15 }} className="absolute right-0 top-[calc(100%+8px)] w-full rounded-[16px] bg-white shadow-xl overflow-hidden border border-slate-200">
                {SORT_OPTS.map(o => (
                  <button key={o} onClick={() => { setSortBy(o); setSortOpen(false); }} className={`w-full text-left px-4 py-3 text-[13px] font-inter transition-colors ${sortBy === o ? 'bg-[#F8FAFC] text-[#0F172A] font-semibold border-l-2 border-l-[#0F172A]' : 'text-[#475569] font-normal hover:bg-[#F8FAFC] border-l-2 border-l-transparent'}`}>
                    {o}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <SupplierTable onSelect={onSelect} qty={qty} suppliers={suppliers} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SUPPLIER DRAWER MODAL
───────────────────────────────────────────── */
function SupplierDrawer({ supplier, onClose }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    if (supplier) document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', fn);
      document.body.style.overflow = 'unset';
    };
  }, [supplier, onClose]);

  if (!supplier) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div initial={{ opacity: 0, scale: 0.97, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 15 }} transition={{ duration: 0.2, ease: "easeOut" }} className="relative w-full max-w-[680px] rounded-xl bg-white shadow-[0_20px_40px_-15px_rgba(15,23,42,0.1)] border border-slate-200 text-slate-700 antialiased z-10">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center text-white font-semibold text-[13px] shadow-sm ring-1 ring-slate-900/5">
                {supplier.initials}
              </div>
              <div>
                <h2 className="text-[16px] font-semibold text-slate-900 leading-[1.35]">{supplier.businessName}</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="flex items-center gap-1 text-slate-500 text-[12px] font-normal">
                    <MapPin size={12} className="text-slate-400" /> {supplier.location}
                  </span>
                  {supplier.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-[0.10em] bg-rose-50 text-rose-600 border border-rose-100 flex items-center gap-1">
                      <Zap size={10} /> {supplier.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 rounded-md border border-slate-200 bg-white flex items-center gap-1.5 shadow-sm">
                <Star className="fill-yellow-400 text-yellow-400" size={12} />
                <span className="text-[13px] font-medium text-slate-900">{supplier.rating}</span>
                <span className="text-[12px] font-normal text-slate-500">({supplier.reviews})</span>
              </div>
              <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-5">
            <div className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-slate-100 p-4">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.08em] mb-1">Calculated Unit Price</p>
                  <div className="flex items-baseline gap-1">
                    <h1 className="text-[24px] md:text-[26px] font-[800] text-slate-900 tracking-[-0.03em] leading-[1.2]">{inr(supplier.calculatedUnitPrice)}</h1>
                    <span className="text-[13px] text-slate-500 font-normal">/ {supplier.moqUnit}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5 text-slate-600 text-[12px] font-medium">
                    <Boxes size={12} className="text-slate-400" /> Base MOQ: {supplier.moq} {supplier.moqUnit}
                  </div>
                </div>
                <div className="pl-4">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.08em] mb-1">Stock Availability</p>
                  <h1 className="text-[16px] font-semibold text-slate-900 tracking-[-0.02em]">{supplier.availableStock} Units</h1>
                  <p className="mt-1.5 text-slate-600 flex items-center gap-1 text-[12px] font-normal">
                    <Truck size={12} className="text-slate-400" /> Ships in {supplier.deliveryTime}
                  </p>
                </div>
              </div>
              
              {supplier.bulkQty && supplier.bulkPrice && (
                <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-[0.10em]">Bulk Deal</span>
                    <span className="text-slate-700 text-[13px] font-medium">{supplier.bulkQty}+ Units @ {inr(supplier.bulkPrice)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {supplier.verified && <span className="px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-[0.10em] bg-emerald-50 text-emerald-700 border border-emerald-100">Verified Partner</span>}
              <span className="px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-[0.10em] bg-blue-50 text-blue-700 border border-blue-100">Trust Score {supplier.trustScore}%</span>
              <span className="px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-[0.10em] bg-indigo-50 text-indigo-700 border border-indigo-100">Quality Checked</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-3">
              <div className="flex gap-2 w-1/2">
                <button className="flex-1 border border-slate-200 rounded-lg py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-1.5">
                  <MessageCircle size={14} /> Chat
                </button>
                <button className="flex-1 border border-slate-200 rounded-lg py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-1.5">
                  <Phone size={14} /> Call
                </button>
              </div>
              <button className="w-1/2 py-2 rounded-lg font-semibold text-[13px] text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all flex items-center justify-center gap-1.5">
                <ShoppingBag size={14} /> Initialize Order
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   NEGOTIATION CRM SECTION
───────────────────────────────────────────── */
function NegotiationCRM({ qty, metrics, masterProductId }) {
  const [negQty, setNegQty] = useState(qty);
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setNegQty(qty);
  }, [qty]);

  async function handleSend() {
    if (!price || !masterProductId) return;
    setIsSending(true);
    try {
      await compareApi.submitEnquiry({
        masterProductId: masterProductId,
        requestedQuantity: negQty,
        targetPrice: Number(price),
        message: msg
      });
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setPrice("");
        setMsg("");
      }, 3000);
    } catch (e) {
      alert("Failed to send quote request.");
    } finally {
      setIsSending(false);
    }
  }

  const input = "w-full h-[52px] md:h-[56px] px-4 md:px-5 rounded-[14px] bg-white border border-slate-200 outline-none text-[14px] font-inter font-normal text-[#0F172A] placeholder:text-[13px] placeholder:font-normal transition-all focus:border-[#EC4899] focus:ring-2 focus:ring-pink-500/10";

  return (
    <motion.section initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5}} className="w-full max-w-[1440px] mx-auto px-0">
      <FloatingSurface className="relative overflow-hidden p-4 sm:p-6 md:p-8 lg:p-10 mb-8">
        <div className="absolute top-0 left-0 w-full h-[4px]" style={{ background: C.gradientCTA }} />
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 mb-4">
              <Zap size={14} className="text-pink-500"/>
              <span className="text-[11px] font-sora font-semibold uppercase tracking-[0.08em] text-pink-600">Global Supplier Negotiation</span>
            </div>
            <h2 className="text-[20px] md:text-[22px] font-sora font-bold text-[#0F172A] leading-[1.3] tracking-[-0.02em]">Request Custom Quote</h2>
            <p className="mt-2 text-[14px] font-inter text-[#475569] leading-[1.6]">Broadcast your target price to all verified suppliers for this product.</p>
          </div>
          <div className="w-full lg:w-[360px] p-4 rounded-[18px] bg-[#F8FAFC] border border-slate-200">
            <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-slate-400 mb-2">Product</p>
            <h3 className="text-[16px] font-sora font-bold text-[#0F172A] leading-[1.35]">{metrics?.productName || "Product"}</h3>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[12px] font-medium text-slate-600">Qty: {negQty} Units</span>
              <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[12px] font-medium text-slate-600">Market Avg: {inr(metrics?.averagePrice)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-2">Required Quantity</label>
            <div className="relative">
              <input type="number" value={negQty} onChange={(e)=>setNegQty(e.target.value)} className={input} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-medium text-slate-400">Units</span>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-2">Target Price / Unit</label>
            <input type="number" value={price} onChange={(e)=>setPrice(e.target.value)} placeholder={`Below ${inr(metrics?.bestPrice)}`} className={input} />
          </div>
        </div>
        <div className="mt-5">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-2">Message To Suppliers</label>
          <textarea rows={4} value={msg} onChange={(e)=>setMsg(e.target.value)} placeholder="Mention payment terms, delivery requirements..." className="w-full px-4 md:px-5 py-4 rounded-[16px] bg-white border border-slate-200 outline-none text-[14px] font-inter font-normal placeholder:text-[13px] resize-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10" />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <GradientButton icon={sent ? CheckCircle2 : ArrowRight} onClick={handleSend} disabled={isSending || sent} className="w-full sm:w-auto px-6 py-3.5 text-[14px] font-semibold">
            {isSending ? "Sending..." : sent ? "Quote Broadcasted" : "Broadcast Negotiation Request"}
          </GradientButton>
          <div className="flex items-center gap-2 text-[12px] text-slate-500 font-normal font-inter">
            <ShieldCheck size={16} className="text-emerald-500"/> No commitment until a supplier accepts
          </div>
        </div>
      </FloatingSurface>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ComparePrice() {
  const query = useQuery();
  const navigate = useNavigate();
  
  const masterProductId = query.get("productId");
  const initialQty = parseInt(query.get("qty") || "50", 10);

  const [qty, setQty] = useState(initialQty);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [sortBy, setSortBy] = useState('Lowest Price');

  // Search Modal state
  const [searchModalOpen, setSearchModalOpen] = useState(!masterProductId);

  // Trigger search modal from URL changes
  useEffect(() => {
    if (!masterProductId) {
      setSearchModalOpen(true);
      setIsLoading(false);
    } else {
      setSearchModalOpen(false);
    }
  }, [masterProductId]);

  // Fetch Compare Data
  useEffect(() => {
    if (!masterProductId) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await compareApi.getCompareData(masterProductId, qty);
        setData(res.data);
      } catch (e) {
        console.error("Failed to load compare data", e);
      } finally {
        setIsLoading(false);
      }
    };
    
    const debounce = setTimeout(fetchData, 400); 
    return () => clearTimeout(debounce);
  }, [masterProductId, qty]);

  // Handler for when user selects a product in the modal
  const handleProductSearch = (newProductId, newQty) => {
    setSearchModalOpen(false);
    setQty(newQty);
    // Update the URL to trigger the fetch and allow link sharing
    navigate(`?productId=${newProductId}&qty=${newQty}`);
  };

  // If loading and no data yet
  if (isLoading && !data && masterProductId) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="w-10 h-10 animate-spin text-slate-900" /></div>;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: typographyStyles }} />
      <div className="min-h-screen font-inter antialiased selection:bg-[#EC4899]/20 selection:text-[#0F172A] flex flex-col w-full overflow-x-hidden relative">
        
        {/* Render Search Modal (Appears if no productId, or if user clicks "New Search") */}
        <ProductSearchModal 
          isOpen={searchModalOpen} 
          onClose={masterProductId ? () => setSearchModalOpen(false) : null} // Can only close if a product is already selected
          onSearch={handleProductSearch}
        />

        {/* Only render the main dashboard if a product is selected and data is loaded */}
        {masterProductId && data && (
          <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-[1440px] mx-auto sm:px-1 lg:px-1 space-y-6 pt-4">
            
            <ProductHeader 
              qty={qty} 
              setQty={setQty} 
              metrics={data?.headerMetrics} 
              suppliers={data?.suppliers} 
              onNewSearch={() => setSearchModalOpen(true)}
            />

            {data?.aiVolumeDeals?.length > 0 && (
              <div className="mb-14 w-full">
                <h2 className="text-[20px] md:text-[22px] font-sora font-bold text-[#0F172A] leading-[1.3] tracking-[-0.02em] mb-8">AI Purchase Intelligence</h2>
                <BulkDealSection qty={qty} aiDeals={data.aiVolumeDeals} />
              </div>
            )}

            <PriceComparisonSection 
              sortBy={sortBy} 
              setSortBy={setSortBy} 
              onSelect={setSelectedSupplier} 
              qty={qty} 
              suppliers={data?.suppliers} 
            />
          </motion.main>
        )}

        <SupplierDrawer
          supplier={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
        />
      </div>

      {masterProductId && data && (
        <motion.div {...fadeUp} className="mx-auto px-4 sm:px-8 w-full max-w-[1200px]">
          <NegotiationCRM qty={qty} metrics={data?.headerMetrics} masterProductId={masterProductId} />
        </motion.div>
      )}
    </>
  );
}