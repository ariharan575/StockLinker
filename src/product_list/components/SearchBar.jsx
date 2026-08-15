import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = React.memo(({ value, onChange }) => (
  <div className="relative flex items-center w-full group">
    <Search className="absolute left-4 text-[#94A3B8] group-focus-within:text-[#0F172A] transition-colors z-10" size={20} />
    <input
      type="text"
      className="w-full h-[50px] sm:h-[56px] rounded-[14px] bg-white border border-slate-200 pl-12 pr-10 text-[13px] sm:text-[15px] font-inter font-medium text-[#0F172A] placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-[#94A3B8] outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-300/10 transition-all shadow-sm"
      placeholder="Search products by name, SKU, or category..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {value && (
      <button onClick={() => onChange('')} className="absolute right-3 p-1.5 rounded-full bg-slate-100 text-[#475569] hover:bg-gray-900 hover:text-white transition-colors z-10">
        <X size={14} strokeWidth={3} />
      </button>
    )}
  </div>
));

export default SearchBar;