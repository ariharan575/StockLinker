import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileAndTabletArchitecture from './MobileAndTabletArchitecture';
import DesktopAndLaptopArchitecture from './DesktopAndLaptopArchitecture';
import { PREMIUM_EASE } from '../animations/variants';

const StockLinkerHomepage = () => {
  const [viewportMode, setViewportMode] = useState('auto');
  const [currentWidth, setCurrentWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [activeTab, setActiveTab] = useState('Home');
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleResize = () => setCurrentWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getEffectiveLayout = () => {
    if (viewportMode !== 'auto') return viewportMode;
    if (currentWidth < 640) return 'mobile';
    if (currentWidth < 1024) return 'tablet';
    if (currentWidth < 1440) return 'laptop';
    return 'desktop';
  };

  const layout = getEffectiveLayout();
  const isMobileOrTablet = layout === 'mobile' || layout === 'tablet';

  return (
    <div className={`min-h-screen font-sans antialiased overflow-x-hidden ${isMobileOrTablet ? 'bg-slate-50 text-slate-900 selection:bg-rose-500/30 selection:text-rose-900' : 'bg-[#f8fafc] text-slate-900 selection:bg-rose-500/20 selection:text-rose-900'}`}>

      {/* ==========================================
          MAIN RENDER ENGINE CONTEXT SWITCHER
          ========================================== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isMobileOrTablet ? 'mobile' : 'desktop'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: PREMIUM_EASE }}
          className="transition-all duration-700 ease-out"
        >
          {isMobileOrTablet ? (
            <MobileAndTabletArchitecture 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              layoutType={layout}
            />
          ) : (
            <DesktopAndLaptopArchitecture 
              activeNav={activeTab} 
              setActiveNav={setActiveTab} 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StockLinkerHomepage;