import React from 'react';
import * as FiIcons from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";

export function DesktopCategoryItem({ category, isActive, onSelect, matchCount, hasSearch }) {
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