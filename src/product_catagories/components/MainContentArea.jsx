import React from 'react';
import { SearchBar } from './SearchBar';
import { Scrollbar } from './Scrollbar';
import { ProductGrid } from './ProductGrid';

export function MainContentArea({ category, subcategories, searchTerm, setSearchTerm, resultCount, onSelectSubcategory }) {
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