import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useMotionValue, useTransform } from "framer-motion";
import { 
  Search, BarChart3, ShoppingBag, Truck, Grid, Package, 
  Layers, MessageSquare, FileText, Bell, Globe, 
  ArrowRight, ChevronDown, Menu, X, Terminal, Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ==========================================
// CONSTANTS & SYSTEM CONFIG
// ==========================================
const NAV_ITEMS = [
  { id: "overview", label: "Overview", hasMega: true },
  { id: "features", label: "Features", hasMega: false },
  { id: "how-it-works", label: "How It Works", hasMega: false },
  { id: "solutions", label: "Solutions", hasMega: false },
  { id: "dashboard", label: "Dashboard", hasMega: false }
];

const MEGA_MENU_DATA = {
  shopkeeper: {
    title: "Shopkeeper Hub",
    icon: ShoppingBag,
    items: [
      { name: "Search Products", desc: "AI-powered discovery matrix", icon: Search },
      { name: "Price Comparison", desc: "Real-time margin optimization", icon: BarChart3 },
      { name: "Orders", desc: "Automated replenishment pipelines", icon: Package },
      { name: "Tracking", desc: "End-to-end logistics monitoring", icon: Truck }
    ]
  },
  wholesaler: {
    title: "Wholesaler Core",
    icon: Layers,
    items: [
      { name: "Products", desc: "Inventory catalog management", icon: Grid },
      { name: "Orders", desc: "Bulk fulfillment stream structures", icon: FileText },
      { name: "Routes", desc: "Dynamic distribution channels", icon: Truck },
      { name: "Customers", desc: "Enterprise ledger architecture", icon: MessageSquare }
    ]
  },
  platform: {
    title: "Unified Intelligence",
    icon: Terminal,
    items: [
      { name: "Secure Messaging", desc: "Encrypted routing negotiations", icon: MessageSquare },
      { name: "Smart Invoices", desc: "Automated real-time ledgers", icon: FileText },
      { name: "Event Stream", desc: "Sub-millisecond notifications", icon: Bell },
      { name: "Spatial Routing", desc: "Predictive graph calculations", icon: Truck }
    ]
  }
};

// Enterprise Transitions (GPU Accelerated, No Blur Animations)
const PREMIUM_EASE = [0.16, 1, 0.3, 1];
const TRANSITION_ENTERPRISE = { duration: 0.5, ease: PREMIUM_EASE };
const TRANSITION_MICRO = { duration: 0.3, ease: "easeOut" };

// ==========================================
// COMPONENTS
// ==========================================

const MagneticWrapper = ({ children, className }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    // Dramatically reduced distance for enterprise feel
    setPosition({ x: (clientX - centerX) * 0.15, y: (clientY - centerY) * 0.15 });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

const BrandLogo = ({ isMobileMenu = false }) => (
  <div className="flex items-center gap-2.5 xl:gap-3 cursor-pointer select-none group flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50 rounded-lg" tabIndex={0} aria-label="Home">
    <div className={`relative flex items-center justify-center ${isMobileMenu ? 'w-8 h-8' : 'w-8 h-8 md:w-[26px] md:h-[26px] lg:w-7 lg:h-7 xl:w-8 xl:h-8'}`}>
      <div className="absolute inset-0 transition-opacity rounded-lg opacity-0 duration-[160ms] ease-out bg-gradient-to-tr from-pink-500 to-sky-400 blur-md group-hover:opacity-40" />
      <div className="relative flex items-center justify-center w-full h-full overflow-hidden border shadow-sm rounded-xl bg-slate-950 border-slate-800 translate-z-0">
        <svg className={`text-white transition-transform duration-[160ms] ease-out group-hover:scale-105 ${isMobileMenu ? 'w-[18px] h-[18px]' : 'w-[18px] h-[18px] md:w-[14px] md:h-[14px] lg:w-[16px] lg:h-[16px] xl:w-[18px] xl:h-[18px]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7V4a2 2 0 012-2h3m0 0l-3 3m3-3L6 5M20 7v10a2 2 0 01-2 2h-3m0 0l3-3m-3 3l2-2M4 17v3a2 2 0 002 2h3m-7-5l3 3m-3-3l2-2" />
          <circle cx="12" cy="12" r="2" fill="currentColor" className="text-pink-500" />
        </svg>
      </div>
    </div>
    <div className="flex flex-col justify-center">
      <span className={`font-sans font-bold tracking-tight leading-none text-slate-900 ${isMobileMenu ? 'text-[15px]' : 'text-[15px] md:text-[13px] lg:text-[14px] xl:text-[18px]'}`}>
        STOCK<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-sky-500">LINKER</span>
      </span>
    </div>
  </div>
);

export default function Navbar() {
  const [activeTab, setActiveTab] = useState(null);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [lang, setLang] = useState("EN");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const containerRef = useRef(null);
  const langRef = useRef(null);
  const megaMenuRef = useRef(null);
  const navigate = useNavigate();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // A11y & Interactions
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMegaOpen(false);
        setIsLangOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrolled(latest > 20);
    });
  }, [scrollY]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) setIsLangOpen(false);
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target) &&
        megaMenuRef.current &&
        !megaMenuRef.current.contains(event.target)
      ) {
        setIsMegaOpen(false);
        setActiveTab(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseMove = ({ clientX, clientY }) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const handleItemEnter = (item) => {
    setActiveTab(item.id);
    if (item.hasMega && window.innerWidth >= 1024) {
      setIsMegaOpen(true);
    } else {
      setIsMegaOpen(false);
    }
  };

  const handleItemClick = (item) => {
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    if (item.hasMega && !isTablet) {
      setIsMegaOpen(!isMegaOpen);
      return;
    }

    // Enterprise Smooth Scrolling Logic
    const element = document.getElementById(item.id);
    if (element) {
      setMobileOpen(false);
      setIsMegaOpen(false);
      
      const headerOffset = 90; // Accounting for sticky navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
    
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    } else {
      navigate(`/${item.id}`);
    }
  };

  const handleGlobalLeave = (e) => {
    if (e.relatedTarget && megaMenuRef.current?.contains(e.relatedTarget)) return;
    setIsMegaOpen(false);
    setActiveTab(null);
  };

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [mobileOpen]);

  // Memoized mega menu blocks for performance
  const MegaMenuBlocks = useMemo(() => Object.entries(MEGA_MENU_DATA).map(([key, col]) => {
    const IconComponent = col.icon;
    return (
      <div key={key} className="flex flex-col p-5 transition-colors rounded-[16px] hover:bg-slate-50/50 group/col duration-[160ms] ease-out">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-8 h-8 transition-colors bg-white border shadow-sm duration-[160ms] ease-out rounded-xl border-slate-200/60 text-slate-700 group-hover/col:border-pink-200 group-hover/col:text-pink-600 group-hover/col:bg-pink-50/50">
            <IconComponent size={16} strokeWidth={2} />
          </div>
          <h4 className="font-sans text-[12px] font-semibold tracking-wider text-slate-500 uppercase">
            {col.title}
          </h4>
        </div>
        <div className="flex flex-col gap-1">
          {col.items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div key={item.name} className="flex items-start gap-3 p-3 cursor-pointer rounded-xl group/item hover:bg-white hover:shadow-sm duration-[160ms] ease-out">
                <div className="mt-0.5 text-slate-400 group-hover/item:text-slate-900 transition-colors duration-[160ms] ease-out">
                  <ItemIcon size={16} strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-slate-700 group-hover/item:text-slate-900 transition-colors duration-[160ms] ease-out">
                    {item.name}
                  </span>
                  <span className="text-[13px] text-slate-500 mt-0.5 leading-snug">
                    {item.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }), []);

  // Optimized Mobile Animation Variants for zero lag
  const mobileContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.05 }
    }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={TRANSITION_ENTERPRISE}
        className="hidden md:block relative z-50 border-b px-4 py-3 sm:px-8 border-black/10 bg-white/50 backdrop-blur-2xl"
      >
      </motion.div>
      
      {/* ENTERPRISE ENTRY ANIMATION */}
      <motion.header 
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={TRANSITION_ENTERPRISE}
        className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 md:pt-10 pointer-events-none px-4"
      >
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleGlobalLeave}
          animate={{
            y: scrolled ? -6 : 0,
          }}
          transition={TRANSITION_ENTERPRISE}
          className="relative pointer-events-auto flex items-center
           justify-between w-full max-w-[1300px] h-[48px] md:h-[50px] lg:h-[54px] xl:h-[62px]
            px-4 md:px-5 bg-white/70 border border-gray-200 backdrop-blur-2xl rounded-[15px]
           shadow-[0_8px_32px_rgba(15,23,42,0.04),_inset_0_0_0_1px_rgba(255,255,255,0.5)] transition-shadow duration-300 translate-z-0"
        >
          {/* subtle ambient mouse glow - Optimized using opacity instead of blur */}
          <motion.div 
            className="absolute -inset-px rounded-[24px] opacity-100 pointer-events-none z-0 overflow-hidden"
            style={{
              background: useTransform(
                [mouseX, mouseY],
                ([x, y]) => `radial-gradient(200px circle at ${x}px ${y}px, rgba(244,63,94,0.02), transparent 70%)`
              )
            }}
          />

          <BrandLogo />

          {/* Desktop & Tablet Navigation */}
          <nav className="hidden relative z-10 md:flex items-center gap-[8px] lg:gap-1.5 xl:gap-2 mx-auto md:mx-4 p-1 rounded-2xl bg-slate-50/50 border border-slate-100/50 whitespace-nowrap">
            {NAV_ITEMS.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <div key={item.id} className="relative" onMouseEnter={() => handleItemEnter(item)}>
                  <button
                    onClick={() => handleItemClick(item)}
                    aria-expanded={item.hasMega ? isMegaOpen : undefined}
                    className={`relative z-20 md:px-2 md:py-1 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2 md:text-[13px] lg:text-[14px] xl:text-[15px] font-medium tracking-wide font-sans transition-colors duration-[160ms] ease-out flex items-center gap-1.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50 ${isSelected ? "text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    <span>{item.label}</span>
                    {item.hasMega && (
                      <motion.div className="hidden lg:block will-change-transform" animate={{ rotate: isMegaOpen && isSelected ? 180 : 0 }} transition={TRANSITION_MICRO}>
                        <ChevronDown size={14} className="opacity-50" strokeWidth={2} />
                      </motion.div>
                    )}
                  </button>
                  
                  {isSelected && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute inset-0 z-10 bg-white border shadow-sm rounded-xl border-slate-200/50 translate-z-0"
                      initial={false}
                      transition={TRANSITION_MICRO}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Actions & Language */}
          <div className="relative z-10 flex items-center flex-shrink-0 gap-2 lg:gap-3 xl:gap-4">

            {/* CTAs */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => navigate('/login')}
                className="hidden lg:block px-3 py-1.5 xl:px-4 xl:py-2 text-[13px] xl:text-[14px] font-medium text-slate-600 transition-colors duration-[160ms] ease-out rounded-xl hover:text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
              >
                Sign In
              </button>

              <MagneticWrapper>
                <button 
                  onClick={() => navigate('/login')}
                  className="relative group md:px-1 md:py-1.5 lg:px-4 lg:py-2 xl:px-5 xl:py-2 overflow-hidden rounded-xl bg-slate-900 text-white md:text-[12px] lg:text-[13px] xl:text-[14px] font-medium tracking-wide shadow-[0_4px_12px_rgba(15,23,42,0.15)] transition-all duration-300 hover:shadow-[0_8px_20px_rgba(15,23,42,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 whitespace-nowrap translate-z-0"
                >
                  <span className="absolute inset-0 w-full h-full transition-opacity duration-300 opacity-0 bg-gradient-to-r from-pink-500/20 to-sky-400/20 group-hover:opacity-100" />
                  <span className="relative z-10 flex items-center gap-1.5">
                    Get Started 
                    <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-[160ms] ease-out group-hover:translate-x-1" />
                  </span>
                </button>
              </MagneticWrapper>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 transition-colors duration-[160ms] ease-out border rounded-xl md:hidden text-slate-700 bg-slate-50 border-slate-200/60 active:bg-slate-100"
              aria-label="Open Menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={20} strokeWidth={2} />
            </button>
          </div>
        </motion.div>

        {/* ==========================================
            MEGA MENU DESKTOP
        ========================================== */}
        <AnimatePresence>
          {isMegaOpen && (
            <motion.div 
              ref={megaMenuRef}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 12 }}
              exit={{ opacity: 0, y: 4 }}
              transition={TRANSITION_ENTERPRISE}
              onMouseLeave={() => { setIsMegaOpen(false); setActiveTab(null); }}
              className="absolute left-0 right-0 hidden lg:flex justify-center pointer-events-auto top-full z-[90] px-4 will-change-transform translate-z-0"
            >
              <div className="w-full max-w-[960px] bg-white border border-slate-200/60 shadow-[0_24px_48px_-12px_rgba(15,23,42,0.08),_0_0_0_1px_rgba(15,23,42,0.02)] rounded-[24px] overflow-hidden">
                <div className="grid grid-cols-3 p-3">
                  {MegaMenuBlocks}
                </div>
                
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 text-[13px] font-medium text-slate-600">
                      <span className="relative flex w-2 h-2">
                        <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400"></span>
                        <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500"></span>
                      </span>
                      All systems operational
                    </span>
                  </div>
                  <button className="text-[13px] font-medium text-pink-600 hover:text-pink-700 flex items-center gap-1 group duration-[160ms] ease-out">
                    View Documentation <ArrowRight size={14} className="transition-transform duration-[160ms] ease-out group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ==========================================
          MOBILE FULLSCREEN OVERLAY
      ========================================== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-[150] flex flex-col bg-white md:hidden translate-z-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <BrandLogo isMobileMenu={true} />
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-2 transition-colors duration-[160ms] ease-out rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                aria-label="Close Menu"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Menu Links with Staggered Entrance */}
            <motion.div 
              variants={mobileContainerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 px-6 py-8 overflow-y-auto"
            >
              <div className="flex flex-col gap-6">
                {NAV_ITEMS.map((item) => (
                  <motion.div variants={mobileItemVariants} key={item.id} className="flex flex-col">
                    {item.hasMega ? (
                      <>
                        <button 
                          onClick={() => setMobileAccordion(!mobileAccordion)}
                          className="flex items-center justify-between py-2 text-2xl font-semibold tracking-tight text-slate-800 outline-none"
                          aria-expanded={mobileAccordion}
                        >
                          {item.label}
                          <motion.div
                            animate={{ rotate: mobileAccordion ? 180 : 0 }}
                            transition={TRANSITION_ENTERPRISE}
                            className="will-change-transform"
                          >
                            <ChevronDown size={24} className="text-slate-300" />
                          </motion.div>
                        </button>
                        <AnimatePresence initial={false}>
                          {mobileAccordion && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-col gap-5 pt-3 pb-2 pl-4 mt-2 border-l-2 border-slate-100">
                                {Object.values(MEGA_MENU_DATA).map((col) => (
                                  <div key={col.title}>
                                    <h5 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">{col.title}</h5>
                                    <div className="flex flex-col gap-3">
                                      {col.items.map((subItem) => (
                                        <button 
                                          key={subItem.name} 
                                          onClick={() => handleItemClick(item)}
                                          className="text-[15px] font-medium text-slate-600 active:text-slate-900 text-left"
                                        >
                                          {subItem.name}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <button 
                        onClick={() => handleItemClick(item)}
                        className="flex items-center justify-between py-2 text-2xl font-semibold tracking-tight text-slate-800 text-left"
                      >
                        {item.label}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Footer Area */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...TRANSITION_ENTERPRISE }}
              className="px-6 py-6 mt-auto bg-slate-50 border-t border-slate-100 translate-z-0"
            >
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setMobileOpen(false); navigate('/login'); }}
                  className="w-full py-3.5 text-[15px] font-medium text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm active:bg-slate-200 duration-[160ms] ease-out"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => { setMobileOpen(false); navigate('/login'); }}
                  className="w-full py-3.5 text-[15px] font-medium text-white bg-slate-900 rounded-xl shadow-md active:bg-slate-800 duration-[160ms] ease-out"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}