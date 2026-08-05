import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getNavTabs } from './data/index';
import { useAuth } from '../Authentication/context/AuthContext'; // <-- Import added

const BottomNavigation = memo(({ active, setActive }) => {
  const navigate = useNavigate();
  
  // FETCH SECURE JWT ROLE
  const { role } = useAuth();
  
  // GENERATE DYNAMIC TABS
  const NAV_TABS = getNavTabs(role);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (setActive) setActive(tab.id);
                navigate(tab.path);
              }}
              className="relative flex flex-col items-center justify-center w-full h-full space-y-1 group touch-manipulation"
              aria-label={tab.label}
            >
              <div className="relative flex items-center justify-center w-12 h-8">
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 rounded-full opacity-[0.15] bg-gradient-to-r from-[#3B82F6] via-[#7C3AED] to-[#EC4899]"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <tab.Icon
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`w-[22px] h-[22px] transition-colors duration-200 ${
                      isActive 
                        ? 'text-[#8B5CF6] drop-shadow-sm' 
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                </motion.div>
              </div>
              <span 
                className={`text-[10px] font-semibold transition-colors duration-200 ${
                  isActive ? 'text-[#8B5CF6]' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default BottomNavigation;