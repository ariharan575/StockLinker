import React from 'react';

const PremiumSkeletonLoader = ({ rows = 5 }) => (
  <div className="flex flex-col w-full animate-pulse mt-4">
    <div className="hidden lg:block w-full">
       {Array.from({ length: rows }).map((_, i) => (
         <div key={i} className="flex items-center gap-4 px-8 py-5 border-b border-slate-100 bg-white">
           <div className="w-[28%] flex flex-col gap-2 pr-2">
             <div className="h-4 bg-slate-200/80 w-3/4 rounded" />
             <div className="h-3 bg-slate-100 w-1/2 rounded" />
           </div>
           <div className="w-[12%]"><div className="h-4 bg-slate-200/80 w-full rounded" /></div>
           <div className="w-[13%]"><div className="h-6 bg-slate-100 w-16 rounded-md" /></div>
           <div className="w-[13%]"><div className="h-5 bg-slate-200/80 w-20 rounded" /></div>
           <div className="w-[15%]"><div className="h-8 bg-slate-100 w-full rounded-md" /></div>
           <div className="w-[9%]"><div className="h-6 bg-slate-200/80 w-10 mx-auto rounded-md" /></div>
           <div className="w-[10%]"><div className="h-8 bg-slate-200/80 w-full rounded-md" /></div>
         </div>
       ))}
    </div>
    <div className="lg:hidden flex flex-col gap-4">
       {Array.from({ length: rows }).map((_, i) => (
         <div key={i} className="bg-white border border-slate-200 rounded-[16px] p-5 flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2 w-1/2">
                <div className="h-3 bg-slate-100 w-1/2 rounded" />
                <div className="h-4 bg-slate-200/80 w-full rounded" />
              </div>
              <div className="flex flex-col gap-2 w-1/4 items-end">
                <div className="h-5 bg-slate-200/80 w-full rounded" />
                <div className="h-3 bg-slate-100 w-3/4 rounded" />
              </div>
            </div>
            <div className="h-8 bg-slate-100 w-full rounded-md" />
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <div className="h-6 bg-slate-200/80 w-1/3 rounded-md" />
              <div className="h-6 bg-slate-200/80 w-1/4 rounded-md" />
            </div>
         </div>
       ))}
    </div>
  </div>
);

export default PremiumSkeletonLoader;