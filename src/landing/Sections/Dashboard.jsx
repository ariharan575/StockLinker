import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

// --- Premium Apple-style Easing Curve ---
const easePremium = [0.16, 1, 0.3, 1];

// --- Extracted Static Data (Prevents Re-creation on Render) ---
const MENU_TABS = ['Dashboard', 'Search', 'Prices', 'Orders', 'Routes', 'Inventory', 'Messages'];

const NEARBY_SELLERS = [
  { id: 'kt', init: 'KT', type: 'Nearby Seller', typeColor: 'text-slate-500', name: 'Kumar Traders', verified: true, status: 'Live', statusDot: 'bg-emerald-500', dist: '1.4 km', info: '425 Products', rating: '4.9', avatarGrad: 'from-sky-500 to-blue-600', badgeColor: 'bg-white/90 ring-slate-100 text-slate-700' },
  { id: 'fw', init: 'FW', type: 'Verified Seller', typeColor: 'text-slate-500', name: 'Fresh Wholesale', verified: true, status: 'Open', statusDot: 'bg-slate-400', dist: '2.1 km', info: '612 Products', rating: '4.8', avatarGrad: 'from-emerald-500 to-teal-600', badgeColor: 'bg-white/90 ring-slate-100 text-slate-700' },
  { id: 'rs', init: 'RS', type: 'Nearby Buyer', typeColor: 'text-rose-500', name: 'Royal Super Market', verified: false, status: 'Urgent', statusDot: null, dist: '850 m', info: 'Need Rice', rating: '₹12,500', isValue: true, avatarGrad: 'from-rose-500 to-pink-600', badgeColor: 'bg-rose-50 ring-rose-100 text-rose-700' },
  { id: 'ag', init: 'AG', type: 'Nearby Buyer', typeColor: 'text-rose-500', name: 'ABC Grocery', verified: true, status: 'Bulk Order', statusDot: null, dist: '1.9 km', info: 'Need Cooking Oil', rating: 'Verified', isText: true, avatarGrad: 'from-rose-500 to-pink-600', badgeColor: 'bg-slate-50 ring-slate-100 text-slate-700' }
];

const COMPARISON_DATA = [
  { name: 'Kumar Traders', dist: '1.2 km', qty: '520 Bags', price: '₹948', gst: 'Included', del: 'Today', rtg: '5.0', best: true },
  { name: 'Fresh Wholesale', dist: '2.1 km', qty: '610 Bags', price: '₹952', gst: 'Included', del: 'Today', rtg: '5.0' },
  { name: 'Metro Suppliers', dist: '3.4 km', qty: '950 Bags', price: '₹955', gst: 'Included', del: 'Tomorrow', rtg: '5.0' },
  { name: 'Anand Traders', dist: '1.8 km', qty: '430 Bags', price: '₹960', gst: 'Included', del: 'Today', rtg: '4.0' }
];

const ORDER_STATS = [
  { label: 'Packed', val: 45, max: 142, color: 'bg-blue-500' },
  { label: 'Processing', val: 32, max: 142, color: 'bg-amber-500' },
  { label: 'Out', val: 15, max: 142, color: 'bg-rose-500' },
  { label: 'Delivered', val: 50, max: 142, color: 'bg-emerald-500' }
];

const RECENT_ORDERS = [
  { id: '#901', name: 'Metro Mart', prod: 'Rice 25kg', qty: '10x', stat: 'Out', time: '10:30 AM', statColor: 'text-rose-700 bg-rose-50 border-rose-200/60' },
  { id: '#902', name: 'City Store', prod: 'Sugar 50kg', qty: '5x', stat: 'Proc', time: '11:15 AM', statColor: 'text-amber-700 bg-amber-50 border-amber-200/60' },
  { id: '#903', name: 'Royal Mkt', prod: 'Oil 15L', qty: '20x', stat: 'Pack', time: '12:00 PM', statColor: 'text-blue-700 bg-blue-50 border-blue-200/60' },
  { id: '#904', name: 'Fresh Groc', prod: 'Wheat 10kg', qty: '15x', stat: 'Del', time: '09:00 AM', statColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/60' }
];

// --- Custom Viewport Intersection Observer Hook ---
const useScrollReveal = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (options.triggerOnce) observer.unobserve(entry.target);
      }
    }, { threshold: options.threshold || 0.1, ...options });

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options.threshold, options.triggerOnce]);

  return { ref, isInView };
};

