import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Truck,
  ArrowRight,
  Check,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState("shopkeeper");
  const [loading, setLoading] = useState(false);

  // CONTAINER ENTRY ANIMATION
  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  // ITEM ENTRY ANIMATION
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
      },
    },
  };

  // KEYBOARD SUPPORT (ArrowLeft, ArrowRight, Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading) return;

      if (e.key === "ArrowRight") {
        setSelectedRole("wholesaler");
      }
      if (e.key === "ArrowLeft") {
        setSelectedRole("shopkeeper");
      }
      if (e.key === "Enter") {
        e.preventDefault();
        handleRoleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, selectedRole]);

  // SUBMIT HANDLER
  const handleRoleSubmit = (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    setLoading(true);

    setTimeout(() => {
      console.log("Confirmed platform operational role:", selectedRole);
      setLoading(false);
    }, 1400);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-200 font-sans text-slate-800 flex items-center justify-center px-4 py-6 sm:p-8 antialiased">

        <div className="absolute inset-0 opacity-[0.03] bg-[size:46px_46px] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]" />

        {/* TOP LIGHT */}
        <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[760px] h-[360px] bg-pink-500/5 blur-3xl rounded-full" />
      
      {/* BACKGROUND FLOATING AMBIENT GLOWS */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-8%] right-[-8%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-pink-400/15 to-rose-400/0 blur-[120px] pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.07, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute bottom-[-8%] left-[-8%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-purple-400/10 to-pink-400/0 blur-[120px] pointer-events-none"
      />

      {/* MAIN LAYOUT CONTAINER */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/95 p-5 sm:p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.06)] backdrop-blur-md"
      >
        {/* COMPONENT GRID MESH */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:20px_20px]" />

        {/* TOP GLOW REFLECTION LINE */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-70" />

           <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -0.5 }}
            className="flex w-[135px] items-start gap-1.5 rounded-full border border-slate-200/60 bg-slate-50 px-3 py-1 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-pink-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              StockLinker
            </span>
          </motion.div>

        {/* HEADER SECTION */}
        <div className="flex flex-col items-center text-center">


          <motion.h1 variants={itemVariants} className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Choose Your <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent ">Role</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
            Select your business tier below to initialize your personalized asset pipeline.
          </motion.p>
        </div>

        {/* LAYOUT FORM CONTROLLER */}
        <form onSubmit={handleRoleSubmit} className="mt-6 sm:mt-8 space-y-6">
          
          {/* ROLE CARDS WRAPPER */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            
            {/* OPTION A: SHOPKEEPER CARD */}
            <motion.div
              variants={itemVariants}
              whileHover={loading ? {} : { y: -3, scale: 1.005 }}
              whileTap={loading ? {} : { scale: 0.995 }}
              onClick={() => !loading && setSelectedRole("shopkeeper")}
              className={`group relative cursor-pointer overflow-hidden rounded-[20px] border p-5 transition-all duration-300 ${
                selectedRole === "shopkeeper"
                  ? "border-pink-500 bg-white shadow-[0_12px_30px_rgba(244,63,94,0.06)] ring-1 ring-pink-500/10"
                  : "border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white"
              }`}
            >
              {/* BRAND ACTIVE CARD OVERLAY */}
              <div
                className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  selectedRole === "shopkeeper" ? "bg-pink-500/[0.015]" : ""
                }`}
              />

              {/* FLEX MATRIX ROW */}
              <div className="relative flex items-start gap-4">
                
                {/* DYNAMIC COMPONENT ICON CONTAINER */}
                <motion.div
                  whileHover={loading ? {} : { rotate: [-3, 3, -3], scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] transition-all duration-300 ${
                    selectedRole === "shopkeeper"
                      ? "bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/10"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Store className="h-5 w-5" />
                </motion.div>

                {/* STRUCTURAL ALIGNMENT BLOCK */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold tracking-tight text-slate-900">
                      Shopkeeper
                    </h3>
                    
                    {/* DYNAMIC RADIO SELECTION STATUS */}
                    <AnimatePresence border>
                      {selectedRole === "shopkeeper" && (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-pink-500 bg-pink-500 text-white shadow-sm"
                        >
                          <Check className="h-3 w-3 stroke-[3]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* STACKED EXTENDED LIST DATA */}
                  <div className="mt-3 space-y-1.5">
                    <motion.div
                      whileHover={{ x: 1 }}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-500"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="truncate">Browse wholesale catalogs</span>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 1 }}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-500"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="truncate">Track procurement logistics</span>
                    </motion.div>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* OPTION B: WHOLESALER CARD */}
            <motion.div
              variants={itemVariants}
              whileHover={loading ? {} : { y: -3, scale: 1.005 }}
              whileTap={loading ? {} : { scale: 0.995 }}
              onClick={() => !loading && setSelectedRole("wholesaler")}
              className={`group relative cursor-pointer overflow-hidden rounded-[20px] border p-5 transition-all duration-300 ${
                selectedRole === "wholesaler"
                  ? "border-pink-500 bg-white shadow-[0_12px_30px_rgba(244,63,94,0.06)] ring-1 ring-pink-500/10"
                  : "border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white"
              }`}
            >
              {/* BRAND ACTIVE CARD OVERLAY */}
              <div
                className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  selectedRole === "wholesaler" ? "bg-pink-500/[0.015]" : ""
                }`}
              />

              {/* FLEX MATRIX ROW */}
              <div className="relative flex items-start gap-4">
                
                {/* DYNAMIC COMPONENT ICON CONTAINER */}
                <motion.div
                  whileHover={loading ? {} : { rotate: [-3, 3, -3], scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] transition-all duration-300 ${
                    selectedRole === "wholesaler"
                      ? "bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/10"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Truck className="h-5 w-5" />
                </motion.div>

                {/* STRUCTURAL ALIGNMENT BLOCK */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold tracking-tight text-slate-900">
                      Wholesaler
                    </h3>
                    
                    {/* DYNAMIC RADIO SELECTION STATUS */}
                    <AnimatePresence>
                      {selectedRole === "wholesaler" && (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-pink-500 bg-pink-500 text-white shadow-sm"
                        >
                          <Check className="h-3 w-3 stroke-[3]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* STACKED EXTENDED LIST DATA */}
                  <div className="mt-3 space-y-1.5">
                    <motion.div
                      whileHover={{ x: 1 }}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-500"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="truncate">Automate product inventory</span>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 1 }}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-500"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="truncate">Receive merchant pipelines</span>
                    </motion.div>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>

          {/* SYSTEM CALL TO ACTION STRIPS */}
          <motion.div variants={itemVariants} className="space-y-4 pt-1">
            <motion.button
              whileHover={loading ? {} : { scale: 1.005, y: -1 }}
              whileTap={loading ? {} : { scale: 0.995 }}
              type="submit"
              disabled={loading}
              className="relative group flex w-full items-center justify-center ap-2 overflow-hidden rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/15 hover:shadow-pink-500/25 transition-all duration-300 disabled:opacity-80 disabled:pointer-events-none"
            >
              {/* RUNTIME GLOW EFFECTS */}
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "linear",
                }}
                className="absolute inset-y-0 left-0 w-24 skew-x-12 bg-white/15 pointer-events-none"
              />

              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Workspace</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </>
                )}
              </div>
            </motion.button>

            {/* SYSTEM LEGAL FOOTER */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-1.5 text-center text-[11px] sm:text-xs text-slate-400/90"
            >
              <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-slate-300" />
              <span>
                Operational layouts remain adjustable dynamic variables inside standard security workspaces later.
              </span>
            </motion.div>
          </motion.div>

        </form>
      </motion.div>
    </div>
  );
}