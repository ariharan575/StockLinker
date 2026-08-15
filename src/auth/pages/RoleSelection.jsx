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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState("shopkeeper");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { selectRole } = useAuth();

  // Classic & Simple Entry Animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.1, 0.25, 1], // Smooth, professional ease-out
        staggerChildren: 0.1 
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: [0.25, 0.1, 0.25, 1] 
      } 
    },
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading) return;
      if (e.key === "ArrowRight") setSelectedRole("wholesaler");
      if (e.key === "ArrowLeft") setSelectedRole("shopkeeper");
      if (e.key === "Enter") {
        e.preventDefault();
        handleRoleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, selectedRole]);

const handleRoleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    const formattedRole = selectedRole.toUpperCase(); 
    const result = await selectRole(formattedRole);

    console.log(result);
    
    // FIX: Check for result.success, not just result
    if (result.success) {
      navigate("/onboarding");
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-200 font-sans text-slate-800 flex items-center justify-center px-4 py-6 sm:p-8 antialiased">
        <div className="absolute inset-0 opacity-[0.03] bg-[size:46px_46px] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]" />
        <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[760px] h-[360px] bg-pink-500/5 blur-3xl rounded-full" />
      
      {/* Slower, subtle background animations so it doesn't distract */}
      <motion.div animate={{ opacity: [0.5, 0.7, 0.5] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-8%] right-[-8%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-pink-400/15 to-rose-400/0 blur-[120px] pointer-events-none" />
      <motion.div animate={{ opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-[-8%] left-[-8%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-purple-400/10 to-pink-400/0 blur-[120px] pointer-events-none" />

      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/95 p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.06)] backdrop-blur-md">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-70" />

           <motion.div variants={itemVariants} className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-slate-200/60 bg-slate-50 px-3 py-1.5 shadow-sm sm:mx-0 sm:w-[135px] sm:items-start sm:py-1">
            <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">StockLinker</span>
          </motion.div>

        <div className="flex flex-col items-center text-center sm:items-center">
          <motion.h1 variants={itemVariants} className="mt-4 text-[26px] font-black leading-tight tracking-tight text-slate-900 sm:mt-3 sm:text-3xl">
            Choose Your <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent ">Role</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-2 max-w-md line-clamp-2 text-[13px] font-medium leading-snug text-slate-500 sm:mt-1.5 sm:line-clamp-none sm:text-sm sm:leading-relaxed sm:text-slate-400">
            Select your business tier below to initialize your personalized asset pipeline.
          </motion.p>
        </div>

        <form onSubmit={handleRoleSubmit} className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-5">
            
            {/* SHOPKEEPER CARD */}
            <motion.div variants={itemVariants} whileHover={loading ? {} : { scale: 1.01 }} whileTap={loading ? {} : { scale: 0.99 }} onClick={() => !loading && setSelectedRole("shopkeeper")} className={`group relative cursor-pointer overflow-hidden rounded-[20px] border p-4 sm:p-5 transition-all duration-300 ${selectedRole === "shopkeeper" ? "border-pink-500 bg-white shadow-[0_12px_30px_rgba(244,63,94,0.06)] ring-1 ring-pink-500/10" : "border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white"}`}>
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${selectedRole === "shopkeeper" ? "bg-pink-500/[0.015]" : ""}`} />
              <div className="relative flex items-center sm:items-start gap-3 sm:gap-4">
                <div className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-[14px] transition-all duration-300 ${selectedRole === "shopkeeper" ? "bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/10 scale-105" : "bg-slate-100 text-slate-600 group-hover:scale-105"}`}>
                  <Store className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[15px] font-bold tracking-tight text-slate-900 sm:text-base">Shopkeeper</h3>
                    <AnimatePresence>
                      {selectedRole === "shopkeeper" && (
                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-pink-500 bg-pink-500 text-white shadow-sm">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <p className="mt-1 text-[12px] font-medium leading-tight text-slate-500 sm:hidden">
                    Browse wholesale catalogs & track procurement logistics.
                  </p>

                  <div className="hidden sm:block mt-2.5 space-y-2 sm:mt-3 sm:space-y-1.5">
                    <div className="flex items-start sm:items-center gap-2 text-[13px] font-medium text-slate-600 sm:text-xs sm:font-semibold sm:text-slate-500">
                      <CheckCircle2 className="mt-[1.5px] sm:mt-0 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="leading-tight sm:leading-normal">Browse wholesale catalogs</span>
                    </div>
                    <div className="flex items-start sm:items-center gap-2 text-[13px] font-medium text-slate-600 sm:text-xs sm:font-semibold sm:text-slate-500">
                      <CheckCircle2 className="mt-[1.5px] sm:mt-0 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="leading-tight sm:leading-normal">Track procurement logistics</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* WHOLESALER CARD */}
            <motion.div variants={itemVariants} whileHover={loading ? {} : { scale: 1.01 }} whileTap={loading ? {} : { scale: 0.99 }} onClick={() => !loading && setSelectedRole("wholesaler")} className={`group relative cursor-pointer overflow-hidden rounded-[20px] border p-4 sm:p-5 transition-all duration-300 ${selectedRole === "wholesaler" ? "border-pink-500 bg-white shadow-[0_12px_30px_rgba(244,63,94,0.06)] ring-1 ring-pink-500/10" : "border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white"}`}>
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${selectedRole === "wholesaler" ? "bg-pink-500/[0.015]" : ""}`} />
              <div className="relative flex items-center sm:items-start gap-3 sm:gap-4">
                <div className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-[14px] transition-all duration-300 ${selectedRole === "wholesaler" ? "bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/10 scale-105" : "bg-slate-100 text-slate-600 group-hover:scale-105"}`}>
                  <Truck className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[15px] font-bold tracking-tight text-slate-900 sm:text-base">Wholesaler</h3>
                    <AnimatePresence>
                      {selectedRole === "wholesaler" && (
                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-pink-500 bg-pink-500 text-white shadow-sm">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <p className="mt-1 text-[12px] font-medium leading-tight text-slate-500 sm:hidden">
                    Automate product inventory & receive pipelines.
                  </p>

                  <div className="hidden sm:block mt-2.5 space-y-2 sm:mt-3 sm:space-y-1.5">
                    <div className="flex items-start sm:items-center gap-2 text-[13px] font-medium text-slate-600 sm:text-xs sm:font-semibold sm:text-slate-500">
                      <CheckCircle2 className="mt-[1.5px] sm:mt-0 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="leading-tight sm:leading-normal">Automate product inventory</span>
                    </div>
                    <div className="flex items-start sm:items-center gap-2 text-[13px] font-medium text-slate-600 sm:text-xs sm:font-semibold sm:text-slate-500">
                      <CheckCircle2 className="mt-[1.5px] sm:mt-0 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="leading-tight sm:leading-normal">Receive merchant pipelines</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          <motion.div variants={itemVariants} className="space-y-4 pt-1">
            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-[13px] sm:text-sm text-center font-medium m-0">
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            
            <motion.button whileHover={loading ? {} : { scale: 1.01 }} whileTap={loading ? {} : { scale: 0.99 }} type="submit" disabled={loading} className="relative group cursor-pointer flex h-12 sm:h-auto w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 sm:py-3.5 text-[15px] sm:text-sm font-semibold sm:font-bold text-white shadow-lg shadow-pink-500/15 hover:shadow-pink-500/25 transition-all duration-300 disabled:opacity-80 disabled:pointer-events-none">
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Workspace</span>
                    {/* Classic arrow hover shift instead of bouncy infinite loop */}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </div>
            </motion.button>

            <motion.div variants={itemVariants} className="flex items-start sm:items-center justify-center gap-1.5 text-left sm:text-center text-[11px] font-medium leading-relaxed text-slate-400 sm:text-xs sm:leading-normal sm:text-slate-400/90">
              <ShieldAlert className="mt-0.5 sm:mt-0 h-3.5 w-3.5 shrink-0 text-slate-300" />
              <span>Operational layouts remain adjustable dynamic variables inside standard security workspaces later.</span>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}