// --- Reusable SVG Icons (Memoized for Stable Rendering) ---
const VerifiedBadge = React.memo(({ className = "w-3 h-3 text-emerald-500" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.602 1.672a.818.818 0 0 1 .796 0l2.369 1.258a.818.818 0 0 0 .61.054l2.585-.826a.818.818 0 0 1 1.01.621l.666 2.62a.818.818 0 0 0 .422.545l2.42 1.157a.818.818 0 0 1 .374 1.127l-1.306 2.368a.818.818 0 0 0 0 .611l1.306 2.367a.818.818 0 0 1-.374 1.128l-2.42 1.156a.818.818 0 0 0-.422.546l-.666 2.619a.818.818 0 0 1-1.01.621l-2.585-.826a.818.818 0 0 0-.61.054l-2.37 1.258a.818.818 0 0 1-.795 0l-2.37-1.258a.818.818 0 0 0-.61-.054l-2.585.826a.818.818 0 0 1-1.01-.621l-.666-2.62a.818.818 0 0 0-.422-.545l-2.42-1.157a.818.818 0 0 1-.374-1.127l1.306-2.368a.818.818 0 0 0 0-.611L1.246 9.382a.818.818 0 0 1 .374-1.128l2.42-1.156a.818.818 0 0 0 .422-.546l.666-2.619a.818.818 0 0 1 1.01-.621l2.585.826a.818.818 0 0 0 .61-.054l2.37-1.258Z" opacity="0.2"/>
    <path d="M10.97 16.03a.75.75 0 0 1-.53-.22l-2.97-2.97a.75.75 0 1 1 1.06-1.06l2.44 2.44 5.97-5.97a.75.75 0 0 1 1.06 1.06l-6.5 6.5a.75.75 0 0 1-.53.22Z"/>
  </svg>
));

const LocationPin = React.memo(() => (
  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
));

const StarIcon = React.memo(() => (
  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
));

export default function ProductShowcasePlaceholder() {
  const { ref, isInView } = useScrollReveal({ threshold: 0.05, triggerOnce: true });
  const activeTab = 'Dashboard';

  // Optimized Parallax Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 40, stiffness: 160, mass: 0.65 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [2.5, -2.5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-500, 500], [-3.5, 3.5]), springConfig);

  const requestRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    // Disable on touch devices to prevent lag
    if (window.innerWidth < 1024) return;
  
    // Throttle updates via RequestAnimationFrame
    if (requestRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    requestRef.current = requestAnimationFrame(() => {
      const height = rect.height;
      const centerX = clientX - rect.left - rect.width / 2;
      mouseX.set(centerX);
      mouseY.set(clientY - rect.top - height / 2);
      requestRef.current = null;
    });
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    if (window.innerWidth < 1024) return;
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 30, opacity: 0, scale: 0.98 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.8, ease: easePremium } }
  }), []);

  return (
    <section 
      ref={ref} 
      className="py-16 md:py-24 relative overflow-hidden bg-[#F8FAFC] text-slate-900 select-none z-20 border-y border-slate-200/60"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      
      {/* Optimized background glow (Static, no transforms) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[700px] h-[300px] md:h-[450px] bg-gradient-to-tr from-rose-100 via-pink-50 to-sky-100 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-sky-100/50 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-10 max-w-4xl mx-auto relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-gradient-to-r from-pink-200 via-rose-200 to-sky-200 blur-2xl opacity-40 pointer-events-none" />
          
          <motion.h2 
            variants={itemVariants}
            className="text-[40px] sm:text-[58px] md:text-[60px] font-[900] tracking-[-0.06em] leading-[1.0] mb-6 md:mb-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent relative z-10 will-change-transform translate-z-0"
            > Business Intelligence Dashboard
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-[16px] sm:text-[18px] font-medium text-slate-500 max-w-[720px] mx-auto leading-relaxed tracking-tight relative z-10 will-change-transform translate-z-0"
          >
            One intelligent workspace to discover nearby suppliers, compare wholesale prices instantly, manage inventory, track live orders, and grow your business faster.
          </motion.p>
        </motion.div>
        
        <div className="max-w-2xl mx-auto mb-10 md:mb-14 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: easePremium }}
            className="flex flex-nowrap overflow-x-auto gap-1.5 p-1.5 pb-2 rounded-xl bg-slate-200/40 border border-slate-300/30 backdrop-blur-xl custom-scrollbar touch-pan-x snap-x snap-mandatory will-change-transform translate-z-0"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <style dangerouslySetInnerHTML={{__html: `
              .custom-scrollbar::-webkit-scrollbar { height: 1px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: transparent; margin: 0 12px; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 99px; }
            `}} />

            {MENU_TABS.map(tab => (
              <button
                key={tab}
                className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap relative flex-1 md:flex-initial snap-shrink-0
                  ${activeTab === tab 
                    ? 'text-slate-900 bg-white border border-slate-200/80 shadow-sm pointer-events-auto cursor-default' 
                    : 'text-slate-500 opacity-55 pointer-events-none cursor-default'
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  {tab}
                  {tab === 'Messages' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_4px_#f43f5e]" />
                  )}
                </span>
              </button>
            ))}
          </motion.div>
        </div>
        
        {/* PREMIUM GPU-ACCELERATED 3D CONTAINER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: easePremium, delay: 0.3 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative max-w-5xl mx-auto px-1 sm:px-4 group preserve-3d cursor-default will-change-transform translate-z-0"
        >
          <div className="absolute -inset-1 bg-gradient-to-tr from-pink-400/5 via-sky-400/5 to-transparent rounded-2xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />

          <motion.div
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="w-full bg-white/90 backdrop-blur-2xl rounded-[28px] border border-white/70 ring-1 ring-slate-200/60 shadow-[0_10px_30px_rgba(15,23,42,.06),0_20px_60px_rgba(15,23,42,.08)] relative overflow-hidden transform-gpu"
          >
            <div className="border-b border-white/40 bg-white/80 p-2 sm:p-2.5 flex items-center justify-between relative z-20">
              <div className="flex gap-1.5 px-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-rose-400/80 transition-colors duration-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-amber-400/80 transition-colors duration-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-emerald-400/80 transition-colors duration-300" />
              </div>
              <div className="bg-slate-100 border border-white ring-1 ring-slate-200 text-[10px] text-slate-500 font-medium px-4 sm:px-12 py-1 rounded-lg min-w-[120px] sm:min-w-[240px] text-center tracking-wide truncate max-w-[180px] sm:max-w-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                app.stocklinker.com/dashboard
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500 pr-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                <span className="hidden sm:inline tracking-wide">Connected</span>
              </div>
            </div>

            <div className="border-b border-slate-100 bg-white/90 px-5 py-3 flex items-center justify-between text-[11px] font-medium z-20 relative">
              <div className="flex items-center gap-4">
                <span className="text-slate-900 font-[800] tracking-[-0.04em] hidden sm:block text-sm">StockLinker</span>
                <span className="w-px h-3.5 bg-slate-200 hidden sm:block" />
                <span className="text-slate-400 flex items-center gap-1"><LocationPin /> Salem, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 ring-2 ring-white shadow-sm flex items-center justify-center text-[9px] font-bold text-white">
                  AB
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-6 min-h-[240px] sm:min-h-[340px] md:min-h-[420px] relative bg-slate-50/50">
              
              <motion.div
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: easePremium }}
                className="w-full h-full flex flex-col gap-3 sm:gap-5 will-change-transform translate-z-0"
              >
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
                  {NEARBY_SELLERS.map((card) => (
                    <motion.div 
                      key={card.id} 
                      whileHover={{ y: -4 }} 
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="p-3 sm:p-4 rounded-xl bg-white border border-white ring-1 ring-slate-200/70 shadow-sm hover:shadow-xl hover:border-slate-300 transition-colors duration-300 flex flex-col justify-between h-[85px] sm:h-[100px] will-change-transform translate-z-0 cursor-default"
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className="flex items-center gap-2 sm:gap-2.5 overflow-hidden">
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${card.avatarGrad} shadow-lg ring-2 ring-white flex-shrink-0 flex items-center justify-center text-white font-bold text-[9px] sm:text-[11px]`}>{card.init}</div>
                          <div className="min-w-0">
                            <div className={`text-[8px] sm:text-[9px] font-semibold tracking-wide uppercase leading-none ${card.typeColor}`}>{card.type}</div>
                            <div className="text-[10px] sm:text-xs font-bold text-slate-900 truncate mt-1 flex items-center gap-1">
                              {card.name} {card.verified && <VerifiedBadge className="w-3.5 h-3.5 text-emerald-500" />}
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full font-bold border border-slate-200/60 shadow-sm ring-1 flex-shrink-0 ${card.badgeColor}`}>
                          {card.statusDot && <span className={`w-1.5 h-1.5 rounded-full ${card.statusDot}`}/>} {card.status}
                        </div>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] sm:text-[10px] text-slate-500 flex items-center gap-1"><LocationPin /> {card.dist}</span>
                          <span className="text-[9px] sm:text-[10px] font-medium text-slate-700">{card.info}</span>
                        </div>
                        {card.isValue ? (
                           <div className="text-[9px] sm:text-[10px] font-bold text-emerald-600 text-right leading-tight">
                             <span className="text-[8px] text-slate-400 block font-normal">Order Value</span>
                             {card.rating}
                           </div>
                        ) : card.isText ? (
                          <div className="text-[10px] sm:text-[11px] font-medium text-slate-500">{card.rating}</div>
                        ) : (
                          <div className="text-[10px] sm:text-[11px] font-bold text-slate-800 flex items-center gap-0.5"><StarIcon /> {card.rating}</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex-1 min-h-[110px] sm:min-h-[180px] md:min-h-[200px] bg-white border border-white ring-1 ring-slate-200/70 rounded-2xl p-3 flex flex-col md:flex-row gap-2 sm:gap-4 shadow-sm overflow-hidden">
                  
                  <div className="flex-1 flex flex-col overflow-hidden h-full">
                    <div className="flex justify-between items-center mb-2 sm:mb-3 px-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[12px] sm:text-sm font-[800] text-slate-900 leading-none">Compare Product Price</h3>
                      </div>
                      <div className="bg-white border border-slate-200/80 text-slate-600 text-[9px] sm:text-[10px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 shadow-sm ring-1 ring-slate-100/50">
                        <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        Rice 25kg
                      </div>
                    </div>
                    
                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-white shadow-[0_1px_0_0_#e2e8f0] z-10">
                          <tr className="text-[9px] sm:text-[10px] text-slate-500 font-semibold uppercase tracking-[0.15em]">
                            <th className="py-2 px-2">Seller</th>
                            <th className="py-2 px-1 hidden sm:table-cell text-center">Distance</th>
                            <th className="py-2 px-2 text-right">Qty</th>
                            <th className="py-2 px-2 text-right text-slate-900">Unit Price</th>
                            <th className="py-2 px-1 hidden md:table-cell text-center">GST</th>
                            <th className="py-2 px-1 hidden lg:table-cell text-center">Delivery</th>
                            <th className="py-2 px-1 text-center">Rating</th>
                            <th className="py-2 px-2"></th>
                          </tr>
                        </thead>
                        <tbody className="text-[9px] sm:text-[11px]">
                          {COMPARISON_DATA.map((row, idx) => (
                            <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group">
                              <td className="py-2.5 px-2 font-semibold text-slate-800 truncate max-w-[90px] sm:max-w-[140px] flex items-center gap-1.5">
                                {row.name} {row.best && <VerifiedBadge />}
                              </td>
                              <td className="py-2.5 px-1 hidden sm:table-cell text-slate-500 text-center font-medium">{row.dist}</td>
                              <td className="py-2.5 px-2 text-right font-medium text-slate-600">{row.qty}</td>
                              <td className="py-2.5 px-2 text-right font-bold text-slate-900">{row.price}</td>
                              <td className="py-2.5 px-1 hidden md:table-cell text-center text-slate-500 font-medium">{row.gst}</td>
                              <td className={`py-2.5 px-1 hidden lg:table-cell text-center font-semibold ${row.del === 'Today' ? 'text-emerald-600' : 'text-slate-500'}`}>{row.del}</td>
                              <td className="py-2.5 px-1 text-center font-bold text-slate-700 flex items-center justify-center gap-1"><StarIcon /> {row.rtg}</td>
                              <td className="py-2.5 px-2 text-right">
                                <button className="text-[9px] sm:text-[10px] bg-gradient-to-b from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white px-3 sm:px-4 py-1.5 rounded-xl transition-all font-semibold whitespace-nowrap shadow-md">
                                  Compare
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col w-[170px] lg:w-[200px] border border-emerald-100/50 bg-emerald-50/40 rounded-2xl p-3 justify-between">
                    <div>
                      <div className="bg-white/90 text-emerald-700 text-[9px] lg:text-[10px] font-bold px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 mb-3 shadow-sm border border-emerald-100/60 uppercase tracking-[0.1em]">
                        <VerifiedBadge /> Best Choice
                      </div>
                      <div className="space-y-2 lg:space-y-3">
                        <div className="flex justify-between items-center text-[10px] lg:text-xs">
                          <span className="text-slate-500 font-medium">Lowest Price</span>
                          <span className="font-bold text-slate-900 bg-white shadow-sm border border-slate-100 px-2 py-0.5 rounded-md">₹948</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] lg:text-xs">
                          <span className="text-slate-500 font-medium">Delivery</span>
                          <span className="font-bold text-emerald-600">Fastest (Today)</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] lg:text-xs">
                          <span className="text-slate-500 font-medium">Highest Rating</span>
                          <span className="font-bold text-slate-900 flex items-center gap-1"><StarIcon /> 5.0</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] lg:text-xs">
                          <span className="text-slate-500 font-medium">Availability</span>
                          <span className="font-semibold text-slate-800">520 Bags</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2.5 border-t border-emerald-100/60 mt-3">
                      <div className="flex justify-between items-center text-[10px] lg:text-xs">
                        <span className="text-slate-500 font-medium">Est. Savings</span>
                        <span className="font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200/50 shadow-sm">1.2% / Bag</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4 h-[120px] sm:h-[130px]">
                  <div className="p-3 sm:p-4 rounded-xl bg-white border border-white ring-1 ring-slate-200/70 shadow-sm flex flex-col justify-between group hover:border-slate-300 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-[0.1em]">Today's Orders</h4>
                      <span className="text-[9px] text-slate-500 font-bold border border-slate-200 shadow-sm px-2 py-0.5 rounded-full bg-slate-50">Live</span>
                    </div>
                    <div className="flex items-end justify-between flex-1">
                      <div className="flex flex-col mb-1">
                        <span className="text-4xl sm:text-5xl font-[900] tracking-[-0.06em] text-slate-900 leading-none">142</span>
                        <span className="text-[9px] sm:text-[10px] text-emerald-700 font-semibold mt-2 bg-emerald-50 border border-emerald-100/50 shadow-sm px-2 py-1 rounded-md w-max">↑ +12% vs Yesterday</span>
                      </div>
                      <div className="w-[120px] sm:w-[150px] flex flex-col gap-1.5 sm:gap-2 mb-1">
                        {ORDER_STATS.map((stat, i) => (
                          <div key={i} className="flex items-center gap-2 text-[8px] sm:text-[9px]">
                            <span className="w-12 text-slate-500 font-medium text-right">{stat.label}</span>
                            <div className="flex-1 h-2 bg-slate-100/50 rounded-full overflow-hidden border border-slate-200/30">
                              <motion.div 
                                initial={{ scaleX: 0 }}
                                animate={isInView ? { scaleX: stat.val/stat.max } : {}}
                                transition={{ duration: 1.2, delay: 0.4 + (i*0.1), ease: easePremium }}
                                style={{ transformOrigin: "left", willChange: "transform" }}
                                className={`h-full w-full rounded-full ${stat.color} shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] translate-z-0`} 
                              />
                            </div>
                            <span className="w-4 font-bold text-slate-700">{stat.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl bg-white border border-white ring-1 ring-slate-200/70 shadow-sm flex flex-col h-full overflow-hidden group hover:border-slate-300 transition-colors">
                    <div className="flex justify-between items-center mb-2.5">
                      <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-[0.1em]">Recent Orders</h4>
                      <button className="text-[9px] text-slate-500 font-bold hover:text-slate-800 transition-colors">View All</button>
                    </div>
                    <div className="flex flex-col flex-1 justify-between gap-1.5 overflow-hidden">
                      {RECENT_ORDERS.map((o, i) => (
                        <div key={i} className="flex justify-between items-center bg-white rounded-xl p-1.5 sm:p-2 border border-white shadow-sm ring-1 ring-slate-100/80 hover:ring-slate-200 transition-colors text-[9px] sm:text-[10px]">
                          <div className="flex gap-2 items-center w-[45%] pl-1">
                            <span className="font-mono text-slate-400 font-medium">{o.id}</span>
                            <span className="font-bold text-slate-800 truncate">{o.name}</span>
                          </div>
                          <div className="w-[30%] truncate text-slate-500 font-medium">
                            {o.prod} <span className="font-bold text-slate-700 ml-0.5">{o.qty}</span>
                          </div>
                          <div className="w-[25%] flex justify-end gap-2 items-center pr-1">
                            <span className="hidden lg:inline text-[8px] text-slate-400 font-medium">{o.time}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border shadow-sm ${o.statColor}`}>{o.stat}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>

            <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40 pointer-events-none" />
          </motion.div>
          
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 sm:w-28 h-1 bg-slate-200 border-b border-x border-white rounded-b-xl shadow-md pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}