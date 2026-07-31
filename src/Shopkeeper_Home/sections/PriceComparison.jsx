import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Phone, ChevronDown, AlertCircle } from 'lucide-react';
import { SectionHead } from '../../Layout/common';
import { compareApi } from '../Services/api';
import { CTA_GRAD, C, FONT_MONO } from '../../Layout/common/constants';
import Surf from '../../assets/SurfExcel.jpg'; // Fallback/Placeholder image

export default function PriceComparison() {
  const [showMore, setShowMore] = useState(false);
  const [highlightData, setHighlightData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchHighlight = async () => {
      try {
        setIsLoading(true);
        const data = await compareApi.getDashboardHighlight();
        if (isMounted) setHighlightData(data);
      } catch (err) {
        if (isMounted) setError("Failed to load price comparisons.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchHighlight();
    return () => { isMounted = false; };
  }, []);

  // Show up to 5 suppliers by default, or all if expanded (capped at 10 for dashboard)
  const suppliers = highlightData?.suppliers || [];
  const displaySuppliers = showMore ? suppliers.slice(0, 10) : suppliers.slice(0, 5);
  const header = highlightData?.headerMetrics;

  return (
    <section className="mb-8">
      <SectionHead title="Compare Supplier Prices" sub="Find the best wholesale deal instantly" action="View All" />

      <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor: C.sub, boxShadow: "0 15px 40px rgba(15,23,42,.06)" }}>
        <AnimatePresence mode="wait">
          
          {/* LOADING STATE */}
          {isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 flex flex-col xl:flex-row gap-4 animate-pulse">
              <div className="w-full xl:w-[270px] shrink-0 rounded-2xl border bg-slate-50 p-3 h-48" style={{ borderColor: C.sub }}>
                <div className="w-full h-full bg-slate-200 rounded-xl" />
              </div>
              <div className="flex-1 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded-xl w-full" />
                ))}
              </div>
            </motion.div>
          )}

          {/* ERROR STATE */}
          {!isLoading && error && (
            <motion.div key="error" className="p-10 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </motion.div>
          )}

          {/* SUCCESS STATE */}
          {!isLoading && !error && highlightData && (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 sm:p-4 lg:p-5 flex flex-col xl:flex-row gap-4">
              
              {/* LEFT SIDE: PRODUCT DETAILS */}
              <div className="w-full xl:w-[270px] shrink-0 rounded-2xl border bg-slate-50/70 p-3" style={{ borderColor: C.sub }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center overflow-hidden shrink-0 xl:w-full xl:h-40" style={{ borderColor: C.sub }}>
                    <img src={Surf} alt={header?.productName} className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition" />
                  </div>
                  <div className="xl:hidden flex-1 min-w-0">
                    <h3 className="text-xs font-semibold truncate" style={{ color: C.head }}>{header?.productName}</h3>
                    <p className="text-[10px]" style={{ color: C.muted }}>{header?.category}</p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[10px] line-through" style={{ color: C.muted }}>₹{header?.marketAverageTotal?.toFixed(2)}</span>
                      <span className="text-[10px] font-semibold" style={{ color: "#FF2D7A" }}>Save ₹{header?.totalSavings?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="hidden xl:block">
                  <h3 className="text-sm font-semibold mt-3" style={{ color: C.head }}>{header?.productName}</h3>
                  <p className="text-[11px]" style={{ color: C.muted }}>{header?.category} · {header?.supplierCount} Suppliers Active</p>
                  <div className="mt-3 pt-3 border-t flex justify-between" style={{ borderColor: C.sub }}>
                    <div>
                      <p className="text-[9px]" style={{ color: C.muted }}>Market Average</p>
                      <p className="text-xs font-bold text-gray-400 line-through">₹{header?.marketAverageTotal?.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px]" style={{ color: C.muted }}>You Save</p>
                      <p className="text-xs font-bold" style={{ color: "#FF2D7A" }}>₹{header?.totalSavings?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: SELLERS TABLE */}
              <div className="flex-1 min-w-0">
                <div className="hidden md:grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-bold uppercase" style={{ color: C.muted }}>
                  <div className="col-span-5">Supplier</div>
                  <div className="col-span-2 text-center">MOQ</div>
                  <div className="col-span-2 text-center">Location</div>
                  <div className="col-span-1 text-center">Price</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>

                <div className="overflow-x-auto custom-scroll pb-2">
                  <div className="min-w-[720px] space-y-2">
                    {displaySuppliers.map((s, i) => {
                      // First item is the best price based on backend sorting
                      const isBest = i === 0; 
                      return (
                        <motion.div 
                          key={s.id} 
                          initial={{ opacity: 0, y: 8 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: i * .03 }}
                          className="grid grid-cols-12 items-center gap-2 px-3 py-2 rounded-xl border hover:shadow-lg transition"
                          style={{ borderColor: isBest ? "#10B981" : C.sub, background: isBest ? "linear-gradient(90deg,#F0FDFA,#fff)" : "white" }}
                        >
                          <div className="col-span-5 flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: "linear-gradient(135deg,#38BDF8,#EC4899,#FB7185)" }}>
                              {s.initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-semibold truncate" style={{ color: C.head }}>{s.businessName}</p>
                                {isBest && <span className="text-[8px] font-bold px-1.5 py-[1px] rounded bg-emerald-500 text-white">BEST</span>}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3" fill="#FBBF24" color="#FBBF24" />
                                <span className="text-[10px]" style={{ color: C.muted }}>{s.rating} ({s.trustScore}% Trust)</span>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-2 text-center text-xs font-medium text-slate-600">{s.moq} {s.unit}</div>
                          <div className="col-span-2 text-center text-xs text-slate-500 truncate">{s.locationDistrict}</div>
                          <div className="col-span-1 text-center">
                            <span className="text-sm font-bold" style={{ color: isBest ? "#10B981" : C.head, fontFamily: FONT_MONO }}>
                              ₹{s.basePricePerUnit?.toFixed(2)}
                            </span>
                          </div>

                          <div className="col-span-2 flex justify-end gap-1.5">
                            <button className="p-1.5 rounded-lg border hover:bg-slate-50 transition" style={{ borderColor: C.sub }}>
                              <MessageSquare className="w-3.5 h-3.5" color={C.muted} />
                            </button>
                            <button className="p-1.5 rounded-lg border hover:bg-slate-50 transition" style={{ borderColor: C.sub }}>
                              <Phone className="w-3.5 h-3.5" color={C.muted} />
                            </button>
                            <button className="px-3 py-1.5 rounded text-[11px] font-bold text-white whitespace-nowrap hover:opacity-90 active:scale-95 transition" style={{ background: CTA_GRAD }}>
                              Order Now
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {suppliers.length > 5 && (
                  <button onClick={() => setShowMore(!showMore)} className="mt-3 w-full py-2 rounded-xl border text-xs font-semibold hover:bg-slate-50 transition" style={{ borderColor: C.sub, color: C.muted }}>
                    {showMore ? "Show Less Suppliers" : `View ${suppliers.length - 5} More Suppliers`}
                    <ChevronDown className={`inline ml-1 w-3.5 h-3.5 transition-transform ${showMore ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { height: 1px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #f472b6; border-radius: 20px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll { scrollbar-width: thin; }
      `}</style>
    </section>
  );
}