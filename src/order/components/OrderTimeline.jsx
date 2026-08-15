import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function OrderTimeline({ order }) {
  const isCancelled = order.status === 'CANCELLED';

  const steps = [
    { 
      id: 'placed', 
      label: 'Order Request Placed', 
      time: order.placedAt, 
      done: true, 
      active: order.status === 'PENDING' 
    },
    { 
      id: 'processed', 
      label: isCancelled ? 'Order Cancelled' : 'Order Accepted & Processed', 
      time: isCancelled ? order.cancelledAt : order.confirmedAt,
      done: ['PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) || isCancelled,
      active: order.status === 'PROCESSING',
      isError: isCancelled
    },
    { 
      id: 'out', 
      label: 'Out for Delivery', 
      time: order.outForDeliveryAt, 
      done: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status), 
      active: order.status === 'OUT_FOR_DELIVERY', 
      hide: isCancelled 
    },
    { 
      id: 'delivered', 
      label: 'Order Delivered', 
      time: order.deliveredAt, 
      done: order.status === 'DELIVERED', 
      active: false, 
      hide: isCancelled 
    }
  ];

  const visibleSteps = steps.filter(s => !s.hide);

  return (
    <div className="relative pl-2 sm:pl-4 space-y-6 mt-2">
      <div className="absolute left-[23px] sm:left-[31px] top-4 bottom-6 w-[2px] bg-slate-100" />
      
      {visibleSteps.map((step) => (
        <div key={step.id} className="relative z-10 flex items-start gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[2px] shrink-0 bg-white transition-colors duration-300
             ${step.isError ? 'border-red-500 text-red-500 bg-red-50' :
               step.done && !step.active ? 'border-[#17B26A] text-[#17B26A] bg-[#ECFDF3]' : 
               step.active ? 'border-pink-500 text-pink-500 ring-4 ring-pink-50' : 
               'border-slate-200 text-slate-300'}`}
          >
             {step.isError ? <X size={14} strokeWidth={3} /> :
              (step.done && !step.active) ? <CheckCircle2 size={14} strokeWidth={3} /> : 
              step.active ? <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse" /> : 
              <div className="w-2.5 h-2.5 bg-slate-200 rounded-full" />}
          </div>
          
          <div className="pt-1.5">
             <p className={`text-[13px] sm:text-[14px] font-bold ${step.isError ? 'text-red-600' : step.active ? 'text-pink-600' : step.done ? 'text-black' : 'text-slate-400'}`}>
               {step.label}
             </p>
             {step.time ? (
               <p className="text-[11px] sm:text-[12px] font-medium text-slate-500 mt-1">
                 {new Date(step.time).toLocaleString('en-IN', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}
               </p>
             ) : (
               <p className="text-[11px] sm:text-[12px] font-medium text-slate-400 mt-1 italic">
                 Pending update...
               </p>
             )}
          </div>
        </div>
      ))}
    </div>
  );
}