"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  User,
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldCheck,
  Phone,
  Layers,
  Cpu,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../config/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";

// Premium SaaS Easing for smooth animations
const easePremium = [0.16, 1, 0.3, 1];

// ✅ Helper to parse ugly Firebase errors into user-friendly messages
const getAuthErrorMessage = (error) => {
  if (error.code === 'auth/invalid-phone-number') return 'Invalid mobile number format.';
  if (error.code === 'auth/too-many-requests') return 'Too many attempts. Please try again later.';
  if (error.code === 'auth/invalid-verification-code') return 'Invalid OTP. Please check and try again.';
  if (error.code === 'auth/code-expired') return 'OTP has expired. Please request a new one.';
  if (error.code === 'auth/network-request-failed') return 'Network error. Please check your connection.';
  return error.message || "Authentication failed. Please try again.";
};

export default function SaaSAuthUI() {
  const [phone, setPhone] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Track general loading state and WHICH specific action is loading/erroring
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(""); // "phone" | "verify" | "guest"
  
  const [errorMessage, setErrorMessage] = useState("");
  const [errorType, setErrorType] = useState(""); // "phone" | "verify" | "guest"

  const [confirmationResult, setConfirmationResult] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);

  const inputsRef = useRef([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isOtpComplete = otp.every((digit) => digit !== "");

  /* =========================================
      RECAPTCHA
  ========================================= */
  const setupRecaptcha = async () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => { console.log("Recaptcha solved"); },
        "expired-callback": () => { console.log("Recaptcha expired"); },
      }
    );
    await window.recaptchaVerifier.render();
  };

  // Cleanup recaptcha on unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  /* =========================================
      PHONE FORMAT
  ========================================= */
  const formatPhoneNumber = (input) => {
    let cleaned = input.replace(/\D/g, "");
    if (cleaned.startsWith("91") && cleaned.length > 10) {
      cleaned = cleaned.substring(2);
    }
    cleaned = cleaned.slice(0, 10);
    return cleaned;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    setError(false);
    setErrorMessage("");
    setErrorType("");
  };

  /* =========================================
      SEND OTP
  ========================================= */
  const sendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError(true);
      setErrorMessage("Please enter valid mobile number");
      setErrorType("phone");
      return;
    }
    setLoadingType("phone");
    setLoading(true);
    setError(false);
    setErrorMessage("");
    setErrorType("");

    try {
      await setupRecaptcha();
      const formattedPhone = `+91${phone}`;
      const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(result);
      setShowOtp(true);
      setSuccess(true);
      setResendTimer(30);
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      setError(true);
      setErrorMessage(getAuthErrorMessage(error));
      setErrorType("phone");
    } finally {
      setLoading(false);
      setLoadingType("");
    }
  };

  /* =========================================
      VERIFY OTP
  ========================================= */
  const handleVerify = async () => {
    if (!isOtpComplete) return;
    setLoadingType("verify");
    setLoading(true);
    setError(false);
    setErrorMessage("");
    setErrorType("");
    
    try {
      const enteredOtp = otp.join("");
      const result = await confirmationResult.confirm(enteredOtp);
      const idToken = await result.user.getIdToken();
      const loginResult = await login(authApi.phoneLogin(idToken));

      if (loginResult.success) {
        if (loginResult.needsRole) navigate("/role-selection");
        else if (loginResult.needsOnboarding) navigate("/onboarding");
        else navigate("/dashboard");
      } else {
        setError(true);
        setErrorMessage(loginResult.error || "Login failed");
        setErrorType("verify");
        setOtp(Array(6).fill(""));
        inputsRef.current[0]?.focus();
      }
    } catch (error) {
      console.error(error);
      setError(true);
      setErrorMessage(getAuthErrorMessage(error));
      setErrorType("verify");
      setOtp(Array(6).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
      setLoadingType("");
    }
  };

  useEffect(() => {
    if (isOtpComplete && confirmationResult && !loading) {
      handleVerify();
    }
  }, [otp]);

  const handlePhoneKeyDown = (e) => {
    if (e.key === "Enter" && phone.length === 10 && !loading) {
      sendOtp();
    }
  };

  /* =========================================
      OTP INPUT
  ========================================= */
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(false);
    setErrorMessage("");
    setErrorType("");
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
    if (e.key === "Enter" && isOtpComplete && !loading) {
      handleVerify();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^[0-9]+$/.test(pasteData)) return;
    const newOtp = pasteData.split("");
    const filled = [...otp];
    for (let i = 0; i < 6; i++) {
      filled[i] = newOtp[i] || "";
    }
    setOtp(filled);
    const lastIndex = newOtp.length - 1;
    inputsRef.current[lastIndex]?.focus();
  };

  /* =========================================
      GOOGLE / GUEST LOGIN
  ========================================= */
