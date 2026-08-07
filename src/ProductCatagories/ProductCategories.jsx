import React, { useState, useMemo, useCallback, useEffect } from "react";
import * as FiIcons from "react-icons/fi";
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import { 
  FiSearch, FiX, FiChevronRight, FiAlertCircle, FiChevronDown, FiMenu, FiRefreshCw
} from "react-icons/fi";
import { categoryApi } from "../Shopkeeper_Home/Services/api";

import { PremiumToast } from "../components/PremiumToast";
import { DataFetchError } from "../components/DataFetchError";

// ============================================================
// CONFIGURATION & UTILS
// ============================================================
const GRADIENTS = [
  ["#111827", "#4B5563"], // Black -> Gray
  ["#EC4899", "#E11D48"], // Pink -> Rose
  ["#F43F5E", "#EA580C"], // Rose -> Orange
  ["#1F2937", "#6B7280"], // Gray -> Gray
  ["#DB2777", "#F43F5E"], // Pink -> Rose
  ["#000000", "#374151"], // Black -> Gray
];

const getGradient = (i) => GRADIENTS[i % GRADIENTS.length];

const images = import.meta.glob(
  "../assets/subcategories/*",
  { eager: true, import: "default" }
);

const getSubcategoryImageUrl = (imageName) => {
  if (!imageName) return null;
  if (imageName.startsWith('http')) return imageName;
  return images[`../assets/subcategories/${imageName}`] || null;
};

// ============================================================
// ENTERPRISE UI COMPONENTS (Empty State)
// ============================================================

function EmptyState({ title, description, icon: Icon, actionText, onAction }) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-16 px-6 text-center rounded-[24px] border border-dashed border-gray-200 bg-white/60 backdrop-blur-md min-h-[350px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.02)] transition-all duration-300">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 mb-5 shadow-sm border border-gray-100 ring-4 ring-gray-50/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-pink-500/5 rounded-2xl animate-pulse" />
        {Icon ? <Icon className="h-7 w-7 text-gray-400 relative z-10" /> : <FiSearch className="h-7 w-7 text-gray-400 relative z-10" />}
      </div>
      <h3 className="text-[18px] sm:text-[20px] font-extrabold tracking-tight text-gray-900 mb-2">
        {title || "No items found"}
      </h3>
      <p className="text-[14px] text-gray-500 max-w-sm mb-8 leading-relaxed">
        {description || "We couldn't find anything matching your criteria. Please try adjusting your filters or search terms."}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="rounded-xl bg-pink-50 text-pink-600 px-6 py-2.5 text-[14px] font-semibold transition-all duration-200 ease-out hover:bg-pink-100 hover:scale-[1.02] active:scale-[0.98] border border-pink-100"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

// ============================================================
// COMPONENTS
// ============================================================

