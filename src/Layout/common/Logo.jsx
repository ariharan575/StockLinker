import React from "react";
import { CTA_GRAD, C } from "./constants";

export default function Logo() {
  return (
    <div className="flex items-center gap-1 cursor-pointer select-none group flex-shrink-0">
      {/* Logo Icon */}
      <div className="relative flex items-center justify-center w-6 h-6">
        <div className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200 bg-gradient-to-tr from-pink-500 to-sky-400 blur-md group-hover:opacity-40" />

        <div className="relative flex items-center justify-center w-full h-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-sm">
          <svg
            className="w-[15px] h-[15px] text-white transition-transform duration-200 group-hover:scale-105"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 7V4a2 2 0 012-2h3m0 0l-3 3m3-3L6 5M20 7v10a2 2 0 01-2 2h-3m0 0l3-3m-3 3l2-2M4 17v3a2 2 0 002 2h3m-7-5l3 3m-3-3l2-2"
            />
            <circle
              cx="12"
              cy="12"
              r="2"
              fill="currentColor"
              className="text-pink-500"
            />
          </svg>
        </div>
      </div>

      {/* Logo Text */}
      <span
        className="text-lg font-bold tracking-tight leading-none"
        style={{
          color: C.head,
          fontFamily: "'Sora', 'Inter', sans-serif",
        }}
      >
        STOCK<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-sky-500">LINKER</span>
      </span>
    </div>
  );
}