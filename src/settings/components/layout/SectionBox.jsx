import React from "react";
import { motion } from "framer-motion";

export function SectionBox({ title, subtitle, children, action }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} 
      className="flex flex-col gap-6 "
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between p-4 pt-2 border-b border-slate-200">
        <div>
          <h2 className="text-[24px] lg:text-[34px] font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-[13px] lg:text-[14px] font-medium leading-relaxed text-slate-500 max-w-2xl">
            {subtitle}
          </p>
        </div>
        <div className="mt-2 md:mt-0 flex shrink-0">
          {action}
        </div>
      </div>
      <div className="w-full">
        {children}
      </div>
    </motion.div>
  );
}