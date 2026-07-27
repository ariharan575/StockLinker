import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, SearchCode } from 'lucide-react';
import { typographyStyles, fadeUp } from '../config/constants';
import { compareApi } from '../Services/api';

import { Toast, ErrorPopup } from '../components/SharedComponents';
import ProductSearchModal from '../components/ProductSearchModal';
import ProductHeader from '../components/ProductHeader';
import AiPurchaseIntelligence from '../components/AiPurchaseIntelligence';
import SupplierTable from '../components/SupplierTable';
import SupplierModal from '../components/SupplierModal'; // Renamed to use the new centered Modal
import NegotiationCRM from '../components/NegotiationCRM';

function useQuery() { return new URLSearchParams(useLocation().search); }

export default function ComparePrice() {
  const query = useQuery();
  const navigate = useNavigate();
  
  const masterProductId = query.get("productId");
  const initialQty = parseInt(query.get("qty") || "50", 10);

  const [qty, setQty] = useState(initialQty);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(!masterProductId);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [errorPopup, setErrorPopup] = useState({ show: false, message: "" });

  useEffect(() => {
    if (!masterProductId) { 
      setSearchModalOpen(true); 
      setIsLoading(false); 
    } else { 
      setSearchModalOpen(false); 
    }
  }, [masterProductId]);

  useEffect(() => {
    if (!masterProductId) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await compareApi.getCompareData(masterProductId, qty);
        setData(res.data);
      } catch (e) {
        console.error("Failed to load compare data", e);
        showToast("Error loading market data.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    // Debounce the fetch to prevent spamming the backend when rapidly changing quantity
    const debounce = setTimeout(fetchData, 400); 
    return () => clearTimeout(debounce);
  }, [masterProductId, qty]);

  const handleProductSearch = (newProductId, newQty) => {
    setSearchModalOpen(false);
    setQty(newQty);
    navigate(`?productId=${newProductId}&qty=${newQty}`);
  };

  const showToast = (message, type) => setToast({ show: true, message, type });
  const showErrorPopup = (message) => setErrorPopup({ show: true, message });

  // EMPTY STATE: No Product Selected
  if (!masterProductId && !searchModalOpen) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F8FAFC]">
        <SearchCode size={48} className="text-slate-300 mb-4" />
        <h2 className="text-[20px] font-sora font-bold text-slate-800 mb-2">No Product Selected</h2>
        <button onClick={() => setSearchModalOpen(true)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[14px] font-semibold hover:bg-slate-800 shadow-md transition-all">Search Products to Compare</button>
      </div>
    );
  }

  // LOADING STATE
  if (isLoading && !data && masterProductId) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
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

      <div className="min-h-screen font-inter antialiased selection:bg-pink-100 selection:text-pink-900 flex flex-col w-full overflow-x-hidden relative">
        <ProductSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} onSearch={handleProductSearch} />

        {masterProductId && data && (
          <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-[1440px] mx-auto sm:px-4 lg:px-6 space-y-6 pt-4">
            
            <ProductHeader qty={qty} setQty={setQty} metrics={data.headerMetrics} boundaries={data.marketBoundaries} onNewSearch={() => setSearchModalOpen(true)} onShowError={showErrorPopup} />

            <AiPurchaseIntelligence topSupplier={data.suppliers?.[0]} aiDeals={data.aiVolumeDeals} qty={qty} />

            <SupplierTable onSelect={setSelectedSupplier} qty={qty} suppliers={data.suppliers} />
          
            <motion.div {...fadeUp}>
              <NegotiationCRM qty={qty} metrics={data.headerMetrics} masterProductId={masterProductId} onShowToast={showToast} />
            </motion.div>
            
          </motion.main>
        )}

        <SupplierModal supplier={selectedSupplier} onClose={() => setSelectedSupplier(null)} />
      </div>
    </>
  );
}