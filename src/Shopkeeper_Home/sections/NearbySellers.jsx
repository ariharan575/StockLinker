import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Navigation, Clock, CheckCircle, MapPin, UserPlus, MessageSquare } from 'lucide-react';
import { SectionHead } from '../../Layout/common';
import { networkApi } from '../Services/api';
import { fadeUp, CTA_GRAD } from '../../Layout/common/constants';

// --- PREMIUM TOAST ADDED ---
import { PremiumToast } from '../../Components/PremiumToast';

export default function NearbySellers({ onError }) {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectingId, setConnectingId] = useState(null);

  // Toast Notification State
  const [notification, setNotification] = useState(null);

  const showNotification = (type, msg) => {
    setNotification({ type, msg });
  };

  useEffect(() => {
    let isMounted = true;
    const fetchNearby = async () => {
      try {
        setIsLoading(true);
        const data = await networkApi.getNearbySellers();
        if (isMounted) setSellers(data.slice(0, 5));
      } catch (err) {
        if (isMounted && onError) onError(); // Trigger Full Page Error
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchNearby();
    return () => { isMounted = false; };
  }, [onError]);

  const handleConnect = async (partnerId) => {
    try {
      setConnectingId(partnerId);
      await networkApi.sendConnectionRequest(partnerId);
      setSellers(prev => prev.map(s => s.id === partnerId ? { ...s, connectionStatus: 'PENDING' } : s));
      showNotification('success', 'Connection request sent successfully!');
    } catch (err) {
      showNotification('error', 'Could not send connection request. Try again.');
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <section className="mb-6 sm:mb-8 md:mb-10 w-full overflow-hidden">
      
      {/* PREMIUM TOAST */}
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
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[260px] xs:w-[280px] sm:w-[300px] lg:w-[340px] shrink-0 bg-white rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 border border-slate-100 shadow-sm animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-[12px]" />
                  <div className="space-y-2 flex-1"><div className="h-4 bg-slate-200 rounded w-3/4" /><div className="h-3 bg-slate-200 rounded w-1/2" /></div>
                </div>
                <div className="h-6 bg-slate-100 rounded-full w-1/3" />
                <div className="flex gap-2"><div className="h-9 bg-slate-200 rounded-[10px] flex-1" /><div className="h-9 bg-slate-200 rounded-[10px] flex-1" /></div>
              </div>
            ))}
          </motion.div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && sellers.length === 0 && (
          <motion.div 
            key="empty" 
            className="mx-1 sm:mx-2 md:mx-3 my-2 flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-[16px] sm:rounded-[20px] border-2 border-dashed border-slate-200 text-center shadow-sm"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full sm:rounded-[16px] bg-slate-50 flex items-center justify-center mb-3 sm:mb-4 border border-slate-100">
              <MapPin className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-[14px] sm:text-[16px] font-sora font-bold text-slate-800 mb-1">No Nearby Sellers Found</h3>
            <p className="text-[12px] sm:text-[13px] font-inter text-slate-500 max-w-sm mb-4 sm:mb-5">There are currently no active wholesalers registered in your district zone. Expand your radar or check back soon.</p>
            <button 
              onClick={() => navigate('/nearby')}
              className="px-5 sm:px-6 py-2.5 text-[11px] sm:text-[12px] font-sora font-bold text-white rounded-[10px] sm:rounded-[12px] shadow-sm transition-transform active:scale-95"
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