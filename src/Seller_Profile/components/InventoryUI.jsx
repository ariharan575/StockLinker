import React from 'react';
import { Pencil, Trash2, PackageSearch, Search, X } from 'lucide-react';

export const ActionButtons = React.memo(({ onEdit, onDelete }) => (
  <div className="flex items-center justify-end gap-2">
    <button onClick={onEdit} className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all">
      <Pencil size={15} strokeWidth={2.25} />
    </button>
    <button onClick={onDelete} className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-200 transition-all">
      <Trash2 size={15} strokeWidth={2.25} />
    </button>
  </div>
));

export const EmptyState = ({ onAddProduct, isFiltered, onReset }) => (
  <div className="flex flex-col items-center text-center p-12 bg-white border border-dashed border-slate-200 rounded-2xl">
    <div className="relative flex items-center justify-center w-24 h-24 mb-5">
      <div className="absolute w-full h-full rounded-full border border-slate-200 animate-[ping_2.6s_ease-out_infinite] opacity-60" />
      <div className="absolute w-[68px] h-[68px] rounded-full bg-slate-50 border border-slate-200" />
      <div className="relative flex items-center justify-center w-14 h-14 bg-white border border-slate-200 rounded-full text-slate-400 shadow-sm">
        <PackageSearch size={26} strokeWidth={1.75} />
      </div>
    </div>
    <h3 className="font-['Manrope',_sans-serif] text-lg font-bold text-[#0F1626] mb-1">No Products Found</h3>
    <p className="font-['Inter',_sans-serif] text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
      {isFiltered ? 'No products match your current filters. Try adjusting or resetting them.' : 'Start adding products to build your wholesale inventory.'}
    </p>
    {isFiltered ? (
      <button onClick={onReset} className="font-['Inter',_sans-serif] px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors">
        Reset filters
      </button>
    ) : (
      <button onClick={onAddProduct} className="font-['Inter',_sans-serif] px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-black transition-colors shadow-md">
        Add Product
      </button>
    )}
  </div>
);

export const SearchBar = React.memo(({ value, onChange }) => (
  <div className="relative flex items-center w-full bg-white border border-slate-200 rounded-xl shadow-[0_1px_2px_rgba(16,24,40,0.05)] focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
    <Search className="absolute left-4 text-slate-400" size={18} strokeWidth={2} />
    <input
      type="text"
      className="w-full py-4 pl-11 pr-11 bg-transparent font-['Inter',_sans-serif] text-[15px] font-medium text-[#0F1626] placeholder:text-slate-400 outline-none"
      placeholder="Search products by name or SKU..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {value && (
      <button onClick={() => onChange('')} className="absolute right-3 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
        <X size={14} strokeWidth={2.5} />
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
    available: { label: 'Available', bg: 'bg-[#ECFDF3]', text: 'text-[#067647]', border: 'border-[#DCFAE6]', dot: 'bg-[#17B26A]' },
    low: { label: 'Low Stock', bg: 'bg-[#FFFAEB]', text: 'text-[#B54708]', border: 'border-[#FEF0C7]', dot: 'bg-[#F79009]' },
    out: { label: 'Out of Stock', bg: 'bg-[#FEF3F2]', text: 'text-[#B42318]', border: 'border-[#FEE4E2]', dot: 'bg-[#F04438]' },
  };
  const config = configs[status] || configs.available;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} font-['Inter',_sans-serif] text-[12px] font-semibold whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
});

export const SkeletonLoader = ({ rows = 6 }) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="relative overflow-hidden h-[80px] w-full bg-slate-100 rounded-lg">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
    ))}
  </div>
);