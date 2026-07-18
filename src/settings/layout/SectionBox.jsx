import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function SectionBox({
  title,
  subtitle,
  children,
  action,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className={`
        overflow-hidden
        rounded
        border
        border-zinc-200
        bg-white
        shadow-2xl
        shadow-zinc-200/70
      `}
    >
      <div
        className={`
          flex
          flex-col
          gap-5
          border-b
          border-zinc-200
          p-5
          md:flex-row
          md:items-center
          md:justify-between
          md:p-6
        `}
      >
        <div>
          <h2
            className={`
              mt-3
              text-3xl
              md:text-4xl
              font-black
              tracking-tight
              text-zinc-900
            `}
          >
            {title}
          </h2>

          <p
            className={`
              mt-2
              text-sm
              leading-relaxed
              text-zinc-500
            `}
          >
            {subtitle}
          </p>
        </div>

        {action}
      </div>

      <div className="p-5 md:p-6">
        {children}
      </div>
    </motion.div>
  );
}