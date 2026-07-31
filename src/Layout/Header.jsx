import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Mic, Bell, Settings, ChevronDown, 
  Menu, X, Check, Clock 
} from 'lucide-react';

// ==========================================
// REUSABLE SUBCOMPONENTS
// ==========================================

const Logo = memo(() => (
  <div className="flex items-center gap-2.5 cursor-pointer group">
    <div className="relative w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm overflow-hidden border border-slate-800 transition-transform duration-300 group-hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-sky-400 opacity-20 blur-[4px] group-hover:opacity-30 transition-opacity" />
      <svg className="w-[18px] h-[18px] text-white relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7V4a2 2 0 012-2h3m0 0l-3 3m3-3L6 5M20 7v10a2 2 0 01-2 2h-3m0 0l3-3m-3 3l2-2M4 17v3a2 2 0 002 2h3m-7-5l3 3m-3-3l2-2" />
        <circle cx="12" cy="12" r="2" fill="currentColor" className="text-pink-500" />
      </svg>
    </div>
    <span className="text-[19px] font-[800] tracking-tight text-slate-900 leading-none">
      STOCK<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-sky-500">LINKER</span>
    </span>
  </div>
));

const PremiumIconButton = memo(({ children, onClick, badge, active }) => (
  <motion.button
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 border shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-pink-500/30
      ${active 
        ? 'bg-slate-100 border-slate-200 text-slate-900 shadow-[inset_0_2px_4px_rgba(15,23,42,0.02)]' 
        : 'bg-white border-slate-200/60 text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
      }`}
  >
    {children}
    {badge > 0 && (
      <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
        {badge}
      </span>
    )}
  </motion.button>
));

const SearchBar = memo(({ isMobile }) => (
  <div className={`relative flex items-center group w-full ${isMobile ? 'h-11 md:h-10' : 'h-10'}`}>
    <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 bg-pink-500/10 blur-md pointer-events-none" />
    <div className={`relative flex items-center w-full bg-slate-50/80 border border-slate-200/60 shadow-[inset_0_1px_2px_rgba(15,23,42,0.02)] focus-within:bg-white focus-within:border-pink-500/40 focus-within:shadow-[0_4px_12px_rgba(236,72,153,0.08)] transition-all overflow-hidden ${isMobile ? 'rounded-2xl md:rounded-xl' : 'rounded-xl'}`}>
      <Search size={18} className="absolute left-3 text-slate-400 group-focus-within:text-pink-500 transition-colors duration-300" />
      <input
        type="text"
        placeholder={isMobile ? "Search..." : "Search products, suppliers, categories..."}
        className={`w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-medium pl-10 pr-12 ${isMobile ? 'h-11 md:h-10 text-[15px] md:text-[14px]' : 'h-10 text-[14px]'}`}
      />
      <button aria-label="Voice Search" className="absolute right-2 p-1.5 text-slate-400 hover:text-sky-500 bg-white rounded-lg border border-slate-100 shadow-sm transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-500/30">
        <Mic size={14} strokeWidth={2.5} />
      </button>
    </div>
  </div>
));

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function Header({ open, setOpen }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profOpen, setProfOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const notifRef = useRef(null);
  const profRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profRef.current && !profRef.current.contains(e.target)) setProfOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* ==========================================
          DESKTOP HEADER (lg and up)
          ========================================== */}
      <header className="hidden lg:flex fixed top-0 inset-x-0 h-[72px] z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 items-center">
        
        {/* Left: Logo Area (Matches Sidebar Width exactly) */}
        <div className="w-[280px] 2xl:w-[300px] h-full flex items-center px-6 border-r border-slate-200/80 shrink-0">
          <Logo />
        </div>

        {/* Center: Search aligned Left */}
        <div className="flex-1 w-full max-w-[480px] xl:max-w-[560px] ml-6 xl:ml-8">
          <SearchBar isMobile={false} />
        </div>

        {/* Right: Actions pushed to end */}
        <div className="ml-auto flex items-center gap-3 px-6 shrink-0">
          
          <div className="relative" ref={notifRef}>
            <PremiumIconButton badge={3} active={notifOpen} onClick={() => { setNotifOpen(!notifOpen); setProfOpen(false); }}>
              <Bell size={18} strokeWidth={2} className={notifOpen ? 'fill-slate-900/10 text-slate-900' : ''} />
            </PremiumIconButton>
            
            <AnimatePresence>
              {notifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.96 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="absolute right-0 top-[calc(100%+12px)] w-[380px] bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200/80 shadow-[0_24px_48px_-12px_rgba(15,23,42,0.15)] overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-[14px] font-[700] text-slate-900 tracking-tight">Notifications</span>
                    <button className="text-[12px] font-[600] text-sky-500 hover:text-sky-600 transition-colors flex items-center gap-1">
                      <Check size={14} /> Mark all read
                    </button>
                  </div>
                  <div className="flex flex-col max-h-[320px] overflow-y-auto overscroll-contain">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="px-5 py-3.5 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0 group">
                        <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 bg-pink-500 shadow-sm" />
                        <div className="flex-1">
                          <p className="text-[14px] text-slate-800 font-[500] leading-snug group-hover:text-slate-900 transition-colors">Premium tier price drop alert on tracked suppliers.</p>
                          <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                            <Clock size={12} />
                            <p className="text-[12px]">2 min ago</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-slate-50 text-[13px] font-[600] text-slate-700 border-t border-slate-100 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                    View all activity
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <PremiumIconButton active={false}>
            <Settings size={18} strokeWidth={2} />
          </PremiumIconButton>

          <div className="h-8 w-[1px] bg-slate-200 mx-2" />

          {/* Desktop Profile Dropdown */}
          <div className="relative" ref={profRef}>
            <button 
              onClick={() => { setProfOpen(!profOpen); setNotifOpen(false); }} 
              className={`flex items-center gap-3 p-1.5 pr-3 rounded-2xl border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/30
                ${profOpen ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-transparent border-transparent hover:border-slate-200 hover:bg-slate-50'}
              `}
            >
              <div className="w-9 h-9 rounded-[12px] flex items-center justify-center text-[13px] font-bold text-white bg-gradient-to-br from-slate-700 to-slate-900 shadow-sm shrink-0">
                JD
              </div>
              <div className="text-left hidden xl:block">
                <p className="text-[14px] font-[700] text-slate-900 leading-none">John Doe</p>
                <p className="text-[12px] mt-1.5 text-slate-500 font-[500] leading-none">Enterprise Admin</p>
              </div>
              <ChevronDown size={14} className="text-slate-400 ml-1 hidden xl:block" />
            </button>
            
            <AnimatePresence>
              {profOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.96 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="absolute right-0 top-[calc(100%+12px)] w-60 bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200/80 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.1)] p-1.5"
                >
                  <div className="px-3 py-2.5 mb-1 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[14px] font-[700] text-slate-900">John Doe</p>
                    <p className="text-[12px] text-slate-500 mt-0.5">john@enterprise.co</p>
                  </div>
                  <div className="h-[1px] bg-slate-100 mx-2 mb-1" />
                  {['Workspace Settings', 'Billing & Plans', 'Team Management'].map(item => (
                    <button key={item} className="w-full px-3 py-2.5 text-left text-[13px] font-[500] rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors">
                      {item}
                    </button>
                  ))}
                  <div className="h-[1px] bg-slate-100 mx-2 my-1" />
                  <button className="w-full px-3 py-2.5 text-left text-[13px] font-[600] rounded-xl hover:bg-pink-50 text-pink-600 transition-colors">
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ==========================================
          TABLET / MOBILE HEADER (lg:hidden)
          Tablet view optimally fills space
          Mobile view keeps search below
          ========================================== */}
      <div className="block lg:hidden w-full relative z-40">
        
        <motion.header
          className="fixed flex items-center justify-between px-3 md:px-5 shadow-[0_8px_32px_rgba(15,23,42,0.06)]"
          initial={false}
          animate={{
            top: 12, left: 12, right: 12,
            height: isScrolled ? 60 : (window.innerWidth >= 768 ? 72 : 68), // Tablet 72, Mobile 68
            borderRadius: isScrolled ? 20 : 24,
            backgroundColor: isScrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: isScrolled 
              ? '0 12px 40px -12px rgba(15,23,42,0.12), inset 0 0 0 1px rgba(255,255,255,0.8)' 
              : '0 8px 30px -10px rgba(15,23,42,0.08), inset 0 0 0 1px rgba(255,255,255,0.8)'
          }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        >
          {/* Logo */}
          <motion.div animate={{ scale: isScrolled ? 0.95 : 1 }} className="shrink-0">
            <Logo />
          </motion.div>

          {/* TABLET ONLY: Inline Search */}
          <div className="hidden md:block flex-1 max-w-[280px] mx-6">
            <SearchBar isMobile={true} />
          </div>

          {/* Right Actions */}
          <div className="flex items-center relative">
            
            {/* Tablet Profile (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-2.5 px-2 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] mr-3 cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-[12px] font-bold shadow-sm">
                JD
              </div>
              <div className="flex flex-col pr-3">
                <span className="text-[13px] font-[800] text-slate-900 leading-none">John Doe</span>
                <span className="text-[11px] font-[600] text-slate-500 leading-none mt-1">Admin</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PremiumIconButton badge={2}>
                <Bell size={18} strokeWidth={2} />
              </PremiumIconButton>

              <div className="hidden md:block">
                <PremiumIconButton>
                  <Settings size={18} strokeWidth={2} />
                </PremiumIconButton>
              </div>

              {/* Menu Morph Button */}
              <PremiumIconButton onClick={() => setOpen(!open)} active={open}>
                <div className="relative w-5 h-5 flex items-center justify-center text-slate-800">
                  <AnimatePresence mode="wait">
                    {open ? (
                      <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                        <X size={20} strokeWidth={2.5} />
                      </motion.div>
                    ) : (
                      <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                        <Menu size={20} strokeWidth={2.5} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </PremiumIconButton>
            </div>
          </div>
        </motion.header>

        {/* MOBILE ONLY: Search below header */}
        {/* <div className="md:hidden pt-[92px] px-4 pb-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, type: "spring" }}>
            <SearchBar isMobile={true} />
          </motion.div>
        </div> */}
      </div>
    </>
  );
}