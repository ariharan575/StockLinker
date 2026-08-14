import React from 'react';
import { Loader2 } from 'lucide-react';

export default function AcceptScheduleModal({ acceptModalOrder, setAcceptModalOrder, scheduledDate, setScheduledDate, handleAcceptSubmit, isAccepting }) {
  if (!acceptModalOrder) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-[24px] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <h3 className="font-['Manrope',_sans-serif] font-extrabold text-[20px] text-black">Schedule Delivery</h3>
          <p className="text-[12px] sm:text-[13px] font-medium text-slate-500 mt-1.5">Pick the planned delivery date for <b>{acceptModalOrder.buyerName}</b>.</p>
        </div>
        
        <input 
          type="date" 
          value={scheduledDate} 
          onChange={e => setScheduledDate(e.target.value)} 
          className="w-full p-3.5 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] sm:text-[14px] font-bold text-black outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all" 
        />

        <div className="flex gap-3 pt-2">
          <button disabled={isAccepting} onClick={() => setAcceptModalOrder(null)} className="flex-1 py-2.5 sm:py-3 bg-white border border-slate-200 text-black text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95 disabled:opacity-50">Cancel</button>
          <button disabled={isAccepting} onClick={handleAcceptSubmit} className="flex-1 py-2.5 sm:py-3 bg-black text-white text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70">
            {isAccepting ? <Loader2 size={16} className="animate-spin"/> : "Set Date"}
          </button>
        </div>
      </div>
    </div>
  );
}