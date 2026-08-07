import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import { Plus, Package, X, CheckCircle2, Save, RotateCcw, RefreshCw, Download, ChevronDown, Pencil, Trash2, PackageSearch, Search } from 'lucide-react';
import { inventoryApi } from '../Services/api';

import { PremiumToast } from "../../components/PremiumToast";
import { DataFetchError } from "../../components/DataFetchError";

/* ─────────────────────────────────────────────
   PREMIUM THEME SYSTEM & CSS
───────────────────────────────────────────── */
const typographyStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@400;600;700;800&display=swap');
  
  .font-sora { font-family: 'Sora', sans-serif; }
  .font-inter { font-family: 'Inter', sans-serif; }
  
  body { 
    background-color: #F8FAFC; 
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  .table-header-shadow {
    box-shadow: 0 4px 20px -10px rgba(15,23,42,0.05);
  }
`;

/* ─────────────────────────────────────────────
   SHARED REUSABLE COMPONENTS
───────────────────────────────────────────── */

// --- PREMIUM EDIT MODAL COMPONENT ---
const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        brand: product.brand || '',
        price: product.price || '',
        minimumOrderQuantity: product.minimumOrderQuantity || '',
        bulkDealQuantity: product.bulkDealQuantity || '',
        bulkDealPrice: product.bulkDealPrice || '',
        availableStock: product.availableStock || ''
      });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(product.id, formData);
    setIsSaving(false);
  };

  const inputClass = "w-full h-[50px] sm:h-[56px] px-4 sm:px-5 bg-[#F8FAFC] border border-slate-200 rounded-[12px] sm:rounded-[16px] text-[13px] sm:text-[15px] font-inter font-medium text-[#0F172A] outline-none focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-300/10 transition-all";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0F172A]/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-t-[24px] sm:rounded-[24px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] w-full max-w-[680px] overflow-hidden max-h-[90vh] flex flex-col border border-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-5 sm:py-6 border-b border-slate-200 bg-[#F8FAFC]/80 shrink-0">
            <div>
              <h2 className="font-sora text-[18px] sm:text-[22px] font-bold text-[#0F172A] tracking-[-0.02em]">Edit Asset</h2>
              <p className="font-inter text-[12px] sm:text-[14px] text-[#64748B] mt-1 truncate max-w-[250px] sm:max-w-[450px]">{product.productName}</p>
            </div>
            <button onClick={onClose} className="p-2 sm:p-2.5 text-[#94A3B8] hover:text-[#0F172A] hover:bg-white rounded-full transition-all bg-white shadow-sm border border-slate-200">
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="px-5 sm:px-8 py-6 sm:py-8 overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              
              <div className="sm:col-span-2">
                <label className="block font-inter text-[11px] sm:text-[12px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-2">Brand</label>
                <input type="text" value={formData.brand} onChange={(e) => handleChange('brand', e.target.value)} className={inputClass} required />
              </div>

              <div>
                <label className="block font-inter text-[11px] sm:text-[12px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-2">Base Price (₹)</label>
                <input type="number" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} className={inputClass} required min="0" />
              </div>
              
              <div>
                <label className="block font-inter text-[11px] sm:text-[12px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-2">Min Qty ({product.unit})</label>
                <input type="number" value={formData.minimumOrderQuantity} onChange={(e) => handleChange('minimumOrderQuantity', e.target.value)} className={inputClass} required min="1" />
              </div>

              {/* Bulk Deal Matrix */}
              <div className="sm:col-span-2 p-4 sm:p-6 bg-pink-50/50 border border-pink-100 rounded-[16px] sm:rounded-[20px]">
                <h3 className="font-inter text-[12px] sm:text-[13px] font-bold text-[#0F172A] uppercase tracking-[0.08em] mb-4">Bulk Deal Tier</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                  <div>
                    <label className="block font-inter text-[11px] sm:text-[12px] font-semibold text-[#64748B] mb-1.5">Trigger Qty</label>
                    <input type="number" value={formData.bulkDealQuantity} onChange={(e) => handleChange('bulkDealQuantity', e.target.value)} placeholder="e.g. 50" className={inputClass} />
                  </div>
                  <div>
                    <label className="block font-inter text-[11px] sm:text-[12px] font-semibold text-[#64748B] mb-1.5">Deal Price (₹)</label>
                    <input type="number" value={formData.bulkDealPrice} onChange={(e) => handleChange('bulkDealPrice', e.target.value)} placeholder="e.g. 4500" className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-inter text-[11px] sm:text-[12px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-2">Available Stock</label>
                <input type="number" value={formData.availableStock} onChange={(e) => handleChange('availableStock', e.target.value)} className={inputClass} required min="0" />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3.5 font-inter text-[13px] sm:text-[14px] font-bold text-[#0F172A] bg-white border border-slate-200 rounded-[12px] hover:bg-[#F8FAFC] transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 hover:bg-black text-white text-[13px] sm:text-[14px] font-bold font-inter rounded-[12px] transition-all shadow-sm active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2"
              >
                <Save size={16}/> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────── */

const ActionButtons = React.memo(({ onEdit, onDelete }) => (
  <div className="flex items-center justify-end gap-2">
    <button onClick={onEdit} className="flex items-center justify-center w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] rounded-[10px] border border-slate-200 bg-white text-[#475569] hover:text-pink-600 hover:bg-pink-50 hover:border-pink-200 transition-all shadow-sm active:scale-95">
      <Pencil size={14} strokeWidth={2.5} />
    </button>
    <button onClick={onDelete} className="flex items-center justify-center w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] rounded-[10px] border border-slate-200 bg-white text-[#475569] hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm active:scale-95">
      <Trash2 size={14} strokeWidth={2.5} />
    </button>
  </div>
));

// ✅ WORLD-CLASS SAAS EMPTY STATE
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

const getStockStatus = (stock, capacity) => {
  if (stock <= 0) return 'out';
  const ratio = capacity > 0 ? stock / capacity : 1;
  if (ratio <= 0.15) return 'low';
  return 'available';
};

const StatusBadge = React.memo(({ status }) => {
  const configs = {
    available: { label: 'In Stock', bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', border: 'border-[#10B981]/20', dot: 'bg-[#10B981]' },
    low: { label: 'Low Stock', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-500' },
    out: { label: 'Out of Stock', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', dot: 'bg-rose-500' },
  };
  const config = configs[status] || configs.available;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border ${config.bg} ${config.text} ${config.border} font-sora text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap shadow-sm`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'out' ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  );
});

