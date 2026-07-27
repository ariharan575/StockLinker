import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, LogOut } from 'lucide-react';
import { NAV_ITEMS } from '../data';

const NavItem = memo(({ item, isActive, isChildActive, active, setActive, setOpen, navigate }) => {
  const [isExpanded, setIsExpanded] = useState(isChildActive);
  const hasChildren = !!item.children;

  useEffect(() => {
    if (isChildActive) setIsExpanded(true);
  }, [isChildActive]);

const handleClick = useCallback(() => {
  if (hasChildren) {
    setIsExpanded((prev) => !prev);
  } else {
    setActive(item.id);
    if (window.innerWidth < 1024) setOpen(false);
    if (item.path) {
      // If it's a settings child item, navigate to the specific section
      if (item.id === 'settings' && item.path) {
        navigate('/settings/account'); // Default to account
      } else {
        navigate(item.path);
      }
    }
  }
}, [hasChildren, item, setActive, setOpen, navigate]);


  return (
    <div className="flex flex-col w-full mb-1">
      <motion.button
        onClick={handleClick}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold relative group transition-colors duration-200
          ${isActive || isChildActive
            ? 'text-white bg-white/[0.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-white/[0.06]'
            : 'text-white/60 hover:text-white border border-transparent'
          }
        `}
      >
        {/* Luxury Active Gradient Indicator */}
        <AnimatePresence>
          {(isActive || (isChildActive && !isExpanded)) && (
            <motion.div
              layoutId="active-indicator"
              className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full bg-gradient-to-b from-[#3B82F6] via-[#7C3AED] to-[#EC4899] shadow-[0_0_12px_rgba(124,58,237,0.6)]"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          )}
        </AnimatePresence>

        <motion.div
          transition={{ duration: 0.2 }}
          whileHover={{ rotate: 2, scale: 1.05 }}
        >
          <item.Icon
            strokeWidth={isActive || isChildActive ? 2.5 : 2}
            className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200 ${
              isActive || isChildActive 
                ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' 
                : 'text-white/40 group-hover:text-white/90'
            }`}
          />
        </motion.div>
        
        <span className="flex-1 text-left tracking-wide">{item.label}</span>
        
        {item.badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#3B82F6]/20 to-[#7C3AED]/20 border border-white/[0.05] text-[#8B5CF6]">
            {item.badge}
          </span>
        )}

        {hasChildren && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <ChevronRight className="w-[16px] h-[16px] text-white/40 group-hover:text-white/90 transition-colors" />
          </motion.div>
        )}
      </motion.button>

      {/* Expanded Accordion with Pill Children */}
      {hasChildren && (
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 250, damping: 26 }}
              className="overflow-hidden flex flex-col gap-0.5 pl-9 pr-2 mt-1"
            >
              {item.children.map((child, i) => {
                const isChildCurrent = active === child.id;
                return (
                  <motion.button
                    key={child.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, type: 'spring' }}
                    onClick={() => {
                      setActive(child.id);
                      if (window.innerWidth < 1024) setOpen(false);
                      if (child.path) navigate(child.path);
                    }}
                    whileHover={{ x: 3, backgroundColor: 'rgba(255,255,255,0.04)' }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 border border-transparent group
                      ${isChildCurrent 
                        ? 'text-white font-semibold bg-white/[0.03] border-white/[0.05]' 
                        : 'text-white/50 hover:text-white'
                      }`}
                  >
                    {/* Render Child Icon if it exists, fallback to dot indicator */}
                    {child.Icon ? (
                      <child.Icon 
                        strokeWidth={isChildCurrent ? 2.5 : 2}
                        className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                          isChildCurrent 
                            ? 'text-[#EC4899] drop-shadow-[0_0_6px_rgba(236,72,153,0.4)]' 
                            : 'text-white/30 group-hover:text-white/70'
                        }`} 
                      />
                    ) : (
                      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isChildCurrent ? 'bg-gradient-to-r from-[#3B82F6] to-[#EC4899] shadow-[0_0_6px_rgba(236,72,153,0.6)]' : 'bg-white/20'
                      }`} />
                    )}
                    
                    <span className="tracking-wide">{child.label}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
});

export default function Sidebar({ open, setOpen, active, setActive }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    let foundActive = false;

    NAV_ITEMS.forEach(item => {
      if (item.path && currentPath.includes(item.path)) {
        setActive(item.id);
        foundActive = true;
      }
      if (item.children) {
        item.children.forEach(child => {
          if (child.path && currentPath.includes(child.path)) {
            setActive(child.id);
            foundActive = true;
          }
        });
      }
    });
    
    if (!foundActive && currentPath === '/') setActive('home');
  }, [location.pathname, setActive]);

  const checkChildActive = useCallback((children) => {
    if (!children) return false;
    return children.some(child => child.id === active);
  }, [active]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .luxury-scrollbar::-webkit-scrollbar { width: 3px; }
        .luxury-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .luxury-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .luxury-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); }
      `}} />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0B1220]/80 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-[64px] bottom-0 w-[260px] z-50 flex flex-col
          bg-[#20263D] border-r border-white/[0.06] overflow-hidden
          transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          boxShadow: '4px 0 32px rgba(0,0,0,0.45)',
        }}
      >
        {/* Soft Radial Lighting Layer */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-[#3B82F6]/5 via-transparent to-transparent pointer-events-none" />

        <nav className="flex-1 py-5 px-3 overflow-y-auto luxury-scrollbar relative z-10">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={active === item.id}
              isChildActive={checkChildActive(item.children)}
              active={active}
              setActive={setActive}
              setOpen={setOpen}
              navigate={navigate}
            />
          ))}
        </nav>

         <div className="p-4  shrink-0  backdrop-blur-sm relative z-10 flex flex-col gap-2">
        

          {/* Logout Button */}
          <motion.button
            style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold relative group transition-colors duration-200 text-white/50 hover:text-[#F87171]"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(239,68,68,0.5)] transition-all duration-300" />
            <span className="flex-1 text-left tracking-wide">Logout</span>
          </motion.button>
         </div>
                  {/* Profile Details Container */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors cursor-pointer mb-1">
            {/* Profile Picture Placeholder - You can swap with an <img> tag if you have a URL */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#7C3AED] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(124,58,237,0.3)] shrink-0 border border-white/20">
              JD
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white truncate tracking-wide">John Doe</span>
              <span className="text-[11px] font-medium text-[#EC4899] truncate uppercase tracking-wider">Retailer</span>
            </div>
          </div>

        {/* Bottom Profile and Logout Section */}

      </aside>
    </>
  );
}