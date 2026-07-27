// components/SupplierSection.jsx
import React, { useCallback, useRef } from "react";
import SectionHeader from "./SectionHeader";
import SupplierCard from "./SupplierCard";
import EmptyState from "./EmptyState";
import ActionButton from "./ActionButton";
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from "./Icons";

function SupplierSection({ suppliers }) {
  const scrollRef = useRef(null);

  const scrollBy = useCallback((dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-6 pt-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-xl sm:p-8">
      {/* Premium Container Background Layer */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-slate-50/50 to-white/40" />

      {/* Redesigned Header Inline */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/50 bg-gradient-to-b from-white to-slate-50 shadow-sm">
            <MapPinIcon className="h-5 w-5 text-slate-700" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Connected Suppliers
          </h2>
        </div>
        <ActionButton 
          variant="secondary" 
          className="hidden h-9 rounded-full border border-transparent bg-slate-100/60 px-4 text-sm font-medium text-slate-700 transition-all duration-[350ms] ease-out hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:shadow-sm sm:flex"
        >
          View All Suppliers
        </ActionButton>
      </div>

      {suppliers.length === 0 ? (
        <EmptyState
          icon={<MapPinIcon className="h-6 w-6" />}
          title="No suppliers connected"
          description="Connect with nearby wholesalers to compare prices and place orders faster."
        />
      ) : (
        <div className="relative group/scroll">
          <div
            ref={scrollRef}
            className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-6 pt-2 [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:px-8"
          >
            {suppliers.map((supplier, i) => (
              <SupplierCard key={supplier.id} supplier={supplier} index={i} />
            ))}
          </div>

          <ActionButton
            variant="secondary"
            size="icon"
            aria-label="Scroll suppliers left"
            onClick={() => scrollBy(-1)}
            className="absolute -left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/80 text-slate-700 shadow-xl backdrop-blur-md transition-all duration-[350ms] ease-out hover:-translate-y-1/2 hover:scale-110 hover:bg-white active:scale-95 sm:flex z-20"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </ActionButton>
          
          <ActionButton
            variant="secondary"
            size="icon"
            aria-label="Scroll suppliers right"
            onClick={() => scrollBy(1)}
            className="absolute -right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/80 text-slate-700 shadow-xl backdrop-blur-md transition-all duration-[350ms] ease-out hover:-translate-y-1/2 hover:scale-110 hover:bg-white active:scale-95 sm:flex z-20"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </ActionButton>
        </div>
      )}
    </section>
  );
}

export default React.memo(SupplierSection);