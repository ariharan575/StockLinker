import React from 'react';
import { RotateCcw, RefreshCw, Download } from 'lucide-react';
import Select from './Select';

const FilterBar = ({ categories, brands, filters, onFilterChange, onReset, onRefresh, onExport, isRefreshing }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1 w-full lg:w-auto">
        <span className="text-[10px] sm:text-[11px] bg-slate-100 text-[#64748B] px-3 py-2 rounded-[8px] font-inter font-bold uppercase tracking-[0.1em] shrink-0 border border-slate-200">Filters</span>
        <div className="w-px h-6 bg-slate-200 shrink-0 mx-1" />
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

      <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar shrink-0">
        <button onClick={onReset} className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 h-[40px] sm:h-[44px] px-3 sm:px-4 rounded-[10px] sm:rounded-[12px] text-[12px] sm:text-[13px] font-inter font-bold text-[#475569] bg-white border border-slate-200 hover:bg-slate-50 transition-all whitespace-nowrap shadow-sm">
          <RotateCcw size={14} /> Reset
        </button>
        <button onClick={onRefresh} className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 h-[40px] sm:h-[44px] px-3 sm:px-4 rounded-[10px] sm:rounded-[12px] text-[12px] sm:text-[13px] font-inter font-bold text-[#475569] bg-white border border-slate-200 hover:bg-slate-50 transition-all whitespace-nowrap shadow-sm">
          <RefreshCw size={14} className={isRefreshing ? 'animate-[spin_700ms_linear_infinite]' : ''} /> Refresh
        </button>
        <button onClick={onExport} className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 h-[40px] sm:h-[44px] px-3 sm:px-4 rounded-[10px] sm:rounded-[12px] text-[12px] sm:text-[13px] font-inter font-bold text-[#475569] bg-white border border-slate-200 hover:bg-slate-50 transition-all whitespace-nowrap shadow-sm">
          <Download size={14} /> Export
        </button>
      </div>
    </div>
  );
};

export default FilterBar;