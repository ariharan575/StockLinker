import React, { useState, useEffect, useRef} from "react";
import { motion, AnimatePresence, useScroll, useMotionValue, useTransform, useSpring } from "framer-motion";
import { 
  Search, BarChart3, ShoppingBag, Truck, Grid, Package, 
  Layers, MessageSquare, FileText, Bell, Globe, 
  ArrowRight, ChevronDown, Menu, X, Terminal
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ==========================================
// CONSTANTS & SYSTEM CONFIG
// ==========================================
const NAV_ITEMS = [
  { id: "platform", label: "Overview", hasMega: true },
  { id: "how-it-works", label: "How It Works", hasMega: false },
  { id: "product", label: "Product", hasMega: false },
  { id: "route", label: "Route", hasMega: false },
  { id: "dashboard", label: "Dashboard", hasMega: false }
];

const MEGA_MENU_DATA = {
  shopkeeper: {
    title: "Shopkeeper Hub",
    icon: ShoppingBag,
    color: "bg-pink-50 text-pink-600 border border-pink-100",
    items: [
      { name: "Search Products", desc: "AI-powered wholesale discovery matrix", icon: Search },
      { name: "Price Comparison", desc: "Real-time automated margin optimization", icon: BarChart3 },
      { name: "Orders", desc: "Automated replenishment pipelines", icon: Package },
      { name: "Tracking", desc: "End-to-end logistics monitoring systems", icon: Truck }
    ]
  },
  wholesaler: {
    title: "Wholesaler Core",
    icon: Layers,
    color: "bg-sky-50 text-sky-600 border border-sky-100",
    items: [
      { name: "Products", desc: "Inventory catalog matrix management", icon: Grid },
      { name: "Orders", desc: "Bulk fulfillment stream structures", icon: FileText },
      { name: "Routes", desc: "Dynamic dispatch distribution channels", icon: Truck },
      { name: "Customers", desc: "Enterprise ledger architecture config", icon: MessageSquare }
    ]
  },
  platform: {
    title: "Unified Intelligence Network",
    icon: Terminal,
    color: "bg-indigo-50 text-indigo-600 border border-indigo-100",
    items: [
      { name: "Secure Messaging", desc: "Encrypted supplier routing negotiations", icon: MessageSquare },
      { name: "Smart Invoices", desc: "Automated real-time contract ledgers", icon: FileText },
      { name: "Event Stream", desc: "Sub-millisecond global notifications", icon: Bell },
      { name: "Spatial Routing", desc: "Predictive graph engine calculations", icon: Truck }
    ]
  }
};

const SPRING_STIFF = { type: "spring", stiffness: 400, damping: 28 };
const SPRING_LOOSE = { type: "spring", stiffness: 220, damping: 24 };

const MagneticWrapper = ({ children, className, distance = 14 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 180, damping: 15 });
  const springY = useSpring(y, { stiffness: 180, damping: 15 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) / (width / distance));
    y.set((clientY - centerY) / (height / distance));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const BrandLogo = () => {
  return (
    <div className="flex items-center gap-2.5 cursor-pointer select-none group flex-shrink-0">
      <div className="relative w-8 h-8 flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-sky-400 opacity-20 blur-[6px] group-hover:opacity-40 transition-opacity duration-300"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
        <div className="relative w-7.5 h-7.5 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-lg overflow-hidden">
          <svg className="w-4 h-4 text-white transform group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7V4a2 2 0 012-2h3m0 0l-3 3m3-3L6 5M20 7v10a2 2 0 01-2 2h-3m0 0l3-3m-3 3l2-2M4 17v3a2 2 0 002 2h3m-7-5l3 3m-3-3l2-2" />
            <circle cx="12" cy="12" r="2" fill="currentColor" className="text-pink-500" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-sans font-black text-[14px] tracking-tight text-slate-900">
          STOCK<span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-sky-500">LINKER</span>
        </span>
        <span className="text-[7px] font-mono font-bold tracking-[0.25em] text-slate-400 uppercase -mt-0.5">
          Commerce OS
        </span>
      </div>
    </div>
  );
};

export default function Navbar() {
  const [activeTab, setActiveTab] = useState(null);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [lang, setLang] = useState("EN");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const containerRef = useRef(null);
  const langRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const navigate = useNavigate();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrolled(latest > 15);
    });
  }, [scrollY]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
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

  const handleItemClick = (item) => {
    if (item.hasMega) {
      setIsMegaOpen(!isMegaOpen);
    } else {
      setIsMegaOpen(false);
    }
  };

  const handleGlobalMenuLeave = () => {
    setIsMegaOpen(false);
    setActiveTab(null);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-20 pointer-events-none z-[99] bg-gradient-to-b from-white/95 via-white/50 to-transparent backdrop-blur-[4px]" />

      <header
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleGlobalMenuLeave}
        className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center pt-4 px-4 pointer-events-none shadow-lg"
      >
        <motion.div
          animate={{
            height: scrolled ? "60px" : "70px",
            y: scrolled ? 4 : 0
          }}
          transition={SPRING_LOOSE}
          className={`
            w-full max-w-[1440px] relative pointer-events-auto flex items-center justify-between px-4 lg:px-6 
            bg-white/95 border border-slate-200/80 backdrop-blur-2xl transition-all duration-300 rounded-2xl
            ${scrolled ? "shadow-[0_12px_24px_rgba(15,23,42,0.04),0_1px_2px_rgba(0,0,0,0.02)]" : "shadow-[0_4px_12px_rgba(15,23,42,0.015)]"}
          `}
        >
          <motion.div 
            className="absolute -inset-px rounded-[inherit] opacity-100 pointer-events-none blur-md z-0"
            style={{
              background: useTransform(
                [mouseX, mouseY],
                ([x, y]) => `radial-gradient(130px circle at ${x}px ${y}px, rgba(244,63,94,0.03), transparent)`
              )
            }}
          />

          <BrandLogo />

          {/* Adjusted spacing to comfortably accommodate tablet/laptop screens */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 relative z-10 mx-2">
            {NAV_ITEMS.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <div
                  key={item.id}
                  className="relative py-2"
                  onMouseEnter={() => {
                    setActiveTab(item.id);
                    if (item.hasMega) setIsMegaOpen(true);
                  }}
                >
                  <button
                    onClick={() => handleItemClick(item)}
                    className="relative px-2.5 lg:px-3.5 py-1.5 font-sans font-medium text-[13px] lg:text-[14px] tracking-wide text-slate-600 transition-colors duration-150 cursor-pointer flex items-center gap-1 select-none whitespace-nowrap"
                  >
                    <span className="relative z-10">{item.label}</span>
                    {item.hasMega && (
                      <motion.div
                        animate={{ rotate: isMegaOpen && isSelected ? 180 : 0 }}
                        transition={SPRING_STIFF}
                        className="relative z-10 opacity-60"
                      >
                        <ChevronDown size={13} strokeWidth={2.5} />
                      </motion.div>
                    )}

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          layoutId="nav_pill_indicator"
                          className="absolute inset-0 rounded-xl bg-slate-100/90 border border-slate-200/20 z-0"
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={SPRING_STIFF}
                        />
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 lg:gap-3 relative z-10 flex-shrink-0">
            <div className="hidden md:block relative flex-shrink-0" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-[12.5px] lg:text-[13.5px] font-sans font-medium text-slate-600 hover:bg-slate-50 border border-transparent transition-all cursor-pointer"
              >
                <Globe size={13} className="opacity-70" />
                <span>{lang}</span>
                <ChevronDown size={12} className={`opacity-50 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={SPRING_STIFF}
                    className="absolute right-0 mt-2 w-32 rounded-xl bg-white border border-slate-200 shadow-[0_8px_20px_rgba(0,0,0,0.05)] p-1 z-50"
                  >
                    {[
                      { code: "EN", label: "English" },
                      { code: "TM", label: "தமிழ்" }
                    ].map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          setLang(item.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-[13px] font-sans font-medium rounded-lg transition-colors cursor-pointer ${lang === item.code ? "bg-pink-50 text-pink-600 font-semibold" : "text-slate-600 hover:bg-slate-50/80"}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Adjusted absolute widths and paddings below to fix laptop overflow constraints */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <button className="px-3.5 py-2 rounded-xl text-[13px] lg:text-[14px] font-sans font-medium tracking-wide text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-all cursor-pointer whitespace-nowrap"
                      onClick={() => navigate('/login')}>
                Sign In
              </button>

              <MagneticWrapper distance={8} className="flex-shrink-0">
                <button className="relative group px-4 py-2 rounded-xl overflow-hidden font-sans font-semibold text-[13px] lg:text-[14px] tracking-wide text-white bg-pink-500 shadow-[0_4px_12px_rgba(244,63,94,0.25)] hover:shadow-[0_6px_16px_rgba(14,165,233,0.15)] transition-all duration-300 cursor-pointer whitespace-nowrap">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500 via-purple-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
                  <span className="relative z-10 flex items-center gap-1"
                      onClick={() => navigate('/login')}>
                    Get Started <ArrowRight size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              </MagneticWrapper>
            </div>

            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 shadow-sm cursor-pointer"
              >
                {mobileOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ==========================================
            MEGA PLATFORM EXPANSION CONTAINER PANEL
        ========================================== */}
        <AnimatePresence>
          {isMegaOpen && (
            <motion.div 
              className="w-full max-w-[1440px] px-4 pointer-events-auto mt-2 hidden md:block"
              initial={{ opacity: 0, y: -4, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.995 }}
              transition={SPRING_STIFF}
              onMouseEnter={() => setIsMegaOpen(true)}
              onMouseLeave={handleGlobalMenuLeave}
            >
              <div className="w-full rounded-3xl p-7 grid grid-cols-3 gap-6 border bg-white border-slate-200 shadow-[0_20px_40px_rgba(15,23,42,0.06)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-400 via-purple-500 to-sky-400 opacity-70" />
                
                {Object.entries(MEGA_MENU_DATA).map(([key, col]) => {
                  const IconComponent = col.icon;
                  return (
                    <div key={key} className="flex flex-col gap-4 border-r last:border-0 border-slate-100 pr-5 last:pr-0">
                      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                        <div className={`p-2 rounded-xl ${col.color}`}>
                          <IconComponent size={15} strokeWidth={2.5} />
                        </div>
                        <h4 className="font-sans font-bold text-[12px] tracking-wider text-slate-800 uppercase">
                          {col.title}
                        </h4>
                      </div>

                      <div className="flex flex-col gap-1">
                        {col.items.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <div
                              key={item.name}
                              className="group/item p-2.5 rounded-xl cursor-pointer flex items-start gap-3 hover:bg-slate-50 transition-all duration-150"
                            >
                              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 group-hover/item:text-pink-500 group-hover/item:bg-pink-50 transition-colors">
                                <ItemIcon size={14} strokeWidth={2.5} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[13.5px] font-sans font-semibold text-slate-800 group-hover/item:text-pink-600 transition-colors">
                                  {item.name}
                                </span>
                                <span className="text-[11.5px] font-sans text-slate-400 mt-0.5 line-clamp-1">
                                  {item.desc}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ==========================================
          MOBILE & TABLET DRAWER OVERLAY SYSTEM
      ========================================== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[97] lg:hidden flex flex-col justify-between p-6 bg-white"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <div className="h-20" />

            <div className="flex flex-col gap-2 my-auto">
              {NAV_ITEMS.map((item) => (
                <div key={item.id} className="border-b border-slate-100 pb-2">
                  <a 
                    href={`#${item.id}`} 
                    onClick={() => setMobileOpen(false)} 
                    className="text-xl font-sans font-bold tracking-tight text-slate-900 block py-2"
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
              <div className="flex md:hidden items-center justify-between">
                <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">System Locale</span>
                <button 
                  onClick={() => setLang(lang === "EN" ? "TM" : "EN")}
                  className="px-3 py-1 rounded-xl border border-slate-200 text-xs font-sans font-bold text-slate-800 bg-slate-50 cursor-pointer"
                >
                  {lang === "EN" ? "English (EN)" : "தமிழ் (TM)"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-1">
                <button className="w-full py-3 rounded-xl font-sans font-semibold text-[14px] bg-slate-100 text-slate-800"
                         onClick={() => navigate('/login')}
 >
                  Sign In
                </button>
                <button className="w-full py-3 rounded-xl font-sans font-semibold text-[14px] text-white bg-gradient-to-r from-pink-500 to-sky-400 shadow-md"
                         onClick={() => navigate('/login')}>
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}