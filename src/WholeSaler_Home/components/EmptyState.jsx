import React from "react";
import { Inbox, Plus } from "lucide-react";

export default function EmptyState({ 
  title = "No active records", 
  description = "New data will appear here once available. Get started by creating your first entry.", 
  icon,
  actionLabel,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-[24px] bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-sm relative overflow-hidden w-full h-full min-h-[300px]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-20" />
      
      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6 relative">
        <div className="absolute inset-0 bg-slate-100/50 rounded-2xl animate-pulse" />
        {icon ? (
           React.cloneElement(icon, { className: "w-10 h-10 text-slate-300 relative z-10", strokeWidth: 1.5 })
        ) : (
           <Inbox className="w-10 h-10 text-slate-300 relative z-10" strokeWidth={1.5} />
        )}
      </div>
      
      <h3 className="font-sora text-[20px] sm:text-[22px] font-extrabold tracking-tight text-slate-900 mb-2">
        {title}
      </h3>
      
      <p className="text-[14px] text-slate-500 max-w-md mb-8 leading-relaxed font-inter">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-black text-white text-[14px] font-bold font-inter rounded-xl transition-all shadow-md active:scale-95"
        >
          <Plus size={18} strokeWidth={2.5} /> {actionLabel}
        </button>
      )}
    </div>
  );
}