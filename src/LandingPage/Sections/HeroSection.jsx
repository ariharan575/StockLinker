


// import React from 'react';
// import { motion, useScroll, useTransform } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import {
//   Search,
//   Activity,
//   ArrowRight,
//   Shield,
//   Sparkles,
//   Globe2,
//   Users,
//   CheckCircle2,
//   TrendingUp,
//   PackageCheck,
//   Zap,
//   Radio,
//   Bell,
//   Truck,
//   Bot,
//   BadgeCheck,
//   Play
// } from 'lucide-react';

// const easePremium = [0.16, 1, 0.3, 1];

// const MagneticButton = ({ children, primary, ...props }) => (
//   <motion.button
//     whileHover={{ scale: 1.02 }}
//     whileTap={{ scale: 0.98 }}
//     className={`inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-semibold transition-all ${
//       primary
//         ? 'bg-[#0F172A] text-white shadow-lg shadow-[#0F172A]/20 hover:shadow-[#0F172A]/30'
//         : 'bg-white text-[#0F172A] border border-[#0F172A]/10 hover:border-[#0F172A]/20 shadow-lg shadow-[#0F172A]/5'
//     }`}
//     {...props}
//   >
//     {children}
//   </motion.button>
// );

// export default function HeroSection() {
//   const navigate = useNavigate();
//   const { scrollY } = useScroll();
//   const yParallax = useTransform(scrollY, [0, 1000], [0, 200]);
//   const opacityFade = useTransform(scrollY, [0, 400], [1, 0]);

//   const t = {
//     heroBadge: "🚀 Next-Gen Supply Chain",
//     heroTitle1: "Modern",
//     heroTitle2: "Supply Chain",
//     heroTitle3: "Intelligence",
//     heroDesc: "Real-time inventory tracking, AI-powered search in Tamil, and intelligent route optimization for modern businesses.",
//     heroBtn1: "Get Started",
//     heroBtn2: "Watch Demo"
//   };

//   return (
//     <section className="relative px-4 pb-24 pt-10 sm:px-8 lg:pb-32 lg:pt-28 bg-[#F8FAFC]">
//       <div className="mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-2">
//         <motion.div
//           initial={{
//             opacity: 0,
//             y: 80,
//             filter: "blur(18px)",
//           }}
//           animate={{
//             opacity: 1,
//             y: 0,
//             filter: "blur(0px)",
//           }}
//           transition={{
//             duration: 1,
//           }}
//           className="relative z-10"
//         >
//           <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-zinc-700">
//             <Sparkles className="h-4 w-4 text-cyan-400" />
//             {t.heroBadge}
//           </div>

//           <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-6xl lg:text-8xl">
//             <span className="text-zinc-950">
//               {t.heroTitle1}
//             </span>

//             <br />

//             <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">
//               {t.heroTitle2}
//             </span>

//             <br />

//             <span className="text-zinc-950">
//               {t.heroTitle3}
//             </span>
//           </h1>

//           <p className="mt-8 max-w-2xl text-lg leading-9 sm:text-xl text-zinc-600">
//             {t.heroDesc}
//           </p>

//           <div className="mt-10 flex flex-col gap-4 sm:flex-row">
//             <MagneticButton primary>
//               {t.heroBtn1}
//               <ArrowRight className="h-4 w-4" />
//             </MagneticButton>

//             <MagneticButton>
//               <Play className="h-4 w-4" />
//               {t.heroBtn2}
//             </MagneticButton>
//           </div>

//           <div className="mt-12 flex flex-wrap items-center gap-6">
//             {[
//               "Realtime Inventory",
//               "Tamil AI Search",
//               "Route Intelligence",
//             ].map((item) => (
//               <motion.div
//                 whileHover={{ y: -4 }}
//                 key={item}
//                 className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3"
//               >
//                 <BadgeCheck className="h-5 w-5 text-emerald-400" />
//                 <span className="text-sm font-medium">
//                   {item}
//                 </span>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{
//             opacity: 0,
//             scale: 0.9,
//             rotate: -3,
//           }}
//           animate={{
//             opacity: 1,
//             scale: 1,
//             rotate: 0,
//           }}
//           transition={{
//             duration: 1.2,
//           }}
//           className="relative"
//         >
//           <motion.div
//             animate={{
//               y: [0, -12, 0],
//             }}
//             transition={{
//               duration: 6,
//               repeat: Infinity,
//             }}
//             className="relative overflow-hidden rounded-[40px] border border-black/10 bg-white shadow-2xl backdrop-blur-2xl"
//           >
//             <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
//               <div className="flex items-center gap-3">
//                 <div className="flex gap-2">
//                   <div className="h-3 w-3 rounded-full bg-red-400" />
//                   <div className="h-3 w-3 rounded-full bg-yellow-400" />
//                   <div className="h-3 w-3 rounded-full bg-green-400" />
//                 </div>

//                 <div className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-700">
//                   stocklinker.ai/dashboard
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <Bell className="h-5 w-5 text-cyan-400" />
//                 <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
//               </div>
//             </div>