const handleGoogleLogin = () => {
    window.location.href = `/oauth2/authorization/google`;
  };

  const handleGuestLogin = async () => {
    setLoadingType("guest");
    setLoading(true);
    setError(false);
    setErrorMessage("");
    setErrorType("");
    try {
      const loginResult = await login(authApi.guestLogin());

      if (loginResult.success) {
        if (loginResult.needsRole) navigate("/role-selection");
        else if (loginResult.needsOnboarding) navigate("/onboarding");
        else navigate("/dashboard");
        
      } else {
        setError(true);
        setErrorMessage(loginResult.error || "Login failed");
        setErrorType("guest");
        setOtp(Array(6).fill(""));
        inputsRef.current[0]?.focus();
      }
    } catch (err) {
      setError(true);
      setErrorMessage(err.response?.data?.message || "Guest login failed");
      setErrorType("guest");
    } finally {
      setLoading(false);
      setLoadingType("");
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    await sendOtp();
  };

  const handleBackToPhone = () => {
    setShowOtp(false);
    setOtp(Array(6).fill(""));
    setError(false);
    setErrorMessage("");
    setErrorType("");
    setConfirmationResult(null);
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-3 sm:p-4 md:px-4 md:py-8 bg-slate-50 font-sans">
        
        {/* BG Grid */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:45px_45px]" />

        {/* FLOAT */}
        <motion.div
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-0 w-[420px] h-[420px] bg-pink-500/10 rounded-full blur-[120px] will-change-transform"
        />

        {/* MAIN CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: easePremium }}
          className="
            relative
            z-10
            grid
            w-full
            max-w-5xl
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white/80
            shadow-[0_25px_50px_-12px_rgba(0,0,0,0.04)]
            backdrop-blur-xl
            md:w-[85%]
            lg:w-[99%]
            md:mx-auto
            md:grid-cols-1
            lg:grid-cols-12
            will-change-transform
            transform-gpu
          "
        >
          {/* =========================================
              LEFT SIDE
          ========================================= */}
          <div className="flex flex-col justify-between p-4 sm:p-12 lg:col-span-6 bg-white z-10">
            <div id="recaptcha-container"></div>

            {/* TOP BRAND */}
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-pink-500 to-rose-500 shadow-md shadow-pink-500/20">
                <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <span className="text-[11px]  sm:text-xs font-bold tracking-widest text-slate-400 uppercase">
                Secure Login
              </span>
            </div>

            <div className="my-auto py-3 sm:py-5">
              {/* TITLE */}
              <h1 className="text-[24px] sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                {!showOtp ? (
                  <>
                    Welcome{" "}
                    <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                      Back.
                    </span>
                  </>
                ) : (
                  <>
                    Verify{" "}
                    <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                      OTP.
                    </span>
                  </>
                )}
              </h1>

              {/* SUBTITLE */}
              <p className="text-[13px] sm:text-[15px] text-slate-500 max-w-sm mt-1.5 sm:mt-3 leading-[1.4] sm:leading-relaxed">
                {!showOtp
                  ? "Secure access to your wholesale platform with real-time inventory."
                  : `Enter verification code sent to +91 ${phone}`}
              </p>

              {/* PHONE LOGIN */}
              {!showOtp ? (
                <>
                  <div className="mt-6 mb-3 sm:mt-5 space-y-1.5 sm:space-y-3">
                    <label className="ps-2 text-[13px] sm:text-[15px] tracking-wider font-semibold text-slate-600 ">
                      Mobile Number :
                    </label>

                    <div
                      className={`relative w-full mt-1 mx-auto flex items-center h-[44px] sm:h-auto rounded-xl border transition-all duration-300 bg-white shadow-sm overflow-hidden sm:mt-2 ${
                        error && errorType === "phone"
                          ? "border-red-500 focus-within:ring-4 focus-within:ring-red-500/20"
                          : "border-slate-200 hover:border-pink-300 focus-within:border-pink-500 focus-within:ring-4 focus-within:ring-pink-500/20"
                      }`}
                    >
                      <div className="flex items-center justify-center pl-4 text-slate-400">
                        <Phone className="h-4 sm:h-5 w-4 sm:w-5" />
                      </div>

                      <span className="pl-3 pr-2 text-[14px] sm:text-[15px] font-semibold text-slate-400 border-r border-slate-100 h-full flex items-center">
                        +91
                      </span>

                      <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        onKeyDown={handlePhoneKeyDown}
                        placeholder="9876543210"
                        disabled={loading}
                        maxLength={10}
                        className="w-full tracking-wide bg-transparent h-full sm:py-4 pl-3 pr-4 text-[14px] sm:text-[15px] font-semibold text-slate-900 placeholder-slate-400 outline-none"
                      />
                    </div>

                    {/* PHONE ERROR */}
                    <AnimatePresence>
                      {errorMessage && errorType === "phone" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-2 sm:mt-3 flex items-center gap-2 text-red-500 text-[13px] sm:text-sm ml-1 font-medium"
                        >
                          <XCircle size={16} />
                          {errorMessage}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* CONTINUE BUTTON */}
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.01, y: loading ? 0 : -1 }}
                    whileTap={{ scale: loading ? 1 : 0.99 }}
                    onClick={sendOtp}
                    disabled={loading || phone.length !== 10}
                    className={`
                      relative group flex w-full items-center justify-center gap-3 rounded-xl h-[42px]  sm:h-auto sm:py-3.5 text-[14px] sm:text-[15px] font-bold text-white overflow-hidden mt-4 sm:mt-5 transition-all duration-300 transform-gpu
                      ${
                        loading || phone.length !== 10
                          ? "bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-slate-500 cursor-not-allowed shadow-none"
                          : "bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 shadow-md shadow-pink-500/20 hover:shadow-lg hover:shadow-pink-500/40"
                      }
                    `}
                  >
                    {loading && loadingType === "phone" && (
                      <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                    )}

                    {!loading && (
                      <span className="absolute inset-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    )}

                    {loading && loadingType === "phone" ? (
                      <>
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        <span>Sending Secure OTP...</span>
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>

                  {/* DIVIDER */}
                  <div className="relative my-4 sm:my-6 flex items-center justify-center">
                    <div className="w-full border-t border-slate-200"></div>
                    <span className="absolute bg-white px-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      OR
                    </span>
                  </div>

                  {/* GOOGLE BUTTON */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white h-[43px] cursor-pointer sm:h-auto mx-auto sm:py-3.5 text-[13px] sm:text-[14px] font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-700 transform-gpu"
                  >
                    <FcGoogle size={18} className="sm:w-5 sm:h-5" />
                    Continue with Google
                  </motion.button>

                  {/* GUEST BUTTON */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleGuestLogin}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl mx-auto h-[43px] sm:h-auto sm:py-3.5 text-[13px] sm:text-[14px] font-semibold transition-all duration-200 bg-black border border-slate-100 text-white cursor-pointer mt-3 sm:mt-4 transform-gpu"
                  >
                    {loading && loadingType === "guest" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Continuing as Guest...
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4" />
                        Continue as Guest
                      </>
                    )}
                  </motion.button>

                  {/* GUEST ERROR */}
                  <AnimatePresence>
                    {errorMessage && errorType === "guest" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 flex items-center justify-center gap-2 text-red-500 text-[13px] sm:text-sm font-medium"
                      >
                        <XCircle size={16} />
                        {errorMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <>
                  {/* OTP BOX */}
                  <div className="grid grid-cols-6 gap-1.5 sm:gap-3 mt-4 sm:mt-8">
                    {otp.map((digit, index) => (
                      <motion.input
                        key={index}
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        ref={(el) => (inputsRef.current[index] = el)}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        disabled={loading}
                        autoFocus={index === 0}
                        className={`w-full h-[44px] sm:h-14 lg:h-16 rounded-xl text-center text-[16px] sm:text-2xl font-bold outline-none transition-all duration-300 border bg-white shadow-sm transform-gpu ${
                          error && errorType === "verify"
                            ? "border-red-500 focus:ring-4 focus:ring-red-500/20"
                            : "border-slate-200 text-slate-900 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20"
                        }`}
                      />
                    ))}
                  </div>

                  {/* VERIFY LOADER */}
                  {loading && loadingType === "verify" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 sm:mt-6 flex items-center justify-center gap-3 text-pink-600 font-semibold text-[13px] sm:text-[14px]"
                    >
                      <Loader2 className="h-4 sm:h-5 w-4 sm:w-5 animate-spin" />
                      Verifying Secure OTP...
                    </motion.div>
                  )}

                  {/* SUCCESS */}
                  {success && !loading && (
                    <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-emerald-500 font-medium text-[13px] sm:text-[14px]">
                      <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      OTP Sent Successfully
                    </div>
                  )}

                  {/* VERIFY ERROR */}
                  {errorMessage && !loading && errorType === "verify" && (
                    <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-red-500 text-[13px] sm:text-[14px] font-medium">
                      <XCircle size={16} />
                      {errorMessage}
                    </div>
                  )}

                  {/* RESEND */}
                  <button
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0}
                    className="mt-4 sm:mt-8 w-full text-center text-[13px] sm:text-[14px] font-semibold text-pink-500 hover:text-pink-600 transition"
                  >
                    {resendTimer > 0
                      ? `Resend OTP in ${resendTimer}s`
                      : "Resend OTP"}
                  </button>

                  {/* BACK */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleBackToPhone}
                    className="mt-3 sm:mt-4 w-full h-[46px] sm:h-auto sm:py-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-[13px] sm:text-[14px] font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all transform-gpu"
                  >
                    Back to Phone Entry
                  </motion.button>
                </>
              )}
            </div>

            {/* FOOTER */}
            <p className="text-center text-[11px] sm:text-[12px] font-medium text-slate-400 lg:text-left mt-3 sm:mt-2">
              By signing in, you agree to our{" "}
              <a href="#" className="underline hover:text-slate-600">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
            </p>
          </div>

          {/* =========================================
              RIGHT SIDE: YOUR ORIGINAL VIBRANT LOOK (100% UNTOUCHED)
          ========================================= */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: easePremium }}
            className="relative hidden flex-col justify-between p-12 lg:col-span-6 lg:flex bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 overflow-hidden will-change-transform translate-z-0"
          >
            {/* KEEPED YOUR BG + GRID */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_25%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.10] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            {/* CENTER GRAPHICS - Exactly as you had them */}
            <div className="relative my-auto flex flex-col items-center justify-center text-center z-10">
              <div className="relative mb-8 flex h-48 w-48 items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-white/20 will-change-transform translate-z-0"
                />
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute h-36 w-36 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md rotate-12 will-change-transform translate-z-0"
                />
                <motion.div
                  whileHover={{ y: -5, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute h-32 w-32 rounded-2xl bg-gradient-to-b from-white/25 to-white/5 p-4 shadow-xl backdrop-blur-lg border border-white/30 flex flex-col items-center justify-center -rotate-6 will-change-transform translate-z-0"
                >
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white p-0.5 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                      alt="User"
                      className="h-full w-full rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
                  </div>
                  <div className="mt-3 w-16 h-2 bg-white/40 rounded-full" />
                  <div className="mt-1.5 w-10 h-1.5 bg-white/20 rounded-full" />
                </motion.div>

                {/* FLOATING ICONS */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-2 -left-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-950/40 border border-white/20 text-white shadow-lg backdrop-blur-md will-change-transform translate-z-0"
                >
                  <Layers className="h-5 w-5" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950/40 border border-white/20 text-white shadow-lg backdrop-blur-md will-change-transform translate-z-0"
                >
                  <Cpu className="h-5 w-5" />
                </motion.div>
              </div>

              {/* TEXT */}
              <h2 className="text-3xl font-black tracking-tight text-white">
                Stock Linker
              </h2>
              <p className="mt-3 text-[14px] font-medium text-white/80 max-w-xs leading-relaxed">
                Wholesale Ordering Made Simple. Designed exclusively for modern buyers and global suppliers.
              </p>
            </div>

            {/* BOTTOM STATUS */}
            <div className="relative z-10 rounded-xl bg-white/10 p-4 border border-white/10 backdrop-blur-sm flex justify-between items-center text-left">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/60">
                  System Throughput
                </p>
                <p className="text-[14px] font-bold text-white mt-0.5">
                  99.99% Live Connection
                </p>
              </div>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-1 h-3 rounded-full bg-emerald-300 ${i === 3 ? "animate-pulse" : ""}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}