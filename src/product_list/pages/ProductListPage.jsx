import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import { Plus, Package } from 'lucide-react';

// Adjust external imports based on your exact file structure
import { inventoryApi } from '../Services/api';
import { PremiumToast } from "../../components/PremiumToast";
import { DataFetchError } from "../../components/DataFetchError";

// Modular Imports
import { typographyStyles, DEFAULT_FILTERS } from '../utils/constants';
import { getStockStatus } from '../utils/helpers';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import PremiumEmptyState from '../components/PremiumEmptyState';
import PremiumSkeletonLoader from '../components/PremiumSkeletonLoader';
import StatusBadge from '../components/StatusBadge';
import ActionButtons from '../components/ActionButtons';
import EditProductModal from '../modals/EditProductModal';

export default function ProductListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [notification, setNotification] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const showNotification = (type, msg) => {
    setNotification({ type, msg });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: filterOptions = { brands: [], categories: [] } } = useQuery({
    queryKey: ['inventoryFilters'],
    queryFn: async () => {
      const res = await inventoryApi.getFilters();
      return res.data;
    },
    staleTime: 10 * 60 * 1000, 
  });

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
          {isFetchError ? (
            <DataFetchError 
              errorTitle="Connection Failed"
              errorMessage={fetchError?.response?.data?.message || fetchError?.message || "An unexpected error occurred."} 
              onRetry={refetch} 
            />
          ) : (
            <div className="flex flex-col w-full flex-1 bg-white sm:border sm:border-slate-200 min-h-[calc(100vh-40px)] overflow-hidden">
              
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

              <div className="w-full flex flex-col flex-1 bg-white">
                {isLoading ? (
                  <div className="px-4 sm:px-8 pb-10"><PremiumSkeletonLoader rows={6} /></div>
                ) : products.length === 0 ? (
                  <div className="px-4 sm:px-8 pb-10 flex-1 flex flex-col justify-center">
                    <PremiumEmptyState isFiltered={isFiltered} onAddProduct={() => navigate('/add')} onReset={handleReset} />
                  </div>
                ) : (
                  <div className="w-full flex flex-col flex-1 h-full">
                    
                    {/* DESKTOP VIEW */}
                    <div className="hidden lg:block w-full flex-1">
                      <table className="w-full text-left border-collapse table-fixed">
                        <colgroup>
                          <col className="w-[28%]" /> 
                          <col className="w-[12%]" /> 
                          <col className="w-[13%]" /> 
                          <col className="w-[13%]" /> 
                          <col className="w-[15%]" /> 
                          <col className="w-[9%]" />  
                          <col className="w-[10%]" /> 
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