//             <div className="grid gap-6 p-6">
//               <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
//                 <motion.div
//                   whileHover={{ y: -8 }}
//                   className="rounded-[32px] border border-black/10 bg-zinc-50 p-6"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-zinc-500">
//                         Revenue Growth
//                       </p>

//                       <h3 className="mt-2 text-4xl font-black">
//                         +248%
//                       </h3>
//                     </div>

//                     <div className="rounded-2xl bg-emerald-500/10 p-4">
//                       <TrendingUp className="h-7 w-7 text-emerald-400" />
//                     </div>
//                   </div>

//                   <div className="mt-8 flex h-40 items-end gap-3">
//                     {[40, 80, 55, 100, 130, 95, 150].map(
//                       (h, i) => (
//                         <motion.div
//                           key={i}
//                           initial={{ height: 0 }}
//                           animate={{ height: h }}
//                           transition={{
//                             delay: i * 0.08,
//                             duration: 1,
//                           }}
//                           className="flex-1 rounded-t-3xl bg-gradient-to-t from-cyan-500 to-blue-400"
//                         />
//                       )
//                     )}
//                   </div>
//                 </motion.div>

//                 <div className="grid gap-6">
//                   <motion.div
//                     whileHover={{ scale: 1.02 }}
//                     className="rounded-[32px] border border-black/10 bg-zinc-50 p-6"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-zinc-500">
//                           Active Deliveries
//                         </p>

//                         <h4 className="mt-2 text-3xl font-black">
//                           1,284
//                         </h4>
//                       </div>

//                       <Truck className="h-10 w-10 text-cyan-400" />
//                     </div>

//                     <div className="mt-5">
//                       <div className="mb-2 flex justify-between text-xs">
//                         <span>Route efficiency</span>
//                         <span>92%</span>
//                       </div>

//                       <div className="h-3 overflow-hidden rounded-full bg-zinc-200">
//                         <motion.div
//                           initial={{ width: 0 }}
//                           whileInView={{ width: "92%" }}
//                           viewport={{ once: true }}
//                           transition={{ duration: 1.5 }}
//                           className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
//                         />
//                       </div>
//                     </div>
//                   </motion.div>

//                   <motion.div
//                     whileHover={{ scale: 1.02 }}
//                     className="rounded-[32px] border border-black/10 bg-zinc-50 p-6"
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="rounded-2xl bg-fuchsia-500/10 p-4">
//                         <Bot className="h-8 w-8 text-fuchsia-400" />
//                       </div>

//                       <div>
//                         <h4 className="text-lg font-bold">
//                           AI Assistant
//                         </h4>
//                         <p className="text-sm text-zinc-500">
//                           Predicting low stock items
//                         </p>
//                       </div>
//                     </div>

//                     <div className="mt-6 space-y-3">
//                       {[
//                         "Cooking Oil",
//                         "Basmati Rice",
//                         "Soft Drinks",
//                       ].map((item) => (
//                         <div
//                           key={item}
//                           className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
//                         >
//                           <span className="text-sm font-medium">
//                             {item}
//                           </span>

//                           <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
//                             Low
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </motion.div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

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
import FeaturesSection from './FeaturesSection';

const easePremium = [0.16, 1, 0.3, 1];

const TrustChip = ({ icon: Icon, text }) => (
  <motion.div
    whileHover={{ y: -1, scale: 1.01 }}
    className="flex items-center gap-1.5 px-3 py-1 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-full shadow-[0_2px_8px_rgba(15,23,42,0.02)]"
  >
    <Icon size={11} className="text-slate-500" />
    <span className="text-[10px] font-semibold tracking-wider text-slate-700 uppercase">
      {text}
    </span>
  </motion.div>
);

