import React from "react";

export default function InquiryCard({ enquiry }) {
  // Safe destructuring with fallbacks for showcase
  const {
    buyer = "Acme Corp",
    avatar = "AC",
    isVerified = true,
    status = "New Request",
    title = "Rice (Ponni)",
    chips = [
      { icon: "📦", label: "50 Bags" },
      { icon: "₹", label: "1,250 / Bag" },
    ],
    message = "We need delivery before Friday. Regular supplier preferred.",
    location = "Anna Nagar",
    distance = "2.1 km",
    time = "5 min ago",
  } = enquiry || {};

  return (
    <article className="group relative flex w-[420px] shrink-0 snap-start flex-col rounded-[28px] border border-[rgba(15,23,42,0.06)] bg-slate-100/60 p-7 transition-all duration-400 ease-out hover:-translate-y-[6px] hover:border-indigo-100/50 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.08)]">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-[14px] font-semibold text-slate-700 ring-1 ring-slate-900/5">
            {avatar}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-semibold text-slate-900">
                {buyer}
              </span>
              {isVerified && (
                <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-8 8z" />
                </svg>
              )}
            </div>
            <span className="text-[12px] text-slate-500 font-medium">
              Verified Buyer
            </span>
          </div>
        </div>
        <div className="flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[12px] font-medium text-amber-700 ring-1 ring-amber-600/10 transition-colors group-hover:bg-amber-100/50">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500"></span>
          {status}
        </div>
      </div>

      {/* Hero Title */}
      <h3 className="mt-6 mb-5 text-[22px] font-semibold leading-tight tracking-tight text-slate-900">
        {title}
      </h3>

      {/* Chips */}
      <div className="flex flex-wrap gap-2.5">
        {chips.map((chip, i) => (
          <div 
            key={i} 
            className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3.5 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm ring-1 ring-slate-900/5 transition-colors group-hover:bg-white group-hover:ring-slate-900/10"
          >
            <span className="text-[14px]">{chip.icon}</span>
            {chip.label}
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="mt-6">
        <p className="text-[14px] leading-relaxed text-slate-600">
          "{message}"
        </p>
      </div>

      {/* Flexible Space */}
      <div className="flex-1"></div>

      {/* FOOTER REDESIGN */}
      <div className="mt-8 flex flex-col">
        
        {/* Layer 1: Business Metadata */}
        <div className="flex gap-1.5 justify-between mb-5">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
            <span className="text-[12px] font-medium text-slate-400">{distance}</span>
          </div>
          <div className="flex items-center justify-between gap-1.5 text-[13px] font-medium text-slate-400">   
            <span>•</span>
            <span>{time}</span>
          </div>
        </div>

        {/* Layer 2: Actions */}
        <div className="grid grid-cols-2 gap-3 border-t border-[rgba(15,23,42,0.06)] pt-5 transition-colors group-hover:border-slate-200/60">
          <button className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-[13px] font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900">
            View Details
          </button>
          <button className="flex items-center justify-center rounded-xl bg-indigo-600 py-2.5 px-4 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/20">
            Reply Quote
          </button>
        </div>

      </div>
    </article>
  );
}