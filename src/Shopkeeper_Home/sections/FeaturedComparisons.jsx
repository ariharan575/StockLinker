import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { SectionHead } from '../../Layout/common';
import { compareApi } from '../Services/api';
import Surf from '../../assets/SurfExcel.jpg'; // Placeholder image

export default function FeaturedComparisons() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        const data = await compareApi.getFeaturedComparisons();
        if (isMounted) setFeaturedProducts(data);
      } catch (err) {
        if (isMounted) setError("Failed to load today's market comparisons.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchFeatured();
    return () => { isMounted = false; };
  }, []);

  const handleCompareClick = (masterProductId) => {
    // Navigates to the detailed compare page silently passing the ID
    navigate('/Compare', { state: { masterProductId: masterProductId, requestedQty: 10 } });
  };

  return (
    <section className="mb-6 sm:mb-8 md:mb-10 w-full overflow-hidden">
      
      {/* SECTION HEADER */}
      <div className="px-1 sm:px-2 md:px-3">
        <SectionHead 
          title="Today's Best Deals" 
          sub="Live bulk pricing on top-moving goods" 
          action="View All" 
        />
      </div>

      <AnimatePresence mode="wait">
        
        {/* LOADING SKELETONS (Single Row Horizontal) */}
        {isLoading && (
          <motion.div 
            key="loading" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="flex flex-row overflow-x-auto no-scrollbar gap-2.5 sm:gap-3 md:gap-4 px-1 sm:px-2 md:px-3 pb-5 pt-1"
          >
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-[220px] xs:w-[240px] sm:w-[260px] md:w-[280px] shrink-0 bg-white rounded-[16px] p-3 border border-slate-100 shadow-sm animate-pulse"
              >
                <div className="flex gap-2.5 mb-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-[8px]" />
                  <div className="flex-1 space-y-1.5 py-0.5">
                    <div className="h-2.5 bg-slate-200 rounded w-3/4" />
                    <div className="h-2 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-1.5 mb-3">
                  {[...Array(3)].map((_, j) => <div key={j} className="h-7 bg-slate-100 rounded-[6px]" />)}
                </div>
                <div className="h-8 bg-slate-200 rounded-[8px] w-full" />
              </div>
            ))}
          </motion.div>
        )}

        {/* ERROR STATE */}
        {!isLoading && error && (
          <motion.div 
            key="error" 
            className="mx-1 sm:mx-2 md:mx-3 my-2 flex flex-col items-center justify-center p-6 bg-rose-50 rounded-[16px] border border-rose-100"
          >
            <AlertCircle className="w-8 h-8 text-rose-400 mb-2" />
            <p className="text-[12px] sm:text-[13px] font-sora font-semibold text-rose-600">{error}</p>
          </motion.div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !error && featuredProducts.length === 0 && (
          <motion.div 
            key="empty" 
            className="mx-1 sm:mx-2 md:mx-3 my-2 flex flex-col items-center justify-center p-8 bg-white rounded-[16px] border-2 border-dashed border-slate-200 shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-[13px] sm:text-[15px] font-sora font-bold text-slate-800">Analyzing Market Prices...</p>
            <p className="text-[11px] sm:text-[12px] font-inter text-slate-500 mt-1">Check back soon for today's top deals.</p>
          </motion.div>
        )}

        {/* SUCCESS RENDER (Single Row Horizontal Carousel - ALL DEVICES) */}
        {!isLoading && !error && featuredProducts.length > 0 && (
          <motion.div 
            key="content" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-row flex-nowrap overflow-x-auto no-scrollbar gap-2.5 sm:gap-3 md:gap-4 px-1 sm:px-2 md:px-3 pb-5 pt-1"
          >
            {featuredProducts.map((p, i) => (
              <motion.div
                key={p.masterProductId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="w-[220px] xs:w-[240px] sm:w-[260px] md:w-[280px] shrink-0 bg-white rounded-[16px] p-3 border border-slate-200 shadow-sm hover:shadow-[0_12px_24px_-6px_rgba(15,23,42,0.08)] hover:border-pink-200 transition-all duration-300 flex flex-col"
              >
                
                {/* 1. Product Header (Ultra Compact) */}
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[8px] sm:rounded-[10px] overflow-hidden flex items-center justify-center bg-slate-50 border border-slate-100 shrink-0">
                    <img src={Surf} alt={p.productName} className="w-full h-full object-contain p-1.5 mix-blend-multiply" />
                  </div>
                  <div className="flex-col min-w-0">
                    <h3 className="text-[12px] sm:text-[14px] font-sora font-bold leading-tight truncate text-slate-900" title={p.productName}>
                      {p.productName}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-inter mt-0.5 text-slate-500 font-medium truncate">{p.brand}</p>
                  </div>
                </div>

                {/* 2. Suppliers Comparison List (Thin Rows) */}
                <div className="flex flex-col gap-1.5 mb-3 flex-1">
                  {p.suppliers.map((s, pi) => (
                    <div
                      key={pi}
                      className={`flex items-center justify-between px-2.5 py-1.5 sm:py-2 rounded-[8px] border transition-colors ${
                        s.best ? 'bg-emerald-50/60 border-emerald-100' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <span className="text-[10px] sm:text-[11px] font-inter font-medium text-slate-700 truncate max-w-[100px] sm:max-w-[120px]">
                        {s.name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* BEST Badge next to price as seen in reference image */}
                        <span className={`text-[11px] sm:text-[12px] font-sora font-bold ${s.best ? 'text-emerald-600' : 'text-slate-900'}`}>
                          ₹{s.price.toFixed(2)}
                        </span>
                        {s.best && (
                          <span className="text-[7px] sm:text-[8px] font-sora font-bold px-1 py-[1.5px] rounded-[4px] bg-emerald-100 text-emerald-700 tracking-wider">
                            BEST
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3. Action Button */}
                <button 
                  onClick={() => handleCompareClick(p.masterProductId)}
                  className="w-full py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-sora bg-slate-900 font-bold rounded-[8px] sm:rounded-[10px] text-white shadow-sm hover:shadow-md transition-all"
                  style={{ background: "" }}
                >
                  Compare price
                </button>

              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global utility to hide scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}