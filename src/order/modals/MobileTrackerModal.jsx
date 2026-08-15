import React from 'react';
import { X } from 'lucide-react';
import TrackerContent from '../components/TrackerContent';

export default function MobileTrackerModal({ setIsTrackerModalOpen, activeRouteDateInfo, isLoadingRoute, activeRouteOrderId, liveRoute }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
       <div className="bg-white rounded-t-[24px] sm:rounded-[24px] w-full max-w-md h-[80vh] sm:h-auto sm:max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
          <div className="flex justify-end p-4 pb-0">
             <button onClick={() => setIsTrackerModalOpen(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-black rounded-full hover:bg-slate-100 transition-colors">
                <X size={18}/>
             </button>
          </div>
          <div className="p-6 pt-2 flex-1 overflow-y-auto no-scrollbar">
             <TrackerContent 
                activeRouteDateInfo={activeRouteDateInfo} 
                isLoadingRoute={isLoadingRoute} 
                activeRouteOrderId={activeRouteOrderId} 
                liveRoute={liveRoute} 
             />
          </div>
       </div>
    </div>
  );
}