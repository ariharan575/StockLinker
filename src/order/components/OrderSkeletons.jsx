import React from 'react';

export const OrderCardSkeleton = () => (
  <div className="rounded-[20px] bg-white border border-slate-100 p-5 sm:p-6 shadow-sm animate-pulse">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-50 pb-4 sm:pb-5 sm:mb-5">
      <div className="w-full md:w-1/2">
        <div className="h-6 bg-slate-200 rounded-lg w-1/2 mb-3" />
        <div className="h-4 bg-slate-100 rounded w-1/3 mb-2" />
        <div className="h-4 bg-slate-100 rounded w-1/4" />
      </div>
      <div className="w-full md:w-1/4 flex flex-col md:items-end">
        <div className="h-3 bg-slate-100 rounded w-1/2 mb-2" />
        <div className="h-8 bg-slate-200 rounded-lg w-3/4" />
      </div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
      <div className="h-5 bg-slate-100 rounded w-1/3" />
      <div className="flex gap-3 w-full md:w-auto">
        <div className="h-10 bg-slate-200 rounded-xl w-full md:w-28" />
        <div className="h-10 bg-slate-200 rounded-xl w-full md:w-32" />
      </div>
    </div>
  </div>
);

export const TrackerSkeleton = () => (
  <div className="relative pl-4 space-y-6 flex-1 overflow-y-auto no-scrollbar pb-6 animate-pulse mt-4">
    <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-slate-100" />
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="relative z-10 flex items-start gap-4">
        <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white shrink-0 mt-0.5" />
        <div className="flex flex-col pt-0.5 w-full pr-4">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);