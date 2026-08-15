import React, { useCallback, useRef } from "react";
import SectionHeader from "./SectionHeader";
import SupplierCard from "./SupplierCard";
import EmptyState from "./EmptyState";
import ActionButton from "./ActionButton";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

function SupplierSection({ suppliers = [] }) {
  const scrollRef = useRef(null);

  const scrollBy = useCallback((dir) => {
    scrollRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  }, []);

  return (
    <section className="relative overflow-hidden rounded-[24px] sm:rounded-3xl border border-white/60 bg-white/60 p-4 sm:p-6 lg:p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-xl font-inter">
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[24px] sm:rounded-3xl bg-gradient-to-b from-gray-50/50 to-white/40" />

      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-gray-200/50 bg-gradient-to-b from-white to-gray-50 shadow-sm shrink-0">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-800" />
          </div>
          <h2 className="font-sora text-lg sm:text-xl font-bold tracking-tight text-gray-900">
            Connected Suppliers
          </h2>
        </div>
        <ActionButton 
          variant="secondary" 
          className="h-8 sm:h-9 w-max rounded-full border border-gray-200 bg-white px-4 text-[10px] sm:text-[12px] font-bold uppercase tracking-wider text-gray-700 transition-all duration-[350ms] ease-out hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm flex items-center justify-center"
        >
          View All Suppliers
        </ActionButton>
      </div>

      {suppliers.length === 0 ? (
        <EmptyState
          icon={<MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />}
          title="No suppliers connected"
          description="Connect with nearby wholesalers to compare prices and place orders faster."
        />
      ) : (
        <div className="relative group/scroll">
          <div
            ref={scrollRef}
            className="-mx-4 sm:-mx-6 lg:-mx-8 flex snap-x snap-mandatory gap-4 sm:gap-5 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 pt-2 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {suppliers.map((supplier, i) => (
              <SupplierCard key={supplier.id} supplier={supplier} index={i} />
            ))}
          </div>

          <ActionButton
            variant="secondary"
            size="icon"
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            className="absolute -left-2 sm:-left-4 top-1/2 hidden h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-xl backdrop-blur-md transition-all duration-[350ms] ease-out hover:-translate-y-1/2 hover:scale-110 hover:bg-gray-50 active:scale-95 md:flex z-20"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </ActionButton>
          
          <ActionButton
            variant="secondary"
            size="icon"
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            className="absolute -right-2 sm:-right-4 top-1/2 hidden h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-xl backdrop-blur-md transition-all duration-[350ms] ease-out hover:-translate-y-1/2 hover:scale-110 hover:bg-gray-50 active:scale-95 md:flex z-20"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </ActionButton>
        </div>
      )}
    </section>
  );
}

export default React.memo(SupplierSection);