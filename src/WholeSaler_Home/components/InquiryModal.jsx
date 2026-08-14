import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Store, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InquiryModal({ enquiry, isOpen, onClose, onAccept }) {
  const navigate = useNavigate();

  if (!isOpen || !enquiry) return null;

  const handleViewProfile = () => {
    if (enquiry.buyerProfileId) navigate(`/storefront/${enquiry.buyerProfileId}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-inter">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
          onClick={onClose} 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 10 }} 
          className="relative w-full max-w-[500px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl flex flex-col z-10"
        >
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-20">
            <h2 className="font-sora text-[18px] font-semibold text-gray-900">Request Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="font-sora flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-[16px] font-bold text-gray-900">
                {enquiry.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-sora text-[16px] font-semibold text-gray-900 truncate">{enquiry.buyer}</span>
                  {enquiry.isVerified && <CheckCircle2 className="w-4 h-4 text-gray-400" />}
                </div>
                <p className="text-[13px] text-gray-500 mt-0.5 truncate">{enquiry.location} • {enquiry.time}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-6">
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Target Product</p>
                <p className="font-sora text-[15px] font-semibold text-gray-900 truncate">{enquiry.title}</p>
                <p className="text-[13px] text-gray-600 mt-1">{enquiry.requestedQuantity} Units required</p>
              </div>
              
              <div className="text-left sm:text-right">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Proposed Value</p>
                <p className="font-sora text-[15px] font-semibold text-gray-900">₹{enquiry.targetPrice.toLocaleString("en-IN")}</p>
                <p className="text-[13px] font-semibold text-gray-500 mt-1">Total Price</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</p>
              <div className="text-[14px] leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                "{enquiry.message}"
              </div>
            </div>
          </div>
          
          <div className="px-6 py-5 border-t border-gray-100 bg-white flex gap-3 sticky bottom-0 z-20">
            <button 
              onClick={handleViewProfile} 
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-[13px] font-semibold hover:border-rose-300 hover:text-rose-600 transition-colors"
            >
              <Store size={16} /> Profile
            </button>
            <button 
              onClick={onAccept} 
              className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-black text-white text-[13px] font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all"
            >
              Accept Order
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}