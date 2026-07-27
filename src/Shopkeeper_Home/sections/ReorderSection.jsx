import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SectionHead } from '../common';
import { orderApi } from '../Services/api';
import { fadeUp, EASE, CTA_GRAD } from '../common/constants';

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
    <section className="mb-8 overflow-hidden">
      <SectionHead title="Quick Reorder" sub="Repeat your recent purchases instantly" action="Order History" />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-5 overflow-x-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[320px] bg-white rounded-2xl p-5 border border-slate-100 animate-pulse h-64 shadow-sm" />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="content" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hides scrollbar completely for Firefox/IE
          >
            {/* CSS to completely hide the scrollbar for Webkit (Chrome/Safari) */}
            <style dangerouslySetInnerHTML={{__html: `
              div::-webkit-scrollbar { display: none; }
            `}} />
            
            {reorders.map((o, i) => {
              // Calculate difference based on the math done in the backend
              const diff = o.priceDifference;
              const isPriceDrop = diff < 0;

              return (
                <motion.div
                  key={o.orderId}
                  {...fadeUp(i * 0.1)}
                  whileHover={{ y: -5, boxShadow: "0 22px 50px rgba(15,23,42,0.12)" }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="min-w-[320px] max-w-[350px] snap-start shrink-0 bg-white rounded-2xl p-5 border border-slate-100 transition-all flex flex-col justify-between"
                  style={{ boxShadow: "0 8px 28px rgba(15,23,42,0.06)" }}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">Order {o.orderNumber.substring(o.orderNumber.length - 6)}</span>
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 text-slate-500">{o.date}</span>
                      </div>
                      <span className="text-xs font-medium text-slate-400 truncate max-w-[120px]">{o.sellerName}</span>
                    </div>

                    {/* Item List */}
                    <div className="space-y-1.5 mb-4">
                      {o.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                          <span className="text-xs text-slate-600 truncate">{item}</span>
                        </div>
                      ))}
                      {o.items.length > 2 && (
                        <div className="text-[10px] font-medium text-slate-400 pl-3.5 italic">
                          + {o.items.length - 2} more item{o.items.length - 2 > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    {/* EXACT ORIGINAL UI FOR PRICE COMPARISON */}
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl mb-4 bg-slate-50 border border-slate-100">
                      <div className="flex-1">
                        <p className="text-xs text-slate-400">Previous Price</p>
                        <p className="text-sm font-bold text-slate-800">₹{o.previousPrice?.toLocaleString()}</p>
                      </div>
                      
                      <ChevronRight size={16} className="text-slate-400" />
                      
                      <div className="flex-1 text-right">
                        <p className="text-xs text-slate-400">Current Price</p>
                        <p className={`text-sm font-bold ${isPriceDrop ? "text-emerald-600" : "text-red-500"}`}>
                          ₹{o.currentPrice?.toLocaleString()}
                        </p>
                      </div>
                      
                      {/* Original Up/Down Pill */}
                      {diff !== 0 && (
                        <span className={`px-2 py-1 text-xs font-bold rounded-xl ${isPriceDrop ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                          {isPriceDrop ? "↓" : "↑"} ₹{Math.abs(diff).toFixed(0)}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <motion.button 
                        onClick={() => handleReorderClick(o.sellerBusinessProfileId)}
                        whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.25 }}
                        className="flex-1 py-2.5 text-sm font-bold text-white rounded cursor-pointer shadow-sm" style={{ background: CTA_GRAD }}>
                        Reorder Now
                      </motion.button>
                      <motion.button 
                        onClick={() => handleCompareClick(o.masterProductId)}
                        whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.25 }}
                        className="flex-1 py-2.5 text-sm font-semibold rounded cursor-pointer border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                        Compare Prices
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}