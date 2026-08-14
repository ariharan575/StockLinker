import React from 'react';
import { FiSearch, FiX } from "react-icons/fi";

export function SearchBar({ value, onChange, resultCount, placeholder }) {
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