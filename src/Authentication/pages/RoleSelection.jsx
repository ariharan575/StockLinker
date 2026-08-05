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

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
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

    console.log(result)
    
      if (result) {
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
      
      <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-8%] right-[-8%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-pink-400/15 to-rose-400/0 blur-[120px] pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.07, 1], opacity: [0.6, 0.8, 0.6] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-[-8%] left-[-8%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-purple-400/10 to-pink-400/0 blur-[120px] pointer-events-none" />

      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/95 p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.06)] backdrop-blur-md">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-70" />

           <motion.div variants={itemVariants} whileHover={{ scale: 1.03, y: -0.5 }} className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-slate-200/60 bg-slate-50 px-3 py-1.5 shadow-sm sm:mx-0 sm:w-[135px] sm:items-start sm:py-1">
            <Sparkles className="h-3.5 w-3.5 text-pink-500 animate-pulse" />
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
            <motion.div variants={itemVariants} whileHover={loading ? {} : { y: -3, scale: 1.005 }} whileTap={loading ? {} : { scale: 0.995 }} onClick={() => !loading && setSelectedRole("shopkeeper")} className={`group relative cursor-pointer overflow-hidden rounded-[20px] border p-4 sm:p-5 transition-all duration-300 ${selectedRole === "shopkeeper" ? "border-pink-500 bg-white shadow-[0_12px_30px_rgba(244,63,94,0.06)] ring-1 ring-pink-500/10" : "border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white"}`}>
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${selectedRole === "shopkeeper" ? "bg-pink-500/[0.015]" : ""}`} />
              <div className="relative flex items-start gap-3 sm:gap-4">
                <motion.div whileHover={loading ? {} : { rotate: [-3, 3, -3], scale: 1.03 }} transition={{ duration: 0.4 }} className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-[14px] transition-all duration-300 ${selectedRole === "shopkeeper" ? "bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/10" : "bg-slate-100 text-slate-600"}`}>
                  <Store className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[15px] font-bold tracking-tight text-slate-900 sm:text-base">Shopkeeper</h3>
                    <AnimatePresence border>
                      {selectedRole === "shopkeeper" && (
                        <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-pink-500 bg-pink-500 text-white shadow-sm">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="mt-2.5 space-y-2 sm:mt-3 sm:space-y-1.5">
                    <motion.div whileHover={{ x: 1 }} className="flex items-start sm:items-center gap-2 text-[13px] font-medium text-slate-600 sm:text-xs sm:font-semibold sm:text-slate-500">
                      <CheckCircle2 className="mt-[1.5px] sm:mt-0 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="leading-tight sm:leading-normal">Browse wholesale catalogs</span>
                    </motion.div>
                    <motion.div whileHover={{ x: 1 }} className="flex items-start sm:items-center gap-2 text-[13px] font-medium text-slate-600 sm:text-xs sm:font-semibold sm:text-slate-500">
                      <CheckCircle2 className="mt-[1.5px] sm:mt-0 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="leading-tight sm:leading-normal">Track procurement logistics</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* WHOLESALER CARD */}
            <motion.div variants={itemVariants} whileHover={loading ? {} : { y: -3, scale: 1.005 }} whileTap={loading ? {} : { scale: 0.995 }} onClick={() => !loading && setSelectedRole("wholesaler")} className={`group relative cursor-pointer overflow-hidden rounded-[20px] border p-4 sm:p-5 transition-all duration-300 ${selectedRole === "wholesaler" ? "border-pink-500 bg-white shadow-[0_12px_30px_rgba(244,63,94,0.06)] ring-1 ring-pink-500/10" : "border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white"}`}>
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${selectedRole === "wholesaler" ? "bg-pink-500/[0.015]" : ""}`} />
              <div className="relative flex items-start gap-3 sm:gap-4">
                <motion.div whileHover={loading ? {} : { rotate: [-3, 3, -3], scale: 1.03 }} transition={{ duration: 0.4 }} className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-[14px] transition-all duration-300 ${selectedRole === "wholesaler" ? "bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/10" : "bg-slate-100 text-slate-600"}`}>
                  <Truck className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[15px] font-bold tracking-tight text-slate-900 sm:text-base">Wholesaler</h3>
                    <AnimatePresence>
                      {selectedRole === "wholesaler" && (
                        <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-pink-500 bg-pink-500 text-white shadow-sm">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="mt-2.5 space-y-2 sm:mt-3 sm:space-y-1.5">
                    <motion.div whileHover={{ x: 1 }} className="flex items-start sm:items-center gap-2 text-[13px] font-medium text-slate-600 sm:text-xs sm:font-semibold sm:text-slate-500">
                      <CheckCircle2 className="mt-[1.5px] sm:mt-0 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="leading-tight sm:leading-normal">Automate product inventory</span>
                    </motion.div>
                    <motion.div whileHover={{ x: 1 }} className="flex items-start sm:items-center gap-2 text-[13px] font-medium text-slate-600 sm:text-xs sm:font-semibold sm:text-slate-500">
                      <CheckCircle2 className="mt-[1.5px] sm:mt-0 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="leading-tight sm:leading-normal">Receive merchant pipelines</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          <motion.div variants={itemVariants} className="space-y-4 pt-1">
            {error && <p className="text-red-500 text-[13px] sm:text-sm text-center font-medium">{error}</p>}
            
            <motion.button whileHover={loading ? {} : { scale: 1.005, y: -1 }} whileTap={loading ? {} : { scale: 0.995 }} type="submit" disabled={loading} className="relative group cursor-pointer flex h-12 sm:h-auto w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 sm:py-3.5 text-[15px] sm:text-sm font-semibold sm:font-bold text-white shadow-lg shadow-pink-500/15 hover:shadow-pink-500/25 transition-all duration-300 disabled:opacity-80 disabled:pointer-events-none">
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Workspace</span>
                    <motion.div animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}>
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </>
                )}
              </div>
            </motion.button>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-start sm:items-center justify-center gap-1.5 text-left sm:text-center text-[11px] font-medium leading-relaxed text-slate-400 sm:text-xs sm:leading-normal sm:text-slate-400/90">
              <ShieldAlert className="mt-0.5 sm:mt-0 h-3.5 w-3.5 shrink-0 text-slate-300" />
              <span>Operational layouts remain adjustable dynamic variables inside standard security workspaces later.</span>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}