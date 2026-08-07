"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Check, Loader2, AlertCircle } from "lucide-react";
import { STEPS, fadeUp } from "./constants";
import { BusinessStep, AddressStep, MarketplaceStep, SuccessScreen } from "./Steps";
import { onboardingApi } from "../Authentication/services/api";
import { useAuth } from "../Authentication/context/AuthContext";

export default function StockLinkerEnterpriseOnboarding() {
  const { role, verifySession, setProfileData } = useAuth();
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  
  // VALIDATION STATE
  const [errorMsg, setErrorMsg] = useState(null);
  const [errorFields, setErrorFields] = useState([]);
  
  const [dbCategories, setDbCategories] = useState([]);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await onboardingApi.getCategories();
        setDbCategories(response.data.data || []);
      } catch (err) { console.error("Failed to fetch categories", err); }
    };
    fetchCategories();
    const timer = setTimeout(() => { setLoading(false); }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const [formData, setFormData] = useState({
    ownerName: "", businessName: "", mobile: "", deliveryRadius: "", yearsInBusiness: "", businessEmail: "", gstNumber: "",
    address1: "", address2: "", area: "", cityOrTown: "", district: "", pincode: "",
    categoryIds: [], deliverySupport: "", storeSize: "",
  });

  const progress = useMemo(() => { return ((step + 1) / STEPS.length) * 100; }, [step]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if(errorMsg) { setErrorMsg(null); setErrorFields([]); } 
  };

  const validateStep = () => {
    let missing = [];
    if (step === 0) {
      if (!formData.ownerName) missing.push("ownerName");
      if (!formData.businessName) missing.push("businessName");
      if (!formData.mobile) missing.push("mobile");
      
      if (role === "WHOLESALER" && !formData.deliveryRadius) missing.push("deliveryRadius");
      
      if (!formData.businessEmail) missing.push("businessEmail");
      if (missing.length > 0) { setErrorMsg("Please fill in all required business details."); setErrorFields(missing); return false; }
    }
    if (step === 1) {
      if (!formData.address1) missing.push("address1");
      if (!formData.area) missing.push("area");
      if (!formData.cityOrTown) missing.push("cityOrTown");
      if (!formData.district) missing.push("district");
      if (!formData.pincode) missing.push("pincode");
      if (missing.length > 0) { setErrorMsg("Please fill in all required address details."); setErrorFields(missing); return false; }
    }
    if (step === 2) {
      if (formData.categoryIds.length === 0) missing.push("categoryIds");
      if (role === "WHOLESALER" && !formData.deliverySupport) missing.push("selection");
      if (role === "SHOPKEEPER" && !formData.storeSize) missing.push("selection");
      if (missing.length > 0) { setErrorMsg("Please select your categories and marketplace preferences."); setErrorFields(missing); return false; }
    }
    return true;
  };

  const handleNextStep = async () => {
    if (!validateStep()) return;
    
    setApiLoading(true);
    setErrorMsg(null);
    try {
      if (step === 0) {
        await onboardingApi.saveBusiness({
          ownerName: formData.ownerName, 
          businessName: formData.businessName,
          mobile: formData.mobile, 
          deliveryRadius: formData.deliveryRadius ? parseInt(formData.deliveryRadius) : null,
          yearsInBusiness: formData.yearsInBusiness || null,
          businessEmail: formData.businessEmail, 
          gstNumber: formData.gstNumber,
        });
        setStep(1);
      } else if (step === 1) {
        await onboardingApi.saveAddress({
          addressLine1: formData.address1, addressLine2: formData.address2,
          area: formData.area, cityOrTown: formData.cityOrTown,
          district: formData.district, pincode: formData.pincode,
        });
        setStep(2);
      } else if (step === 2) {
        await onboardingApi.saveMarketplace({
          categoryIds: formData.categoryIds,
          deliveryAvailable: formData.deliverySupport === "Yes, We Deliver",
          storeSize: formData.storeSize ? formData.storeSize.toUpperCase().replace(/\s+/g, "_") : null,
        });
        
        setProfileData(prev => ({
          ...prev,
          ownerName: formData.ownerName,
          role: role || 'Partner'
        }));

        await verifySession();
        setStep(3);
        setCompleted(true);
      }
    } catch (err) {
      // ✅ Custom Spring Boot error extraction injected directly to the UI
      setErrorMsg(err.response?.data?.message || err.response?.data?.error || "Failed to save data. Please check your inputs.");
    } finally {
      setApiLoading(false);
    }
  };

  const prevStep = () => { if (step > 0) { setStep((prev) => prev - 1); setErrorMsg(null); setErrorFields([]); } };

  const toggleCategory = (categoryId) => {
    const exists = formData.categoryIds.includes(categoryId);
    updateField("categoryIds", exists ? formData.categoryIds.filter((id) => id !== categoryId) : [...formData.categoryIds, categoryId]);
  };

  if (loading) {
    return (
      <div className="min-h-screen overflow-hidden bg-[#020617] flex items-center justify-center relative">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.45, 0.2] }} transition={{ duration: 6, repeat: Infinity }} className="absolute w-[340px] h-[340px] rounded-full bg-pink-500/20 blur-3xl" />
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 3 }} className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-[6px] border-white/10" />
          <div className="absolute inset-0 rounded-full border-t-[6px] border-pink-400 border-r-[6px] border-sky-400 border-b-transparent border-l-transparent" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute mt-44 text-4xl font-black tracking-tight text-white">StockLinker</motion.h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden transition-all duration-500 bg-gray-200 text-slate-900">
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left bg-gradient-to-r from-pink-400 via-rose-300 to-sky-400" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_35%)]" />
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:45px_45px]" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 50, 0], y: [0, -40, 0] }} transition={{ duration: 14, repeat: Infinity }} className="absolute -top-20 -left-20 w-[320px] h-[320px] rounded-full bg-pink-100/50 blur-3xl" />
        <motion.div animate={{ x: [0, -40, 0], y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity }} className="absolute bottom-0 right-0 w-[320px] h-[320px] rounded-full bg-sky-100/50 blur-3xl" />
      </div>

      <main className="relative z-10 px-3 py-4 sm:px-5 lg:pl-[110px] xl:pl-8 lg:pr-8 xl:px-8 2xl:px-12 min-h-screen flex items-center">
        <div className="max-w-[1520px] mx-auto w-full">
          <div className="grid lg:grid-cols-1 xl:grid-cols-[300px_1fr] gap-6 xl:gap-8 items-stretch">
            
            <motion.aside initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="hidden lg:block xl:hidden fixed left-0 top-4 z-[80] h-screen pointer-events-none">
              <motion.div initial={false} whileHover={{ width: 280 }} transition={{ type: "spring", stiffness: 150, damping: 14 }} className="group relative pointer-events-auto h-screen w-[96px] overflow-hidden rounded-r-[36px] border-r border-t border-b flex flex-col bg-gradient-to-b from-slate-800 via-slate-900 to-slate-900 border-slate-700 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
                <motion.div animate={{ opacity: [0.2, 0.55, 0.2], scale: [1, 1.15, 1] }} transition={{ duration: 7, repeat: Infinity }} className="absolute -top-20 -right-20 w-[220px] h-[220px] rounded-full bg-pink-500/20 blur-3xl" />
                
                <div className="relative z-10 px-5 pt-6 pb-7">
                  <div className="flex items-center gap-4 min-w-max">
                    <motion.div whileHover={{ rotate: [-4, 4, -4], scale: 1.08 }} transition={{ duration: 0.45 }} className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-sky-500 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.35)]">
                      <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="opacity-0 -translate-x-5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 whitespace-nowrap">
                      <h2 className="text-white text-[18px] font-black tracking-tight">StockLinker</h2>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300 font-semibold">Enterprise</p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex-1 px-4 flex flex-col justify-center">
                  {STEPS.map((item, index) => {
                    const active = step === index;
                    const isCompleted = index < step;
                    return (
                      <React.Fragment key={item}>
                        <motion.div whileHover={{ x: 4 }} className={`relative flex items-center gap-4 px-3 py-3 rounded-2xl transition-all duration-300 ${active ? "bg-white/10" : "hover:bg-white/[0.05]"}`}>
                          <motion.div animate={active ? { y: [0, -2, 0], rotate: [0, -2, 2, 0] } : {}} transition={{ duration: 2.2, repeat: Infinity }} className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm border ${isCompleted ? "bg-pink-500 border-pink-400 text-white" : active ? "bg-sky-400 border-sky-300 text-white shadow-[0_0_20px_rgba(56,189,248,0.45)]" : "bg-white/[0.05] border-white/10 text-slate-300"}`}>
                            {isCompleted ? <Check size={15} /> : index + 1}
                          </motion.div>
                          <div className="whitespace-nowrap opacity-0 -translate-x-5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                            <h3 className={`text-[15px] font-bold ${active ? "text-white" : "text-slate-200"}`}>{item}</h3>
                            <p className={`mt-0.5 text-xs ${active ? "text-pink-300" : "text-slate-400"}`}>Step {index + 1}</p>
                          </div>
                        </motion.div>
                        {index !== STEPS.length - 1 && (
                          <div className="ml-[26px] h-7 w-[2px] rounded-full overflow-hidden bg-white/10">
                            <motion.div initial={{ height: 0 }} animate={{ height: isCompleted || active ? "100%" : "0%" }} transition={{ duration: 0.5 }} className="w-full rounded-full bg-gradient-to-b from-pink-400 to-sky-400" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="relative z-10 px-5 pb-7">
                  <div className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">Progress</span>
                      <span className="text-sm font-black text-pink-300">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  <div className="h-[6px] rounded-full overflow-hidden bg-white/10">
                    <motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-sky-400" />
                  </div>
                </div>
              </motion.div>
            </motion.aside>

            <motion.aside initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="hidden xl:flex flex-col h-full rounded-2xl overflow-hidden border bg-white/80 border-slate-200 backdrop-blur-xl">
              <div className="relative p-7 overflow-hidden flex-1 flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-b from-[#132238] via-[#17304d] to-[#1b1b3a] border-[#20324a]" />
                <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 7, repeat: Infinity }} className="absolute top-[-100px] right-[-100px] w-[260px] h-[260px] rounded-full bg-pink-500/20 blur-3xl" />
                <div className="relative z-10 flex-1 flex flex-col">
                  <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/20 w-fit">
                    <Sparkles className="w-4 h-5 text-pink-400" /><span className="text-[11px] font-bold tracking-[0.22em] uppercase text-pink-400">StockLinker</span>
                  </motion.div>
                  <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-7 text-[40px] leading-[0.95] tracking-[-2px] font-black text-white">
                    Build your <span className="bg-gradient-to-r from-white via-pink-200 to-sky-300 bg-clip-text text-transparent">marketplace</span>
                  </motion.h1>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-5 text-slate-300 leading-relaxed text-[15px]">
                    Launch your enterprise dashboard, manage suppliers, inventory and marketplace growth.
                  </motion.p>
                </div>
                <div className="mt-8 space-y-4 relative z-10">
                  {STEPS.map((item, index) => {
                    const active = step === index; const isCompleted = index < step;
                    return (
                      <motion.div key={item} variants={fadeUp} initial="hidden" animate="visible" custom={index} whileHover={{ x: 4 }} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <motion.div whileHover={{ scale: 1.08 }} animate={active ? { y: [0, -2, 0] } : {}} transition={{ duration: 2, repeat: Infinity }} className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold border transition-all duration-300 ${isCompleted ? "bg-pink-400 border-pink-400 text-white" : active ? "bg-sky-400 border-sky-400 text-white" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                            {isCompleted ? <Check size={16} /> : index + 1}
                          </motion.div>
                          {index !== STEPS.length - 1 && <div className={`w-[2px] h-6 mt-2 rounded-full ${isCompleted ? "bg-gradient-to-b from-pink-400 to-sky-400" : "bg-slate-200"}`} />}
                        </div>
                        <div className="pt-1">
                          <h3 className="font-bold text-base text-white">{item}</h3>
                          <p className="hidden 2xl:block text-sm mt-1 text-slate-400">Enterprise onboarding</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.aside>

            <motion.section layout initial={{ opacity: 0, y: 50, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7 }} className="rounded-2xl border overflow-hidden backdrop-blur-xl w-full max-w-[1180px] h-full bg-white/80 border-slate-200 flex flex-col">
              {/* MOBILE / TABLET HEADER */}
              <div className="xl:hidden px-5 sm:px-7 pt-7 pb-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/10 shadow-md">
                  <Sparkles className="w-4 h-5 text-pink-500" />
                  <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-pink-500">StockLinker</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.7 }}>
                  <h1 className="mt-6 text-[34px] sm:text-[48px] leading-[0.92] tracking-[-2px] font-black text-slate-900">
                    Build your <span className="relative block"><span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent">digital marketplace</span></span>
                  </h1>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-5 text-sm sm:text-base leading-relaxed max-w-xl font-medium text-slate-600">
                    Launch your business profile, manage inventory, connect suppliers, and grow faster with StockLinker enterprise tools.
                  </motion.p>
                </motion.div>
                <div className="lg:hidden mt-8">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-[28px] border overflow-hidden border-slate-200 bg-white/80 backdrop-blur-xl">
                    <div className="px-4 sm:px-6 pt-5 pb-5">
                      <div className="flex items-center justify-between relative">
                        {STEPS.map((item, index) => {
                          const active = step === index; const isCompleted = index < step;
                          return (
                            <div key={item} className="relative flex flex-col items-center flex-1">
                              {index !== STEPS.length - 1 && <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5 }} className={`absolute top-5 left-[55%] w-full h-[2px] origin-left ${isCompleted ? "bg-gradient-to-r from-pink-400 to-sky-400" : "bg-slate-200"}`} />}
                              <motion.div whileTap={{ scale: 0.94 }} whileHover={{ y: -2 }} animate={{ scale: active ? [1, 1.08, 1] : 1 }} transition={{ duration: 2, repeat: Infinity }} className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold border transition-all duration-300 ${isCompleted ? "bg-pink-400 border-pink-400 text-white" : active ? "bg-sky-400 border-sky-400 text-white shadow-[0_0_20px_rgba(56,189,248,0.5)]" : "bg-white border-slate-300 text-slate-600"}`}>
                                {isCompleted ? <Check size={14} /> : index + 1}
                              </motion.div>
                              <span className={`mt-2 text-[11px] sm:text-xs font-semibold ${active ? "text-pink-500" : "text-slate-500"}`}>{item}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-5 h-2 rounded-full overflow-hidden bg-slate-200"><motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-sky-400" /></div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* BODY */}
              <div className="p-5 sm:p-7 lg:p-8 xl:p-9 flex-1 flex flex-col">
                
                {errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-200 flex items-center gap-2">
                    <span className="shrink-0"><AlertCircle size={18}/></span>{errorMsg}
                  </motion.div>
                )}

                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    {!completed ? (
                      <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}>
                        {step === 0 && <BusinessStep  role={role} formData={formData} updateField={updateField} errors={errorFields} />}
                        {step === 1 && <AddressStep formData={formData} updateField={updateField} errors={errorFields} />}
                        {step === 2 && <MarketplaceStep role={role} categories={dbCategories} formData={formData} updateField={updateField} toggleCategory={toggleCategory} errors={errorFields} />}
                        {step === 3 && <SuccessScreen />}
                      </motion.div>
                    ) : <SuccessScreen />}
                  </AnimatePresence>
                </div>

                {/* FOOTER */}
                {!completed && step !== 3 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 pt-6 border-t flex flex-col-reverse sm:flex-row gap-4 justify-between border-slate-200">
                    <motion.button whileHover={step === 0 || apiLoading ? {} : { scale: 1.03, borderColor: "rgba(244,114,182,0.6)" }} whileTap={step === 0 || apiLoading ? {} : { scale: 0.97 }} onClick={prevStep} disabled={step === 0 || apiLoading} className={`h-12 px-6 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 border ${step === 0 || apiLoading ? "opacity-40 cursor-not-allowed" : "bg-slate-100 border-slate-200 hover:border-pink-400"}`}>
                      <ArrowLeft size={17} /> Back
                    </motion.button>
                    
                    <motion.button whileHover={apiLoading ? {} : { scale: 1.03, boxShadow: "0 0 30px rgba(236,72,153,0.35)" }} whileTap={apiLoading ? {} : { scale: 0.97 }} onClick={handleNextStep} disabled={apiLoading} className="relative overflow-hidden h-12 px-9 rounded-lg bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-80">
                      {apiLoading ? <><Loader2 className="w-5 h-5 animate-spin relative z-10" /><span className="relative z-10">Saving...</span></> : <><span className="relative z-10">Save & Continue</span><ArrowRight size={16} className="relative z-10" /></>}
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}