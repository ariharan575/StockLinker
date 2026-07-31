import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Phone, MessageSquare, ShieldCheck, AlertCircle, Users } from 'lucide-react';
import { SectionHead } from '../../Layout/common';
import { networkApi } from '../Services/api';
import { CTA_GRAD, C, SHADOW } from '../../Layout/common/constants';

export default function TrustedSuppliers() {
  const navigate = useNavigate();
  const [connectedSuppliers, setConnectedSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchConnected = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await networkApi.getConnectedSuppliers();
        if (isMounted) setConnectedSuppliers(data);
      } catch (err) {
        if (isMounted) setError("Failed to sync connected supplier networks.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchConnected();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="mb-8">
      <SectionHead title="Trusted & Connected Suppliers" sub="Your personal verified partner network" action="Browse Network" />

      <AnimatePresence mode="wait">
        {/* LOADING SKELETONS */}
        {isLoading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse space-y-3">
                <div className="flex gap-3"><div className="w-12 h-12 bg-slate-200 rounded-xl" /><div className="space-y-2 flex-1"><div className="h-3 bg-slate-200 rounded w-3/4" /><div className="h-2 bg-slate-200 rounded w-1/2" /></div></div>
                <div className="h-7 bg-slate-100 rounded-full w-1/4" />
                <div className="flex gap-2"><div className="h-8 bg-slate-200 rounded flex-1" /><div className="h-8 bg-slate-200 rounded flex-1" /></div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ERROR STATE */}
        {!isLoading && error && (
          <motion.div key="error" className="p-6 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-semibold">{error}</span>
          </motion.div>
        )}

        {/* EMPTY STATE (TRIGGERED WHEN NO CONNECTIONS EXIST) */}
        {!isLoading && !error && connectedSuppliers.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-12 text-center"
            style={{ border: `2px dashed ${C.bdr}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: C.bLight }}>
              <Users style={{ width: 28, height: 28, color: C.brand }} />
            </div>
            <h3 className="text-base font-bold mb-2" style={{ color: C.head }}>No Connected Suppliers Yet</h3>
            <p className="text-sm mb-6 max-w-sm mx-auto leading-relaxed" style={{ color: C.muted }}>
              Connect with trusted wholesalers in your district to build your secure supply chain and unlock exclusive merchant pricing deals.
            </p>
            <button 
              onClick={() => navigate('/nearby')} 
              className="px-7 py-2.5 text-sm font-bold text-white rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95 shadow-md cursor-pointer"
              style={{ background: CTA_GRAD, boxShadow: SHADOW.glow }}
            >
              Find & Connect Suppliers
            </button>
          </motion.div>
        )}

        {/* SUCCESS DATA RENDERING */}
        {!isLoading && !error && connectedSuppliers.length > 0 && (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedSuppliers.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 shadow-sm"
                style={{ boxShadow: SHADOW.sm, border: "1px solid rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0 bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: C.head }}>{s.name}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{s.location} • Verified Partner</p>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold bg-emerald-50 text-emerald-600 flex items-center gap-1">
                    <ShieldCheck size={12} /> Connected
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-rose-50 text-rose-600">
                    {s.category}
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 text-slate-600">
                    {s.responseTime} response
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition">
                    <Phone size={13} /> Call
                  </button>
                  <button onClick={() => navigate('/message')} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition">
                    <MessageSquare size={13} /> Chat
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}