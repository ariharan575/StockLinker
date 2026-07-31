import React from 'react';
import { RotateCcw, RefreshCw, Download, ChevronDown } from 'lucide-react';

const Select = ({ value, onChange, options, label }) => (
  <div className="relative inline-flex items-center min-w-[130px] sm:min-w-[140px] flex-shrink-0 group">
    <select
      className="w-full appearance-none bg-slate-50 border border-slate-200 font-sora text-[11px] sm:text-[12px] font-bold text-slate-700 py-2 sm:py-2.5 pl-3 pr-8 rounded-[8px] sm:rounded-[10px] outline-none hover:bg-white hover:border-slate-300 focus:bg-pink-50 focus:border-pink-300 focus:text-pink-700 focus:ring-2 focus:ring-pink-100 transition-all cursor-pointer shadow-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
    >
      {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    <ChevronDown className="absolute right-3 text-slate-400 group-hover:text-slate-600 pointer-events-none transition-colors" size={14} strokeWidth={2.5}/>
  </div>
);

export default function FilterBar({ categories, brands, filters, onFilterChange, onReset, onRefresh, onExport, isRefreshing }) {
  return (
    <div className="sticky top-0 sm:top-2 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 sm:p-3 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[14px] sm:rounded-[16px] shadow-sm">
      
      {/* Mobile-friendly horizontally scrolling filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 w-full sm:w-auto">
        <Select
          label="Filter by category"
          value={filters.category}
          onChange={(val) => onFilterChange('category', val)}
          options={[{ value: 'all', label: 'All Categories' }, ...categories.map(c => ({ value: c, label: c }))]}
        />
        <Select
          label="Filter by brand"
          value={filters.brand}
          onChange={(val) => onFilterChange('brand', val)}
          options={[{ value: 'all', label: 'All Brands' }, ...brands.map(b => ({ value: b, label: b }))]}
        />
        <Select
          label="Filter by availability"
          value={filters.availability}
          onChange={(val) => onFilterChange('availability', val)}
          options={[
            { value: 'all', label: 'All Stock' },
            { value: 'available', label: 'In Stock' },
            { value: 'low', label: 'Low Stock' },
            { value: 'out', label: 'Out of Stock' },
          ]}
        />
        <Select
          label="Sort by price"
          value={filters.sortPrice}
          onChange={(val) => onFilterChange('sortPrice', val)}
          options={[
            { value: 'none', label: 'Sort: Price' },
            { value: 'asc', label: 'Price: Low to High' },
            { value: 'desc', label: 'Price: High to Low' },
          ]}
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pt-1 sm:pt-0 border-t border-slate-100 sm:border-none">
        <button onClick={onReset} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 font-sora text-[11px] sm:text-[12px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-[8px] sm:rounded-[10px] hover:bg-white hover:text-slate-900 transition-colors active:scale-95 shadow-sm whitespace-nowrap">
          <RotateCcw size={14} strokeWidth={2.5} /> Reset
        </button>
        <button onClick={onRefresh} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 font-sora text-[11px] sm:text-[12px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-[8px] sm:rounded-[10px] hover:bg-white hover:text-slate-900 transition-colors active:scale-95 shadow-sm whitespace-nowrap">
          <RefreshCw size={14} strokeWidth={2.5} className={isRefreshing ? 'animate-[spin_700ms_linear_infinite]' : ''} /> Refresh
        </button>
        <button onClick={onExport} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2.5 font-sora text-[11px] sm:text-[12px] font-bold text-white bg-slate-900 rounded-[8px] sm:rounded-[10px] shadow-md hover:bg-black transition-transform active:scale-95 whitespace-nowrap">
          <Download size={14} strokeWidth={2.5} /> Export
        </button>
      </div>
    </div>
  );
}