const Scrollbar = React.forwardRef(function Scrollbar({ className = "", children, ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={`overflow-y-auto overflow-x-auto
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar]:h-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-200
        hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
        transition-colors duration-200
        ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
});

function SearchBar({ value, onChange, resultCount, placeholder }) {
  return (
    <div className="w-full">
      <div className="group relative flex w-full items-center">
        <div className="absolute inset-0 rounded-[16px] bg-white transition-all duration-300 group-focus-within:shadow-[0_0_24px_-4px_rgba(236,72,153,0.15)]"></div>
        <div className="relative flex w-full items-center gap-3 rounded-[13px] border border-gray-200 bg-white/60 backdrop-blur-xl px-4 h-[48px] lg:h-[46px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 ease-out focus-within:border-pink-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-pink-500/10 hover:border-gray-300">
          <FiSearch className="h-4 w-4 shrink-0 text-gray-400 transition-colors duration-200 group-focus-within:text-pink-500" aria-hidden="true" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Search products Category..."}
            aria-label="Search categories"
            className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-gray-900 placeholder:text-gray-400 outline-none"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="shrink-0 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-150 outline-none"
            >
              <FiX className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {value && (
        <p className="absolute mt-1.5 pl-2 text-[12px] font-medium text-gray-500">
          {resultCount === 0 ? "No matches" : `${resultCount} matches found`}
        </p>
      )}
    </div>
  );
}

function PageHeader({ searchTerm, onSearchChange, resultCount }) {
  return (
    <header className="relative w-full bg-[#FAFAFA] pt-6 pb-2 ps-1 lg:pt-6 lg:pb-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-col">
          <h1 className="text-[24px] sm:text-[32px] font-extrabold tracking-tight text-gray-900">
            Product Categories
          </h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-gray-500">
            Browse wholesale product categories and discover suppliers.
          </p>
        </div>
        
        <div className="block lg:hidden w-full mt-2">
          <SearchBar
            value={searchTerm}
            onChange={onSearchChange}
            resultCount={resultCount}
          />
        </div>
      </div>
    </header>
  );
}

function DesktopCategoryItem({ category, isActive, onSelect, matchCount, hasSearch }) {
  const Icon = FiIcons[category.icon] || FiIcons.FiGrid;
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(category.id)}
        className={`group relative flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 outline-none
          ${isActive 
            ? "bg-white border border-pink-100 shadow-[0_4px_16px_-4px_rgba(236,72,153,0.12)]" 
            : "border border-transparent hover:bg-gray-100/80"}`}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 h-[60%] w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-pink-500 to-rose-500"></div>
        )}
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 
          ${isActive ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-sm" : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm"}`}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block truncate text-[14px] transition-colors duration-200 
            ${isActive ? "font-bold text-gray-900" : "font-medium text-gray-600 group-hover:text-gray-900"}`}>
            {category.name}
          </span>
          {hasSearch && (
            <span className={`block text-[11px] font-medium mt-0.5 ${isActive ? "text-pink-600" : "text-gray-400"}`}>
              {matchCount} match{matchCount === 1 ? "" : "es"}
            </span>
          )}
        </span>
        <FiChevronRight
          className={`h-4 w-4 shrink-0 transition-all duration-200 
            ${isActive ? "translate-x-0 text-pink-400 opacity-100" : "-translate-x-1 text-gray-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}
        />
      </button>
    </li>
  );
}

function ProductCard({ subcategory, gradient, onClick }) {
  const { name, imageName } = subcategory;
  const [imgError, setImgError] = useState(false);
  const initials = name ? name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() : "CT";
  const [from, to] = gradient;
  const imageUrl = getSubcategoryImageUrl(imageName);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-2.5 lg:gap-4 lg:rounded-[20px] lg:border lg:border-gray-300/60 lg:bg-white lg:p-4 text-center transition-all duration-300 ease-out lg:hover:-translate-y-1 lg:hover:border-pink-200 lg:hover:shadow-[0_12px_24px_-8px_rgba(236,72,153,0.12)] focus:outline-none"
    >
      <span className="relative flex h-[85px] w-[100px] sm:h-20 sm:w-20 lg:h-24 lg:w-24 items-center justify-center">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            onError={() => setImgError(true)}
            className="h-full w-full rounded-[16px] lg:rounded-2xl object-cover shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] lg:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out group-hover:scale-[1.05] bg-gray-50 border border-gray-100"
            alt={name}
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center rounded-[16px] lg:rounded-2xl text-[15px] lg:text-xl font-bold text-white shadow-sm transition-transform duration-300 ease-out group-hover:scale-[1.05]"
            style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
          >
            {initials}
          </span>
        )}
      </span>
      <span className="line-clamp-2 text-[12px] sm:text-[13px] lg:text-[14px] font-semibold leading-snug tracking-tight text-gray-800 lg:text-gray-900 transition-colors duration-200 group-hover:text-pink-600 px-1">
        {name}
      </span>
    </button>
  );
}

