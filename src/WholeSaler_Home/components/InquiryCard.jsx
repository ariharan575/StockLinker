// components/InquiryCard.jsx
import React from "react";

export default function InquiryCard({ enquiry, onViewDetails, onAccept }) {
  const {
    buyer = "Unknown",
    avatar = "--",
    isVerified = false,
    status = "Order Request",
    title = "Product",
    chips = [],
    message = "",
    location = "Unknown",
    distance = "",
    time = "Just now",
  } = enquiry || {};

  const isLongMessage = message.length > 70;

  return (
    <article className="group relative flex w-[420px] shrink-0 snap-start flex-col rounded-[28px] border border-slate-200/60 bg-slate-50 p-7 transition-all duration-400 ease-out hover:-translate-y-[4px] hover:border-slate-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[14px] font-bold text-slate-800 ring-1 ring-slate-200 shadow-sm">
            {avatar}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-bold text-slate-900">
                {buyer}
              </span>
              {isVerified && (
                <svg className="h-4 w-4 text-slate-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-8 8z" />
                </svg>
              )}
            </div>
            <span className="text-[12px] text-slate-500 font-medium">
              Verified Buyer
            </span>
          </div>
        </div>
        <div className="flex items-center rounded-full bg-slate-200/50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 ring-1 ring-slate-200">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-slate-500 animate-pulse"></span>
          {status}
        </div>
      </div>

      {/* Hero Title */}
      <h3 className="mt-6 mb-4 text-[20px] font-bold leading-tight tracking-tight text-slate-900 truncate">
        {title}
      </h3>

      {/* Chips */}
      <div className="flex flex-wrap gap-2.5">
        {chips.map((chip, i) => (
          <div key={i} className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-[13px] font-bold text-slate-700 shadow-sm border border-slate-200">
            <span className="text-[14px] text-slate-400">{chip.icon}</span>
            {chip.label}
          </div>
        ))}
      </div>

      {/* Description with "View more" truncation */}
      <div className="mt-5 text-[14px] leading-relaxed text-slate-600 italic">
        {isLongMessage ? (
          <span>
            "{message.substring(0, 70)}..."
            <button onClick={onViewDetails} className="ml-1 font-bold text-slate-900 hover:underline">
              View more
            </button>
          </span>
        ) : (
          <span>"{message}"</span>
        )}
      </div>

      <div className="flex-1"></div>

      <div className="mt-8 flex flex-col">
        {/* Layer 1: Metadata */}
        <div className="flex gap-1.5 justify-between mb-5">
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-600">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
            {distance && <span className="text-[12px] font-semibold text-slate-400">({distance})</span>}
          </div>
          <div className="flex items-center justify-between gap-1.5 text-[12px] font-bold text-slate-400">   
            <span>•</span>
            <span>{time}</span>
          </div>
        </div>

        {/* Layer 2: Actions */}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-5">
          <button onClick={onViewDetails} className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900">
            View Details
          </button>
          <button onClick={onAccept} className="flex items-center justify-center rounded-xl bg-gray-900 py-2.5 px-4 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-black hover:shadow-md active:scale-[0.98]">
            Accept Order
          </button>
        </div>
      </div>
    </article>
  );
}