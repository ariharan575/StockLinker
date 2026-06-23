import React from 'react';
import { motion } from 'framer-motion';
import { PREMIUM_EASE } from '../animations/variants';

const WholesaleDealCard = ({ deal }) => {
  return (
    <motion.div 
      whileHover={{ y: -6 }} 
      transition={{ duration: 0.4, ease: PREMIUM_EASE }}
      className="bg-white/90 backdrop-blur-md rounded-[28px] border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(244,63,94,0.08)] hover:border-rose-200 overflow-hidden flex flex-col justify-between cursor-pointer group transition-all duration-500"
    >
      {/* Product Header */}
      <div className="p-5 flex gap-4 border-b border-slate-100 relative">
        <div className="w-20 h-20 bg-slate-50 rounded-[16px] overflow-hidden flex-shrink-0 border border-slate-200/60 relative group-hover:border-rose-200 transition-colors">
          <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="pt-1">
          <h4 className="text-[16px] font-extrabold text-slate-900 tracking-tight group-hover:text-rose-600 transition-colors duration-300">{deal.title}</h4>
          <span className="inline-block bg-slate-100 text-slate-600 text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-md mt-2">
            {deal.weight} BULK
          </span>
        </div>
      </div>

      {/* Pricing Comp Table */}
      <div className="p-5 space-y-2.5 bg-slate-50/50 flex-1">
        {deal.suppliers.map((supp, index) => (
          <div 
            key={index} 
            className={`flex justify-between items-center p-2.5 rounded-xl border text-[13px] transition-all duration-300 ${
              supp.best 
                ? 'bg-white border-rose-200 shadow-sm shadow-rose-500/5' 
                : 'bg-transparent border-transparent hover:bg-white/60 hover:border-slate-200'
            }`}
          >
            <span className="font-semibold text-slate-600">{supp.name}</span>
            <div className="flex items-center gap-2.5">
              <span className={`font-extrabold ${supp.best ? 'text-slate-900 text-sm' : 'text-slate-500'}`}>₹{supp.price}</span>
              {supp.best && (
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                  BEST
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Action */}
      <div className="p-5 bg-white flex items-center justify-between border-t border-slate-100">
        <div className="text-[11px] font-extrabold tracking-wide text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg shadow-sm">
          NET SAVINGS: ₹{deal.savings}
        </div>
        <button className="bg-slate-50 hover:bg-rose-500 text-slate-700 hover:text-white border border-slate-200 hover:border-rose-500 text-[13px] font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm active:scale-[0.98]">
          Select Source
        </button>
      </div>
    </motion.div>
  );
};

export default WholesaleDealCard;