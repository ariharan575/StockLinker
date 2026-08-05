import React from 'react';
import { Pencil, Trash2, PackageSearch, Search, X } from 'lucide-react';

export const ActionButtons = React.memo(({ onEdit, onDelete }) => (
  <div className="flex items-center justify-end gap-2">
    <button onClick={onEdit} className="flex items-center justify-center w-8 h-8 rounded-[8px] border border-slate-200 bg-white text-slate-600 hover:text-pink-600 hover:bg-pink-50 hover:border-pink-200 transition-all shadow-sm active:scale-95">
      <Pencil size={14} strokeWidth={2.5} />
    </button>
    <button onClick={onDelete} className="flex items-center justify-center w-8 h-8 rounded-[8px] border border-slate-200 bg-white text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm active:scale-95">
      <Trash2 size={14} strokeWidth={2.5} />
    </button>
  </div>
));

export const EmptyState = ({ onAddProduct, isFiltered, onReset }) => (
  <div className="flex flex-col items-center text-center p-8 sm:p-12 bg-white border border-dashed border-slate-300 rounded-[20px] sm:rounded-[24px]">
    <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-5">
      <div className="absolute w-full h-full rounded-full border border-pink-200 animate-[ping_2.6s_ease-out_infinite] opacity-60" />
      <div className="absolute w-[56px] h-[56px] sm:w-[68px] sm:h-[68px] rounded-full bg-pink-50 border border-pink-100" />
      <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-white border border-pink-200 rounded-full text-pink-500 shadow-sm">
        <PackageSearch size={24} strokeWidth={2} />
      </div>
    </div>
    <h3 className="font-sora text-[16px] sm:text-lg font-bold text-slate-900 mb-1.5">No Products Found</h3>
    <p className="font-inter text-[12px] sm:text-[13px] text-slate-500 font-medium max-w-xs sm:max-w-sm mb-6 leading-relaxed">
      {isFiltered ? 'No products match your current filters. Try adjusting or resetting them.' : 'Start adding products to build your wholesale inventory.'}
    </p>
    {isFiltered ? (
      <button onClick={onReset} className="font-sora px-5 py-2.5 text-[12px] sm:text-[13px] font-bold text-slate-700 bg-white border border-slate-200 rounded-[10px] hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm active:scale-95">
        Reset filters
      </button>
    ) : (
      <button onClick={onAddProduct} className="font-sora px-5 py-2.5 text-[12px] sm:text-[13px] font-bold text-white bg-slate-900 rounded-[10px] hover:bg-black transition-colors shadow-md active:scale-95">
        Add Product
      </button>
    )}
  </div>
);

export const SearchBar = React.memo(({ value, onChange }) => (
  <div className="relative flex items-center w-full bg-white border border-slate-200 rounded-[14px] sm:rounded-[16px] shadow-sm focus-within:border-pink-500 focus-within:ring-4 focus-within:ring-pink-500/10 transition-all group">
    <Search className="absolute left-4 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={18} strokeWidth={2.5} />
    <input
      type="text"
      className="w-full py-3.5 sm:py-4 pl-11 pr-11 bg-transparent font-inter text-[13px] sm:text-[14px] font-medium text-slate-900 placeholder:text-slate-400 outline-none"
      placeholder="Search products by name or SKU..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {value && (
      <button onClick={() => onChange('')} className="absolute right-3 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors">
        <X size={14} strokeWidth={3} />
      </button>
    )}
  </div>
));

export const getStockStatus = (stock, capacity) => {
  if (stock <= 0) return 'out';
  const ratio = capacity > 0 ? stock / capacity : 1;
  if (ratio <= 0.15) return 'low';
  return 'available';
};

export const StatusBadge = React.memo(({ status }) => {
  const configs = {
    available: { label: 'In Stock', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    low: { label: 'Low Stock', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    out: { label: 'Out of Stock', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  };
  const config = configs[status] || configs.available;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-[6px] border ${config.bg} ${config.text} ${config.border} font-sora text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.05em] whitespace-nowrap shadow-sm`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'out' ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  );
});

export const SkeletonLoader = ({ rows = 4 }) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="relative overflow-hidden h-[120px] sm:h-[80px] w-full bg-slate-100 rounded-[16px]">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </div>
    ))}
  </div>
);