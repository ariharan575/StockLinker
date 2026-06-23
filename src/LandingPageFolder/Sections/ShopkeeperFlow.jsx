import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Mic,
  MapPin,
  Truck,
  Clock3,
  Sparkles,
  Activity,
  Radio,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import ShopkeeperProcess from "./ShopkeeperProcess";

const searchSequence = [
  "o",
  "on",
  "oni",
  "onio",
  "onion",
];

const suggestions = [
  "Onion",
  "Red Onion",
  "Small Onion",
  "வெங்காயம்",
  "சின்ன வெங்காயம்",
];

const supplierSnapshots = [
  [
    {
      id: 1,
      name: "Salem Agro Traders",
      price: 30,
      distance: "12 km",
      delivery: "4 hrs",
      stock: "High",
    },
    {
      id: 2,
      name: "Fresh Root Exports",
      price: 28,
      distance: "22 km",
      delivery: "8 hrs",
      stock: "Medium",
    },
    {
      id: 3,
      name: "Delta Wholesale Hub",
      price: 31,
      distance: "18 km",
      delivery: "6 hrs",
      stock: "High",
    },
    {
      id: 4,
      name: "Tamil Harvest Network",
      price: 29,
      distance: "15 km",
      delivery: "5 hrs",
      stock: "High",
    },
  ],
  [
    {
      id: 2,
      name: "Fresh Root Exports",
      price: 27,
      distance: "22 km",
      delivery: "8 hrs",
      stock: "Medium",
    },
    {
      id: 4,
      name: "Tamil Harvest Network",
      price: 28,
      distance: "15 km",
      delivery: "5 hrs",
      stock: "High",
    },
    {
      id: 1,
      name: "Salem Agro Traders",
      price: 29,
      distance: "12 km",
      delivery: "4 hrs",
      stock: "High",
    },
    {
      id: 3,
      name: "Delta Wholesale Hub",
      price: 31,
      distance: "18 km",
      delivery: "6 hrs",
      stock: "High",
    },
  ],
  [
    {
      id: 4,
      name: "Tamil Harvest Network",
      price: 26,
      distance: "15 km",
      delivery: "5 hrs",
      stock: "High",
    },
    {
      id: 2,
      name: "Fresh Root Exports",
      price: 27,
      distance: "22 km",
      delivery: "8 hrs",
      stock: "Medium",
    },
    {
      id: 1,
      name: "Salem Agro Traders",
      price: 28,
      distance: "12 km",
      delivery: "4 hrs",
      stock: "High",
    },
    {
      id: 3,
      name: "Delta Wholesale Hub",
      price: 30,
      distance: "18 km",
      delivery: "6 hrs",
      stock: "High",
    },
  ],
];

const particles = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 1.5,
  duration: Math.random() * 20 + 15,
}));

const CommerceParticleField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-cyan-500/10"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-30, 30, -30],
            opacity: [0.05, 0.4, 0.05],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

