import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ShieldCheck, Users, ExternalLink } from 'lucide-react';
import { SectionHead } from '../../Layout/common';
import { networkApi } from '../Services/api';
import { fadeUp } from '../../Layout/common/constants';

export default function TrustedSuppliers({ onError }) {
  const navigate = useNavigate();
  const [connectedSuppliers, setConnectedSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchConnected = async () => {
      try {
        setIsLoading(true);
        const data = await networkApi.getConnectedSuppliers();
        if (isMounted) setConnectedSuppliers(data);
      } catch (err) {
        if (isMounted && onError) onError(); // Trigger Full Page Error
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchConnected();
    return () => { isMounted = false; };
  }, [onError]);

    const handleMessageClick = () => {
    navigate('/message', {
      state: { partnerToMessage: { id: connectedSuppliers.userId || connectedSuppliers.id, name: connectedSuppliers.name, businessName: connectedSuppliers.category, profileImage: null } }
    });
  };

  return (
    <section className="mb-6 sm:mb-8 md:mb-10 w-full overflow-hidden">
      
      <div className="px-1 sm:px-2 md:px-3">
        <SectionHead 
          title="Trusted & Connected Suppliers" 
          sub="Your personal verified partner network" 
          action="Browse Network" 
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
              <div 
                key={i} 
                className="w-[260px] xs:w-[280px] sm:w-[300px] lg:w-[340px] shrink-0 bg-white rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 border border-slate-100 shadow-sm animate-pulse space-y-4"
              >
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
        {!isLoading && connectedSuppliers.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-1 sm:mx-2 md:mx-3 my-2 bg-white rounded-[16px] sm:rounded-[24px] p-8 sm:p-12 text-center border-2 border-dashed border-slate-200 shadow-sm flex flex-col items-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[16px] bg-slate-50 flex items-center justify-center mb-3 sm:mb-4 border border-slate-100">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400" />
            </div>
            <h3 className="text-[15px] sm:text-[17px] font-sora font-bold text-slate-900 mb-1.5">No Connected Suppliers Yet</h3>
            <p className="text-[12px] sm:text-[13px] font-inter text-slate-500 mb-5 sm:mb-6 max-w-sm mx-auto leading-relaxed">
              Connect with trusted wholesalers in your district to build your secure supply chain and unlock exclusive merchant pricing deals.
            </p>
            <button 
              onClick={() => navigate('/nearby')} 
              className="px-6 sm:px-8 py-2.5 sm:py-3 text-[12px] sm:text-[13px] font-sora font-bold text-white bg-slate-900 hover:bg-black rounded-[10px] sm:rounded-[12px] transition-all shadow-md active:scale-95"
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
                    onClick={handleMessageClick} 
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