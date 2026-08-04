import React from 'react';
import { motion } from 'framer-motion';
import { WHY_FEATURES } from '../data';
import { fadeUp } from '../../Layout/common/constants';

const getPremiumIconStyle = (index) => {
  const styles = [
    "bg-slate-900 text-white border-transparent shadow-sm",
    "bg-pink-50 text-pink-600 border-pink-100",
    "bg-slate-50 text-slate-700 border-slate-200",
    "bg-zinc-100 text-zinc-900 border-zinc-200",
    "bg-gradient-to-br from-pink-500 to-rose-500 text-white border-transparent shadow-sm",
    "bg-slate-800 text-pink-50 border-transparent shadow-sm"
  ];
  return styles[index % styles.length];
};

export default function WhyStockLinkers() {
  return (
    <section className="hidden md:block mb-8 md:mb-10 w-full px-2 md:px-3">
      
      <div className="text-center mb-6 lg:mb-8">
        <h2 className="font-sora text-[22px] md:text-[26px] lg:text-[28px] font-bold text-slate-900 mb-1.5 tracking-tight">
          Why Choose StockLinker?
        </h2>
        <p className="font-inter text-[13px] md:text-[14px] text-slate-500 font-medium">
          Everything your retail business needs, in one platform
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {WHY_FEATURES.map((f, i) => (
          <motion.div 
            key={f.title}
            {...fadeUp(i * 0.05)}
            whileHover={{ y: -4 }}
            className="group bg-white rounded-[16px] md:rounded-[20px] p-4 lg:p-5 text-center border border-slate-200 shadow-sm hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08)] hover:border-pink-200 transition-all duration-300 focus:outline-none"
          >
            <div 
              className={`w-10 h-10 md:w-11 md:h-11 rounded-[10px] md:rounded-[12px] flex items-center justify-center mx-auto mb-3 border transition-transform duration-300 group-hover:scale-110 ${getPremiumIconStyle(i)}`}
            >
              <f.Icon strokeWidth={2.5} className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
            </div>
            
            <h3 className="font-sora text-[12px] md:text-[13px] font-bold text-slate-900 mb-1 leading-tight group-hover:text-pink-600 transition-colors">
              {f.title}
            </h3>
            
            <p className="font-inter text-[11px] md:text-[12px] text-slate-500 font-medium leading-snug line-clamp-3">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}