const AnimatedGrid = () => {
  return (
    <motion.div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      animate={{
        backgroundPosition: ["0px 0px", "0px 120px"],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />
  );
};

const SearchWave = () => {
  return (
    <div className="flex items-end gap-0.5 h-4 md:h-5">
      {[...Array(6)].map((_, i) => (
        <motion.span
          key={i}
          className="w-0.5 rounded-full bg-cyan-400"
          animate={{
            height: [4, 14, 6, 18, 4],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.06,
          }}
        />
      ))}
    </div>
  );
};

export default function ShopkeeperFlow() {
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  const spotlightX = useTransform(springX, [0, 1440], ["10%", "90%"]);
  const spotlightY = useTransform(springY, [0, 900], ["10%", "90%"]);

  const [searchIndex, setSearchIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [supplierFrame, setSupplierFrame] = useState(0);
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    const typing = setInterval(() => {
      setSearchIndex((prev) => {
        const next = prev + 1;
        if (next >= searchSequence.length) return 0;
        return next;
      });
    }, 1200);
    return () => clearInterval(typing);
  }, []);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowSuggestions(true), 1200);
    const timer2 = setTimeout(() => setShowResults(true), 2600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSupplierFrame((prev) => (prev + 1) % supplierSnapshots.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += 2;
      if (value >= 96) value = 96;
      setSavings(value);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const suppliers = useMemo(() => supplierSnapshots[supplierFrame], [supplierFrame]);

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-[#030712] font-sans antialiased selection:bg-cyan-500/30 text-slate-200"
    >
      <AnimatedGrid />
      <CommerceParticleField />

      {/* Ambient Mouse Spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(34,211,238,0.04), transparent 40%)`,
          x: springX,
          y: springY,
        }}
      />

      <motion.div
        className="absolute h-[800px] w-[800px] rounded-full blur-[160px] pointer-events-none hidden lg:block"
        style={{
          left: spotlightX,
          top: spotlightY,
          background: "radial-gradient(circle, rgba(14,165,233,0.05), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-28">
        
        {/* Premium Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/10 bg-cyan-500/5 px-4 py-1.5 backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
              Shopkeeper Procurement Flow
            </span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Discover Products. Compare Suppliers. Buy Smarter.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-slate-400 font-normal leading-relaxed tracking-wide">
          Track live pricing, compare suppliers, and place smarter wholesale orders from one unified platform.
            </p>
        </motion.div>

        {/* 3-Column Equal Height Container Layout */}
        <div className="mt-16 grid items-stretch gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1: Product Discovery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -6, scale: 1.005 }}
            className="flex flex-col h-full relative group transition-all duration-300 shadow-white/40 rounded-[25px] shadow-sm"
          >
            <div className="absolute inset-0 bg-cyan-500/[0.01] rounded-[24px] blur-2xl pointer-events-none transition-all duration-500 group-hover:bg-cyan-500/[0.03]" />
            <div className="flex flex-col h-full relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-slate-950/40 p-5 sm:p-6 lg:p-8 backdrop-blur-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)] group-hover:shadow-[0_20px_60px_-10px_rgba(34,211,238,0.1)] transition-shadow duration-300">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.06),transparent_45%)] pointer-events-none transition-all duration-300 group-hover:opacity-100 opacity-70" />
              <div className="absolute inset-px rounded-[23px] border border-white/[0.04] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 flex items-start justify-between">
                  <div>
<div className="flex items-center gap-3">

  {/* Flow Step Badge */}
  <div className="relative inline-flex items-center">

    {/* Glow */}
    <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-md" />

    {/* Badge */}
    <div className="relative inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-slate-900/90 px-3 py-1 backdrop-blur-xl shadow-[0_0_20px_rgba(56,189,248,0.08)]">

      {/* Pulse Dot */}
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
      </span>

      {/* Step Text */}
      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-sky-300">
        Step 01
      </span>
    </div>

    {/* Flow Arrow */}
    <div className="ml-2 hidden sm:flex items-center">
      <div className="h-px w-6 bg-gradient-to-r from-sky-400/50 to-transparent" />
      <ArrowRight className="h-3.5 w-3.5 text-sky-400/70 -ml-1" />
    </div>
  </div>

</div>
                    
                    <h3 className="mt-3 text-xl font-bold text-white tracking-tight sm:text-2xl lg:text-3xl flex items-center gap-2">
                      Product Search
                    </h3>
                  </div>
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-cyan-400 shrink-0 shadow-inner"
                  >
                    <Activity className="h-5 w-5" />
                  </motion.div>
                </div>

                {/* Animated Simulated Input Field */}
                <div className="relative flex h-12 sm:h-14 items-center rounded-2xl border border-white/[0.08] bg-slate-900/80 px-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
                  <Search className="mr-3 h-4 w-4 text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">
                      {searchSequence[searchIndex]}
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="ml-0.5 text-cyan-400 font-light"
                      >
                        |
                      </motion.span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <SearchWave />
                    <div className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-sm">
                      <Mic className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>

                {/* Intelligent Dynamic Suggestions List */}
                <div className="mt-5 flex-1 flex flex-col justify-start">
                  <AnimatePresence mode="popLayout">
                    {showSuggestions && (
                      <div className="space-y-2">
                        {/* Desktop displays 4 rows, Tablet 3 rows, Mobile compact variant slice */}
                        {suggestions.map((item, index) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: index * 0.04 }}
                            whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.04)" }}
                            className={`group/item flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] px-4 py-2.5 sm:py-3 transition-colors ${
                              index >= 2 ? "hidden sm:flex" : "flex"
                            } ${index >= 4 ? "md:hidden lg:flex" : ""}`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.6)] shrink-0" />
                              <span className="text-xs sm:text-sm font-medium text-slate-300 truncate">
                                {item}
                              </span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-600 transition-colors group-hover/item:text-cyan-400 shrink-0" />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Supplier Intelligence */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
            whileHover={{ y: -6, scale: 1.005 }}
            className="flex flex-col h-full relative group transition-all duration-300 shadow-white/40 rounded-[25px] shadow-sm"
          >
            <div className="absolute inset-0 bg-sky-500/[0.01] rounded-[24px]  blur-2xl pointer-events-none transition-all duration-500 group-hover:bg-sky-500/[0.03] " />
            <div className="flex flex-col h-full relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-slate-950/40 p-5 sm:p-6 lg:p-8 backdrop-blur-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)] group-hover:shadow-[0_20px_60px_-10px_rgba(14,165,233,0.1)] transition-shadow duration-300">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.06),transparent_45%)] pointer-events-none transition-all duration-300 group-hover:opacity-100 opacity-70" />
              <div className="absolute inset-px rounded-[23px] border border-white/[0.04] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 flex items-start justify-between">
                  <div>
