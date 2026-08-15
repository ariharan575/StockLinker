import React from 'react';
import { Truck, MapPin } from 'lucide-react';

export const DeliveryTab = ({ profile }) => {
  return (
    <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        
        <div className="p-6 md:p-10 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h3 className="font-['Manrope',_sans-serif] text-[18px] font-extrabold text-slate-900 leading-tight">Logistics Engine</h3>
              <p className="text-[13px] font-medium text-slate-500 mt-1">B2B fulfillment rules.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200/60 rounded-xl">
              <span className="text-[14px] font-bold text-slate-900">Direct Delivery</span>
              <span className={`px-3 py-1 rounded-lg text-[11px] font-extrabold tracking-widest uppercase ${profile.deliverySupported ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                {profile.deliverySupported ? 'Active' : 'Pickup Only'}
              </span>
            </div>
            
            {profile.deliverySupported && (
              <div className="border border-slate-200/60 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Service Radius</span>
                  <span className="text-[14px] font-extrabold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200/60">{profile.coverageRadiusKm ? `${profile.coverageRadiusKm} KM` : 'Local'}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Min. Order Value</span>
                  <span className="text-[14px] font-extrabold text-slate-900">{profile.minimumOrderValue ? `₹${profile.minimumOrderValue.toLocaleString('en-IN')}` : 'No Minimum'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Delivery Fee</span>
                  <span className="text-[14px] font-extrabold text-emerald-600">
                    {profile.deliveryCharge ? `₹${profile.deliveryCharge.toLocaleString('en-IN')}` : 'Free Delivery'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 md:p-10 flex flex-col h-full bg-slate-50/30">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="font-['Manrope',_sans-serif] text-[18px] font-extrabold text-slate-900 leading-tight">Dispatch Center</h3>
              <p className="text-[13px] font-medium text-slate-500 mt-1">Official registered address.</p>
            </div>
          </div>

          <div className="flex-1 bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="col-span-2">
                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">Address Line 1</p>
                <p className="text-[14px] font-bold text-slate-900 leading-snug">{profile.addressLine1 || 'N/A'}</p>
              </div>
              {profile.addressLine2 && (
                <div className="col-span-2">
                  <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">Address Line 2</p>
                  <p className="text-[14px] font-bold text-slate-900 leading-snug">{profile.addressLine2}</p>
                </div>
              )}
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">City</p>
                <p className="text-[14px] font-bold text-slate-900">{profile.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">District</p>
                <p className="text-[14px] font-bold text-slate-900">{profile.district || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">State</p>
                <p className="text-[14px] font-bold text-slate-900">{profile.state || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">Pincode</p>
                <p className="text-[14px] font-bold text-slate-900">{profile.pincode || 'N/A'}</p>
              </div>
              {profile.landmark && (
                <div className="col-span-2 mt-2 pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">Landmark</p>
                  <p className="text-[14px] font-bold text-slate-700 leading-snug">{profile.landmark}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};