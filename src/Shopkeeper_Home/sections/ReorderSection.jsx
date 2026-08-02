import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, RefreshCw, ShoppingBag } from 'lucide-react';
import { SectionHead } from '../../Layout/common';
import { orderApi } from '../Services/api';
import { fadeUp } from '../../Layout/common/constants';

export default function ReorderSection() {
  const navigate = useNavigate();
  const [reorders, setReorders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchReorders = async () => {
      try {
        setIsLoading(true);
        const data = await orderApi.getReorderSummary();
        if (isMounted) setReorders(data); // Will be empty array if orders < 3
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchReorders();
    return () => { isMounted = false; };
  }, []);

  // 🚀 UX RULE: If the user has fewer than 3 orders, hide the component entirely.
  if (!isLoading && reorders.length < 3) {
    return null;
  }

  const handleReorderClick = (businessProfileId) => {
    navigate(`/storefront/${businessProfileId}`);
  };

  const handleCompareClick = (masterProductId) => {
    if (masterProductId) {
      navigate('/Compare', { state: { masterProductId: masterProductId } });
    } else {
      navigate('/Compare'); // Fallback
    }
  };

  return (
    <section className="mb-6 sm:mb-8 md:mb-10 w-full overflow-hidden">
      
      <div className="px-1 sm:px-2 md:px-3">
        <SectionHead 
          title="Quick Reorder" 
          sub="Repeat your recent purchases instantly" 
          action="Order History" 
        />
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="flex flex-row overflow-x-auto no-scrollbar gap-3 sm:gap-4 px-1 sm:px-2 md:px-3 pb-5 pt-1"
          >
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="w-[260px] xs:w-[280px] sm:w-[300px] md:w-[320px] shrink-0 bg-white rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 border border-slate-100 animate-pulse shadow-sm h-[200px]" 
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="content" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-row overflow-x-auto no-scrollbar gap-3 sm:gap-4 px-1 sm:px-2 md:px-3 pb-6 pt-2"
          >
            {reorders.map((o, i) => {
              // Calculate difference based on the math done in the backend
              const diff = o.priceDifference;
              const isPriceDrop = diff <= 0; // Treating no change or drop as positive/neutral

              return (
                <motion.div
                  key={o.orderId}
                  {...fadeUp(i * 0.05)}
                  whileHover={{ y: -4, shadow: "0 15px 35px -5px rgba(15,23,42,0.08)" }}
                  className="w-[260px] xs:w-[280px] sm:w-[300px] md:w-[320px] shrink-0 bg-white rounded-[16px] sm:rounded-[20px] p-3.5 sm:p-5 border border-slate-200 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Order Info */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[13px] sm:text-[15px] font-sora font-bold text-slate-900 leading-none">
                          Order #{o.orderNumber.substring(o.orderNumber.length - 6)}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-inter font-medium text-slate-500 truncate max-w-[150px] sm:max-w-[180px]">
                          {o.sellerName}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-inter font-semibold rounded-[6px] bg-slate-50 border border-slate-100 text-slate-500 shrink-0">
                        {o.date}
                      </span>
                    </div>

                    {/* Item List (Ultra Compact) */}
                    <div className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 bg-slate-50/50 rounded-[8px] p-2 border border-slate-100/50">
                      {o.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 sm:gap-2">
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-inter font-medium text-slate-600 truncate">{item}</span>
                        </div>
                      ))}
                      {o.items.length > 2 && (
                        <div className="text-[9px] sm:text-[10px] font-inter font-semibold text-slate-400 pl-2.5 sm:pl-3.5 italic">
                          + {o.items.length - 2} more item{o.items.length - 2 > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    {/* Price Comparison Box */}
                    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-[10px] sm:rounded-[12px] mb-3 sm:mb-4 bg-slate-50 border border-slate-100">
                      <div className="flex-1 flex flex-col">
                        <p className="text-[9px] sm:text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-0.5">Last Price</p>
                        <p className="text-[12px] sm:text-[13px] font-sora font-semibold text-slate-500 line-through">₹{o.previousPrice?.toLocaleString()}</p>
                      </div>
                      
                      <ChevronRight size={14} className="text-slate-300 shrink-0" strokeWidth={3} />
                      
                      <div className="flex-1 flex flex-col items-end text-right">
                        <p className="text-[9px] sm:text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-0.5">Current</p>
                        <p className={`text-[13px] sm:text-[15px] font-sora font-bold leading-none ${isPriceDrop ? "text-emerald-600" : "text-rose-600"}`}>
                          ₹{o.currentPrice?.toLocaleString()}
                        </p>
                      </div>
                      
                      {/* Up/Down Pill */}
                      {diff !== 0 && (
                        <span className={`px-1.5 py-0.5 text-[9px] sm:text-[10px] font-sora font-bold rounded-[6px] ml-1 shrink-0 ${isPriceDrop ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          {isPriceDrop ? "↓" : "↑"} ₹{Math.abs(diff).toFixed(0)}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons (Solid Black SaaS Style) */}
                    <div className="flex gap-2 sm:gap-2.5">
                      <button 
                        onClick={() => handleReorderClick(o.sellerBusinessProfileId)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-sora font-bold text-white rounded-[8px] sm:rounded-[10px] bg-slate-900 hover:bg-black transition-all shadow-sm active:scale-95 whitespace-nowrap"
                      >
                        <RefreshCw size={12} strokeWidth={2.5} /> Reorder
                      </button>
                      <button 
                        onClick={() => handleCompareClick(o.masterProductId)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-sora font-semibold rounded-[8px] sm:rounded-[10px] border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-sm active:scale-95 whitespace-nowrap"
                      >
                        <ShoppingBag size={12} strokeWidth={2.5} /> Compare
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global utility to hide scrollbar completely */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}