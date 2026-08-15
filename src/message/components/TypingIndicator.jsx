import React from "react";
import { motion } from "framer-motion";
import { Avatar } from "./Messenger"; // Or wherever Avatar is imported from in your setup

export function TypingIndicator({ conv }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-end gap-2 px-4 sm:px-6 mt-4"
    >
      <Avatar
        name={conv.name}
        colorClass={conv.colorClass}
        sizeClass="w-7 h-7"
        textClass="text-[10px]"
        showStatus={false}
      />
      <div className="flex items-center gap-1 bg-[#F1F5F9] rounded-2xl rounded-tl-md px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}