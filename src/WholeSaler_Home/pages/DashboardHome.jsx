import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, RefreshCw, Package, Truck, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query"; // --- ADDED TANSTACK QUERY ---

import ProductTable from "../components/ProductTable";
import InquirySection from "../components/InquirySection";
import OrdersTable from "../components/OrdersTable";
import { SkeletonCard, SkeletonRow } from "../components/Skeleton";
import useDashboardData from "../hooks/useDashboardData";
import NearbyBuyersSection from "../components/NearbyBuyersSection";
import Footer from '../../Layout/Footer';
import QuickAction from '../../Shopkeeper_Home/sections/QuickActions';
import WholesalerHero from '../components/HeroSection'; 

import { dashboardApi } from '../../Shopkeeper_Home/Services/api';
import { useAuth } from '../../Authentication/context/AuthContext';
import { DataFetchError } from "../../components/DataFetchError";
import { PremiumToast } from "../../components/PremiumToast";

// ============================================================================
// 🌍 WORLD-CLASS GLOBAL NETWORK ERROR STATE (PREMIUM SAAS DESIGN)
// ============================================================================
const GlobalNetworkState = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setTimeout(() => setIsOffline(false), 800);
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
            className="relative w-full max-w-[420px] bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden text-center"
          >
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-pink-400/20 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-rose-400/20 rounded-full blur-[40px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative w-20 h-20 rounded-[24px] bg-slate-50 flex items-center justify-center mb-6 shadow-[0_8px_16px_rgba(0,0,0,0.04)] border border-slate-100">
                <div className="absolute inset-0 bg-pink-500/10 rounded-[24px] animate-pulse" />
                <WifiOff className="w-10 h-10 text-pink-500 relative z-10" strokeWidth={2} />
              </div>

              <h2 className="text-[22px] sm:text-[24px] font-sora font-extrabold text-slate-900 mb-3 tracking-tight">
                Connection Lost
              </h2>
              <p className="text-[13px] sm:text-[14px] font-inter text-slate-500 mb-8 leading-relaxed max-w-[280px]">
                It seems your network failed or you are offline. We couldn't fetch the latest data. Please check your internet connection.
              </p>

              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-[16px] text-[14px] sm:text-[15px] font-sora font-bold text-white transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.3)] hover:shadow-[0_12px_24px_-8px_rgba(15,23,42,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-80 disabled:pointer-events-none"
                style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}
              >
                <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                {isRetrying ? 'Reconnecting...' : 'Retry Connection'}
              </button>

              <button 
                onClick={() => setIsOffline(false)} 
                disabled={isRetrying}
                className="mt-5 text-[12px] sm:text-[13px] font-inter font-semibold text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
              >
                Continue offline (Limited features)
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
// ============================================================================

function DashboardHome() {
  const { profileData } = useAuth();
  
  const { isLoading: isMockLoading, products: initialProducts, orders, orderTabs, enquiries, error: dashboardError } = useDashboardData();
  const [products, setProducts] = useState(initialProducts);

  const [hasGlobalError, setHasGlobalError] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleFetchFailure = () => {
    setHasGlobalError(true);
  };

  const showNotification = (type, msg) => {
    setNotification({ type, msg });
  };

  useEffect(() => {
    if (dashboardError) handleFetchFailure();
  }, [dashboardError]);

  useEffect(() => {
    if (initialProducts) setProducts(initialProducts);
  }, [initialProducts]);

  // ✅ TANSTACK QUERY INTEGRATION FOR KPIs
  const { data: welcomeData = { activeProducts: 0, fulfilledOrders: 0, recentEnquiries: 0 } } = useQuery({
    queryKey: ['dashboardWelcomeKpis'],
    queryFn: async () => {
      const data = await dashboardApi.getWelcomeInfo();
      return {
        activeProducts: data?.activeProducts || 0,
        fulfilledOrders: data?.fulfilledOrders || 0,
        recentEnquiries: data?.recentEnquiries || 0
      };
    },
    staleTime: 5 * 60 * 1000, 
  });

  const mappedKpis = [
    { label: "Products", value: welcomeData.activeProducts.toLocaleString(), icon: Package },
    { label: "Orders", value: welcomeData.fulfilledOrders.toLocaleString(), icon: Truck },
    { label: "Enquiries", value: welcomeData.recentEnquiries.toLocaleString(), icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-inter">
      <GlobalNetworkState />

      <PremiumToast 
        isVisible={!!notification} 
        type={notification?.type || 'info'} 
        message={notification?.msg} 
        onClose={() => setNotification(null)} 
      />

      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 sm:gap-8 lg:gap-10 px-2 ">
        {hasGlobalError ? (
          <DataFetchError onRetry={() => window.location.reload()} />
        ) : (
          <>
            <WholesalerHero userName={profileData?.ownerName || "Loading..."} kpis={mappedKpis} />
            <QuickAction/>
            
            <div>
              {isMockLoading ? (
                <div className="space-y-4 border border-gray-100 rounded-xl p-4">
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
                </div>
              ) : (
                <ProductTable products={products} setProducts={setProducts} onError={handleFetchFailure} showNotification={showNotification} />
              )}
            </div>

            <div>
              <InquirySection onError={handleFetchFailure} showNotification={showNotification} />
            </div>

            <div>
              <OrdersTable onError={handleFetchFailure} showNotification={showNotification} />
            </div>

            <div>
              <NearbyBuyersSection onError={handleFetchFailure} showNotification={showNotification} />
            </div>
          </>
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default DashboardHome;