// components/InquirySection.jsx
import React, { useRef, useCallback, useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import InquiryCard from "./InquiryCard";
import InquiryModal from "./InquiryModal";
import EmptyState from "./EmptyState";
import { enquiryApi } from "../services/api";

export default function InquirySection() {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const scrollContainerRef = useRef(null);

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true);
      const data = await enquiryApi.getRelevantEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleAcceptOrder = async (enquiryId) => {
    try {
      await enquiryApi.acceptEnquiry(enquiryId);
      // Remove it from the UI immediately
      setEnquiries(prev => prev.filter(e => e.id !== enquiryId));
      setSelectedEnquiry(null); // Close modal
      alert("Order accepted successfully! It is now processing.");
    } catch (error) {
      alert("Failed to accept order. It may have been closed.");
    }
  };

  return (
    <section className="relative flex p-6 flex-col w-full bg-white rounded-[32px] border border-slate-200/40 shadow-[0_12px_50px_rgb(0,0,0,0.06)]">
      <SectionHeader 
        title="New Buyer Requests" 
        subtitle="Real-time opportunities for your products"
      />

      {isLoading ? (
        <div className="mt-8 flex gap-6 overflow-hidden">
           <div className="w-[420px] h-[280px] bg-slate-100 rounded-[28px] animate-pulse shrink-0" />
           <div className="w-[420px] h-[280px] bg-slate-100 rounded-[28px] animate-pulse shrink-0" />
        </div>
      ) : enquiries.length === 0 ? (
        <div className="mt-8">
          <EmptyState />
        </div>
      ) : (
        <div className="relative group/section mt-6">
          <div 
            ref={scrollContainerRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 pt-2 px-2 -mx-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />
            
            {enquiries.map((enquiry) => (
              <InquiryCard 
                key={enquiry.id} 
                enquiry={enquiry} 
                onViewDetails={() => setSelectedEnquiry(enquiry)} 
                onAccept={() => handleAcceptOrder(enquiry.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* CENTERED POPUP MODAL */}
      <InquiryModal 
        enquiry={selectedEnquiry} 
        isOpen={!!selectedEnquiry} 
        onClose={() => setSelectedEnquiry(null)} 
        onAccept={handleAcceptOrder}
      />
    </section>
  );
}