import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ShieldCheck, Users, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query'; // --- ADDED TANSTACK QUERY ---
import { SectionHead } from '../../layout/common';
import { networkApi } from '../Services/api';
import { fadeUp } from '../../layout/common/constants';

// ============================================================
// ✅ PREMIUM SKELETON LOADER
// ============================================================
const TrustedSkeleton = () => (
  <div className="w-[260px] xs:w-[280px] sm:w-[300px] lg:w-[340px] shrink-0 bg-white rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 border border-slate-100 shadow-sm animate-pulse space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-slate-200/80 rounded-[12px]" />
      <div className="space-y-2 flex-1"><div className="h-4 bg-slate-200/80 rounded w-3/4" /><div className="h-3 bg-slate-100 rounded w-1/2" /></div>
    </div>
    <div className="h-6 bg-slate-100 rounded-full w-1/3" />
    <div className="flex gap-2"><div className="h-9 bg-slate-200/80 rounded-[10px] flex-1" /><div className="h-9 bg-slate-200/80 rounded-[10px] flex-1" /></div>
  </div>
);

export default function TrustedSuppliers({ onError }) {
  const navigate = useNavigate();

  // ✅ TANSTACK QUERY INTEGRATION
  const { 
    data: connectedSuppliers = [], 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['homeConnectedSuppliers'],
    queryFn: async () => {
      return await networkApi.getConnectedSuppliers();
    },
    staleTime: 5 * 60 * 1000, 
  });

  useEffect(() => {
    if (isError && onError) {
      onError();
    }
  }, [isError, onError]);

  const handleMessageClick = (supplier) => {
    navigate('/message', {
      state: { partnerToMessage: { id: supplier.userId || supplier.id, name: supplier.name, businessName: supplier.category, profileImage: null } }
    });
  };

  return (
    <section className="mb-6 sm:mb-8 md:mb-10 w-full overflow-hidden">
      
      <div className="px-1 sm:px-2 md:px-3">
        <SectionHead 
          title="Trusted & Connected Suppliers" 
          sub="Your personal verified partner network" 
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
            {[...Array(4)].map((_, i) => <TrustedSkeleton key={i} />)}
          </motion.div>
        )}

        {/* ✅ WORLD-CLASS SAAS EMPTY STATE */}
        {!isLoading && connectedSuppliers.length === 0 && !isError && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-1 sm:mx-2 md:mx-3 my-2 bg-gradient-to-b from-white to-slate-50 rounded-[16px] sm:rounded-[24px] p-8 sm:p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-20" />
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] bg-white flex items-center justify-center mb-4 sm:mb-5 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
              <div className="absolute inset-0 bg-slate-100/50 rounded-[20px] animate-pulse" />
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300 relative z-10" />
            </div>
            <h3 className="text-[16px] sm:text-[20px] font-sora font-extrabold text-slate-800 mb-2 tracking-tight">No Connected Suppliers Yet</h3>
            <p className="text-[13px] sm:text-[14px] font-inter text-slate-500 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed">
              Connect with trusted wholesalers in your district to build your secure supply chain and unlock exclusive merchant pricing deals.
            </p>
            <button 
              onClick={() => navigate('/nearby')} 
              className="px-8 sm:px-10 py-3 sm:py-3.5 text-[13px] sm:text-[14px] font-sora font-bold text-white bg-black hover:bg-slate-800 rounded-[12px] sm:rounded-[14px] transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              Find & Connect Suppliers
            </button>
          </motion.div>
        )}

        {/* SUCCESS DATA RENDERING */}
        {!isLoading && connectedSuppliers.length > 0 && (
          <motion.div 
            key="content" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-row overflow-x-auto no-scrollbar gap-3 sm:gap-4 px-1 sm:px-2 md:px-3 pb-6 pt-2"
          >
            {connectedSuppliers.map((s, i) => (
              <motion.div
                key={s.id}
                {...fadeUp(i * 0.05)}
                whileHover={{ y: -4, shadow: "0 15px 35px -5px rgba(15,23,42,0.08)" }}
                className="w-[260px] xs:w-[280px] sm:w-[300px] lg:w-[340px] shrink-0 bg-white rounded-[16px] sm:rounded-[20px] p-3.5 sm:p-5 border border-slate-200 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-3 w-full">
                      <img src={s.avatar} alt={s.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-[10px] sm:rounded-[12px] object-cover shadow-sm flex-shrink-0 bg-slate-50 border border-slate-100" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] sm:text-[15px] font-sora font-bold text-slate-900 truncate mb-0.5">{s.name}</p>
                        <p className="text-[10px] sm:text-[11px] font-inter font-medium text-slate-500 truncate">{s.location} <span className="text-slate-300 mx-0.5">•</span> Verified Partner</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4">
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-emerald-50/80 border border-emerald-100 text-emerald-600 text-[10px] sm:text-[11px] font-sora font-semibold">
                      <ShieldCheck size={12} /> Connected
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                    <span className="px-2 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-inter font-semibold rounded-[6px] bg-rose-50 text-rose-600 border border-rose-100">
                      {s.category}
                    </span>
                    <span className="px-2 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-inter font-semibold rounded-[6px] bg-slate-50 text-slate-600 border border-slate-200">
                      {s.responseTime} response
                    </span>
                  </div>

                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/storefront/${s.businessProfileId || s.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-sora font-bold rounded-[8px] sm:rounded-[10px] border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm active:scale-95"
                  >
                    <ExternalLink size={13} /> View Profile
                  </button>
                  <button 
                    onClick={() => handleMessageClick(s)} 
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-sora font-bold rounded-[8px] sm:rounded-[10px] text-white bg-slate-900 hover:bg-black transition-colors shadow-sm active:scale-95"
                  >
                    <MessageSquare size={13} /> Chat
                  </button>
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