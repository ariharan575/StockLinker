import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { SectionHead } from '../common';
import { compareApi } from '../Services/api';
import { CTA_GRAD, C, FONT_MONO } from '../common/constants';
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
    <section className="mb-8">
      <SectionHead 
        title="Today's Market Prices" 
        sub="Live bulk pricing on top-moving goods" 
        action="View All" 
      />

      <AnimatePresence mode="wait">
        {/* Loading Skeletons */}
        {isLoading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-xl" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                    <div className="h-2 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {[...Array(3)].map((_, j) => <div key={j} className="h-8 bg-slate-100 rounded-xl" />)}
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-slate-200 rounded flex-1" />
                  <div className="h-8 bg-slate-200 rounded flex-1" />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <motion.div key="error" className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-2xl border border-red-100">
            <AlertCircle className="w-6 h-6 text-red-400 mb-2" />
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && featuredProducts.length === 0 && (
          <motion.div key="empty" className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl border border-dashed border-slate-200">
            <TrendingUp className="w-8 h-8 text-slate-300 mb-3" />
            <p className="text-sm font-semibold text-slate-700">Analyzing Market Prices...</p>
            <p className="text-xs text-slate-400 mt-1">Check back soon for today's top deals.</p>
          </motion.div>
        )}

        {/* Success Render */}
        {!isLoading && !error && featuredProducts.length > 0 && (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((p, i) => (
              <motion.div
                key={p.masterProductId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6, scale: 1.015, boxShadow: "0 22px 50px rgba(15,23,42,0.12)" }}
                className="bg-white rounded-2xl p-4 border border-slate-100 transition-all duration-200 hover:border-slate-200"
                style={{ boxShadow: "0 8px 30px rgba(15,23,42,0.06)" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm shrink-0">
                    <img src={Surf} alt={p.productName} className="w-full h-full object-contain p-1 mix-blend-multiply" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight truncate text-slate-800" title={p.productName}>
                      {p.productName}
                    </p>
                    <p className="text-[11px] mt-1 text-slate-500 font-medium">{p.brand}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {p.suppliers.map((s, pi) => (
                    <div
                      key={pi}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all"
                      style={{
                        backgroundColor: s.best ? "#F0FDF4" : "#F8FAFC",
                        borderColor: s.best ? "#22c55e40" : "#E5E7EB"
                      }}
                    >
                      <span className="text-[11px] font-semibold text-slate-600 truncate max-w-[120px]">
                        {s.name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-bold" style={{ color: s.best ? C.green : C.head, fontFamily: FONT_MONO }}>
                          ₹{s.price.toFixed(2)}
                        </span>
                        {s.best && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm" style={{ background: CTA_GRAD, color: "#fff" }}>
                            BEST
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCompareClick(p.masterProductId)}
                    className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold rounded-lg text-white transition-all shadow-sm hover:opacity-90 active:scale-95" 
                    style={{ background: CTA_GRAD }}
                  >
                    Compare Market
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}