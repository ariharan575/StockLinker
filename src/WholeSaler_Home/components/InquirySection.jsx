import React, { useRef, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import SectionHeader from "./SectionHeader";
import InquiryCard from "./InquiryCard";
import InquiryModal from "./InquiryModal";
import EmptyState from "./EmptyState";
import { enquiryApi } from "../services/api";
import {orderApi} from '../../Authentication/services/api'
import { X, Loader2, GripVertical, ChevronUp, ChevronDown, ArrowRight, CheckCircle2 } from 'lucide-react';

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

  // ==========================================
  // 🚀 ENTERPRISE MULTI-STEP WIZARD STATE
  // ==========================================
  const [acceptWizardEnquiry, setAcceptWizardEnquiry] = useState(null);
  const [wizardStep, setWizardStep] = useState(0); // 0 = Closed, 1 = Date Picker, 2 = Route Builder
  const [scheduledDate, setScheduledDate] = useState("");
  const [routeOrders, setRouteOrders] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ ADDED `isRefetching` to catch the background refresh triggered by the Header notification
  const { 
    data: enquiries = [], 
    isLoading, 
    isRefetching,
    isError,
    error 
  } = useQuery({
    queryKey: ['dashboardEnquiries'],
    queryFn: async () => {
      return await enquiryApi.getRelevantEnquiries();
    },
    staleTime: 5 * 60 * 1000, 
  });

  useEffect(() => {
    if (isError && onError) onError(error);
  }, [isError, error, onError]);

  // --- WIZARD CONTROLLERS ---
  const startWizard = (enquiry) => {
    setAcceptWizardEnquiry(enquiry);
    setScheduledDate("");
    setRouteOrders([]);
    setWizardStep(1);
    setSelectedEnquiry(null); // Close details modal if open
  };

  const closeWizard = () => {
    setAcceptWizardEnquiry(null);
    setWizardStep(0);
    setScheduledDate("");
    setRouteOrders([]);
  };

  // STEP 1 -> STEP 2
  const handleDateNext = async () => {
    if (!scheduledDate) return showNotification?.("error", "Please select a delivery date");
    setIsProcessing(true);
    
    try {
      // Fetch existing orders for the selected date to build the route preview
      const res = await orderApi.getOrdersByDate(scheduledDate);
      const existingOrders = res.data || [];
      
      // Inject the pending enquiry into the route list locally as a preview
      setRouteOrders([
        ...existingOrders,
        {
          id: 'NEW_TEMP', // Temporary ID for UI tracking
          buyerName: acceptWizardEnquiry.buyer,
          orderNumber: 'Pending Creation'
        }
      ]);
      
      setWizardStep(2); // Move to Route Builder
    } catch (err) {
      if (showNotification) showNotification("error", "Failed to fetch route data for this date.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ROUTE UI DRAG CONTROLS
  const moveRouteItem = (dragIndex, hoverIndex) => {
    const updated = [...routeOrders];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, moved);
    setRouteOrders(updated);
  };

  // FINAL SUBMISSION (STEP 2 -> API -> SUCCESS)
  const handleFinalAcceptAndSequence = async () => {
    setIsProcessing(true);
    try {
      // 1. Finally accept the enquiry via backend (Creates the actual Order)
      await enquiryApi.acceptEnquiry(acceptWizardEnquiry.id, scheduledDate);
      
      // Optimistic cache update to remove inquiry from dashboard
      queryClient.setQueryData(['dashboardEnquiries'], (old) => 
        old ? old.filter(e => e.id !== acceptWizardEnquiry.id) : []
      );

      // 2. We need the newly created Order ID to map the sequence correctly.
      // Fetch the updated orders for this date to find the new one.
      const res = await orderApi.getOrdersByDate(scheduledDate);
      const fetchedOrders = res.data || [];
      
      const previousIds = routeOrders.filter(ro => ro.id !== 'NEW_TEMP').map(ro => ro.id);
      const newlyCreatedOrder = fetchedOrders.find(o => !previousIds.includes(o.id));

      // 3. Map the user's arranged route UI state into real database IDs
      if (newlyCreatedOrder) {
        const finalSequenceIds = routeOrders.map(ro => 
          ro.id === 'NEW_TEMP' ? newlyCreatedOrder.id : ro.id
        );
        // 4. Update the route sequence in the backend
        await orderApi.updateRouteSequence(scheduledDate, finalSequenceIds);
      }

      closeWizard();
      if (showNotification) showNotification("success", "Order officially accepted and routed successfully!");
    } catch (error) {
      if (showNotification) showNotification("error", error.response?.data?.message || "Failed to finalize order.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full font-inter">
      <SectionHeader 
        title="Buyer Requests" 
        subtitle="Real-time opportunities for your products"
      />

      {/* ✅ UPDATED: Now triggers the skeleton loader on initial load OR background refetch */}
      {(isLoading || isRefetching) ? (
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
                onAccept={() => startWizard(enquiry)}
              />
            ))}
          </div>
        </div>
      )}

      {/* INQUIRY DETAIL MODAL */}
      <InquiryModal 
        enquiry={selectedEnquiry} 
        isOpen={!!selectedEnquiry} 
        onClose={() => setSelectedEnquiry(null)} 
        onAccept={() => startWizard(selectedEnquiry)}
      />

      {/* ========================================== */}
      {/* 🚀 WIZARD STEP 1: DATE PICKER MODAL */}
      {/* ========================================== */}
      {wizardStep === 1 && acceptWizardEnquiry && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-['Manrope',_sans-serif] font-extrabold text-[20px] text-black">Schedule Delivery</h3>
                <p className="text-[12px] sm:text-[13px] font-medium text-slate-500 mt-1.5">Pick the planned delivery date for <b>{acceptWizardEnquiry.buyer}</b>.</p>
              </div>
              <button onClick={closeWizard} className="p-2 bg-slate-50 text-slate-400 hover:text-black rounded-full hover:bg-slate-100 transition-colors">
                 <X size={18}/>
              </button>
            </div>
            
            <input 
              type="date" 
              value={scheduledDate} 
              onChange={e => setScheduledDate(e.target.value)} 
              className="w-full p-3.5 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] sm:text-[14px] font-bold text-black outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all" 
            />

            <div className="flex gap-3 pt-2">
              <button disabled={isProcessing} onClick={closeWizard} className="flex-1 py-2.5 sm:py-3 bg-white border border-slate-200 text-black text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95 disabled:opacity-50">Cancel</button>
              <button disabled={isProcessing} onClick={handleDateNext} className="flex-1 py-2.5 sm:py-3 bg-black text-white text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70">
                {isProcessing ? <Loader2 size={16} className="animate-spin"/> : <><ArrowRight size={16}/> Next Step</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 🚀 WIZARD STEP 2: ROUTE BUILDER MODAL */}
      {/* ========================================== */}
      {wizardStep === 2 && acceptWizardEnquiry && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-['Manrope',_sans-serif] font-extrabold text-[20px] text-black">Arrange Route Sequence</h3>
                <p className="text-[12px] sm:text-[13px] font-medium text-slate-500 mt-1.5">Re-order stops to optimize your physical delivery path for <b>{scheduledDate}</b>.</p>
              </div>
              <button onClick={closeWizard} className="p-2 bg-slate-50 text-slate-400 hover:text-black rounded-full hover:bg-slate-100 transition-colors">
                 <X size={18}/>
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] sm:max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
              {routeOrders.map((ro, index) => {
                const isNew = ro.id === 'NEW_TEMP';
                return (
                  <div key={ro.id} className={`p-3 sm:p-4 bg-white border rounded-xl flex items-center justify-between shadow-sm transition-all group ${isNew ? 'border-pink-400 bg-pink-50/30' : 'border-slate-200 hover:border-pink-300 hover:shadow-md'}`}>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <GripVertical size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors cursor-move hidden sm:block" />
                      <span className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border font-extrabold text-[12px] sm:text-[13px] flex items-center justify-center shrink-0 ${isNew ? 'bg-pink-100 border-pink-200 text-pink-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>{index + 1}</span>
                      <div className="flex flex-col">
                        <span className="text-[13px] sm:text-[14px] font-bold text-black line-clamp-1 flex items-center gap-2">
                          {ro.buyerName} 
                          {isNew && <span className="text-[9px] font-extrabold tracking-wider bg-pink-500 text-white px-2 py-0.5 rounded uppercase">New</span>}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wide">Order: {ro.orderNumber?.substring(0,10)}...</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button disabled={index === 0} onClick={() => moveRouteItem(index, index - 1)} className="p-1.5 sm:p-2 bg-slate-50 border border-transparent rounded-lg text-slate-600 font-bold hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 disabled:opacity-30 disabled:hover:bg-slate-50 transition-colors"><ChevronUp size={16}/></button>
                      <button disabled={index === routeOrders.length - 1} onClick={() => moveRouteItem(index, index + 1)} className="p-1.5 sm:p-2 bg-slate-50 border border-transparent rounded-lg text-slate-600 font-bold hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 disabled:opacity-30 disabled:hover:bg-slate-50 transition-colors"><ChevronDown size={16}/></button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex pt-4 border-t border-slate-100 gap-3">
              <button disabled={isProcessing} onClick={() => setWizardStep(1)} className="px-4 py-3 sm:py-3.5 bg-white border border-slate-200 text-black text-[13px] sm:text-[14px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95 disabled:opacity-50">Back</button>
              <button onClick={handleFinalAcceptAndSequence} disabled={isProcessing} className="flex-1 py-3 sm:py-3.5 bg-black text-white text-[13px] sm:text-[14px] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70">
                {isProcessing ? <Loader2 size={16} className="animate-spin"/> : <><CheckCircle2 size={18}/> Confirm & Accept Order</>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}