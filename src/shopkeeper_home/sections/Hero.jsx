import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Package, LayoutGrid, Store, ChevronRight, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { C, EASE } from '../../layout/common/constants';
import HeroImges from '../../assets/Store.png';
import { dashboardApi } from '../Services/api';
// ADDED: Import AuthContext
import { useAuth } from '../../auth/context/AuthContext';

export default function Hero({ onError }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // ADDED: Consume global profileData
  const { profileData } = useAuth();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ products: [], categories: [], sellers: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative w-full mb-2 sm:mb-6 md:mb-8 z-20 flex"
    >
      <div className="relative w-full md:h-[260px] lg:h-[280px] md:bg-white md:rounded-[24px] lg:rounded-[32px] md:border border-slate-200 md:shadow-[0_8px_30px_rgba(15,23,42,0.04)] overflow-visible flex">
        
        <div className="hidden md:flex absolute right-0 top-0 w-[45%] h-full items-center justify-center p-3 sm:p-4 z-0 pointer-events-none overflow-hidden rounded-r-[24px] lg:rounded-r-[32px]">
          <motion.img 
            initial={{ scale: 1.05, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 1, ease: EASE }} 
            src={HeroImges} 
            alt="Platform UI" 
            className="w-full h-full object-cover object-center rounded-[16px] lg:rounded-[20px] shadow-sm" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none" />
        </div>

        <div className="relative z-30 flex h-full w-full pointer-events-none px-2 sm:px-4 md:px-8 lg:px-8 py-4 sm:py-2 md:py-0">
          
          <div className="w-full md:w-[65%] lg:w-[55%] h-full flex flex-col justify-center pointer-events-auto">
            
            <h1 className="text-[23px] xs:text-[24px] sm:text-[28px] md:text-[30px] lg:text-[25px] xl:text-[36px] font-sora font-bold text-slate-900 leading-tight flex items-center flex-wrap gap-x-1.5 sm:gap-x-2">
              Welcome back,
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                {/* USE CONTEXT DATA HERE */}
                {profileData?.ownerName || 'Loading...'}
              </span>
              <span className="text-black inline-block origin-bottom-right hover:animate-[wave_1s_ease-in-out_infinite]">👋</span>
            </h1>

            <p className="mt-1 sm:mt-1.5 md:mt-2.5 text-[13px] sm:text-[13px] md:text-[14px] lg:text-[15px] text-slate-500 font-inter font-medium leading-relaxed max-w-[95%] md:max-w-[480px]">
                Discover verified Wholesaler, Compare prices instanstly, and track order and grow your business           </p>

            <div className="relative mt-5 sm:mt-6 md:mt-7 w-full max-w-full md:max-w-[480px] lg:max-w-[550px] z-50" ref={dropdownRef}>
              <motion.div 
                whileHover={{ y: -1 }} 
                className={`flex items-center w-full h-[44px] sm:h-[52px] md:h-[56px] rounded-[14px] sm:rounded-full bg-white border shadow-[0_4px_20px_rgb(0,0,0,0.05)] transition-all duration-300 relative z-50 ${showDropdown ? 'border-pink-300 ring-4 ring-pink-500/10' : 'border-slate-200 hover:border-pink-200'}`}
              >
                <Search className="ml-3 sm:ml-5 w-4 h-4 sm:w-[18px] sm:h-[18px] text-slate-400 shrink-0" strokeWidth={2.5}/>
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => { if (query.trim().length >= 2 && (results.products.length > 0 || results.categories.length > 0 || results.sellers.length > 0)) setShowDropdown(true); }}
                  placeholder="Search products, brands, suppliers..." 
                  className="flex-1 h-full px-2.5 sm:px-3 bg-transparent font-inter text-[13px] sm:text-[14px] font-medium text-slate-800 placeholder:text-slate-400 outline-none border-none focus:ring-0 w-full"
                />
                
                {isSearching ? (
                  <Loader2 className="mr-3 sm:mr-4 w-4 h-4 sm:w-5 sm:h-5 text-pink-400 animate-spin shrink-0" />
                ) : (
                  <div className="flex items-center gap-1.5 sm:gap-2 mr-2 shrink-0">
                    <button className="p-2 text-slate-400 hover:text-pink-500 transition-colors hidden xs:block">
                      <Camera size={16} strokeWidth={2.5} />
                    </button>
                    <button 
                      className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] md:w-[44px] md:h-[44px] rounded-[10px] sm:rounded-full flex items-center justify-center text-white transition-transform duration-300 hover:scale-105 active:scale-95 shadow-sm" 
                      style={{ background: "linear-gradient(135deg, #EC4899, #F43F5E)" }}
                    >
                      <Search size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              </motion.div>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -5 }} 
                    transition={{ duration: 0.2 }}
                    className="absolute top-[calc(100%+8px)] left-0 w-full bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[16px] sm:rounded-[20px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden z-[100] flex flex-col"
                    style={{ maxHeight: '320px' }}
                  >
                    <div className="overflow-y-auto custom-scrollbar p-1.5 sm:p-2 space-y-1">
                      <style dangerouslySetInnerHTML={{__html: `
                        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                        @keyframes wave { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-10deg); } 75% { transform: rotate(15deg); } }
                      `}} />

                      {results.products.length > 0 && (
                        <div className="mb-1 sm:mb-2">
                          <div className="px-3 py-1.5 text-[9px] sm:text-[10px] font-inter font-bold tracking-widest text-slate-400 uppercase">Products</div>
                          {results.products.map(p => (
                            <button key={`prod-${p.id}`} onClick={() => handleProductClick(p)} className="w-full flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-[10px] sm:rounded-xl hover:bg-slate-50 transition-colors group">
                              <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors"><Package size={14} /></div>
                                <span className="font-sora text-[12px] sm:text-[13px] font-semibold text-slate-700 group-hover:text-pink-600 transition-colors truncate">{p.name}</span>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}

                      {results.categories.length > 0 && (
                        <div className="mb-1 sm:mb-2">
                          <div className="px-3 py-1.5 text-[9px] sm:text-[10px] font-inter font-bold tracking-widest text-slate-400 uppercase">Categories</div>
                          {results.categories.map(c => (
                            <button key={`cat-${c.id}`} onClick={() => handleCategoryClick(c.parentCategoryId)} className="w-full flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-[10px] sm:rounded-xl hover:bg-slate-50 transition-colors group">
                              <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors"><LayoutGrid size={14} /></div>
                                <div className="text-left overflow-hidden">
                                  <span className="block font-sora text-[12px] sm:text-[13px] font-semibold text-slate-700 group-hover:text-pink-600 transition-colors truncate">{c.name}</span>
                                  <span className="block font-inter text-[9px] sm:text-[10px] font-medium text-slate-400">{c.type === 'SUBCATEGORY' ? 'Sub-Category' : 'Main Category'}</span>
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}

                      {results.sellers.length > 0 && (
                        <div>
                          <div className="px-3 py-1.5 text-[9px] sm:text-[10px] font-inter font-bold tracking-widest text-slate-400 uppercase">Suppliers</div>
                          {results.sellers.map(s => (
                            <button key={`sel-${s.businessProfileId}`} onClick={() => handleSellerClick(s.businessProfileId)} className="w-full flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-[10px] sm:rounded-xl hover:bg-slate-50 transition-colors group">
                              <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors"><Store size={14} /></div>
                                <div className="text-left overflow-hidden">
                                  <span className="block font-sora text-[12px] sm:text-[13px] font-semibold text-slate-700 group-hover:text-pink-600 transition-colors truncate">{s.businessName}</span>
                                  <span className="block font-inter text-[9px] sm:text-[10px] font-medium text-slate-400 truncate">{s.location}</span>
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
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
      </div>
    </motion.section>
  );
}