const FloatingWidget = ({ icon: Icon, title, subtitle, top, left, right, bottom, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
    transition={{
      opacity: { duration: 0.8, delay },
      scale: { duration: 0.8, delay, ease: easePremium },
      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
    }}
    className="absolute z-40 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-white/80 p-2 rounded-xl shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
    style={{ top, left, right, bottom }}
  >
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center border border-pink-200/50">
      <Icon size={12} className="text-pink-600" />
    </div>
    <div className="flex flex-col pr-1.5">
      <span className="text-[9px] font-bold text-slate-900 tracking-wide">{title}</span>
      <span className="text-[8px] font-medium text-slate-500">{subtitle}</span>
    </div>
  </motion.div>
);

export default function HeroSection() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacityFade = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative w-full lg:min-h-[70svh] xl:min-h-[80svh] overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans antialiased select-none flex flex-col justify-center items-center mt-20 ">

      {/* HERO COMPOSITION: STRICT 24% | 52% | 24% DESKTOP GRID */}
      <div className="relative z-10 w-full max-w-[1325px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[24fr_52fr_24fr] items-start gap-4 xl:gap-6" style={{ perspective: 1600 }}>
        
        {/* LEFT COMPOSITION - RETAILER (DESKTOP ONLY) */}
        <motion.div
          initial={{ opacity: 0, x: -60, rotateY: 10, filter: "blur(12px)" }}
          animate={{ opacity: 1, x: 0, rotateY: 4, filter: "blur(0px)", y: [0, -8, 0] }}
          transition={{
            opacity: { duration: 1.6, ease: easePremium },
            x: { duration: 1.6, ease: easePremium },
            rotateY: { duration: 1.6, ease: easePremium },
            filter: { duration: 1.2 },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut" }
          }}
          className="hidden lg:block relative justify-self-center w-[300px] xl:w-[320px] h-[440px] mt-6 xl:mt-5 origin-right z-20 group"
        >
          {/* Refined Glass Window Card */}
          <div className="w-full h-full bg-white/85 p-2 rounded-2xl shadow-[0_16px_36px_-12px_rgba(15,23,42,0.08)] border border-white/90 relative overflow-hidden backdrop-blur-xl transition-transform duration-500 group-hover:rotate-y-0 group-hover:scale-[1.01]">
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

        {/* CENTER COMPOSITION - CORE HERO (PRIMARY FOCAL POINT) */}
        <div className="flex flex-col items-center justify-center text-center w-full max-w-[760px] mx-auto z-30 px-2 mt-5 lg:-mt-12">
          
          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.98, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.4, ease: easePremium, delay: 0.1 }}
            className="text-[44px] sm:text-[60px] md:text-[72px] xl:text-[80px] font-black tracking-[-0.04em] text-[#0F172A] leading-[0.93] uppercase"
          >
            Connect.<br/>
            Compare.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 drop-shadow-sm">
              Scale Faster.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: easePremium, delay: 0.2 }}
            className="mt-6 text-base md:text-lg text-slate-500 max-w-[520px] leading-[1.6] font-medium tracking-tight"
          >
            The enterprise operating system for wholesale. Discover suppliers, compare live pricing, manage complex orders, and track regional logistics on one unified platform.
          </motion.p>

          {/* CTA GROUP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: easePremium, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <button 
              onClick={() => navigate('/dash')}
              className="relative group overflow-hidden h-12 px-7 bg-[#0F172A] font-semibold text-sm tracking-wide text-white rounded-xl transition-all duration-300 shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_12px_32px_rgba(15,23,42,0.18)] flex items-center justify-center gap-2.5 w-full sm:w-auto hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset,0_16px_40px_rgba(236,72,153,0.25)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-transparent to-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <motion.div 
                animate={{ x: ['-100%', '200%'] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              />
              <Sparkles size={14} className="text-pink-300 relative z-10" />
              <span className="relative z-10">Start Scaling Now</span>
              <ArrowRight size={14} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button className="group h-12 px-7 bg-white/60 backdrop-blur-md hover:bg-white text-sm font-semibold tracking-wide text-slate-800 rounded-xl transition-all duration-300 border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex items-center justify-center gap-2.5 w-full sm:w-auto hover:scale-[1.01] hover:-translate-y-0.5 hover:border-slate-300">
              <Shield size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              <span>Explore Platform</span>
              
            </button>
          </motion.div>

          {/* TRUST METRICS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            <TrustChip icon={Users} text="15,000+ Verified Businesses" />
            <TrustChip icon={Activity} text="99.99% Network Uptime" />
            <TrustChip icon={Shield} text="Enterprise Grade Security" />
            <TrustChip icon={Globe2} text="Global Supplier Access" />
          </motion.div>

        </div>

        {/* RIGHT COMPOSITION - WHOLESALER (DESKTOP ONLY) */}
        <motion.div
          initial={{ opacity: 0, x: 60, rotateY: -10, filter: "blur(12px)" }}
          animate={{ opacity: 1, x: 0, rotateY: -4, filter: "blur(0px)", y: [0, 8, 0] }}
          transition={{
            opacity: { duration: 1.6, ease: easePremium },
            x: { duration: 1.6, ease: easePremium },
            rotateY: { duration: 1.6, ease: easePremium },
            filter: { duration: 1.2 },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
          }}
          className="hidden lg:block relative justify-self-center w-[300px] xl:w-[320px] h-[440px] mt-6 xl:mt-8 origin-left z-20 group"
        >
          {/* Refined Glass Window Card */}
          <div className="w-full h-full bg-white/85 p-2 rounded-2xl shadow-[0_16px_36px_-12px_rgba(15,23,42,0.08)] border border-white/90 relative overflow-hidden backdrop-blur-xl transition-transform duration-500 group-hover:rotate-y-0 group-hover:scale-[1.01]">
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

        {/* MOBILE & TABLET COMPOSITION (Adapted to match Code 1 aesthetics) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="w-full mt-10 lg:hidden px-2 z-20"
        >
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Mobile Retailer Card */}
            <div className="bg-white/85 p-2 rounded-2xl shadow-[0_16px_36px_-12px_rgba(15,23,42,0.08)] border border-white/90 backdrop-blur-xl relative">
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
            <div className="bg-white/85 p-2 rounded-2xl shadow-[0_16px_36px_-12px_rgba(15,23,42,0.08)] border border-white/90 backdrop-blur-xl relative">
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