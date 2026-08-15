import React from 'react';
import { Play, Loader2 } from 'lucide-react';

export default function StartDeliveryModal({ confirmStartRouteDate, setConfirmStartRouteDate, handleStartDeliveryRouteSubmit, isStartingRoute }) {
  if (!confirmStartRouteDate) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-[24px] max-w-sm w-full p-6 sm:p-8 shadow-2xl space-y-5 sm:space-y-6 text-center">
        <div className="mx-auto w-12 h-12 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center">
          <Play size={24} fill="currentColor" />
        </div>
        <div>
          <h3 className="font-['Manrope',_sans-serif] font-extrabold text-[18px] sm:text-[20px] text-black">Start Delivery Route?</h3>
          <p className="text-[13px] font-medium text-slate-500 mt-2 leading-relaxed">
            Are you sure you want to start the route for <b>{Array.isArray(confirmStartRouteDate) ? confirmStartRouteDate.join('-') : confirmStartRouteDate}</b>? All scheduled orders will be marked as "Out for Delivery".
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 pt-2">
          <button disabled={isStartingRoute} onClick={() => setConfirmStartRouteDate(null)} className="flex-1 py-2.5 sm:py-3 bg-white border border-slate-200 text-black text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95 disabled:opacity-50">Cancel</button>
          <button disabled={isStartingRoute} onClick={handleStartDeliveryRouteSubmit} className="flex-1 py-2.5 sm:py-3 bg-black text-white text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70">
            {isStartingRoute ? <Loader2 size={16} className="animate-spin" /> : "Confirm Start"}
          </button>
        </div>
      </div>
    </div>
  );
}