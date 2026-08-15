import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function RejectModal({ rejectModalOrder, setRejectModalOrder, rejectionReason, setRejectionReason, handleRejectSubmit, isRejecting }) {
  if (!rejectModalOrder) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-[24px] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 sm:space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0"><AlertCircle size={24}/></div>
          <h3 className="font-['Manrope',_sans-serif] font-extrabold text-[18px] sm:text-[20px] text-black">Reject Request</h3>
        </div>
        <textarea 
          placeholder="Enter specific reason for rejection..." 
          value={rejectionReason} 
          onChange={e => setRejectionReason(e.target.value)} 
          className="w-full p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:border-black focus:ring-1 focus:ring-black transition-all h-24 sm:h-28 resize-none" 
        />
        <div className="flex gap-2 sm:gap-3 pt-2">
          <button disabled={isRejecting} onClick={() => setRejectModalOrder(null)} className="flex-1 py-2.5 sm:py-3 bg-white border border-slate-200 text-black text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95 disabled:opacity-50">Cancel</button>
          <button disabled={isRejecting} onClick={handleRejectSubmit} className="flex-1 py-2.5 sm:py-3 bg-rose-600 text-white text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-md active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70">
            {isRejecting ? <Loader2 size={16} className="animate-spin"/> : "Confirm Rejection"}
          </button>
        </div>
      </div>
    </div>
  );
}