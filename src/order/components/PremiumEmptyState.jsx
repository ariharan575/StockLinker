import React from 'react';
import { ShoppingCart, MapPin } from 'lucide-react';

export default function PremiumEmptyState({ role, onExplore }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-[24px] shadow-sm p-6 text-center mt-2 relative overflow-hidden h-[450px]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-20" />
      <div className="relative w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 z-10">
        <div className="absolute inset-0 bg-pink-500/5 rounded-2xl animate-pulse" />
        <ShoppingCart className="w-8 h-8 text-slate-300 relative z-10" strokeWidth={2} />
      </div>
      <h3 className="font-sora text-[20px] font-extrabold text-slate-800 mb-2 tracking-tight">
        No orders found
      </h3>
      <p className="text-[14px] text-slate-500 font-medium max-w-md mb-8 leading-relaxed">
        {role === 'WHOLESALER' 
          ? 'You have no orders matching this status right now. Check back later for incoming requests.' 
          : "You haven't placed any wholesale orders matching this status. Discover suppliers to start buying."}
      </p>
      {role !== 'WHOLESALER' && (
        <button onClick={onExplore} className="bg-black text-white px-8 py-3 rounded-xl font-bold text-[13px] hover:bg-slate-800 transition-all shadow-md active:scale-95 flex items-center gap-2">
          <MapPin size={16} /> Explore Nearby Sellers
        </button>
      )}
    </div>
  );
}