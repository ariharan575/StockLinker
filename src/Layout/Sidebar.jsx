import React, { useState, memo, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, LogOut, X } from 'lucide-react';
import { getNavItems } from './data/index'; 
import { useAuth } from '../Authentication/context/AuthContext';

// Helper to get 2 initials safely
const getInitials = (name) => {
  if (!name || name === "Loading...") return "US";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
};

// ==========================================
// REUSABLE SUBCOMPONENTS
// ==========================================

const DesktopNavItem = memo(({ item, currentPath, navigate }) => {
  const hasChildren = !!item.children;
  const isChildActive = hasChildren && item.children.some(c => c.path === currentPath);
  const isActive = item.path === currentPath || isChildActive;

  const [expanded, setExpanded] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) {
      setExpanded(true);
    }
  }, [isChildActive]);

  const handleClick = useCallback(() => {
    if (hasChildren) {
      setExpanded(prev => !prev);
      if (item.path && item.path !== currentPath) navigate(item.path);
    } else {
      if (item.path) navigate(item.path);
    }
  }, [hasChildren, item, currentPath, navigate]);

  return (
    <div className="flex flex-col w-full mb-1">
      <motion.button
        onClick={handleClick}
        whileHover={!isActive ? { backgroundColor: 'rgba(255,255,255,0.03)' } : {}}
        whileTap={{ scale: 0.98 }}
        className={`w-full h-[42px] px-3 flex items-center gap-3.5 rounded-xl transition-all duration-200 group relative outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50
          ${isActive 
            ? 'bg-white/[0.08] border border-white/[0.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.2)]' 
            : 'bg-transparent border border-transparent'
          }
        `}
      >
        <AnimatePresence>
          {isActive && (
            <motion.div 
              layoutId="desktop-active-nav"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[22px] bg-pink-500 rounded-r-full shadow-[0_0_12px_rgba(236,72,153,0.6)]"
              initial={{ opacity: 0, scaleY: 0.5 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 24 }}
            />
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center w-6 h-6">
          <item.Icon 
            size={18} 
            strokeWidth={isActive ? 2.5 : 2} 
            className={`transition-colors duration-200 
              ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-slate-400 group-hover:text-slate-200'}
            `} 
          />
        </div>
        
        <span className={`text-[14px] tracking-wide flex-1 text-left transition-colors duration-200
          ${isActive ? 'font-[600] text-white' : 'font-[500] text-slate-400 group-hover:text-slate-200'}
        `}>
          {item.label}
        </span>

        {item.badge && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-[800] border transition-colors
            ${isActive ? 'bg-pink-500 text-white border-pink-400/50 shadow-[0_0_8px_rgba(236,72,153,0.4)]' : 'bg-slate-800 text-slate-300 border-slate-700/50'}
          `}>
            {item.badge}
          </span>
        )}

        {hasChildren && (
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
          </motion.div>
        )}
      </motion.button>

      {hasChildren && (
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 250, damping: 26 }}
              className="overflow-hidden flex flex-col gap-0.5 pl-[46px] pr-2 mt-1"
            >
              {item.children.map((child, i) => {
                const isChildCurrent = currentPath === child.path;
                return (
                  <motion.button
                    key={child.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, type: 'spring' }}
                    onClick={() => { if (child.path) navigate(child.path); }}
                    whileHover={{ x: 2, backgroundColor: 'rgba(255,255,255,0.03)' }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 border border-transparent group
                      ${isChildCurrent ? 'text-white font-[600] bg-white/[0.04] border-white/[0.05]' : 'text-slate-400 hover:text-slate-200'}
                    `}
                  >
                    <child.Icon 
                      size={14} 
                      strokeWidth={isChildCurrent ? 2.5 : 2} 
                      className={isChildCurrent ? 'text-pink-500 drop-shadow-[0_0_6px_rgba(236,72,153,0.4)]' : 'text-slate-500 group-hover:text-slate-300'} 
                    />
                    <span className="tracking-wide text-left flex-1">{child.label}</span>
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

const MobileNavItem = memo(({ item, currentPath, setOpen, navigate }) => {
  const hasChildren = !!item.children;
  const isChildActive = hasChildren && item.children.some(c => c.path === currentPath);
  const isActive = item.path === currentPath || isChildActive;

  const [expanded, setExpanded] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) {
      setExpanded(true);
    }
  }, [isChildActive]);

  const handleClick = useCallback(() => {
    if (hasChildren) {
      setExpanded(prev => !prev);
      if (item.path && item.path !== currentPath) navigate(item.path);
    } else {
      setOpen(false);
      if (item.path) navigate(item.path);
    }
  }, [hasChildren, item, currentPath, setOpen, navigate]);

  return (
    <div className="flex flex-col w-full mb-1">
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
        className={`w-full h-[52px] px-4 flex items-center gap-4 rounded-2xl transition-all duration-200 group relative outline-none
          ${isActive ? 'bg-slate-100 shadow-[inset_0_2px_4px_rgba(15,23,42,0.02)]' : 'bg-transparent hover:bg-slate-50'}
        `}
      >
        <AnimatePresence>
          {isActive && (
            <motion.div 
              layoutId="mobile-active-nav"
              className="absolute left-1 top-3 bottom-3 w-1.5 rounded-full bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.4)]"
              initial={{ opacity: 0, scaleY: 0.5 }} animate={{ opacity: 1, scaleY: 1 }} exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            />
          )}
        </AnimatePresence>

        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200
          ${isActive ? 'bg-white text-pink-600 shadow-sm' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-slate-900 group-hover:shadow-sm'}
        `}>
          <item.Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        
        <span className={`text-[16px] tracking-tight flex-1 text-left ${isActive ? 'font-[700] text-slate-900' : 'font-[600] text-slate-600 group-hover:text-slate-900'}`}>
          {item.label}
        </span>

        {item.badge && (
          <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-600 text-[11px] font-[800]">
            {item.badge}
          </span>
        )}

        {hasChildren && (
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </motion.div>
        )}
      </motion.button>

      {hasChildren && (
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 250, damping: 26 }}
              className="overflow-hidden flex flex-col gap-1 pl-[64px] pr-4 mt-1"
            >
              {item.children.map((child, i) => {
                const isChildCurrent = currentPath === child.path;
                return (
                  <motion.button
                    key={child.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03, type: 'spring' }}
                    onClick={() => { setOpen(false); if (child.path) navigate(child.path); }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] transition-all duration-200
                      ${isChildCurrent ? 'text-slate-900 font-[700] bg-slate-50 border border-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-900'}
                    `}
                  >
                    <child.Icon size={16} strokeWidth={isChildCurrent ? 2.5 : 2} className={isChildCurrent ? 'text-pink-500' : 'text-slate-400'} />
                    <span className="text-left flex-1 tracking-tight">{child.label}</span>
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

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function Sidebar({ open, setOpen, active, setActive }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Auth Context: Extracting profileData globally
  const { role, logout, isAuthenticated, profileData } = useAuth();
  
  const NAV_ITEMS = getNavItems(role);

  const topItems = NAV_ITEMS.filter(i => i.id !== 'help');
  const bottomItems = NAV_ITEMS.filter(i => i.id === 'help');

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .dark-scrollbar::-webkit-scrollbar { width: 4px; }
        .dark-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .dark-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .dark-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
      `}} />

      <aside className="hidden lg:flex fixed top-[72px] bottom-0 left-0 w-[260px] 2xl:w-[280px] bg-[#20263D] border-r border-white/5 flex-col overflow-hidden z-30 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

        <nav className="flex-1 overflow-y-auto dark-scrollbar px-4 py-6 relative z-10">
          <div className="text-[11px] font-[800] uppercase tracking-[0.1em] text-slate-400/80 px-3 mb-4">
            Navigation
          </div>
          {topItems.map(item => (
            <DesktopNavItem key={item.id} item={item} currentPath={currentPath} navigate={navigate} />
          ))}
        </nav>

        {/* DESKTOP SECURE PROFILE FOOTER */}
        <div className="p-4 relative z-10 flex flex-col gap-2 border-t border-white/5 bg-white/[0.01]">
          <div className="mt-2 flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-[800] text-[13px] shadow-[0_0_12px_rgba(99,102,241,0.4)] border border-white/20">
                {getInitials(profileData?.ownerName)}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-[700] text-white leading-tight truncate max-w-[110px]">
                  {profileData?.ownerName || 'Loading...'}
                </span>
                <span className="text-[11px] font-[600] text-pink-400 uppercase tracking-wide mt-0.5 truncate capitalize">
                  {profileData?.role || 'Partner'}
                </span>
              </div>
            </div>
            {/* LOGOUT ACTION HOOKED HERE */}
            <button 
              onClick={(e) => { e.stopPropagation(); logout(); }} 
              className="p-1 outline-none shrink-0"
              aria-label="Logout"
            >
              <LogOut size={16} strokeWidth={2.5} className="text-slate-400 group-hover:text-pink-400 transition-colors mr-1" />
            </button>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="absolute inset-y-0 right-0 w-full max-w-[360px] bg-white flex flex-col shadow-2xl rounded-l-[32px] overflow-hidden border-l border-slate-200"
            >
              <div className="h-24 px-6 flex items-center justify-between shrink-0 bg-white">
                <span className="text-[13px] font-[800] uppercase tracking-widest text-slate-400">Menu</span>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X size={20} strokeWidth={2.5} />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-6">
                {topItems.map((item, idx) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03, duration: 0.2 }}>
                    <MobileNavItem item={item} currentPath={currentPath} setOpen={setOpen} navigate={navigate} />
                  </motion.div>
                ))}
                
                <div className="h-[1px] bg-slate-100 my-4 mx-4" />
                
                {bottomItems.map((item, idx) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (topItems.length + idx) * 0.03, duration: 0.2 }}>
                    <MobileNavItem item={item} currentPath={currentPath} setOpen={setOpen} navigate={navigate} />
                  </motion.div>
                ))}
              </div>

              {/* MOBILE SECURE PROFILE FOOTER */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="p-5 bg-slate-50/80 border-t border-slate-100 backdrop-blur-md"
              >
                <div className="w-full bg-white border border-slate-200 rounded-[24px] p-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-[700] text-[15px] shadow-sm shrink-0">
                      {getInitials(profileData?.ownerName)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-[800] text-slate-900 leading-tight truncate max-w-[140px]">
                        {profileData?.ownerName || 'Loading...'}
                      </span>
                      <span className="text-[13px] font-[500] text-slate-500 mt-0.5 capitalize truncate">
                        {profileData?.role || 'Partner'}
                      </span>
                    </div>
                  </div>
                  {/* LOGOUT ACTION HOOKED HERE */}
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(244,63,94,0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setOpen(false); logout(); }}
                    className="w-[42px] h-[42px] rounded-2xl flex items-center justify-center text-pink-500 bg-pink-50 transition-colors mr-1 shrink-0"
                    aria-label="Logout"
                  >
                    <LogOut size={18} strokeWidth={2.5} />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}