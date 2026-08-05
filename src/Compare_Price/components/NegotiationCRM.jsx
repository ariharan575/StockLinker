import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Loader2, ArrowRight, Package, Wallet, MessageSquare } from 'lucide-react';
import { inr } from '../config/constants';
import { compareApi } from '../Services/api';
import { FloatingSurface, GradientButton } from './SharedComponents';

export default function NegotiationCRM({ qty, metrics, masterProductId, onShowToast }) {
  const [negQty, setNegQty] = useState(qty);
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => { setNegQty(qty); }, [qty]);

  async function handleSend() {
    if (!price || !masterProductId) return;
    setIsSending(true);
    try {
      await compareApi.submitEnquiry({ 
        masterProductId: masterProductId, 
        requestedQuantity: negQty, 
        targetPrice: Number(price), 
        message: msg 
      });
      onShowToast("Success: Negotiation Request Broadcasted!", "success");
      setPrice(""); setMsg("");
    } catch (e) {
      onShowToast("Error: Failed to send request. Try again.", "error");
    } finally {
      setIsSending(false);
    }
  }

  // Premium input styling class
  const inputBaseCls = "w-full bg-slate-50 sm:bg-white border border-slate-200 rounded-[12px] outline-none text-[14px] font-sora font-semibold text-[#0F172A] placeholder:text-slate-400 placeholder:font-inter placeholder:font-normal focus:bg-white focus:border-pink-400 focus:ring-[3px] focus:ring-pink-500/10 transition-all shadow-sm";

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-40px" }} 
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} 
      className="w-full mx-auto pb-12 sm:pb-16 mt-4 sm:mt-8"
    >
      {/* 
        MAIN CONTAINER 
        Mobile: Seamless flow (no border/shadow)
        Tablet/Desktop: Premium bordered card with decorative top gradient
      */}
      <FloatingSurface className="relative overflow-hidden bg-white sm:bg-slate-50/50 sm:border border-slate-200 sm:rounded-[24px] sm:shadow-sm">
        
        <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
          
          {/* Header & Product Summary Section */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8 mb-8 sm:mb-10">
            
            {/* Title Block */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[8px] bg-pink-50 border border-pink-100 mb-3 sm:mb-4 text-[9px] sm:text-[10px] font-sora font-bold uppercase tracking-[0.10em] text-pink-700 shadow-sm w-max">
                <Zap size={12} className="text-pink-500 fill-pink-500" /> Global Supplier Negotiation
              </div>
              <h2 className="text-[20px] sm:text-[24px] lg:text-[28px] font-sora font-bold text-[#0F172A] leading-tight tracking-[-0.02em]">
                Request Custom Quote
              </h2>
              <p className="mt-1.5 sm:mt-2 text-[13px] sm:text-[14px] font-inter text-slate-500 leading-relaxed max-w-xl">
                Broadcast your target price to all verified suppliers. There is no commitment until a seller accepts your specific terms.
              </p>
            </div>

            {/* Product Summary Card */}
            <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 p-4 sm:p-5 rounded-[16px] bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.10em] font-bold text-slate-400">Product Subject</p>
              </div>
              <h3 className="text-[15px] sm:text-[16px] font-sora font-bold text-[#0F172A] leading-tight group-hover:text-pink-600 transition-colors">
                {metrics?.productName || "Selected Product"}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[9px] font-inter font-bold uppercase tracking-[0.05em] text-slate-400 mb-0.5">Quantity</span>
                  <span className="text-[12px] font-sora font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-[6px] border border-slate-100">{negQty} Units</span>
                </div>
                <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-inter font-bold uppercase tracking-[0.05em] text-slate-400 mb-0.5">Market Average</span>
                  <span className="text-[12px] font-sora font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-[6px] border border-slate-100">{inr(metrics?.marketAverageTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white sm:p-6 lg:p-8 sm:rounded-[20px] sm:border border-slate-100 sm:shadow-[0_4px_20px_-10px_rgba(15,23,42,0.05)]">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-5 sm:mb-6">
              
              {/* Quantity Input */}
              <div>
                <label className="block text-[10px] sm:text-[11px] font-inter font-bold text-slate-500 uppercase tracking-[0.08em] mb-1.5 sm:mb-2 ml-1 sm:ml-0">
                  Required Quantity
                </label>
                <div className="relative group/input">
                  <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-pink-500 transition-colors">
                    <Package size={18} />
                  </div>
                  <input 
                    type="number" 
                    value={negQty} 
                    onChange={(e) => setNegQty(parseInt(e.target.value) || 0)} 
                    className={`${inputBaseCls} h-[48px] sm:h-[52px] pl-10 sm:pl-11 pr-16`} 
                  />
                  <span className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-[12px] sm:text-[13px] font-inter font-bold text-slate-400">
                    Units
                  </span>
                </div>
              </div>
              
              {/* Target Price Input */}
              <div>
                <label className="block text-[10px] sm:text-[11px] font-inter font-bold text-slate-500 uppercase tracking-[0.08em] mb-1.5 sm:mb-2 ml-1 sm:ml-0">
                  Target Total Price (INR)
                </label>
                <div className="relative group/input">
                  <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-pink-500 transition-colors">
                    <Wallet size={18} />
                  </div>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder={`e.g. Below ${inr(metrics?.bestPriceTotal)}`} 
                    className={`${inputBaseCls} h-[48px] sm:h-[52px] pl-10 sm:pl-11 pr-4`} 
                  />
                </div>
              </div>
            </div>

            {/* Message Textarea */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-[10px] sm:text-[11px] font-inter font-bold text-slate-500 uppercase tracking-[0.08em] mb-1.5 sm:mb-2 ml-1 sm:ml-0">
                Message To Suppliers
              </label>
              <div className="relative group/input">
                <div className="absolute left-3.5 sm:left-4 top-[14px] sm:top-4 text-slate-400 group-focus-within/input:text-pink-500 transition-colors">
                  <MessageSquare size={18} />
                </div>
                <textarea 
                  rows={3} 
                  value={msg} 
                  onChange={(e) => setMsg(e.target.value)} 
                  placeholder="Mention specific delivery requirements, payment terms, location boundaries, or material customizations..." 
                  className={`${inputBaseCls} py-3.5 sm:py-4 pl-10 sm:pl-11 pr-4 resize-none`} 
                />
              </div>
            </div>
            
            {/* Submit Action */}
            <div className="flex items-center justify-end">
              <GradientButton 
                onClick={handleSend} 
                disabled={isSending || !price} 
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 text-[14px] font-sora shadow-lg sm:rounded-[12px] rounded-[10px]"
              >
                {isSending ? <Loader2 size={18} className="animate-spin mr-2" /> : <ArrowRight size={18} className="mr-2" />}
                {isSending ? "Broadcasting..." : "Broadcast Negotiation Request"}
              </GradientButton>
            </div>
          </div>

        </div>
      </FloatingSurface>
    </motion.section>
  );
}