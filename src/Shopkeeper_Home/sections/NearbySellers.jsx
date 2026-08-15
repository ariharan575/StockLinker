import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Navigation, Clock, CheckCircle, MapPin, UserPlus, MessageSquare } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import { SectionHead } from '../../layout/common';
import { networkApi } from '../Services/api';
import { fadeUp, CTA_GRAD } from '../../layout/common/constants';
import { PremiumToast } from '../../components/PremiumToast';

// ============================================================
// ✅ PREMIUM SKELETON LOADER
// ============================================================
const NearbySkeleton = () => (
  <div className="w-[260px] xs:w-[280px] sm:w-[300px] lg:w-[340px] shrink-0 bg-white rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 border border-slate-100 shadow-sm animate-pulse space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-slate-200/80 rounded-[12px]" />
      <div className="space-y-2 flex-1"><div className="h-4 bg-slate-200/80 rounded w-3/4" /><div className="h-3 bg-slate-100 rounded w-1/2" /></div>
    </div>
    <div className="h-6 bg-slate-100 rounded-full w-1/3" />
    <div className="flex gap-2"><div className="h-9 bg-slate-200/80 rounded-[10px] flex-1" /><div className="h-9 bg-slate-200/80 rounded-[10px] flex-1" /></div>
  </div>
);

