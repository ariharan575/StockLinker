// components/BuyerCard.jsx
import React from "react";
import { StarIcon, MapPinIcon } from "./Icons";
import { useNavigate } from "react-router-dom";

const LOGO_COLORS = [
  "from-slate-100 to-slate-200 text-slate-800",
  "from-gray-100 to-gray-200 text-gray-800",
  "from-zinc-100 to-zinc-200 text-zinc-800",
  "from-stone-100 to-stone-200 text-stone-800",
];

export default function BuyerCard({ buyer = {}, index = 0 }) {
  const navigate = useNavigate();
  const color = LOGO_COLORS[index % LOGO_COLORS.length];
  
  // Safe extraction from NetworkMemberResponse DTO
  const buyerName = buyer?.name || "Retail Partner";
  const initials = buyerName.substring(0, 2).toUpperCase();
  const distance = buyer?.distance || "Local Area";
  const category = buyer?.category || "General Store";
  const rating = buyer?.rating || 0;

  return (
    <div
      style={{ animationDelay: `${index * 70}ms` }}
      className="group relative flex w-[260px] shrink-0 animate-[fadeUp_0.5s_ease-out_both] snap-start flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-5 text-left shadow-sm transition-all duration-[350ms] ease-out hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl"
    >
      {/* Background Layers - Pure Grayscale */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-slate-100/60 blur-2xl transition-opacity duration-[350ms] group-hover:opacity-100" />
      
      <div className="relative z-10 flex h-full flex-col">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-2">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br border border-white/80 text-[14px] font-black shadow-sm transition-all duration-[350ms] ease-out group-hover:scale-110 group-hover:rotate-2 ${color}`}
          >
            {initials}
          </div>
          
          <p className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 mt-1 transition-colors duration-300 group-hover:border-slate-300 group-hover:bg-white">
            <MapPinIcon className="h-3 w-3 text-slate-400" /> {distance}
          </p>
        </div>
        
        {/* Company Name */}
        <h3 className="mt-4 text-[16px] font-bold leading-tight tracking-tight text-slate-900 truncate" title={buyerName}>
          {buyerName}
        </h3>
        
        {/* Badges Layout */}
        <div className="mt-3 flex flex-col items-start gap-2">
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold tracking-wide text-slate-700">
            {category}
          </span>
          
          {/* FIX: Rating always shows now, formatting 0 as "0.0" */}
          <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 shadow-sm">
            <StarIcon className="h-3.5 w-3.5 text-slate-800" /> {rating > 0 ? rating : "0.0"} Rating
          </span>
        </div>

        <div className="mt-5 flex-grow" />

        {/* Pure Black Action Button */}
        <button 
          onClick={() => navigate(`/storefront/${buyer?.id || ''}`)}
          className="h-[42px] w-full rounded-xl border border-transparent bg-gray-900 text-[13px] font-bold text-white shadow-sm transition-all duration-[350ms] hover:-translate-y-0.5 hover:bg-black hover:shadow-md active:scale-[0.98]"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}