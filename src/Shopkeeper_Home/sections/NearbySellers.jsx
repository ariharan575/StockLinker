import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Navigation, Phone, MessageSquare, Clock, CheckCircle, AlertCircle, MapPin, UserPlus } from 'lucide-react';
import { SectionHead } from '../common';
import { networkApi } from '../Services/api';
import { fadeUp, CTA_GRAD, C } from '../common/constants';

export default function NearbySellers() {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectingId, setConnectingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchNearby = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await networkApi.getNearbySellers();
        if (isMounted) setSellers(data.slice(0, 3)); // Show top 3 on homepage
      } catch (err) {
        if (isMounted) setError("Failed to load nearby sellers in your district.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchNearby();
    return () => { isMounted = false; };
  }, []);

  const handleConnect = async (partnerId) => {
    try {
      setConnectingId(partnerId);
      await networkApi.sendConnectionRequest(partnerId);
      // Update local connection state to reflect pending status
      setSellers(prev => prev.map(s => s.id === partnerId ? { ...s, connectionStatus: 'PENDING' } : s));
    } catch (err) {
      alert("Could not send connection request. Try again.");
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <section className="mb-8">
      <SectionHead title="Nearby Sellers" sub="Suppliers within your district delivery zone" action="View All" />

      <AnimatePresence mode="wait">
        {/* LOADING SKELETONS */}
        {isLoading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                  <div className="space-y-2 flex-1"><div className="h-4 bg-slate-200 rounded w-3/4" /><div className="h-3 bg-slate-200 rounded w-1/2" /></div>
                </div>
                <div className="h-6 bg-slate-100 rounded-full w-1/3" />
                <div className="flex gap-2"><div className="h-9 bg-slate-200 rounded flex-1" /><div className="h-9 bg-slate-200 rounded flex-1" /></div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ERROR STATE */}
        {!isLoading && error && (
          <motion.div key="error" className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-2xl border border-red-100 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </motion.div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !error && sellers.length === 0 && (
          <motion.div key="empty" className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
              <MapPin className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No Nearby Sellers Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-5">There are currently no active wholesalers registered in your district zone. Expand your radar or check back soon.</p>
            <button 
              onClick={() => navigate('/nearby')}
              className="px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-sm transition-transform active:scale-95"
              style={{ background: CTA_GRAD }}
            >
              Explore Full Network Directory
            </button>
          </motion.div>
        )}

        {/* SUCCESS DATA RENDERING */}
        {!isLoading && !error && sellers.length > 0 && (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sellers.map((s, i) => (
              <motion.div
                key={s.id}
                {...fadeUp(i * 0.09)}
                whileHover={{ y: -4, boxShadow: "0 18px 45px rgba(15,23,42,0.12)" }}
                className="bg-white rounded-2xl p-5 border border-slate-100 transition-all shadow-[0_8px_25px_rgba(15,23,42,0.06)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0 bg-slate-100" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                          {s.verification?.length > 0 && <CheckCircle style={{ width: 14, height: 14, color: "#22C55E" }} />}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star style={{ width: 11, height: 11, fill: "#FBBF24", color: "#FBBF24" }} />
                          <span className="text-xs font-semibold text-slate-700">{s.rating}</span>
                          <span className="text-xs text-slate-400">({s.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100">
                      <Navigation style={{ width: 12, height: 12, color: "#64748B" }} />
                      <span className="text-xs font-semibold text-slate-600">{s.distance || 'Local'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-rose-50 text-rose-600">
                      {s.category}
                    </span>
                    {s.readyStock && (
                      <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-600">
                        Ready Stock
                      </span>
                    )}
                  </div>

                  <p className="text-xs mb-3 text-slate-400">Response time: <strong className="text-slate-600">{s.responseTime}</strong></p>

                  <div className="flex items-center gap-1.5 mb-4">
                    <Clock style={{ width: 13, height: 13, color: "#94A3B8" }} />
                    <span className="text-xs text-slate-400">Delivery Estimate:</span>
                    <span className="text-xs font-semibold text-slate-700">{s.deliveryEstimate}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-50">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition">
                    <Phone size={13} /> Call
                  </button>
                  {s.connectionStatus === 'CONNECTED' ? (
                    <button className="flex-1 py-2 text-xs font-bold text-white rounded-lg bg-emerald-600 shadow-sm cursor-default">
                      Connected
                    </button>
                  ) : s.connectionStatus === 'PENDING' ? (
                    <button className="flex-1 py-2 text-xs font-bold text-slate-500 rounded-lg bg-slate-100 cursor-default">
                      Requested
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleConnect(s.id)}
                      disabled={connectingId === s.id}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold text-white rounded-lg transition hover:opacity-90 shadow-sm" 
                      style={{ background: CTA_GRAD }}
                    >
                      <UserPlus size={13} /> {connectingId === s.id ? 'Sending...' : 'Connect'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}