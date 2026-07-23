import React, { useState, useCallback, useRef, useEffect } from "react";
import { axiosInstance } from '../../Authentication/api/axiosInstance';

// --- API Definition (Combined to prevent import errors) ---
export const productApi = {
  searchMasterProducts: (query) => 
    axiosInstance.get('/v1/products/master/search', { params: { q: query } }),
    
  saveBulkProducts: (productsData) => 
    axiosInstance.post('/v1/products/seller/bulk', productsData),
};

// --- Enterprise Monochrome Icons ---
const TrashIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);
const PlusIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const ChevronDownIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
const CloudUploadIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m16 16-4-4-4 4"></path>
  </svg>
);

const UNITS = ["Kg", "Litre", "Gram", "Ml", "Bag", "Tin", "Piece", "Box", "Carton", "Dozen"];

const HeaderLabel = ({ children }) => (
  <div className="text-[10px] font-bold tracking-wider text-gray-500 uppercase select-none">
    {children}
  </div>
);

// Helper to generate empty rows
const createEmptyRow = () => ({
  id: `r${crypto.randomUUID()}`,
  masterProductId: "",
  productName: "",
  brand: "",
  packageSize: "",
  unit: "Kg",
  price: "",
  minQty: "",
  bulkQty: "",
  bulkPrice: "",
  stock: ""
});

