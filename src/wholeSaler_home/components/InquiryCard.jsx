import React from "react";
import { CheckCircle2, MapPin, Clock } from "lucide-react";

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
    <article className="group flex w-[280px] sm:w-[320px] md:w-[380px] shrink-0 snap-start flex-col rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 transition-all duration-200 hover:border-rose-300 font-inter">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="font-sora flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[13px] font-bold text-gray-900">
            {avatar}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-sora text-[14px] sm:text-[15px] font-semibold text-gray-900">
                {buyer}
              </span>
              {isVerified && <CheckCircle2 className="h-3.5 w-3.5 text-gray-400" />}
            </div>
            <span className="text-[11px] sm:text-[12px] text-gray-500 font-medium">
              Verified Buyer
            </span>
          </div>
        </div>
      </div>

      <div className="py-4 flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-sora text-[16px] sm:text-[18px] font-semibold text-gray-900 truncate">
            {title}
          </h3>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            {status}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {chips.map((chip, i) => (
            <div key={i} className="flex items-center gap-1 text-[12px] font-medium text-gray-600">
              <span className="text-gray-400">{chip.icon}</span>
              {chip.label}
            </div>
          ))}
        </div>

        <div className="text-[13px] sm:text-[14px] leading-relaxed text-gray-600">
          {isLongMessage ? (
            <span>
              "{message.substring(0, 70)}..."
              <button onClick={onViewDetails} className="ml-1 font-semibold text-gray-900 hover:text-rose-600">
                Read
              </button>
            </span>
          ) : (
            <span>"{message}"</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-[11px] sm:text-[12px] font-medium text-gray-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {location} {distance && `(${distance})`}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{time}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={onViewDetails} className="flex items-center justify-center rounded-lg border border-gray-200 py-2 text-[12px] sm:text-[13px] font-semibold text-gray-900 hover:border-rose-300 hover:text-rose-600 transition-colors">
            Details
          </button>
          <button onClick={onAccept} className="flex items-center justify-center rounded-lg bg-black py-2 text-[12px] sm:text-[13px] font-semibold text-white hover:bg-gray-800 active:scale-[0.98] transition-all">
            Accept
          </button>
        </div>
      </div>
    </article>
  );
}