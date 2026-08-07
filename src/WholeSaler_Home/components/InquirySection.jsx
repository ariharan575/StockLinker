import React, { useRef, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import SectionHeader from "./SectionHeader";
import InquiryCard from "./InquiryCard";
import InquiryModal from "./InquiryModal";
import EmptyState from "./EmptyState";
import { enquiryApi } from "../services/api";

const InquirySkeleton = () => (
  <div className="w-[280px] sm:w-[380px] h-[260px] bg-white rounded-[16px] animate-pulse shrink-0 border border-slate-200 p-6 flex flex-col shadow-sm">
     <div className="flex gap-3 mb-6">
        <div className="w-10 h-10 bg-slate-200/80 rounded-full" />
        <div className="space-y-2 flex-1"><div className="w-1/2 h-4 bg-slate-200/80 rounded" /><div className="w-1/3 h-3 bg-slate-100 rounded" /></div>
     </div>
     <div className="space-y-2 mb-4 flex-1">
        <div className="w-3/4 h-5 bg-slate-200/80 rounded" />
        <div className="w-full h-12 bg-slate-50 rounded" />
     </div>
     <div className="flex gap-3 mt-auto">
        <div className="w-full h-10 bg-slate-100 rounded-lg" />
        <div className="w-full h-10 bg-slate-200/80 rounded-lg" />
     </div>
  </div>
);

export default function InquirySection({ onError, showNotification }) {
  const queryClient = useQueryClient();
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const scrollContainerRef = useRef(null);

  const { 
    data: enquiries = [], 
    isLoading, 
    isError,
    error // ✅ Extracted the error object
  } = useQuery({
    queryKey: ['dashboardEnquiries'],
    queryFn: async () => {
      return await enquiryApi.getRelevantEnquiries();
    },
    staleTime: 5 * 60 * 1000, 
  });

  // ✅ Passed the exact error up to the global layout
  useEffect(() => {
    if (isError && onError) onError(error);
  }, [isError, error, onError]);

  const handleAcceptOrder = async (enquiryId) => {
    try {
      await enquiryApi.acceptEnquiry(enquiryId);
      
      // Optimistically update cache
      queryClient.setQueryData(['dashboardEnquiries'], (old) => 
        old ? old.filter(e => e.id !== enquiryId) : []
      );
      
      setSelectedEnquiry(null);
      if (showNotification) showNotification('success', 'Order accepted successfully!');
    } catch (err) {
      if (showNotification) showNotification('error', err.response?.data?.message || 'Failed to accept order.');
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
           {[...Array(3)].map((_, i) => <InquirySkeleton key={i} />)}
        </div>
      ) : enquiries.length === 0 ? (
        <div className="mt-6">
          <EmptyState 
            title="No pending requests" 
            description="When buyers are looking for your products, their requests will appear here." 
            actionLabel={null} 
          />
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