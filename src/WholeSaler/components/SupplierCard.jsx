// components/SupplierCard.jsx
import React from "react";
import ActionButton from "./ActionButton";
import { StarIcon, MapPinIcon } from "./Icons";

const LOGO_COLORS = [
  "from-slate-100 to-slate-200 text-slate-700",
  "from-indigo-50 to-indigo-100 text-indigo-700",
  "from-gray-50 to-gray-200 text-gray-700",
  "from-slate-50 to-slate-100 text-slate-800",
  "from-indigo-50/50 to-slate-100 text-indigo-800",
];

function SupplierCard({ supplier, index = 0 }) {
  const color = LOGO_COLORS[index % LOGO_COLORS.length];

  return (
    <div
      style={{ animationDelay: `${index * 70}ms` }}
      className="group relative flex w-[260px] shrink-0 animate-[fadeUp_0.5s_ease-out_both] snap-start flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-5 text-left shadow-sm transition-all duration-[350ms] ease-out hover:-translate-y-2 hover:border-indigo-100 hover:shadow-2xl"
    >
      {/* Background Layers */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-50/60 blur-2xl transition-opacity duration-[350ms] group-hover:opacity-100" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-slate-100/40 blur-xl opacity-50" />
      
      {/* Subtle Hover Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[350ms] group-hover:opacity-100" style={{
        background: "linear-gradient(135deg, rgba(79,70,229,0.04), transparent)",
      }} />

      <div className="relative z-10 flex h-full flex-col">
        {/* Top Header Row: Profile Logo Left, Location Distance Right */}
        <div className="flex items-start justify-between gap-2">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br border border-white/80 text-sm font-bold shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-[350ms] ease-out group-hover:scale-110 group-hover:rotate-2 ${color}`}
          >
            {supplier.initials}
          </div>
          
          <p className="inline-flex items-center gap-1 rounded-full border border-slate-100 bg-slate-50/90 px-2.5 py-0.5 text-[11px] font-medium text-slate-500 mt-1 transition-colors duration-300 group-hover:border-slate-200 group-hover:bg-slate-100">
            <MapPinIcon className="h-3 w-3 text-slate-400" /> {supplier.distance}
          </p>
        </div>
        
        {/* Company Name */}
        <h3 className="mt-4 text-[16px] font-bold leading-tight tracking-tight text-slate-900">
          {supplier.name}
        </h3>
        
        {/* Badges Layout */}
        <div className="mt-4 flex flex-col items-start gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-100/80 px-2.5 py-1 text-[11px] font-medium tracking-wide text-slate-600">
            {supplier.category}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-100/50 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
            <StarIcon className="h-3.5 w-3.5 text-amber-500" /> {supplier.rating}
          </span>
        </div>

        {/* Spacer */}
        <div className="mt-5 flex-grow" />

        {/* Button */}
        <ActionButton 
          variant="secondary" 
          className="h-[42px] w-full rounded-xl border border-slate-200/60 bg-slate-50 font-medium text-slate-700 shadow-sm transition-all duration-[350ms] hover:-translate-y-0.5 hover:border-slate-800 hover:bg-slate-900 hover:text-white hover:shadow-md"
        >
          View Profile
        </ActionButton>
      </div>
    </div>
  );
}

export default React.memo(SupplierCard);