// ✅ PREMIUM HIGH-FIDELITY SKELETON LOADER
const PremiumSkeletonLoader = ({ rows = 5 }) => (
  <div className="flex flex-col w-full animate-pulse mt-4">
    <div className="hidden lg:block w-full">
       {Array.from({ length: rows }).map((_, i) => (
         <div key={i} className="flex items-center gap-4 px-8 py-5 border-b border-slate-100 bg-white">
           <div className="w-[28%] flex flex-col gap-2 pr-2">
             <div className="h-4 bg-slate-200/80 w-3/4 rounded" />
             <div className="h-3 bg-slate-100 w-1/2 rounded" />
           </div>
           <div className="w-[12%]"><div className="h-4 bg-slate-200/80 w-full rounded" /></div>
           <div className="w-[13%]"><div className="h-6 bg-slate-100 w-16 rounded-md" /></div>
           <div className="w-[13%]"><div className="h-5 bg-slate-200/80 w-20 rounded" /></div>
           <div className="w-[15%]"><div className="h-8 bg-slate-100 w-full rounded-md" /></div>
           <div className="w-[9%]"><div className="h-6 bg-slate-200/80 w-10 mx-auto rounded-md" /></div>
           <div className="w-[10%]"><div className="h-8 bg-slate-200/80 w-full rounded-md" /></div>
         </div>
       ))}
    </div>
    <div className="lg:hidden flex flex-col gap-4">
       {Array.from({ length: rows }).map((_, i) => (
         <div key={i} className="bg-white border border-slate-200 rounded-[16px] p-5 flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2 w-1/2">
                <div className="h-3 bg-slate-100 w-1/2 rounded" />
                <div className="h-4 bg-slate-200/80 w-full rounded" />
              </div>
              <div className="flex flex-col gap-2 w-1/4 items-end">
                <div className="h-5 bg-slate-200/80 w-full rounded" />
                <div className="h-3 bg-slate-100 w-3/4 rounded" />
              </div>
            </div>
            <div className="h-8 bg-slate-100 w-full rounded-md" />
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <div className="h-6 bg-slate-200/80 w-1/3 rounded-md" />
              <div className="h-6 bg-slate-200/80 w-1/4 rounded-md" />
            </div>
         </div>
       ))}
    </div>
  </div>
);

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

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const DEFAULT_FILTERS = { category: 'all', brand: 'all', availability: 'all', sortPrice: 'none', sortStock: 'none' };

