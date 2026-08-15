import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ShieldCheck, Star, MessageCircle, Phone } from 'lucide-react';
import { inr } from '../config/constants';
import { ScoreRing } from './SharedComponents';

export default function SupplierModal({ supplier, onClose }) {
  const navigate = useNavigate();

  const handleMessageClick = (e) => {
    e.stopPropagation();
    if (!supplier) return;
    navigate('/message', {
      state: {
        partnerToMessage: {
          id: supplier.userId || supplier.id,
          name: supplier.name || supplier.businessName || "Unnamed Business",
          businessName: supplier.category || supplier.businessName || "General Business",
          profileImage: null
        }
      }
    });
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    if (!supplier) return;
    const profileId = supplier.businessProfileId || supplier.id;
    if (profileId) {
      navigate(`/storefront/${profileId}`);
    } else {
      console.error("Missing business profile reference.");
    }
  };

  if (!supplier) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="relative w-full max-w-[500px] bg-white rounded-[24px] shadow-2xl flex flex-col z-10 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="text-[18px] font-sora font-bold text-slate-900">Supplier Profile</h2>
            <button onClick={onClose} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 shadow-sm transition-colors"><X size={16} /></button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-sora font-bold text-[18px] flex items-center justify-center shadow-lg">{supplier.initials}</div>
              <div>
                <h3 className="text-[20px] font-sora font-bold text-slate-900 leading-tight">{supplier.businessName}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="flex items-center gap-1 text-[12px] font-medium text-slate-500"><MapPin size={12}/> {supplier.locationDistrict}</span>
                  {supplier.verified && <span className="flex items-center gap-1 text-[12px] font-bold text-emerald-600"><ShieldCheck size={14}/> Verified</span>}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-[12px] font-inter font-semibold uppercase tracking-[0.08em] text-slate-500">Calculated Total Price</span>
                <span className="text-[20px] font-sora font-bold text-slate-900">{inr(supplier.calculatedTotalPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-inter font-semibold uppercase tracking-[0.08em] text-slate-500">Base MOQ</span>
                <span className="text-[14px] font-sora font-bold text-slate-900">{supplier.moq} {supplier.unit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-inter font-semibold uppercase tracking-[0.08em] text-slate-500">Stock Available</span>
                <span className="text-[14px] font-sora font-bold text-slate-900">{supplier.availableStock} Units</span>
              </div>
            </div>

            {supplier.bulkQty && supplier.bulkTotalPrice && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div className="flex flex-col"><span className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.08em]">Bulk Deal Active</span><span className="text-[14px] font-sora font-bold text-emerald-900">Buy {supplier.bulkQty}+ Bundle @ {inr(supplier.bulkTotalPrice)}</span></div>
                <span className="text-[12px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">Save {inr(supplier.bulkSavingsAmount)}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 rounded-xl"><span className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.08em] mb-1">Trust Score</span><ScoreRing score={supplier.trustScore} size={40}/></div>
              <div className="p-4 border border-slate-200 rounded-xl"><span className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.08em] mb-1">Rating</span><span className="text-[18px] font-sora font-bold text-slate-900 flex items-center gap-1.5"><Star size={16} className="fill-yellow-500 text-yellow-500"/> {supplier.rating}</span></div>
            </div>
          </div>
          
          <div className="p-6 border-t border-slate-100 bg-slate-50 grid grid-cols-2 gap-3 rounded-b-[24px]">
            <button onClick={handleMessageClick} className="col-span-1 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-[13px] flex justify-center items-center gap-2 hover:bg-slate-100 shadow-sm transition-colors"><MessageCircle size={16}/> Message</button>
            <button className="col-span-1 py-3 rounded-xl bg-slate-900 text-white font-semibold text-[13px] flex justify-center items-center gap-2 hover:bg-slate-800 shadow-md transition-colors"><Phone size={16}/> Call</button>
            <button onClick={handleViewProfile} className="col-span-2 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-[13px] flex justify-center items-center hover:bg-slate-100 shadow-sm transition-colors">View Full Profile</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}