export default function WholesaleProductWorkspace() {
  const [products, setProducts] = useState([
    createEmptyRow(),
    createEmptyRow(),
    createEmptyRow(),
    createEmptyRow()
  ]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [activeSearchRow, setActiveSearchRow] = useState(null);

  const workspaceRef = useRef(null);

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

  const handleChange = (id, field, value) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    if (errors[`${id}-${field}`]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[`${id}-${field}`];
        return newErrs;
      });
    }
  };

  const handleRemove = (id) => {
    if (products.length === 1) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAdd = () => {
    setProducts((prev) => [...prev, createEmptyRow()]);
  };

  const handleProductSearch = async (id, query) => {
    handleChange(id, "productName", query);
    handleChange(id, "masterProductId", ""); // Clear ID if user types a new string
    
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
      p.productName.trim() || p.brand.trim() || p.packageSize || p.price || p.minQty || p.stock || p.bulkQty || p.bulkPrice
    );

    if (rowsToValidate.length === 0) {
      alert("Please fill in at least one product row before saving.");
      return;
    }

    rowsToValidate.forEach((p) => {
      if (!p.masterProductId) { 
        newErrors[`${p.id}-productName`] = true; 
        isValid = false; 
        missingMasterProduct = true;
      }
      if (!p.brand.trim()) { newErrors[`${p.id}-brand`] = true; isValid = false; }
      if (!p.packageSize || Number(p.packageSize) <= 0) { newErrors[`${p.id}-packageSize`] = true; isValid = false; }
      if (!p.price || Number(p.price) <= 0) { newErrors[`${p.id}-price`] = true; isValid = false; }
      if (!p.minQty || Number(p.minQty) < 1) { newErrors[`${p.id}-minQty`] = true; isValid = false; }
      if (!p.stock || Number(p.stock) < 0) { newErrors[`${p.id}-stock`] = true; isValid = false; }
      
      // Removed the comparative logic entirely. Just checking if they entered a negative number.
      if (p.bulkQty && Number(p.bulkQty) < 0) { 
        newErrors[`${p.id}-bulkQty`] = true; 
        isValid = false; 
      }
      if (p.bulkPrice && Number(p.bulkPrice) < 0) { 
        newErrors[`${p.id}-bulkPrice`] = true; 
        isValid = false; 
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      if (missingMasterProduct) {
        alert("VALIDATION ERROR: Please select the Master Product Name from the search dropdown suggestions.");
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
        packageSize: String(p.packageSize),
        unit: p.unit,
        price: Number(p.price),
        minimumOrderQuantity: Number(p.minQty),
        bulkDealQuantity: p.bulkQty ? Number(p.bulkQty) : null,
        bulkDealPrice: p.bulkPrice ? Number(p.bulkPrice) : null,
        availableStock: Number(p.stock)
      }));

      const response = await productApi.saveBulkProducts(payload);
      
      setProducts([createEmptyRow(), createEmptyRow(), createEmptyRow(), createEmptyRow()]);
      alert("SUCCESS: Inventory successfully updated.");
      
    } catch (error) {
      console.error("API Catch Error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Unknown server error.";
      alert(`FAILED TO SAVE: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-8 font-sans" onKeyDown={handleKeyDown} ref={workspaceRef}>
      <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
        
        {/* Workspace Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-gray-100">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">Add Products</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-gray-100 text-gray-700">
                {products.length} {products.length === 1 ? "Row" : "Rows"}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Map inventory to the master catalog. Set base MOQ, pricing, and bulk deal tiers in a single continuous row.
            </p>
          </div>
          
          <button tabIndex="-1" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
            <CloudUploadIcon /> Bulk CSV Upload
          </button>
        </header>

        {/* Dynamic Matrix Layout - True Single Row Enterprise Grid */}
        <div className="w-full px-6 py-6 overflow-visible">
          
          {/* Column Headers */}
          <div className="grid grid-cols-[minmax(160px,2fr)_minmax(100px,1.2fr)_minmax(120px,1.2fr)_minmax(140px,1.5fr)_minmax(160px,1.8fr)_minmax(80px,0.8fr)_32px] gap-3 pb-3 border-b border-gray-200 w-full items-end">
            <HeaderLabel>Master Product Search</HeaderLabel>
            <HeaderLabel>Brand</HeaderLabel>
            <HeaderLabel>Pack & Unit</HeaderLabel>
            <HeaderLabel>Base MOQ & Price (₹)</HeaderLabel>
            <HeaderLabel>Bulk Qty & Price (₹)</HeaderLabel>
            <HeaderLabel>Stock</HeaderLabel>
            <div className="flex justify-center"><HeaderLabel>Act</HeaderLabel></div>
          </div>

          {/* Configurable Data Rows */}
          <div className="flex flex-col pt-2 gap-2">
            {products.map((row) => (
              <div key={row.id} className="grid grid-cols-[minmax(160px,2fr)_minmax(100px,1.2fr)_minmax(120px,1.2fr)_minmax(140px,1.5fr)_minmax(160px,1.8fr)_minmax(80px,0.8fr)_32px] gap-3 items-center w-full relative group">
                
                {/* 1. Master Product (Autosuggest) */}
                <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={row.productName}
                    onChange={(e) => handleProductSearch(row.id, e.target.value)}
                    placeholder="Search catalog..."
                    className={`w-full h-10 px-3 text-[13px] font-medium bg-white border rounded-lg outline-none transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 hover:border-gray-300 ${
                      errors[`${row.id}-productName`] ? "border-red-500 focus:border-red-600 focus:ring-red-600 bg-red-50/20" : "border-gray-200"
                    }`}
                  />
                  {activeSearchRow === row.id && suggestions.length > 0 && (
                    <div className="absolute top-[42px] left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-56 overflow-y-auto py-1">
                      {suggestions.map((sug) => (
                        <div
                          key={sug.id}
                          onClick={() => selectSuggestion(row.id, sug)}
                          className="px-3 py-2 text-[13px] font-medium text-gray-800 hover:bg-gray-100 cursor-pointer border-b border-gray-50 last:border-0 truncate"
                        >
                          {sug.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Brand Name */}
                <input
                  type="text"
                  value={row.brand}
                  onChange={(e) => handleChange(row.id, "brand", e.target.value)}
                  placeholder="e.g. India Gate"
                  className={`w-full h-10 px-3 text-[13px] font-medium bg-white border rounded-lg outline-none transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 hover:border-gray-300 ${
                    errors[`${row.id}-brand`] ? "border-red-500 focus:border-red-600 focus:ring-red-600 bg-red-50/20" : "border-gray-200"
                  }`}
                />

                {/* 3. Combined Package & Unit */}
                <div className={`flex items-center w-full h-10 bg-white border rounded-lg overflow-hidden transition-all hover:border-gray-300 focus-within:ring-1 focus-within:ring-gray-900 focus-within:border-gray-900 ${
                  errors[`${row.id}-packageSize`] ? "border-red-500 focus-within:border-red-600 focus-within:ring-red-600 bg-red-50/20" : "border-gray-200"
                }`}>
                  <input
                    type="number"
                    value={row.packageSize}
                    onChange={(e) => handleChange(row.id, "packageSize", e.target.value)}
                    placeholder="Size"
                    className="w-1/2 h-full px-2 text-[13px] font-medium bg-transparent outline-none placeholder:text-gray-400"
                  />
                  <div className="w-px h-6 bg-gray-200 shrink-0"></div>
                  <div className="relative w-1/2 h-full bg-gray-50/50">
                    <select
                      value={row.unit}
                      onChange={(e) => handleChange(row.id, "unit", e.target.value)}
                      className="w-full h-full pl-2 pr-6 text-[13px] font-semibold text-gray-700 bg-transparent outline-none appearance-none cursor-pointer hover:bg-gray-100/50"
                    >
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <ChevronDownIcon className="absolute right-2 top-[14px] text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* 4. Combined Base MOQ & Price */}
                <div className={`flex items-center w-full h-10 bg-white border rounded-lg overflow-hidden transition-all hover:border-gray-300 focus-within:ring-1 focus-within:ring-gray-900 focus-within:border-gray-900 ${
                  errors[`${row.id}-minQty`] || errors[`${row.id}-price`] ? "border-red-500 focus-within:border-red-600 focus-within:ring-red-600 bg-red-50/20" : "border-gray-200"
                }`}>
                  <div className="relative w-1/2 h-full flex items-center">
                    <span className="absolute left-2 text-[10px] font-bold text-gray-400 select-none">Min</span>
                    <input
                      type="number"
                      value={row.minQty}
                      onChange={(e) => handleChange(row.id, "minQty", e.target.value)}
                      placeholder="1"
                      className={`w-full h-full pl-8 pr-2 text-[13px] font-medium bg-transparent outline-none placeholder:text-gray-400 ${errors[`${row.id}-minQty`] ? "bg-red-50/50" : ""}`}
                    />
                  </div>
                  <div className="w-px h-6 bg-gray-200 shrink-0"></div>
                  <div className="relative w-1/2 h-full flex items-center">
                    <span className="absolute left-2 text-[11px] font-bold text-gray-400 select-none">₹</span>
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) => handleChange(row.id, "price", e.target.value)}
                      placeholder="0.00"
                      className={`w-full h-full pl-5 pr-2 text-[13px] font-medium bg-transparent outline-none placeholder:text-gray-400 ${errors[`${row.id}-price`] ? "bg-red-50/50" : ""}`}
                    />
                  </div>
                </div>

                {/* 5. Combined Bulk Deal Qty & Price */}
                <div className={`flex items-center w-full h-10 bg-emerald-50/10 border rounded-lg overflow-hidden transition-all hover:border-emerald-300 focus-within:ring-1 focus-within:ring-emerald-600 focus-within:border-emerald-600 ${
                  errors[`${row.id}-bulkQty`] || errors[`${row.id}-bulkPrice`] ? "border-red-500 bg-red-50/20 focus-within:border-red-600 focus-within:ring-red-600" : "border-emerald-200"
                }`}>
                  <div className="relative w-[45%] h-full flex items-center bg-emerald-50/30">
                    <span className="absolute left-2 text-[10px] font-bold text-emerald-600 select-none">Qty&gt;</span>
                    <input
                      type="number"
                      value={row.bulkQty}
                      onChange={(e) => handleChange(row.id, "bulkQty", e.target.value)}
                      placeholder="100"
                      className={`w-full h-full pl-9 pr-1 text-[13px] font-medium bg-transparent outline-none placeholder:text-emerald-300/70 text-emerald-900 ${errors[`${row.id}-bulkQty`] ? "bg-red-50/50 text-red-900" : ""}`}
                    />
                  </div>
                  <div className="w-px h-6 bg-emerald-200 shrink-0"></div>
                  <div className="relative w-[55%] h-full flex items-center bg-emerald-50/30">
                    <span className="absolute left-2 text-[11px] font-bold text-emerald-600 select-none">₹</span>
                    <input
                      type="number"
                      value={row.bulkPrice}
                      onChange={(e) => handleChange(row.id, "bulkPrice", e.target.value)}
                      placeholder="Deal/Unit"
                      className={`w-full h-full pl-5 pr-2 text-[13px] font-medium bg-transparent outline-none placeholder:text-emerald-300/70 text-emerald-900 ${errors[`${row.id}-bulkPrice`] ? "bg-red-50/50 text-red-900" : ""}`}
                    />
                  </div>
                </div>

                {/* 6. Stock */}
                <input
                  type="number"
                  value={row.stock}
                  onChange={(e) => handleChange(row.id, "stock", e.target.value)}
                  placeholder="Stock"
                  className={`w-full h-10 px-3 text-[13px] font-medium bg-white border rounded-lg outline-none transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 hover:border-gray-300 ${
                    errors[`${row.id}-stock`] ? "border-red-500 focus:border-red-600 focus:ring-red-600 bg-red-50/20" : "border-gray-200"
                  }`}
                />

                {/* 7. Delete Row Action */}
                <div className="flex justify-center items-center h-10">
                  <button
                    tabIndex="-1"
                    type="button"
                    onClick={() => handleRemove(row.id)}
                    disabled={products.length === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <TrashIcon />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Footer Commits */}
        <footer className="mt-auto px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex items-center justify-between">
          <button
            tabIndex="-1"
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none shadow-sm"
          >
            <PlusIcon /> Add Blank Row
          </button>

          <button
            onClick={validateAndSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-lg shadow-md hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900/50 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Products"}
          </button>
        </footer>

      </div>
    </div>
  );
}