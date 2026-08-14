import React from 'react';
import { ShieldCheck, Star, Award, TrendingUp, MessageCircle, Phone, UserPlus, Loader2 } from 'lucide-react';

export const ProfileHeader = ({ profile, isOwner, firstLetter, handleConnect, isConnecting, activeTab, setActiveTab, availableTabs, navigate, isMobile }) => {
  return (
    <section className="bg-white p-6 sm:p-8 md:p-10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-slate-200/60 flex flex-col gap-6 w-full md:rounded-[24px]">
      <div className="flex flex-row gap-4 sm:gap-5 md:gap-8 items-start w-full">
        <div className="flex items-center justify-center w-[72px] h-[72px] sm:w-24 sm:h-24 md:w-[120px] md:h-[120px] bg-slate-900 rounded-[20px] md:rounded-[28px] text-white flex-shrink-0 relative">
          <span className="font-['Manrope',_sans-serif] text-[32px] sm:text-[40px] md:text-[56px] font-extrabold tracking-tighter">{firstLetter}</span>
          {profile.verificationStatus === 'VERIFIED' && (
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 md:p-2 rounded-full border-4 border-white shadow-sm">
              <ShieldCheck size={isMobile ? 14 : 18} strokeWidth={2.5}/>
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-1 min-w-0 pt-0 md:pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-wrap">
            <h1 className="font-['Manrope',_sans-serif] text-[20px] sm:text-3xl md:text-[36px] font-extrabold text-slate-900 leading-tight tracking-tight truncate w-full sm:w-auto">
              {profile.businessName}
            </h1>
            {profile.gstNumber && (
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase rounded-lg border border-slate-200/60 w-fit">
                GST Verified
              </span>
            )}
          </div>
          
          <div className="hidden sm:flex flex-col mt-1.5 md:mt-2 gap-0.5">
            <span className="text-[10px] md:text-[12px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Operated By  <span className="text-[14px] md:text-[16px] normal-case font-extrabold text-slate-800 leading-tight ps-2 ">{profile.ownerName}</span> <span className="text-[13px] md:text-[13px] ps-2 font-medium text-slate-700 uppercase tracking-wider mt-0.5 leading-none"> * {profile.businessType}</span></span>
          </div>

          <div className="flex flex-col sm:hidden mt-1.5 md:mt-2 gap-0.5">
            <span className="text-[11px] ps-1 md:text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">Operated By  <span className="text-[14px] md:text-[16px] font-extrabold text-slate-800 leading-tight ps-2 ">{profile.ownerName}</span> </span>
            <span className="text-[13px] ps-1 md:text-[13px] mt-3 font-medium text-slate-700 uppercase tracking-wider mt-0.5 leading-none"> {profile.businessType}</span>
          </div>

          <div className="hidden md:flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="text-[13px] md:text-sm font-extrabold text-slate-900">{profile.rating ?? 0} <span className="text-slate-400 font-medium">({profile.reviewCount ?? 0})</span></span>
            </div>
            <div className="w-1 h-1 bg-slate-200 rounded-full" />
            <div className="flex items-center gap-1.5">
              <Award size={16} className="text-pink-500" />
              <span className="text-[13px] md:text-sm font-bold text-slate-700">Trust Score {profile.trustScore ?? 0}</span>
            </div>
            <div className="w-1 h-1 bg-slate-200 rounded-full" />
            <div className="flex items-center gap-1.5">
              <TrendingUp size={16} className="text-emerald-500" />
              <span className="text-[13px] md:text-sm font-bold text-slate-700">Rank #{profile.marketplaceRank ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex md:hidden flex-row flex-wrap items-center gap-3 sm:gap-4 py-3 border-y border-slate-100 mt-2 w-full">
        <div className="flex items-center gap-1.5 shrink-0">
          <Star size={16} className="text-yellow-400 fill-yellow-400" />
          <span className="text-[13px] font-extrabold text-slate-900">{profile.rating ?? 0} <span className="text-slate-400 font-medium">({profile.reviewCount ?? 0})</span></span>
        </div>
        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full shrink-0" />
        <div className="flex items-center gap-1.5 shrink-0">
          <Award size={16} className="text-pink-500" />
          <span className="text-[13px] font-bold text-slate-700">Trust Score {profile.trustScore ?? 0}</span>
        </div>
        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full shrink-0" />
        <div className="flex items-center gap-1.5 shrink-0">
          <TrendingUp size={16} className="text-emerald-500" />
          <span className="text-[13px] font-bold text-slate-700">Rank #{profile.marketplaceRank ?? 0}</span>
        </div>
      </div>

      {!isOwner && (
        <div className="flex flex-wrap items-center gap-3 w-full justify-start mt-1 md:mt-0">
          <button onClick={() => navigate('/message', { state: { partnerToMessage: { id: profile.userId || profile.id, name: profile.ownerName, businessName: profile.businessName } }})} className="px-5 py-3 md:px-6 bg-white border border-slate-200/80 text-[13px] font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
            <MessageCircle size={16} /> <span className="hidden sm:inline">Message</span>
          </button>
          <button className="px-5 py-3 md:px-6 bg-white border border-slate-200/80 text-[13px] font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
            <Phone size={16} /> <span className="hidden sm:inline">Call</span>
          </button>
          <button onClick={handleConnect} disabled={isConnecting} className="px-6 py-3 md:px-8 bg-slate-900 text-white text-[13px] font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-70">
            {isConnecting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />} 
            <span>Connect</span>
          </button>
        </div>
      )}

      <div className="flex items-center justify-start gap-8 border-b border-slate-100 mt-2 overflow-x-auto hide-scrollbar w-full">
        {availableTabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} 
            className={`pb-4 text-[14px] md:text-[15px] font-bold transition-all border-b-[3px] whitespace-nowrap outline-none ${activeTab === tab.id ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </section>
  );
};