export default function NearbySellers({ onError }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [connectingId, setConnectingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, msg) => {
    setNotification({ type, msg });
  };

  // ✅ TANSTACK QUERY INTEGRATION
  const { 
    data: sellers = [], 
    isLoading, 
    isError,
    error // ✅ Extracted the error object for proper global handling
  } = useQuery({
    queryKey: ['homeNearbySellers'],
    queryFn: async () => {
      // 🚀 FIXED: networkApi already extracts response.data.data
      // So 'payload' here is actually your Array or Spring Boot Page object directly!
      const payload = await networkApi.getNearbySellers();
      
      let sellersArray = [];
      
      // Safely check what kind of data structure the backend returned
      if (Array.isArray(payload)) {
        sellersArray = payload;
      } else if (payload?.content && Array.isArray(payload.content)) {
        sellersArray = payload.content; // If it's a Spring Boot Page<>
      } else if (payload?.data && Array.isArray(payload.data)) {
        sellersArray = payload.data; // Safety fallback
      }
          
      return sellersArray.slice(0, 5); // Return top 5 for the dashboard widget
    },
    staleTime: 5 * 60 * 1000, 
  });

  // ✅ Pass exact error to global handler
  useEffect(() => {
    if (isError && onError) {
      onError(error);
    }
  }, [isError, error, onError]);

  const handleConnect = async (partnerId) => {
    try {
      setConnectingId(partnerId);
      await networkApi.requestConnection(partnerId);
      
      // Update local cache optimistically
      queryClient.setQueryData(['homeNearbySellers'], (old) => 
        old ? old.map(s => s.id === partnerId ? { ...s, connectionStatus: 'PENDING' } : s) : []
      );
      
      showNotification('success', 'Connection request sent successfully!');
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Could not send connection request. Try again.');
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <section className="mb-6 sm:mb-8 md:mb-10 w-full overflow-hidden">
      
      <PremiumToast 
        isVisible={!!notification} 
        type={notification?.type || 'info'} 
        message={notification?.msg} 
        onClose={() => setNotification(null)} 
      />

      <div className="px-1 sm:px-2 md:px-3">
        <SectionHead 
          title="Nearby Sellers" 
          sub="Suppliers within your district delivery zone" 
          action="View All" 
          actionPath="/nearby"
        />
      </div>

      <AnimatePresence mode="wait">
        
        {isLoading && (
          <motion.div 
            key="loading" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="flex flex-row overflow-x-auto no-scrollbar gap-3 sm:gap-4 px-1 sm:px-2 md:px-3 pb-5 pt-1"
          >
            {[...Array(4)].map((_, i) => <NearbySkeleton key={i} />)}
          </motion.div>
        )}

        {/* ✅ WORLD-CLASS SAAS EMPTY STATE */}
        {!isLoading && sellers.length === 0 && !isError && (
          <motion.div 
            key="empty" 
            className="mx-1 sm:mx-2 md:mx-3 my-2 flex flex-col items-center justify-center p-8 sm:p-12 bg-gradient-to-b from-white to-slate-50 rounded-[16px] sm:rounded-[20px] border border-slate-200 text-center shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-20" />
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white flex items-center justify-center mb-4 sm:mb-5 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
              <div className="absolute inset-0 bg-slate-100/50 rounded-2xl animate-pulse" />
              <MapPin className="w-8 h-8 text-slate-300 relative z-10" />
            </div>
            <h3 className="text-[16px] sm:text-[18px] font-sora font-extrabold text-slate-800 mb-2 tracking-tight">No Nearby Sellers Found</h3>
            <p className="text-[13px] sm:text-[14px] font-inter text-slate-500 max-w-md mb-6 sm:mb-8 leading-relaxed">There are currently no active wholesalers registered in your district zone. Expand your radar or check back soon.</p>
            <button 
              onClick={() => navigate('/nearby')}
              className="px-6 sm:px-8 py-3 text-[12px] sm:text-[13px] font-sora font-bold text-white rounded-[12px] sm:rounded-[14px] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              style={{ background: CTA_GRAD }}
            >
              Explore Full Network Directory
            </button>
          </motion.div>
        )}

        {/* SUCCESS DATA RENDERING */}
        {!isLoading && sellers.length > 0 && (
          <motion.div 
            key="content" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-row overflow-x-auto no-scrollbar gap-3 sm:gap-4 px-1 sm:px-2 md:px-3 pb-6 pt-2"
          >
            {sellers.map((s, i) => (
              <motion.div
                key={s.id}
                {...fadeUp(i * 0.05)}
                whileHover={{ y: -4, shadow: "0 15px 35px -5px rgba(15,23,42,0.08)" }}
                className="w-[260px] xs:w-[280px] sm:w-[300px] lg:w-[340px] shrink-0 bg-white rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 border border-slate-200 transition-all shadow-sm hover:border-slate-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-3 w-full">
                      <img src={s.avatar} alt={s.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-[10px] sm:rounded-[12px] object-cover shadow-sm flex-shrink-0 bg-slate-50 border border-slate-100" />
                      <div className="flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-[13px] sm:text-[15px] font-sora font-bold text-slate-900 truncate">{s.name}</p>
                          {s.verification?.length > 0 && <CheckCircle style={{ width: 14, height: 14, color: "#10B981" }} className="shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star style={{ width: 12, height: 12, fill: "#FBBF24", color: "#FBBF24" }} />
                          <span className="text-[10px] sm:text-[11px] font-sora font-semibold text-slate-700">{s.rating}</span>
                          <span className="text-[10px] sm:text-[11px] font-inter text-slate-400 truncate">({s.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
                    <div className="flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-[6px] bg-slate-50 border border-slate-100 shrink-0">
                      <Navigation size={10} className="text-slate-500" />
                      <span className="text-[9px] sm:text-[10px] font-sora font-semibold text-slate-600">{s.distance || 'Local'}</span>
                    </div>
                    <span className="px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-sora font-semibold rounded-[6px] bg-pink-50 border border-pink-100 text-pink-600 truncate max-w-[100px]">
                      {s.category}
                    </span>
                    {s.readyStock && (
                      <span className="px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-sora font-semibold rounded-[6px] bg-amber-50 border border-amber-100 text-amber-600 whitespace-nowrap">
                        Ready Stock
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-[10px] p-2.5 sm:p-3 mb-4 space-y-1.5 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-[11px] font-inter text-slate-500 flex items-center gap-1.5">
                        <MessageSquare size={12} className="text-slate-400"/> Response:
                      </span>
                      <strong className="text-[10px] sm:text-[11px] font-sora font-semibold text-slate-700">{s.responseTime}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-[11px] font-inter text-slate-500 flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-400"/> Est. Delivery:
                      </span>
                      <strong className="text-[10px] sm:text-[11px] font-sora font-semibold text-slate-700">{s.deliveryEstimate}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/storefront/${s.businessProfileId || s.id}`)}
                    className="flex-1 flex items-center justify-center py-2 sm:py-2.5 text-[11px] sm:text-[13px] font-sora font-bold rounded-[10px] border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm active:scale-95"
                  >
                    View Profile
                  </button>
                  
                  {s.connectionStatus === 'CONNECTED' ? (
                    <button className="flex-1 py-2 sm:py-2.5 text-[11px] sm:text-[13px] font-sora font-bold text-emerald-600 rounded-[10px] bg-emerald-50 border border-emerald-100 cursor-default">
                      Connected
                    </button>
                  ) : s.connectionStatus === 'PENDING' ? (
                    <button className="flex-1 py-2 sm:py-2.5 text-[11px] sm:text-[13px] font-sora font-bold text-slate-500 rounded-[10px] bg-slate-50 border border-slate-200 cursor-default">
                      Requested
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleConnect(s.id)}
                      disabled={connectingId === s.id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 text-[11px] sm:text-[13px] font-sora font-bold text-white rounded-[10px] bg-slate-900 hover:bg-black transition-all shadow-sm active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                    >
                      <UserPlus size={14} /> {connectingId === s.id ? 'Sending...' : 'Connect'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}