import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, X, CheckCircle2, Save } from 'lucide-react';
import { inventoryApi } from '../Services/api';
import FilterBar from './FilterBar';
import { ActionButtons, EmptyState, SearchBar, StatusBadge, getStockStatus, SkeletonLoader } from './InventoryUI';

// --- PREMIUM TOAST COMPONENT ---
const PremiumToast = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[100] flex items-center gap-3 px-4 py-3.5 bg-white border border-emerald-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-[slideInUp_0.4s_ease-out] w-[calc(100%-32px)] sm:w-auto">
      <div className="flex items-center justify-center w-8 h-8 bg-emerald-50 rounded-full text-emerald-500 shrink-0">
        <CheckCircle2 size={18} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col pr-2 sm:pr-4">
        <span className="font-sora text-[13px] sm:text-[14px] font-bold text-slate-900">Success</span>
        <span className="font-inter text-[12px] sm:text-[13px] font-medium text-slate-500 leading-tight">{message}</span>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors ml-auto">
        <X size={16} />
      </button>
    </div>
  );
};

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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-t-[20px] sm:rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] w-full max-w-[600px] overflow-hidden sm:animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div>
            <h2 className="font-sora text-[18px] sm:text-xl font-bold text-slate-900">Edit Asset</h2>
            <p className="font-inter text-[12px] sm:text-[13px] text-slate-500 font-medium mt-0.5 truncate max-w-[250px] sm:max-w-[400px]">{product.productName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all bg-white sm:bg-transparent shadow-sm sm:shadow-none">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 sm:py-6 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            
            {/* Brand */}
            <div className="sm:col-span-2">
              <label className="block font-inter text-[11px] sm:text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                className="w-full h-10 sm:h-11 px-3 sm:px-4 bg-slate-50 border border-slate-200 rounded-[10px] sm:rounded-xl text-[13px] sm:text-[14px] font-medium text-slate-900 outline-none focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all"
                required
              />
            </div>

            {/* Price & MOQ */}
            <div>
              <label className="block font-inter text-[11px] sm:text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">Base Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full h-10 sm:h-11 px-3 sm:px-4 bg-slate-50 border border-slate-200 rounded-[10px] sm:rounded-xl text-[13px] sm:text-[14px] font-medium text-slate-900 outline-none focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block font-inter text-[11px] sm:text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">Min Qty ({product.unit})</label>
              <input
                type="number"
                value={formData.minimumOrderQuantity}
                onChange={(e) => handleChange('minimumOrderQuantity', e.target.value)}
                className="w-full h-10 sm:h-11 px-3 sm:px-4 bg-slate-50 border border-slate-200 rounded-[10px] sm:rounded-xl text-[13px] sm:text-[14px] font-medium text-slate-900 outline-none focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all"
                required
                min="1"
              />
            </div>

            {/* Bulk Deal Matrix */}
            <div className="sm:col-span-2 p-3 sm:p-4 bg-pink-50/50 border border-pink-100 rounded-[12px] sm:rounded-xl">
              <h3 className="font-inter text-[11px] sm:text-[12px] font-bold text-pink-700 uppercase tracking-wide mb-2 sm:mb-3">Bulk Deal Tier</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-inter text-[11px] sm:text-[12px] font-semibold text-pink-600 mb-1 sm:mb-1.5">Trigger Qty</label>
                  <input
                    type="number"
                    value={formData.bulkDealQuantity}
                    onChange={(e) => handleChange('bulkDealQuantity', e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full h-9 sm:h-10 px-3 bg-white border border-pink-200 rounded-lg text-[12px] sm:text-[13px] font-medium text-pink-950 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block font-inter text-[11px] sm:text-[12px] font-semibold text-pink-600 mb-1 sm:mb-1.5">Deal Price (₹)</label>
                  <input
                    type="number"
                    value={formData.bulkDealPrice}
                    onChange={(e) => handleChange('bulkDealPrice', e.target.value)}
                    placeholder="e.g. 4500"
                    className="w-full h-9 sm:h-10 px-3 bg-white border border-pink-200 rounded-lg text-[12px] sm:text-[13px] font-medium text-pink-950 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="sm:col-span-2">
              <label className="block font-inter text-[11px] sm:text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">Available Stock</label>
              <input
                type="number"
                value={formData.availableStock}
                onChange={(e) => handleChange('availableStock', e.target.value)}
                className="w-full h-10 sm:h-11 px-3 sm:px-4 bg-slate-50 border border-slate-200 rounded-[10px] sm:rounded-xl text-[13px] sm:text-[14px] font-medium text-slate-900 outline-none focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all"
                required
                min="0"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 sm:mt-8 pt-4 sm:pt-0 border-t border-slate-100 sm:border-none">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-2.5 font-inter text-[12px] sm:text-[13px] font-bold text-slate-600 bg-white border border-slate-200 rounded-[10px] sm:rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-2.5 font-inter text-[12px] sm:text-[13px] font-bold text-white bg-slate-900 rounded-[10px] sm:rounded-xl hover:bg-black transition-all shadow-md active:scale-95 disabled:opacity-70"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const DEFAULT_FILTERS = { category: 'all', brand: 'all', availability: 'all', sortPrice: 'none', sortStock: 'none' };

export default function ProductListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ brands: [], categories: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Modal & Toast States
  const [editingProduct, setEditingProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filters]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = {
        search: searchTerm,
        category: filters.category,
        brand: filters.brand,
        availability: filters.availability,
        sortPrice: filters.sortPrice,
        sortStock: filters.sortStock
      };
      const res = await inventoryApi.getProducts(params);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const res = await inventoryApi.getFilters();
      setFilterOptions(res.data);
    } catch (error) {
      console.error("Failed to fetch filters", error);
    }
  };

  const handleFilterChange = useCallback((key, value) => setFilters(prev => ({ ...prev, [key]: value })), []);
  const handleReset = useCallback(() => { setFilters(DEFAULT_FILTERS); setSearchTerm(''); }, []);
  const handleRefresh = useCallback(() => { setIsRefreshing(true); fetchProducts(); }, [filters, searchTerm]);

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
    } catch (error) {
      console.error("Export failed", error);
    }
  }, []);

  const handleDeleteProduct = async (id) => {
    if(!window.confirm("Are you sure you want to permanently delete this asset?")) return;
    try {
      await inventoryApi.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast("Product successfully deleted from catalog.");
    } catch (error) {
      alert("Failed to delete product.");
    }
  };

  const handleUpdateProduct = async (id, updatedData) => {
    try {
      const response = await inventoryApi.updateProduct(id, updatedData);
      const updatedProduct = response.data;
      
      setProducts(prev => prev.map(p => (p.id === id ? updatedProduct : p)));
      
      setEditingProduct(null);
      showToast("Product details updated and synced across catalog.");
    } catch (error) {
      alert("Failed to update product details. Please try again.");
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const isFiltered = searchTerm.trim() !== '' || filters.category !== 'all' || filters.brand !== 'all' || filters.availability !== 'all';

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .no-scrollbar::-webkit-scrollbar { display: none; } 
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="min-h-screen bg-[#F8FAFC] font-inter text-[#0F1626] pb-24">
        <div className="max-w-[1440px] mx-auto px-3 md:px-3 pt-3 sm:pt-3 flex flex-col gap-4 sm:gap-5">
          
          {/* Hero Section */}
          <section className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 p-5 sm:p-8 md:px-10 bg-white border border-slate-200 rounded-[20px] sm:rounded-[24px] shadow-sm overflow-hidden">
            <div className="absolute -top-[60%] -right-[10%] w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] bg-[radial-gradient(circle,rgba(236,72,153,0.06),transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-1.5 sm:gap-2.5 max-w-[560px]">
              <span className="font-inter text-[10px] sm:text-[11px] font-bold tracking-[0.08em] uppercase text-pink-600">
                Inventory Workspace
              </span>
              <h1 className="font-sora text-[24px] sm:text-[32px] font-extrabold tracking-tight text-slate-900 leading-tight">
                Product Catalog
              </h1>
              <p className="font-inter text-[13px] sm:text-[15px] text-slate-500 leading-relaxed m-0">
                Manage your base pricing, bulk tier thresholds, and stock allocation from a centralized workspace.
              </p>
            </div>
            
            <div className="relative z-10 w-full md:w-auto">
              <div className="flex items-center gap-3.5 px-5 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-[14px] sm:rounded-[16px] shadow-sm w-full md:w-max">
                <div className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-[10px] sm:rounded-xl text-pink-500 shrink-0 shadow-sm">
                  <Package size={20} strokeWidth={2.25} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-sora text-[22px] sm:text-[26px] font-extrabold text-slate-900 leading-[1.1]">
                    {products.length.toLocaleString('en-IN')}
                  </span>
                  <span className="font-inter text-[11px] sm:text-[12px] font-semibold text-slate-500">Active Assets</span>
                </div>
              </div>
            </div>
          </section>

          {/* Search & Filters */}
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

          {/* Data Grid Section */}
          <div className="flex flex-col gap-3 sm:gap-4 mt-1 sm:mt-2">
            <div className="flex items-end justify-between px-1 sm:px-2">
              <div className="flex flex-col gap-1">
                <span className="font-inter text-[10px] sm:text-[11px] font-bold tracking-[0.06em] uppercase text-slate-400">Master Sheet</span>
              </div>
              <button onClick={() => navigate('/add')} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 font-sora text-[12px] sm:text-[13px] font-bold text-white bg-slate-900 rounded-[10px] sm:rounded-xl shadow-md hover:bg-black transition-all active:scale-95">
                <Plus size={16} strokeWidth={2.5} /> <span className="hidden xs:inline">Add Products</span><span className="xs:hidden">Add</span>
              </button>
            </div>

            {isLoading ? (
              <SkeletonLoader rows={6} />
            ) : products.length === 0 ? (
              <EmptyState isFiltered={isFiltered} onAddProduct={() => navigate('/add')} onReset={handleReset} />
            ) : (
              <div className="w-full flex flex-col">
                
                {/* ========================================== */}
                {/* DESKTOP VIEW: Table Format                 */}
                {/* ========================================== */}
                <div className="hidden lg:block w-full overflow-x-auto pb-4">
                  <div className="min-w-[1100px] flex flex-col gap-3">
                    
                    <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1.5fr_1fr_1fr_80px] gap-4 px-5 pb-2 font-inter text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                      <span>Product & ID</span>
                      <span>Brand</span>
                      <span>Min Qty & Unit</span>
                      <span>Base Price</span>
                      <span>Bulk Tier</span>
                      <span className="text-center">Stock</span>
                      <span>Updated</span>
                      <span className="text-right">Action</span>
                    </div>

                    {products.map((product) => {
                      const status = getStockStatus(product.availableStock, product.minimumOrderQuantity);
                      const dateObj = new Date(product.updatedAt);
                      const isToday = dateObj.toDateString() === new Date().toDateString();

                      return (
                        <div key={product.id} className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1.5fr_1fr_1fr_80px] items-center gap-4 min-h-[80px] px-5 py-3.5 bg-white border border-slate-200 rounded-[16px] shadow-sm hover:shadow-md hover:-translate-y-[1px] hover:border-pink-200 transition-all duration-[220ms] ease-out group">
                          
                          {/* 1. Product Name */}
                          <div className="flex flex-col gap-1 overflow-hidden pr-2">
                            <span className="font-sora text-[14px] font-bold text-slate-900 truncate group-hover:text-pink-600 transition-colors" title={product.productName}>
                              {product.productName}
                            </span>
                            <span className="font-inter text-[11px] text-slate-500 truncate font-medium">
                              ID: {product.id.substring(0,8).toUpperCase()} <span className="text-slate-300 mx-1">•</span> {product.category}
                            </span>
                          </div>

                          {/* 2. Brand */}
                          <div className="font-sora text-[12px] font-bold text-slate-700 truncate">
                            {product.brand}
                          </div>

                          {/* 3. Min Qty & Unit */}
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2 py-1 rounded-[6px] bg-slate-50 border border-slate-200 text-slate-700 font-sora text-[11px] font-bold tracking-wide">
                              {product.minimumOrderQuantity} {product.unit}
                            </span>
                          </div>

                          {/* 4. Base Price */}
                          <div className="flex items-baseline gap-1">
                            <span className="font-sora text-[15px] font-bold text-slate-900">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            <span className="font-inter text-[11px] font-medium text-slate-400">/{product.unit}</span>
                          </div>

                          {/* 5. Bulk Deal Tier */}
                          <div className="flex flex-col gap-0.5">
                            {product.bulkDealQuantity && product.bulkDealPrice ? (
                              <>
                                <span className="font-inter text-[11px] font-bold text-pink-600 uppercase tracking-wide">
                                  {product.bulkDealQuantity}+ {product.unit}s
                                </span>
                                <span className="font-sora text-[13px] font-bold text-slate-900">
                                  ₹{product.bulkDealPrice.toLocaleString('en-IN')}
                                </span>
                              </>
                            ) : (
                              <span className="font-inter text-[11px] font-medium text-slate-400 italic">No bulk tier</span>
                            )}
                          </div>

                          {/* 6. Stock & Status */}
                          <div className="flex flex-col items-center justify-center gap-1.5">
                            <StatusBadge status={status} />
                            <div className="flex items-baseline gap-1 font-inter">
                              <span className={`text-[13px] font-sora font-bold ${status === 'out' ? 'text-rose-600' : status === 'low' ? 'text-amber-600' : 'text-slate-900'}`}>
                                {product.availableStock}
                              </span>
                            </div>
                          </div>

                          {/* 7. Updated */}
                          <div className="flex flex-col gap-0.5">
                            <span className="font-sora text-[12px] font-bold text-slate-700">
                              {isToday ? 'Today' : dateObj.toLocaleDateString('en-IN', { month: 'short', day: '2-digit' })}
                            </span>
                            <span className="font-inter text-[11px] text-slate-400 font-medium">
                              {dateObj.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                            </span>
                          </div>

                          {/* 8. Actions */}
                          <ActionButtons 
                            onEdit={() => setEditingProduct(product)} 
                            onDelete={() => handleDeleteProduct(product.id)} 
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ========================================== */}
                {/* MOBILE / TABLET VIEW: Card Format          */}
                {/* ========================================== */}
                <div className="flex flex-col gap-3 sm:gap-4 lg:hidden w-full pb-4">
                  {products.map((product) => {
                    const status = getStockStatus(product.availableStock, product.minimumOrderQuantity);
                    return (
                      <div key={product.id} className="bg-white border border-slate-200 rounded-[16px] p-4 flex flex-col gap-3 shadow-sm relative group overflow-hidden">
                        
                        {/* Top: Name, Status & Brand */}
                        <div className="flex items-start justify-between gap-3 w-full">
                          <div className="flex flex-col flex-1 overflow-hidden">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-inter text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 border border-pink-100 px-1.5 py-0.5 rounded-[4px]">{product.brand}</span>
                              <span className="font-inter text-[10px] text-slate-400 font-medium truncate">ID: {product.id.substring(0,8).toUpperCase()}</span>
                            </div>
                            <h3 className="font-sora text-[14px] sm:text-[15px] font-bold text-slate-900 leading-tight truncate w-full">{product.productName}</h3>
                          </div>
                        </div>

                        {/* Middle: 3-Col Data Grid */}
                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 bg-slate-50/50 rounded-lg p-2">
                          <div className="flex flex-col">
                            <span className="font-inter text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Base Price</span>
                            <span className="font-sora text-[13px] sm:text-[14px] font-bold text-slate-900 truncate">₹{product.price.toLocaleString('en-IN')}<span className="text-[10px] text-slate-400 font-medium">/{product.unit}</span></span>
                          </div>
                          <div className="flex flex-col border-l border-slate-200 pl-2">
                            <span className="font-inter text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Min Qty</span>
                            <span className="font-sora text-[13px] sm:text-[14px] font-bold text-slate-900 truncate">{product.minimumOrderQuantity} {product.unit}</span>
                          </div>
                          <div className="flex flex-col border-l border-slate-200 pl-2">
                            <span className="font-inter text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Stock</span>
                            <span className={`font-sora text-[13px] sm:text-[14px] font-bold truncate ${status === 'out' ? 'text-rose-600' : status === 'low' ? 'text-amber-600' : 'text-emerald-600'}`}>{product.availableStock}</span>
                          </div>
                        </div>

                        {/* Bulk Deal Section (Full Width if exists) */}
                        {product.bulkDealQuantity && product.bulkDealPrice && (
                          <div className="bg-pink-50 border border-pink-100 rounded-lg p-2 flex justify-between items-center">
                             <div className="flex flex-col">
                               <span className="font-inter text-[9px] font-bold text-pink-700 uppercase tracking-wider">Bulk Deal Trigger</span>
                               <span className="font-sora text-[12px] font-bold text-slate-900">{product.bulkDealQuantity}+ {product.unit}s</span>
                             </div>
                             <div className="flex flex-col items-end">
                               <span className="font-inter text-[9px] font-bold text-pink-700 uppercase tracking-wider">Special Price</span>
                               <span className="font-sora text-[13px] font-extrabold text-pink-600">₹{product.bulkDealPrice.toLocaleString('en-IN')}</span>
                             </div>
                          </div>
                        )}

                        {/* Bottom: Actions */}
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
      </div>

      {/* --- OVERLAYS --- */}
      <EditProductModal 
        isOpen={!!editingProduct} 
        product={editingProduct} 
        onClose={() => setEditingProduct(null)} 
        onSave={handleUpdateProduct} 
      />
      <PremiumToast 
        message={toastMessage} 
        isVisible={!!toastMessage} 
        onClose={() => setToastMessage('')} 
      />
    </>
  );
}