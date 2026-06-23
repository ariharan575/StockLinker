import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Layers, Scan, Package, HelpCircle, Search, Mic, ImageIcon, 
  Bell, ChevronRight, ArrowRight, ShoppingBag, MapPin, Sliders, Heart 
} from 'lucide-react';
import { WHOLESALE_DEALS_M } from '../data/mockData';
import { mobileQuickActions, mobileNavTabs } from '../utils/constants';
import ProductDetailModal from './ProductDetailModal';

const MobileAndTabletArchitecture = ({ activeTab, setActiveTab, searchQuery, setSearchQuery, layoutType }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getIcon = (iconName) => {
    const iconMap = { Home, Layers, Scan, Package, HelpCircle };
    const Icon = iconMap[iconName];
    return Icon ? <Icon className="w-6 h-6" /> : null;
  };

  return (
    <div className={`mx-auto ${layoutType === 'tablet' ? 'max-w-3xl border-x border-slate-200/60 shadow-[0_0_40px_rgba(0,0,0,0.03)] bg-[#fafafa]' : 'max-w-md bg-[#fafafa] min-h-screen shadow-inner'} relative pb-28 transition-all duration-500`}>
      
      {/* Header Matrix - Premium Glassmorphism */}
      <header className="p-4 pt-6 sticky top-0 bg-white/70 backdrop-blur-xl z-30 border-b border-slate-200/50 transform translate-y-0 transition-transform duration-500">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center font-serif text-xl font-bold shadow-lg shadow-slate-900/10 border border-slate-700/50">SL</div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Welcome Back</p>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5 tracking-tight">
                Arun Kumar <span className="animate-bounce origin-bottom text-xl">👋</span>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer group">
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping opacity-75"></span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 border-2 border-white"></span>
              <Bell className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
            </div>
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Profile" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md ring-1 ring-slate-200" />
          </div>
        </div>

        {/* Search Engine Dock */}
        <div className="relative group">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search premium products..."
            className="w-full pl-12 pr-24 py-3.5 bg-white border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 transition-all duration-500 font-medium text-slate-800 placeholder:text-slate-400 shadow-sm hover:shadow-md"
          />
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors duration-300" />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <button className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 transition-all duration-300"><Mic className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 transition-all duration-300"><ImageIcon className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-8">
        
        {/* Horizontal Action Matrix */}
        <div className="grid grid-cols-3 gap-3">
          {mobileQuickActions.map((pill, idx) => (
            <div 
              key={idx} 
              className={`p-3.5 rounded-2xl border ${pill.color} flex flex-col items-center text-center justify-center cursor-pointer transform hover:-translate-y-1 transition-all duration-500 shadow-sm hover:shadow-md will-change-transform bg-white/50 backdrop-blur-sm`}
            >
              <span className="text-2xl mb-1.5 drop-shadow-sm">{pill.icon}</span>
              <span className="text-[11px] font-bold tracking-tight leading-none text-slate-700">{pill.label}</span>
            </div>
          ))}
        </div>

        {/* Dynamic High-Intent Bulk Conversion Vector */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded-[28px] p-6 text-white shadow-[0_12px_30px_rgba(244,63,94,0.25)] relative overflow-hidden group transform hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none"></div>
          <div className="relative z-10">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm">Mega Pool Active</span>
            <h3 className="text-2xl font-bold mt-3 mb-2 leading-tight tracking-tight">Secure Ultra-Low Prices via Pool Buying</h3>
            <p className="text-white/90 text-xs font-medium max-w-[85%] mb-5 leading-relaxed">Leverage collective regional demand to unlock dynamic factory wholesale rates on bulk inputs.</p>
            <button className="bg-white text-rose-600 hover:text-rose-700 font-bold text-xs px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 tracking-wider uppercase active:scale-95">
              Explore Pools <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 transform rotate-12 select-none pointer-events-none drop-shadow-2xl">🏢</div>
        </div>

        {/* Today's Flash Wholesale Deals Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[17px] font-bold tracking-tight text-slate-900">Today's Best Price Deals</h3>
            <button className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors">View All <ChevronRight className="w-3.5 h-3.5"/></button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar px-1">
            {WHOLESALE_DEALS_M.map((deal) => (
              <div 
                key={deal.id} 
                onClick={() => setSelectedProduct(deal)}
                className="w-44 flex-shrink-0 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-[24px] p-3.5 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-500 snap-start cursor-pointer group relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-3 right-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm shadow-rose-500/30">
                  Save {deal.save}
                </div>
                <div className="w-full h-28 bg-slate-50/80 rounded-2xl flex items-center justify-center mb-3 overflow-hidden relative border border-slate-100">
                  <span className="text-4xl transform group-hover:scale-110 transition-transform duration-500 drop-shadow-md">🌾</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-rose-600 transition-colors duration-300 tracking-tight">{deal.name}</h4>
                <p className="text-[11px] text-slate-500 font-medium mb-2 mt-0.5">{deal.pack}</p>
                <div className="flex items-baseline gap-2 mt-auto">
                  <span className="text-base font-extrabold text-slate-900">{deal.price}</span>
                  <span className="text-[11px] text-slate-400 line-through font-medium">{deal.oldPrice}</span>
                </div>
                <button className="w-full mt-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold tracking-widest uppercase transition-all duration-300 shadow-md active:scale-[0.98]">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* MOBILE FLOATING NAV BAR DOCK */}
      <nav className="fixed bottom-6 left-4 right-4 max-w-md mx-auto bg-white/80 backdrop-blur-2xl rounded-3xl p-2.5 flex items-center justify-between border border-white/50 shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-40">
        {mobileNavTabs.map((tab, idx) => {
          if (tab.isCenter) {
            return (
              <button 
                key={idx}
                onClick={() => setActiveTab(tab.label)}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-orange-500 text-white flex flex-col items-center justify-center shadow-[0_8px_25px_rgba(244,63,94,0.4)] transform -translate-y-6 hover:scale-105 active:scale-95 transition-all duration-500 z-50 border-[4px] border-white/90 backdrop-blur-sm"
              >
                {getIcon(tab.icon)}
              </button>
            );
          }
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(tab.label)}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-300 ${
                activeTab === tab.label ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`mb-1 transition-transform duration-300 ${activeTab === tab.label ? 'scale-110' : ''}`}>
                {getIcon(tab.icon)}
              </div>
              <span className="text-[10px] tracking-wide font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Product Detail Modal */}
      <ProductDetailModal selectedProduct={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default MobileAndTabletArchitecture;