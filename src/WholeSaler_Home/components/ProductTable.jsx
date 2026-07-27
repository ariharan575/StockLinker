import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import { productApi } from '../services/api';


// --- Premium Icons ---
const SearchIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const ChevronDownIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
const TrashIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);
const CloudUploadIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m16 16-4-4-4 4"></path>
  </svg>
);
const PlusIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const UNITS = ["Kg", "Litre", "Gram", "Ml", "Bag", "Tin", "Piece", "Box", "Carton", "Dozen"];

const HeaderLabel = ({ children }) => (
  <div className="text-[11px] font-bold tracking-wider text-gray-400 uppercase select-none">
    {children}
  </div>
);

// Helper to generate empty rows
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
  const [products, setProducts] = useState([
    createEmptyRow(),
    createEmptyRow(),
    createEmptyRow()
  ]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSearchRow, setActiveSearchRow] = useState(null);

  const workspaceRef = useRef(null);

  // Enter key navigates to the next input cleanly
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
    setProducts((prev) => [...prev, createEmptyRow()]);
  }, []);

  const handleProductSearch = async (id, query) => {
    handleChange(id, "productName", query);
    handleChange(id, "masterProductId", ""); 
    
    if (query.trim().length < 2) {
      setSuggestions([]);
      setActiveSearchRow(null);
      return;
    }

    try {
      setActiveSearchRow(id);
      const res = await productApi.searchMasterProducts(query);
      setSuggestions(res.data);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    }
  };

  const selectSuggestion = (rowId, suggestion) => {
    handleChange(rowId, "productName", suggestion.name);
    handleChange(rowId, "masterProductId", suggestion.id);
    setSuggestions([]);
    setActiveSearchRow(null);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setSuggestions([]);
      setActiveSearchRow(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const validateAndSubmit = async () => {
    const newErrors = {};
    let isValid = true;
    let missingMasterProduct = false;

    const rowsToValidate = products.filter(p => 
      p.productName.trim() || p.brand.trim() || p.price || p.minQty || p.stock || p.bulkQty || p.bulkPrice
    );

    if (rowsToValidate.length === 0) {
      alert("Please fill in at least one product row before saving.");
      return;
    }

    rowsToValidate.forEach((p) => {
      if (!p.masterProductId) { newErrors[`${p.id}-productName`] = true; isValid = false; missingMasterProduct = true; }
      if (!p.brand.trim()) { newErrors[`${p.id}-brand`] = true; isValid = false; }
      if (!p.minQty || Number(p.minQty) < 1) { newErrors[`${p.id}-minQty`] = true; isValid = false; }
      if (!p.price || Number(p.price) <= 0) { newErrors[`${p.id}-price`] = true; isValid = false; }
      if (!p.stock || Number(p.stock) < 0) { newErrors[`${p.id}-stock`] = true; isValid = false; }
      
      if (p.bulkQty && Number(p.bulkQty) <= 0) { newErrors[`${p.id}-bulkQty`] = true; isValid = false; }
      if (p.bulkPrice && Number(p.bulkPrice) <= 0) { newErrors[`${p.id}-bulkPrice`] = true; isValid = false; }
    });

    setErrors(newErrors);

    if (!isValid) {
      if (missingMasterProduct) {
        alert("VALIDATION ERROR: Please select the Product Name from the suggestions dropdown.");
      } else {
        alert("VALIDATION ERROR: Please fix the highlighted fields.");
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = rowsToValidate.map(p => ({
        masterProductId: p.masterProductId,
        brand: p.brand,
        unit: p.unit,
        minimumOrderQuantity: Number(p.minQty),
        price: Number(p.price),
        bulkDealQuantity: p.bulkQty ? Number(p.bulkQty) : null,
        bulkDealPrice: p.bulkPrice ? Number(p.bulkPrice) : null,
        availableStock: Number(p.stock)
      }));

      await productApi.saveBulkProducts(payload);
      
      setProducts([createEmptyRow(), createEmptyRow(), createEmptyRow()]);
      alert("SUCCESS: Catalog updated successfully.");
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Unknown server error.";
      alert(`FAILED TO SAVE: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-start" onKeyDown={handleKeyDown} ref={workspaceRef}>
      {/* 
        PREMIUM MAIN CONTAINER 
        - Auto-height (no min-h-screen) to eliminate void spaces below.
        - Premium shadow and border-radius system.
      */}
      <div className="w-full max-w-[1480px] bg-white rounded-[32px] border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_16px_rgba(0,0,0,0.02),0_16px_48px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Subtle top specularity line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />

        {/* Integrated Header Matrix */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 lg:p-10 border-b border-gray-100 bg-white">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Add Products</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] font-semibold bg-gray-50 text-gray-600 border border-gray-200/50 shadow-sm">
                {products.length} {products.length === 1 ? "Item" : "Items"}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                Engine Sync Live
              </span>
            </div>
            <p className="text-[13px] text-gray-500 font-medium max-w-2xl">
              Configure commercial wholesale distribution items, base pricing, and synchronized bulk tiers.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button tabIndex="-1" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-gray-200 text-[13px] font-semibold text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98]">
              <CloudUploadIcon className="text-gray-400" />
              Bulk CSV Ingestion
            </button>
          </div>
        </header>

        {/* Dynamic Matrix Layout */}
        <div className="w-full flex flex-col bg-white">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[1100px] px-8 lg:px-10 pt-6">
              
              {/* Table Headers */}
              <div className="flex items-center gap-4 pb-3 border-b border-gray-100 w-full pl-[2px]">
                <div className="grid grid-cols-[minmax(220px,2fr)_minmax(140px,1.2fr)_minmax(140px,1.2fr)_minmax(120px,1fr)_minmax(180px,1.5fr)_minmax(100px,1fr)] gap-4 flex-1">
                  <HeaderLabel>Product Search</HeaderLabel>
                  <HeaderLabel>Brand</HeaderLabel>
                  <HeaderLabel>Min Qty & Unit</HeaderLabel>
                  <HeaderLabel>Base Price</HeaderLabel>
                  <HeaderLabel>Bulk Deal (Qty & ₹)</HeaderLabel>
                  <HeaderLabel>Available Stock</HeaderLabel>
                </div>
                <div className="w-10 flex justify-center">
                  <HeaderLabel>Act</HeaderLabel>
                </div>
              </div>

              {/* Data Rows */}
              <div className="flex flex-col py-2">
                {products.map((row) => (
                  <div key={row.id} className="group flex items-center gap-4 py-[7px] border-b border-gray-100 last:border-0 w-full transition-colors duration-150">
                    <div className="flex-1 grid grid-cols-[minmax(220px,2fr)_minmax(140px,1.2fr)_minmax(140px,1.2fr)_minmax(120px,1fr)_minmax(180px,1.5fr)_minmax(100px,1fr)] gap-4 items-center">
                      
                      {/* 1. Master Product (Autosuggest) */}
                      <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="relative group flex items-center w-full">
                          <div className="absolute left-3.5 flex items-center justify-center text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200">
                            <SearchIcon className="w-[16px] h-[16px]" />
                          </div>
                          <input
                            type="text"
                            value={row.productName}
                            onChange={(e) => handleProductSearch(row.id, e.target.value)}
                            placeholder="Search catalog..."
                            className={`w-full h-10 bg-[#FAFBFC] border rounded-lg text-[13px] font-medium text-gray-900 placeholder:text-gray-400/90 outline-none transition-all duration-200 hover:border-gray-300 focus:bg-white focus:ring-[3px] focus:ring-indigo-500/10 pl-9 pr-3.5 ${
                              errors[`${row.id}-productName`] ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-indigo-500"
                            }`}
                          />
                        </div>
                        {activeSearchRow === row.id && suggestions.length > 0 && (
                          <div className="absolute top-[44px] left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-56 overflow-y-auto py-1">
                            {suggestions.map((sug) => (
                              <div
                                key={sug.id}
                                onClick={() => selectSuggestion(row.id, sug)}
                                className="px-3 py-2 text-[13px] font-medium text-gray-800 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0 truncate"
                              >
                                {sug.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 2. Brand */}
                      <div className="relative group flex items-center w-full">
                        <input
                          type="text"
                          value={row.brand}
                          onChange={(e) => handleChange(row.id, "brand", e.target.value)}
                          placeholder="Brand"
                          className={`w-full h-10 bg-[#FAFBFC] border rounded-lg text-[13px] font-medium text-gray-900 placeholder:text-gray-400/90 outline-none transition-all duration-200 hover:border-gray-300 focus:bg-white focus:ring-[3px] focus:ring-indigo-500/10 px-3.5 ${
                            errors[`${row.id}-brand`] ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-indigo-500"
                          }`}
                        />
                      </div>

                      {/* 3. Combined Min Qty & Unit */}
                      <div className={`flex items-center w-full h-10 bg-[#FAFBFC] border rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-300 focus-within:bg-white focus-within:ring-[3px] focus-within:ring-indigo-500/10 ${
                        errors[`${row.id}-minQty`] ? "border-red-500 focus-within:border-red-500" : "border-gray-200 focus-within:border-indigo-500"
                      }`}>
                        <input
                          type="number"
                          value={row.minQty}
                          onChange={(e) => handleChange(row.id, "minQty", e.target.value)}
                          placeholder="MOC"
                          className="w-[45%] h-full px-3 text-[13px] font-medium bg-transparent outline-none placeholder:text-gray-400/90 text-gray-900"
                        />
                        <div className="w-px h-5 bg-gray-200 shrink-0"></div>
                        <div className="relative w-[55%] h-full group">
                          <select
                            value={row.unit}
                            onChange={(e) => handleChange(row.id, "unit", e.target.value)}
                            className="w-full h-full pl-3 pr-7 text-[13px] font-medium text-gray-900 bg-transparent outline-none appearance-none cursor-pointer"
                          >
                            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                          <ChevronDownIcon className="absolute right-2.5 top-[12px] w-[16px] h-[16px] text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
                        </div>
                      </div>

                      {/* 4. Base Price */}
                      <div className="relative group flex items-center w-full">
                        <div className="absolute left-3.5 font-semibold text-gray-400 group-focus-within:text-indigo-600 text-[13px] transition-colors duration-200">
                          ₹
                        </div>
                        <input
                          type="number"
                          value={row.price}
                          onChange={(e) => handleChange(row.id, "price", e.target.value)}
                          placeholder="Base Rate"
                          className={`w-full h-10 bg-[#FAFBFC] border rounded-lg text-[13px] font-medium text-gray-900 placeholder:text-gray-400/90 outline-none transition-all duration-200 hover:border-gray-300 focus:bg-white focus:ring-[3px] focus:ring-indigo-500/10 pl-8 pr-3.5 ${
                            errors[`${row.id}-price`] ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-indigo-500"
                          }`}
                        />
                      </div>

                      {/* 5. Combined Bulk Deal Qty & Price */}
                      <div className={`flex items-center w-full h-10 bg-indigo-50/20 border rounded-lg overflow-hidden transition-all duration-200 hover:border-indigo-200 focus-within:bg-white focus-within:ring-[3px] focus-within:ring-indigo-500/10 ${
                        errors[`${row.id}-bulkQty`] || errors[`${row.id}-bulkPrice`] ? "border-red-500 focus-within:border-red-500" : "border-indigo-100 focus-within:border-indigo-500"
                      }`}>
                        <div className="relative w-[45%] h-full flex items-center">
                          <span className="absolute left-3 text-[10px] font-bold text-indigo-500 uppercase">Qty</span>
                          <input
                            type="number"
                            value={row.bulkQty}
                            onChange={(e) => handleChange(row.id, "bulkQty", e.target.value)}
                            placeholder="50"
                            className="w-full h-full pl-9 pr-2 text-[13px] font-medium bg-transparent outline-none placeholder:text-indigo-300 text-indigo-950"
                          />
                        </div>
                        <div className="w-px h-5 bg-indigo-100 shrink-0"></div>
                        <div className="relative w-[55%] h-full flex items-center">
                          <span className="absolute left-2.5 text-[12px] font-bold text-indigo-500">₹</span>
                          <input
                            type="number"
                            value={row.bulkPrice}
                            onChange={(e) => handleChange(row.id, "bulkPrice", e.target.value)}
                            placeholder="Deal Price"
                            className="w-full h-full pl-6 pr-3 text-[13px] font-medium bg-transparent outline-none placeholder:text-indigo-300 text-indigo-950"
                          />
                        </div>
                      </div>

                      {/* 6. Stock */}
                      <div className="relative group flex items-center w-full">
                        <input
                          type="number"
                          value={row.stock}
                          onChange={(e) => handleChange(row.id, "stock", e.target.value)}
                          placeholder="Count"
                          className={`w-full h-10 bg-[#FAFBFC] border rounded-lg text-[13px] font-medium text-gray-900 placeholder:text-gray-400/90 outline-none transition-all duration-200 hover:border-gray-300 focus:bg-white focus:ring-[3px] focus:ring-indigo-500/10 px-3.5 ${
                            errors[`${row.id}-stock`] ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-indigo-500"
                          }`}
                        />
                      </div>

                    </div>

                    {/* 7. Action */}
                    <div className="flex items-center justify-center w-10">
                      <button
                        tabIndex="-1"
                        type="button"
                        onClick={() => handleRemove(row.id)}
                        disabled={products.length === 1}
                        className="flex items-center justify-center w-8 h-8 rounded-md text-gray-400 bg-transparent transition-all duration-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                      >
                        <TrashIcon className="w-[16px] h-[16px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PREMIUM ANCHORED STICKY FOOTER */}
          <footer className="mt-2 px-8 lg:px-10 py-5 bg-[#FCFCFD] border-t border-gray-100 flex items-center justify-between gap-4 rounded-b-[32px]">
            <button
              tabIndex="-1"
              onClick={handleAdd}
              className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all duration-200 hover:border-gray-300 hover:text-gray-900 active:scale-[0.98]"
            >
              <PlusIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              Add Row Parameter
            </button>

            <button 
              onClick={validateAndSubmit}
              disabled={isSubmitting}
              className="relative overflow-hidden rounded-lg bg-gray-900 px-6 py-2 text-[13px] font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-200 hover:bg-gray-800 hover:shadow-[0_4px_12px_rgba(0,0,0,0.16)] active:translate-y-0 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                {isSubmitting ? "Processing..." : "Commit Workspace Shifts"}
              </span>
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}