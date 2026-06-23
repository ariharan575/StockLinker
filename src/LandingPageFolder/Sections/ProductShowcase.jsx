import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

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
  }, [options]);

  return { ref, isInView };
};

export default function ProductShowcasePlaceholder() {
  const { ref, isInView } = useScrollReveal({ threshold: 0.05, triggerOnce: false });
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Immersive Ergonomic 3D Parallax Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 40, stiffness: 160, mass: 0.65 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [2.5, -2.5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-500, 500], [-3.5, 3.5]), springConfig);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const height = rect.height;
    const centerX = e.clientX - rect.left - rect.width / 2;
    mouseX.set(centerX);
    mouseY.set(e.clientY - rect.top - height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const menuTabs = [
    'Dashboard', 
    'Search',
    'Prices', 
    'Orders', 
    'Routes', 
    'Inventory', 
    'Messages'
  ];

  // Orchestrated Entrance Stagger Timings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0, filter: 'blur(6px)' },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 95, damping: 15 }
    }
  };

  return (
    <section 
      ref={ref} 
      className="py-10 sm:py-16 md:py-32 relative overflow-hidden bg-[#F8FAFC] text-slate-900 select-none z-20 border-y border-slate-200/60"
    >
      {/* Light Cinematic Luxury Background Atmospheric Overlays */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-400/20 to-transparent" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1100px] h-[400px] md:h-[650px] bg-gradient-to-tr from-rose-300/20 via-pink-200/25 to-sky-200/20 rounded-full blur-[140px] pointer-events-none mix-blend-multiply animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-sky-200/15 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Abstract Grid Canvas Blueprint Blueprint Matrix */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a03_1px,transparent_1px),linear-gradient(to_bottom,#0f172a04_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" 
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Luxury, minimal, operational enterprise-grade typography styling */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-6 md:mb-14 max-w-4xl mx-auto"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-3 md:mb-4 text-slate-900 leading-[1.08] sm:leading-[1.05] antialiased"
          >
            Realtime Retail Infrastructure.{' '}
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(244,63,94,0.1)]">
              Connected Supplier Intelligence.
            </span>
          </motion.h2>
        </motion.div>
        
        {/* Navigation Switcher Tabs Container */}
        <div className="max-w-2xl mx-auto mb-6 md:mb-10 relative">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-nowrap overflow-x-auto gap-1.5 p-1.5 pb-2 rounded-xl bg-slate-200/40 border border-slate-300/30 backdrop-blur-xl custom-scrollbar touch-pan-x snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Ultra-thin neon indicator glowing scrollbar (1px or thinner, visible on mobile) */}
            <style dangerouslySetInnerHTML={{__html: `
              .custom-scrollbar::-webkit-scrollbar {
                height: 1px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
                margin-left: 12px;
                margin-right: 12px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: linear-gradient(90deg, rgba(244,63,94,0.25), rgba(236,72,153,0.3), rgba(56,189,248,0.25));
                border-radius: 99px;
                box-shadow: 0 0 4px rgba(244,63,94,0.1);
                transition: all 0.3s ease;
              }
              .custom-scrollbar:hover::-webkit-scrollbar-thumb,
              .custom-scrollbar:active::-webkit-scrollbar-thumb {
                background: linear-gradient(90deg, #f43f5e, #ec4899, #38bdf8);
                box-shadow: 0 0 8px rgba(244,63,94,0.4);
              }
            `}} />

            {menuTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap relative flex-1 md:flex-initial snap-shrink-0 ${
                  activeTab === tab ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeLightPlaceholderIndicator"
                    className="absolute inset-0 bg-white border border-slate-200/80 shadow-sm rounded-lg"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  {tab}
                  {tab === 'Messages' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_6px_#f43f5e]" />
                  )}
                </span>
              </button>
            ))}
          </motion.div>
        </div>
        
        {/* Chassis Canvas Mockup Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 30, filter: 'blur(6px)' }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.3 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative max-w-5xl mx-auto px-1 sm:px-4 group preserve-3d cursor-default"
        >
          {/* Subtle Ambient Shadow Glow Ring */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-pink-400/10 via-sky-400/5 to-transparent rounded-2xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />

          {/* Core Platform Illusion Surface Container */}
          <motion.div
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="w-full bg-white/95 rounded-2xl border border-slate-200 shadow-[0_30px_70px_-15px_rgba(15,23,42,0.06)] backdrop-blur-2xl relative overflow-hidden"
          >
            {/* Top Browser Ribbon Bar Decorator */}
            <div className="border-b border-slate-200/60 bg-slate-50 p-2 sm:p-2.5 flex items-center justify-between relative">
              <div className="flex gap-1.5 px-2">
                <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-rose-400/70 transition-colors duration-300" />
                <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-pink-400/70 transition-colors duration-300" />
                <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-sky-400/70 transition-colors duration-300" />
              </div>
              
              <div className="bg-slate-200/40 border border-slate-300/20 text-[10px] text-slate-400 font-mono px-4 sm:px-12 py-0.5 rounded-md min-w-[120px] sm:min-w-[240px] text-center tracking-wide truncate max-w-[180px] sm:max-w-none">
                app.stocklinker.com/{activeTab.toLowerCase()}
              </div>

              <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 pr-2">
                <span className="w-1 h-1 rounded-full bg-sky-400 animate-ping" />
                <span className="hidden sm:inline tracking-wider">SYSTEM_ACTIVE</span>
              </div>
            </div>

            {/* REFINED: Injected Inner Navbar to claim dashboard structure whitespace */}
            <div className="border-b border-slate-100 bg-white px-4 py-2 flex items-center justify-between text-[11px] font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-16 h-5 bg-slate-100 rounded animate-pulse hidden sm:block" />
                <div className="w-5 h-5 rounded-full bg-slate-200 animate-pulse" />
              </div>
            </div>

            {/* REFINED: Optimised compact min-height tracking adjustments for tight smartphone viewport screens */}
            <div className="p-3 sm:p-6 min-h-[240px] sm:min-h-[340px] md:min-h-[420px] relative bg-slate-50/20">
              
              {/* Ambient Cinematic Lighting Background Scanline Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/[0.01] to-transparent pointer-events-none animate-[pulse_6s_easeInOut_infinite]" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.99, filter: 'blur(2px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.99, filter: 'blur(2px)' }}
                  transition={{ duration: 0.18 }}
                  className="w-full h-full flex flex-col gap-3 sm:gap-5"
                >
                  {/* Realism Interface Blocks — Card Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="p-3 sm:p-4 rounded-xl bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.01)] relative overflow-hidden group/card transition-all duration-500 hover:shadow-[0_12px_32px_rgba(244,63,94,0.05)] hover:border-pink-200/60">
                        
                        {/* Shimmer Ambient Glow Element */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/30 to-transparent -translate-x-full group-hover/card:animate-[shimmer_2.5s_infinite] pointer-events-none" />
                        <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-rose-500/0 via-pink-400/0 to-sky-400/0 group-hover/card:from-rose-500/10 group-hover/card:via-pink-400/10 group-hover/card:to-sky-400/0 transition-all duration-500 pointer-events-none" />
                        
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <div className="w-1/2 h-2 bg-slate-200/70 rounded relative overflow-hidden" />
                          <span className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-rose-400/80 shadow-[0_0_6px_#f43f5e]' : i === 3 ? 'bg-sky-400/80 shadow-[0_0_6px_#38bdf8]' : 'bg-slate-200'} animate-pulse`} />
                        </div>
                        <div className="w-5/6 h-3.5 sm:h-4 bg-gradient-to-r from-slate-200/80 to-slate-100/60 rounded mb-1.5 sm:mb-2 relative overflow-hidden" />
                        <div className="w-1/3 h-1.5 bg-slate-100/80 rounded" />
                      </div>
                    ))}
                  </div>

                  {/* Realism Analytics Module / Node Pipeline Area */}
                  <div className="flex-1 min-h-[110px] sm:min-h-[180px] md:min-h-[200px] bg-white/70 border border-slate-200/60 rounded-xl p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden group/graph shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/20 to-transparent -translate-x-full group-hover/graph:animate-[shimmer_3s_infinite] pointer-events-none" />
                    
                    {/* Continuous Breathing Glow Mesh */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-400/[0.03] via-sky-400/[0.01] to-transparent rounded-full blur-2xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
                    <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-pink-400/20 to-transparent animate-pulse top-10 sm:top-12 pointer-events-none" style={{ animationDuration: '5s' }} />
                    
                    <div className="flex justify-between items-center z-10">
                      <div className="space-y-1">
                        <div className="w-32 sm:w-40 h-2 sm:h-2.5 bg-slate-200/70 rounded relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_2s_infinite]" />
                        </div>
                        <div className="w-20 sm:w-24 h-1.5 bg-slate-100 rounded" />
                      </div>
                      <div className="w-14 sm:w-16 h-3.5 sm:h-4 rounded-full bg-pink-50/40 border border-pink-100/50 flex items-center justify-center backdrop-blur-sm">
                        <span className="w-1 h-1 rounded-full bg-pink-400 animate-ping mr-1" />
                        <span className="w-5 sm:w-6 h-1 bg-pink-200/80 rounded" />
                      </div>
                    </div>

                    {/* Luminous Animated Height-Breathing Graph Skeletons */}
                    <div className="h-14 sm:h-28 md:h-36 flex items-end justify-between gap-0.5 sm:gap-2 pt-4 sm:pt-6 px-0.5 sm:px-1 relative">
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                        {[1, 2, 3].map(i => <div key={i} className="w-full h-px border-b border-dashed border-slate-300" />)}
                      </div>
                      
                      {[35, 58, 42, 75, 50, 92, 64, 78, 48, 68, 82, 95, 55, 74, 62, 88].map((h, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ height: 0 }}
                          animate={{ height: [`${h - 2}%`, `${h + 3}%`, `${h - 2}%`] }}
                          transition={{ 
                            duration: 4 + (idx % 3), 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: idx * 0.08 
                          }}
                          className="w-full bg-gradient-to-t from-pink-500/[0.02] via-pink-400/15 to-sky-400/30 rounded-t-[1px] sm:rounded-t-[2px] max-h-[85%] relative group/bar transition-all duration-300 hover:to-rose-400/50 shadow-[0_0_10px_rgba(56,189,248,0.05)]"
                        >
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Lower Stack Split Complement Smart Components */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4">
                    <div className="p-3 rounded-xl bg-white/90 border border-slate-200/60 flex items-center justify-between relative overflow-hidden group/btm transition-all duration-300 hover:border-pink-200/60 shadow-sm">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/30 to-transparent -translate-x-full group-hover/btm:animate-[shimmer_2s_infinite] pointer-events-none" />
                      <div className="flex items-center gap-2.5 sm:gap-3 w-full">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-sky-50 border border-sky-400/30 animate-pulse" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="w-1/3 h-2 bg-slate-200/70 rounded" />
                          <div className="w-2/3 h-1.5 bg-slate-100/80 rounded" />
                        </div>
                      </div>
                      <div className="w-10 sm:w-12 h-3.5 sm:h-4 rounded-full bg-slate-100/80 border border-slate-200/40" />
                    </div>

                    <div className="p-3 rounded-xl bg-white/90 border border-slate-200/60 flex items-center justify-between relative overflow-hidden group/btm2 transition-all duration-300 hover:border-rose-200/60 shadow-sm">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/30 to-transparent -translate-x-full group-hover/btm2:animate-[shimmer_2s_infinite] pointer-events-none" />
                      <div className="flex items-center gap-2.5 sm:gap-3 w-full">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded bg-rose-50 border border-rose-400/30 animate-pulse" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="w-1/4 h-2 bg-slate-200/70 rounded" />
                          <div className="w-1/2 h-1.5 bg-slate-100/80 rounded" />
                        </div>
                      </div>
                      <div className="w-7 sm:w-8 h-3.5 sm:h-4 rounded-md bg-rose-50/40 border border-rose-100/40" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Glass Mirror Light Reflective Diagonal Sweep Veil */}
            <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-40 group-hover:animate-[shimmer_3s_infinite] pointer-events-none" />
          </motion.div>
          
          {/* Bottom Plastic Hardware Alignment Guard Accent */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 sm:w-28 h-1 bg-slate-300 border-b border-x border-white rounded-b-xl shadow-md pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}