import React from 'react';
import { Map, CalendarDays, Truck, CheckCircle2, Clock } from 'lucide-react';
import { TrackerSkeleton } from './OrderSkeletons';

export default function TrackerContent({ activeRouteDateInfo, isLoadingRoute, activeRouteOrderId, liveRoute }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-3  pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
            <Map size={18} />
          </div>
          <div>
            <h3 className="font-['Manrope',_sans-serif] text-[18px] font-extrabold text-black leading-tight">
              Delivery Tracker
            </h3>
            <p className="text-[12px] font-medium text-slate-500">Live route sequence monitor.</p>
          </div>
        </div>
      </div>

      {activeRouteDateInfo && (
        <div className="flex items-center gap-1.5 px-3 mb-5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg shrink-0">
          <span className='text-[11px] font-bold text-slate-600'>Delivery Date : </span>
          <CalendarDays size={14} className="text-slate-400" />
          <span className="text-[11px] font-bold text-slate-600">{new Date(activeRouteDateInfo).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}</span>
        </div>
      )}

      {isLoadingRoute ? (
        <TrackerSkeleton />
      ) : !activeRouteOrderId || liveRoute.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center h-full my-auto py-12">
          <Truck size={32} className="text-slate-200 mb-4" />
          <p className="text-[13px] font-medium text-slate-500 max-w-[200px]">Select an active order to view its delivery route.</p>
        </div>
      ) : (
        <div className="relative pl-4 space-y-6 flex-1 overflow-y-auto no-scrollbar pb-6">
          <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-slate-100" />
          
          {liveRoute.map((stop, i) => (
            <div key={stop.id} className="relative z-10 flex items-start gap-4 animate-[fadeIn_0.3s_ease-out]">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-[2px] bg-white shrink-0 mt-0.5 transition-all duration-300 ${stop.isPast ? 'border-[#17B26A]' : stop.isActive ? 'border-pink-500 ring-4 ring-pink-500/20' : 'border-slate-200'}`}>
                {stop.isPast && <CheckCircle2 size={14} className="text-[#17B26A]"/>}
                {stop.isActive && <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse"/>}
                {!stop.isPast && !stop.isActive && <span className="text-[10px] font-extrabold text-slate-400">{i+1}</span>}
              </div>

              <div className="flex flex-col pt-0.5">
                <p className={`text-[14px] font-extrabold ${stop.companyName.includes('(You)') ? 'text-pink-600' : 'text-black'}`}>{stop.companyName}</p>
                <p className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center gap-1.5">
                  {stop.isPast ? <CheckCircle2 size={12} className="text-[#17B26A]"/> : stop.isActive ? <Truck size={12} className="text-pink-500"/> : <Clock size={12}/>}
                  {stop.isPast ? 'Delivered successfully' : stop.isActive ? 'Truck is on the way' : 'Pending in queue'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}