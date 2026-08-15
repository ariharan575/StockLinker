import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Clock, MapPin, Star, ShieldCheck, Award, Package, Truck, Building2, LayoutGrid } from 'lucide-react';
import { networkApi } from '../../auth/services/api'; 
import { getSubcategoryImageUrl } from '../utils/imageUtils';
import { CTA_GRAD, fadeUp } from '../utils/constants';

export const SellerCard = ({ supplier, index, userRole, showNotification, onShowMore }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const name = supplier.name || "Unnamed Business";
  const initial = name.charAt(0).toUpperCase();
  const verified = supplier.verification?.includes("Business Verified") || supplier.verificationStatus === "VERIFIED";
  
  const [connectStatus, setConnectStatus] = useState(supplier.connectionStatus || 'NONE');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    setConnectStatus(supplier.connectionStatus || 'NONE');
  }, [supplier.connectionStatus]);

  const handleConnect = async () => {
    if (isConnecting) return; 
    setIsConnecting(true);
    try {
      await networkApi.requestConnection(supplier.id);
      setConnectStatus('PENDING');
      showNotification('success', 'Connection request sent successfully!');

      queryClient.setQueriesData({ queryKey: ['nearbySellers'] }, (oldData) => {
        if (!oldData || !oldData.content) return oldData;
        return {
          ...oldData,
          content: oldData.content.map(s => 
            s.id === supplier.id ? { ...s, connectionStatus: 'PENDING' } : s
          )
        };
      });

      queryClient.invalidateQueries({ queryKey: ['nearbySellers'] });
    } catch (err) { 
      console.error(err); 
      showNotification('error', 'Failed to send connection request.');
    } 
    finally { setIsConnecting(false); }
  };

  const handleMessageClick = () => {
    navigate('/message', {
      state: {
        partnerToMessage: {
          id: supplier.userId || supplier.id,
          name: supplier.name,
          businessName: supplier.category,
          profileImage: null
        }
      }
    });
  };

  const handleViewProfile = () => {
    const profileId = supplier.businessProfileId || supplier.id;
    if (profileId) {
      navigate(`/storefront/${profileId}`);
    } else {
      console.error("Missing business profile reference.");
    }
  };

  const displaySubs = supplier.subCategories?.slice(0 , 5) || [];
  const remainingCount = (supplier.totalSubCategories || 0) - displaySubs.length;

  return (
    <motion.div {...fadeUp(index * 0.05)} className="bg-white border border-slate-200 rounded-[20px] p-3 md:p-4 shadow-sm hover:shadow-md hover:border-slate-300 mb-4 flex flex-col gap-4 relative overflow-hidden group transition-all duration-300 cursor-pointer">
      
      <div className="flex items-start gap-4 md:gap-5 w-full">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl shadow-sm flex items-center justify-center font-['Manrope',_sans-serif] font-extrabold text-2xl text-white border border-pink-100" style={{ background: CTA_GRAD }}>{initial}</div>
          {verified && <div className="absolute -bottom-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow-sm border border-slate-100"><CheckCircle2 size={16} className="text-[#17B26A] fill-[#ECFDF3]" /></div>}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2 w-full mb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-zora text-[16px] sm:text-[18px] font-extrabold text-gray-700 leading-tight transition-colors">{name}</h3>
              {supplier.readyStock && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold border rounded-md bg-amber-50 text-amber-700 border-amber-200 uppercase tracking-widest flex-shrink-0">Ready Stock</span>}
              {connectStatus === 'CONNECTED' && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold border rounded-md bg-[#ECFDF3] text-[#067647] border-[#DCFAE6] uppercase tracking-widest flex-shrink-0">Connected</span>}
            </div>
            
            <div className="flex-shrink-0 text-right mt-0.5 hidden sm:block">
              <p className="text-[12px] font-sora font-medium text-slate-500 flex items-center justify-end gap-1.5 whitespace-nowrap">
                <Clock size={12} className="text-slate-500"/> Replies in {supplier.responseTime || "< 1 hr"}
              </p>
            </div>
          </div>
          
          <p className="text-[13px] text-slate-500 font-sora font-medium mb-2">{supplier.category || "General Business"}</p>
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-2.5 text-[13px]">
            <span className="flex items-center gap-1 font-sora font-medium text-slate-600"><MapPin size={14} className="text-slate-400"/> {supplier.location} ({supplier.distance})</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-black font-extrabold"><Star size={14} className="fill-amber-400 text-amber-400" /> {supplier.rating > 0 ? supplier.rating : "New"} <span className="text-slate-400 font-medium font-['Inter',_sans-serif]">({supplier.reviews || 0})</span></span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="hidden md:flex gap-2">{verified && <span className="flex items-center gap-1.5 text-[#17B26A] font-bold"><ShieldCheck size={14} /> Business Verified</span>}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-row 2xl:mx-[20px] overflow-x-auto no-scrollbar md:grid md:grid-cols-4 gap-5 md:gap-4 py-4 border-y border-slate-100 w-full items-center">
        {userRole === 'SHOPKEEPER' ? (
          <>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max">
              <span className="text-[10px] sm:text-[11px] font-sora font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><Award size={12} className="hidden md:block"/> Experience</span>
              <span className="text-[14px] sm:text-[15px] font-sora font-semibold">{supplier.experience || "New"}</span>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><Package size={12} className="hidden md:block"/> Orders</span>
              <span className="font-['Manrope',_sans-serif] text-[14px] sm:text-[15px] font-sora font-semibold">{supplier.orders || "New"}</span>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><MapPin size={12} className="hidden md:block"/> Delivery Radius</span>
              <span className="font-['Manrope',_sans-serif] text-[14px] sm:text-[15px] font-sora font-semibold">{supplier.deliveryRadius || "Not Set"}</span>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max pr-2 md:pr-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><Truck size={12} className="hidden md:block"/> Est. Delivery</span>
              <span className="font-['Manrope',_sans-serif] text-[14px] sm:text-[15px] font-sora font-semibold">{supplier.deliveryEstimate || "Standard"}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max">
              <span className="text-[10px] sm:text-[11px] font-sora font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><Award size={12} className="hidden md:block"/> Experience</span>
              <span className="text-[14px] sm:text-[15px] font-sora font-semibold">{supplier.experience || "New"}</span>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><Building2 size={12} className="hidden md:block"/> Store Size</span>
              <span className="font-['Manrope',_sans-serif] text-[14px] sm:text-[15px] font-sora font-semibold capitalize">{supplier.storeSize?.toLowerCase() || "Not Set"}</span>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><Clock size={12} className="hidden md:block"/> Store Timing</span>
              <span className="font-['Manrope',_sans-serif] text-[14px] sm:text-[15px] font-sora font-semibold">{supplier.storeTiming || "Not Set"}</span>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max pr-2 md:pr-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><LayoutGrid size={12} className="hidden md:block"/> Categories</span>
              <span className="font-['Manrope',_sans-serif] text-[14px] sm:text-[15px] font-sora font-semibold">{supplier.totalSubCategories ? supplier.totalSubCategories + "+" : "New"}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex gap-2.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 no-scrollbar items-center">
          {displaySubs.map((sub, idx) => {
            const imgUrl = getSubcategoryImageUrl(sub.image) || sub.image;
            return (
              <motion.div key={idx} whileHover={{ y: -2 }} className="relative border border-slate-200 rounded-xl overflow-hidden w-12 h-12 flex-shrink-0 group/prod cursor-pointer shadow-sm">
                {imgUrl ? (
                  <img src={imgUrl} alt={sub.name} className="w-full h-full object-cover transition-transform duration-300 group-hover/prod:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-xs uppercase">{sub.name?.charAt(0)}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/prod:opacity-100 transition-opacity duration-200 flex items-center justify-center p-1">
                  <span className="text-[9px] text-white font-bold text-center leading-tight drop-shadow-md">{sub.name}</span>
                </div>
              </motion.div>
            );
          })}
          {remainingCount > 0 && (
            <div onClick={(e) => { e.stopPropagation(); if(onShowMore) onShowMore(supplier); }} className="border border-dashed border-slate-300 rounded-xl w-12 h-12 flex items-center justify-center text-[12px] text-slate-500 font-extrabold bg-slate-50 flex-shrink-0 cursor-pointer hover:bg-slate-100 transition-colors">
              +{remainingCount}
            </div>
          )}
          {(!displaySubs || displaySubs.length === 0) && <span className="text-[12px] text-slate-400 font-medium italic">No categories linked</span>}
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); handleViewProfile(); }}
            className="flex-1 lg:flex-none inline-flex items-center justify-center px-5 py-2.5 bg-white text-[14px] font-sora font-medium rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all duration-200 active:scale-95 whitespace-nowrap"
          >
            View Profile
          </button>
          
          {connectStatus === 'PENDING' ? (
            <button disabled className="flex-1 lg:flex-none inline-flex items-center justify-center px-6 py-2.5 bg-slate-100 text-slate-500 text-[13px] font-bold rounded-xl border border-slate-200 shadow-inner cursor-not-allowed whitespace-nowrap">Requested</button>
          ) : connectStatus === 'CONNECTED' ? (
            <button 
              onClick={(e) => { e.stopPropagation(); handleMessageClick(); }}
              className="flex-1 lg:flex-none inline-flex items-center justify-center px-6 py-2.5 bg-[#ECFDF3] text-[#067647] border border-[#DCFAE6] text-[13px] font-bold rounded-xl shadow-sm transition-all hover:bg-[#d1fadf] active:scale-95 whitespace-nowrap">
              Message
            </button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); handleConnect(); }} disabled={isConnecting} className="flex-1 lg:flex-none inline-flex items-center justify-center px-6 py-2.5 bg-black text-white text-[13px] font-bold rounded-xl shadow-md hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 whitespace-nowrap">
              {isConnecting ? "Connecting..." : "Connect"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};