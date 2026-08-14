import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchCode, Search, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query'; // --- ADDED TANSTACK QUERY ---
import { typographyStyles, fadeUp } from '../config/constants';
import { compareApi } from '../../Services/api';

import { Toast, ErrorPopup } from '../components/SharedComponents';
import ProductSearchModal from '../components/ProductSearchModal';
import ProductHeader from '../components/ProductHeader';
import AiPurchaseIntelligence from '../components/AiPurchaseIntelligence';
import SupplierTable from '../components/SupplierTable';
import SupplierModal from '../components/SupplierModal'; 
import NegotiationCRM from '../components/NegotiationCRM';

function useQueryParam() { return new URLSearchParams(useLocation().search); }

// ============================================================
// ✅ PREMIUM SKELETON LOADER (Full Page)
// ============================================================
const CompareSkeleton = () => (
  <div className="w-full max-w-[1440px] mx-auto animate-pulse flex flex-col gap-6 mt-4">
    {/* Header Skeleton */}
    <div className="w-full h-[180px] md:h-[140px] bg-slate-200/80 rounded-[20px] md:rounded-[24px] border border-slate-100" />
    
    {/* AI Intelligence Skeleton */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 w-full">
      <div className="h-[250px] bg-slate-200/80 rounded-[16px] xl:col-span-1 hidden lg:block border border-slate-100" />
      <div className="h-[250px] bg-slate-200/80 rounded-[16px] xl:col-span-2 border border-slate-100" />
    </div>

    {/* Table Skeleton */}
    <div className="w-full h-[400px] bg-slate-200/80 rounded-[24px] border border-slate-100 mt-4" />
  </div>
);

export default function ComparePrice() {
  const queryParam = useQueryParam();
  const navigate = useNavigate();
  
  const masterProductId = queryParam.get("productId");
  const initialQty = parseInt(queryParam.get("qty") || "50", 10);

  const [qty, setQty] = useState(initialQty);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(!masterProductId);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [errorPopup, setErrorPopup] = useState({ show: false, message: "" });

  useEffect(() => {
    if (!masterProductId) { 
      setSearchModalOpen(true); 
    } else { 
      setSearchModalOpen(false); 
    }
  }, [masterProductId]);

  // ✅ TANSTACK QUERY INTEGRATION
  const { 
    data, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['compareData', masterProductId, qty],
    queryFn: async () => {
      const res = await compareApi.getCompareData(masterProductId, qty);
      return res.data;
    },
    enabled: !!masterProductId, // Only run if we have an ID
    staleTime: 5 * 60 * 1000, 
  });

  useEffect(() => {
    if (isError) {
      showToast("Error loading market data.", "error");
    }
  }, [isError]);

  const handleProductSearch = (newProductId, newQty) => {
    setSearchModalOpen(false);
    setQty(newQty);
    navigate(`?productId=${newProductId}&qty=${newQty}`);
  };

  const showToast = (message, type) => setToast({ show: true, message, type });
  const showErrorPopup = (message) => setErrorPopup({ show: true, message });

  // ✅ WORLD-CLASS SAAS EMPTY STATE: No Product Selected
  if (!masterProductId && !searchModalOpen) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50/50 relative overflow-hidden px-4 font-inter">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500/10 to-orange-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Premium Card Container */}
        <div className="relative z-10 flex flex-col items-center text-center p-10 bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] max-w-[480px] w-full">
          
          {/* Floating Icon Setup */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-orange-500 blur-xl opacity-20 rounded-[24px]" />
            <div className="relative w-20 h-20 bg-white border border-slate-100 shadow-sm rounded-[24px] flex items-center justify-center rotate-3 transition-transform hover:rotate-0 duration-500">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center border border-slate-200/50">
                <SearchCode size={24} className="text-slate-700" />
              </div>
            </div>
          </div>

          {/* Typography */}
          <h2 className="text-[22px] font-sora font-bold text-[#0F172A] mb-3 tracking-tight">
            No Product Selected
          </h2>
          <p className="text-[14px] text-slate-500 mb-8 leading-relaxed max-w-[320px]">
            Discover live market prices, analyze bulk deals, and find the perfect procurement opportunities instantly.
          </p>

          {/* Premium Interactive Button */}
          <button 
            onClick={() => setSearchModalOpen(true)} 
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#0F172A] text-white rounded-[16px] text-[14px] font-semibold transition-all duration-300 hover:bg-[#1E293B] hover:shadow-[0_8px_30px_rgb(15,23,42,0.2)] hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto overflow-hidden"
          >
            {/* Subtle hover shine effect */}
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
              <div className="relative h-full w-8 bg-white/20" />
            </div>
            
            <Search size={18} className="text-slate-400 group-hover:text-white transition-colors" />
            <span className="relative z-10">Search Products</span>
            <ArrowRight size={18} className="text-slate-400 group-hover:translate-x-1 group-hover:text-white transition-all duration-300" />
          </button>
          
          {/* SaaS Trust Indicators */}
          <div className="mt-8 flex items-center justify-center gap-6 pt-6 border-t border-slate-100 w-full text-[12px] font-semibold text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
              Live Data
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              Verified Sellers
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: typographyStyles }} />
      
      <AnimatePresence>
        {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      </AnimatePresence>

      <AnimatePresence>
        {errorPopup.show && <ErrorPopup isOpen={errorPopup.show} message={errorPopup.message} onClose={() => setErrorPopup({ show: false, message: "" })} />}
      </AnimatePresence>

      <div className="font-inter antialiased selection:bg-pink-100 selection:text-pink-900 flex flex-col w-full mx-1 my-1 overflow-x-hidden relative">
        <ProductSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} onSearch={handleProductSearch} />

        {/* ✅ SHOW PREMIUM SKELETON WHILE TANSTACK FETCHES */}
        {isLoading && masterProductId ? (
          <CompareSkeleton />
        ) : masterProductId && data ? (
          <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-[1440px] mx-auto">
            
            <ProductHeader qty={qty} setQty={setQty} metrics={data.headerMetrics} boundaries={data.marketBoundaries} onNewSearch={() => setSearchModalOpen(true)} onShowError={showErrorPopup} />

            <AiPurchaseIntelligence topSupplier={data.suppliers?.[0]} aiDeals={data.aiVolumeDeals} qty={qty} />

            <SupplierTable onSelect={setSelectedSupplier} qty={qty} suppliers={data.suppliers} />
          
            <motion.div {...fadeUp}>
              <NegotiationCRM qty={qty} metrics={data.headerMetrics} masterProductId={masterProductId} onShowToast={showToast} />
            </motion.div>
            
          </motion.main>
        ) : null}

        <SupplierModal supplier={selectedSupplier} onClose={() => setSelectedSupplier(null)} />
      </div>
    </>
  );
}