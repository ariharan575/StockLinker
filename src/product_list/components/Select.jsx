import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ value, onChange, options, label }) => (
  <div className="relative inline-flex items-center min-w-[140px] sm:min-w-[150px] flex-shrink-0 group">
    <select
      className="w-full appearance-none bg-white border border-slate-200 font-inter text-[12px] sm:text-[13px] font-semibold text-[#475569] h-[40px] sm:h-[44px] px-3 sm:px-4 pr-8 sm:pr-10 rounded-[10px] sm:rounded-[12px] outline-none hover:bg-slate-50 focus:bg-white focus:border-pink-300 focus:text-[#0F172A] focus:ring-2 focus:ring-pink-100 transition-all cursor-pointer shadow-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
    >
      {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    <ChevronDown className="absolute right-3 text-[#94A3B8] group-hover:text-[#0F172A] pointer-events-none transition-colors" size={16} />
  </div>
);

export default Select;