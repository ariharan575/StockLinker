import React from "react";
import { motion } from "framer-motion";

export function SectionBox({ title, subtitle, children, action }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      // Premium smooth easing curve
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} 
      className="overflow-hidden border border-slate-200/50 bg-white shadow-[0_8px_40px_rgb(0,0,0,0.03)]"
    >
      <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-6 lg:p-7 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-[27px] sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium leading-relaxed text-slate-500 max-w-2xl">
            {subtitle}
          </p>
        </div>
        
        {/* Action area - self-aligns on mobile, flex-end on desktop */}
        <div className="mt-2 md:mt-0 flex shrink-0">
          {action}
        </div>
      </div>
      
      {/* Subtle background tint for the content area to make inner cards pop */}
      <div className="bg-slate-50/30 p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </motion.div>
  );
}