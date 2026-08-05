import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Activity,
  ArrowRight,
  Shield,
  Sparkles,
  Globe2,
  Users,
  CheckCircle2,
  TrendingUp,
  PackageCheck,
  Zap,
  Radio
} from 'lucide-react';

import Shopkeeper from "../../assets/retailer.png";
import Wholesaler from "../../assets/wholesaler.png";

// Premium Apple-style Easing Curve
const easePremium = [0.16, 1, 0.3, 1];

const TrustChip = ({ icon: Icon, text }) => (
  <motion.div
    whileHover={{ y: -2, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    className="flex items-center gap-1.5 px-3 py-1 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-full shadow-[0_2px_8px_rgba(15,23,42,0.02)] will-change-transform translate-z-0"
  >
    <Icon size={11} className="text-slate-500" />
    <span className="text-[10px] font-semibold tracking-wider text-slate-700 uppercase">
      {text}
    </span>
  </motion.div>
);

const FloatingWidget = ({ icon: Icon, title, subtitle, top, left, right, bottom, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 15 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{
      duration: 1,
      delay: delay,
      ease: easePremium
    }}
    className="absolute z-40 will-change-transform translate-z-0"
    style={{ top, left, right, bottom }}
  >
    {/* Inner wrapper for continuous floating to prevent conflict with entry animation */}
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay + 0.5 // Start floating after entrance completes
      }}
      className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-white/80 p-2 rounded-xl shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
    >
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center border border-pink-200/50">
        <Icon size={12} className="text-pink-600" />
      </div>
      <div className="flex flex-col pr-1.5">
        <span className="text-[9px] font-bold text-slate-900 tracking-wide">{title}</span>
        <span className="text-[8px] font-medium text-slate-500">{subtitle}</span>
      </div>
    </motion.div>
  </motion.div>
);

