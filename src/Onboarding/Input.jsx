import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "./constants";

export default function Input({
  id,
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
  onKeyDown,
  hasError,
  type = "text"
}) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" whileHover={{ y: -3, scale: 1.01 }} transition={{ duration: 0.25 }} className="group">
      <label className="text-sm font-semibold mb-2 block text-slate-700">
        {label} {hasError && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <motion.div whileHover={{ rotate: -6 }} className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-300 ${hasError ? 'bg-red-400/10 border-red-400/50' : 'bg-pink-400/10 border-pink-400/20 group-hover:border-pink-400/50'}`}>
            <Icon size={17} className={hasError ? 'text-red-500' : 'text-pink-400'} />
          </div>
        </motion.div>

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`w-full h-[58px] sm:h-[62px] pl-16 pr-4 rounded-2xl border outline-none transition-all duration-300 text-sm font-medium bg-slate-50 placeholder:text-slate-400 focus:ring-4 ${
            hasError 
              ? "border-red-500 focus:border-red-500 focus:ring-red-400/20" 
              : "border-slate-200 focus:border-pink-400 hover:border-pink-400/40 focus:ring-pink-400/10"
          }`}
        />
      </div>
    </motion.div>
  );
}