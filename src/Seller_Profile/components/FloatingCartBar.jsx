import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export const FloatingCartBar = ({ cartTotals, setShowCheckoutModal, isMobile }) => {
  return (
    <AnimatePresence>
      {cartTotals.items > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed left-0 w-full bg-[#0F1626] shadow-[0_-12px_40px_rgba(0,0,0,0.3)] z-[45] pb-safe pt-2 md:pt-4 bottom-16 lg:bottom-0"
        >
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-8 text-white">
              <div className="relative bg-slate-800 p-2.5 md:p-3.5 rounded-xl hidden sm:block">
                <ShoppingCart size={isMobile ? 20 : 26} />
                <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] md:text-xs font-bold w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full shadow-md">{cartTotals.items}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] md:text-[12px] font-semibold text-slate-400 uppercase tracking-widest">Order Value <span className="sm:hidden">({cartTotals.items} items)</span></span>
                <span className="font-['Manrope',_sans-serif] text-[20px] sm:text-2xl md:text-3xl font-extrabold leading-none mt-1">₹{cartTotals.cost.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button onClick={() => setShowCheckoutModal(true)} className="px-6 sm:px-8 md:px-10 py-3 md:py-4 bg-pink-500 text-[13px] md:text-base font-bold text-white rounded-xl md:rounded-2xl hover:bg-pink-600 active:scale-95 shadow-lg shadow-pink-500/25 transition-all duration-200">
              Review Order
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};