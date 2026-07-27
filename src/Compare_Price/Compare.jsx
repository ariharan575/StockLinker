import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronDown, MapPin, X,
  ShieldCheck, ExternalLink, MessageCircle, ShoppingBag, 
  Star, Package, Zap, ArrowRight, CheckCircle2, ChevronRight, 
  Phone, TrendingDown, Boxes, Truck, BarChart3, Info, Wallet, 
  ChevronUp, Loader2, SearchCode, AlertTriangle
} from 'lucide-react';
import { compareApi } from './Services/api';

/* ─────────────────────────────────────────────
   THEME & STYLES (Pink, Black, Slate, Emerald, Rose)
───────────────────────────────────────────── */
const C = {
  gradientCTA: "linear-gradient(to right, #EC4899, #F43F5E, #F97316)",
  bg: '#F8FAFC',
  border: 'rgba(15,23,42,0.08)',
  primary: '#0F172A',
  softSurface: '#FDFDFE',
};

const inr = (n) => n != null ? `₹${Number(n).toLocaleString("en-IN")}` : '₹0';

const typographyStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@400;600;700;800&display=swap');
  .font-sora { font-family: 'Sora', sans-serif; }
  .font-inter { font-family: 'Inter', sans-serif; }
  body { 
    background-color: ${C.bg}; 
    -webkit-font-smoothing: antialiased;
  }
  .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #CBD5E1 transparent; }
  .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: #F8FAFC; border-radius: 12px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #CBD5E1; border-radius: 12px; border: 2px solid #F8FAFC; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94A3B8; }
  .table-header-shadow { box-shadow: 0 4px 20px -10px rgba(15,23,42,0.1); }
  
  /* Hides spin buttons in number inputs */
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  input[type=number] { -moz-appearance: textfield; }
`;

/* ─────────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────────── */
const FloatingSurface = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    className={`bg-white shadow-sm w-full relative ${className}`}
    style={{ border: `1px solid ${C.border}`, borderRadius: '24px' }}
  >
    {children}
  </motion.div>
);

const GradientButton = ({ children, onClick, className = "", icon: Icon, disabled }) => (
  <motion.button
    onClick={onClick} disabled={disabled}
    whileHover={!disabled ? { scale: 1.02 } : {}} whileTap={!disabled ? { scale: 0.98 } : {}}
    className={`relative inline-flex items-center justify-center font-inter font-semibold text-white transition-all overflow-hidden group ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    style={{ background: disabled ? '#94A3B8' : C.gradientCTA, borderRadius: '8px', boxShadow: disabled ? 'none' : '0 8px 24px -6px rgba(244,63,94,0.4)' }}
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
    whileHover={{ scale: 1.02, backgroundColor: C.softSurface }}
    whileTap={{ scale: 0.98 }}
    className={`inline-flex items-center justify-center font-inter font-semibold text-[#0F172A] bg-white transition-colors ${className}`}
    style={{ border: `2px solid ${C.border}`, borderRadius: '5px', ...style }}
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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth={size * 0.08} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" 
          stroke={(score || 80) >= 90 ? "url(#scoreGradGreen)" : "url(#scoreGrad)"} 
          strokeWidth={size * 0.08}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-sora font-semibold text-[13px] text-[#0F172A]">{score || 80}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GLOBAL TOAST NOTIFICATION
───────────────────────────────────────────── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${type === 'success' ? 'bg-[#067647] border-[#05603A]' : 'bg-rose-600 border-rose-700'}`}
    >
      {type === 'success' ? <CheckCircle2 className="text-white" size={20} /> : <AlertTriangle className="text-white" size={20} />}
      <span className="text-white font-sora font-semibold text-[14px]">{message}</span>
      <button onClick={onClose} className="ml-4 text-white/80 hover:text-white"><X size={16}/></button>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   STRICT QUANTITY ERROR POPUP
───────────────────────────────────────────── */
const ErrorPopup = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}/>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10">
        <div className="bg-rose-50 border-b border-rose-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-rose-600">
            <AlertTriangle size={20} />
            <h3 className="font-sora font-bold text-[16px]">Quantity Unavailable</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20}/></button>
        </div>
        <div className="p-6">
          <p className="text-[14px] font-inter text-slate-700 leading-relaxed mb-6">{message}</p>
          <div className="flex justify-end">
            <button onClick={onClose} className="px-6 py-2.5 bg-[#0F172A] text-white rounded-xl text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-md">OK, Got it</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

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
    if (!isOpen) { setSearchQuery(""); setSuggestions([]); setSelectedProduct(null); setDraftQty(50); }
  }, [isOpen]);

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSelectedProduct(null);
    if (val.trim().length < 2) { setSuggestions([]); return; }
    setIsSearching(true);
    try {
      const res = await compareApi.searchMasterProducts(val);
      setSuggestions(res.data || []);
    } catch (err) { console.error(err); } finally { setIsSearching(false); }
  };

const handleSelectSuggestion = (sug) => { setSelectedProduct(sug); setSearchQuery(sug.name); setSuggestions([]); };
  const handleSubmit = () => { if (selectedProduct && draftQty > 0) onSearch(selectedProduct.id, draftQty); };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-[500px] bg-white rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden z-10">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white shadow-sm"><SearchCode size={20} /></div>
              <div>
                <h2 className="text-[18px] font-sora font-bold text-[#0F172A] leading-tight">Procurement Search</h2>
                <p className="text-[12px] font-inter text-slate-500">Find products to compare market prices</p>
              </div>
            </div>
            {/* Always show X button so user is never trapped */}
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-lg transition-colors"><X size={18} /></button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-[11px] font-inter font-semibold uppercase tracking-[0.08em] text-slate-500 mb-2">1. Select Master Product</label>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search product name..." className="w-full h-[52px] pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-[14px] text-[14px] font-inter outline-none focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all" />
                {isSearching && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />}
                {suggestions.length > 0 && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-200 rounded-[14px] shadow-xl z-50 max-h-[220px] overflow-y-auto py-2 custom-scrollbar">
                    {suggestions.map((sug) => (
                      <div key={sug.id} onClick={() => handleSelectSuggestion(sug)} className="px-4 py-3 text-[13px] font-inter font-medium text-slate-700 hover:bg-slate-50 hover:text-pink-600 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">{sug.name}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={`transition-opacity duration-300 ${selectedProduct ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <label className="block text-[11px] font-inter font-semibold uppercase tracking-[0.08em] text-slate-500 mb-2">2. Required Quantity</label>
              <div className="relative">
                <Package size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" value={draftQty} onChange={(e) => setDraftQty(Number(e.target.value))} min="1" className="w-full h-[52px] pl-11 pr-16 bg-slate-50 border border-slate-200 rounded-[14px] text-[14px] font-inter outline-none focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-medium text-slate-400">Units</span>
              </div>
            </div>
          </div>
          <div className="px-6 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <SecondaryButton onClick={onClose} className="px-6 py-2.5 rounded-[12px] text-[13px] bg-white border-slate-200 text-slate-600">Close</SecondaryButton>
            <GradientButton onClick={handleSubmit} disabled={!selectedProduct || draftQty < 1} className="px-8 py-2.5 rounded-[12px] text-[13px]">Analyze Market Prices <ArrowRight size={16} className="ml-2" /></GradientButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   SECTION 1: PRODUCT HEADER & QUANTITY VALIDATOR
───────────────────────────────────────────── */
function ProductHeader({ qty, setQty, metrics, boundaries, onNewSearch, onShowError }) {
  const [localQty, setLocalQty] = useState(qty);

  useEffect(() => { setLocalQty(qty); }, [qty]);

  const handleQtySubmit = (newQty) => {
    if (!newQty || isNaN(newQty) || newQty < 1) { setLocalQty(qty); return; }

    if (boundaries?.maxAvailableStock > 0 && newQty > boundaries.maxAvailableStock) {
      onShowError(`No single seller has ${newQty} quantity available. The maximum available stock is ${boundaries.maxAvailableStock}. Please reduce your quantity.`);
      setLocalQty(qty); 
    } else if (boundaries?.absoluteMinMoq > 0 && newQty < boundaries.absoluteMinMoq) {
      onShowError(`The minimum order quantity required by sellers for this product is ${boundaries.absoluteMinMoq}. Please increase your quantity.`);
      setLocalQty(qty); 
    } else {
      setQty(newQty); 
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleQtySubmit(parseInt(localQty, 10)); };
  const handleBlur = () => handleQtySubmit(parseInt(localQty, 10));
  
  const stepQty = (step) => handleQtySubmit(parseInt(localQty, 10) + step);

  return (
    <motion.section initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="mb-6 w-full mt-4">
      <div className="flex flex-col xl:flex-row bg-[#FFFFFF] rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex-1 p-5 xl:p-8 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3 text-[12px] font-inter font-medium text-slate-500">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[10px] font-sora font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 uppercase tracking-[0.10em]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" /> Live Market
              </span>
              <span className="text-slate-300 shrink-0">•</span>
              <span className="flex items-center gap-1.5 shrink-0 text-slate-900"><TrendingDown size={14} className="text-[#0F172A]" /> Best price detected</span>
            </div>
            <button onClick={onNewSearch} className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-slate-50 text-slate-600 text-[12px] font-semibold hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-200 shadow-sm">
              <Search size={14} /> New Search
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-[24px] md:text-[28px] font-sora font-bold tracking-[-0.03em] text-[#0F172A] leading-[1.2] mb-3">{metrics?.productName || "Loading Product..."}</h1>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-inter font-semibold rounded-md">ID: {metrics?.masterProductId?.substring(0,8).toUpperCase()}</span>
              {/* Note: Brand is explicitly removed here per requirements */}
              <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-inter font-semibold rounded-md">Category: {metrics?.category}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-[16px] bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2"><ShieldCheck size={14} className="text-slate-400" /><span className="text-[11px] font-inter font-semibold text-slate-500 uppercase tracking-[0.08em]">Suppliers</span></div>
              <div className="flex items-baseline gap-1.5"><span className="text-[20px] font-sora font-bold text-[#0F172A]">{metrics?.supplierCount || 0}</span></div>
            </div>
            <div className="p-4 rounded-[16px] bg-pink-50/50 border border-pink-100 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2"><TrendingDown size={14} className="text-pink-500" /><span className="text-[11px] font-inter font-semibold text-pink-600 uppercase tracking-[0.08em]">Best Price</span></div>
              <div className="flex items-baseline gap-1.5"><span className="text-[20px] font-sora font-[800] text-[#0F172A]">{inr(metrics?.bestPrice)}</span></div>
            </div>
            <div className="p-4 rounded-[16px] bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2"><BarChart3 size={14} className="text-slate-400" /><span className="text-[11px] font-inter font-semibold text-slate-500 uppercase tracking-[0.08em]">Market Avg</span></div>
              <div className="flex items-baseline gap-1.5"><span className="text-[20px] font-sora font-bold text-[#0F172A]">{inr(metrics?.averagePrice)}</span></div>
            </div>
            <div className="p-4 rounded-[16px] bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2"><Wallet size={14} className="text-emerald-500" /><span className="text-[11px] font-inter font-semibold text-emerald-600 uppercase tracking-[0.08em]">You Save / Unit</span></div>
              <div className="flex items-baseline gap-1.5"><span className="text-[20px] font-sora font-[800] text-emerald-600">{inr(metrics?.savingsPerUnit)}</span></div>
            </div>
          </div>

          <div className="mt-auto pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[11px] font-inter font-semibold text-slate-500 uppercase tracking-[0.08em] mb-1">Your Need</p>
                <p className="text-[12px] font-inter text-slate-400">Strict constraints apply</p>
              </div>
              <div className="flex items-center h-[42px] rounded-[10px] bg-white border border-slate-300 shadow-sm overflow-hidden shrink-0">
                <button onClick={() => stepQty(-1)} className="w-12 h-full flex items-center justify-center text-slate-600 hover:bg-slate-50 font-sora font-semibold border-r border-slate-200 transition-colors">−</button>
                <input type="number" value={localQty} onChange={(e) => setLocalQty(e.target.value)} onKeyDown={handleKeyDown} onBlur={handleBlur} className="w-16 h-full text-center font-sora font-[800] text-[14px] text-[#0F172A] outline-none" />
                <button onClick={() => stepQty(1)} className="w-12 h-full flex items-center justify-center text-slate-600 hover:bg-slate-50 font-sora font-semibold border-l border-slate-200 transition-colors">+</button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-inter font-semibold text-slate-500 uppercase tracking-[0.08em] mb-1">Est. Total Value</p>
              <p className="text-[20px] font-sora font-[800] text-[#0F172A] leading-none">{inr((metrics?.bestPrice || 0) * qty)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 2: AI PURCHASE INTELLIGENCE (Left: Top 1, Right: Upsells)
───────────────────────────────────────────── */
function AiPurchaseIntelligence({ topSupplier, aiDeals, qty }) {
  if (!topSupplier) return null;

  return (
    <div className="mb-14 w-full">
      <h2 className="text-[20px] md:text-[22px] font-sora font-bold text-[#0F172A] leading-[1.3] tracking-[-0.02em] mb-6">AI Purchase Intelligence</h2>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
        
        {/* LEFT: Top 1 Winner for requested qty */}
        <FloatingSurface className="xl:col-span-1 p-6 md:p-8 overflow-hidden flex flex-col justify-between relative bg-[#0F172A]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/20 via-orange-500/20 to-transparent blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-sora font-semibold uppercase tracking-[0.10em] bg-white text-[#0F172A] shadow-md"><Zap size={12} className="fill-pink-500 text-pink-500" /> #1 BEST DEAL</span>
              <span className="text-[11px] font-inter font-semibold tracking-[0.08em] uppercase text-slate-300 px-3 py-1.5 border border-slate-700 rounded-md bg-slate-800/50">{qty} Units Requested</span>
            </div>

            <div className="mb-6">
              <h3 className="text-[20px] font-sora font-bold text-white mb-2 leading-[1.3]">{topSupplier.businessName}</h3>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[13px] font-inter text-slate-400"><MapPin size={14} /> {topSupplier.location}</div>
                <div className="flex items-center gap-1.5 text-[13px] font-inter text-slate-400"><Star size={14} className="text-yellow-500 fill-yellow-500" /> <span className="text-white font-medium">{topSupplier.rating}</span> ({topSupplier.reviews} Reviews)</div>
              </div>
            </div>

            <div className="mb-6 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <p className="text-[11px] uppercase tracking-[0.08em] text-slate-400 font-semibold mb-1">Calculated Price</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[28px] font-sora font-[800] text-white tracking-[-0.03em] leading-none">{inr(topSupplier.calculatedUnitPrice)}</span>
                <span className="text-[13px] font-inter text-slate-400">/ unit</span>
              </div>
              {topSupplier.isCheaperThanAverage && (
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-sora font-semibold uppercase tracking-[0.10em]">
                  Save {inr(topSupplier.priceDifferenceFromAverage)} vs Avg
                </div>
              )}
            </div>

            <div className="mt-auto flex items-center gap-3">
              <button className="flex-1 py-3 bg-slate-800 text-white border border-slate-700 rounded-xl text-[13px] font-inter font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"><MessageCircle size={16} /> Chat</button>
              <GradientButton className="flex-[2] py-3 rounded-xl text-[14px]">Place Order</GradientButton>
            </div>
          </div>
        </FloatingSurface>

        {/* RIGHT: Volume Upsell Intelligence */}
        <FloatingSurface className="xl:col-span-2 p-6 md:p-8 flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center border border-pink-100 shadow-sm"><Package size={22} className="text-pink-600" /></div>
            <div>
              <h3 className="text-[20px] font-sora font-bold text-[#0F172A] leading-[1.3] tracking-[-0.02em]">Volume Upsell Intelligence</h3>
              <p className="text-[14px] font-inter text-slate-500 mt-1">Scale your order quantity to unlock massive supplier discounts and get extra units.</p>
            </div>
          </div>

          <div className="space-y-4">
            {aiDeals?.length > 0 ? aiDeals.map((deal) => (
              <div key={deal.rank} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-[16px] bg-white border border-slate-200 shadow-sm hover:border-pink-300 hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-sora font-bold flex items-center justify-center text-[12px] shadow-md">{deal.rank}</div>
                  <div>
                    <h4 className="text-[15px] font-sora font-semibold text-[#0F172A] leading-tight">{deal.businessName}</h4>
                    <p className="text-[12px] font-inter text-slate-500 mt-1"><Star size={12} className="inline text-yellow-500 fill-yellow-500 mb-0.5" /> {deal.rating} • {deal.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 divide-x divide-slate-100 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <div className="pr-2">
                    <p className="text-[10px] font-inter font-semibold text-slate-400 uppercase tracking-[0.08em] mb-1">Buy Quantity</p>
                    <p className="text-[14px] font-sora font-bold text-[#0F172A]">{deal.requiredQuantity} Units</p>
                  </div>
                  <div className="px-4">
                    <p className="text-[10px] font-inter font-semibold text-slate-400 uppercase tracking-[0.08em] mb-1">Unit Price</p>
                    <p className="text-[14px] font-sora font-bold text-[#0F172A]">{inr(deal.unitPrice)}</p>
                  </div>
                  <div className="pl-4">
                    <p className="text-[10px] font-inter font-semibold text-emerald-600 uppercase tracking-[0.08em] mb-1">Total Savings</p>
                    <p className="text-[14px] font-sora font-bold text-emerald-600">↓ {inr(deal.totalSavingsVsMarket)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                  <div className="text-[11px] font-sora font-semibold text-pink-600 bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <Boxes size={14} /> +{deal.extraQuantityGained} Extra Units
                  </div>
                  <button className="h-9 px-4 bg-slate-900 text-white rounded-lg text-[13px] font-inter font-semibold hover:bg-slate-800 transition-colors shadow-md">Apply</button>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-500 font-inter text-[14px]">No bulk volume deals found strictly better than your current selection.</div>
            )}
          </div>
        </FloatingSurface>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION 3: SUPPLIER DATA GRID & PROGRESS BARS
───────────────────────────────────────────── */
const COL_HEADERS = [
  { label: '#', w: 'w-[60px]' },
  { label: 'Supplier', w: 'w-[280px]' },
  { label: 'Location & Min Qty', w: 'w-[180px]' },
  { label: 'Your Need', w: 'w-[180px]' },
  { label: 'Market Position', w: 'w-[240px]' },
  { label: 'Bulk Deal', w: 'w-[160px]' },
  { label: 'Trust & Stock', w: 'w-[180px]' },
  { label: 'Actions', w: 'w-[160px] text-right' },
];

function SupplierRow({ supplier, rank, qty, onSelect }) {
  const isGreen = supplier.isCheaperThanAverage;
  const pct = Math.min(100, supplier.percentageDifference || 0);
  
  return (
    <motion.tr className="group relative hover:bg-slate-50 transition-all border-b border-slate-100 last:border-b-0 whitespace-nowrap z-10 hover:z-20 h-[96px] bg-white">
      <td className="py-2 pl-8 pr-4 align-middle">
        <span className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white text-[12px] font-sora font-bold text-slate-500 flex items-center justify-center transition-colors shadow-sm">{rank}</span>
      </td>
      <td className="py-2 px-4 align-middle">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-sora font-bold text-[13px] flex items-center justify-center shadow-md shrink-0">{supplier.initials}</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="font-sora font-semibold text-[14px] text-slate-900">{supplier.businessName}</span>
              {supplier.verified && <ShieldCheck size={14} className="text-emerald-500" />}
            </div>
            {supplier.badge && <span className="inline-block px-2 py-0.5 rounded text-[9px] font-sora font-bold uppercase tracking-[0.10em] bg-pink-50 text-pink-600 border border-pink-100 w-max">{supplier.badge}</span>}
          </div>
        </div>
      </td>
      <td className="py-2 px-4 align-middle border-l border-slate-100">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-[12px] font-inter text-slate-500"><MapPin size={12} className="text-slate-400" /> {supplier.location}</span>
          <span className="text-[11px] font-inter font-semibold text-slate-400 uppercase tracking-[0.08em] mt-1">Min {supplier.moq} {supplier.moqUnit} @ {inr(supplier.moqPrice)}</span>
        </div>
      </td>
      <td className="py-2 px-4 align-middle bg-slate-50/50">
        <div className="flex flex-col">
          <span className="text-[10px] font-inter font-semibold text-slate-500 uppercase tracking-[0.08em] mb-1">Price for {qty} Units</span>
          <span className="text-[16px] font-sora font-[800] text-slate-900 tabular-nums">{inr(supplier.calculatedUnitPrice)}</span>
          <span className="text-[12px] font-inter text-slate-500 mt-0.5 font-medium">Total: {inr(supplier.calculatedTotalPrice)}</span>
        </div>
      </td>

      {/* STRICT MATH PROGRESS BAR SECTION */}
      <td className="py-2 px-4 align-middle border-r border-slate-100">
        <div className="flex flex-col w-[200px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[11px] font-sora font-bold uppercase tracking-[0.05em] ${isGreen ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isGreen ? `Save ${inr(supplier.priceDifferenceFromAverage)}` : `Higher by ${inr(supplier.priceDifferenceFromAverage)}`}
            </span>
            <span className={`text-[11px] font-sora font-bold ${isGreen ? 'text-emerald-600' : 'text-rose-600'}`}>{isGreen ? '-' : '+'}{supplier.percentageDifference}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }} className={`h-full ${isGreen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </div>
          <span className="text-[10px] font-inter text-slate-400 mt-1.5">vs Market Average</span>
        </div>
      </td>

      <td className="py-2 px-4 align-middle border-r border-slate-100">
        {supplier.bulkQty && supplier.bulkPrice ? (
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-inter font-semibold text-slate-500 uppercase tracking-[0.08em] mb-1">Buy {supplier.bulkQty}+ @ {inr(supplier.bulkPrice)}</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-sora font-bold uppercase tracking-[0.08em] bg-emerald-50 border-emerald-100 text-emerald-600">Save {inr(supplier.bulkSavingsAmount)}</span>
          </div>
        ) : <span className="text-[11px] font-inter font-semibold text-slate-400 uppercase tracking-[0.08em]">No Bulk Deal</span>}
      </td>
      <td className="py-2 px-4 align-middle">
        <div className="flex items-center gap-4">
          <ScoreRing score={supplier.trustScore} size={36} />
          <div className="flex flex-col">
            <span className="flex items-center gap-1 text-[12px] font-sora font-bold text-slate-900"><Star size={10} className="fill-yellow-500 text-yellow-500"/> {supplier.rating}</span>
            <span className={`text-[12px] font-inter font-medium mt-1 ${supplier.availableStock < 100 ? 'text-orange-500' : 'text-slate-600'}`}>{supplier.availableStock} Stock</span>
          </div>
        </div>
      </td>
      <td className="py-2 pl-4 pr-8 align-middle text-right">
        <div className="flex items-center justify-end gap-2">
          <SecondaryButton onClick={() => onSelect(supplier)} className="h-9 px-3 rounded-lg text-[12px] shadow-sm">View <ExternalLink size={12} className="ml-1 text-slate-400" /></SecondaryButton>
        </div>
      </td>
    </motion.tr>
  );
}

function SupplierTable({ qty, onSelect, suppliers }) {
  const [searchValue, setSearchValue] = useState("");
  const FILTER_OPTS = ['Location', 'Rating', 'Trust Score', 'Price', 'In Stock'];

  if (!suppliers || suppliers.length === 0) return <div className="p-8 text-center text-slate-500 font-inter">No verified suppliers currently offer this quantity. Please adjust your request.</div>;

  return (
    <motion.div className="bg-white border border-slate-200 rounded-[24px] shadow-sm flex flex-col w-full overflow-hidden mb-16">
      <div className="px-6 pt-6 md:px-8 md:pt-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] md:text-[22px] font-sora font-bold text-slate-900 tracking-[-0.02em] leading-[1.3]">Compare Verified Suppliers</h2>
          <p className="text-[14px] font-inter text-slate-500 mt-1.5 max-w-2xl leading-[1.6]">Review live quotes, trust scores, and dynamic pricing based on your required volume.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm shrink-0">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span className="text-[12px] font-sora font-bold uppercase tracking-[0.08em] text-slate-900">{suppliers.length} Verified</span>
        </div>
      </div>

      <div className="px-6 md:px-8 mt-6 w-full flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative w-full lg:w-[320px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search supplier..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="w-full h-11 rounded-xl bg-slate-50 pl-11 pr-4 text-[13px] font-inter outline-none border border-slate-200 focus:border-slate-400 focus:bg-white transition-all shadow-sm" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 lg:pb-0">
          {FILTER_OPTS.map(f => (
            <button key={f} className="flex items-center gap-1.5 h-10 px-3 rounded-lg text-[12px] font-inter font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm shrink-0">{f} <ChevronDown size={14} className="text-slate-400" /></button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto mt-6 border-t border-slate-200">
        <table className="w-full text-left border-collapse min-w-[1400px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {COL_HEADERS.map((h, i) => <th key={h.label} className={`py-4 px-4 ${i===0?'pl-8':''} ${i===COL_HEADERS.length-1?'pr-8':''} text-[11px] font-inter font-bold uppercase tracking-[0.08em] text-slate-500 ${h.w}`}>{h.label}</th>)}
            </tr>
          </thead>
          <tbody className="bg-white">
            {suppliers.filter(s => s.businessName.toLowerCase().includes(searchValue.toLowerCase())).map((s, i) => (
              <SupplierRow key={s.id} supplier={s} rank={i + 1} qty={qty} onSelect={onSelect} />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SUPPLIER DRAWER MODAL
───────────────────────────────────────────── */
function SupplierDrawer({ supplier, onClose }) {
  if (!supplier) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex justify-end">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative w-full max-w-[450px] bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="text-[18px] font-sora font-bold text-slate-900">Supplier Profile</h2>
            <button onClick={onClose} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 shadow-sm"><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-sora font-bold text-[18px] flex items-center justify-center shadow-lg">{supplier.initials}</div>
              <div>
                <h3 className="text-[20px] font-sora font-bold text-slate-900 leading-tight">{supplier.businessName}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="flex items-center gap-1 text-[12px] font-medium text-slate-500"><MapPin size={12}/> {supplier.location}</span>
                  {supplier.verified && <span className="flex items-center gap-1 text-[12px] font-bold text-emerald-600"><ShieldCheck size={14}/> Verified</span>}
                </div>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-[12px] font-inter font-semibold uppercase tracking-[0.08em] text-slate-500">Calculated Unit Price</span>
                <span className="text-[20px] font-sora font-bold text-slate-900">{inr(supplier.calculatedUnitPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-inter font-semibold uppercase tracking-[0.08em] text-slate-500">Base MOQ</span>
                <span className="text-[14px] font-sora font-bold text-slate-900">{supplier.moq} {supplier.moqUnit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-inter font-semibold uppercase tracking-[0.08em] text-slate-500">Stock Available</span>
                <span className="text-[14px] font-sora font-bold text-slate-900">{supplier.availableStock} Units</span>
              </div>
            </div>
            {supplier.bulkQty && supplier.bulkPrice && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div className="flex flex-col"><span className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.08em]">Bulk Deal Active</span><span className="text-[14px] font-sora font-bold text-emerald-900">{supplier.bulkQty}+ Units @ {inr(supplier.bulkPrice)}</span></div>
                <span className="text-[12px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">Save {inr(supplier.bulkSavingsAmount)}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 rounded-xl"><span className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.08em] mb-1">Trust Score</span><ScoreRing score={supplier.trustScore} size={40}/></div>
              <div className="p-4 border border-slate-200 rounded-xl"><span className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.08em] mb-1">Rating</span><span className="text-[18px] font-sora font-bold text-slate-900 flex items-center gap-1.5"><Star size={16} className="fill-yellow-500 text-yellow-500"/> {supplier.rating}</span></div>
            </div>
          </div>
          <div className="p-6 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
            <button className="col-span-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-[13px] flex justify-center items-center gap-2 hover:bg-slate-50"><MessageCircle size={16}/> Message</button>
            <button className="col-span-1 py-3 rounded-xl bg-slate-900 text-white font-semibold text-[13px] flex justify-center items-center gap-2 hover:bg-slate-800"><Phone size={16}/> Call</button>
            <button className="col-span-2 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-[13px] flex justify-center items-center hover:bg-slate-50">View Full Profile</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   SECTION 4: NEGOTIATION CRM (Global Enquiry)
───────────────────────────────────────────── */
function NegotiationCRM({ qty, metrics, masterProductId, onShowToast }) {
  const [negQty, setNegQty] = useState(qty);
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => { setNegQty(qty); }, [qty]);

  async function handleSend() {
    if (!price || !masterProductId) return;
    setIsSending(true);
    try {
      await compareApi.submitEnquiry({ masterProductId: masterProductId, requestedQuantity: negQty, targetPrice: Number(price), message: msg });
      onShowToast("Success: Negotiation Request Broadcasted!", "success");
      setPrice(""); setMsg("");
    } catch (e) {
      onShowToast("Error: Failed to send request. Try again.", "error");
    } finally {
      setIsSending(false);
    }
  }

  const inputCls = "w-full h-[52px] px-5 rounded-xl bg-white border border-slate-200 outline-none text-[14px] font-inter text-slate-900 placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all shadow-sm";

  return (
    <motion.section initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5}} className="w-full mx-auto pb-16">
      <FloatingSurface className="relative overflow-hidden p-8 md:p-10 border border-slate-200 bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: C.gradientCTA }} />
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-100 border border-pink-200 mb-4 text-[11px] font-sora font-bold uppercase tracking-[0.10em] text-pink-700 shadow-sm"><Zap size={14}/> Global Supplier Negotiation</div>
            <h2 className="text-[24px] font-sora font-bold text-slate-900 leading-tight">Request Custom Quote</h2>
            <p className="mt-2 text-[14px] font-inter text-slate-500">Broadcast your target price to all verified suppliers. No commitment until accepted.</p>
          </div>
          <div className="w-full lg:w-[380px] p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.08em] font-bold text-slate-400 mb-1">Product Subject</p>
            <h3 className="text-[16px] font-sora font-bold text-slate-900">{metrics?.productName || "Product"}</h3>
            <div className="flex items-center gap-3 mt-3">
              <span className="px-3 py-1.5 rounded bg-slate-50 border border-slate-100 text-[12px] font-bold text-slate-700">Qty: {negQty}</span>
              <span className="px-3 py-1.5 rounded bg-slate-50 border border-slate-100 text-[12px] font-bold text-slate-700">Avg Market: {inr(metrics?.averagePrice)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[12px] font-bold text-slate-600 uppercase tracking-[0.08em] mb-2">Required Quantity</label>
            <div className="relative">
              <input type="number" value={negQty} onChange={(e)=>setNegQty(e.target.value)} className={inputCls} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-slate-400">Units</span>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-slate-600 uppercase tracking-[0.08em] mb-2">Target Price / Unit (INR)</label>
            <input type="number" value={price} onChange={(e)=>setPrice(e.target.value)} placeholder={`e.g. Below ${inr(metrics?.bestPrice)}`} className={inputCls} />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-[12px] font-bold text-slate-600 uppercase tracking-[0.08em] mb-2">Message To Suppliers</label>
          <textarea rows={4} value={msg} onChange={(e)=>setMsg(e.target.value)} placeholder="Mention specific delivery requirements, payment terms, or customizations..." className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 outline-none text-[14px] font-inter text-slate-900 placeholder:text-slate-400 resize-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all shadow-sm" />
        </div>
        <div className="mt-8 flex items-center gap-4">
          <GradientButton onClick={handleSend} disabled={isSending} className="px-8 py-3.5 text-[14px] shadow-lg">
            {isSending ? <Loader2 size={18} className="animate-spin mr-2" /> : <ArrowRight size={18} className="mr-2" />}
            {isSending ? "Broadcasting..." : "Broadcast Negotiation Request"}
          </GradientButton>
        </div>
      </FloatingSurface>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE WRAPPER
───────────────────────────────────────────── */
function useQuery() { return new URLSearchParams(useLocation().search); }

export default function ComparePrice() {
  const query = useQuery();
  const navigate = useNavigate();
  
  const masterProductId = query.get("productId");
  const initialQty = parseInt(query.get("qty") || "50", 10);

  const [qty, setQty] = useState(initialQty);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // The Search Modal opens by default if no product is selected
  const [searchModalOpen, setSearchModalOpen] = useState(!masterProductId);
  
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [errorPopup, setErrorPopup] = useState({ show: false, message: "" });

  useEffect(() => {
    if (!masterProductId) { setSearchModalOpen(true); setIsLoading(false); } 
    else { setSearchModalOpen(false); }
  }, [masterProductId]);

  useEffect(() => {
    if (!masterProductId) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await compareApi.getCompareData(masterProductId, qty);
        setData(res.data);
      } catch (e) {
        console.error("Failed to load compare data", e);
        showToast("Error loading market data.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    const debounce = setTimeout(fetchData, 400); 
    return () => clearTimeout(debounce);
  }, [masterProductId, qty]);

  const handleProductSearch = (newProductId, newQty) => {
    setSearchModalOpen(false);
    setQty(newQty);
    navigate(`?productId=${newProductId}&qty=${newQty}`);
  };

  const showToast = (message, type) => setToast({ show: true, message, type });
  const showErrorPopup = (message) => setErrorPopup({ show: true, message });

  // EMPTY STATE / LOADING
  if (!masterProductId && !searchModalOpen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <SearchCode size={48} className="text-slate-300 mb-4" />
        <h2 className="text-[20px] font-sora font-bold text-slate-800 mb-2">No Product Selected</h2>
        <button onClick={() => setSearchModalOpen(true)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[14px] font-semibold hover:bg-slate-800 shadow-md transition-all">Search Products to Compare</button>
      </div>
    );
  }

  if (isLoading && !data && masterProductId) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="w-10 h-10 animate-spin text-slate-900" /></div>;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: typographyStyles }} />
      
      <AnimatePresence>
        {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      </AnimatePresence>

      <AnimatePresence>
        {errorPopup.show && <ErrorPopup isOpen={errorPopup.show} message={errorPopup.message} onClose={() => setErrorPopup({ show: false, message: "" })} />}
      </AnimatePresence>

      <div className="min-h-screen font-inter antialiased selection:bg-pink-100 selection:text-pink-900 flex flex-col w-full overflow-x-hidden relative">
        <ProductSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} onSearch={handleProductSearch} />

        {masterProductId && data && (
          <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-[1440px] mx-auto sm:px-4 lg:px-6 space-y-6 pt-4">
            
            <ProductHeader qty={qty} setQty={setQty} metrics={data.headerMetrics} boundaries={data.marketBoundaries} onNewSearch={() => setSearchModalOpen(true)} onShowError={showErrorPopup} />

            <AiPurchaseIntelligence topSupplier={data.suppliers?.[0]} aiDeals={data.aiVolumeDeals} qty={qty} />

            <SupplierTable onSelect={setSelectedSupplier} qty={qty} suppliers={data.suppliers} />
          
            <NegotiationCRM qty={qty} metrics={data.headerMetrics} masterProductId={masterProductId} onShowToast={showToast} />
            
          </motion.main>
        )}

        <SupplierDrawer supplier={selectedSupplier} onClose={() => setSelectedSupplier(null)} />
      </div>
    </>
  );
}