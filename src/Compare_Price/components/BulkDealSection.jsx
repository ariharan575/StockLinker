import React from 'react';
import { MapPin, Star, MessageCircle, Phone, ShoppingBag, TrendingDown, ArrowRight } from 'lucide-react';
import { FloatingSurface, PremiumBadge, GradientButton } from './SharedComponents';
import { CTA_GRAD } from '../config/constants';

export default function BulkDealSection({ openBulkDetails }) {
  const bulk = [
    { rank: 1, name: 'ABC Wholesale Mart', minQty: '1,000 Units', unitPrice: '₹64,500', saving: '₹2,999 / unit' },
    { rank: 2, name: 'SK Distributors', minQty: '500 Units', unitPrice: '₹65,800', saving: '₹1,699 / unit' },
    { rank: 3, name: 'Global Trade Hub', minQty: '2,000 Units', unitPrice: '₹63,200', saving: '₹4,299 / unit' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12 w-full">
      <FloatingSurface className="xl:col-span-1 p-8 overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#EC4899]/10 via-[#F97316]/10 to-transparent blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 flex-1">
          {/* Top Header */}
          <div className="flex items-center justify-between mb-4">
            <PremiumBadge text="BEST MATCH" />
            <span className="text-[11px] font-inter font-semibold tracking-[0.08em] uppercase text-[#0F172A] px-3 py-1.5 bg-white shadow-sm rounded-lg border border-slate-200">
              50 Units Req.
            </span>
          </div>

          {/* Supplier Profile Section */}
          <div className="mb-4">
            <p className="text-[16px] font-sora font-bold text-[#0F172A] mb-2 leading-[1.35]">Sri Lakshmi Traders</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[13px] font-inter font-normal text-[#64748B]">
                <MapPin size={16} />
                <span>Chennai, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] font-inter font-normal text-[#64748B]">
                <Star size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-[#0F172A] font-semibold">4.8</span>
                <span>245 Reviews</span>
              </div>
            </div>
          </div>

          {/* Price Area */}
          <div className="mb-3 flex flex-col items-start">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[24px] md:text-[26px] font-sora font-[800] text-[#0F172A] tracking-[-0.03em] leading-[1.2]">₹67,200</span>
              <span className="text-[13px] font-inter font-normal text-[#94A3B8]">/ unit</span>
            </div>
            <span className="px-2 py-1 bg-slate-100 text-[#64748B] text-[11px] font-inter font-semibold rounded-md uppercase tracking-[0.08em]">
              AI Recommended Price
            </span>
          </div>

          {/* Saving Section */}
          <div className="inline-block px-3 py-1.5 rounded-lg bg-orange-50 mb-4 border border-orange-100">
            <p className="text-[13px] font-inter font-semibold bg-clip-text text-transparent" style={{ backgroundImage: CTA_GRAD }}>
              Save ₹1,39,950 total vs Market Avg.
            </p>
          </div>

          {/* Contact Action Area */}
          <div className="flex items-center gap-3 mb-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-inter font-semibold text-[#0F172A] shadow-sm hover:bg-slate-50 transition-all">
              <MessageCircle size={16} />
              Message
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#0F172A] rounded-lg text-[13px] font-inter font-semibold text-white shadow-sm hover:bg-[#1E293B] transition-all">
              <Phone size={16} />
              Call Now
            </button>
          </div>
        </div>

        {/* Main CTA Update */}
        <GradientButton className="w-full py-3">
          <div className="flex items-center justify-center gap-3">
            <ShoppingBag size={20} className="text-white" />
            <div className="flex flex-col items-start text-left">
              <span className="text-[14px] font-sora font-semibold text-white leading-tight">Place Order</span>
            </div>
          </div>
        </GradientButton>
      </FloatingSurface>

      <FloatingSurface className="xl:col-span-2 p-8 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] flex items-center justify-center border border-slate-200 shadow-sm">
            <TrendingDown size={22} className="text-[#0F172A]" />
          </div>

          <div>
            <h3 className="text-[20px] font-sora font-bold text-[#0F172A] leading-[1.3] tracking-[-0.02em]">
              Volume Pricing Intelligence
            </h3>
            <p className="text-[14px] font-inter text-[#475569] mt-1.5 leading-[1.6]">
              Scale your order quantity to unlock deeper supplier discounts.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="space-y-3">
          {bulk.map((b) => (
            <div
              key={b.rank}
              className="grid grid-cols-12 gap-4 items-center p-5 rounded-[20px] bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
            >
              
              {/* Rank + Name */}
              <div className="col-span-12 md:col-span-3 flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 flex-shrink-0 rounded-full bg-[#0F172A] text-white text-[11px] font-sora font-semibold flex items-center justify-center shadow-md">
                  {b.rank}
                </span>

                <span className="font-inter font-medium text-[14px] text-[#0F172A] truncate flex-1 block">
                  {b.name}
                </span>
              </div>

              {/* MOQ */}
              <div className="col-span-4 md:col-span-2 mt-4 md:mt-0">
                <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em]">
                  MOQ
                </p>
                <p className="text-[13px] font-medium text-[#475569] truncate">
                  {b.minQty}
                </p>
              </div>

              {/* Price */}
              <div className="col-span-4 md:col-span-3 mt-4 md:mt-0">
                <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em]">
                  Unit Price
                </p>
                <p className="text-[16px] font-sora font-[800] text-[#0F172A] truncate tracking-[-0.02em]">
                  {b.unitPrice}
                </p>
              </div>

              {/* Savings */}
              <div className="col-span-4 md:col-span-2 mt-4 md:mt-0">
                <p className="text-[11px] font-semibold text-[#10B981] uppercase tracking-[0.08em]">
                  Savings
                </p>
                <p className="text-[13px] font-medium text-[#10B981] truncate">
                  ↓ {b.saving}
                </p>
              </div>

              {/* CTA */}
              <div className="col-span-12 md:col-span-2 flex justify-end mt-5 md:mt-0">
                <button
                  onClick={() => openBulkDetails?.(b)}
                  className="group/btn flex items-center justify-center gap-2 px-4 w-full md:w-auto h-[40px] 
                  bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500
                   rounded text-[13px] font-semibold text-white transition-all duration-200
                   hover:shadow-[0_4px_12px_rgba(244,63,94,0.3)] hover:-translate-y-0.5"
                >
                  View
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover/btn:translate-x-1"
                  />
                </button>
              </div>

            </div>
          ))}
        </div>
      </FloatingSurface>
    </div>
  );
}