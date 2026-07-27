// components/EmptyState.jsx
import React from "react";

export default function EmptyState() {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50/50 py-24 px-6 text-center transition-colors hover:border-slate-300 hover:bg-slate-50">
      
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
        <svg 
          className="h-7 w-7 text-indigo-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="1.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
        </svg>
      </div>
      
      <h3 className="mb-2 text-[20px] font-semibold tracking-tight text-slate-900">
        No active requests
      </h3>
      
      <p className="mb-8 max-w-sm text-[15px] leading-relaxed text-slate-500">
        When buyers in your area search for your products, their business opportunities will appear right here.
      </p>
      
      <button className="rounded-full bg-slate-900 px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5">
        Optimize Profile
      </button>

    </div>
  );
}