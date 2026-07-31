import React from "react";
import ActionButton from "./ActionButton";
import { Star, MapPin } from "lucide-react";

const LOGO_COLORS = [
  "from-gray-100 to-gray-200 text-gray-800",
  "from-rose-50 to-rose-100 text-rose-800",
  "from-stone-50 to-stone-200 text-stone-800",
  "from-zinc-100 to-zinc-200 text-zinc-800",
];

function SupplierCard({ supplier, index = 0 }) {
  const color = LOGO_COLORS[index % LOGO_COLORS.length];

  return (
    <div
      style={{ animationDelay: `${index * 70}ms` }}
      className="group relative flex w-[240px] sm:w-[260px] shrink-0 animate-[fadeUp_0.5s_ease-out_both] snap-start flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 text-left shadow-sm transition-all duration-[350ms] ease-out hover:-translate-y-2 hover:border-gray-300 hover:shadow-2xl font-inter"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-rose-50/60 blur-2xl transition-opacity duration-[350ms] group-hover:opacity-100" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-gray-100/40 blur-xl opacity-50" />
      
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          <div
            className={`font-sora flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br border border-white/80 text-[12px] sm:text-[14px] font-bold shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-[350ms] ease-out group-hover:scale-110 group-hover:rotate-2 ${color}`}
          >
            {supplier.initials}
          </div>
          
          <p className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-gray-50/90 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-medium text-gray-500 mt-1 transition-colors duration-300 group-hover:border-gray-200 group-hover:bg-gray-100">
            <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400" /> {supplier.distance}
          </p>
        </div>
        
        <h3 className="font-sora mt-4 text-[14px] sm:text-[16px] font-bold leading-tight tracking-tight text-gray-900">
          {supplier.name}
        </h3>
        
        <div className="mt-3 sm:mt-4 flex flex-col items-start gap-2">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold tracking-wide text-gray-700">
            {supplier.category}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white shadow-sm px-2 py-1 text-[10px] sm:text-[11px] font-bold text-gray-800">
            <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-800 fill-current" /> {supplier.rating}
          </span>
        </div>

        <div className="mt-4 sm:mt-5 flex-grow" />

        <ActionButton 
          variant="secondary" 
          className="h-[38px] sm:h-[42px] w-full rounded-xl border border-gray-200 bg-gray-50 text-[12px] sm:text-[13px] font-bold text-gray-700 shadow-sm transition-all duration-[350ms] hover:-translate-y-0.5 hover:border-black hover:bg-black hover:text-white hover:shadow-md"
        >
          View Profile
        </ActionButton>
      </div>
    </div>
  );
}

export default React.memo(SupplierCard);