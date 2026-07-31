import React, { useRef, useEffect, useState } from "react";
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
      setEnquiries(prev => prev.filter(e => e.id !== enquiryId));
      setSelectedEnquiry(null);
    } catch (error) {
      alert("Failed to accept order.");
    }
  };

  return (
    <div className="w-full font-inter">
      <SectionHeader 
        title="Buyer Requests" 
        subtitle="Real-time opportunities for your products"
      />

      {isLoading ? (
        <div className="mt-6 flex gap-4 sm:gap-6 overflow-hidden pb-4">
           <div className="w-[280px] sm:w-[380px] h-[260px] bg-gray-50 rounded-2xl animate-pulse shrink-0 border border-gray-100" />
           <div className="w-[280px] sm:w-[380px] h-[260px] bg-gray-50 rounded-2xl animate-pulse shrink-0 border border-gray-100 hidden md:block" />
        </div>
      ) : enquiries.length === 0 ? (
        <div className="mt-6">
          <EmptyState />
        </div>
      ) : (
        <div className="mt-6 relative">
          <div 
            ref={scrollContainerRef}
            className="flex snap-x snap-mandatory gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
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

      <InquiryModal 
        enquiry={selectedEnquiry} 
        isOpen={!!selectedEnquiry} 
        onClose={() => setSelectedEnquiry(null)} 
        onAccept={handleAcceptOrder}
      />
    </div>
  );
}