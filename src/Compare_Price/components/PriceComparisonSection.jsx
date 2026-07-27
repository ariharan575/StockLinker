import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Search, Mic, ChevronDown, BarChart3 } from 'lucide-react';
import SupplierTable from './SupplierTable';
import { FILTER_OPTS, SORT_OPTS } from '../config/mockData';

export default function PriceComparisonSection({ sortBy, setSortBy, onSelect, qty }) {
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-slate-200 rounded-[28px] shadow-[0_20px_50px_rgba(15,23,42,0.08)] flex flex-col w-full overflow-hidden mb-16"
    >
      <div className="px-6 pt-6 md:px-8 md:pt-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] md:text-[22px] font-sora font-bold text-[#0F172A] tracking-[-0.02em] leading-[1.3]">Compare Verified Suppliers</h2>
          <p className="text-[14px] font-inter font-normal text-[#475569] mt-1.5 max-w-2xl leading-[1.6]">
            Review live quotes, supplier trust score, pricing intelligence and secure procurement deals.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[12px] bg-[#F8FAFC] border border-slate-200 shadow-sm shrink-0">
          <ShieldCheck size={16} className="text-[#10B981]" />
          <span className="text-[11px] font-sora font-semibold uppercase tracking-[0.08em] text-[#0F172A]">156 Verified Suppliers</span>
        </div>
      </div>

      <div className="px-6 md:px-8 mt-6 w-full">
        <div className="relative w-full group">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#0F172A] transition-colors order " />
          <input
            type="text"
            placeholder="Search supplier, location, SKU, GST, product..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full h-[52px] rounded-[16px] bg-[#F8FAFC] pl-12 pr-16 text-[14px]
             font-inter font-normal text-[#0F172A] placeholder:text-[13px] placeholder:font-normal outline-none border border-slate-200 focus:border-pink-300
             focus:ring-0.5 focus:ring-pink-300 transition-all shadow-[inset_0_2px_4px_rgba(15,23,42,0.02)]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center px-2 py-1 rounded-[8px] bg-white border border-slate-200 shadow-sm text-[#94A3B8] text-[12px] font-bold font-mono">
            <Mic height={20}/>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 mt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 lg:pb-0">
          <span className="text-[11px] font-inter font-semibold text-[#475569] uppercase tracking-[0.08em] shrink-0">Filter By</span>
          <div className="w-px h-6 bg-slate-200 hidden md:block shrink-0 mx-1" />
          {FILTER_OPTS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(activeFilter === f ? null : f)}
              className={`flex items-center gap-2 h-[42px] px-4 rounded-[14px] text-[13px] font-inter font-semibold transition-all shrink-0 border ${
                activeFilter === f
                  ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md'
                  : 'text-[#475569] bg-white border-slate-200 hover:bg-[#F8FAFC] hover:-translate-y-0.5 hover:shadow-sm'
              }`}
            >
              {f} <ChevronDown size={14} className={`transition-transform duration-200 ${activeFilter === f ? 'text-white rotate-180' : 'text-[#94A3B8]'}`} />
            </button>
          ))}
        </div>

        <div className="relative shrink-0 w-full lg:w-[220px] z-40">
          <button
            onClick={() => setSortOpen(o => !o)}
            className="flex items-center justify-between w-full h-[42px] px-4 rounded-[14px] bg-white text-[13px] font-inter font-semibold text-[#0F172A] border border-slate-200 hover:bg-[#F8FAFC] hover:-translate-y-0.5 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-[#94A3B8]" />
              Sort: {sortBy}
            </div>
            <ChevronDown size={16} className={`text-[#94A3B8] transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-[calc(100%+8px)] w-full rounded-[16px] bg-white shadow-xl overflow-hidden border border-slate-200"
              >
                {SORT_OPTS.map(o => (
                  <button key={o} onClick={() => { setSortBy(o); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-[13px] font-inter transition-colors ${sortBy === o ? 'bg-[#F8FAFC] text-[#0F172A] font-semibold border-l-2 border-l-[#0F172A]' : 'text-[#475569] font-normal hover:bg-[#F8FAFC] border-l-2 border-l-transparent'}`}>
                    {o}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <SupplierTable onSelect={onSelect} qty={qty} />
    </motion.div>
  );
}