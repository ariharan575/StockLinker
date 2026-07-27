import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, X, Package, ArrowRight, Minus, Plus, Loader2, SearchCode, AlertTriangle } from 'lucide-react';
import { compareApi } from '../Services/api';
import { GradientButton } from './SharedComponents';

export default function ProductSearchModal({ isOpen, onClose, onSearch }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(50);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState("");
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. FIX: Grab the product from the Hero search safely without causing a wipeout loop
  useEffect(() => {
    if (location.state?.selectedProduct) {
      const p = location.state.selectedProduct;
      setSelectedProduct(p);
      setQuery(p.name); // This fills the input field!
      setQuantity(50);
      
      // Safely remove it from router history so it doesn't trigger again on page refresh
      const newState = { ...location.state };
      delete newState.selectedProduct;
      delete newState.openModal;
      navigate(location.pathname, { replace: true, state: newState });
    }
  }, [location.state, location.pathname, navigate]);

  // 2. FIX: ONLY clear the form when the modal actually closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSelectedProduct(null);
      setQuantity(50);
      setShowDropdown(false);
      setErrorMessage("");
    }
  }, [isOpen]);

  // Debounced Search Logic
  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); setShowDropdown(false); return; }
    if (selectedProduct && selectedProduct.name === query) return;

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await compareApi.searchMasterProducts(query);
        setResults(response.data || []);
        setShowDropdown(true);
      } catch (error) { console.error(error); } finally { setIsSearching(false); }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query, selectedProduct]);

  const handleSelectProduct = (product) => { 
    setSelectedProduct(product); 
    setQuery(product.name); 
    setShowDropdown(false); 
    setErrorMessage(""); 
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value) || 0);
    setErrorMessage(""); 
  };
  
  const handleAnalyze = async () => { 
    if (!selectedProduct || quantity < 1) return;
    setIsSearching(true);
    setErrorMessage("");
    
    try {
      const res = await compareApi.getCompareData(selectedProduct.id, quantity);
      const data = res.data;
      
      if (!data.suppliers || data.suppliers.length === 0) {
        let msg = "No sellers currently offer this product.";
        if (data.marketBoundaries) {
          if (quantity < data.marketBoundaries.absoluteMinMoq) {
             msg = `Minimum order quantity required is ${data.marketBoundaries.absoluteMinMoq}. Please increase your quantity.`;
          }
          else if (quantity > data.marketBoundaries.maxAvailableStock) {
             msg = `No single seller has ${quantity} units. The max available stock is ${data.marketBoundaries.maxAvailableStock}.`;
          }
        }
        setErrorMessage(msg);
        return;
      }
      
      onSearch(selectedProduct.id, quantity);
    } catch (e) {
      const msg = e.response?.data?.message || "No valid sellers available for this quantity. Please adjust your request.";
      setErrorMessage(msg);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-[500px] bg-white rounded-[24px] shadow-2xl flex flex-col overflow-visible font-inter z-10">
          
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[24px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white shadow-sm"><SearchCode size={20} /></div>
              <div>
                <h2 className="text-[18px] font-sora font-bold text-[#0F172A] leading-tight">Procurement Search</h2>
                <p className="text-[12px] font-inter text-slate-500">Find products to compare market prices</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-lg transition-colors"><X size={18} /></button>
          </div>

          <div className="px-6 py-6 space-y-6">
            <div className="relative" ref={dropdownRef}>
              <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-2">1. Select Master Product</label>
              <div className={`relative flex items-center w-full h-[52px] rounded-[14px] border ${showDropdown ? 'border-pink-500 ring-2 ring-pink-500/10' : 'border-slate-200'} bg-white px-4 transition-all`}>
                <Search size={18} className="text-[#94A3B8] mr-3" />
                <input 
                  type="text" 
                  placeholder="Search product name..." 
                  value={query} 
                  onChange={(e) => { setQuery(e.target.value); setSelectedProduct(null); setErrorMessage(""); }} 
                  className="w-full h-full outline-none text-[14px] text-[#0F172A] placeholder:text-slate-400 font-medium" 
                />
                {isSearching && <Loader2 size={16} className="text-slate-400 animate-spin ml-2" />}
              </div>
              <AnimatePresence>
                {showDropdown && results.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-200 rounded-[14px] shadow-xl overflow-hidden z-50 max-h-[220px] overflow-y-auto custom-scrollbar">
                    {results.map((product) => (
                      <button key={product.id} onClick={() => handleSelectProduct(product)} className="w-full text-left px-4 py-3 text-[14px] font-medium text-[#0F172A] hover:bg-slate-50 hover:text-pink-600 border-b border-slate-100 last:border-b-0 transition-colors">
                        {product.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={`transition-opacity duration-300 ${selectedProduct ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-2">2. Required Quantity</label>
              <div className="flex items-center w-full h-[52px] rounded-[14px] border border-slate-200 bg-white px-2">
                <button onClick={() => { setQuantity(Math.max(1, quantity - 1)); setErrorMessage(""); }} className="w-10 h-10 flex items-center justify-center rounded-[10px] text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"><Minus size={18} /></button>
                <div className="flex-1 flex items-center justify-center px-3 border-x border-slate-100 mx-2 h-full">
                  <Package size={16} className="text-[#94A3B8] mr-2" />
                  <input type="number" value={quantity} onChange={handleQuantityChange} className="w-full outline-none text-center text-[15px] font-semibold text-[#0F172A]" />
                  <span className="text-[13px] text-[#94A3B8] ml-2 font-medium">Units</span>
                </div>
                <button onClick={() => { setQuantity(quantity + 1); setErrorMessage(""); }} className="w-10 h-10 flex items-center justify-center rounded-[10px] text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"><Plus size={18} /></button>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-5 border-t border-slate-100 bg-slate-50 flex flex-col gap-4 rounded-b-[24px]">
            {errorMessage && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-600">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <span className="text-[13px] font-medium leading-tight">{errorMessage}</span>
              </motion.div>
            )}

            <div className="flex items-center justify-end gap-3 w-full">
              <button onClick={onClose} className="px-6 py-2.5 rounded-[12px] bg-white border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-100 transition-colors shadow-sm">Cancel</button>
              
              <GradientButton onClick={handleAnalyze} disabled={!selectedProduct || isSearching} className="px-8 py-2.5 rounded-[12px] text-[13px]">
                {isSearching ? <Loader2 size={16} className="animate-spin mr-2"/> : "Analyze Market Prices"} 
                {!isSearching && <ArrowRight size={16} className="ml-2" />}
              </GradientButton>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}