import React from 'react';

export const SellerCardSkeleton = () => (
  <div className="bg-white border border-slate-100 rounded-[20px] p-3 md:p-4 shadow-sm mb-4 flex flex-col gap-4 animate-pulse">
    <div className="flex items-start gap-4 md:gap-5 w-full">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-200 flex-shrink-0" />
      <div className="flex-1 min-w-0 py-1">
        <div className="flex justify-between items-start gap-2 w-full mb-2">
          <div className="h-5 bg-slate-200 rounded-md w-1/3" />
          <div className="h-4 bg-slate-100 rounded-md w-24 hidden sm:block" />
        </div>
        <div className="h-4 bg-slate-100 rounded-md w-1/4 mb-3" />
        <div className="flex gap-2">
           <div className="h-4 bg-slate-100 rounded-md w-20" />
           <div className="h-4 bg-slate-100 rounded-md w-16" />
           <div className="h-4 bg-slate-100 rounded-md w-24 hidden md:block" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-4 py-4 border-y border-slate-50 w-full">
       {[1,2,3,4].map(i => (
         <div key={i} className="flex flex-col gap-2">
           <div className="h-3 bg-slate-100 rounded w-16" />
           <div className="h-4 bg-slate-200 rounded w-20" />
         </div>
       ))}
    </div>
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
       <div className="flex gap-2.5">
         {[1,2,3].map(i => <div key={i} className="w-12 h-12 rounded-xl bg-slate-100" />)}
       </div>
       <div className="flex gap-3 w-full lg:w-auto">
          <div className="h-10 bg-slate-100 rounded-xl w-full lg:w-28" />
          <div className="h-10 bg-slate-200 rounded-xl w-full lg:w-32" />
       </div>
    </div>
  </div>
);