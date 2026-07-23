import React from 'react';
import { RotateCcw, RefreshCw, Download, ChevronDown } from 'lucide-react';

const Select = ({ value, onChange, options, label }) => (
  <div className="relative inline-flex items-center min-w-[140px] flex-1">
    <select
      className="w-full appearance-none bg-slate-50 border border-slate-200 font-['Inter',_sans-serif] text-[13px] font-medium text-slate-700 py-2.5 pl-3 pr-8 rounded-lg outline-none hover:bg-white hover:border-slate-300 focus:bg-white focus:border-blue-500 transition-colors cursor-pointer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
    >
      {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    <ChevronDown className="absolute right-3 text-slate-400 pointer-events-none" size={14} />
  </div>
);

export default function FilterBar({ categories, brands, filters, onFilterChange, onReset, onRefresh, onExport, isRefreshing }) {
  return (
    <div className="sticky top-4 z-20 flex flex-wrap items-center justify-between gap-3 p-3 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
      <div className="flex items-center gap-2.5 flex-wrap flex-1">
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
            { value: 'all', label: 'All Availability' },
            { value: 'available', label: 'Available' },
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
        <Select
          label="Sort by stock"
          value={filters.sortStock}
          onChange={(val) => onFilterChange('sortStock', val)}
          options={[
            { value: 'none', label: 'Sort: Stock' },
            { value: 'asc', label: 'Stock: Low to High' },
            { value: 'desc', label: 'Stock: High to Low' },
          ]}
        />
      </div>

      <div className="flex items-center gap-2.5">
        <button onClick={onReset} className="flex items-center gap-1.5 px-4 py-2.5 font-['Inter',_sans-serif] text-[13px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <RotateCcw size={15} strokeWidth={2.25} /> Reset
        </button>
        <button onClick={onRefresh} className="flex items-center gap-1.5 px-4 py-2.5 font-['Inter',_sans-serif] text-[13px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <RefreshCw size={15} strokeWidth={2.25} className={isRefreshing ? 'animate-[spin_700ms_linear_infinite]' : ''} /> Refresh
        </button>
        <button onClick={onExport} className="flex items-center gap-1.5 px-4 py-2.5 font-['Inter',_sans-serif] text-[13px] font-semibold text-white bg-slate-900 rounded-lg shadow-[0_4px_12px_rgba(16,24,40,0.1)] hover:bg-black transition-transform active:scale-[0.97]">
          <Download size={15} strokeWidth={2.25} /> Export
        </button>
      </div>
    </div>
  );
}