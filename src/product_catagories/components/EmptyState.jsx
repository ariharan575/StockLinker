import React from 'react';
import { FiSearch } from "react-icons/fi";

export function EmptyState({ title, description, icon: Icon, actionText, onAction }) {
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