export default function HeroSection() {
  const navigate = useNavigate();
  
  // Actually utilizing the scroll parallax for premium background depth
  const { scrollY } = useScroll();
  const yParallaxFast = useTransform(scrollY, [0, 1000], [0, 300]);
  const yParallaxSlow = useTransform(scrollY, [0, 1000], [0, 150]);
  const opacityFade = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative w-full lg:min-h-[70svh] xl:min-h-[80svh] overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans antialiased select-none flex flex-col justify-center items-center mt-20">

      {/* PARALLAX BACKGROUND ELEMENTS (Hardware Accelerated) */}
      <motion.div 
        style={{ y: yParallaxFast, opacity: opacityFade }}
        className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0 will-change-transform translate-z-0"
      >
        <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-pink-400/5 rounded-full blur-[100px]" />
        <div className="absolute top-40 right-[10%] w-[500px] h-[500px] bg-sky-400/5 rounded-full blur-[120px]" />
      </motion.div>

      {/* HERO COMPOSITION: STRICT 24% | 52% | 24% DESKTOP GRID */}
      <div className="relative z-10 w-full max-w-[1325px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[24fr_52fr_24fr] items-start gap-4 xl:gap-6" style={{ perspective: 1600 }}>
        
        {/* ==========================================
            LEFT COMPOSITION - RETAILER
        ========================================== */}
        <motion.div
          initial={{ opacity: 0, x: -60, rotateY: 10, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, rotateY: 4, scale: 1 }}
          transition={{ duration: 1.4, ease: easePremium }}
          className="hidden lg:block relative justify-self-center w-[300px] xl:w-[320px] h-[440px] mt-6 xl:mt-5 origin-right z-20 group will-change-transform translate-z-0"
        >
          {/* Inner motion div separates the float from the entrance animation */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {/* Refined Glass Window Card */}
            <div className="w-full h-full bg-white/85 p-2 rounded-2xl shadow-[0_16px_36px_-12px_rgba(15,23,42,0.08)] border border-white/90 relative overflow-hidden backdrop-blur-xl transition-transform duration-500 group-hover:rotate-y-0 group-hover:scale-[1.02] transform-gpu">
              <div className="absolute inset-0 rounded-[14px] border border-white/60 pointer-events-none z-30" />
              
              {/* Window Header */}
              <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-30">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-300/80" />
                  <div className="w-2 h-2 rounded-full bg-slate-300/80" />
                  <div className="w-2 h-2 rounded-full bg-slate-300/80" />
                </div>
                <span className="text-[9px] font-semibold text-slate-500 tracking-wider">RETAILER</span>
              </div>

              <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100 relative mt-0">
                <img src={Shopkeeper} alt="Retailer Application" className="w-full h-full object-cover saturate-[1.1] contrast-[1.05] transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-[#0F172A]/15 to-transparent" />
              </div>

              {/* Captions */}
              <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-[9px] tracking-[0.2em] text-emerald-300 font-bold uppercase">Synced</span>
                </div>
                <span className="text-xs font-semibold tracking-wide text-white">
                  Intelligent Ordering
                </span>
              </div>
            </div>

            <FloatingWidget icon={PackageCheck} title="Inventory Updated" subtitle="Just now • Local Store" top="12%" right="-10%" delay={1.2} />
            <FloatingWidget icon={TrendingUp} title="Demand Alert" subtitle="High volume detected" bottom="20%" left="-8%" delay={1.5} />
          </motion.div>
        </motion.div>

        {/* ==========================================
            CENTER COMPOSITION - CORE HERO
        ========================================== */}
        <div className="flex flex-col items-center justify-center text-center w-full max-w-[760px] mx-auto z-30 px-2 mt-5 lg:-mt-12">
          
          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: easePremium, delay: 0.1 }}
            className="text-[44px] sm:text-[60px] md:text-[72px] xl:text-[72px] font-black tracking-[-0.02em] text-[#0F172A] leading-[0.93] uppercase will-change-transform translate-z-0"
          >
            Connect.<br/>
            Compare.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 drop-shadow-sm">
              Scale Faster.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: easePremium, delay: 0.2 }}
            className="mt-6 text-base md:text-lg text-slate-500 max-w-[520px] leading-[1.6] font-medium tracking-tight will-change-transform translate-z-0"
          >
            The enterprise operating system for wholesale. Discover suppliers, compare live pricing, manage complex orders, and track regional logistics on one unified platform.
          </motion.p>

          {/* CTA GROUP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: easePremium, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto will-change-transform translate-z-0"
          >
            <button 
              onClick={() => {
                const el = document.getElementById("dashboard");
                if(el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                else navigate('/dash');
              }}
              className="relative group overflow-hidden h-12 px-7 bg-[#0F172A] font-semibold text-sm tracking-wide text-white rounded-xl transition-all duration-300 shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_12px_32px_rgba(15,23,42,0.18)] flex items-center justify-center gap-2.5 w-full sm:w-auto hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset,0_16px_40px_rgba(236,72,153,0.3)] transform-gpu"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-transparent to-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <motion.div 
                animate={{ x: ['-100%', '200%'] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-z-0"
              />
              <Sparkles size={14} className="text-pink-300 relative z-10" />
              <span className="relative z-10">Start Scaling Now</span>
              <ArrowRight size={14} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button 
              onClick={
                () => {
                const el = document.getElementById("features");
                if(el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 90;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="group h-12 px-7 bg-white/60 backdrop-blur-md hover:bg-white text-sm font-semibold tracking-wide text-slate-800 rounded-xl transition-all duration-300 border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex items-center justify-center gap-2.5 w-full sm:w-auto hover:scale-[1.02] hover:-translate-y-0.5 hover:border-slate-300 transform-gpu"
            >
              <Shield size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              <span>Explore Platform</span>
            </button>
          </motion.div>

        </div>

        {/* ==========================================
            RIGHT COMPOSITION - WHOLESALER
        ========================================== */}
        <motion.div
          initial={{ opacity: 0, x: 60, rotateY: -10, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, rotateY: -4, scale: 1 }}
          transition={{ duration: 1.4, ease: easePremium, delay: 0.1 }}
          className="hidden lg:block relative justify-self-center w-[300px] xl:w-[320px] h-[440px] mt-6 xl:mt-8 origin-left z-20 group will-change-transform translate-z-0"
        >
          {/* Inner motion div separates the float from the entrance animation */}
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="w-full h-full"
          >
            {/* Refined Glass Window Card */}
            <div className="w-full h-full bg-white/85 p-2 rounded-2xl shadow-[0_16px_36px_-12px_rgba(15,23,42,0.08)] border border-white/90 relative overflow-hidden backdrop-blur-xl transition-transform duration-500 group-hover:rotate-y-0 group-hover:scale-[1.02] transform-gpu">
              <div className="absolute inset-0 rounded-[14px] border border-white/60 pointer-events-none z-30" />
              
              {/* Window Header */}
              <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-30">
                <span className="text-[9px] font-semibold text-slate-500 tracking-wider">WHOLESALER</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-300/80" />
                  <div className="w-2 h-2 rounded-full bg-slate-300/80" />
                  <div className="w-2 h-2 rounded-full bg-slate-300/80" />
                </div>
              </div>

              <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100 relative mt-0">
                <img src={Wholesaler} alt="Wholesaler Application" style={{ transform: "scaleX(-1)" }} className="w-full h-full object-cover saturate-[1.1] contrast-[1.05] transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-[#0F172A]/15 to-transparent" />
              </div>

              {/* Captions */}
              <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col gap-1 items-end text-right">
                <div className="flex items-center gap-1.5 flex-row-reverse">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                  <span className="text-[9px] tracking-[0.2em] text-sky-300 font-bold uppercase">Online</span>
                </div>
                <span className="text-xs font-semibold tracking-wide text-white">
                  Live Inventory Stream
                </span>
              </div>
            </div>

            <FloatingWidget icon={Globe2} title="Supplier Online" subtitle="Regional Dist. Center" top="15%" left="-8%" delay={1.4} />
            <FloatingWidget icon={Zap} title="Live Restock" subtitle="Pallet confirmed" bottom="16%" right="-6%" delay={1.7} />
          </motion.div>
        </motion.div>

        {/* ==========================================
            MOBILE & TABLET COMPOSITION
        ========================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: easePremium }}
          className="w-full mt-10 lg:hidden px-2 z-20 will-change-transform translate-z-0"
        >
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Mobile Retailer Card */}
            <div className="bg-white/85 p-2 rounded-2xl shadow-[0_16px_36px_-12px_rgba(15,23,42,0.08)] border border-white/90 backdrop-blur-xl relative transform-gpu hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute inset-0 rounded-[14px] border border-white/60 pointer-events-none z-30" />
              <div className="rounded-xl overflow-hidden bg-slate-100 relative aspect-[4/5]">
                <img src={Shopkeeper} alt="Retailer" className="w-full h-full object-cover saturate-[1.1] contrast-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-[#0F172A]/15 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="text-[8px] tracking-[0.2em] text-emerald-300 font-bold uppercase">Synced</span>
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide text-white leading-tight">
                    Intelligent<br/>Ordering
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Wholesaler Card */}
            <div className="bg-white/85 p-2 rounded-2xl shadow-[0_16px_36px_-12px_rgba(15,23,42,0.08)] border border-white/90 backdrop-blur-xl relative transform-gpu hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute inset-0 rounded-[14px] border border-white/60 pointer-events-none z-30" />
              <div className="rounded-xl overflow-hidden bg-slate-100 relative aspect-[4/5]">
                <img src={Wholesaler} alt="Wholesaler" className="w-full h-full object-cover saturate-[1.1] contrast-[1.05]" style={{ transform: "scaleX(-1)" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-[#0F172A]/15 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1 items-end text-right">
                  <div className="flex items-center gap-1.5 flex-row-reverse">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                    <span className="text-[8px] tracking-[0.2em] text-sky-300 font-bold uppercase">Online</span>
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide text-white leading-tight">
                    Live Inventory<br/>Stream
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}