export default function ProductListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // --- GLOBAL FETCH ERROR STATE & NOTIFICATION ---
  const [notification, setNotification] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const showNotification = (type, msg) => {
    setNotification({ type, msg });
  };

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // ✅ 1. TANSTACK QUERY: FETCH FILTER OPTIONS
  const { data: filterOptions = { brands: [], categories: [] } } = useQuery({
    queryKey: ['inventoryFilters'],
    queryFn: async () => {
      const res = await inventoryApi.getFilters();
      return res.data;
    },
    staleTime: 10 * 60 * 1000, 
  });

  // ✅ 2. TANSTACK QUERY: FETCH PRODUCTS
  const { 
    data: products = [], 
    isLoading, 
    isError: isFetchError,
    error: fetchError,
    isFetching: isRefreshing,
    refetch 
  } = useQuery({
    queryKey: ['inventoryProducts', debouncedSearch, filters],
    queryFn: async () => {
      const params = {
        search: debouncedSearch,
        category: filters.category,
        brand: filters.brand,
        availability: filters.availability,
        sortPrice: filters.sortPrice,
        sortStock: filters.sortStock
      };
      const res = await inventoryApi.getProducts(params);
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  const handleFilterChange = useCallback((key, value) => setFilters(prev => ({ ...prev, [key]: value })), []);
  const handleReset = useCallback(() => { setFilters(DEFAULT_FILTERS); setSearchTerm(''); }, []);
  const handleRefresh = useCallback(() => refetch(), [refetch]);

  const handleExport = useCallback(async () => {
    try {
      const response = await inventoryApi.exportCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showNotification('success', "Export successful!");
    } catch (error) {
      showNotification('error', error.response?.data?.message || "Export failed. Please try again.");
    }
  }, []);

  const handleDeleteProduct = async (id) => {
    if(!window.confirm("Are you sure you want to permanently delete this asset?")) return;
    try {
      await inventoryApi.deleteProduct(id);
      // Optimistically update cache
      queryClient.setQueryData(['inventoryProducts', debouncedSearch, filters], (old) => 
        old ? old.filter(p => p.id !== id) : []
      );
      showNotification('success', "Product successfully deleted from catalog.");
    } catch (error) {
      showNotification('error', error.response?.data?.message || "Failed to delete product.");
    }
  };

  const handleUpdateProduct = async (id, updatedData) => {
    try {
      const response = await inventoryApi.updateProduct(id, updatedData);
      const updatedProduct = response.data;
      
      // Optimistically update cache
      queryClient.setQueryData(['inventoryProducts', debouncedSearch, filters], (old) => 
        old ? old.map(p => (p.id === id ? updatedProduct : p)) : []
      );
      
      setEditingProduct(null);
      showNotification('success', "Product details updated and synced across catalog.");
    } catch (error) {
      showNotification('error', error.response?.data?.message || "Failed to update product details. Please try again.");
    }
  };

  const isFiltered = searchTerm.trim() !== '' || filters.category !== 'all' || filters.brand !== 'all' || filters.availability !== 'all';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: typographyStyles }} />
      <div className="min-h-screen font-inter antialiased flex flex-col w-full overflow-x-hidden pt-2 pb-12 ">
        
        {/* --- PREMIUM TOAST GLOBAL REPLACEMENT --- */}
        <PremiumToast 
          isVisible={!!notification} 
          type={notification?.type || 'info'} 
          message={notification?.msg} 
          onClose={() => setNotification(null)} 
        />

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[1440px] mx-auto flex flex-col flex-1 h-full"
        >
          {/* --- RENDER ERROR COMPONENT AS FULL PAGE REPLACEMENT --- */}
          {isFetchError ? (
            <DataFetchError 
              errorTitle="Connection Failed"
              errorMessage={fetchError?.response?.data?.message || fetchError?.message || "An unexpected error occurred."} 
              onRetry={refetch} 
            />
          ) : (
            <div className="flex flex-col w-full flex-1 bg-white sm:border sm:border-slate-200 min-h-[calc(100vh-40px)] overflow-hidden">
              
              {/* 1. Header Area */}
              <div className="px-4 sm:px-6 pt-6 sm:pt-6 flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">
                <div className="max-w-3xl">
                  <h1 className="text-[24px] sm:text-[32px] font-sora font-extrabold text-[#0F172A] tracking-[-0.03em] leading-[1.2]">
                    Inventory Management
                  </h1>
                  <p className="text-[13px] sm:text-[14px] font-inter font-normal text-[#475569] mt-2 sm:mt-3 leading-[1.6]">
                    Monitor and optimize your product stock, base pricing, and bulk thresholds from a centralized enterprise workspace.
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:py-3 rounded-[12px] bg-slate-50 border border-slate-200 shadow-sm shrink-0">
                    <Package size={18} className="text-gray-900" />
                    <span className="text-[11px] sm:text-[12px] font-sora font-bold uppercase tracking-[0.1em] text-[#0F172A]">
                      {isLoading ? "..." : products.length.toLocaleString('en-IN')} Active
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Search & Filter Area */}
              <div className="px-4 sm:px-6 mt-6 sm:mt-8 flex flex-col gap-4 w-full">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
                <FilterBar 
                  categories={filterOptions.categories} 
                  brands={filterOptions.brands} 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                  onReset={handleReset} 
                  onRefresh={handleRefresh} 
                  onExport={handleExport} 
                  isRefreshing={isRefreshing} 
                />
              </div>

              {/* 3. Table Control Header (Between Filters & List) */}
              <div className="px-4 sm:px-8 mt-6 w-full">
                <div className="flex items-center justify-between py-4 border-b border-slate-200">
                  <h3 className="font-sora font-bold text-[#0F172A] text-[14px] sm:text-[16px]">All Products</h3>
                  <button 
                    onClick={() => navigate('/add')} 
                    className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-[12px] sm:text-[13px] font-bold font-inter rounded-[10px] transition-all shadow-sm active:scale-95"
                  >
                    <Plus size={16} /> Add Product
                  </button>
                </div>
              </div>

              {/* 4. Data Grid Area */}
              <div className="w-full flex flex-col flex-1 bg-white">
                {isLoading ? (
                  <div className="px-4 sm:px-8 pb-10"><PremiumSkeletonLoader rows={6} /></div>
                ) : products.length === 0 ? (
                  // ✅ WORLD CLASS SAAS EMPTY STATE
                  <div className="px-4 sm:px-8 pb-10 flex-1 flex flex-col justify-center">
                    <PremiumEmptyState isFiltered={isFiltered} onAddProduct={() => navigate('/add')} onReset={handleReset} />
                  </div>
                ) : (
                  <div className="w-full flex flex-col flex-1 h-full">
                    
                    {/* DESKTOP VIEW */}
                    <div className="hidden lg:block w-full flex-1">
                      <table className="w-full text-left border-collapse table-fixed">
                        <colgroup>
                          <col className="w-[28%]" /> {/* Product & ID */}
                          <col className="w-[12%]" /> {/* Brand */}
                          <col className="w-[13%]" /> {/* Min Qty */}
                          <col className="w-[13%]" /> {/* Base Price */}
                          <col className="w-[15%]" /> {/* Bulk Tier */}
                          <col className="w-[9%]" />  {/* Stock */}
                          <col className="w-[10%]" /> {/* Action */}
                        </colgroup>
                        <thead className="bg-white border-b border-slate-200">
                          <tr>
                            <th className="py-4 pl-8 pr-3 text-[11px] font-inter font-bold uppercase tracking-[0.1em] text-[#94A3B8]">Product & ID</th>
                            <th className="py-4 px-3 text-[11px] font-inter font-bold uppercase tracking-[0.1em] text-[#94A3B8]">Brand</th>
                            <th className="py-4 px-3 text-[11px] font-inter font-bold uppercase tracking-[0.1em] text-[#94A3B8]">Min Qty</th>
                            <th className="py-4 px-3 text-[11px] font-inter font-bold uppercase tracking-[0.1em] text-[#94A3B8]">Base Price</th>
                            <th className="py-4 px-3 text-[11px] font-inter font-bold uppercase tracking-[0.1em] text-[#94A3B8]">Bulk Tier</th>
                            <th className="py-4 px-3 text-[11px] font-inter font-bold uppercase tracking-[0.1em] text-[#94A3B8] text-center">Stock</th>
                            <th className="py-4 pr-8 pl-3 text-[11px] font-inter font-bold uppercase tracking-[0.1em] text-[#94A3B8] text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {products.map((product) => {
                            const status = getStockStatus(product.availableStock, product.minimumOrderQuantity);

                            return (
                              <motion.tr 
                                key={product.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="group border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                              >
                                <td className="py-4 pl-8 pr-3 align-middle overflow-hidden text-ellipsis whitespace-nowrap">
                                  <div className="flex flex-col gap-1 pr-2">
                                    <span className="font-sora text-[13px] font-bold text-[#0F172A] truncate" title={product.productName}>
                                      {product.productName}
                                    </span>
                                    <span className="font-inter text-[11px] text-[#94A3B8] font-medium truncate">
                                      ID: {product.id.substring(0,8).toUpperCase()} <span className="mx-1">•</span> {product.category}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-3 align-middle overflow-hidden text-ellipsis whitespace-nowrap">
                                  <span className="font-sora text-[12px] font-bold text-[#475569] truncate block">
                                    {product.brand}
                                  </span>
                                </td>
                                <td className="py-4 px-3 align-middle">
                                  <span className="inline-flex items-center px-2 py-1 rounded-[6px] bg-slate-100 border border-slate-200 text-[#475569] font-sora text-[11px] font-bold uppercase tracking-wide">
                                    {product.minimumOrderQuantity} {product.unit}
                                  </span>
                                </td>
                                <td className="py-4 px-3 align-middle">
                                  <div className="flex items-baseline gap-1">
                                    <span className="font-sora text-[14px] font-[800] text-[#0F172A]">
                                      ₹{product.price.toLocaleString('en-IN')}
                                    </span>
                                    <span className="font-inter text-[11px] font-medium text-[#94A3B8]">/{product.unit}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-3 align-middle">
                                  <div className="flex flex-col gap-0.5">
                                    {product.bulkDealQuantity && product.bulkDealPrice ? (
                                      <>
                                        <span className="font-inter text-[10px] font-bold text-pink-600 uppercase tracking-widest">
                                          Bulk {product.bulkDealQuantity}+
                                        </span>
                                        <span className="font-sora text-[13px] font-bold text-[#0F172A]">
                                          ₹{product.bulkDealPrice.toLocaleString('en-IN')}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="font-inter text-[11px] text-[#94A3B8] italic">No tier</span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 px-3 align-middle text-center">
                                  <div className="flex flex-col items-center justify-center gap-1.5">
                                    <StatusBadge status={status} />
                                    <span className={`text-[13px] font-sora font-bold ${status === 'out' ? 'text-rose-600' : status === 'low' ? 'text-amber-600' : 'text-[#0F172A]'}`}>
                                      {product.availableStock}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 pr-8 pl-3 align-middle text-right">
                                  <ActionButtons 
                                    onEdit={() => setEditingProduct(product)} 
                                    onDelete={() => handleDeleteProduct(product.id)} 
                                  />
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* MOBILE / TABLET VIEW */}
                    <div className="flex flex-col gap-4 lg:hidden w-full px-3 sm:px-4 py-4 bg-slate-50 min-h-screen border-t border-slate-100">
                      {products.map((product) => {
                        const status = getStockStatus(product.availableStock, product.minimumOrderQuantity);
                        return (
                          <div key={product.id} className="p-4 sm:p-5 flex flex-col gap-4 bg-white border border-slate-200 rounded-[16px] shadow-sm w-full">
                            
                            <div className="flex flex-col overflow-hidden w-full">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-inter text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] text-[#0F172A] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-[4px]">{product.brand}</span>
                                <span className="font-inter text-[9px] sm:text-[10px] text-[#94A3B8] font-semibold truncate">ID: {product.id.substring(0,8).toUpperCase()}</span>
                              </div>
                              <h3 className="font-sora text-[14px] sm:text-[16px] font-bold text-[#0F172A] leading-[1.3] truncate w-full">{product.productName}</h3>
                            </div>

                            <div className="flex items-center justify-between border-y border-slate-100 py-3 mt-1">
                              <div className="flex flex-col min-w-0 flex-1 border-r border-slate-100 pr-2">
                                <span className="font-inter text-[9px] sm:text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-1">Base Price</span>
                                <span className="font-sora text-[13px] sm:text-[14px] font-[800] text-[#0F172A] truncate">₹{product.price.toLocaleString('en-IN')}<span className="text-[9px] sm:text-[10px] text-[#94A3B8] font-normal font-inter">/{product.unit}</span></span>
                              </div>
                              <div className="flex flex-col min-w-0 flex-1 border-r border-slate-100 px-2 sm:px-4">
                                <span className="font-inter text-[9px] sm:text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-1">Min Qty</span>
                                <span className="font-sora text-[12px] sm:text-[13px] font-bold text-[#0F172A] truncate">{product.minimumOrderQuantity} {product.unit}</span>
                              </div>
                              <div className="flex flex-col min-w-0 flex-1 pl-2 sm:pl-4">
                                <span className="font-inter text-[9px] sm:text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-1">Stock</span>
                                <span className={`font-sora text-[13px] sm:text-[14px] font-bold truncate ${status === 'out' ? 'text-rose-600' : status === 'low' ? 'text-amber-600' : 'text-[#10B981]'}`}>{product.availableStock}</span>
                              </div>
                            </div>

                            {product.bulkDealQuantity && product.bulkDealPrice && (
                              <div className="bg-pink-50 border border-pink-100 rounded-[12px] p-3 sm:p-3.5 flex justify-between items-center w-full">
                                 <div className="flex flex-col min-w-0 pr-2">
                                   <span className="font-inter text-[9px] sm:text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em]">Bulk Deal</span>
                                   <span className="font-sora text-[12px] sm:text-[13px] font-bold text-[#0F172A] mt-0.5 truncate">{product.bulkDealQuantity}+ {product.unit}s</span>
                                 </div>
                                 <div className="flex flex-col items-end min-w-0 pl-2">
                                   <span className="font-inter text-[9px] sm:text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em]">Special Price</span>
                                   <span className="font-sora text-[13px] sm:text-[15px] font-[800] text-pink-600 mt-0.5 truncate">₹{product.bulkDealPrice.toLocaleString('en-IN')}</span>
                                 </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-1">
                              <StatusBadge status={status} />
                              <ActionButtons 
                                onEdit={() => setEditingProduct(product)} 
                                onDelete={() => handleDeleteProduct(product.id)} 
                              />
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.main>

        {/* --- OVERLAYS --- */}
        {!fetchError && (
          <EditProductModal 
            isOpen={!!editingProduct} 
            product={editingProduct} 
            onClose={() => setEditingProduct(null)} 
            onSave={handleUpdateProduct} 
          />
        )}
      </div>
    </>
  );
}