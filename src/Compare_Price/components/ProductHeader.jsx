import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Search, ShieldCheck, BarChart3, Wallet, CheckCircle2 } from 'lucide-react';
import { inr } from '../config/constants';

export default function ProductHeader({ qty, setQty, metrics, boundaries, onNewSearch, onShowError }) {
  const [localQty, setLocalQty] = useState(qty);

  useEffect(() => { setLocalQty(qty); }, [qty]);

  const handleQtySubmit = (newQty) => {
    if (!newQty || isNaN(newQty) || newQty < 1) { 
      setLocalQty(qty); 
      return; 
    }
    if (boundaries?.maxAvailableStock > 0 && newQty > boundaries.maxAvailableStock) {
      onShowError(`No single seller has ${newQty} quantity available. The maximum available stock is ${boundaries.maxAvailableStock}. Please reduce your quantity.`);
      setLocalQty(qty); 
    } else if (boundaries?.absoluteMinMoq > 0 && newQty < boundaries.absoluteMinMoq) {
      onShowError(`The minimum order quantity required by sellers for this product is ${boundaries.absoluteMinMoq}. Please increase your quantity.`);
      setLocalQty(qty); 
    } else {
      setQty(newQty); 
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleQtySubmit(parseInt(localQty, 10)); };
  const handleBlur = () => handleQtySubmit(parseInt(localQty, 10));
  const stepQty = (step) => handleQtySubmit(parseInt(localQty, 10) + step);

  return (
    <motion.section 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }} 
      className="w-full mt-2 mb-6"
    >
      {/* 
        MAIN CONTAINER 
        Mobile: No border, no shadow, transparent/white bg to maximize space
        Tablet/Desktop (sm/md+): Rounded card, tight borders, subtle shadow 
      */}
      <div className="flex flex-col md:flex-row bg-white sm:rounded-[16px] sm:border sm:border-slate-200 sm:shadow-sm overflow-hidden w-full">
        
        {/* =========================================
            LEFT COLUMN: PRODUCT DETAILS 
            Tablet: 70% Width | Desktop: 75% Width
            ========================================= */}
        <div className="w-full md:w-[70%] lg:w-[75%] p-3 sm:p-5 lg:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
          
          {/* Top: Badges & Title */}
          <div className="mb-4 sm:mb-5">
            {/* Badges container - tightly packed */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
              {/* Live Market */}
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-[6px] text-[9px] sm:text-[10px] font-sora font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/70 uppercase tracking-[0.05em]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Market
              </span>
              
              {/* NEW: Verified Suppliers */}
              <span className="flex items-center gap-1 px-2 py-1 rounded-[6px] text-[9px] sm:text-[10px] font-sora font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/70 uppercase tracking-[0.05em]">
                <CheckCircle2 size={12} className="text-emerald-500" />
                {metrics?.supplierCount || 0} Verified Suppliers
              </span>

              {/* Best Price Detected */}
              <span className="flex items-center gap-1 px-2 py-1 rounded-[6px] bg-slate-50 border border-slate-100 text-slate-600 text-[9px] sm:text-[10px] font-sora font-bold uppercase tracking-[0.05em]">
                <TrendingDown size={12} className="text-slate-500" /> Best price detected
              </span>
            </div>
            
            <h1 className="text-[18px] sm:text-[22px] lg:text-[24px] font-sora font-bold tracking-[-0.02em] text-[#0F172A] leading-tight mb-2 sm:mb-3">
              {metrics?.productName || "Loading Product..."}
            </h1>
            
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-500 text-[10px] sm:text-[11px] font-inter font-semibold rounded-md">
                ID: {metrics?.masterProductId?.substring(0,8).toUpperCase() || "N/A"}
              </span>
              <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-500 text-[10px] sm:text-[11px] font-inter font-semibold rounded-md">
                Category: {metrics?.category || "General"}
              </span>
            </div>
          </div>

          {/* Middle: 4 Data Boxes - STRICTLY 1 ROW EVERYWHERE */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-3 mb-4 sm:mb-5">
            {/* Box 1: Suppliers */}
            <div className="p-2 sm:p-3 lg:p-4 rounded-[8px] sm:rounded-[12px] bg-slate-50 border border-slate-200 flex flex-col justify-center sm:justify-between hover:-translate-y-0.5 transition-transform duration-200 group overflow-hidden">
              <div className="flex items-center gap-1.5 mb-1 sm:mb-2">
                <ShieldCheck size={14} className="text-slate-400 group-hover:text-slate-600 shrink-0 hidden sm:block" />
                <span className="text-[8px] sm:text-[10px] lg:text-[11px] font-inter font-bold text-slate-500 uppercase tracking-tight sm:tracking-[0.08em] truncate">Suppliers</span>
              </div>
              <span className="text-[12px] sm:text-[16px] lg:text-[20px] font-sora font-bold text-[#0F172A] truncate leading-none">
                {metrics?.supplierCount || 0}
              </span>
            </div>

            {/* Box 2: Best Price */}
            <div className="p-2 sm:p-3 lg:p-4 rounded-[8px] sm:rounded-[12px] bg-pink-50/50 border border-pink-100 flex flex-col justify-center sm:justify-between hover:-translate-y-0.5 transition-transform duration-200 group overflow-hidden">
              <div className="flex items-center gap-1.5 mb-1 sm:mb-2">
                <TrendingDown size={14} className="text-pink-500 shrink-0 hidden sm:block" />
                <span className="text-[8px] sm:text-[10px] lg:text-[11px] font-inter font-bold text-pink-700 uppercase tracking-tight sm:tracking-[0.08em] truncate">Best Price</span>
              </div>
              <span className="text-[12px] sm:text-[16px] lg:text-[20px] font-sora font-[800] text-[#0F172A] truncate leading-none">
                {inr(metrics?.bestPriceTotal)}
              </span>
            </div>

            {/* Box 3: Market Avg */}
            <div className="p-2 sm:p-3 lg:p-4 rounded-[8px] sm:rounded-[12px] bg-slate-50 border border-slate-200 flex flex-col justify-center sm:justify-between hover:-translate-y-0.5 transition-transform duration-200 group overflow-hidden">
              <div className="flex items-center gap-1.5 mb-1 sm:mb-2">
                <BarChart3 size={14} className="text-slate-400 group-hover:text-slate-600 shrink-0 hidden sm:block" />
                <span className="text-[8px] sm:text-[10px] lg:text-[11px] font-inter font-bold text-slate-500 uppercase tracking-tight sm:tracking-[0.08em] truncate">Market Avg</span>
              </div>
              <span className="text-[12px] sm:text-[16px] lg:text-[20px] font-sora font-bold text-[#0F172A] truncate leading-none">
                {inr(metrics?.marketAverageTotal)}
              </span>
            </div>

            {/* Box 4: Total Savings */}
            <div className="p-2 sm:p-3 lg:p-4 rounded-[8px] sm:rounded-[12px] bg-emerald-50/50 border border-emerald-100 flex flex-col justify-center sm:justify-between hover:-translate-y-0.5 transition-transform duration-200 group overflow-hidden">
              <div className="flex items-center gap-1.5 mb-1 sm:mb-2">
                <Wallet size={14} className="text-emerald-500 shrink-0 hidden sm:block" />
                <span className="text-[8px] sm:text-[10px] lg:text-[11px] font-inter font-bold text-emerald-700 uppercase tracking-tight sm:tracking-[0.08em] truncate">Savings</span>
              </div>
              <span className="text-[12px] sm:text-[16px] lg:text-[20px] font-sora font-[800] text-emerald-600 truncate leading-none">
                {inr(metrics?.totalSavings)}
              </span>
            </div>
          </div>

          {/* Bottom: Quantity Controls & Mobile Search */}
          <div className="pt-3 sm:pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mt-auto">
            <div className="flex flex-row items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
              <div className="hidden xs:block">
                <p className="text-[10px] sm:text-[11px] font-inter font-bold text-slate-500 uppercase tracking-[0.08em] mb-0.5">Requested Need</p>
                <p className="text-[11px] font-inter text-slate-400 font-medium leading-tight">Strict constraints</p>
              </div>
              
              {/* Compact Premium Quantity Input */}
              <div className="flex items-center h-[38px] sm:h-[42px] rounded-[10px] bg-white border border-slate-200 shadow-sm overflow-hidden shrink-0 w-full xs:w-auto focus-within:border-pink-300 focus-within:ring-1 focus-within:ring-pink-100 transition-all">
                <button 
                  onClick={() => stepQty(-1)} 
                  className="w-10 sm:w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-sora font-bold border-r border-slate-200 transition-colors text-[16px]"
                >
                  −
                </button>
                <input 
                  type="number" 
                  value={localQty} 
                  onChange={(e) => setLocalQty(e.target.value)} 
                  onKeyDown={handleKeyDown} 
                  onBlur={handleBlur} 
                  className="w-16 sm:w-20 h-full text-center font-sora font-[800] text-[13px] sm:text-[14px] text-[#0F172A] outline-none bg-transparent" 
                />
                <button 
                  onClick={() => stepQty(1)} 
                  className="w-10 sm:w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-sora font-bold border-l border-slate-200 transition-colors text-[16px]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Mobile-only Search Button (Hidden on Tablet/Desktop) */}
            <button 
              onClick={onNewSearch} 
              className="flex md:hidden items-center justify-center w-full sm:w-auto gap-2 px-4 py-2.5 rounded-[10px] bg-slate-900 text-white text-[12px] font-sora font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Search size={14} /> New Search
            </button>
          </div>
        </div>


        {/* =========================================
            RIGHT COLUMN: SUPPLIER MATRIX 
            Tablet: 30% Width | Desktop: 25% Width
            Hidden on Mobile, Shown on Tablet & Desktop
            ========================================= */}
        <div className="hidden md:flex flex-col md:w-[30%] lg:w-[25%] p-4 lg:p-6 bg-slate-50/50 relative">
          
          {/* Top Right: Search Button */}
          <div className="flex justify-end mb-5">
            <button 
              onClick={onNewSearch} 
              className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] bg-white text-slate-600 text-[11px] font-sora font-semibold hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200 shadow-sm"
            >
              <Search size={14} /> New Search
            </button>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="mb-3">
              <h3 className="text-[13px] font-sora font-bold text-slate-900 flex items-center gap-1.5">
                Supplier Matrix
              </h3>
              <p className="text-[11px] font-inter text-slate-500 mt-0.5">
                Top sellers vs Market Average
              </p>
            </div>

            <div className="w-full bg-white p-3 lg:p-4 rounded-[12px] border border-slate-200 shadow-sm flex flex-col gap-4">
              {metrics?.top3Matrix && metrics.top3Matrix.length > 0 ? metrics.top3Matrix.map((matrix, idx) => {
                const isCheaper = matrix.comparisonStatus === 'CHEAPER';
                const isHigher = matrix.comparisonStatus === 'HIGHER';
                
                const barColor = isCheaper ? 'bg-emerald-500' : isHigher ? 'bg-rose-500' : 'bg-slate-800';
                const textColor = isCheaper ? 'text-emerald-600' : isHigher ? 'text-rose-600' : 'text-slate-700';
                const bgColor = isCheaper ? 'bg-emerald-50' : isHigher ? 'bg-rose-50' : 'bg-slate-100';
                
                return (
                  <div key={idx} className="w-full group">
                    <div className="flex items-end justify-between mb-1.5">
                      <span className="text-[10px] lg:text-[11px] font-sora font-semibold text-[#0F172A] truncate max-w-[100px] lg:max-w-[120px] pr-2">
                        {matrix.businessName}
                      </span>
                      <span className={`text-[8px] lg:text-[9px] font-sora font-bold px-1.5 py-0.5 rounded-[4px] ${bgColor} ${textColor} border ${isCheaper ? 'border-emerald-100' : isHigher ? 'border-rose-100' : 'border-slate-200'}`}>
                        {isCheaper ? `Save ${inr(matrix.differenceFromAverage)}` : isHigher ? `+${inr(matrix.differenceFromAverage)}` : 'Avg Price'}
                      </span>
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${Math.min(100, matrix.percentageDifference)}%` }} 
                        transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.15 }} 
                        className={`h-full ${barColor}`} 
                      />
                    </div>
                  </div>
                );
              }) : (
                <div className="py-4 flex flex-col items-center justify-center text-center">
                  <BarChart3 size={20} className="text-slate-300 mb-2" />
                  <p className="text-[10px] font-inter font-medium text-slate-400">No matrix data available.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.section>
  );
}