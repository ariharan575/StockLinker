import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import { FiSearch, FiMenu } from "react-icons/fi";

// External API and Shared Components
import { categoryApi } from "../../shopkeeper_home/Services/api";
import { PremiumToast } from "../../components/PremiumToast";
import { DataFetchError } from "../../components/DataFetchError";

// Modular Components & Utils
import { getGradient } from "../utils/constants";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { DesktopCategoryItem } from "../components/DesktopCategoryItem";
import { MainContentArea } from "../components/MainContentArea";
import { MobileCategorySheet } from "../components/MobileCategorySheet";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Scrollbar } from "../components/Scrollbar";

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

  // PERFECTLY HANDLES SPRING BOOT CUSTOM ERRORS
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