import React from "react";
import { Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BuyerCard({ buyer = {}, index = 0 }) {
  const navigate = useNavigate();
  
  const buyerName = buyer?.name || "Retail Partner";
  const initials = buyerName.substring(0, 2).toUpperCase();
  const distance = buyer?.distance || "Local Area";
  const category = buyer?.category || "General Store";
  const rating = buyer?.rating || 0;

  return (
    <div
      style={{ animationDelay: `${index * 50}ms` }}
      className="group flex w-[240px] sm:w-[260px] shrink-0 animate-[fadeUp_0.5s_ease-out_both] snap-start flex-col rounded-2xl border border-gray-400/40 cursor-pointer bg-white p-4 sm:p-5 text-left transition-all duration-200 ease-out hover:border-rose-300 font-inter"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-sora flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gray-100 text-[12px] sm:text-[14px] font-bold text-gray-900 border border-gray-200">
          {initials}
        </div>
        <p className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-500 border border-gray-100">
          <MapPin className="h-3 w-3 text-gray-400" /> {distance}
        </p>
      </div>
      
      <h3 className="font-sora mt-4 text-[15px] sm:text-[16px] font-semibold text-gray-900 truncate" title={buyerName}>
        {buyerName}
      </h3>
      
      <div className="mt-2 flex flex-col items-start gap-2">
        <span className="text-[11px] sm:text-[12px] font-medium text-gray-500">
          {category}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-[11px] font-semibold text-gray-700 border border-gray-100">
          <Star className="h-3 w-3 text-gray-900 fill-current" /> {rating > 0 ? rating : "0.0"}
        </span>
      </div>

      <div className="mt-5 flex-grow" />

      <button 
        onClick={() => navigate(`/storefront/${buyer?.id || ''}`)}
        className="h-[36px] sm:h-[40px] w-full rounded-lg  bg-black text-[12px] sm:text-[13px] font-semibold text-white transition-all  active:scale-[0.98]"
      >
        View Profile
      </button>
    </div>
  );
}