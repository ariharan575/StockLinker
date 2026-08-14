import React from 'react';
import { Info, Save, Edit3, Loader2, X, Star, Award, Check, Phone, MessageSquare, MapPin, Mail, Clock } from 'lucide-react';
import { getSubcategoryImageUrl, formatTime } from '../../utils/helpers';
import { DEFAULT_DESCRIPTION } from '../../utils/constants';

export const ProfileTab = ({
  profile, isOwner, isEditingDesc, setIsEditingDesc, descValue, setDescValue, handleSaveDescription, isSavingDesc,
  subCategories, displayedCats, extraCount, setShowSubCatModal, hoverRating, setHoverRating, initiateRating, hasRatedLocally
}) => {
  return (
    <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        
        <div className="lg:col-span-2 flex flex-col divide-y divide-slate-100">
          <div className="p-6 md:p-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-['Manrope',_sans-serif] text-[18px] md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Info size={20} className="text-slate-400" /> Company Overview
              </h3>
              
              {isOwner && (
                isEditingDesc ? (
                  <button onClick={handleSaveDescription} disabled={isSavingDesc} className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-[13px] font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70 shadow-md shrink-0">
                    {isSavingDesc ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                  </button>
                ) : (
                  <button onClick={() => { setDescValue(profile.businessDescription || DEFAULT_DESCRIPTION); setIsEditingDesc(true); }} className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-sm shrink-0">
                    <Edit3 size={14} /> Edit
                  </button>
                )
              )}
            </div>
            
            {isEditingDesc ? (
              <div className="relative w-full">
                <textarea 
                  className="w-full min-h-[160px] p-5 pr-12 bg-white border border-slate-200 rounded-2xl text-[14px] font-medium leading-relaxed text-slate-700 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 shadow-inner resize-none transition-all duration-200"
                  value={descValue}
                  onChange={(e) => setDescValue(e.target.value)}
                  placeholder="Write a detailed description about your business, heritage, and values..."
                  autoFocus
                />
                <button onClick={() => { setIsEditingDesc(false); setDescValue(profile.businessDescription || ""); }} className="absolute top-3 right-3 p-2 bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors" title="Cancel">
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <p className="text-[14px] md:text-[15px] leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">
                {profile.businessDescription || DEFAULT_DESCRIPTION}
              </p>
            )}
          </div>

          {subCategories.length > 0 && (
            <div className="p-6 md:p-10">
              <h3 className="font-['Manrope',_sans-serif] text-[18px] md:text-xl font-extrabold text-slate-900 mb-6">Sourcing Categories</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
                {displayedCats.map((cat, i) => {
                  const imgUrl = getSubcategoryImageUrl(cat.image) || cat.image;
                  return (
                    <div key={i} className="aspect-square rounded-[16px] overflow-hidden relative group cursor-pointer border border-slate-200/60 bg-slate-50 shadow-sm">
                      {imgUrl ? (
                        <img src={imgUrl} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-xs uppercase">{cat.name?.charAt(0)}</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 p-3 flex items-end justify-center text-center translate-y-1 group-hover:translate-y-0 transition-transform">
                        <span className="text-white text-[11px] md:text-xs font-extrabold leading-tight drop-shadow-md line-clamp-2">{cat.name}</span>
                      </div>
                    </div>
                  );
                })}
                {extraCount > 0 && (
                  <div onClick={() => setShowSubCatModal(true)} className="aspect-square rounded-[16px] overflow-hidden relative cursor-pointer border border-slate-200/60 bg-slate-100 group shadow-sm">
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/5 group-hover:bg-slate-900/10 transition-colors">
                      <span className="font-['Manrope',_sans-serif] text-xl md:text-2xl font-extrabold text-slate-800">+{extraCount}</span>
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">More</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col divide-y divide-slate-100 bg-slate-50/30">
          {isOwner ? (
            <div className="p-6 md:p-8">
              <h3 className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-slate-900 mb-2">Your Current Rating</h3>
              <p className="text-[13px] text-slate-500 font-medium mb-6 leading-relaxed">This is your overall marketplace rating based on partner reviews.</p>
              
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => {
                  const currentRating = Math.round(profile?.rating ?? 0);
                  return (
                    <div key={star} className="focus:outline-none">
                      <Star size={28} className={currentRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'} />
                    </div>
                  );
                })}
              </div>
              <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 bg-slate-100 border border-slate-200 py-2 px-3 rounded-lg w-fit">
                <Award size={14} className="text-slate-500" /> {profile?.reviewCount ?? 0} Total Reviews
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <h3 className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-slate-900 mb-2">Rate this Partner</h3>
              <p className="text-[13px] text-slate-500 font-medium mb-6 leading-relaxed">Your rating actively influences their algorithmic Trust Score. <span className="text-pink-500">One-time rating only.</span></p>
              
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => initiateRating(star)}
                    disabled={profile?.hasRated || hasRatedLocally}
                    className={`focus:outline-none transition-transform ${(profile?.hasRated || hasRatedLocally) ? 'cursor-not-allowed opacity-70' : 'hover:scale-110'}`}
                  >
                    <Star size={28} className={`${(hoverRating || (profile?.hasRated && 5)) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
              {(profile?.hasRated || hasRatedLocally) && (
                <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 py-2 px-3 rounded-lg w-fit">
                  <Check size={14} /> Data Submitted
                </div>
              )}
            </div>
          )}

          <div className="p-6 md:p-8 flex-1">
            <h3 className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-slate-900 mb-6">Contact & Info</h3>
            
            <div className="space-y-6">
              {profile.mobileNumber && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-200/60 shadow-sm"><Phone size={16} /></div>
                  <div className="flex flex-col pt-0.5">
                    <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">Mobile</p>
                    <p className="text-[14px] font-bold text-slate-900">{profile.mobileNumber}</p>
                  </div>
                </div>
              )}
              {profile.whatsappNumber && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-100 shadow-sm"><MessageSquare size={16} /></div>
                  <div className="flex flex-col pt-0.5">
                    <p className="text-[11px] font-bold uppercase text-emerald-600/70 tracking-wider mb-0.5">WhatsApp</p>
                    <p className="text-[14px] font-bold text-slate-900">{profile.whatsappNumber}</p>
                  </div>
                </div>
              )}
              {profile.district && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-200/60 shadow-sm"><MapPin size={16} /></div>
                  <div className="flex flex-col pt-0.5">
                    <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">Region</p>
                    <p className="text-[14px] font-bold text-slate-900">{profile.district}</p>
                  </div>
                </div>
              )}
              {profile.businessEmail && (
                <div className="flex items-start gap-4 overflow-hidden">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-200/60 shadow-sm"><Mail size={16} /></div>
                  <div className="flex flex-col pt-0.5 overflow-hidden">
                    <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">Email</p>
                    <p className="text-[14px] font-bold text-slate-900 truncate">{profile.businessEmail}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-200/60 shadow-sm"><Clock size={16} /></div>
                <div className="flex flex-col pt-0.5">
                  <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">Operating Hours</p>
                  <p className="text-[14px] font-bold text-slate-900">
                    {profile.openingTime && profile.closingTime ? `${formatTime(profile.openingTime)} - ${formatTime(profile.closingTime)}` : 'Standard Hours'}
                  </p>
                  <p className="text-[12px] font-medium text-slate-500 mt-0.5">{profile.operatingDays || 'Mon - Sat'}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};