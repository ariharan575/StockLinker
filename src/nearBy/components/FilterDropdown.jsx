import React from 'react';
import { ChevronDown } from 'lucide-react';

export const FilterDropdown = ({ label, options, value, onChange }) => (
  <div className="relative inline-flex flex-shrink-0">
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className={`appearance-none pl-3.5 pr-9 py-2 border text-[13px] font-bold rounded-xl shadow-sm outline-none cursor-pointer transition-all duration-200 min-w-[140px]
      ${value ? 'bg-indigo-50 border-indigo-200 text-indigo-700 focus:ring-2 focus:ring-indigo-500/20' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 focus:border-slate-300'}`}
    >
      <option value="">{label}</option>
      {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
    </select>
    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${value ? 'text-indigo-600' : 'text-slate-400'}`} size={16} />
  </div>
);