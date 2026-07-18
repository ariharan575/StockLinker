import React, { useState, useMemo, useCallback, useEffect } from "react";
import * as FiIcons from "react-icons/fi";
import { 
  FiSearch, FiX, FiChevronRight, FiAlertCircle, FiLoader
} from "react-icons/fi";
import { axiosInstance } from "../Authentication/api/axiosInstance";

// ============================================================
// CONFIGURATION & UTILS
// ============================================================
const GRADIENTS = [
  ["#FF4D6D", "#FF8A3D"], 
  ["#0B1220", "#334155"], 
  ["#2563EB", "#38BDF8"], 
  ["#7C3AED", "#C026D3"], 
  ["#059669", "#84CC16"], 
  ["#EA580C", "#FACC15"], 
];

const getGradient = (i) => GRADIENTS[i % GRADIENTS.length];

const images = import.meta.glob(
    "../assets/subcategories/*",
    {
        eager: true,
        import: "default"
    }
);

const getSubcategoryImageUrl = (imageName) => {
    return images[`../assets/subcategories/${imageName}`] || null;
};

// ============================================================
// COMPONENTS
// ============================================================

// ----- Scrollbar -----
const Scrollbar = React.forwardRef(function Scrollbar({ className = "", children, ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={`overflow-y-auto overflow-x-hidden
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-[#0B1220]/10
        hover:[&::-webkit-scrollbar-thumb]:bg-[#0B1220]/20
        [scrollbar-width:thin]
        [scrollbar-color:rgba(11,18,32,0.12)_transparent]
        ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
});

// ----- SearchBar -----
function SearchBar({ value, onChange, resultCount, placeholder }) {
  return (
    <div className="w-full max-w-2xl">
      <div
        className="flex items-center gap-3 rounded-2xl border border-[#E6E8EE] bg-white
                   px-4 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)]
                   focus-within:border-[#0B1220] focus-within:ring-4 focus-within:ring-[#0B1220]/5
                   transition-all duration-200"
      >
        <FiSearch className="h-5 w-5 shrink-0 text-[#94A3B8]" aria-hidden="true" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Search categories, subcategories..."}
          aria-label="Search categories, subcategories"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-[#0B1220] placeholder:text-[#94A3B8] outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="shrink-0 rounded-full p-1 text-[#94A3B8] hover:bg-[#F1F2F5] hover:text-[#0B1220]
                       transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1220]/30"
          >
            <FiX className="h-4 w-4" />
          </button>
        )}
      </div>
      {value && (
        <p className="mt-2 pl-1 text-[13px] text-[#64748B]" role="status" aria-live="polite">
          {resultCount === 0
            ? `No matches for "${value}"`
            : `${resultCount} result${resultCount === 1 ? "" : "s"} for "${value}"`}
        </p>
      )}
    </div>
  );
}

// ----- HeroSection -----
function HeroSection({ searchTerm, onSearchChange, resultCount }) {
  return (
    <header className="px-1 pb-6 flex items-center justify-between sm:px-8">
      <div>
        <h1 className="text-[26px] font-extrabold tracking-tight text-[#0B1220] sm:text-[34px]">
          Product Categories
        </h1>
        <p className="mt-1 max-w-2xl text-[15px] text-[#64748B]">
          Browse all wholesale categories and discover suppliers faster.
        </p>
      </div>
      <div className="mt-5">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          resultCount={resultCount}
          placeholder="Search for subcategories..."
        />
      </div>
    </header>
  );
}

// ----- CategoryItem (Sidebar Link) -----
function CategoryItem({ category, isActive, onSelect, matchCount, hasSearch }) {
  const Icon = FiIcons[category.icon] || FiIcons.FiGrid;

  return (
    <li role="none">
      <button
        type="button"
        role="tab"
        aria-selected={isActive}
        id={`category-tab-${category.id}`}
        aria-controls={`category-panel-${category.id}`}
        onClick={() => onSelect(category.id)}
        className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left
          transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1220]/40
          ${isActive ? "bg-gray-300" : "hover:bg-[#F1F2F5]"}`}
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 
          ${isActive ? "" : "bg-[#F1F2F5] text-[#334155] group-hover:bg-white"}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block truncate text-[14px] font-medium transition-colors duration-200 ${isActive ? "" : "text-[#0B1220]"}`}>
            {category.name}
          </span>
          {hasSearch && (
            <span className={`block text-[11px] ${isActive ? "text-gray-600" : "text-[#94A3B8]"}`}>
              {matchCount} match{matchCount === 1 ? "" : "es"}
            </span>
          )}
        </span>
        <FiChevronRight
          className={`h-4 w-4 shrink-0 transition-all duration-200
            ${isActive ? "translate-x-0 text-gray-700" : "-translate-x-0.5 text-[#CBD2DB] group-hover:translate-x-0 group-hover:text-[#64748B]"}`}
          aria-hidden="true"
        />
      </button>
    </li>
  );
}

// ----- CategorySidebar -----
function CategorySidebar({ categories, activeId, onSelect, searchTerm, matchCounts }) {
  const hasSearch = Boolean(searchTerm);
  return (
    <div className="w-[210px] shrink-0 border-l border-[#EEF0F3] bg-white lg:w-[270px]">
      <Scrollbar className="h-full md:px-1.5 py-4">
        <ul role="tablist" className="space-y-0.5">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              isActive={category.id === activeId}
              onSelect={onSelect}
              matchCount={matchCounts[category.id] || 0}
              hasSearch={hasSearch}
            />
          ))}
        </ul>
      </Scrollbar>
    </div>
  );
}

// ----- CategoryCard (Subcategory Display) -----
function CategoryCard({ subcategory, gradient, onClick }) {
  const { name, imageName } = subcategory;
  const [imgError, setImgError] = useState(false);

  // Fallback Initials (if image fails to load or doesn't exist)
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const [from, to] = gradient;
  
  const imageUrl = getSubcategoryImageUrl(imageName);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Browse ${name}`}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-[#EEF0F3] bg-white
        p-4 text-center transition-all duration-300 ease-out
        hover:-translate-y-1 hover:border-[#E6E8EE] hover:shadow-[0_16px_32px_-12px_rgba(11,18,32,0.18)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1220]/40"
    >
      <span className="relative flex h-23 w-25 items-center justify-center">
        <span
          className="absolute inset-[-4px] rounded-full opacity-0 blur-[1px] transition-opacity
            duration-300 ease-out group-hover:opacity-100 group-hover:animate-[spin_3s_linear_infinite]"
          style={{ background: `conic-gradient(from 0deg, ${from}, ${to}, transparent 60%)` }}
          aria-hidden="true"
        />
        
        {/* Render true database image, fallback to initials on error */}
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
onError={() => {
    console.log("Failed:", imageName);
    console.log(imageUrl);
    setImgError(true);
}}
            className="relative h-[90px] w-[200px] rounded-full object-cover shadow-[0_6px_16px_-6px_rgba(11,18,32,0.35)]
              transition-transform duration-300 ease-out group-hover:scale-[1.06] bg-white"
          />
        ) : (
          <span
            className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full text-[15px]
              font-bold text-white shadow-[0_6px_16px_-6px_rgba(11,18,32,0.35)]
              transition-transform duration-300 ease-out group-hover:scale-[1.06]"
            style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
          >
            AB
          </span>
        )}
      </span>

      <span className="line-clamp-2 text-[13px] font-medium leading-snug text-[#334155] transition-colors duration-300 group-hover:text-[#0B1220]">
        {name}
      </span>
    </button>
  );
}