function ProductGrid({ subcategories, gradient, onSelectSubcategory, searchTerm, onClearSearch }) {
  if (!subcategories || subcategories.length === 0) {
    return (
      <div className="flex w-full justify-center pt-8 lg:pt-12 px-2">
        <EmptyState 
          title="No products found"
          description={searchTerm ? `No products match "${searchTerm}" in this category.` : "There are currently no products available in this category."}
          icon={FiSearch}
          actionText={searchTerm ? "Clear Search" : null}
          onAction={onClearSearch}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
      {subcategories.map((sub) => (
        <ProductCard
          key={sub.id}
          subcategory={sub}
          gradient={gradient}
          onClick={() => onSelectSubcategory?.(sub)}
        />
      ))}
    </div>
  );
}

function MainContentArea({ category, subcategories, searchTerm, setSearchTerm, resultCount, onSelectSubcategory }) {
  if (!category) return null;

  return (
    <div className="flex flex-1 lg:h-[565px] flex-col w-full min-w-0">
      <div className="ps-5 pb-2 lg:px-6 lg:py-4 lg:border-b lg:border-gray-100 lg:bg-gray-50/50 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-2 lg:mb-0">
        <div>
          <h3 className="text-xl lg:text-[18px] font-extrabold tracking-tight text-slate-800">
            {category.name}
          </h3>
          <p className=" ps-1 mt-1 flex items-center gap-2 text-[13px] font-medium text-gray-500">
            <span>{subcategories?.length || 0} items Available</span>
            {category.sellerCount > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                <span>{category.sellerCount} suppliers</span>
              </>
            )}
          </p>
        </div>
        
        <div className="hidden lg:block w-full max-w-[320px]">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            resultCount={resultCount}
          />
        </div>
      </div>
      
      <Scrollbar className="px-3 pb-8 lg:px-6 lg:py-5 lg:h-[520px] lg:max-h-[calc(100vh-140px)]">
        <ProductGrid
          subcategories={subcategories}
          gradient={category.gradient}
          onSelectSubcategory={onSelectSubcategory}
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm("")}
        />
      </Scrollbar>
    </div>
  );
}

