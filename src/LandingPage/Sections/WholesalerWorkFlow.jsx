import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion";

import {
  Bell,
  ArrowRight,
  CheckCircle2,
  Truck,
  MapPin,
  Layers,
  ShieldCheck,
  RefreshCw,
  FileCheck2,
  DollarSign,
  Download,
  Building2,
  Store,
  Loader2,
  Activity,
  Sparkles,
} from "lucide-react";
import WholesalerProcess from "./WholesalerProcess";

/* =========================================================
   PREMIUM STOCKLINKER — SHOPKEEPER FLOW
   OPTIMIZED FLUID TYPOGRAPHY & ZERO WASTED VERTICAL SPACE
========================================================= */

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function WholesalerFlow() {
  const [activeCard, setActiveCard] = useState(null);

  return (
    <section className="relative overflow-hidden py-8 sm:py-14 md:py-16 bg-[#020617] font-sans antialiased w-full">
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-12">
        {/* SECTION HEADER */}
        <div className="mx-auto max-w-4xl text-center mb-8 sm:mb-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/10 bg-cyan-500/5 px-4 py-1.5 backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
              Wholssaler Procurement Flow
            </span>
          </div>

          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-tight">
            Confirm Orders. Route Efficiently. Deliver Seamlessly.
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-slate-400/80">
             Manage confirmations, delivery coordination, and wholesale fulfillment with realtime logistics intelligence.
          </p>
        </div>

        {/* RESPONSIVE WIDE GRID SYSTEM */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-8 w-full xl:px-10 items-stretch"
        >
          {/* =========================================================
              CARD 01 - SEARCH MARKETPLACE
          ========================================================= */}
          <motion.div
            custom={0}
            variants={cardVariants}
            onMouseEnter={() => setActiveCard(1)}
            onMouseLeave={() => setActiveCard(null)}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[24px] border border-white/[0.06] bg-[#030712]/40 p-4 sm:p-5 lg:p-6 xl:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/25 hover:bg-[#030712]/70  h-full shadow-white/40 shadow-sm hover:shadow-white/70"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

            <div className="flex flex-col h-full justify-between gap-4 lg:gap-6">
              {/* TOP ELEMENT CONTENT */}
              <div className="space-y-4 lg:space-y-5">
                {/* HEADER */}
                <div className="flex items-center justify-between">
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-sky-400 shrink-0 shadow-inner">
                    <ShieldCheck className="h-4 w-4 xl:h-5 xl:w-5" />
                  </div>
                </div>

                {/* TITLE */}
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                    Accept Order
                  </h3>
                </div>

                {/* FLOW CONTENT CONTAINER - FILLING INTERIOR DIRECTLY */}
                <div className="space-y-2 sm:space-y-2.5">
                  {/* PAYLOAD LOG */}
                  <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] p-2.5 sm:p-3 transition-all duration-200 hover:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/15 bg-cyan-500/5">
                        <Bell className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm xl:text-base font-medium text-slate-200">
                          Order Request Payload
                        </h4>
                        <p className="text-[10px] sm:text-xs text-slate-500">
                          Dispatched upstream
                        </p>
                      </div>
                    </div>
                    <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5">
                      <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-cyan-400">
                        Sent
                      </span>
                    </div>
                  </div>

                  {/* COMPACT ARROW */}
                  <div className="flex justify-center py-0.5">
                    <ArrowRight className="h-3 w-3 rotate-90 text-cyan-500/30" />
                  </div>

                  {/* PENDING VALIDATION STEP */}
                  <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.02] p-2.5 sm:p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/5">
                          <Loader2 className="h-4 w-4 animate-spin text-amber-400" style={{ animationDuration: "3s" }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs sm:text-sm xl:text-base font-medium text-slate-200">
                              Pending Validation
                            </h4>
                            <Activity className="h-3.5 w-3.5 animate-pulse text-amber-400/60" />
                          </div>
                          <p className="text-[10px] sm:text-xs text-amber-400/50">
                            Telemetry syncing...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                        </span>
                        <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-amber-400">
                          Verifying
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* COMPACT ARROW */}
                  <div className="flex justify-center py-0.5">
                    <ArrowRight className="h-3 w-3 rotate-90 text-amber-500/30" />
                  </div>

                  {/* CONFIRMED LOG */}
                  <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.01] p-2.5 sm:p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm xl:text-base font-medium text-slate-200">
                            Allocation Confirmed
                          </h4>
                          <p className="text-[10px] sm:text-xs text-emerald-500/50">
                            Inventory locked
                          </p>
                        </div>
                      </div>
                      <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5">
                        <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
                          Confirmed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* =========================================================
              CARD 02 - ROUTE DELIVERY TRACKING
          ========================================================= */}
          <motion.div
            custom={1}
            variants={cardVariants}
            onMouseEnter={() => setActiveCard(2)}
            onMouseLeave={() => setActiveCard(null)}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[24px] border border-white/[0.06] bg-[#030712]/40 p-4 sm:p-5 lg:p-6 xl:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/25 hover:bg-[#030712]/70 shadow-white/40 shadow-sm hover:shadow-white/70 h-full"
          >
            <div className="flex flex-col h-full justify-between gap-4 lg:gap-6">
              <div className="space-y-4 lg:space-y-5">
                {/* HEADER */}
                <div className="flex items-center justify-between">
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-sky-400 shrink-0 shadow-inner">
                    <Layers className="h-4 w-4 xl:h-5 xl:w-5" />
                  </div>
                </div>

                {/* TITLE */}
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                    Route Delivery Tracking
                  </h3>
                </div>

                {/* TELEMETRY MAP AREA - FIXED VERTICAL HEIGHT WITHOUT WASTED GAP */}
                <div>
                  <div className="relative h-[150px] sm:h-[180px] lg:h-[210px] xl:h-[230px] overflow-hidden rounded-xl border border-white/[0.04] bg-black/30 p-3 sm:p-4">
                    <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:16px_16px]" />

                    {/* ROUTE PIPELINE */}
                    <div className="absolute left-[18px] sm:left-[22px] top-[20px] bottom-[20px] w-[1px] bg-white/[0.06]">
                      <motion.div
                        className="h-1/4 w-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
                        animate={{ y: ["-100%", "400%"] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>

                    {/* LIVE NODES LIST */}
                    <div className="relative z-10 flex h-full flex-col justify-between py-1">
                      {[
                        { icon: Building2, label: "Regional Hub" },
                        { icon: MapPin, label: "Transit Checkpoint" },
                        { icon: MapPin, label: "Autonomous Lane", hideMobile: true },
                        { icon: MapPin, label: "Mathi market", hideMobile: true },
                        { icon: Store, label: "Your Store" },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={i} className={`items-center gap-3 sm:gap-4 ${item.hideMobile ? "hidden sm:flex" : "flex"}`}>
                            <div className="flex h-2.5 w-2.5 sm:h-3 sm:w-3 items-center justify-center rounded-full border border-white/20 bg-[#030712]">
                              <div className="h-1 w-1 rounded-full bg-cyan-400" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon className="h-3.5 w-3.5 text-cyan-400/60" />
                              <span className="text-[11px] sm:text-xs xl:text-sm font-medium text-slate-400">
                                {item.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ANIMATED TRUCK TRACKER */}
                    <motion.div
                      className="absolute left-[10px] sm:left-[13px] z-20 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center"
                      animate={{ y: [10, 120, 10] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="absolute inset-0 rounded-md bg-cyan-400/10 blur-[4px]" />
                      <div className="relative flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-md border border-cyan-400/80 bg-[#030712] shadow-md">
                        <Truck className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-cyan-400" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* =========================================================
              CARD 03 - DELIVERY TERMINAL (ORDER DELIVERED)
          ========================================================= */}
          <motion.div
            custom={2}
            variants={cardVariants}
            onMouseEnter={() => setActiveCard(3)}
            onMouseLeave={() => setActiveCard(null)}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[24px] border border-white/[0.06] bg-[#030712]/40 p-4 sm:p-5 lg:p-6 xl:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/25 hover:bg-[#030712]/70 shadow-white/40 shadow-sm hover:shadow-white/70 h-full md:col-span-2 lg:col-span-1"
          >
            <div className="flex flex-col h-full justify-between gap-4 lg:gap-6">
              <div className="space-y-4 lg:space-y-5">
                {/* HEADER */}
                <div className="flex items-center justify-between">
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-sky-400 shrink-0 shadow-inner">
                    <RefreshCw className="h-4 w-4 xl:h-5 xl:w-5" />
                  </div>
                </div>

                {/* SECURE DELIVERY STATUS BADGE */}
                <div className="flex flex-col items-center text-center py-2 sm:py-3">
                  <div className="relative flex h-14 w-14 sm:h-16 items-center justify-center">
                    <motion.div
                      className="absolute inset-0 rounded-full border border-cyan-400/20"
                      animate={{ scale: [0.95, 1.2, 0.95], opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 shadow-sm">
                      <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                    </div>
                  </div>

                  <h3 className="mt-2.5 text-base sm:text-lg xl:text-xl font-bold tracking-tight text-white">
                    Order Delivered Securely
                  </h3>
                </div>

                {/* CHECKLIST STEPS */}
                <div className="space-y-2">
                  {[
                    { icon: FileCheck2, label: "Ledger Auto-Synced" },
                    { icon: DollarSign, label: "Payment Protocol Cleared" },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] px-3.5 py-2.5 transition-all duration-200 hover:border-cyan-500/15 hover:bg-cyan-500/[0.01]"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 xl:h-5 xl:w-5 text-cyan-400/70" />
                          <span className="text-xs sm:text-sm xl:text-base text-slate-300">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex h-4 w-4 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/5">
                          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ACTION BUTTON & ENCRYPTED FOOTER */}
              <div className="space-y-2 pt-2">
                <button className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 text-xs sm:text-sm xl:text-base font-semibold text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/20 hover:bg-white/[0.04]">
                  <Download className="h-4 w-4 text-slate-500 transition-colors duration-300 group-hover/btn:text-cyan-400" />
                  <span>Download Secure Invoice</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-full" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
        <WholesalerProcess/>
      </div>
    </section>
  );
}