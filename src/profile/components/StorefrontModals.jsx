import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle2, Loader2, Star } from 'lucide-react';
import { getSubcategoryImageUrl } from '../utils/helpers';

export const SubCategoryModal = ({ show, onClose, subCategories }) => (
  <AnimatePresence>
    {show && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm">
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[24px] md:rounded-[32px] w-full max-w-4xl p-6 md:p-8 shadow-2xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-['Manrope',_sans-serif] text-[20px] md:text-2xl font-extrabold text-slate-900">All Categories</h3>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full transition-colors"><X size={20}/></button>
          </div>
          <div className="overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4 p-1 hide-scrollbar">
            {subCategories.map((cat, i) => {
              const imgUrl = getSubcategoryImageUrl(cat.image) || cat.image;
              return (
                <div key={i} className="aspect-square rounded-[16px] md:rounded-2xl overflow-hidden relative group border border-slate-200/60 bg-slate-50 shadow-sm">
                  {imgUrl ? (
                    <img src={imgUrl} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-xs uppercase">{cat.name?.charAt(0)}</div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/60 transition-colors" />
                  <div className="absolute inset-0 p-3 md:p-4 flex items-center justify-center text-center">
                    <span className="text-white text-[12px] md:text-sm font-extrabold leading-tight drop-shadow-lg">{cat.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const CheckoutModal = ({ show, onClose, profile, cartItemsList, cartTotals, firstLetter, setShowCancelConfirmModal, handleConfirmOrderPlacement, isPlacingOrder }) => (
  <AnimatePresence>
    {show && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="bg-white rounded-t-[24px] sm:rounded-[32px] max-w-2xl w-full p-5 md:p-8 shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h3 className="font-['Manrope',_sans-serif] text-[18px] md:text-2xl font-extrabold text-slate-900">Order Request Summary</h3>
            <button onClick={onClose} className="p-2 md:p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full"><X size={18} className="md:w-5 md:h-5"/></button>
          </div>
          <div className="overflow-y-auto flex-1 pr-1 md:pr-2 space-y-4 md:space-y-5 hide-scrollbar">
            <div className="bg-slate-50/50 p-4 md:p-5 rounded-2xl border border-slate-200/60 flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-extrabold font-['Manrope',_sans-serif] text-[18px] md:text-2xl">{firstLetter}</div>
              <div>
                <p className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-widest">Fulfilling Partner</p>
                <p className="text-[15px] md:text-xl font-extrabold text-slate-900 leading-tight mt-0.5">{profile.businessName}</p>
              </div>
            </div>
            <div className="border border-slate-200/60 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {cartItemsList.map(item => (
                <div key={item.id} className="p-4 md:p-5 flex items-center justify-between bg-white">
                  <div className="flex flex-col gap-1">
                    <p className="text-[13px] md:text-[15px] font-bold text-slate-900 line-clamp-1">{item.productName}</p>
                    <p className="text-[11px] md:text-xs text-slate-500 font-medium">
                      {item.orderQty} {item.unit} × ₹{item.appliedPrice.toLocaleString('en-IN')}
                      {item.appliedPrice < item.price && (
                        <span className="text-[10px] text-emerald-700 font-extrabold ml-2 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Bulk Deal</span>
                      )}
                    </p>
                  </div>
                  <p className="text-[14px] md:text-lg font-extrabold text-slate-900">₹{item.lineTotal.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-900 text-white p-5 md:p-6 rounded-2xl space-y-3 shadow-lg">
              <div className="flex justify-between text-[12px] md:text-sm font-medium text-slate-400"><span>Subtotal</span><span>₹{cartTotals.cost.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-[12px] md:text-sm font-medium text-slate-400"><span>Est. Tax / Delivery</span><span className="text-[10px] md:text-xs bg-white/10 px-2 py-1 rounded">Calculated by Seller</span></div>
              <div className="flex justify-between items-end border-t border-slate-700 pt-4 mt-3">
                <span className="text-[13px] md:text-base font-bold text-slate-300">Request Total</span>
                <span className="font-['Manrope',_sans-serif] text-[20px] md:text-3xl font-extrabold leading-none">₹{cartTotals.cost.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 pt-5 border-t border-slate-100 mt-4">
            <button onClick={() => setShowCancelConfirmModal(true)} disabled={isPlacingOrder} className="flex-1 py-3.5 md:py-4 bg-white border border-slate-200 text-slate-700 font-bold text-[13px] md:text-base rounded-xl md:rounded-2xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50">Discard Draft</button>
            <button 
              onClick={handleConfirmOrderPlacement} 
              disabled={isPlacingOrder} 
              className="flex-[2] py-3.5 md:py-4 bg-pink-500 text-white font-bold text-[13px] md:text-base rounded-xl md:rounded-2xl hover:bg-pink-600 shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
            >
              {isPlacingOrder && <Loader2 size={18} className="animate-spin" />}
              {isPlacingOrder ? "Processing..." : "Send Order Request"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const CancelConfirmModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] md:rounded-[32px] max-w-xs md:max-w-sm w-full p-6 md:p-8 shadow-2xl text-center space-y-4">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-100"><AlertCircle size={24}/></div>
        <h4 className="font-['Manrope',_sans-serif] text-[18px] md:text-xl font-extrabold text-slate-900">Discard Order?</h4>
        <p className="text-[13px] md:text-sm text-slate-500 font-medium leading-relaxed">Are you sure? All selected items and quantities will be cleared from this partner's cart.</p>
        <div className="flex flex-row gap-3 pt-4">
          <button onClick={onClose} className="flex-1 py-3 bg-white border border-slate-200 text-slate-900 font-bold text-[13px] md:text-sm rounded-xl hover:bg-slate-50 transition-all active:scale-95">Keep Editing</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-rose-500 text-white font-bold text-[13px] md:text-sm rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all active:scale-95">Yes, Discard</button>
        </div>
      </div>
    </div>
  );
};

export const PlaceOrderConfirmModal = ({ show, onClose, onConfirm, profile, isPlacingOrder }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] md:rounded-[32px] max-w-xs md:max-w-md w-full p-6 md:p-8 shadow-2xl text-center space-y-4">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl"><CheckCircle2 size={24}/></div>
        <h4 className="font-['Manrope',_sans-serif] text-[18px] md:text-2xl font-extrabold text-slate-900">Send Request?</h4>
        <p className="text-[13px] md:text-sm text-slate-500 font-medium leading-relaxed">This will notify <b>{profile.businessName}</b> to review and schedule your delivery. You won't be charged until they confirm.</p>
        <div className="flex flex-row gap-3 pt-4">
          <button onClick={onClose} disabled={isPlacingOrder} className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-[13px] md:text-sm rounded-xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50">Back</button>
          <button onClick={onConfirm} disabled={isPlacingOrder} className="flex-[2] py-3 bg-emerald-500 text-white font-bold text-[13px] md:text-sm rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70">
            {isPlacingOrder && <Loader2 size={16} className="animate-spin" />} 
            {isPlacingOrder ? "Sending..." : "Confirm & Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const RatingConfirmModal = ({ show, onClose, onConfirm, selectedRating, isSubmittingRating }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] max-w-xs w-full p-6 shadow-2xl text-center space-y-4">
        <div className="w-14 h-14 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center mx-auto border border-yellow-100"><Star fill="currentColor" size={28}/></div>
        <h4 className="font-['Manrope',_sans-serif] text-xl font-extrabold text-slate-900">Confirm Rating?</h4>
        <p className="text-[13px] text-slate-500 font-medium leading-relaxed">You are about to rate this partner <b>{selectedRating} stars</b>. This helps establish their market rank and cannot be changed later.</p>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} disabled={isSubmittingRating} className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-[13px] rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={isSubmittingRating} className="flex-1 py-3 bg-slate-900 text-white font-bold text-[13px] rounded-xl hover:bg-slate-800 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70">
            {isSubmittingRating && <Loader2 size={16} className="animate-spin" />}
            {isSubmittingRating ? "Submitting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};