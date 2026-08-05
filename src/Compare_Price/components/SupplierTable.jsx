import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Star, Search, Package, TrendingDown } from 'lucide-react';
import { inr } from '../config/constants';
import { ScoreRing } from './SharedComponents';

// Highly optimized widths to fit within 1024px and eliminate desktop scrolling
const COL_HEADERS = [
  { label: '#', w: 'w-[40px]' },
  { label: 'Supplier', w: 'w-[200px]' },
  { label: 'Location', w: 'w-[100px]' },
  { label: 'Base Price', w: 'w-[140px]' },
  { label: 'Your Need', w: 'w-[140px]' },
  { label: 'Bulk Deal', w: 'w-[160px]' },
  { label: 'Trust', w: 'w-[80px]' },
  { label: 'Rating', w: 'w-[80px]' },
  { label: 'Stock', w: 'w-[80px]' },
  { label: 'Actions', w: 'w-[110px] text-right' },
];

// ==========================================
// DESKTOP VIEW: Table Row
// ==========================================
function SupplierRow({ supplier, rank, qty, onSelect }) {
  return (
    <motion.tr className="group relative hover:bg-slate-50 transition-all border-b border-slate-100 last:border-b-0 whitespace-nowrap z-10 hover:z-20 h-[80px] bg-white">
      <td className="py-2 pl-6 pr-2 align-middle">
        <span className="w-7 h-7 rounded-[8px] bg-slate-100 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white text-[11px] font-sora font-bold text-slate-500 flex items-center justify-center transition-colors shadow-sm">{rank}</span>
      </td>
      <td className="py-2 px-2 align-middle">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[10px] bg-slate-900 text-white font-sora font-bold text-[12px] flex items-center justify-center shadow-md shrink-0">{supplier.initials}</div>
          <div className="flex flex-col">
            <span className="font-sora font-semibold text-[13px] text-slate-900 truncate max-w-[140px]">{supplier.businessName}</span>
            {supplier.verified && <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[8px] font-sora font-bold uppercase tracking-[0.10em] bg-emerald-50 text-emerald-600 border border-emerald-100 w-max"><ShieldCheck size={10} className="inline mr-1" />Verified</span>}
          </div>
        </div>
      </td>
      <td className="py-2 px-2 align-middle">
        <span className="flex items-center gap-1 text-[11px] font-inter font-medium text-slate-600 truncate max-w-[90px]"><MapPin size={12} className="text-slate-400 shrink-0" /> {supplier.locationDistrict}</span>
      </td>
      <td className="py-2 px-2 align-middle border-l border-slate-100">
        <div className="flex flex-col">
          <span className="text-[10px] font-inter font-semibold text-slate-400 uppercase tracking-[0.08em]">Min {supplier.moq} {supplier.unit}</span>
          <span className="text-[12px] font-sora font-bold text-[#0F172A]">{inr(supplier.basePricePerUnit)} <span className="text-[10px] font-inter font-medium text-slate-500">/ unit</span></span>
        </div>
      </td>
      <td className="py-2 px-3 align-middle bg-slate-50/60 border-x border-slate-100">
        <div className="flex flex-col">
          <span className="text-[9px] font-inter font-semibold text-slate-500 uppercase tracking-[0.08em] mb-0.5">For {qty} Units</span>
          <span className="text-[15px] font-sora font-[800] text-slate-900 tabular-nums">{inr(supplier.calculatedTotalPrice)}</span>
        </div>
      </td>
      <td className="py-2 px-2 align-middle">
        {supplier.bulkQty && supplier.bulkTotalPrice ? (
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-inter font-semibold text-slate-500 uppercase tracking-[0.05em] mb-0.5">Buy {supplier.bulkQty}+ Bundle</span>
            <span className="text-[12px] font-sora font-bold text-[#0F172A] mb-0.5">{inr(supplier.bulkTotalPrice)}</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-sora font-bold uppercase tracking-[0.08em] bg-emerald-50 border border-emerald-100 text-emerald-600">Save {inr(supplier.bulkSavingsAmount)}</span>
          </div>
        ) : <span className="text-[10px] font-inter font-medium text-slate-400">No Bulk Deal</span>}
      </td>
      <td className="py-2 px-2 align-middle border-l border-slate-100">
        <ScoreRing score={supplier.trustScore} size={32} />
      </td>
      <td className="py-2 px-2 align-middle">
        <span className="flex items-center gap-1 text-[12px] font-sora font-bold text-slate-900"><Star size={12} className="fill-yellow-500 text-yellow-500"/> {supplier.rating}</span>
      </td>
      <td className="py-2 px-2 align-middle border-l border-slate-100">
        <span className={`text-[12px] font-sora font-bold ${supplier.availableStock < 100 ? 'text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100' : 'text-slate-900'}`}>{supplier.availableStock}</span>
      </td>
      <td className="py-2 pl-2 pr-6 align-middle text-right">
        <button onClick={() => onSelect(supplier)} className="h-8 px-3 rounded-[8px] text-[11px] font-semibold bg-[#0F172A] text-white hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap">
          View Details
        </button>
      </td>
    </motion.tr>
  );
}

// ==========================================
// MOBILE & TABLET VIEW: Card
// ==========================================
function SupplierMobileCard({ supplier, rank, qty, onSelect }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white border border-slate-200 rounded-[16px] p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 relative"
    >
      {/* Top Header Row */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <div className="relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[12px] bg-slate-900 text-white font-sora font-bold text-[14px] flex items-center justify-center shadow-md">
              {supplier.initials}
            </div>
            <div className="absolute -top-2 -left-2 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold font-sora flex items-center justify-center rounded-full shadow-sm border-2 border-white">
              {rank}
            </div>
          </div>
          <div>
            <h3 className="font-sora font-bold text-[15px] sm:text-[16px] text-slate-900 leading-tight mb-1">{supplier.businessName}</h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-inter font-medium text-slate-500"><MapPin size={12}/> {supplier.locationDistrict}</span>
              {supplier.verified && <span className="flex items-center gap-0.5 text-[9px] font-sora font-bold uppercase tracking-[0.05em] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100"><ShieldCheck size={10}/> Verified</span>}
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <ScoreRing score={supplier.trustScore} size={36} />
        </div>
      </div>

      {/* Main Pricing Grid */}
      <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-100 rounded-[12px] p-3 sm:p-4">
        <div className="flex flex-col border-r border-slate-200">
          <span className="text-[9px] sm:text-[10px] font-inter font-bold text-slate-500 uppercase tracking-[0.08em] mb-1">Base Price (Min {supplier.moq})</span>
          <span className="text-[14px] sm:text-[15px] font-sora font-bold text-slate-900">{inr(supplier.basePricePerUnit)}<span className="text-[10px] text-slate-400 font-medium"> / u</span></span>
        </div>
        <div className="flex flex-col pl-3">
          <span className="text-[9px] sm:text-[10px] font-inter font-bold text-pink-600 uppercase tracking-[0.08em] mb-1">Your Need ({qty} Units)</span>
          <span className="text-[16px] sm:text-[18px] font-sora font-[800] text-slate-900">{inr(supplier.calculatedTotalPrice)}</span>
        </div>
      </div>

      {/* Bulk Deal & Stats Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {supplier.bulkQty && supplier.bulkTotalPrice ? (
          <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-[12px] p-3 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[9px] font-inter font-bold text-emerald-700 uppercase tracking-[0.08em]">Bulk Deal: {supplier.bulkQty}+ Units</span>
              <span className="text-[13px] font-sora font-bold text-emerald-900">{inr(supplier.bulkTotalPrice)}</span>
            </div>
            <span className="text-[10px] font-sora font-bold bg-white text-emerald-600 px-2 py-1 rounded-[6px] border border-emerald-200 shadow-sm">Save {inr(supplier.bulkSavingsAmount)}</span>
          </div>
        ) : (
          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-[12px] p-3 flex items-center justify-center text-[11px] font-inter text-slate-400 font-medium">
            No Bulk Deals Available
          </div>
        )}

        <div className="flex items-center justify-between sm:justify-center gap-4 px-4 sm:px-6 py-2 bg-slate-50 border border-slate-100 rounded-[12px]">
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-inter font-bold text-slate-400 uppercase tracking-[0.08em]">Rating</span>
            <span className="text-[12px] font-sora font-bold flex items-center gap-1 text-slate-900"><Star size={10} className="fill-yellow-500 text-yellow-500"/> {supplier.rating}</span>
          </div>
          <div className="w-px h-6 bg-slate-200"></div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-inter font-bold text-slate-400 uppercase tracking-[0.08em]">Stock</span>
            <span className={`text-[12px] font-sora font-bold ${supplier.availableStock < 100 ? 'text-orange-500' : 'text-slate-900'}`}>{supplier.availableStock}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button onClick={() => onSelect(supplier)} className="w-full py-3 rounded-[10px] bg-slate-900 text-white font-sora font-semibold text-[13px] hover:bg-slate-800 transition-colors shadow-sm">
        View Full Details
      </button>

    </motion.div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function SupplierTable({ qty, onSelect, suppliers }) {
  const [searchValue, setSearchValue] = useState("");

  if (!suppliers || suppliers.length === 0) return (
    <div className="p-6 sm:p-8 text-center bg-white rounded-[16px] sm:rounded-[24px] border border-slate-200 text-slate-500 font-inter shadow-sm mt-6 sm:mt-8">
      No verified suppliers currently offer this quantity. Please adjust your request.
    </div>
  );

  const filteredSuppliers = suppliers.filter(s => s.businessName.toLowerCase().includes(searchValue.toLowerCase()));

  return (
    <motion.div className="bg-transparent sm:bg-white sm:border border-slate-200 sm:rounded-[24px] sm:shadow-sm flex flex-col w-full overflow-hidden mb-12 sm:mb-16">
      
      {/* Header Section (Mobile & Desktop) */}
      <div className="px-1 sm:px-6 md:px-8 pt-2 sm:pt-6 md:pt-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-sora font-bold text-slate-900 tracking-[-0.02em] leading-[1.3]">Compare Verified Suppliers</h2>
          <p className="text-[12px] sm:text-[13px] md:text-[14px] font-inter text-slate-500 mt-1 sm:mt-1.5 max-w-2xl leading-[1.5]">Review live quotes, trust scores, and dynamic pricing based on your required volume.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-[10px] sm:rounded-xl bg-slate-50 border border-slate-200 shadow-sm shrink-0 w-max">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span className="text-[11px] sm:text-[12px] font-sora font-bold uppercase tracking-[0.08em] text-slate-900">{suppliers.length} Verified</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-1 sm:px-6 md:px-8 mt-5 sm:mt-6 w-full">
        <div className="relative w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search supplier by name..." 
            value={searchValue} 
            onChange={(e) => setSearchValue(e.target.value)} 
            className="w-full h-12 rounded-[12px] sm:rounded-xl bg-white sm:bg-slate-50 pl-11 pr-4 text-[13px] sm:text-[14px] font-inter outline-none border border-slate-200 focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all shadow-sm" 
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* MOBILE & TABLET VIEW: Render Cards         */}
      {/* ========================================== */}
      <div className="flex flex-col gap-4 lg:hidden mt-6 px-1 sm:px-6 md:px-8 pb-6">
        {filteredSuppliers.map((s, i) => (
          <SupplierMobileCard key={s.id} supplier={s} rank={i + 1} qty={qty} onSelect={onSelect} />
        ))}
      </div>

      {/* ========================================== */}
      {/* DESKTOP VIEW: Render Table                 */}
      {/* ========================================== */}
      <div className="hidden lg:block w-full overflow-x-auto mt-6 border-t border-slate-200">
        <table className="w-full text-left border-collapse min-w-[1024px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {COL_HEADERS.map((h, i) => (
                <th key={h.label} className={`py-3.5 px-2 ${i===0?'pl-6':''} ${i===COL_HEADERS.length-1?'pr-6':''} text-[10px] font-inter font-bold uppercase tracking-[0.08em] text-slate-500 ${h.w}`}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredSuppliers.map((s, i) => (
              <SupplierRow key={s.id} supplier={s} rank={i + 1} qty={qty} onSelect={onSelect} />
            ))}
          </tbody>
        </table>
      </div>

    </motion.div>
  );
}