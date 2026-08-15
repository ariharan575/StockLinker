import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query'; 
import { SectionHead } from '../../Layout/common';
import { compareApi } from '../Services/api';
import Surf from '../../assets/SurfExcel.jpg';

// ============================================================
// ✅ PREMIUM SKELETON LOADER
// ============================================================
const FeaturedSkeleton = () => (
  <div className="w-[220px] xs:w-[240px] sm:w-[260px] md:w-[280px] shrink-0 bg-white rounded-[16px] p-3 border border-slate-100 shadow-sm animate-pulse flex flex-col h-full">
    <div className="flex gap-2.5 mb-3">
      <div className="w-10 h-10 bg-slate-200/80 rounded-[8px]" />
      <div className="flex-1 space-y-1.5 py-0.5">
        <div className="h-3.5 bg-slate-200/80 rounded-md w-3/4" />
        <div className="h-2.5 bg-slate-100 rounded-md w-1/2" />
      </div>
    </div>
    <div className="space-y-1.5 mb-3 flex-1">
      {[...Array(3)].map((_, j) => <div key={j} className="h-7 bg-slate-100 rounded-[6px]" />)}
    </div>
    <div className="h-9 bg-slate-200/80 rounded-[8px] w-full" />
  </div>
);

export default function FeaturedComparisons({ onError }) {
  const navigate = useNavigate();

  // ✅ TANSTACK QUERY INTEGRATION (Extracting 'error' object now)
  const { 
    data: featuredProducts = [], 
    isLoading, 
    isError,
    error 
  } = useQuery({
    queryKey: ['homeFeaturedComparisons'],
    queryFn: async () => {
      return await compareApi.getFeaturedComparisons();
    },
    staleTime: 5 * 60 * 1000, // Keep fresh for 5 minutes
  });

  useEffect(() => {
    if (isError && onError) {
      onError(error);
    }
  }, [isError, error, onError]);

  const handleCompareClick = (masterProductId) => {
    navigate('/Compare', { state: { masterProductId: masterProductId, requestedQty: 10 } });
  };

  return (
    <section className="mb-6 sm:mb-8 md:mb-10 w-full overflow-hidden">
      
      <div className="px-1 sm:px-2 md:px-3">
        <SectionHead 
          title="Today's Best Deals" 
          sub="Live bulk pricing on top-moving goods" 
          action="View All" 
          actionPath="/compare"
        />
      </div>

      <AnimatePresence mode="wait">
        
        {isLoading && (
          <motion.div 
            key="loading" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="flex flex-row overflow-x-auto no-scrollbar gap-2.5 sm:gap-3 md:gap-4 px-1 sm:px-2 md:px-3 pb-5 pt-1"
          >
            {[...Array(5)].map((_, i) => <FeaturedSkeleton key={i} />)}
          </motion.div>
        )}

        {/* ✅ WORLD-CLASS SAAS EMPTY STATE */}
        {!isLoading && featuredProducts.length === 0 && !isError && (
          <motion.div 
            key="empty" 
            className="mx-1 sm:mx-2 md:mx-3 my-2 flex flex-col items-center justify-center p-12 bg-gradient-to-b from-white to-slate-50 rounded-[24px] border border-slate-200 shadow-sm relative overflow-hidden text-center"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-20" />
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-4 relative">
              <div className="absolute inset-0 bg-slate-100/50 rounded-2xl animate-pulse" />
              <TrendingUp className="w-8 h-8 text-slate-300 relative z-10" />
            </div>
            <p className="text-[16px] sm:text-[18px] font-sora font-extrabold text-slate-800 tracking-tight mb-1">Analyzing Market Prices...</p>
            <p className="text-[13px] font-inter text-slate-500">Check back soon for today's top wholesale deals.</p>
          </motion.div>
        )}

        {/* SUCCESS RENDER */}
        {!isLoading && featuredProducts.length > 0 && (
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

                <button 
                  onClick={() => handleCompareClick(p.masterProductId)}
                  className="w-full py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-sora bg-slate-900 font-bold rounded-[8px] sm:rounded-[10px] text-white shadow-sm hover:shadow-md transition-all"
                >
                  Compare price
                </button>

              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}