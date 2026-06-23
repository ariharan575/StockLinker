import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetailModal = ({ selectedProduct, onClose }) => {
  if (!selectedProduct) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end justify-center"
      >
        <motion.div 
          initial={{ y: "100%" }} 
          animate={{ y: 0 }} 
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white rounded-t-[32px] w-full max-w-md p-6 pb-10 space-y-5 shadow-2xl border-t border-white/50"
        >
          <div 
            className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2 cursor-pointer hover:bg-slate-300 transition-colors" 
            onClick={onClose}
          ></div>
          
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-bold border border-emerald-100/50 uppercase tracking-wider">
                Verified Direct
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">{selectedProduct.name}</h3>
              <p className="text-sm text-slate-500 font-medium mt-0.5">{selectedProduct.pack} Bulk Unit Logistics</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
            >
              ✕
            </button>
          </div>

          <div className="p-5 bg-slate-50/80 rounded-2xl space-y-3 border border-slate-100">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Wholesaler:</span>
              <span className="font-bold text-slate-900">{selectedProduct.supplier}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Quality Score:</span>
              <span className="font-bold text-amber-500 flex items-center gap-1">★ {selectedProduct.rating} / 5.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Warehouse Stock:</span>
              <span className="font-mono text-rose-600 font-bold bg-rose-50 px-2 rounded">{selectedProduct.stock} units left</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-0.5">Negotiated Rate</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{selectedProduct.price}</span>
                <span className="text-sm text-slate-400 line-through font-medium">{selectedProduct.oldPrice}</span>
              </div>
            </div>
            <button className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-rose-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wide active:scale-95">
              Lock Order
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetailModal;