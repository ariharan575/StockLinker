// components/InquirySection.jsx
import React, { useRef, useCallback } from "react";
import SectionHeader from "./SectionHeader";
import InquiryCard from "./InquiryCard";
import EmptyState from "./EmptyState";

export default function InquirySection({ enquiries = [] }) {
  const scrollContainerRef = useRef(null);

  const scroll = useCallback((direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === "left" ? -420 : 420;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, []);

  return (
    <section className="relative flex p-6 flex-col w-full bg-white">
      <SectionHeader 
        title="New Buyer Requests" 
        subtitle="Real-time opportunities from verified buyers"
      />

      {enquiries.length === 0 ? (
        <div className="mt-8">
          <EmptyState />
        </div>
      ) : (
        <div className="relative group/section mt-6">

          {/* Carousel */}
          <div 
            ref={scrollContainerRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-10 pt-2 px-2 -mx-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overscroll-x-contain"
          >
            {enquiries.map((enquiry) => (
              <InquiryCard key={enquiry.id} enquiry={enquiry} />
            ))}
          </div>
        </div>
        
      )}
    </section>
  );
}