import React, { useCallback, useRef, useState, useEffect } from "react";
import BuyerCard from "./BuyerCard";
import EmptyState from "./EmptyState";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { networkApi } from "../services/api"; 
import { useNavigate } from "react-router-dom";
import SectionHeader from "./SectionHeader";

export default function NearbyBuyersSection({ onError }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [buyers, setBuyers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchNearbyBuyers = async () => {
      try {
        setIsLoading(true);
        const data = await networkApi.getDashboardNearbyBuyers(); 
        if (isMounted) setBuyers(data);
      } catch (error) {
        console.error("Failed to fetch buyers", error);
        if (isMounted && onError) onError(); // Trigger Full Page Error
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchNearbyBuyers();
    return () => { isMounted = false; };
  }, [onError]);

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
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-[240px] sm:w-[260px] h-[220px] bg-gray-50 border border-gray-100 rounded-2xl animate-pulse shrink-0" />
           ))}
        </div>
      ) : buyers.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No nearby buyers found" />
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