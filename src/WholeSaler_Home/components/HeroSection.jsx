import React from "react";
import { motion } from "framer-motion";
import StoreImage from "../../assets/Store.png";

// Reusable EASE constant for butter-smooth premium animations
const EASE = [0.22, 1, 0.36, 1];

// Reusable StatCard Component (Strict Icon-Left, Text-Right, Ultra-Compact)
const StatCard = ({ label, value, icon: Icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + index * 0.1, duration: 0.5, ease: EASE }}
    whileHover={{ y: -3 }}
    // Always flex-row, highly compacted padding for 320px screens
    className="flex flex-1 flex-row items-center justify-start gap-1.5 xs:gap-2 sm:gap-3 bg-white border border-slate-200 p-1.5 py-3 md:py-2.5 xs:p-2 sm:px-3 sm:py-2.5 md:p-4 rounded-[10px] sm:rounded-[14px] md:rounded-[16px] shadow-sm hover:shadow-[0_12px_24px_-8px_rgba(236,72,153,0.15)] hover:border-pink-200 transition-all duration-300 min-w-0"
  >
    {/* Icon Container (Left Side) - Micro-sized on mobile */}
    <div className="flex items-center justify-center w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-[6px] sm:rounded-[8px] md:rounded-[10px] bg-pink-50 text-pink-600 shrink-0 border border-pink-100/50">
      <Icon className="w-[12px] h-[12px] xs:w-[14px] xs:h-[14px] sm:w-[16px] sm:h-[16px] md:w-[20px] md:h-[20px]" strokeWidth={2.5} />
    </div>
    
    {/* Text Data (Right Side) - Strictly 2 Lines, Truncated */}
    <div className="flex flex-col text-left min-w-0 flex-1 overflow-hidden">
      {/* Count (Top) */}
      <span className="font-sora text-[12px] xs:text-[12px] sm:text-[15px] md:text-[20px] font-bold text-slate-900 leading-none truncate mb-0.5 sm:mb-1">
        {value}
      </span>
      {/* Name/Label (Bottom) */}
      <span className="font-inter text-[8px] xs:text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest font-bold truncate">
        {label}
      </span>
    </div>
  </motion.div>
);

const WholesalerHero = ({ userName = "Boomathi", kpis = [] }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative w-full md:mt-4 z-20 flex"
    >
      {/* 
        Responsive Container 
        Mobile (< 768px): Transparent/White, NO borders, perfectly flat.
        Tablet & Desktop (md+): Fixed height, rounded bordered container with shadow.
      */}
      <div className="relative w-full md:h-[260px] lg:h-[300px] md:bg-white md:rounded-[24px] lg:rounded-[32px] md:border border-slate-200 md:shadow-[0_8px_30px_rgba(15,23,42,0.04)] overflow-visible md:overflow-hidden flex">
        
        {/* RIGHT COLUMN IMAGE (Visible on Tablet and Desktop) */}
        <div className="hidden md:flex absolute right-0 top-0 w-[45%] lg:w-[40%] h-full items-center justify-center p-3 sm:p-4 z-0 pointer-events-none overflow-hidden rounded-r-[24px] lg:rounded-r-[32px]">
          <motion.img 
            initial={{ scale: 1.05, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 1, ease: EASE }} 
            src={StoreImage} 
            alt="Wholesale Dashboard" 
            className="w-full h-full object-cover object-center rounded-[16px] lg:rounded-[20px] shadow-sm" 
          />
          {/* Gradient fade to blend image smoothly with the white background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none" />
        </div>

        {/* FOREGROUND CONTENT */}
        <div className="relative z-30 flex h-full w-full pointer-events-none px-1 sm:px-4 md:px-8 lg:px-6 pt-7 md:py-0">
          
          {/* LEFT COLUMN: Text and KPIs */}
          <div className="w-full md:w-[65%] lg:w-[60%] h-full flex flex-col justify-center pointer-events-auto">
            
            {/* 1. INLINE GREETING & NAME */}
            <h1 className="text-[24px] xs:text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-sora font-bold text-slate-900 leading-tight flex items-center flex-wrap gap-x-1.5 sm:gap-x-2">
              Welcome back,
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                {userName}
              </span>
              <span className="text-black inline-block origin-bottom-right hover:animate-[wave_1s_ease-in-out_infinite]">👋</span>
            </h1>

            {/* 2. DESCRIPTION */}
            <p className="mt-1.5 sm:mt-2 md:mt-3 text-[13px] sm:text-[13px] md:text-[14px] lg:text-[15px] text-slate-500 font-inter font-medium leading-relaxed max-w-[95%] md:max-w-[480px]">
              Manage your inventory, receive buyer enquiries, fulfil wholesale orders, and grow your business            </p>

            {/* 3. KPI CARDS CONTAINER (Strictly 3 items in a single row across all devices) */}
            <div className="mt-5 sm:mt-6 md:mt-8 flex flex-row w-full gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 max-w-full md:max-w-[500px] lg:max-w-[580px] z-50">
              {kpis.map((kpi, i) => (
                <StatCard key={i} {...kpi} index={i} />
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Global wave animation for the emoji */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes wave { 
          0%, 100% { transform: rotate(0deg); } 
          25% { transform: rotate(-10deg); } 
          75% { transform: rotate(15deg); } 
        }
      `}} />
    </motion.section>
  );
};

export default React.memo(WholesalerHero);