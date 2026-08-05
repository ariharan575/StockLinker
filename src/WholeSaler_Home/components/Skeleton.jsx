import React from "react";

export function SkeletonBlock({ className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-md bg-gray-100 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100">
      <SkeletonBlock className="h-10 w-10 shrink-0 rounded-full" />
      <SkeletonBlock className="h-4 w-1/3" />
      <SkeletonBlock className="h-4 w-1/4 hidden md:block" />
      <SkeletonBlock className="ml-auto h-5 w-16" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="w-[280px] shrink-0 border border-gray-100 rounded-xl p-5">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-3 w-2/3" />
          <SkeletonBlock className="h-3 w-1/3" />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-5/6" />
      </div>
    </div>
  );
}

export default SkeletonBlock;