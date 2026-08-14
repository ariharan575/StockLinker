import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, MessageCircle, Zap, Package, Boxes } from 'lucide-react';
import { inr } from '../config/constants';
import { FloatingSurface, GradientButton } from './SharedComponents';

export default function AiPurchaseIntelligence({ topSupplier, aiDeals, qty }) {
  const navigate = useNavigate();

  const handleMessageClick = (partner) => {
    if (!partner) return;
    navigate('/message', {
      state: {
        partnerToMessage: {
          id: partner.userId || partner.id,
          name: partner.name || partner.businessName,
          businessName: partner.category || partner.businessName,
          profileImage: null
        }
      }
    });
  };

  const handleViewProfile = (partner) => {
    if (!partner) return;
    const profileId = partner.businessProfileId || partner.id;
    if (profileId) {
      navigate(`/storefront/${profileId}`);
    } else {
      console.error("Missing business profile reference.");
    }
  };

  if (!topSupplier && (!aiDeals || aiDeals.length === 0)) return null;

  return (
    <div className="w-full mb-8 sm:mb-10 mx-2 lg:mb-12">
      <h2 className="text-[18px] sm:text-[20px] lg:text-[22px] font-sora font-bold text-[#0F172A] leading-tight tracking-[-0.02em] mb-4 sm:mb-5 px-1">
        AI Purchase Intelligence
      </h2>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-5 w-full">
        
        {/* =========================================
            LEFT COLUMN: Top 1 Winner (1/3 Width)
            ========================================= */}
        <FloatingSurface className="hidden lg:block xl:col-span-1 p-4 sm:p-5 lg:p-6 flex flex-col justify-between bg-white border border-slate-200 shadow-sm sm:rounded-[16px] overflow-hidden">
          
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[6px] sm:rounded-lg text-[9px] sm:text-[10px] font-sora font-bold uppercase tracking-[0.10em] bg-pink-50 text-pink-700 border border-pink-100 shadow-sm">
              <Zap size={10} className="fill-pink-500 text-pink-500" /> #1 BEST DEAL
            </span>
            <span className="text-[9px] sm:text-[10px] font-inter font-bold tracking-[0.08em] uppercase text-slate-500 px-2 sm:px-2.5 py-1 sm:py-1.5 border border-slate-200 rounded-[6px] sm:rounded-lg bg-slate-50">
              {qty} UNITS
            </span>
          </div>

          {topSupplier ? (
            <>
              <div className="mb-4 sm:mb-5">
                <h3 className="text-[18px] sm:text-[20px] font-sora font-bold text-[#0F172A] mb-1.5 leading-tight truncate">
                  {topSupplier.businessName}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <div className="flex items-center gap-1 text-[11px] sm:text-[12px] font-inter font-medium text-slate-500">
                    <MapPin size={12} className="text-slate-400" /> {topSupplier.locationDistrict}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] sm:text-[12px] font-inter font-medium text-slate-500">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" /> 
                    <span className="font-bold text-slate-700">{topSupplier.rating}</span> 
                    ({topSupplier.trustScore} Trust)
                  </div>
                </div>
              </div>

              {/* Condensed Price Box */}
              <div className="mb-4 sm:mb-5 bg-slate-50/80 border border-slate-200 rounded-[12px] p-3 sm:p-4 flex flex-col justify-center transition-colors hover:bg-slate-50">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.08em] text-slate-500 font-bold mb-1 sm:mb-1.5">
                  Calculated Total Price
                </p>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mb-1.5">
                  <span className="text-[24px] sm:text-[28px] font-sora font-[800] text-[#0F172A] tracking-tight leading-none">
                    {inr(topSupplier.calculatedTotalPrice)}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] font-inter text-slate-500 font-medium">
                  Base: {inr(topSupplier.basePricePerUnit)} / unit
                </p>
              </div>

              <div className="mt-auto flex items-center gap-2 sm:gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleMessageClick(topSupplier); }}
                  className="flex-[0.7] h-[38px] sm:h-[42px] bg-slate-900 text-white rounded-[10px] text-[12px] sm:text-[13px] font-inter font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle size={14} /> Chat
                </button>
                <GradientButton 
                  onClick={(e) => { e.stopPropagation(); handleViewProfile(topSupplier); }} 
                  className="flex-[1.3] h-[38px] sm:h-[42px] rounded-[10px] text-[12px] sm:text-[13px]"
                >
                  View Profile
                </GradientButton>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-[12px] sm:text-[13px] font-inter text-center p-4">
              No valid suppliers found for this exact quantity.
            </div>
          )}
        </FloatingSurface>

        {/* =========================================
            RIGHT COLUMN: Volume Upsell Intelligence (2/3 Width)
            ========================================= */}
        <FloatingSurface className="xl:col-span-2 p-4 sm:p-5 lg:p-6 flex flex-col bg-white border border-slate-200 shadow-sm sm:rounded-[16px]">
          
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-[12px] sm:rounded-[14px] bg-pink-50 flex items-center justify-center border border-pink-100 shadow-sm">
              <Package size={18} className="text-pink-600 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-[16px] sm:text-[18px] lg:text-[20px] font-sora font-bold text-[#0F172A] leading-tight tracking-[-0.02em]">
                Volume Upsell Intelligence
              </h3>
              <p className="text-[11px] sm:text-[13px] font-inter text-slate-500 mt-0.5 sm:mt-1 leading-tight">
                Scale your order quantity to unlock massive discounts & extra units.
              </p>
            </div>
          </div>

          <div className="space-y-2.5 sm:space-y-3 flex-1 flex flex-col">
            {aiDeals?.length > 0 ? aiDeals.map((deal) => (
              <div 
                key={deal.rank} 
                onClick={(e) => { e.stopPropagation(); handleViewProfile(deal); }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3 p-3 sm:p-4 rounded-[12px] bg-white border border-slate-200 shadow-sm hover:border-pink-300 hover:shadow-md transition-all group cursor-pointer hover:-translate-y-[1px]"
              >
                
                {/* Section 1: Rank & Supplier Info */}
                <div className="flex items-center justify-between w-full md:w-[220px] lg:w-[260px] shrink-0">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-[6px] sm:rounded-[8px] bg-slate-900 text-white font-sora font-bold flex items-center justify-center text-[10px] sm:text-[11px] shadow-sm">
                      {deal.rank}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-[13px] sm:text-[14px] font-sora font-bold text-[#0F172A] leading-none group-hover:text-pink-600 transition-colors truncate max-w-[140px] sm:max-w-[180px]">
                        {deal.businessName}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] font-inter text-slate-500 mt-1 flex items-center gap-0.5">
                        <Star size={10} className="text-yellow-500 fill-yellow-500" /> {deal.rating} <span className="mx-0.5">•</span> <span className="truncate max-w-[80px] sm:max-w-[100px]">{deal.location}</span>
                      </p>
                    </div>
                  </div>
                  {/* Extra Units Badge (Visible on Mobile inside top row) */}
                  <div className="md:hidden">
                    <span className="text-[9px] sm:text-[10px] font-sora font-bold text-pink-700 bg-pink-50 border border-pink-100 px-2 py-1 rounded-[6px] flex items-center gap-1 shadow-sm whitespace-nowrap">
                      <Boxes size={10} /> +{deal.extraQuantityGained} Extra
                    </span>
                  </div>
                </div>
                
                {/* Section 2: Highly Condensed Metrics Data (1 Row) */}
                <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-4 md:gap-6 w-full bg-slate-50 md:bg-transparent p-2 sm:p-0 rounded-[8px] md:rounded-none border border-slate-100 md:border-none">
                  
                  {/* Metric: Bundle Qty */}
                  <div className="flex flex-col md:border-r md:border-slate-100 md:pr-4 lg:pr-6">
                    <p className="text-[9px] sm:text-[10px] font-inter font-bold text-slate-400 uppercase tracking-[0.05em] sm:tracking-[0.08em] mb-0.5">
                      Buy Bundle
                    </p>
                    <p className="text-[12px] sm:text-[13px] font-sora font-bold text-[#0F172A] whitespace-nowrap">
                      {deal.requiredQuantity} Units
                    </p>
                  </div>
                  
                  {/* Metric: Bundle Total */}
                  <div className="flex flex-col md:border-r md:border-slate-100 md:pr-4 lg:pr-6">
                    <p className="text-[9px] sm:text-[10px] font-inter font-bold text-slate-400 uppercase tracking-[0.05em] sm:tracking-[0.08em] mb-0.5">
                      Bundle Total
                    </p>
                    <p className="text-[12px] sm:text-[13px] font-sora font-bold text-[#0F172A] whitespace-nowrap">
                      {inr(deal.bulkTotalPrice)}
                    </p>
                  </div>
                  
                  {/* Metric: Savings */}
                  <div className="flex flex-col">
                    <p className="text-[9px] sm:text-[10px] font-inter font-bold text-emerald-600 uppercase tracking-[0.05em] sm:tracking-[0.08em] mb-0.5">
                      Savings
                    </p>
                    <p className="text-[12px] sm:text-[13px] font-sora font-[800] text-emerald-600 whitespace-nowrap">
                      ↓ {inr(deal.totalSavingsVsMarket)}
                    </p>
                  </div>

                </div>

                {/* Extra Units Badge (Visible on Desktop at the end of the row) */}
                <div className="hidden md:flex items-center justify-end w-auto lg:w-[130px] shrink-0">
                  <span className="text-[10px] lg:text-[11px] font-sora font-bold text-pink-700 bg-pink-50 border border-pink-100 px-2 lg:px-2.5 py-1 lg:py-1.5 rounded-[8px] flex items-center gap-1 shadow-sm whitespace-nowrap">
                    <Boxes size={12} /> +{deal.extraQuantityGained} Extra
                  </span>
                </div>

              </div>
            )) : (
              <div className="h-full flex items-center justify-center flex-col text-center p-6 sm:p-8 bg-slate-50/50 rounded-[12px] border border-dashed border-slate-200">
                <Boxes size={28} className="text-slate-300 mb-2 sm:mb-3" />
                <p className="text-slate-500 font-inter text-[12px] sm:text-[13px] font-medium max-w-[250px]">
                  No hidden bulk volume deals strictly better than your current selection.
                </p>
              </div>
            )}
          </div>
        </FloatingSurface>
      </div>
    </div>
  );
}