// ----- CategoryGrid -----
function CategoryGrid({ subcategories, gradient, onSelectSubcategory }) {
  if (subcategories.length === 0) {
    return (
      <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 text-center">
        <p className="text-[15px] font-medium text-[#334155]">No subcategories found</p>
        <p className="max-w-xs text-[13px] text-[#94A3B8]">
          Try a different search term or pick another category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {subcategories.map((sub) => (
        <CategoryCard
          key={sub.id}
          subcategory={sub}
          gradient={gradient}
          onClick={() => onSelectSubcategory?.(sub)}
        />
      ))}
    </div>
  );
}

// ----- CategoryContent (Left Side View) -----
function CategoryContent({ category, subcategories, searchTerm, onSelectSubcategory }) {
  if (!category) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-[#FAFBFC]">
        <p className="text-[15px] text-[#64748B]">No category selected or found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#FAFBFC]">
      <div className="flex items-center justify-between border-b border-[#EEF0F3] px-6 py-4">
        <div>
          <h2 id={`category-panel-${category.id}`} className="text-[17px] font-bold text-[#0B1220]">
            {category.name}
          </h2>
          <p className="text-[13px] text-[#64748B]">
            {subcategories.length} subcategories
          </p>
        </div>
        {searchTerm && subcategories.length > 0 && (
          <span className="rounded-full bg-[#0B1220]/5 px-3 py-1 text-[12px] font-medium text-[#334155]">
            {subcategories.length} search results
          </span>
        )}
      </div>

      <Scrollbar className="flex-1 p-6">
        <CategoryGrid
          subcategories={subcategories}
          gradient={category.gradient}
          onSelectSubcategory={onSelectSubcategory}
        />
      </Scrollbar>
    </div>
  );
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export default function ProductCategoriesPage({ headerOffset = 72 }) {
  const [categoriesData, setCategoriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  // 1. Fetch Data from Backend API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        // Replace with your exact Spring Boot URL if running on a different port locally (e.g. http://localhost:8080/api/v1/categories)
        const response = await axiosInstance.get('/v1/categories');
        console.log(response);

       console.log(response.data);

        const data = response.data;
                console.log(data);

          
        // if (!response.ok) throw new Error("Failed to fetch categories.");
        
        // Enrich backend data with frontend visual gradients
        const enrichedData = data.map((cat, index) => ({
          ...cat,
          gradient: getGradient(index),
          count: cat.subcategories.length,
        }));

        setCategoriesData(enrichedData);
        if (enrichedData.length > 0) {
          setActiveCategoryId(enrichedData[0].id);
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 2. Search & Filtering Logic (Smart Subcategory searching)
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const searchIndex = useMemo(() => {
    if (!normalizedSearch || categoriesData.length === 0) return null;

    const index = {};
    for (const category of categoriesData) {
      const nameMatches = category.name.toLowerCase().includes(normalizedSearch);
      const matchingSubs = category.subcategories.filter((sub) =>
        sub.name.toLowerCase().includes(normalizedSearch)
      );

      if (nameMatches || matchingSubs.length > 0) {
        index[category.id] = { nameMatches, matchingSubs };
      }
    }
    return index;
  }, [normalizedSearch, categoriesData]);

  // Main Categories on the right side
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
  }, [searchIndex, matchCounts]);

  // Keep the active tab valid when filtering
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

  // Filtered Subcategories on the left side
  const visibleSubcategories = useMemo(() => {
    if (!activeCategory) return [];
    if (!searchIndex) return activeCategory.subcategories;
    const entry = searchIndex[activeCategory.id];
    if (!entry) return [];
    
    return entry.matchingSubs.length > 0 ? entry.matchingSubs : activeCategory.subcategories;
  }, [activeCategory, searchIndex]);

  const handleSelectCategory = useCallback((id) => {
    setActiveCategoryId(id);
  }, []);

  const handleSelectSubcategory = useCallback((sub) => {
    console.log(`Navigating to: /categories/${activeCategory.slug}/${sub.slug}`);
  }, [activeCategory]);

  const containerHeightStyle = {
    height: `calc(100vh - ${headerOffset}px - 128px)`,
    minHeight: "420px",
  };

  // State Views: Loading / Error
  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-3">
        <FiLoader className="h-8 w-8 animate-spin text-[#0B1220]" />
        <p className="text-[15px] font-medium text-[#64748B]">Loading Categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-3 text-red-500">
        <FiAlertCircle className="h-10 w-10" />
        <p className="text-[16px] font-semibold">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#F6F7F9]">
      <HeroSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        resultCount={totalResultCount}
      />

      <div
        style={containerHeightStyle}
        className="flex overflow-hidden rounded-3xl border mx-3 border-[#EEF0F3] bg-white
          shadow-[0_1px_2px_rgba(15,23,42,0.03),0_20px_40px_-24px_rgba(15,23,42,0.12)]"
      >
        {/* LEFT SIDE: Subcategories List */}
        <CategoryContent
          category={activeCategory}
          subcategories={visibleSubcategories}
          searchTerm={searchTerm}
          onSelectSubcategory={handleSelectSubcategory}
        />

        {/* RIGHT SIDE: Main Categories List */}
        <CategorySidebar
          categories={visibleCategories}
          activeId={activeCategoryId}
          onSelect={handleSelectCategory}
          searchTerm={normalizedSearch}
          matchCounts={matchCounts}
        />
      </div>

      <div className="h-4 shrink-0 sm:h-6" aria-hidden="true" />
    </div>
  );
}