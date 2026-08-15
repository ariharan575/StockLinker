import React from 'react';
import { X, GripVertical, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';

export default function RouteSequencingModal({ routeBuilderModalOpen, setRouteBuilderModalOpen, scheduledDate, routeOrders, moveRouteItem, handleSaveRouteSequence, isSavingRoute }) {
  if (!routeBuilderModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-[24px] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-['Manrope',_sans-serif] font-extrabold text-[20px] text-black">Arrange Route Sequence</h3>
            <p className="text-[12px] sm:text-[13px] font-medium text-slate-500 mt-1.5">Re-order stops to optimize your physical delivery path for <b>{scheduledDate}</b>.</p>
          </div>
          <button onClick={() => setRouteBuilderModalOpen(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-black rounded-full hover:bg-slate-100 transition-colors">
             <X size={18}/>
          </button>
        </div>

        <div className="space-y-3 max-h-[300px] sm:max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
          {routeOrders.map((ro, index) => (
            <div key={ro.id} className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm hover:border-pink-300 hover:shadow-md transition-all group">
              <div className="flex items-center gap-2 sm:gap-3">
                <GripVertical size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors cursor-move hidden sm:block" />
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-[12px] sm:text-[13px] flex items-center justify-center shrink-0">{index + 1}</span>
                <div className="flex flex-col">
                  <span className="text-[13px] sm:text-[14px] font-bold text-black line-clamp-1">{ro.buyerName}</span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wide">Order: {ro.orderNumber.substring(0,10)}...</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button disabled={index === 0} onClick={() => moveRouteItem(index, index - 1)} className="p-1.5 sm:p-2 bg-slate-50 border border-transparent rounded-lg text-slate-600 font-bold hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 disabled:opacity-30 disabled:hover:bg-slate-50 transition-colors"><ChevronUp size={16}/></button>
                <button disabled={index === routeOrders.length - 1} onClick={() => moveRouteItem(index, index + 1)} className="p-1.5 sm:p-2 bg-slate-50 border border-transparent rounded-lg text-slate-600 font-bold hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 disabled:opacity-30 disabled:hover:bg-slate-50 transition-colors"><ChevronDown size={16}/></button>
              </div>
            </div>
          ))}
          {routeOrders.length === 0 && <p className="text-[13px] font-medium text-slate-500 text-center py-6">No other orders scheduled for this date.</p>}
        </div>

        <div className="flex pt-4 border-t border-slate-100">
          <button onClick={handleSaveRouteSequence} disabled={isSavingRoute} className="w-full py-3 sm:py-3.5 bg-black text-white text-[13px] sm:text-[14px] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70">
            {isSavingRoute ? <Loader2 size={16} className="animate-spin"/> : "Save Optimized Route"}
          </button>
        </div>
      </div>
    </div>
  );
}