<div className="flex items-center gap-3">

  {/* Flow Step Badge */}
  <div className="relative inline-flex items-center">

    {/* Glow */}
    <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-md" />

    {/* Badge */}
    <div className="relative inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-slate-900/90 px-3 py-1 backdrop-blur-xl shadow-[0_0_20px_rgba(56,189,248,0.08)]">

      {/* Pulse Dot */}
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
      </span>

      {/* Step Text */}
      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-sky-300">
        Step 02
      </span>
    </div>

    {/* Flow Arrow */}
    <div className="ml-2 hidden sm:flex items-center">
      <div className="h-px w-6 bg-gradient-to-r from-sky-400/50 to-transparent" />
      <ArrowRight className="h-3.5 w-3.5 text-sky-400/70 -ml-1" />
    </div>
  </div>
</div>
                    <h3 className="mt-3 text-xl font-bold text-white tracking-tight sm:text-2xl lg:text-3xl flex items-center gap-2">
                      Live Price Engine
                    </h3>
                  </div>
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-sky-400 shrink-0 shadow-inner"
                  >
                    <Radio className="h-5 w-5" />
                  </motion.div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Top Supplier Matches
                    </h4>
                    <div className="flex items-center gap-1.5 text-cyan-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Real-Time</span>
                    </div>
                  </div>

                  {/* Supplier Dynamic Live Feed rows */}
                  <LayoutGroup id="supplier-ranking">
                    <div className="space-y-2 flex-1 flex flex-col justify-start">
                      <AnimatePresence mode="popLayout">
                        {suppliers.map((supplier, index) => (
                          <motion.div
                            layout
                            key={`${supplier.id}-${supplierFrame}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`relative overflow-hidden rounded-xl border p-2.5 sm:p-3 transition-all ${
                              index === 0
                                ? "border-emerald-500/20 bg-emerald-950/10 shadow-[inset_0_1px_10px_rgba(16,185,129,0.05)]"
                                : "border-white/[0.04] bg-white/[0.01]"
                            } ${
                              index >= 2 ? "hidden sm:block" : "block"
                            } ${index >= 3 ? "md:hidden lg:block" : ""}`}
                          >
                            <div className="relative z-10 flex items-center justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {index === 0 && (
                                    <span className="inline-flex rounded-md bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-400 shrink-0 shadow-sm">
                                      Cheapest
                                    </span>
                                  )}
                                  <h5 className="text-xs sm:text-sm font-medium text-slate-300 tracking-tight truncate">
                                    {supplier.name}
                                  </h5>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] sm:text-[11px] text-slate-400 font-medium">
                                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-600" />{supplier.distance}</span>
                                  <span className="flex items-center gap-1"><Clock3 className="h-3 w-3 text-slate-600" />{supplier.delivery}</span>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-slate-500 block">Price</span>
                                <span className="text-base sm:text-lg font-extrabold text-white tracking-tight">₹{supplier.price}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </LayoutGroup>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Smart Ordering Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6, scale: 1.005 }}
            className="flex flex-col h-full relative group md:col-span-2 lg:col-span-1 transition-all duration-300 shadow-white/40 rounded-[25px] shadow-sm"
          >
            <div className="absolute inset-0 bg-blue-500/[0.01] rounded-[24px] blur-2xl pointer-events-none transition-all duration-500 group-hover:bg-blue-500/[0.03]" />
            <div className="flex flex-col h-full relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-slate-950/40 p-5 sm:p-6 lg:p-8 backdrop-blur-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)] group-hover:shadow-[0_20px_60px_-10px_rgba(56,189,248,0.1)] transition-shadow duration-300">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.06),transparent_45%)] pointer-events-none transition-all duration-300 group-hover:opacity-100 opacity-70" />
              <div className="absolute inset-px rounded-[23px] border border-white/[0.04] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">

  {/* Flow Step Badge */}
  <div className="relative inline-flex items-center">

    {/* Glow */}
    <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-md" />

    {/* Badge */}
    <div className="relative inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-slate-900/90 px-3 py-1 backdrop-blur-xl shadow-[0_0_20px_rgba(56,189,248,0.08)]">

      {/* Pulse Dot */}
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
      </span>

      {/* Step Text */}
      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-sky-300">
        Step 03
      </span>
    </div>

    {/* Flow Arrow */}
    <div className="ml-2 hidden sm:flex items-center">
      <div className="h-px w-6 bg-gradient-to-r from-sky-400/50 to-transparent" />
      <ArrowRight className="h-3.5 w-3.5 text-sky-400/70 -ml-1" />
    </div>
  </div>

</div>
                      <h3 className="mt-3 text-xl font-bold text-white tracking-tight sm:text-2xl lg:text-3xl">
                        Place Order
                      </h3>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-sky-400 shrink-0 shadow-inner">
                      <Truck className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Summary Details Panel Box */}
                  <div className="rounded-2xl border border-white/[0.06] bg-slate-900/40 p-3.5 sm:p-4 shadow-[inset_0_1px_6px_rgba(0,0,0,0.6)]">
                    <div className="flex items-start justify-between gap-2 border-b border-white/[0.06] pb-3">
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-sky-400">Selected Vendor</p>
                        <h4 className="mt-0.5 font-semibold text-sm sm:text-base text-white tracking-tight truncate">Tamil Harvest Network</h4>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 font-medium">15 km • 5 hrs Delivery</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-slate-500">Best Rate</p>
                        <div className="text-xl sm:text-2xl font-black text-white leading-tight">₹26</div>
                        <p className="text-[9px] font-bold text-emerald-400">Lowest</p>
                      </div>
                    </div>

                    <div className="pt-3 space-y-1.5 text-[11px] sm:text-xs font-semibold">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Product</span>
                        <span className="text-white font-medium">Premium Onion</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Quantity</span>
                        <span className="text-white font-medium">500 KG</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/[0.04] pt-2 mt-1.5">
                        <span className="text-slate-400">Estimated Total</span>
                        <span className="text-emerald-400 font-bold text-xs sm:text-sm">₹13,000</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Progress Metrics & CTA Section */}
                <div className="mt-5 sm:mt-6">
                  <div className="mb-2 hidden md:flex items-center justify-between text-[11px] sm:text-xs font-bold">
                    <span className="text-slate-500 uppercase tracking-wider">Confidence Score</span>
                    <span className="text-sky-400 tracking-tight">{savings}%</span>
                  </div>
                  <div className="hidden md:block h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${savings}%` }}
                      transition={{ duration: 1.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 shadow-[0_0_8px_rgba(14,165,233,0.4)]"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(14,165,233,0.95)" }}
                    whileTap={{ scale: 0.99 }}
                    className="sm:mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-sky-950/40 transition-colors focus:outline-none border border-sky-400/20"
                  >
                    <span>Confirm Order</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  </motion.button>
                </div>

              </div>
            </div>
          </motion.div>

        </div>

        {/* Process Flow Block Anchor */}
        <ShopkeeperProcess />
      </div>
    </section>
  );
}