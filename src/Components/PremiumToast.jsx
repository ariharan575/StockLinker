import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function PremiumToast({ isVisible, type = "success", message, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const config = {
    success: { 
      icon: CheckCircle2, 
      bg: "bg-[#0C7A53]", 
      border: "border-[#0A6645]", 
      text: "text-white", 
      glow: "shadow-[0_8px_30px_rgba(12,122,83,0.3)]" 
    },
    error: { 
      icon: AlertCircle, 
      bg: "bg-[#DC2626]", 
      border: "border-[#B91C1C]", 
      text: "text-white", 
      glow: "shadow-[0_8px_30px_rgba(220,38,38,0.3)]" 
    },
    info: { 
      icon: Info, 
      bg: "bg-[#1E293B]", 
      border: "border-[#0F172A]", 
      text: "text-white", 
      glow: "shadow-[0_8px_30px_rgba(30,41,59,0.3)]" 
    },
  };

  const currentConfig = config[type] || config.info;
  const Icon = currentConfig.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%", scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: -30, x: "-50%", scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`fixed top-8 left-1/2 z-[9999] flex items-center justify-between gap-4 px-5 py-3 rounded-xl border ${currentConfig.bg} ${currentConfig.border} ${currentConfig.glow} min-w-[340px] max-w-lg w-[90%] sm:w-auto`}
        >
          <div className="flex items-center gap-3 w-full">
            <Icon className={`h-5 w-5 ${currentConfig.text} shrink-0`} strokeWidth={2.5} />
            <span className={`text-[14px] font-bold ${currentConfig.text} tracking-wide leading-tight mt-0.5`}>
              {message}
            </span>
          </div>
          <button 
            onClick={onClose} 
            className={`p-1 rounded-md hover:bg-white/20 transition-colors ${currentConfig.text} shrink-0 outline-none flex items-center justify-center`}
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}