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
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3.5 bg-white border border-emerald-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-[slideInUp_0.4s_ease-out]">
      <div className="flex items-center justify-center w-8 h-8 bg-emerald-50 rounded-full text-emerald-500">
        <CheckCircle2 size={18} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col pr-4">
        <span className="font-['Manrope',_sans-serif] text-[14px] font-bold text-slate-900">Success</span>
        <span className="font-['Inter',_sans-serif] text-[13px] font-medium text-slate-500">{message}</span>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors ml-2">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] w-full max-w-[600px] overflow-hidden animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="font-['Manrope',_sans-serif] text-xl font-bold text-slate-900">Edit Product Asset</h2>
            <p className="font-['Inter',_sans-serif] text-[13px] text-slate-500 font-medium mt-0.5">{product.productName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="grid grid-cols-2 gap-5">
            
            {/* Brand */}
            <div className="col-span-2">
              <label className="block font-['Inter',_sans-serif] text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                required
              />
            </div>

            {/* Price & MOQ */}
            <div>
              <label className="block font-['Inter',_sans-serif] text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">Base Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block font-['Inter',_sans-serif] text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">Min Qty ({product.unit})</label>
              <input
                type="number"
                value={formData.minimumOrderQuantity}
                onChange={(e) => handleChange('minimumOrderQuantity', e.target.value)}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                required
                min="1"
              />
            </div>

            {/* Bulk Deal Matrix */}
            <div className="col-span-2 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <h3 className="font-['Inter',_sans-serif] text-[12px] font-bold text-indigo-700 uppercase tracking-wide mb-3">Bulk Deal Tier</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-['Inter',_sans-serif] text-[12px] font-semibold text-indigo-600 mb-1.5">Trigger Qty</label>
                  <input
                    type="number"
                    value={formData.bulkDealQuantity}
                    onChange={(e) => handleChange('bulkDealQuantity', e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full h-10 px-3 bg-white border border-indigo-200 rounded-lg text-[13px] font-medium text-indigo-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block font-['Inter',_sans-serif] text-[12px] font-semibold text-indigo-600 mb-1.5">Deal Price (₹)</label>
                  <input
                    type="number"
                    value={formData.bulkDealPrice}
                    onChange={(e) => handleChange('bulkDealPrice', e.target.value)}
                    placeholder="e.g. 4500"
                    className="w-full h-10 px-3 bg-white border border-indigo-200 rounded-lg text-[13px] font-medium text-indigo-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="col-span-2">
              <label className="block font-['Inter',_sans-serif] text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">Available Stock</label>
              <input
                type="number"
                value={formData.availableStock}
                onChange={(e) => handleChange('availableStock', e.target.value)}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                required
                min="0"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 font-['Inter',_sans-serif] text-[13px] font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 font-['Inter',_sans-serif] text-[13px] font-bold text-white bg-slate-900 rounded-xl hover:bg-black transition-all shadow-md active:scale-95 disabled:opacity-70"
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

  // --- Real-time Update Handler ---
  const handleUpdateProduct = async (id, updatedData) => {
    try {
      const response = await inventoryApi.updateProduct(id, updatedData);
      const updatedProduct = response.data;
      
      // Update state instantly without page refresh
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
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}} />

      <div className="min-h-screen bg-[#F9FAFB] font-['Inter',_sans-serif] text-[#0F1626] pb-24">
        <div className="max-w-[1480px] mx-auto px-6 pt-8 flex flex-col gap-5">
          
          {/* Hero Section */}
          <section className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 md:px-10 bg-white border border-slate-200 rounded-[24px] shadow-[0_1px_3px_rgba(16,24,40,0.06)] overflow-hidden">
            <div className="absolute -top-[60%] -right-[10%] w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(23,178,106,0.08),transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-2.5 max-w-[560px]">
              <span className="font-['Inter',_sans-serif] text-[11px] font-bold tracking-[0.08em] uppercase text-[#079455]">
                Inventory Workspace
              </span>
              <h1 className="font-['Manrope',_sans-serif] text-[32px] font-extrabold tracking-[-0.01em] text-[#0F1626] leading-tight">
                Product Catalog
              </h1>
              <p className="font-['Inter',_sans-serif] text-[15px] text-slate-500 leading-relaxed m-0">
                Manage your base pricing, bulk tier thresholds, and stock allocation from a centralized workspace.
              </p>
            </div>
            
            <div className="relative z-10 flex-shrink-0">
              <div className="flex items-center gap-3.5 px-6 py-4 bg-slate-50 border border-slate-200 rounded-[16px] shadow-[0_4px_12px_rgba(16,24,40,0.06)]">
                <div className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl text-[#079455] flex-shrink-0">
                  <Package size={20} strokeWidth={2.25} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-['Manrope',_sans-serif] text-[26px] font-extrabold text-[#0F1626] leading-[1.1]">
                    {products.length.toLocaleString('en-IN')}
                  </span>
                  <span className="font-['Inter',_sans-serif] text-[12px] font-semibold text-slate-500">Active Assets</span>
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
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-end justify-between px-2">
              <div className="flex flex-col gap-1">
                <span className="font-['Inter',_sans-serif] text-[11px] font-bold tracking-[0.06em] uppercase text-slate-400">Master Sheet</span>
              </div>
              <button onClick={() => navigate('/add')} className="flex items-center gap-2 px-4 py-2.5 font-['Inter',_sans-serif] text-[13px] font-semibold text-white bg-slate-900 rounded-xl shadow-md hover:bg-black transition-all active:scale-95">
                <Plus size={16} strokeWidth={2.5} /> Add Products
              </button>
            </div>

            {isLoading ? (
              <SkeletonLoader rows={6} />
            ) : products.length === 0 ? (
              <EmptyState isFiltered={isFiltered} onAddProduct={() => navigate('/add')} onReset={handleReset} />
            ) : (
              <div className="w-full overflow-x-auto pb-4">
                <div className="min-w-[1200px] flex flex-col gap-3">
                  
                  {/* Updated Table Header Grid (Removed Package Size, Added Bulk Deal) */}
                  <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1.5fr_1fr_1fr_80px] gap-4 px-5 pb-2 font-['Inter',_sans-serif] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                    <span>Product & ID</span>
                    <span>Brand</span>
                    <span>Min Qty & Unit</span>
                    <span>Base Price</span>
                    <span>Bulk Tier</span>
                    <span className="text-center">Stock</span>
                    <span>Updated</span>
                    <span className="text-right">Action</span>
                  </div>

                  {/* Data Rows */}
                  {products.map((product) => {
                    const status = getStockStatus(product.availableStock, product.minimumOrderQuantity);
                    const dateObj = new Date(product.updatedAt);
                    const isToday = dateObj.toDateString() === new Date().toDateString();

                    return (
                      <div key={product.id} className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1.5fr_1fr_1fr_80px] items-center gap-4 min-h-[80px] px-5 py-3.5 bg-white border border-slate-200 rounded-[16px] shadow-[0_1px_2px_rgba(16,24,40,0.03)] hover:shadow-[0_12px_24px_-6px_rgba(16,24,40,0.08)] hover:-translate-y-[2px] hover:border-slate-300 transition-all duration-[220ms] ease-out">
                        
                        {/* 1. Product Name */}
                        <div className="flex flex-col gap-1 overflow-hidden pr-2">
                          <span className="font-['Manrope',_sans-serif] text-[15px] font-bold text-slate-900 truncate" title={product.productName}>
                            {product.productName}
                          </span>
                          <span className="font-['Inter',_sans-serif] text-[12px] text-slate-500 truncate">
                            ID: {product.id.substring(0,8)} <span className="text-slate-300 mx-0.5">•</span> {product.category}
                          </span>
                        </div>

                        {/* 2. Brand */}
                        <div className="font-['Inter',_sans-serif] text-[13px] font-medium text-slate-700 truncate">
                          {product.brand}
                        </div>

                        {/* 3. Min Qty & Unit */}
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-['Inter',_sans-serif] text-[12px] font-semibold tracking-wide">
                            {product.minimumOrderQuantity} {product.unit}
                          </span>
                        </div>

                        {/* 4. Base Price */}
                        <div className="flex items-baseline gap-1">
                          <span className="font-['Manrope',_sans-serif] text-[16px] font-bold text-slate-900">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="font-['Inter',_sans-serif] text-[11px] font-medium text-slate-400">/{product.unit}</span>
                        </div>

                        {/* 5. Bulk Deal Tier */}
                        <div className="flex flex-col gap-0.5">
                          {product.bulkDealQuantity && product.bulkDealPrice ? (
                            <>
                              <span className="font-['Inter',_sans-serif] text-[12px] font-semibold text-indigo-600">
                                {product.bulkDealQuantity}+ {product.unit}s
                              </span>
                              <span className="font-['Inter',_sans-serif] text-[13px] font-bold text-slate-800">
                                ₹{product.bulkDealPrice.toLocaleString('en-IN')}
                              </span>
                            </>
                          ) : (
                            <span className="font-['Inter',_sans-serif] text-[12px] font-medium text-slate-400 italic">No bulk tier</span>
                          )}
                        </div>

                        {/* 6. Stock & Status */}
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <StatusBadge status={status} />
                          <div className="flex items-baseline gap-1 font-['Inter',_sans-serif]">
                            <span className={`text-[14px] font-bold ${status === 'out' ? 'text-[#B42318]' : status === 'low' ? 'text-[#B54708]' : 'text-slate-900'}`}>
                              {product.availableStock}
                            </span>
                          </div>
                        </div>

                        {/* 7. Updated */}
                        <div className="flex flex-col gap-0.5">
                          <span className="font-['Inter',_sans-serif] text-[13px] font-semibold text-slate-700">
                            {isToday ? 'Today' : dateObj.toLocaleDateString('en-IN', { month: 'short', day: '2-digit' })}
                          </span>
                          <span className="font-['Inter',_sans-serif] text-[12px] text-slate-400">
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