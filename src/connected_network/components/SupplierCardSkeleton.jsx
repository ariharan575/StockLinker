import React from 'react';

const SupplierCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse flex flex-col h-full">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
        <div>
          <div className="h-4 bg-slate-200 rounded-md w-32 mb-2" />
          <div className="h-3 bg-slate-100 rounded-md w-20" />
        </div>
      </div>
    </div>
    <div className="h-4 bg-slate-100 rounded-md w-3/4 mb-4" />
    <div className="mt-auto">
      <div className="flex gap-2 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-10 h-10 rounded-md bg-slate-100 shrink-0" />
        ))}
      </div>
      <div className="flex gap-2">
        <div className="h-10 bg-slate-100 rounded-lg w-full" />
        <div className="h-10 bg-slate-200 rounded-lg w-full" />
      </div>
    </div>
  </div>
);

export default SupplierCardSkeleton;