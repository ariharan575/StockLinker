import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Phone, ChevronDown, AlertCircle } from 'lucide-react';
import { SectionHead } from '../../Layout/common';
import { compareApi } from '../Services/api';
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
    // HIDDEN ON MOBILE (< 640px) as requested
    <section className="hidden sm:block mb-8 md:mb-10 w-full px-1 sm:px-2 md:px-3">
      <SectionHead title="Compare Supplier Prices" sub="Find the best wholesale deal instantly" action="View All" />

      <div className="bg-white rounded-[20px] lg:rounded-[24px] border border-slate-200 overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <AnimatePresence mode="wait">
          
          {/* LOADING STATE */}
          {isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 lg:p-6 flex flex-col xl:flex-row gap-5 lg:gap-6 animate-pulse">
              <div className="w-full xl:w-[280px] shrink-0 rounded-[20px] border border-slate-200 bg-slate-50 p-4 h-48 flex items-center justify-center">
                <div className="w-full h-full bg-slate-200/60 rounded-[16px]" />
              </div>
              <div className="flex-1 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded-[16px] w-full" />
                ))}
              </div>
            </motion.div>
          )}

          {/* ERROR STATE */}
          {!isLoading && error && (
            <motion.div key="error" className="p-12 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-12 h-12 text-rose-400 mb-4" />
              <p className="text-[15px] font-sora font-semibold text-rose-600">{error}</p>
            </motion.div>
          )}

          {/* SUCCESS STATE */}
          {!isLoading && !error && highlightData && (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 lg:p-6 flex flex-col xl:flex-row gap-5 lg:gap-6">
              
              {/* LEFT SIDE: PRODUCT DETAILS */}
              <div className="w-full xl:w-[280px] shrink-0 rounded-[20px] border border-slate-200 bg-slate-50/50 p-4 lg:p-5 flex flex-col justify-between">
                <div className="flex items-center xl:flex-col gap-4 xl:gap-0">
                  <div className="w-24 h-24 xl:w-full xl:h-44 rounded-[16px] bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-3">
                    <img src={Surf} alt={header?.productName} className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300" />
                  </div>
                  
                  <div className="flex-1 xl:w-full xl:mt-4 min-w-0">
                    <h3 className="text-[16px] font-sora font-bold text-slate-900 truncate leading-tight mb-1">{header?.productName}</h3>
                    <p className="text-[12px] font-inter text-slate-500 font-medium truncate">{header?.category} <span className="hidden xl:inline">· {header?.supplierCount} Suppliers Active</span></p>
                    
                    {/* Tablet Only Quick Pricing */}
                    <div className="flex xl:hidden flex-wrap items-center gap-2 mt-2">
                      <span className="text-[12px] font-inter font-medium text-slate-400 line-through">₹{header?.marketAverageTotal?.toFixed(2)}</span>
                      <span className="text-[12px] font-sora font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-[6px] border border-emerald-100">Save ₹{header?.totalSavings?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Desktop Only Detailed Pricing */}
                <div className="hidden xl:block mt-5 pt-5 border-t border-slate-200">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-1">Market Avg</span>
                      <span className="text-[14px] font-sora font-bold text-slate-400 line-through decoration-slate-300">₹{header?.marketAverageTotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] font-inter font-bold text-emerald-600 uppercase tracking-widest mb-1">You Save</span>
                      <span className="text-[18px] font-sora font-extrabold text-emerald-600 leading-none">₹{header?.totalSavings?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: SELLERS LIST */}
              <div className="flex-1 min-w-0 flex flex-col">
                
                {/* Desktop Header Row (Prevents Overlap using minmax constraints) */}
                <div className="hidden lg:grid grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)_auto] gap-4 px-5 py-2 text-[11px] font-inter font-bold uppercase tracking-widest text-slate-400">
                  <div>Supplier Profile</div>
                  <div className="text-center">Min Order</div>
                  <div className="text-center">Location</div>
                  <div className="text-center">Price</div>
                  <div className="text-right w-[120px]">Action</div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  {displaySuppliers.map((s, i) => {
                    const isBest = i === 0; // First item is Best Price
                    return (
                      <motion.div 
                        key={s.id}
                        initial={{ opacity: 0, y: 8 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: i * .03 }}
                        // Responsive Layout: Flex-wrap for tablet (1-2 rows max), Strict Grid for Desktop
                        className={`flex flex-wrap lg:grid lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)_auto] items-center gap-3 lg:gap-4 px-4 lg:px-5 py-3.5 rounded-[16px] border transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-[1px] ${isBest ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-white hover:border-pink-200'}`}
                      >
                        
                        {/* 1. Supplier Profile */}
                        <div className="flex items-center gap-3 w-full lg:w-auto lg:min-w-0 flex-1 lg:flex-none overflow-hidden pr-2">
                          <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-[10px] lg:rounded-[12px] flex items-center justify-center text-[14px] lg:text-[15px] font-sora font-bold text-white shrink-0 shadow-sm bg-slate-900">
                            {s.initials}
                          </div>
                          <div className="flex flex-col overflow-hidden w-full">
                            <div className="flex items-center gap-2">
                              <p className="text-[14px] font-sora font-bold text-slate-900 truncate">{s.businessName}</p>
                              {isBest && <span className="text-[9px] font-sora font-bold px-1.5 py-[2px] rounded-[4px] bg-emerald-100 text-emerald-700 uppercase tracking-widest shrink-0">Best</span>}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Star className="w-3.5 h-3.5" fill="#FBBF24" color="#FBBF24" />
                              <span className="text-[11px] font-inter font-medium text-slate-500">{s.rating} <span className="text-slate-300 mx-0.5">•</span> {s.trustScore}% Trust</span>
                            </div>
                          </div>
                        </div>

                        {/* 2. Min Order */}
                        <div className="flex flex-col lg:block w-[45%] sm:w-auto lg:text-center text-[13px] font-inter font-semibold text-slate-700">
                          <span className="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Min Order</span>
                          <span className="bg-slate-50 py-1 px-2.5 rounded-[8px] border border-slate-100 whitespace-nowrap">{s.moq} {s.unit}</span>
                        </div>
                        
                        {/* 3. Location */}
                        <div className="flex flex-col lg:block w-[45%] sm:w-auto lg:text-center text-[13px] font-inter font-medium text-slate-600 truncate px-0 lg:px-2">
                          <span className="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Location</span>
                          <span className="truncate block">{s.locationDistrict}</span>
                        </div>
                        
                        {/* 4. Price */}
                        <div className="flex flex-col lg:block w-full sm:w-auto lg:text-center mt-1 lg:mt-0">
                          <span className="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Price</span>
                          <span className={`text-[15px] font-sora font-bold ${isBest ? "text-emerald-600" : "text-slate-900"}`}>
                            ₹{s.basePricePerUnit?.toFixed(2)}
                          </span>
                        </div>

                        {/* 5. Actions (Solid Black Button as requested) */}
                        <div className="flex justify-end items-center gap-2 w-full sm:w-auto lg:w-[120px] mt-2 lg:mt-0 shrink-0">
                          <button className="p-2.5 lg:p-2 rounded-[8px] border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm active:scale-95">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button className="p-2.5 lg:p-2 rounded-[8px] border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm active:scale-95 hidden lg:block">
                            <Phone className="w-4 h-4" />
                          </button>
                          <button className="px-5 lg:px-4 py-2.5 lg:py-2 rounded-[8px] text-[12px] font-sora font-bold text-white bg-slate-900 hover:bg-black whitespace-nowrap shadow-md hover:-translate-y-[1px] active:scale-95 transition-all">
                            Order
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Show More Button */}
                {suppliers.length > 5 && (
                  <button 
                    onClick={() => setShowMore(!showMore)} 
                    className="mt-4 w-full py-3 rounded-[14px] border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[13px] font-sora font-bold text-slate-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {showMore ? "Show Less Suppliers" : `View ${suppliers.length - 5} More Suppliers`}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showMore ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}