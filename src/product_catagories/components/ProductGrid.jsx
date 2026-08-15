import React from 'react';
import { FiSearch } from "react-icons/fi";
import { EmptyState } from './EmptyState';
import { ProductCard } from './ProductCard';

export function ProductGrid({ subcategories, gradient, onSelectSubcategory, searchTerm, onClearSearch }) {
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