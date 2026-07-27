import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Loader2, ArrowRight } from 'lucide-react';
import { C, inr } from '../config/constants';
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

  const inputCls = "w-full h-[52px] px-5 rounded-xl bg-white border border-slate-200 outline-none text-[14px] font-inter text-slate-900 placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all shadow-sm";

  return (
    <motion.section initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5}} className="w-full mx-auto pb-16">
      <FloatingSurface className="relative overflow-hidden p-8 md:p-10 border border-slate-200 bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: C.gradientCTA }} />
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-100 border border-pink-200 mb-4 text-[11px] font-sora font-bold uppercase tracking-[0.10em] text-pink-700 shadow-sm"><Zap size={14}/> Global Supplier Negotiation</div>
            <h2 className="text-[24px] font-sora font-bold text-slate-900 leading-tight">Request Custom Quote</h2>
            <p className="mt-2 text-[14px] font-inter text-slate-500">Broadcast your target price to all verified suppliers. No commitment until accepted.</p>
          </div>
          <div className="w-full lg:w-[380px] p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.08em] font-bold text-slate-400 mb-1">Product Subject</p>
            <h3 className="text-[16px] font-sora font-bold text-slate-900">{metrics?.productName || "Product"}</h3>
            <div className="flex items-center gap-3 mt-3">
              <span className="px-3 py-1.5 rounded bg-slate-50 border border-slate-100 text-[12px] font-bold text-slate-700">Qty: {negQty}</span>
              <span className="px-3 py-1.5 rounded bg-slate-50 border border-slate-100 text-[12px] font-bold text-slate-700">Avg Market: {inr(metrics?.marketAverageTotal)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[12px] font-bold text-slate-600 uppercase tracking-[0.08em] mb-2">Required Quantity</label>
            <div className="relative">
              <input type="number" value={negQty} onChange={(e)=>setNegQty(parseInt(e.target.value)||0)} className={inputCls} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-slate-400">Units</span>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-slate-600 uppercase tracking-[0.08em] mb-2">Target Total Price (INR)</label>
            <input type="number" value={price} onChange={(e)=>setPrice(e.target.value)} placeholder={`e.g. Below ${inr(metrics?.bestPriceTotal)}`} className={inputCls} />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-[12px] font-bold text-slate-600 uppercase tracking-[0.08em] mb-2">Message To Suppliers</label>
          <textarea rows={4} value={msg} onChange={(e)=>setMsg(e.target.value)} placeholder="Mention specific delivery requirements, payment terms, or customizations..." className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 outline-none text-[14px] font-inter text-slate-900 placeholder:text-slate-400 resize-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all shadow-sm" />
        </div>
        <div className="mt-8 flex items-center gap-4">
          <GradientButton onClick={handleSend} disabled={isSending} className="px-8 py-3.5 text-[14px] shadow-lg">
            {isSending ? <Loader2 size={18} className="animate-spin mr-2" /> : <ArrowRight size={18} className="mr-2" />}
            {isSending ? "Broadcasting..." : "Broadcast Negotiation Request"}
          </GradientButton>
        </div>
      </FloatingSurface>
    </motion.section>
  );
}