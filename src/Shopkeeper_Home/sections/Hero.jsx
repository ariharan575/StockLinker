import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Package, LayoutGrid, Store, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { C, EASE } from '../common/constants';
import HeroImges from '../../assets/Store.png';
import { dashboardApi } from '../services/api';

export default function Hero() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // States
  const [ownerName, setOwnerName] = useState("Loading...");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ products: [], categories: [], sellers: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch Welcome Name on Mount
  useEffect(() => {
    let isMounted = true;
    const fetchWelcome = async () => {
      try {
        const data = await dashboardApi.getWelcomeInfo();
        if (isMounted) setOwnerName(data.ownerName || "Welcome");
      } catch (err) {
        if (isMounted) setOwnerName("Partner");
      }
    };
    fetchWelcome();
    return () => { isMounted = false; };
  }, []);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Omni-Search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ products: [], categories: [], sellers: [] });
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await dashboardApi.globalSearch(query);
        setResults(data);
        if (data.products.length > 0 || data.categories.length > 0 || data.sellers.length > 0) {
          setShowDropdown(true);
        } else {
          setShowDropdown(false);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Routing Handlers
  const handleProductClick = (product) => {
    setShowDropdown(false);
    navigate('/Compare', { state: { openModal: true, selectedProduct: { id: product.id, name: product.name } } });
  };

  const handleCategoryClick = (parentCategoryId) => {
    setShowDropdown(false);
    navigate('/category', { state: { selectedCategoryId: parentCategoryId } });
  };

  const handleSellerClick = (businessProfileId) => {
    setShowDropdown(false);
    navigate(`/storefront/${businessProfileId}`);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      // FIX: Removed overflow-hidden from the main container so the dropdown can escape!
      className="relative w-full mb-8 z-20"
      style={{ height: "320px" }}
    >
      {/* BACKGROUND LAYER: Handles the rounded corners and gradients securely */}
      <div className="absolute inset-0 w-full h-full bg-white rounded-[24px] lg:rounded-[32px] border border-[#F1F1F4] overflow-hidden" style={{ boxShadow: "0 30px 70px rgba(15,23,42,0.06)" }}>
        {/* Premium Aura Gradients */}
        <div className="absolute -top-40 -right-20 w-[450px] h-[450px] rounded-full blur-[100px] opacity-[0.12] pointer-events-none z-0" style={{ background: "#FF4D8D" }} />
        <div className="absolute -bottom-32 -left-20 w-[350px] h-[350px] rounded-full blur-[100px] opacity-[0.10] pointer-events-none z-0" style={{ background: "#e1d6d3" }} />

        {/* RIGHT COLUMN IMAGE (Moved to background layer so it respects border radius) */}
        <div className="hidden lg:flex absolute right-0 top-0 w-[45%] h-full items-center justify-center p-3.5 z-10 pointer-events-none">
          <motion.img 
            initial={{ scale: 1.05, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 1, ease: EASE }} 
            src={HeroImges} 
            alt="StockLinker Platform" 
            className="w-full h-full object-cover object-center rounded-[24px] shadow-sm" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* FOREGROUND LAYER: Content and Search Bar (NO overflow-hidden) */}
      <div className="relative z-30 flex h-full w-full pointer-events-none">
        
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-[55%] h-full px-6 sm:px-10 lg:px-10 flex flex-col justify-center relative pointer-events-auto">
          
          {/* Typographic Hierarchy */}
          <div className="flex flex-col gap-1">
            <h2 className="text-[12px] sm:text-[13px] font-bold tracking-[0.25em] uppercase text-[#8CA3BA]">
              Welcome Back,
            </h2>
            {/* FIX: World-class premium SaaS font styling applied */}
            <h1 
              className="text-[42px] sm:text-[48px] lg:text-[54px] ps-0.5 leading-[1.05] select-none" 
              style={{ 
                fontFamily: '"Plus Jakarta Sans", "Sora", "Inter", sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.03em'
              }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF3D81] via-[#FF5C7A] to-[#FF9A5C] drop-shadow-[0_6px_18px_rgba(255,77,141,0.18)]">
                {ownerName}
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="mt-3 lg:mt-4 text-[14px] sm:text-[15px] text-[#6B7280] font-medium leading-relaxed max-w-[480px]">
            Discover verified wholesalers, compare prices instantly, and manage every purchase from one intelligent sourcing platform.
          </p>

          {/* Search Bar Container */}
          <div className="relative mt-6 w-full max-w-[500px] z-50" ref={dropdownRef}>
            <motion.div 
              whileHover={{ y: -2 }} 
              className={`flex items-center w-full h-[52px] sm:h-[56px] rounded-full bg-white border shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 overflow-hidden relative z-50 ${showDropdown ? 'border-[#FF4D8D]/50 ring-4 ring-[#FF4D8D]/10' : 'border-[#E5E7EB] hover:border-[#FF4D8D]/30'}`}
            >
              <Search className="ml-5 w-5 h-5 text-gray-400 shrink-0" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if (query.trim().length >= 2 && (results.products.length > 0 || results.categories.length > 0 || results.sellers.length > 0)) setShowDropdown(true); }}
                placeholder="Search products, suppliers, categories..." 
                className="flex-1 h-full px-3 bg-transparent text-[14px] font-medium text-gray-800 placeholder:text-gray-400 outline-none border-none focus:ring-0"
                style={{ fontFamily: '"Inter", -apple-system, sans-serif' }}
              />
              
              {isSearching ? (
                <Loader2 className="mr-4 w-5 h-5 text-pink-400 animate-spin shrink-0" />
              ) : (
                <button 
                  className="mr-1.5 w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] rounded-full flex items-center justify-center text-white transition-transform duration-300 hover:scale-105 active:scale-95 shrink-0 shadow-md" 
                  style={{ background: "linear-gradient(135deg, #FF4D8D, #FF7A59)" }}
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </motion.div>

            {/* OMNI-SEARCH DROPDOWN RESULTS (Breaks out of container perfectly now) */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }} 
                  transition={{ duration: 0.2 }}
                  className="absolute top-[calc(100%+12px)] left-0 w-full bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[20px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden z-[100] flex flex-col"
                  style={{ maxHeight: '350px' }}
                >
                  <div className="overflow-y-auto custom-scrollbar p-2 space-y-1">
                    <style dangerouslySetInnerHTML={{__html: `
                      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                      .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                    `}} />

                    {/* Products Section */}
                    {results.products.length > 0 && (
                      <div className="mb-2">
                        <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Products</div>
                        {results.products.map(p => (
                          <button key={`prod-${p.id}`} onClick={() => handleProductClick(p)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-pink-50 transition-colors group">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-pink-100/50 flex items-center justify-center text-pink-600"><Package size={14} /></div>
                              <span className="text-sm font-semibold text-slate-800 group-hover:text-pink-600 transition-colors">{p.name}</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Categories Section */}
                    {results.categories.length > 0 && (
                      <div className="mb-2">
                        <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Categories</div>
                        {results.categories.map(c => (
                          <button key={`cat-${c.id}`} onClick={() => handleCategoryClick(c.parentCategoryId)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors group">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-100/50 flex items-center justify-center text-blue-600"><LayoutGrid size={14} /></div>
                              <div className="text-left">
                                <span className="block text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{c.name}</span>
                                <span className="block text-[10px] font-medium text-slate-400">{c.type === 'SUBCATEGORY' ? 'Sub-Category' : 'Main Category'}</span>
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Sellers Section */}
                    {results.sellers.length > 0 && (
                      <div>
                        <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Wholesale Suppliers</div>
                        {results.sellers.map(s => (
                          <button key={`sel-${s.businessProfileId}`} onClick={() => handleSellerClick(s.businessProfileId)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors group">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-100/50 flex items-center justify-center text-emerald-600"><Store size={14} /></div>
                              <div className="text-left">
                                <span className="block text-sm font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">{s.businessName}</span>
                                <span className="block text-[10px] font-medium text-slate-400">{s.location}</span>
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}