function MobileCategorySheet({ isOpen, onClose, categories, activeId, onSelect, matchCounts, hasSearch }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full h-[70vh] bg-white rounded-t-[24px] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out translate-y-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-[16px] font-bold text-gray-900">All Categories</h3>
          <button onClick={onClose} className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        
        <Scrollbar className="flex-1 px-4 py-3">
          <ul className="flex flex-col space-y-1 pb-10">
            {categories.map(category => {
              const Icon = FiIcons[category.icon] || FiIcons.FiGrid;
              const isActive = category.id === activeId;
              const matchCount = matchCounts[category.id] || 0;
              
              return (
                <li key={category.id}>
                  <button
                    onClick={() => {
                      onSelect(category.id);
                      onClose();
                    }}
                    className={`flex w-full items-center gap-4 rounded-xl p-3 text-left transition-colors ${isActive ? 'bg-pink-50' : 'active:bg-gray-50'}`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isActive ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="flex-1">
                      <span className={`block text-[15px] ${isActive ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                        {category.name}
                      </span>
                      {hasSearch && (
                        <span className="block text-[12px] font-medium text-pink-600 mt-0.5">
                          {matchCount} match{matchCount === 1 ? "" : "es"}
                        </span>
                      )}
                    </span>
                    {isActive && <FiChevronRight className="h-5 w-5 text-pink-500" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </Scrollbar>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1920px] px-4 flex flex-col gap-4 lg:gap-8 min-h-screen bg-[#FAFAFA] pt-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full mb-2">
        <div className="flex flex-col gap-2 w-full lg:w-1/3">
          <div className="h-8 lg:h-10 bg-gray-200/80 rounded-xl w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200/80 rounded-lg w-1/2 animate-pulse"></div>
        </div>
        <div className="h-12 bg-gray-200/80 rounded-xl w-full lg:w-[320px] animate-pulse"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative items-start pb-12">
        <div className="flex-1 w-full bg-white lg:rounded-[24px] lg:border lg:border-gray-200/80 lg:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] lg:overflow-hidden lg:p-6">
          <div className="hidden lg:flex justify-between items-center mb-6">
             <div className="h-6 bg-gray-200/80 rounded-lg w-1/4 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="h-[85px] w-[100px] sm:h-20 sm:w-20 lg:h-24 lg:w-24 bg-gray-200/80 rounded-[16px] lg:rounded-2xl animate-pulse"></div>
                <div className="h-3 bg-gray-200/80 rounded-md w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-col w-[300px] xl:w-[320px] shrink-0 bg-white rounded-[24px] border border-gray-200/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] p-3">
          <div className="h-5 w-24 bg-gray-200/80 rounded-md mb-4 mx-2 mt-2 animate-pulse"></div>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
              <div className="h-8 w-8 rounded-lg bg-gray-200/80 shrink-0 animate-pulse"></div>
              <div className="h-4 bg-gray-200/80 rounded-md w-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductCategoriesPage() {
  const location = useLocation();

  const [notification, setNotification] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const showNotification = (type, msg) => {
    setNotification({ type, msg });
  };

  const { 
    data: categoriesData = [], 
    isLoading, 
    isError, 
    error: fetchError,
    refetch 
  } = useQuery({
    queryKey: ['categoriesDataList'],
    queryFn: async () => {
      const data = await categoryApi.getAllCategories();
      return data.map((cat, index) => ({
        ...cat,
        gradient: getGradient(index),
        count: cat.subcategories ? cat.subcategories.length : 0,
      }));
    },
    staleTime: 5 * 60 * 1000, 
  });

  useEffect(() => {
    if (categoriesData.length > 0 && !activeCategoryId) {
      const initialRequestedId = location.state?.selectedCategoryId;
      const matchingCategory = categoriesData.find(c => c.id === initialRequestedId);
      setActiveCategoryId(matchingCategory ? matchingCategory.id : categoriesData[0].id);
    }
  }, [categoriesData, activeCategoryId, location.state?.selectedCategoryId]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const searchIndex = useMemo(() => {
    if (!normalizedSearch || categoriesData.length === 0) return null;
    const index = {};
    for (const category of categoriesData) {
      const nameMatches = category.name.toLowerCase().includes(normalizedSearch);
      const matchingSubs = category.subcategories?.filter((sub) =>
        sub.name.toLowerCase().includes(normalizedSearch)
      ) || [];
      if (nameMatches || matchingSubs.length > 0) {
        index[category.id] = { nameMatches, matchingSubs };
      }
    }
    return index;
  }, [normalizedSearch, categoriesData]);

  const visibleCategories = useMemo(() => {
    if (!searchIndex) return categoriesData;
    return categoriesData.filter((c) => searchIndex[c.id]);
  }, [searchIndex, categoriesData]);

  const matchCounts = useMemo(() => {
    if (!searchIndex) return {};
    return Object.fromEntries(
      Object.entries(searchIndex).map(([id, v]) => [
        id,
        v.matchingSubs.length || (v.nameMatches ? 1 : 0),
      ])
    );
  }, [searchIndex]);

  const totalResultCount = useMemo(() => {
    if (!searchIndex) return 0;
    return Object.values(matchCounts).reduce((sum, n) => sum + n, 0);
  }, [matchCounts, searchIndex]);

  useEffect(() => {
    if (visibleCategories.length === 0) return;
    const stillVisible = visibleCategories.some((c) => c.id === activeCategoryId);
    if (!stillVisible) {
      setActiveCategoryId(visibleCategories[0].id);
    }
  }, [visibleCategories, activeCategoryId]);

  const activeCategory = useMemo(
    () => visibleCategories.find((c) => c.id === activeCategoryId) ?? null,
    [visibleCategories, activeCategoryId]
  );

  const visibleSubcategories = useMemo(() => {
    if (!activeCategory) return [];
    if (!searchIndex) return activeCategory.subcategories || [];
    const entry = searchIndex[activeCategory.id];
    if (!entry) return [];
    return entry.matchingSubs.length > 0 ? entry.matchingSubs : (activeCategory.subcategories || []);
  }, [activeCategory, searchIndex]);

  const handleSelectCategory = useCallback((id) => {
    setActiveCategoryId(id);
  }, []);

  const handleSelectSubcategory = useCallback((sub) => {
    console.log(`Navigating to subcategory: ${sub.slug || sub.id}`);
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // ✅ PERFECTLY HANDLES SPRING BOOT CUSTOM ERRORS
  if (isError) {
    return (
      <DataFetchError 
        errorTitle="Connection Failed"
        errorMessage={fetchError?.response?.data?.message || fetchError?.message || "An unexpected error occurred."} 
        onRetry={refetch} 
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <PremiumToast 
        isVisible={!!notification} 
        type={notification?.type || 'info'} 
        message={notification?.msg} 
        onClose={() => setNotification(null)} 
      />

      <div className="mx-auto w-full max-w-[1920px] px-4 flex flex-col gap-4 lg:gap-8">
        
        <PageHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          resultCount={totalResultCount}
        />

        {visibleCategories.length > 0 && (
          <div className="block lg:hidden w-full sticky top-[60px] z-20 bg-[#FAFAFA] border-b border-gray-200 -mx-4 px-4 sm:-mx-6 sm:px-6">
            <div className="flex items-center w-full">
              <div className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden flex space-x-5 py-2.5">
                {visibleCategories.map(cat => {
                  const isActive = cat.id === activeCategoryId;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`whitespace-nowrap text-[14px] px-1 pb-1 border-b-2 transition-all ${
                        isActive 
                          ? 'border-gray-900 text-gray-900 font-bold' 
                          : 'border-transparent text-gray-500 font-medium'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
              
              <button 
                onClick={() => setIsMobileSheetOpen(true)}
                className="ml-3 pl-3 py-2 border-l border-gray-200 text-gray-600 bg-[#FAFAFA] shadow-[-12px_0_15px_-5px_rgba(250,250,250,1)] flex items-center gap-1"
              >
                 <FiMenu className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {visibleCategories.length === 0 ? (
          <div className="flex-1 w-full min-w-0 mt-4 lg:mt-6 pb-12 flex items-start justify-center">
             <div className="w-full max-w-2xl">
               <EmptyState 
                 title="No Categories or Products Found"
                 description={`We couldn't find any results for "${searchTerm}". Please try a different spelling or keyword.`}
                 icon={FiSearch}
                 actionText="Clear Search"
                 onAction={() => setSearchTerm("")}
               />
             </div>
          </div>
        ) : (
          <>
          <div className="flex flex-col lg:flex-row gap-8 relative items-start pb-12">
            
            <main className="flex-1 w-full min-w-0 mt-4 lg:mt-0 lg:bg-white lg:rounded-[24px] lg:border lg:border-gray-200/80 lg:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] lg:overflow-hidden">
              <MainContentArea
                category={activeCategory}
                subcategories={visibleSubcategories}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                resultCount={totalResultCount}
                onSelectSubcategory={handleSelectSubcategory}
              />
            </main>

            <aside className="hidden lg:block w-[300px] xl:w-[320px] shrink-0 sticky top-8 z-10 bg-white rounded-[24px] border border-gray-200/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-gray-500">Categories</h3>
              </div>
              <Scrollbar className="w-full lg:h-[520px] px-3 py-3 max-h-[calc(100vh-140px)]">
                <ul className="flex flex-col space-y-1.5">
                  {visibleCategories.map((category) => (
                    <DesktopCategoryItem
                      key={category.id}
                      category={category}
                      isActive={category.id === activeCategoryId}
                      onSelect={handleSelectCategory}
                      matchCount={matchCounts[category.id] || 0}
                      hasSearch={Boolean(searchTerm)}
                    />
                  ))}
                </ul>
              </Scrollbar>
            </aside>
            
          </div>
          </>
        )}
      </div>

      <MobileCategorySheet
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
        categories={visibleCategories}
        activeId={activeCategoryId}
        onSelect={handleSelectCategory}
        matchCounts={matchCounts}
        hasSearch={Boolean(searchTerm)}
      />
    </div>
  );
}