import React from "react";
import { motion } from "framer-motion";
import { Check, CheckCheck, AlertCircle, RotateCcw } from "lucide-react";

const bubbleVariants = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

/**
 * isGrouped: true when the previous message in the list was from the same
 * sender within a short time window — tightens vertical spacing and drops
 * the tail corner so consecutive messages read as one visual block.
 * isLast: true for the final bubble in a consecutive group — only the last
 * bubble in a "me" group shows the read-receipt ticks.
 */
export function MessageBubble({ msg, conv, isGrouped, isLast, onRetry }) {
  const isMe = msg.from === "me";

  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex ${isMe ? "justify-end" : "justify-start"} px-4 sm:px-6 ${isGrouped ? "mt-1" : "mt-4"}`}
    >
      <div className={`flex flex-col max-w-[75%] sm:max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>
        <div
          className={`
            relative px-4 py-2.5 text-[14px] leading-relaxed break-words
            ${isMe
              ? `bg-teal-600 text-white shadow-sm
                 ${isGrouped ? "rounded-2xl rounded-tr-md" : "rounded-2xl rounded-tr-md"}`
              : `bg-[#F1F5F9] text-[#111827]
                 ${isGrouped ? "rounded-2xl rounded-tl-md" : "rounded-2xl rounded-tl-md"}`
            }
            ${msg._failed ? "ring-1 ring-red-400/60" : ""}
            ${msg._pending ? "opacity-70" : ""}
          `}
        >
          {msg._deleted ? (
            <span className="italic text-[13px] opacity-70">This message was deleted</span>
          ) : (
            <span>{msg.text}</span>
          )}

          {msg._edited && !msg._deleted && (
            <span className={`text-[10px] ml-1.5 ${isMe ? "text-teal-100/80" : "text-[#94A3B8]"}`}>
              (edited)
            </span>
          )}
        </div>

        <div className={`flex items-center gap-1.5 mt-1 px-1 ${isMe ? "flex-row-reverse" : ""}`}>
          <span className="text-[11px] text-[#94A3B8] font-medium">{msg.time}</span>

          {isMe && isLast && !msg._failed && (
            <span className="text-teal-600">
              {msg._pending ? (
                <Check className="w-3.5 h-3.5 text-[#94A3B8]" />
              ) : msg.read ? (
                <CheckCheck className="w-3.5 h-3.5 text-teal-600" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5 text-[#94A3B8]" />
              )}
            </span>
          )}

          {isMe && msg._failed && (
            <button
              onClick={() => onRetry?.(msg)}
              className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-600 font-medium transition-colors duration-150"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Failed</span>
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}