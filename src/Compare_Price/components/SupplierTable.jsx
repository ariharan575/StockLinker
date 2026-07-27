import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Star, Search } from 'lucide-react';
import { inr } from '../config/constants';
import { ScoreRing } from './SharedComponents';

const COL_HEADERS = [
  { label: '#', w: 'w-[50px]' },
  { label: 'Supplier', w: 'w-[200px]' },
  { label: 'Location', w: 'w-[120px]' },
  { label: 'Min Qty & Price', w: 'w-[160px]' },
  { label: 'Your Need', w: 'w-[140px]' },
  { label: 'Bulk Deal', w: 'w-[180px]' },
  { label: 'Trust Score', w: 'w-[100px]' },
  { label: 'Rating', w: 'w-[100px]' },
  { label: 'Stock', w: 'w-[100px]' },
  { label: 'Actions', w: 'w-[120px] text-right' },
];

function SupplierRow({ supplier, rank, qty, onSelect }) {
  return (
    <motion.tr className="group relative hover:bg-slate-50 transition-all border-b border-slate-100 last:border-b-0 whitespace-nowrap z-10 hover:z-20 h-[96px] bg-white">
      <td className="py-2 pl-6 pr-2 align-middle">
        <span className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white text-[12px] font-sora font-bold text-slate-500 flex items-center justify-center transition-colors shadow-sm">{rank}</span>
      </td>
      <td className="py-2 px-3 align-middle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-sora font-bold text-[13px] flex items-center justify-center shadow-md shrink-0">{supplier.initials}</div>
          <div className="flex flex-col gap-1">
            <span className="font-sora font-semibold text-[14px] text-slate-900 truncate max-w-[150px]">{supplier.businessName}</span>
            {supplier.verified && <span className="inline-block px-2 py-0.5 rounded text-[9px] font-sora font-bold uppercase tracking-[0.10em] bg-emerald-50 text-emerald-600 border border-emerald-100 w-max"><ShieldCheck size={10} className="inline mr-1" />Verified</span>}
          </div>
        </div>
      </td>
      <td className="py-2 px-3 align-middle">
        <span className="flex items-center gap-1.5 text-[12px] font-inter font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded w-max border border-slate-100"><MapPin size={12} className="text-slate-400" /> {supplier.locationDistrict}</span>
      </td>
      <td className="py-2 px-3 align-middle border-l border-slate-100">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-inter font-semibold text-slate-400 uppercase tracking-[0.08em]">Min {supplier.moq} {supplier.unit}</span>
          <span className="text-[13px] font-sora font-bold text-[#0F172A]">{inr(supplier.basePricePerUnit)} / unit</span>
        </div>
      </td>
      <td className="py-2 px-3 align-middle bg-slate-50/50 border-r border-slate-100">
        <div className="flex flex-col">
          <span className="text-[10px] font-inter font-semibold text-slate-500 uppercase tracking-[0.08em] mb-1">For {qty} Units</span>
          <span className="text-[16px] font-sora font-[800] text-slate-900 tabular-nums">{inr(supplier.calculatedTotalPrice)}</span>
        </div>
      </td>
      <td className="py-2 px-3 align-middle">
        {supplier.bulkQty && supplier.bulkTotalPrice ? (
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-inter font-semibold text-slate-500 uppercase tracking-[0.08em] mb-1">Buy {supplier.bulkQty}+ Bundle</span>
            <span className="text-[13px] font-sora font-bold text-[#0F172A] mb-1">{inr(supplier.bulkTotalPrice)}</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-sora font-bold uppercase tracking-[0.08em] bg-emerald-50 border-emerald-100 text-emerald-600">Save {inr(supplier.bulkSavingsAmount)}</span>
          </div>
        ) : <span className="text-[11px] font-inter font-semibold text-slate-400 uppercase tracking-[0.08em]">No Bulk Deal</span>}
      </td>
      <td className="py-2 px-3 align-middle border-l border-slate-100">
        <ScoreRing score={supplier.trustScore} size={36} />
      </td>
      <td className="py-2 px-3 align-middle">
        <span className="flex items-center gap-1.5 text-[14px] font-sora font-bold text-slate-900"><Star size={14} className="fill-yellow-500 text-yellow-500"/> {supplier.rating}</span>
      </td>
      <td className="py-2 px-3 align-middle border-l border-slate-100">
        <span className={`text-[13px] font-sora font-bold ${supplier.availableStock < 100 ? 'text-orange-500 bg-orange-50 px-2 py-1 rounded border border-orange-100' : 'text-slate-900'}`}>{supplier.availableStock}</span>
      </td>
      <td className="py-2 pl-3 pr-6 align-middle text-right">
        <button onClick={() => onSelect(supplier)} className="h-9 px-4 rounded-[8px] text-[12px] font-semibold bg-[#0F172A] text-white hover:bg-black transition-colors shadow-sm whitespace-nowrap">
          View Details
        </button>
      </td>
    </motion.tr>
  );
}

export default function SupplierTable({ qty, onSelect, suppliers }) {
  const [searchValue, setSearchValue] = useState("");

  if (!suppliers || suppliers.length === 0) return <div className="p-8 text-center bg-white rounded-[24px] border border-slate-200 text-slate-500 font-inter shadow-sm mt-8">No verified suppliers currently offer this quantity. Please adjust your request.</div>;

  return (
    <motion.div className="bg-white border border-slate-200 rounded-[24px] shadow-sm flex flex-col w-full overflow-hidden mb-16">
      <div className="px-6 pt-6 md:px-8 md:pt-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] md:text-[22px] font-sora font-bold text-slate-900 tracking-[-0.02em] leading-[1.3]">Compare Verified Suppliers</h2>
          <p className="text-[14px] font-inter text-slate-500 mt-1.5 max-w-2xl leading-[1.6]">Review live quotes, trust scores, and dynamic pricing based on your required volume.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm shrink-0">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span className="text-[12px] font-sora font-bold uppercase tracking-[0.08em] text-slate-900">{suppliers.length} Verified</span>
        </div>
      </div>

      {/* FIX: Full width search bar, filters completely removed */}
      <div className="px-6 md:px-8 mt-6 w-full">
        <div className="relative w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search supplier by name..." 
            value={searchValue} 
            onChange={(e) => setSearchValue(e.target.value)} 
            className="w-full h-12 rounded-xl bg-slate-50 pl-11 pr-4 text-[14px] font-inter outline-none border border-slate-200 focus:border-slate-400 focus:bg-white transition-all shadow-sm" 
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto mt-6 border-t border-slate-200">
        <table className="w-full text-left border-collapse min-w-[1300px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {COL_HEADERS.map((h, i) => <th key={h.label} className={`py-4 px-3 ${i===0?'pl-6':''} ${i===COL_HEADERS.length-1?'pr-6':''} text-[11px] font-inter font-bold uppercase tracking-[0.08em] text-slate-500 ${h.w}`}>{h.label}</th>)}
            </tr>
          </thead>
          <tbody className="bg-white">
            {suppliers.filter(s => s.businessName.toLowerCase().includes(searchValue.toLowerCase())).map((s, i) => (
              <SupplierRow key={s.id} supplier={s} rank={i + 1} qty={qty} onSelect={onSelect} />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}