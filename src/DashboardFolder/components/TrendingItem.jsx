import React from 'react';
import { TrendingUp } from 'lucide-react';

const TrendingItem = ({ trend }) => {
  return (
    <div className="bg-slate-50 border border-slate-200/50 p-3.5 rounded-2xl flex items-center gap-3.5 hover:border-slate-300 transition-colors cursor-pointer group shadow-sm hover:shadow-md">
      <div className="w-11 h-11 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-slate-200 shadow-sm">
        <img src={trend.image} alt={trend.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="min-w-0">
        <h5 className="text-[13px] font-bold text-slate-900 truncate tracking-tight">{trend.name}</h5>
        <div className="flex items-center gap-1 text-emerald-600 font-extrabold text-xs mt-0.5">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{trend.change}</span>
        </div>
      </div>
    </div>
  );
};

export default TrendingItem;