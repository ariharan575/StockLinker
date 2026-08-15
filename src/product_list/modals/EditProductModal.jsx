import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';

const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        brand: product.brand || '',
        price: product.price || '',
        minimumOrderQuantity: product.minimumOrderQuantity || '',
        bulkDealQuantity: product.bulkDealQuantity || '',
        bulkDealPrice: product.bulkDealPrice || '',
        availableStock: product.availableStock || ''
      });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(product.id, formData);
    setIsSaving(false);
  };

  const inputClass = "w-full h-[50px] sm:h-[56px] px-4 sm:px-5 bg-[#F8FAFC] border border-slate-200 rounded-[12px] sm:rounded-[16px] text-[13px] sm:text-[15px] font-inter font-medium text-[#0F172A] outline-none focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-300/10 transition-all";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0F172A]/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-t-[24px] sm:rounded-[24px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] w-full max-w-[680px] overflow-hidden max-h-[90vh] flex flex-col border border-slate-200"
        >
          <div className="flex items-center justify-between px-5 sm:px-8 py-5 sm:py-6 border-b border-slate-200 bg-[#F8FAFC]/80 shrink-0">
            <div>
              <h2 className="font-sora text-[18px] sm:text-[22px] font-bold text-[#0F172A] tracking-[-0.02em]">Edit Asset</h2>
              <p className="font-inter text-[12px] sm:text-[14px] text-[#64748B] mt-1 truncate max-w-[250px] sm:max-w-[450px]">{product.productName}</p>
            </div>
            <button onClick={onClose} className="p-2 sm:p-2.5 text-[#94A3B8] hover:text-[#0F172A] hover:bg-white rounded-full transition-all bg-white shadow-sm border border-slate-200">
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-5 sm:px-8 py-6 sm:py-8 overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              
              <div className="sm:col-span-2">
                <label className="block font-inter text-[11px] sm:text-[12px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-2">Brand</label>
                <input type="text" value={formData.brand} onChange={(e) => handleChange('brand', e.target.value)} className={inputClass} required />
              </div>

              <div>
                <label className="block font-inter text-[11px] sm:text-[12px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-2">Base Price (₹)</label>
                <input type="number" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} className={inputClass} required min="0" />
              </div>
              
              <div>
                <label className="block font-inter text-[11px] sm:text-[12px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-2">Min Qty ({product.unit})</label>
                <input type="number" value={formData.minimumOrderQuantity} onChange={(e) => handleChange('minimumOrderQuantity', e.target.value)} className={inputClass} required min="1" />
              </div>

              <div className="sm:col-span-2 p-4 sm:p-6 bg-pink-50/50 border border-pink-100 rounded-[16px] sm:rounded-[20px]">
                <h3 className="font-inter text-[12px] sm:text-[13px] font-bold text-[#0F172A] uppercase tracking-[0.08em] mb-4">Bulk Deal Tier</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                  <div>
                    <label className="block font-inter text-[11px] sm:text-[12px] font-semibold text-[#64748B] mb-1.5">Trigger Qty</label>
                    <input type="number" value={formData.bulkDealQuantity} onChange={(e) => handleChange('bulkDealQuantity', e.target.value)} placeholder="e.g. 50" className={inputClass} />
                  </div>
                  <div>
                    <label className="block font-inter text-[11px] sm:text-[12px] font-semibold text-[#64748B] mb-1.5">Deal Price (₹)</label>
                    <input type="number" value={formData.bulkDealPrice} onChange={(e) => handleChange('bulkDealPrice', e.target.value)} placeholder="e.g. 4500" className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-inter text-[11px] sm:text-[12px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-2">Available Stock</label>
                <input type="number" value={formData.availableStock} onChange={(e) => handleChange('availableStock', e.target.value)} className={inputClass} required min="0" />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3.5 font-inter text-[13px] sm:text-[14px] font-bold text-[#0F172A] bg-white border border-slate-200 rounded-[12px] hover:bg-[#F8FAFC] transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 hover:bg-black text-white text-[13px] sm:text-[14px] font-bold font-inter rounded-[12px] transition-all shadow-sm active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2"
              >
                <Save size={16}/> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditProductModal;