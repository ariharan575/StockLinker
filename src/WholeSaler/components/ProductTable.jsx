import React, { useState, useCallback, memo } from "react";

// --- Icons (Lucide-inspired, precise SVGs) ---
const SearchIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const PackageIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4 7.5 4.21"></path><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="M3.27 6.96 12 12.01l8.73-5.05"></path><path d="M12 22.08V12"></path>
  </svg>
);
const LayersIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline>
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

const UNITS = ["Per Unit", "Per Kg", "Per Bag", "Per Tin", "Per Pkt"];

// --- Reusable Premium Form Inputs ---

const PremiumInput = memo(({ icon: Icon, prefix, className = "", ...props }) => {
  return (
    <div className="relative group flex items-center w-full">
      {Icon && (
        <div className="absolute left-3.5 flex items-center justify-center text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200">
          <Icon className="w-[16px] h-[16px]" />
        </div>
      )}
      {prefix && (
        <div className="absolute left-4 font-semibold text-gray-400 group-focus-within:text-indigo-600 text-[13px] transition-colors duration-200">
          {prefix}
        </div>
      )}
      <input
        {...props}
        className={`w-full h-10 bg-[#FAFBFC] border border-gray-200 rounded-lg text-[13px] font-medium text-gray-900 placeholder:text-gray-400/90 outline-none transition-all duration-200 hover:border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 ${
          Icon || prefix ? "pl-9" : "pl-3.5"
        } pr-3.5 ${className}`}
      />
    </div>
  );
});

const PremiumSelect = memo(({ icon: Icon, options, ...props }) => {
  return (
    <div className="relative group flex items-center w-full">
      {Icon && (
        <div className="absolute left-3.5 flex items-center justify-center text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200 z-10 pointer-events-none">
          <Icon className="w-[16px] h-[16px]" />
        </div>
      )}
      <select
        {...props}
        className={`w-full h-10 bg-[#FAFBFC] border border-gray-200 rounded-lg text-[13px] font-medium text-gray-900 outline-none transition-all duration-200 cursor-pointer hover:border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 appearance-none ${
          Icon ? "pl-9" : "pl-3.5"
        } pr-9`}
      >
        <option value="" disabled hidden>Select Unit</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-3 text-gray-400 pointer-events-none group-focus-within:text-indigo-600 transition-colors duration-200">
        <ChevronDownIcon className="w-[16px] h-[16px]" />
      </div>
    </div>
  );
});

// --- Table Structural Component ---

const HeaderLabel = ({ children }) => (
  <div className="text-[11px] font-bold tracking-wider text-gray-400 uppercase select-none">
    {children}
  </div>
);

// --- Individual Row Structure ---

const ProductCard = memo(({ product, onChange, onRemove }) => {
  const update = useCallback(
    (field) => (e) => onChange(product.id, field, e.target.value),
    [product.id, onChange]
  );

  return (
    <div className="group flex items-center gap-4 py-[7px] border-b border-gray-100 last:border-0 w-full transition-colors duration-150">
      <div className="flex-1 grid grid-cols-[minmax(260px,2.5fr)_minmax(140px,1fr)_minmax(150px,1.2fr)_minmax(140px,1fr)_minmax(140px,1fr)] gap-4 items-center w-full">
        <PremiumInput
          icon={SearchIcon}
          value={product.name}
          onChange={update("name")}
          placeholder="Search or enter wholesale asset name"
          aria-label="Product Name"
        />
        
        <PremiumInput
          prefix="₹"
          type="number"
          value={product.price}
          onChange={update("price")}
          placeholder="0.00"
          aria-label="Wholesale Price"
        />

        <PremiumSelect
          icon={PackageIcon}
          value={product.unit}
          onChange={update("unit")}
          options={UNITS}
          aria-label="Unit Type"
        />

        <PremiumInput
          type="number"
          value={product.minQty}
          onChange={update("minQty")}
          placeholder="Min order threshold"
          aria-label="Minimum Quantity"
        />

        <PremiumInput
          icon={LayersIcon}
          type="number"
          value={product.stock}
          onChange={update("stock")}
          placeholder="Units available"
          aria-label="Available Stock"
        />
      </div>

      <div className="flex items-center justify-center w-10">
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          aria-label="Delete product"
          className="flex items-center justify-center w-8 h-8 rounded-md text-gray-400 bg-transparent transition-all duration-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95"
        >
          <TrashIcon className="w-[16px] h-[16px]" />
        </button>
      </div>
    </div>
  );
});

// --- Refactored Premium Workspace Architecture ---

