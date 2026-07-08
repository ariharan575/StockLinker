// components/SectionHeader.jsx
import React from "react";

export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between px-2">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[15px] font-medium text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      <button className="group flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900">
        View All
        <svg 
          className="h-4 w-4 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-900" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  );
}