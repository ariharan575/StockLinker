import React from 'react';

export const PremiumStorefrontSkeleton = () => (
  <div className="max-w-[1440px] mx-auto flex my-2 flex-col gap-6 md:gap-8 p-4 animate-pulse w-full">
    <div className="bg-white p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/60 rounded-2xl flex flex-col gap-6">
      <div className="flex flex-row gap-5 md:gap-8 items-start w-full">
        <div className="w-[72px] h-[72px] sm:w-24 sm:h-24 md:w-[120px] md:h-[120px] bg-slate-200/80 rounded-[20px] md:rounded-[28px] shrink-0" />
        <div className="flex flex-col gap-3 w-full pt-2">
          <div className="h-8 md:h-10 bg-slate-200/80 rounded-lg w-3/4 max-w-md" />
          <div className="h-4 bg-slate-100 rounded-md w-1/2 max-w-sm" />
          <div className="flex gap-4 mt-2">
            <div className="h-4 bg-slate-100 rounded-md w-24" />
            <div className="h-4 bg-slate-100 rounded-md w-24" />
            <div className="h-4 bg-slate-100 rounded-md w-24" />
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <div className="h-12 bg-slate-100 rounded-xl w-32" />
        <div className="h-12 bg-slate-100 rounded-xl w-32" />
        <div className="h-12 bg-slate-200/80 rounded-xl w-40" />
      </div>
      <div className="flex gap-8 border-b border-slate-100 mt-2">
        <div className="h-6 w-32 bg-slate-200/80 rounded-t-md" />
        <div className="h-6 w-32 bg-slate-100 rounded-t-md" />
        <div className="h-6 w-32 bg-slate-100 rounded-t-md" />
      </div>
    </div>
    <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm p-6 flex flex-col gap-6 min-h-[400px]">
      <div className="flex flex-col lg:flex-row gap-4 justify-between border-b border-slate-100 pb-6">
        <div className="h-12 bg-slate-100 rounded-xl w-full lg:max-w-md" />
        <div className="flex gap-3 w-full lg:w-auto">
          <div className="h-12 bg-slate-100 rounded-xl w-32" />
          <div className="h-12 bg-slate-100 rounded-xl w-32" />
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-slate-50 rounded-xl w-full" />
        ))}
      </div>
    </div>
  </div>
);