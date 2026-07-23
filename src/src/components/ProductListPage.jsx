import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import { inventoryApi } from '../../Authentication/services/api';
import FilterBar from './FilterBar';
import { ActionButtons, EmptyState, SearchBar, StatusBadge, getStockStatus, SkeletonLoader } from './InventoryUI';

const DEFAULT_FILTERS = { category: 'all', brand: 'all', availability: 'all', sortPrice: 'none', sortStock: 'none' };

export default function ProductListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ brands: [], categories: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Debounced Search implementation
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

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchTerm('');
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchProducts();
  }, [filters, searchTerm]);

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
    if(!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await inventoryApi.deleteProduct(id);
      fetchProducts(); 
    } catch (error) {
      alert("Failed to delete product.");
    }
  };

  const isFiltered = searchTerm.trim() !== '' || filters.category !== 'all' || filters.brand !== 'all' || filters.availability !== 'all';

  return (
    <>
      {/* Explicitly load Manrope and Inter to ensure the typography matches your original CSS perfectly */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />

      <div className="min-h-screen bg-[#F9FAFB] font-['Inter',_sans-serif] text-[#0F1626] pb-24">
        <div className="max-w-[1440px] mx-auto px-6 pt-8 flex flex-col gap-5">
          
          {/* Hero Section */}
          <section className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 md:px-10 bg-white border border-slate-200 rounded-[20px] shadow-[0_1px_3px_rgba(16,24,40,0.06)] overflow-hidden">
            <div className="absolute -top-[60%] -right-[10%] w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(23,178,106,0.08),transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-2.5 max-w-[560px]">
              <span className="font-['Inter',_sans-serif] text-[11px] font-bold tracking-[0.08em] uppercase text-[#079455]">
                Inventory Workspace
              </span>
              <h1 className="font-['Manrope',_sans-serif] text-[32px] font-extrabold tracking-[-0.01em] text-[#0F1626] leading-tight">
                Product Inventory
              </h1>
              <p className="font-['Inter',_sans-serif] text-[15px] text-slate-500 leading-relaxed m-0">
                Manage your wholesale products, inventory, pricing, and stock levels from one centralized workspace.
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
                  <span className="font-['Inter',_sans-serif] text-[12px] font-semibold text-slate-500">Products</span>
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

          {/* List Section */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-end justify-between px-2">
              <div className="flex flex-col gap-1">
                <span className="font-['Inter',_sans-serif] text-[11px] font-bold tracking-[0.06em] uppercase text-slate-400">Catalog</span>
                <h2 className="font-['Manrope',_sans-serif] text-[18px] font-bold text-[#0F1626] m-0">
                  {products.length} Product{products.length !== 1 ? 's' : ''}
                </h2>
              </div>
              <button onClick={() => navigate('/add')} className="flex items-center gap-2 px-4 py-2 font-['Inter',_sans-serif] text-[13px] font-semibold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded-lg shadow-[0_6px_16px_-4px_rgba(244,63,94,0.45)] hover:-translate-y-[1px] hover:shadow-[0_10px_22px_-4px_rgba(244,63,94,0.5)] transition-all active:scale-95">
                <Plus size={16} strokeWidth={2.5} /> Add Product
              </button>
            </div>

            {isLoading ? (
              <SkeletonLoader rows={6} />
            ) : products.length === 0 ? (
              <EmptyState isFiltered={isFiltered} onAddProduct={() => navigate('/add')} onReset={handleReset} />
            ) : (
              <div className="w-full overflow-x-auto pb-1">
                <div className="min-w-[1100px] flex flex-col gap-3">
                  
                  {/* Table Header Grid - Added distinct Min Qty Column */}
                  <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1fr_1fr_1.5fr_1fr_80px] gap-3 px-4 pb-2 font-['Inter',_sans-serif] text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                    <span>Product</span>
                    <span>Brand</span>
                    <span>Package & Unit</span>
                    <span>Price</span>
                    <span>Min Qty</span>
                    <span className="text-center">Stock & Status</span>
                    <span>Updated</span>
                    <span className="text-right">Actions</span>
                  </div>

                  {/* Data Rows */}
                  {products.map((product) => {
                    const status = getStockStatus(product.availableStock, product.minimumOrderQuantity);
                    const dateObj = new Date(product.updatedAt);
                    const isToday = dateObj.toDateString() === new Date().toDateString();

                    return (
                      <div key={product.id} className="grid grid-cols-[2fr_1.2fr_1.2fr_1fr_1fr_1.5fr_1fr_80px] items-center gap-3 min-h-[80px] px-4 py-3 bg-white border border-slate-200 rounded-[16px] shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:shadow-[0_12px_24px_-6px_rgba(16,24,40,0.1)] hover:-translate-y-[2px] hover:border-slate-300 transition-all duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
                        
                        {/* 1. Product Name & Category */}
                        <div className="flex flex-col gap-1 overflow-hidden pr-2">
                          <span className="font-['Manrope',_sans-serif] text-[15px] font-bold text-[#0F1626] truncate" title={product.productName}>
                            {product.productName}
                          </span>
                          <span className="font-['Inter',_sans-serif] text-[12px] text-slate-500 truncate">
                            ID: {product.id.substring(0,8)} <span className="text-slate-300 mx-0.5">•</span> {product.category}
                          </span>
                        </div>

                        {/* 2. Brand */}
                        <div className="font-['Inter',_sans-serif] text-[13px] font-medium text-slate-700 truncate pr-2">
                          {product.brand}
                        </div>

                        {/* 3. Package Size & Unit */}
                        <div className="font-['Inter',_sans-serif] text-[13px] font-medium text-slate-700">
                          {product.packageSize} {product.unit}
                        </div>

                        {/* 4. Price */}
                        <div className="flex items-baseline gap-1">
                          <span className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-[#067647]">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="font-['Inter',_sans-serif] text-[11px] font-medium text-slate-400">/{product.unit}</span>
                        </div>

                        {/* 5. Min Quantity (MOQ) */}
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-['Inter',_sans-serif] text-[11px] font-semibold tracking-[0.01em] whitespace-nowrap">
                            MOQ {product.minimumOrderQuantity} {product.unit}
                          </span>
                        </div>

                        {/* 6. Stock & Status (Centered) */}
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <StatusBadge status={status} />
                          <div className="flex items-baseline gap-1 font-['Inter',_sans-serif] whitespace-nowrap">
                            <span className={`text-[14px] font-bold ${status === 'out' ? 'text-[#B42318]' : status === 'low' ? 'text-[#B54708]' : 'text-[#067647]'}`}>
                              {product.availableStock}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500">{product.unit}s</span>
                          </div>
                        </div>

                        {/* 7. Last Updated */}
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
                          onEdit={() => console.log('Edit product')} 
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
    </>
  );
}