import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Search, ShieldCheck, BarChart3, Wallet } from 'lucide-react';
import { inr } from '../config/constants';

export default function ProductHeader({ qty, setQty, metrics, boundaries, onNewSearch, onShowError }) {
  const [localQty, setLocalQty] = useState(qty);

  useEffect(() => { setLocalQty(qty); }, [qty]);

  const handleQtySubmit = (newQty) => {
    if (!newQty || isNaN(newQty) || newQty < 1) { setLocalQty(qty); return; }
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
    <motion.section initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="mb-6 w-full mt-4">
      <div className="flex flex-col xl:flex-row bg-[#FFFFFF] rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex-1 p-5 xl:p-8 flex flex-col">
          
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-3 text-[12px] font-inter font-medium text-slate-500 mb-4">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[10px] font-sora font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 uppercase tracking-[0.10em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" /> Live Market
                </span>
                <span className="text-slate-300 shrink-0">•</span>
                <span className="flex items-center gap-1.5 shrink-0 text-slate-900"><TrendingDown size={14} className="text-[#0F172A]" /> Best price detected</span>
              </div>
              <h1 className="text-[24px] md:text-[28px] font-sora font-bold tracking-[-0.03em] text-[#0F172A] leading-[1.2] mb-3">{metrics?.productName || "Loading Product..."}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-inter font-semibold rounded-md">ID: {metrics?.masterProductId?.substring(0,8).toUpperCase()}</span>
                <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-inter font-semibold rounded-md">Category: {metrics?.category}</span>
              </div>
            </div>

            {/* TOP RIGHT: SUPPLIER MATRIX PROGRESS BARS */}
            <div className="flex flex-col items-end gap-4 min-w-[280px]">
              <button onClick={onNewSearch} className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-slate-50 text-slate-600 text-[12px] font-semibold hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-200 shadow-sm">
                <Search size={14} /> New Search
              </button>
              
              <div className="w-full p-4 rounded-[16px] bg-slate-50 border border-slate-200 flex flex-col gap-3">
                <p className="text-[11px] font-sora font-bold uppercase tracking-[0.08em] text-slate-400 mb-1 border-b border-slate-200 pb-2">Supplier Matrix (vs Market Avg)</p>
                {metrics?.top3Matrix && metrics.top3Matrix.length > 0 ? metrics.top3Matrix.map((matrix, idx) => {
                  const isCheaper = matrix.comparisonStatus === 'CHEAPER';
                  const isHigher = matrix.comparisonStatus === 'HIGHER';
                  
                  const barColor = isCheaper ? 'bg-emerald-500' : isHigher ? 'bg-rose-500' : 'bg-slate-800';
                  const textColor = isCheaper ? 'text-emerald-600' : isHigher ? 'text-rose-600' : 'text-slate-600';
                  
                  return (
                    <div key={idx} className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-inter font-semibold text-[#0F172A] truncate max-w-[120px]">{matrix.businessName}</span>
                        <span className={`text-[11px] font-sora font-bold ${textColor}`}>
                          {isCheaper ? `Save ${inr(matrix.differenceFromAverage)}` : isHigher ? `+${inr(matrix.differenceFromAverage)}` : 'Avg Price'}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, matrix.percentageDifference)}%` }} transition={{ duration: 1, ease: "easeOut" }} className={`h-full ${barColor}`} />
                      </div>
                    </div>
                  );
                }) : <p className="text-[12px] text-slate-400">No sellers available for this quantity.</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-[16px] bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2"><ShieldCheck size={14} className="text-slate-400" /><span className="text-[11px] font-inter font-semibold text-slate-500 uppercase tracking-[0.08em]">Suppliers</span></div>
              <div className="flex items-baseline gap-1.5"><span className="text-[20px] font-sora font-bold text-[#0F172A]">{metrics?.supplierCount || 0}</span></div>
            </div>
            <div className="p-4 rounded-[16px] bg-pink-50/50 border border-pink-100 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2"><TrendingDown size={14} className="text-pink-500" /><span className="text-[11px] font-inter font-semibold text-pink-600 uppercase tracking-[0.08em]">Best Price (Total)</span></div>
              <div className="flex items-baseline gap-1.5"><span className="text-[20px] font-sora font-[800] text-[#0F172A]">{inr(metrics?.bestPriceTotal)}</span></div>
            </div>
            <div className="p-4 rounded-[16px] bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2"><BarChart3 size={14} className="text-slate-400" /><span className="text-[11px] font-inter font-semibold text-slate-500 uppercase tracking-[0.08em]">Market Avg (Total)</span></div>
              <div className="flex items-baseline gap-1.5"><span className="text-[20px] font-sora font-bold text-[#0F172A]">{inr(metrics?.marketAverageTotal)}</span></div>
            </div>
            <div className="p-4 rounded-[16px] bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2"><Wallet size={14} className="text-emerald-500" /><span className="text-[11px] font-inter font-semibold text-emerald-600 uppercase tracking-[0.08em]">You Save (Total)</span></div>
              <div className="flex items-baseline gap-1.5"><span className="text-[20px] font-sora font-[800] text-emerald-600">{inr(metrics?.totalSavings)}</span></div>
            </div>
          </div>

          <div className="mt-auto pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[11px] font-inter font-semibold text-slate-500 uppercase tracking-[0.08em] mb-1">Your Need</p>
                <p className="text-[12px] font-inter text-slate-400">Strict constraints apply</p>
              </div>
              <div className="flex items-center h-[42px] rounded-[10px] bg-white border border-slate-300 shadow-sm overflow-hidden shrink-0">
                <button onClick={() => stepQty(-1)} className="w-12 h-full flex items-center justify-center text-slate-600 hover:bg-slate-50 font-sora font-semibold border-r border-slate-200 transition-colors">−</button>
                <input type="number" value={localQty} onChange={(e) => setLocalQty(e.target.value)} onKeyDown={handleKeyDown} onBlur={handleBlur} className="w-16 h-full text-center font-sora font-[800] text-[14px] text-[#0F172A] outline-none" />
                <button onClick={() => stepQty(1)} className="w-12 h-full flex items-center justify-center text-slate-600 hover:bg-slate-50 font-sora font-semibold border-l border-slate-200 transition-colors">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}