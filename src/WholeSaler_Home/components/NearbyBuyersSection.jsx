import React, { useCallback, useRef, useState, useEffect } from "react";
import BuyerCard from "./BuyerCard";
import EmptyState from "./EmptyState";
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from "./Icons";
import { networkApi } from "../services/api"; 
import { useNavigate } from "react-router-dom";

export default function NearbyBuyersSection() {
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
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchNearbyBuyers();
    return () => { isMounted = false; };
  }, []);

  const scrollBy = useCallback((dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  }, []);

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-200/60 bg-white p-6 pt-8 shadow-sm transition-all duration-300 hover:shadow-md sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
            <MapPinIcon className="h-5 w-5 text-slate-800" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Nearby Buyers
          </h2>
        </div>
        <button 
          onClick={() => navigate('/nearby')}
          className="hidden h-9 rounded-full border border-slate-200 bg-white px-5 text-[12px] font-bold uppercase tracking-wider text-slate-700 transition-all duration-[350ms] ease-out hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm sm:flex items-center justify-center"
        >
          View Directory
        </button>
      </div>

      {isLoading ? (
        <div className="flex gap-5 overflow-hidden py-2">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-[260px] h-[280px] bg-slate-100 rounded-3xl animate-pulse shrink-0" />
           ))}
        </div>
      ) : buyers.length === 0 ? (
        <EmptyState
          icon={<MapPinIcon className="h-6 w-6 text-slate-400" />}
          title="No nearby buyers found"
          description="Shopkeepers within your district will appear here. Ensure your location is updated in settings."
        />
      ) : (
        <div className="relative group/scroll">
          <div
            ref={scrollRef}
            className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-6 pt-2 sm:-mx-8 sm:px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* CSS to hide scrollbar */}
            <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />
            
            {buyers.map((buyer, i) => (
              <BuyerCard key={buyer.id} buyer={buyer} index={i} />
            ))}
          </div>

          {/* Grayscale Navigation Arrows */}
          <button
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            className="absolute -left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-xl transition-all duration-[350ms] ease-out hover:-translate-y-1/2 hover:scale-110 hover:bg-slate-50 active:scale-95 sm:flex z-20"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          <button
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            className="absolute -right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-xl transition-all duration-[350ms] ease-out hover:-translate-y-1/2 hover:scale-110 hover:bg-slate-50 active:scale-95 sm:flex z-20"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}