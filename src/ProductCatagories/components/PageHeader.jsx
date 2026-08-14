import React from 'react';
import { SearchBar } from './SearchBar';

export function PageHeader({ searchTerm, onSearchChange, resultCount }) {
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