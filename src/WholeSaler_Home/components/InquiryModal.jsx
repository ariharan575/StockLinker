// components/InquiryModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Store, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InquiryModal({ enquiry, isOpen, onClose, onAccept }) {
  const navigate = useNavigate();

  if (!isOpen || !enquiry) return null;

  const totalValue = (enquiry.targetPrice * enquiry.requestedQuantity).toLocaleString("en-IN");

  const handleViewProfile = () => {
    if (enquiry.buyerProfileId) {
      navigate(`/storefront/${enquiry.buyerProfileId}`);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Dark overlay backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
          onClick={onClose} 
        />
        
        {/* Centered Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 10 }} 
          className="relative w-full max-w-[550px] bg-white rounded-[32px] shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-[20px] font-bold text-slate-900">Order Request Details</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="px-8 py-6 space-y-6">
            
            {/* Buyer Info */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[16px] font-bold text-slate-800 shadow-sm border border-slate-200">
                {enquiry.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[16px] font-bold text-slate-900">{enquiry.buyer}</span>
                  {enquiry.isVerified && <CheckCircle className="w-4 h-4 text-slate-700" />}
                </div>
                <p className="text-[13px] text-slate-500 font-medium mt-0.5">{enquiry.location} • Submitted {enquiry.time}</p>
              </div>
            </div>

            {/* Product Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Product</p>
                <p className="text-[15px] font-bold text-slate-900 truncate" title={enquiry.title}>{enquiry.title}</p>
                <p className="text-[13px] font-semibold text-slate-600 mt-2">{enquiry.requestedQuantity} Units required</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-white text-right">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Proposed Value</p>
                <p className="text-[15px] font-bold text-slate-900">₹{enquiry.targetPrice.toLocaleString("en-IN")} / unit</p>
                <p className="text-[13px] font-bold text-emerald-600 mt-2">Total: ₹{totalValue}</p>
              </div>
            </div>

            {/* Message Block */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Buyer's Message</p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-[14px] leading-relaxed text-slate-700 italic">
                "{enquiry.message}"
              </div>
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex gap-3 rounded-b-[32px]">
            <button 
              onClick={handleViewProfile} 
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[16px] bg-white border border-slate-200 text-slate-700 text-[14px] font-bold hover:bg-slate-100 transition-colors shadow-sm"
            >
              <Store size={16} /> View Profile
            </button>
            <button 
              onClick={() => onAccept(enquiry.id)} 
              className="flex-1 flex items-center justify-center py-3 rounded-[16px] bg-gray-900 text-white text-[14px] font-bold shadow-sm hover:bg-black active:scale-[0.98] transition-all"
            >
              Accept Order
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}