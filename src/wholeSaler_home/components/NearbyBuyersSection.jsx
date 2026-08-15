import React, { useCallback, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query"; 
import BuyerCard from "./BuyerCard";
import EmptyState from "./EmptyState";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { networkApi } from "../services/api"; 
import { useNavigate } from "react-router-dom";
import SectionHeader from "./SectionHeader";

const BuyerSkeleton = () => (
  <div className="w-[240px] sm:w-[260px] h-[220px] bg-white border border-slate-200 shadow-sm rounded-2xl animate-pulse shrink-0 p-5 flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-slate-200/80 rounded-lg" />
      <div className="w-16 h-5 bg-slate-100 rounded" />
    </div>
    <div className="w-3/4 h-5 bg-slate-200/80 rounded mb-2" />
    <div className="w-1/2 h-4 bg-slate-100 rounded mb-auto" />
    <div className="w-full h-10 bg-slate-200/80 rounded-lg mt-4" />
  </div>
);

export default function NearbyBuyersSection({ onError }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const { 
    data: buyers = [], 
    isLoading, 
    isError,
    error // ✅ Extracted the error object
  } = useQuery({
    queryKey: ['dashboardNearbyBuyers'],
    queryFn: async () => {
      return await networkApi.getDashboardNearbyBuyers();
    },
    staleTime: 5 * 60 * 1000, 
  });

  // ✅ Passed the exact error up to the global layout
  useEffect(() => {
    if (isError && onError) onError(error);
  }, [isError, error, onError]);

  const scrollBy = useCallback((dir) => {
    scrollRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  }, []);

  return (
    <div className="w-full mb-[35px] relative font-inter">
      <SectionHeader 
        title="Nearby Buyers" 
        subtitle="Shopkeepers and retailers in your district"
        action={{ label: "Directory", onClick: () => navigate('/nearby') }}
      />

      {isLoading ? (
        <div className="mt-6 flex gap-4 sm:gap-6 overflow-hidden pb-4">
           {[...Array(5)].map((_, i) => <BuyerSkeleton key={i} />)}
        </div>
      ) : buyers.length === 0 ? (
        <div className="mt-6">
          <EmptyState 
            title="No nearby buyers found" 
            description="There are currently no shopkeepers registered in your district delivery zone."
            icon={<MapPin className="h-10 w-10 text-slate-300 relative z-10" strokeWidth={1.5} />}
            actionLabel="Explore Directory"
            onAction={() => navigate('/nearby')}
          />
        </div>
      ) : (
        <div className="mt-6 relative group/scroll">
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {buyers.map((buyer, i) => (
              <BuyerCard key={buyer.id} buyer={buyer} index={i} />
            ))}
          </div>

          <button
            onClick={() => scrollBy(-1)}
            className="absolute -left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 shadow-md hover:border-rose-300 md:flex z-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => scrollBy(1)}
            className="absolute -right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 shadow-md hover:border-rose-300 md:flex z-10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}