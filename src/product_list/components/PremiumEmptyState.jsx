import React from 'react';
import { PackageSearch, RotateCcw, Plus } from 'lucide-react';

const PremiumEmptyState = ({ isFiltered, onAddProduct, onReset }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center rounded-[24px] bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-sm relative overflow-hidden min-h-[450px] w-full mt-4 mb-8">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-20" />
    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6 relative">
      <div className="absolute inset-0 bg-pink-500/5 rounded-2xl animate-pulse" />
      <PackageSearch className="w-10 h-10 text-slate-300 relative z-10" />
    </div>
    <h3 className="text-[20px] sm:text-[22px] font-sora font-extrabold tracking-tight text-slate-900 mb-2">No Products Found</h3>
    <p className="text-[14px] text-slate-500 max-w-md mb-8 leading-relaxed font-inter">
      {isFiltered ? 'No products match your current filters. Try adjusting or resetting them.' : 'Start adding products to build your wholesale inventory and scale your business.'}
    </p>
    {isFiltered ? (
      <button onClick={onReset} className="rounded-xl bg-pink-50 text-pink-600 px-8 py-3.5 text-[14px] font-bold transition-all hover:bg-pink-100 shadow-sm active:scale-95 border border-pink-100 flex items-center gap-2">
        <RotateCcw size={16} strokeWidth={2.5} /> Reset Filters
      </button>
    ) : (
      <button onClick={onAddProduct} className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-black text-white text-[14px] font-bold font-inter rounded-xl transition-all shadow-md active:scale-95">
        <Plus size={18} strokeWidth={2.5} /> Add Product
      </button>
    )}
  </div>
);

export default PremiumEmptyState;