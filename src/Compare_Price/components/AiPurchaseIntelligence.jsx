import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, MessageCircle, Zap, Package, Boxes } from 'lucide-react';
import { inr } from '../config/constants';
import { FloatingSurface, GradientButton } from './SharedComponents';

export default function AiPurchaseIntelligence({ topSupplier, aiDeals, qty }) {
  const navigate = useNavigate(); // Added navigation hook

  if (!topSupplier && (!aiDeals || aiDeals.length === 0)) return null;

  return (
    <div className="mb-14 w-full">
      <h2 className="text-[20px] md:text-[22px] font-sora font-bold text-[#0F172A] leading-[1.3] tracking-[-0.02em] mb-6">AI Purchase Intelligence</h2>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
        
        {/* LEFT: Top 1 Winner */}
        <FloatingSurface className="xl:col-span-1 p-6 md:p-8 flex flex-col justify-between bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-sora font-semibold uppercase tracking-[0.10em] bg-white text-[#0F172A] border border-slate-200 shadow-sm"><Zap size={12} className="fill-pink-500 text-pink-500" /> #1 BEST DEAL</span>
            <span className="text-[11px] font-inter font-semibold tracking-[0.08em] uppercase text-slate-500 px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50">{qty} UNITS REQUESTED</span>
          </div>

          {topSupplier ? (
            <>
              <div className="mb-6">
                {/* FIX: Text color changed to dark so it is visible on white bg, and weight made semibold */}
                <h3 className="text-[20px] font-sora font-semibold text-[#0F172A] mb-2 leading-[1.3]">{topSupplier.businessName}</h3>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[12px] font-inter text-slate-500 mb-2"><MapPin size={14} className="text-slate-400" /> {topSupplier.locationDistrict}</div>
                  <div className="flex items-center gap-1.5 text-[12px] font-inter text-slate-500 mb-4"><Star size={14} className="text-yellow-500 fill-yellow-500" /> <span className="font-semibold text-slate-700">{topSupplier.rating}</span> ({topSupplier.trustScore} Trust Score)</div>
                </div>
              </div>

              {/* Gray Box for Price */}
              <div className="mb-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-inner">
                <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500 font-bold mb-2">TOTAL CALCULATED PRICE</p>
                <div className="flex items-baseline gap-2 mb-3">
                  {/* FIX: Text color changed to dark */}
                  <span className="text-[32px] font-sora font-[800] text-[#0F172A] tracking-[-0.03em] leading-none">{inr(topSupplier.calculatedTotalPrice)}</span>
                </div>
                <p className="text-[12px] font-inter text-slate-500 font-medium">Base Unit Price: {inr(topSupplier.basePricePerUnit)}</p>
              </div>

              <div className="mt-auto flex items-center gap-3">
                <button className="flex-[0.8] py-3.5 bg-slate-900 text-white rounded-xl text-[14px] font-inter font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-md"><MessageCircle size={16} /> Chat</button>
                
                {/* FIX: Changed Place Order to View Profile and added navigation */}
                <GradientButton 
                  onClick={() => navigate(`/storefront/${topSupplier.businessProfileId}`)} 
                  className="flex-[1.2] py-3.5 rounded-xl text-[14px]"
                >
                  View Profile
                </GradientButton>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-[14px] font-inter text-center">No valid suppliers found for this exact quantity.</div>
          )}
        </FloatingSurface>

        {/* RIGHT: Volume Upsell Intelligence */}
        <FloatingSurface className="xl:col-span-2 p-6 md:p-8 flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center border border-pink-100 shadow-sm"><Package size={22} className="text-pink-600" /></div>
            <div>
              <h3 className="text-[20px] font-sora font-bold text-[#0F172A] leading-[1.3] tracking-[-0.02em]">Volume Upsell Intelligence</h3>
              <p className="text-[14px] font-inter text-slate-500 mt-1">Scale your order quantity to unlock massive supplier discounts and get extra units.</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            {aiDeals?.length > 0 ? aiDeals.map((deal) => (
              <div 
                key={deal.rank} 
                onClick={() => deal.businessProfileId && navigate(`/storefront/${deal.businessProfileId}`)}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-[16px] bg-white border border-slate-200 shadow-sm hover:border-pink-300 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-sora font-bold flex items-center justify-center text-[12px] shadow-md">{deal.rank}</div>
                  <div>
                    <h4 className="text-[15px] font-sora font-semibold text-[#0F172A] leading-tight group-hover:text-pink-600 transition-colors">{deal.businessName}</h4>
                    <p className="text-[12px] font-inter text-slate-500 mt-1"><Star size={12} className="inline text-yellow-500 fill-yellow-500 mb-0.5" /> {deal.rating} • {deal.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 divide-x divide-slate-100 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <div className="pr-2">
                    <p className="text-[10px] font-inter font-semibold text-slate-400 uppercase tracking-[0.08em] mb-1">Buy Bundle</p>
                    <p className="text-[14px] font-sora font-bold text-[#0F172A]">{deal.requiredQuantity} Units</p>
                  </div>
                  <div className="px-4">
                    <p className="text-[10px] font-inter font-semibold text-slate-400 uppercase tracking-[0.08em] mb-1">Bundle Total</p>
                    <p className="text-[14px] font-sora font-bold text-[#0F172A]">{inr(deal.bulkTotalPrice)}</p>
                  </div>
                  <div className="pl-4">
                    <p className="text-[10px] font-inter font-semibold text-emerald-600 uppercase tracking-[0.08em] mb-1">Total Savings</p>
                    <p className="text-[14px] font-sora font-bold text-emerald-600">↓ {inr(deal.totalSavingsVsMarket)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                  <div className="text-[11px] font-sora font-semibold text-pink-600 bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <Boxes size={14} /> +{deal.extraQuantityGained} Extra Units
                  </div>
                </div>
              </div>
            )) : (
              <div className="h-full flex items-center justify-center flex-col text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Boxes size={32} className="text-slate-300 mb-3" />
                <p className="text-slate-500 font-inter text-[14px] font-medium">No hidden bulk volume deals found strictly better than your current selection.</p>
              </div>
            )}
          </div>
        </FloatingSurface>
      </div>
    </div>
  );
}