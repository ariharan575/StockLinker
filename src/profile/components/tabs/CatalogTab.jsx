import React from 'react';
import { Search, ChevronDown, RotateCcw, Loader2, PackageSearch, Minus, Plus } from 'lucide-react';
import { DEFAULT_FILTERS } from '../../utils/constants';

export const CatalogTab = ({
  searchTerm, setSearchTerm, filters, setFilters, filterOptions,
  isLoadingProducts, isProductsError, productsError, products, cart,
  handleDecrement, handleIncrement, handleManualQuantity, handleQuantityBlur,
  totalPages, page, setPage
}) => {
  return (
    <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
      <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative flex items-center w-full lg:max-w-md bg-white border border-slate-200 rounded-xl focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/10 transition-all h-12 shadow-sm">
          <Search className="absolute left-4 text-slate-400" size={18} />
          <input type="text" className="w-full h-full pl-12 pr-4 bg-transparent text-[14px] font-medium outline-none placeholder:text-slate-400" placeholder="Search by name or brand..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto hide-scrollbar">
          <div className="relative inline-flex items-center flex-shrink-0">
            <select className="appearance-none bg-white border border-slate-200 text-slate-700 text-[13px] font-bold h-12 pl-4 pr-10 rounded-xl outline-none cursor-pointer hover:border-slate-300 shadow-sm transition-colors" value={filters.category} onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}>
              <option value="all">All Categories</option>
              {filterOptions.categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 text-slate-400 pointer-events-none" size={16} />
          </div>
          <div className="relative inline-flex items-center flex-shrink-0">
            <select className="appearance-none bg-white border border-slate-200 text-slate-700 text-[13px] font-bold h-12 pl-4 pr-10 rounded-xl outline-none cursor-pointer hover:border-slate-300 shadow-sm transition-colors" value={filters.brand} onChange={(e) => setFilters(prev => ({...prev, brand: e.target.value}))}>
              <option value="all">All Brands</option>
              {filterOptions.brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown className="absolute right-3 text-slate-400 pointer-events-none" size={16} />
          </div>
          <button onClick={() => { setFilters(DEFAULT_FILTERS); setSearchTerm(''); }} className="flex items-center justify-center w-12 h-12 text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex-shrink-0 shadow-sm">
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {isLoadingProducts ? (
        <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
      ) : isProductsError ? (
        <div className="flex justify-center py-32 text-rose-500 font-bold text-center">
          {productsError?.response?.data?.message || productsError?.message || "Failed to load products."}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-sm relative overflow-hidden min-h-[400px] m-4 md:m-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-20" />
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6 relative">
            <div className="absolute inset-0 bg-slate-100/50 rounded-2xl animate-pulse" />
            <PackageSearch className="w-10 h-10 text-slate-300 relative z-10" />
          </div>
          <h3 className="text-[20px] sm:text-[22px] font-sora font-extrabold tracking-tight text-slate-900 mb-2">No products found</h3>
          <p className="text-[14px] text-slate-500 max-w-sm mb-6 leading-relaxed">
            We couldn't find any products matching your current filters or search terms. Try adjusting them to see more results.
          </p>
          {(searchTerm || filters.category !== 'all' || filters.brand !== 'all') && (
            <button
              onClick={() => { setFilters(DEFAULT_FILTERS); setSearchTerm(''); }}
              className="rounded-xl bg-pink-50 text-pink-600 px-6 py-2.5 text-[14px] font-semibold transition-all hover:bg-pink-100 border border-pink-100 shadow-sm active:scale-95"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="w-full">
          {/* Desktop List */}
          <div className="hidden md:block w-full overflow-x-auto">
            <div className="min-w-[1000px]">
              <div className="grid grid-cols-[2fr_1.2fr_1fr_1.5fr_1fr_1.5fr_1.2fr] gap-4 px-8 py-4 bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold tracking-widest uppercase text-slate-400">
                <span>Product Details</span><span>Brand</span><span>Base Price</span><span>Rules / Deals</span>
                <span className="text-center">Stock</span><span className="text-center">Quantity</span><span className="text-right">Line Total</span>
              </div>
              <div className="flex flex-col divide-y divide-slate-100">
                {products.map((product) => {
                  const currentQty = cart[product.id] || 0;
                  const isBulkApplied = product.bulkDealQuantity && currentQty >= product.bulkDealQuantity;
                  const displayPrice = isBulkApplied && product.bulkDealQuantity > 0 ? (product.bulkDealPrice / product.bulkDealQuantity) : product.price;

                  return (
                    <div key={product.id} className={`grid grid-cols-[2fr_1.2fr_1fr_1.5fr_1fr_1.5fr_1.2fr] gap-4 items-center px-8 py-5 transition-colors ${currentQty > 0 ? 'bg-pink-50/30' : 'hover:bg-slate-50/50'}`}>
                      <div className="flex flex-col gap-0.5 pr-2">
                        <span className="font-['Manrope',_sans-serif] text-[15px] font-bold text-slate-900 truncate">{product.productName}</span>
                        <span className="text-[12px] font-medium text-slate-500 truncate">{product.category}</span>
                      </div>
                      <span className="text-[13px] font-bold text-slate-700">{product.brand}</span>
                      <div className="flex flex-col">
                        <span className="font-['Manrope',_sans-serif] text-[15px] font-extrabold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                        <span className="text-[11px] font-semibold text-slate-400">/{product.unit}</span>
                      </div>
                      <div className="flex flex-col items-start gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-rose-100 bg-rose-50 text-rose-600">
                          Min: {product.minimumOrderQuantity} {product.unit}
                        </span>
                        {product.bulkDealQuantity && product.bulkDealPrice && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${isBulkApplied ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                            Bulk: {product.bulkDealQuantity}+ @ ₹{product.bulkDealPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <span className={`text-[13px] font-extrabold ${product.availableStock < 10 ? 'text-rose-600' : 'text-slate-700'}`}>{product.availableStock}</span>
                      </div>
                      <div className="flex justify-center">
                        <div className={`flex items-center bg-white border ${currentQty > 0 ? 'border-slate-900 ring-1 ring-slate-900/10' : 'border-slate-200'} rounded-xl overflow-hidden h-10 w-[120px] transition-all focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/20`}>
                          <button onClick={() => handleDecrement(product)} className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50"><Minus size={14} strokeWidth={3}/></button>
                          <input type="number" value={currentQty === 0 ? '' : currentQty} onChange={(e) => handleManualQuantity(product, e.target.value)} onBlur={(e) => handleQuantityBlur(product, e.target.value)} placeholder="0" className="flex-1 w-full h-full text-center bg-transparent text-[13px] font-bold text-slate-900 border-x border-slate-100 outline-none p-0"/>
                          <button onClick={() => handleIncrement(product)} disabled={currentQty >= product.availableStock} className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"><Plus size={14} strokeWidth={3}/></button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`font-['Manrope',_sans-serif] text-[16px] font-extrabold ${currentQty > 0 ? 'text-slate-900' : 'text-slate-300'}`}>
                          ₹{(currentQty * displayPrice).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Mobile Stacked List */}
          <div className="md:hidden flex flex-col divide-y divide-slate-100">
            {products.map((product) => {
              const currentQty = cart[product.id] || 0;
              const isBulkApplied = product.bulkDealQuantity && currentQty >= product.bulkDealQuantity;
              const displayPrice = isBulkApplied && product.bulkDealQuantity > 0 ? (product.bulkDealPrice / product.bulkDealQuantity) : product.price;

              return (
                <div key={product.id} className={`p-4 flex flex-col gap-3 transition-colors ${currentQty > 0 ? 'bg-pink-50/20' : 'bg-white'}`}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">{product.brand}</span>
                      <span className="font-['Manrope',_sans-serif] text-[15px] font-bold text-slate-900 leading-tight">{product.productName}</span>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0 ml-2">
                      <span className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-slate-900 leading-none">₹{product.price.toLocaleString('en-IN')}</span>
                      <span className="text-[11px] font-semibold text-slate-400 mt-1">/{product.unit}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-extrabold uppercase border border-rose-100 bg-rose-50 text-rose-600">
                      Min: {product.minimumOrderQuantity} {product.unit}
                    </span>
                    {product.bulkDealQuantity && product.bulkDealPrice && (
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-extrabold uppercase border ${isBulkApplied ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        Bulk: {product.bulkDealQuantity}+ @ ₹{product.bulkDealPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 mt-1 pt-3 border-t border-slate-100/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Line Total</span>
                      <span className={`font-['Manrope',_sans-serif] text-[16px] font-extrabold leading-none ${currentQty > 0 ? 'text-slate-900' : 'text-slate-300'}`}>
                        ₹{(currentQty * displayPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className={`flex items-center bg-white border ${currentQty > 0 ? 'border-slate-900 ring-1 ring-slate-900/10' : 'border-slate-200'} rounded-xl overflow-hidden h-11 w-[120px]`}>
                      <button onClick={() => handleDecrement(product)} className="w-10 h-full flex items-center justify-center text-slate-500"><Minus size={16}/></button>
                      <input type="number" value={currentQty === 0 ? '' : currentQty} onChange={(e) => handleManualQuantity(product, e.target.value)} onBlur={(e) => handleQuantityBlur(product, e.target.value)} placeholder="0" className="flex-1 w-full h-full text-center bg-transparent text-[13px] font-bold text-slate-900 border-x border-slate-100 outline-none p-0"/>
                      <button onClick={() => handleIncrement(product)} disabled={currentQty >= product.availableStock} className="w-10 h-full flex items-center justify-center text-slate-500 disabled:opacity-30"><Plus size={16}/></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6 pb-6 px-4 md:px-8">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-5 py-2.5 text-[13px] font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all">
                Previous
              </button>
              <span className="text-[13px] font-bold text-slate-500">
                Page {page + 1} of {totalPages}
              </span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="px-5 py-2.5 text-[13px] font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all">
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};