export default function WholesaleProductWorkspace() {
  const [products, setProducts] = useState([
    { id: "p1", name: "", price: "", unit: "", minQty: "", stock: "" },
    { id: "p2", name: "", price: "", unit: "", minQty: "", stock: "" },
    { id: "p3", name: "", price: "", unit: "", minQty: "", stock: "" }
  ]);

  const handleChange = useCallback((id, field, value) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }, []);

  const handleRemove = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleAdd = useCallback(() => {
    setProducts((prev) => [
      ...prev,
      { id: `p${Date.now()}`, name: "", price: "", unit: "", minQty: "", stock: "" },
    ]);
  }, []);

  return (
    <div className="w-full min-h-full bg-[#FAFBFC] flex justify-center items-start overflow-y-auto">
      {/* 
        PREMIUM MAIN CONTAINER
        - Fluid content-driven sizing framework
        - Layered custom drop shadow arrays mimicking high-end engineering platforms
        - 32px signature rounding system 
      */}
      <div className="w-full max-w-[1480px] bg-white rounded-[32px] border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_16px_rgba(0,0,0,0.02),0_16px_48px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Subtle specularity line at the exact top border edge */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10 " />

        {/* Integrated Header Matrix */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 lg:p-10 border-b border-gray-100 bg-white ">
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
              Configure commercial wholesale distribution items, regional pricing points, and synchronized warehouse catalog instances.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-gray-200 text-[13px] font-semibold text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98]">
              <CloudUploadIcon className="text-gray-400" />
              Bulk CSV Ingestion
            </button>
          </div>
        </header>

        {/* Workspace Matrix Content Layout */}
        {products.length === 0 ? (
          /* Tailored Static Empty Workspace Frame */
          <div className="flex flex-col items-center justify-center py-20 px-8 bg-white">
            <div className="w-12 h-12 mb-4 rounded-xl bg-[#FAFBFC] border border-gray-200/60 flex items-center justify-center text-gray-400 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <PackageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">No wholesale records available</h3>
            <p className="text-gray-400 font-medium text-[13px] text-center max-w-xs mb-5">
              Your inventory pipeline is currently empty. Populate the catalog rows manually or trigger an ingestion sheet.
            </p>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-[13px] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-gray-800 transition-all duration-200 active:scale-95"
            >
              <PlusIcon className="w-4 h-4" />
              Add Initial Row
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col bg-white">
            {/* Horizontal Scroll wrapper for standard display density preservation */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1100px] px-8 lg:px-10 pt-6">
                
                {/* Fixed Structural Table Header Columns */}
                <div className="flex items-center gap-4 pb-3 border-b border-gray-100 w-full pl-[2px]">
                  <div className="grid grid-cols-[minmax(260px,2.5fr)_minmax(140px,1fr)_minmax(150px,1.2fr)_minmax(140px,1fr)_minmax(140px,1fr)] gap-4 flex-1">
                    <HeaderLabel>Product Context & Nomenclature</HeaderLabel>
                    <HeaderLabel>B2B Wholesale Rate</HeaderLabel>
                    <HeaderLabel>Fulfillment Unit</HeaderLabel>
                    <HeaderLabel>Minimum Order Volume</HeaderLabel>
                    <HeaderLabel>Stockpile Allocation</HeaderLabel>
                  </div>
                  <div className="w-10 flex justify-center">
                    <HeaderLabel>Void</HeaderLabel>
                  </div>
                </div>

                {/* Self-sizing Variable Workspace Item List */}
                <div className="flex flex-col py-2">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onChange={handleChange}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>

              </div>
            </div>

            {/* 
              PREMIUM ANCHORED STICKY FOOTER
              - Locks precisely onto the final row item element eliminating lower voids
              - Different background tint (#FCFCFD) for layout weight structure
            */}
            <footer className="mt-2 px-8 lg:px-10 py-5 bg-[#FCFCFD] border-t border-gray-100 flex items-center justify-between gap-4">
              <button
                onClick={handleAdd}
                className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all duration-200 hover:border-gray-300 hover:text-gray-900 active:scale-[0.98]"
              >
                <PlusIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                Add Row Parameter
              </button>

              <button className="relative overflow-hidden rounded-lg bg-gray-900 px-6 py-2 text-[13px] font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-200 hover:bg-gray-800 hover:shadow-[0_4px_12px_rgba(0,0,0,0.16)] active:translate-y-0 active:scale-[0.99]">
                <span className="relative z-10 flex items-center gap-1.5">
                  Commit Workspace Shifts
                </span>
              </button>
            </footer>

          </div>
        )}
      </div>
    </div>
  );
}