import React, { useState, useCallback, useRef, useEffect } from "react";
import { productApi } from '../services/api';
import { Search, ChevronDown, Trash2, Plus, Info } from 'lucide-react';
import SectionHeader from "./SectionHeader";
import { PremiumToast } from "../../components/PremiumToast";

const UNITS = ["Kg", "Litre", "Gram", "Ml", "Bag", "Tin", "Piece", "Box", "Carton", "Dozen"];

const createEmptyRow = () => ({
  id: `r${crypto.randomUUID()}`,
  masterProductId: "",
  productName: "",
  brand: "",
  minQty: "",
  unit: "Kg",
  price: "",
  bulkQty: "",
  bulkPrice: "",
  stock: ""
});

export default function WholesaleProductWorkspace() {
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSearchRow, setActiveSearchRow] = useState(null);
  
  const workspaceRef = useRef(null);
  const searchTimeout = useRef(null); // Added for smooth typing debounce
  
  const [notification, setNotification] = useState(null);
  const showNotification = (type, msg) => setNotification({ type, msg });

   useEffect(() => {
    const handleInitialRows = () => {
      const initial = window.innerWidth >= 1024 
        ? [createEmptyRow(), createEmptyRow(), createEmptyRow()] 
        : [createEmptyRow()];
      
      setProducts(initial);

      // Auto-focus the first row's product name input box on load
      setTimeout(() => {
        const firstInput = document.getElementById(`${initial[0].id}-productName`);
        if (firstInput) firstInput.focus();
      }, 150);
    };
    
    handleInitialRows();

    // Store the initial window width
    let lastWidth = window.innerWidth;

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      
      // ONLY trigger if the width changes, completely ignoring keyboard pop-ups (height changes)
      if (currentWidth !== lastWidth) {
        lastWidth = currentWidth;
        
        // Use functional state update to get the latest products without needing it in the dependency array
        setProducts((prevProducts) => {
          if (prevProducts.every(p => !p.productName && !p.brand)) {
            return window.innerWidth >= 1024 
              ? [createEmptyRow(), createEmptyRow(), createEmptyRow()] 
              : [createEmptyRow()];
          }
          return prevProducts;
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); 

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const focusableElements = Array.from(
        workspaceRef.current.querySelectorAll("input, select, button")
      ).filter(el => !el.disabled && el.tabIndex !== -1);
      const currentIndex = focusableElements.indexOf(e.target);
      if (currentIndex > -1 && currentIndex < focusableElements.length - 1) {
        focusableElements[currentIndex + 1].focus();
      }
    }
  }, []);

  const handleChange = useCallback((id, field, value) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    setErrors((prev) => {
      if (prev[`${id}-${field}`]) {
        const newErrs = { ...prev };
        delete newErrs[`${id}-${field}`];
        return newErrs;
      }
      return prev;
    });
  }, []);

  const handleRemove = useCallback((id) => {
    if (products.length === 1) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, [products.length]);

  const handleAdd = useCallback(() => {
    const newRow = createEmptyRow();
    setProducts((prev) => [...prev, newRow]);
    
    // Auto-focus the newly added row so you can type immediately
    setTimeout(() => {
      const nextInput = document.getElementById(`${newRow.id}-productName`);
      if (nextInput) nextInput.focus();
    }, 50);
  }, []);

  const handleProductSearch = (id, query) => {
    handleChange(id, "productName", query);
    handleChange(id, "masterProductId", ""); 
    
    if (query.trim().length < 2) {
      setSuggestions([]);
      setActiveSearchRow(null);
      return;
    }
    
    setActiveSearchRow(id);
    
    // Smooth debounce applied to stop API lag from interrupting your typing
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await productApi.searchMasterProducts(query);
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 250);
  };

  const selectSuggestion = (rowId, suggestion) => {
    handleChange(rowId, "productName", suggestion.name);
    handleChange(rowId, "masterProductId", suggestion.id);
    setSuggestions([]);
    setActiveSearchRow(null);

    // Auto-focus the Brand input box right after selecting a product
    setTimeout(() => {
      const brandInput = document.getElementById(`${rowId}-brand`);
      if (brandInput) brandInput.focus();
    }, 50);
  };

  useEffect(() => {
    const handleClickOutside = () => { setSuggestions([]); setActiveSearchRow(null); };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const validateAndSubmit = async () => {
    const newErrors = {};
    let isValid = true;
    let missingMasterProduct = false;
    const rowsToValidate = products.filter(p => p.productName.trim() || p.brand.trim() || p.price || p.minQty || p.stock || p.bulkQty || p.bulkPrice);

    if (rowsToValidate.length === 0) {
      showNotification("error", "Fill in at least one product.");
      return;
    }

    rowsToValidate.forEach((p) => {
      if (!p.masterProductId) { newErrors[`${p.id}-productName`] = true; isValid = false; missingMasterProduct = true; }
      if (!p.brand.trim()) { newErrors[`${p.id}-brand`] = true; isValid = false; }
      if (!p.minQty || Number(p.minQty) < 1) { newErrors[`${p.id}-minQty`] = true; isValid = false; }
      if (!p.price || Number(p.price) <= 0) { newErrors[`${p.id}-price`] = true; isValid = false; }
      if (!p.stock || Number(p.stock) < 0) { newErrors[`${p.id}-stock`] = true; isValid = false; }
    });

    setErrors(newErrors);
    if (!isValid) return showNotification("error", missingMasterProduct ? "Select Product from dropdown." : "Fix highlighted fields.");

    setIsSubmitting(true);
    try {
      const payload = rowsToValidate.map(p => ({
        masterProductId: p.masterProductId, brand: p.brand, unit: p.unit, minimumOrderQuantity: Number(p.minQty),
        price: Number(p.price), bulkDealQuantity: p.bulkQty ? Number(p.bulkQty) : null, bulkDealPrice: p.bulkPrice ? Number(p.bulkPrice) : null, availableStock: Number(p.stock)
      }));
      await productApi.saveBulkProducts(payload);
      
      if (window.innerWidth >= 1024) {
        setProducts([createEmptyRow(), createEmptyRow(), createEmptyRow()]);
      } else {
        setProducts([createEmptyRow()]);
      }
      
      // Refocus after successful save
      setTimeout(() => {
        const firstInput = document.querySelector('input[placeholder="Search global catalog..."]');
        if (firstInput) firstInput.focus();
      }, 150);
      
      showNotification("success", "Catalog updated successfully.");
    } catch (error) {
      showNotification("error", error.response?.data?.message || "Failed to update catalog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="w-full font-inter" onKeyDown={handleKeyDown} ref={workspaceRef}>
      
      <PremiumToast 
        isVisible={!!notification} 
        type={notification?.type || 'info'} 
        message={notification?.msg} 
        onClose={() => setNotification(null)} 
      />

      <div className="px-1 sm:px-2 md:px-0">
        <SectionHeader title="Inventory Updates" subtitle="Add or modify bulk products quickly" />
      </div>

      <div className="mt-2 lg:mt-6 w-full mx-1 sm:mx-2 md:mx-0 pr-2 sm:pr-4 md:pr-0 mb-3">
        <div className="bg-white border border-slate-300/50 rounded-[16px] lg:rounded-[5px] shadow-sm overflow-hidden flex flex-col">
          
          <div className="hidden lg:grid grid-cols-[2.5fr_1.2fr_1.2fr_1fr_1.8fr_1fr_60px] bg-slate-100 border-b border-slate-200 text-[11px] font-sora font-bold uppercase tracking-widest text-slate-500">
            <div className="py-3.5 px-5">Product Search</div>
            <div className="py-3.5 px-4 border-l border-slate-200">Brand</div>
            <div className="py-3.5 px-4 border-l border-slate-200">Min & Unit</div>
            <div className="py-3.5 px-4 border-l border-slate-200">Rate (₹)</div>
            <div className="py-3.5 px-4 border-l border-slate-200">Bulk Deal</div>
            <div className="py-3.5 px-4 border-l border-slate-200">Stock</div>
            <div className="py-3.5 px-0 border-l border-slate-200 text-center">Act</div>
          </div>

          <div className="divide-y divide-slate-100 bg-white">
            {products.map((row, index) => (
              <div 
                key={row.id} 
                className="relative grid grid-cols-2 gap-3 lg:grid-cols-[2.5fr_1.2fr_1.2fr_1fr_1.8fr_1fr_60px] lg:gap-0 p-4 pt-10 lg:p-0 transition-colors hover:bg-slate-50/40 group"
              >
                
                <div className="absolute top-3 left-4 lg:hidden text-[11px] font-sora font-bold text-slate-400 tracking-widest uppercase">
                  Product Details
                </div>
                <button
                  tabIndex="-1"
                  type="button"
                  onClick={() => handleRemove(row.id)}
                  disabled={products.length === 1}
                  className="absolute top-2 right-3 lg:hidden p-2 rounded-[8px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30 shadow-sm border border-slate-100"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                </button>

                <div className="col-span-2 lg:col-span-1 lg:border-r lg:border-slate-100 relative flex flex-col justify-center">
                  <label className="text-[10px] font-sora font-bold text-slate-500 uppercase mb-1.5 lg:hidden">Product Name</label>
                  <div className={`relative h-[42px] lg:h-[52px] bg-slate-50 lg:bg-transparent rounded-[10px] lg:rounded-none border lg:border-none focus-within:ring-2 focus-within:ring-inset focus-within:bg-white transition-all ${errors[`${row.id}-productName`] ? "border-rose-300 ring-1 ring-rose-100 bg-rose-50/30" : "border-slate-200 focus-within:ring-pink-200 focus-within:border-pink-300"}`}>
                    <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-[18px] lg:h-[18px] text-slate-400" />
                    <input
                      id={`${row.id}-productName`}
                      type="text"
                      value={row.productName}
                      onChange={(e) => handleProductSearch(row.id, e.target.value)}
                      onFocus={() => { if(row.productName.length >= 2) handleProductSearch(row.id, row.productName); }}
                      placeholder="Search global catalog..."
                      className="w-full h-full pl-9 lg:pl-11 pr-3 text-[13px] lg:text-[14px] font-medium text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {activeSearchRow === row.id && suggestions.length > 0 && (
                    <div className="absolute top-[calc(100%+4px)] lg:top-[48px] left-0 right-0 bg-white border border-slate-200 rounded-[12px] shadow-[0_12px_30px_rgba(0,0,0,0.12)] z-50 max-h-48 overflow-y-auto overflow-hidden">
                      {suggestions.map((sug) => (
                        <div key={sug.id} onClick={() => selectSuggestion(row.id, sug)} className="px-4 py-2.5 text-[13px] font-medium text-slate-800 hover:bg-pink-50 hover:text-pink-600 cursor-pointer border-b border-slate-50 truncate transition-colors">
                          {sug.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-span-1 lg:border-r lg:border-slate-100 flex flex-col justify-center">
                  <label className="text-[10px] font-sora font-bold text-slate-500 uppercase mb-1.5 lg:hidden">Brand</label>
                  <div className={`relative h-[42px] lg:h-[52px] bg-slate-50 lg:bg-transparent rounded-[10px] lg:rounded-none border lg:border-none focus-within:ring-2 focus-within:ring-inset focus-within:bg-white transition-all ${errors[`${row.id}-brand`] ? "border-rose-300 ring-1 ring-rose-100 bg-rose-50/30" : "border-slate-200 focus-within:ring-pink-200 focus-within:border-pink-300"}`}>
                    <input
                      id={`${row.id}-brand`}
                      type="text"
                      value={row.brand}
                      onChange={(e) => handleChange(row.id, "brand", e.target.value)}
                      placeholder="e.g. Tata"
                      className="w-full h-full px-3 lg:px-4 text-[13px] lg:text-[14px] font-medium text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="col-span-1 lg:border-r lg:border-slate-100 flex flex-col justify-center">
                  <label className="text-[10px] font-sora font-bold text-slate-500 uppercase mb-1.5 lg:hidden">Min Qty</label>
                  <div className={`flex items-center h-[42px] lg:h-[52px] bg-slate-50 lg:bg-transparent rounded-[10px] lg:rounded-none border lg:border-none focus-within:ring-2 focus-within:ring-inset focus-within:bg-white transition-all overflow-hidden ${errors[`${row.id}-minQty`] ? "border-rose-300 ring-1 ring-rose-100 bg-rose-50/30" : "border-slate-200 focus-within:ring-pink-200 focus-within:border-pink-300"}`}>
                    <input
                      type="number"
                      value={row.minQty}
                      onChange={(e) => handleChange(row.id, "minQty", e.target.value)}
                      placeholder="Qty"
                      className="w-[55%] h-full px-3 lg:px-4 text-[13px] lg:text-[14px] font-medium text-slate-900 bg-transparent outline-none placeholder:text-slate-400 border-r border-slate-200/60 lg:border-none"
                    />
                    <div className="relative w-[45%] h-full">
                      <select
                        value={row.unit}
                        onChange={(e) => handleChange(row.id, "unit", e.target.value)}
                        className="w-full h-full pl-2 pr-6 text-[12px] lg:text-[13px] font-semibold text-slate-600 bg-transparent outline-none appearance-none cursor-pointer"
                      >
                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" strokeWidth={3} />
                    </div>
                  </div>
                </div>

                <div className="col-span-1 lg:border-r lg:border-slate-100 flex flex-col justify-center">
                  <label className="text-[10px] font-sora font-bold text-slate-500 uppercase mb-1.5 lg:hidden">Base Price</label>
                  <div className={`relative h-[42px] lg:h-[52px] bg-slate-50 lg:bg-transparent rounded-[10px] lg:rounded-none border lg:border-none focus-within:ring-2 focus-within:ring-inset focus-within:bg-white transition-all ${errors[`${row.id}-price`] ? "border-rose-300 ring-1 ring-rose-100 bg-rose-50/30" : "border-slate-200 focus-within:ring-pink-200 focus-within:border-pink-300"}`}>
                    <span className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-[13px] lg:text-[14px] font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) => handleChange(row.id, "price", e.target.value)}
                      placeholder="0.00"
                      className="w-full h-full pl-7 lg:pl-8 pr-3 text-[13px] lg:text-[14px] font-sora font-bold text-slate-900 bg-transparent outline-none placeholder:text-slate-400 placeholder:font-inter placeholder:font-medium"
                    />
                  </div>
                </div>

                <div className="col-span-2 lg:col-span-1 lg:border-r lg:border-slate-100 flex flex-col justify-center">
                  <label className="text-[10px] font-sora font-bold text-slate-500 uppercase mb-1.5 lg:hidden">Bulk Trigger & Deal</label>
                  <div className={`flex items-center h-[42px] lg:h-[52px] bg-slate-50 lg:bg-transparent rounded-[10px] lg:rounded-none border lg:border-none focus-within:ring-2 focus-within:ring-inset focus-within:bg-white transition-all overflow-hidden ${errors[`${row.id}-bulkQty`] || errors[`${row.id}-bulkPrice`] ? "border-rose-300 ring-1 ring-rose-100 bg-rose-50/30" : "border-slate-200 focus-within:ring-pink-200 focus-within:border-pink-300"}`}>
                    <input
                      type="number"
                      value={row.bulkQty}
                      onChange={(e) => handleChange(row.id, "bulkQty", e.target.value)}
                      placeholder="Trig Qty"
                      className="w-[45%] h-full px-3 lg:px-4 text-[13px] lg:text-[14px] font-medium text-slate-900 bg-transparent outline-none placeholder:text-slate-400 text-center"
                    />
                    <div className="w-[10%] h-full flex items-center justify-center bg-slate-100 lg:bg-slate-50 border-x border-slate-200/50 lg:border-x-0">
                       <span className="text-slate-400 text-[10px] font-bold">@</span>
                    </div>
                    <div className="relative w-[45%] h-full flex items-center">
                      <span className="absolute left-2 text-[12px] font-bold text-slate-400 hidden lg:block">₹</span>
                      <input
                        type="number"
                        value={row.bulkPrice}
                        onChange={(e) => handleChange(row.id, "bulkPrice", e.target.value)}
                        placeholder="Deal ₹"
                        className="w-full h-full pl-2 lg:pl-5 pr-2 text-[13px] lg:text-[14px] font-sora font-bold text-emerald-600 bg-transparent outline-none placeholder:text-slate-400 placeholder:font-inter placeholder:font-medium text-center lg:text-left"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-1 lg:border-r lg:border-slate-100 flex flex-col justify-center">
                  <label className="text-[10px] font-sora font-bold text-slate-500 uppercase mb-1.5 lg:hidden">Available Stock</label>
                  <div className={`relative h-[42px] lg:h-[52px] bg-slate-50 lg:bg-transparent rounded-[10px] lg:rounded-none border lg:border-none focus-within:ring-2 focus-within:ring-inset focus-within:bg-white transition-all ${errors[`${row.id}-stock`] ? "border-rose-300 ring-1 ring-rose-100 bg-rose-50/30" : "border-slate-200 focus-within:ring-pink-200 focus-within:border-pink-300"}`}>
                    <input
                      type="number"
                      value={row.stock}
                      onChange={(e) => handleChange(row.id, "stock", e.target.value)}
                      placeholder="Count"
                      className="w-full h-full px-3 lg:px-4 text-[13px] lg:text-[14px] font-medium text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="hidden lg:flex items-center justify-center relative">
                  <button
                    tabIndex="-1"
                    type="button"
                    onClick={() => handleRemove(row.id)}
                    disabled={products.length === 1}
                    className="p-2 rounded-[8px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30"
                  >
                    <Trash2 className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="bg-slate-50/80 border-t border-slate-200 p-3 sm:p-4 flex flex-row items-center justify-between">
            <button
              onClick={handleAdd}
              className="hidden lg:flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] sm:text-[13px] font-sora font-bold text-slate-700 bg-white border border-slate-200 rounded-[8px] hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50 transition-all active:scale-[0.98] shadow-sm"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} /> Add New Row
            </button>
            <div className="lg:hidden"></div>

            <button 
              onClick={validateAndSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-[12px] sm:text-[13px] font-sora font-bold text-white bg-slate-900 rounded-[8px] hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 shadow-md"
            >
              {isSubmitting ? "Saving Updates..." : "Save Product Data"}
            </button>
          </div>

        </div>

        <div className="lg:hidden mt-3 mx-1 bg-slate-900 rounded-[12px] p-3 flex items-start gap-2.5 shadow-sm border border-slate-800">
          <Info className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
          <p className="text-[11px] sm:text-[12px] text-slate-300 leading-relaxed font-medium">
            <strong className="text-white font-sora">Pro Tip:</strong> For lightning-fast bulk entry, switch to a <strong className="text-white">Laptop or Desktop</strong>.
          </p>
        </div>

      </div>
    </div>
  );
}