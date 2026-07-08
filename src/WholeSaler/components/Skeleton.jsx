// components/Skeleton.jsx
import React from "react";

// Base shimmer block. Uses a moving gradient instead of a plain pulse
// for a more "premium SaaS" loading feel.
export function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-slate-100 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />
      <SkeletonBlock className="h-4 w-1/4" />
      <SkeletonBlock className="h-4 w-1/6" />
      <SkeletonBlock className="h-4 w-1/6" />
      <SkeletonBlock className="ml-auto h-6 w-16 rounded-full" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="w-72 shrink-0 rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-3 w-2/3" />
          <SkeletonBlock className="h-3 w-1/3" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-5/6" />
        <SkeletonBlock className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export default SkeletonBlock;

/*
  Add this keyframe once, globally (e.g. tailwind.config.js -> theme.extend.keyframes)
  if it isn't already present in the host app:

  keyframes: {
    shimmer: {
      '100%': { transform: 'translateX(100%)' },
    },
  },
*/
