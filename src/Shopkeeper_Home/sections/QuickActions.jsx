import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SectionHead } from '../../Layout/common';
import { getQuickActions } from '../../Layout/data/index';
import { fadeUp } from '../../Layout/common/constants';

const getPremiumIconStyle = (index) => {
  const styles = [
    "bg-slate-900 text-white shadow-sm",
    "bg-pink-50 text-pink-600 border border-pink-100",
    "bg-slate-50 text-slate-700 border border-slate-200",
    "bg-zinc-100 text-zinc-900 border border-zinc-200",
    "bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md",
    "bg-slate-800 text-pink-50 shadow-sm"
  ];
  return styles[index % styles.length];
};

export default function QuickActions() {
  const navigate = useNavigate();

  // FIX 1: If getQuickActions is a function, call it here. If it's an array, remove the ().
  const actions = typeof getQuickActions === 'function' ? getQuickActions() : getQuickActions;

  return (
    // FIX 2: Fixed the broken 'mb-' Tailwind class
    <section className="mb-6 sm:mb-8 md:mb-10 w-full">
      <div className="sm:px-2 md:px-3">
        <SectionHead title="Quick Actions" sub="Jump right into what you need" />
      </div>

      <div className="flex flex-row w-full justify-between items-stretch gap-1 xs:gap-2 sm:gap-3 md:gap-4 px-1 sm:px-2 md:px-3 pb-2 pt-1">
        {actions.map((a, i) => (
          <motion.button
            key={a.id}
            onClick={() => navigate(a.path)}
            // Ensure your fadeUp function returns { initial, animate, transition }
            {...fadeUp(i * 0.05)} 
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
            className="group relative flex flex-1 min-w-0 flex-col items-center xl:items-start justify-center xl:justify-start bg-white rounded-[12px] md:rounded-[20px] p-1 pt-1.5 sm:p-3 md:p-4 border border-slate-200 shadow-sm hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08)] hover:border-slate-300 transition-all duration-300 focus:outline-none"
          >
            <div 
              className={`w-[28px] h-[28px] xs:w-[32px] xs:h-[32px] sm:w-[38px] sm:h-[38px] md:w-[40px] md:h-[40px] rounded-[8px] md:rounded-[12px] flex items-center justify-center mb-1.5 sm:mb-2 md:mb-3 xl:mb-4 transition-transform duration-300 group-hover:scale-105 shrink-0 ${getPremiumIconStyle(i)}`}
            >
              <a.Icon 
                strokeWidth={2.5} 
                className="w-[14px] h-[14px] xs:w-[16px] xs:h-[16px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px]" 
              />
            </div>
            
            <h3 className="font-sora text-[9px] xs:text-[10px] sm:text-[11px] md:text-[13px] xl:text-[15px] font-bold text-slate-900 mb-0.5 md:mb-1 leading-[1.2] group-hover:text-pink-600 transition-colors w-full text-center xl:text-left whitespace-normal break-words">
              {a.label}
            </h3>
            
            <p className="hidden xl:block font-inter text-[12px] font-medium text-slate-500 leading-snug line-clamp-2 w-full text-left mt-0.5">
              {a.desc}
            </p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}