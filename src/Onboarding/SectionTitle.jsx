import React from "react";
import { motion } from "framer-motion";

export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-8 lg:mb-10">
      <motion.h2
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mt-5 text-[30px] sm:text-[42px] lg:text-[52px] leading-[1.02] font-black tracking-tight text-slate-900"
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.15,
        }}
        className="hidden 2xl:block mt-4 text-sm sm:text-base max-w-2xl leading-relaxed text-slate-600"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}