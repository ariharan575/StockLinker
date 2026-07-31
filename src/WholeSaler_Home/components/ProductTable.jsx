import React, { useState, useCallback, useRef, useEffect } from "react";
import { productApi } from '../services/api';
import { Search, ChevronDown, Trash2, Plus } from 'lucide-react';
import SectionHeader from "./SectionHeader";

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
  const [products, setProducts] = useState([createEmptyRow(), createEmptyRow()]);
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
      console.error(err);
    }
  };

  const selectSuggestion = (rowId, suggestion) => {
    handleChange(rowId, "productName", suggestion.name);
    handleChange(rowId, "masterProductId", suggestion.id);
    setSuggestions([]);
    setActiveSearchRow(null);
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
      alert("Fill in at least one product.");
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
    if (!isValid) return alert(missingMasterProduct ? "Select Product from dropdown." : "Fix highlighted fields.");

    setIsSubmitting(true);
    try {
      const payload = rowsToValidate.map(p => ({
        masterProductId: p.masterProductId, brand: p.brand, unit: p.unit, minimumOrderQuantity: Number(p.minQty),
        price: Number(p.price), bulkDealQuantity: p.bulkQty ? Number(p.bulkQty) : null, bulkDealPrice: p.bulkPrice ? Number(p.bulkPrice) : null, availableStock: Number(p.stock)
      }));
      await productApi.saveBulkProducts(payload);
      setProducts([createEmptyRow(), createEmptyRow()]);
      alert("Catalog updated.");
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full font-inter" onKeyDown={handleKeyDown} ref={workspaceRef}>
      <SectionHeader title="Inventory Updates" subtitle="Add or modify bulk products quickly" />

      <div className="mt-6 w-full overflow-x-auto no-scrollbar border border-gray-200 rounded-xl">
        <div className="min-w-[900px]">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1fr_1.5fr_1fr_60px] gap-0 bg-gray-50 border-b border-gray-200 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            <div className="py-3 px-4">Product Search</div>
            <div className="py-3 px-4 border-l border-gray-200">Brand</div>
            <div className="py-3 px-4 border-l border-gray-200">Min & Unit</div>
            <div className="py-3 px-4 border-l border-gray-200">Rate (₹)</div>
            <div className="py-3 px-4 border-l border-gray-200">Bulk Deal</div>
            <div className="py-3 px-4 border-l border-gray-200">Stock</div>
            <div className="py-3 px-4 border-l border-gray-200 text-center">Act</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100 bg-white">
            {products.map((row) => (
              <div key={row.id} className="grid grid-cols-[2fr_1.2fr_1.2fr_1fr_1.5fr_1fr_60px] gap-0 hover:bg-gray-50/50 transition-colors">
                
                {/* Search */}
                <div className="relative p-2">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={row.productName}
                    onChange={(e) => handleProductSearch(row.id, e.target.value)}
                    placeholder="Search..."
                    className={`w-full h-9 pl-8 pr-3 text-[13px] bg-transparent outline-none border rounded-md transition-all focus:ring-1 focus:ring-rose-500 focus:border-rose-500 ${errors[`${row.id}-productName`] ? "border-red-300" : "border-transparent hover:border-gray-300"}`}
                  />
                  {activeSearchRow === row.id && suggestions.length > 0 && (
                    <div className="absolute top-[44px] left-2 right-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {suggestions.map((sug) => (
                        <div key={sug.id} onClick={() => selectSuggestion(row.id, sug)} className="px-3 py-2 text-[13px] text-gray-800 hover:bg-gray-50 cursor-pointer border-b border-gray-50 truncate">
                          {sug.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Brand */}
                <div className="p-2 border-l border-gray-100">
                  <input
                    type="text"
                    value={row.brand}
                    onChange={(e) => handleChange(row.id, "brand", e.target.value)}
                    placeholder="Brand"
                    className={`w-full h-9 px-3 text-[13px] bg-transparent outline-none border rounded-md transition-all focus:ring-1 focus:ring-rose-500 focus:border-rose-500 ${errors[`${row.id}-brand`] ? "border-red-300" : "border-transparent hover:border-gray-300"}`}
                  />
                </div>

                {/* Min & Unit */}
                <div className="p-2 border-l border-gray-100 flex items-center gap-1">
                  <input
                    type="number"
                    value={row.minQty}
                    onChange={(e) => handleChange(row.id, "minQty", e.target.value)}
                    placeholder="Qty"
                    className={`w-1/2 h-9 px-2 text-[13px] bg-transparent outline-none border rounded-md transition-all focus:ring-1 focus:ring-rose-500 focus:border-rose-500 ${errors[`${row.id}-minQty`] ? "border-red-300" : "border-transparent hover:border-gray-300"}`}
                  />
                  <div className="relative w-1/2 h-9">
                    <select
                      value={row.unit}
                      onChange={(e) => handleChange(row.id, "unit", e.target.value)}
                      className="w-full h-full pl-2 pr-6 text-[13px] bg-transparent outline-none appearance-none cursor-pointer border border-transparent hover:border-gray-300 rounded-md focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    >
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Base Rate */}
                <div className="p-2 border-l border-gray-100 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-gray-400">₹</span>
                  <input
                    type="number"
                    value={row.price}
                    onChange={(e) => handleChange(row.id, "price", e.target.value)}
                    placeholder="Rate"
                    className={`w-full h-9 pl-6 pr-2 text-[13px] bg-transparent outline-none border rounded-md transition-all focus:ring-1 focus:ring-rose-500 focus:border-rose-500 ${errors[`${row.id}-price`] ? "border-red-300" : "border-transparent hover:border-gray-300"}`}
                  />
                </div>

                {/* Bulk Deal */}
                <div className="p-2 border-l border-gray-100 flex items-center gap-1">
                  <input
                    type="number"
                    value={row.bulkQty}
                    onChange={(e) => handleChange(row.id, "bulkQty", e.target.value)}
                    placeholder="Qty"
                    className={`w-[45%] h-9 px-2 text-[13px] bg-transparent outline-none border rounded-md transition-all focus:ring-1 focus:ring-rose-500 focus:border-rose-500 ${errors[`${row.id}-bulkQty`] ? "border-red-300" : "border-transparent hover:border-gray-300"}`}
                  />
                  <span className="text-gray-300 text-xs">@</span>
                  <input
                    type="number"
                    value={row.bulkPrice}
                    onChange={(e) => handleChange(row.id, "bulkPrice", e.target.value)}
                    placeholder="₹ Deal"
                    className={`w-[45%] h-9 px-2 text-[13px] bg-transparent outline-none border rounded-md transition-all focus:ring-1 focus:ring-rose-500 focus:border-rose-500 ${errors[`${row.id}-bulkPrice`] ? "border-red-300" : "border-transparent hover:border-gray-300"}`}
                  />
                </div>

                {/* Stock */}
                <div className="p-2 border-l border-gray-100">
                  <input
                    type="number"
                    value={row.stock}
                    onChange={(e) => handleChange(row.id, "stock", e.target.value)}
                    placeholder="Count"
                    className={`w-full h-9 px-3 text-[13px] bg-transparent outline-none border rounded-md transition-all focus:ring-1 focus:ring-rose-500 focus:border-rose-500 ${errors[`${row.id}-stock`] ? "border-red-300" : "border-transparent hover:border-gray-300"}`}
                  />
                </div>

                {/* Act */}
                <div className="p-2 border-l border-gray-100 flex items-center justify-center">
                  <button
                    tabIndex="-1"
                    type="button"
                    onClick={() => handleRemove(row.id)}
                    disabled={products.length === 1}
                    className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="bg-gray-50 border-t border-gray-200 p-3 flex items-center justify-between">
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:border-gray-400 active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
            <button 
              onClick={validateAndSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 text-[12px] font-semibold text-white bg-black rounded-lg hover:bg-gray-900 active:scale-[0.98] disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save Updates"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}