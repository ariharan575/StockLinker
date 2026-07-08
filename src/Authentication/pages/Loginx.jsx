"use client";

import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

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

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { useAuth } from "../context/AuthContext";

import { useDeviceId } from "../hooks/useDeviceId";

import { useNavigate } from "react-router-dom";

import { authApi } from "../services/api";

export default function SaaSAuthUI() {
  const [phone, setPhone] = useState("");

  const [showOtp, setShowOtp] =
    useState(false);

  const [otp, setOtp] = useState(
    Array(6).fill("")
  );

  const [error, setError] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [confirmationResult, setConfirmationResult] =
    useState(null);

  const [resendTimer, setResendTimer] =
    useState(0);

  const [errorMessage, setErrorMessage] =
    useState("");

  const inputsRef = useRef([]);

  const { login } = useAuth();

  const deviceId = useDeviceId();

  const navigate = useNavigate();

  const isOtpComplete = otp.every(
    (digit) => digit !== ""
  );

  /* =========================================
      RECAPTCHA
  ========================================= */

  const setupRecaptcha = async () => {
    if (window.recaptchaVerifier) {
      await window.recaptchaVerifier.clear();

      delete window.recaptchaVerifier;
    }

    window.recaptchaVerifier =
      new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",

          callback: () => {
            console.log(
              "Recaptcha solved"
            );
          },

          "expired-callback": () => {
            console.log(
              "Recaptcha expired"
            );
          },
        }
      );

    await window.recaptchaVerifier.render();
  };

  /* =========================================
      PHONE FORMAT
  ========================================= */

  const formatPhoneNumber = (input) => {
    let cleaned = input.replace(
      /\D/g,
      ""
    );

    if (
      cleaned.startsWith("91") &&
      cleaned.length > 10
    ) {
      cleaned = cleaned.substring(2);
    }

    cleaned = cleaned.slice(0, 10);

    return cleaned;
  };

  const handlePhoneChange = (e) => {
    const formatted =
      formatPhoneNumber(
        e.target.value
      );

    setPhone(formatted);

    setError(false);

    setErrorMessage("");
  };

  /* =========================================
      SEND OTP
  ========================================= */

  const sendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError(true);

      setErrorMessage(
        "Please enter valid mobile number"
      );

      return;
    }

    setLoading(true);

    setError(false);

    setErrorMessage("");

    try {
      await setupRecaptcha();

      const formattedPhone = `+91${phone}`;

      const result =
        await signInWithPhoneNumber(
          auth,
          formattedPhone,
          window.recaptchaVerifier
        );

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

      setTimeout(
        () => setSuccess(false),
        3000
      );
    } catch (error) {
      console.error(error);

      setError(true);

      setErrorMessage(
        error.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
      VERIFY OTP
  ========================================= */

  const handleVerify = async () => {
    if (!isOtpComplete) return;

    setLoading(true);

    setError(false);

    setErrorMessage("");

    try {
      const enteredOtp = otp.join("");

      const result =
        await confirmationResult.confirm(
          enteredOtp
        );

      const idToken =
        await result.user.getIdToken();

      const loginResult = await login(
        authApi.phoneLogin(
          idToken,
          deviceId
        )
      );

      console.log(loginResult);

      if (loginResult.success) {
        console.log("success");
        if (loginResult.isNewUser) {
          navigate("/role-selection");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(true);

        setErrorMessage(
          loginResult.error ||
            "Login failed"
        );

        setOtp(Array(6).fill(""));

        inputsRef.current[0]?.focus();
      }
    } catch (error) {
      console.error(error);

      setError(true);

      setErrorMessage("Invalid OTP");

      setOtp(Array(6).fill(""));

      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
      AUTO VERIFY
  ========================================= */

  useEffect(() => {
    if (
      isOtpComplete &&
      confirmationResult &&
      !loading
    ) {
      handleVerify();
    }
  }, [otp]);

  /* =========================================
      AUTO SUBMIT ON ENTER
  ========================================= */

  const handlePhoneKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      phone.length === 10 &&
      !loading
    ) {
      sendOtp();
    }
  };

  /* =========================================
      OTP INPUT
  ========================================= */

  const handleChange = (
    value,
    index
  ) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    setError(false);

    setErrorMessage("");

    if (value && index < 5) {
      inputsRef.current[
        index + 1
      ].focus();
    }
  };

  const handleKeyDown = (
    e,
    index
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputsRef.current[
        index - 1
      ].focus();
    }

    if (
      e.key === "Enter" &&
      isOtpComplete &&
      !loading
    ) {
      handleVerify();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasteData = e.clipboardData
      .getData("text")
      .trim()
      .slice(0, 6);

    if (
      !/^[0-9]+$/.test(pasteData)
    )
      return;

    const newOtp = pasteData.split(
      ""
    );

    const filled = [...otp];

    for (let i = 0; i < 6; i++) {
      filled[i] = newOtp[i] || "";
    }

    setOtp(filled);

    const lastIndex =
      newOtp.length - 1;

    inputsRef.current[
      lastIndex
    ]?.focus();
  };

  /* =========================================
      GOOGLE LOGIN
  ========================================= */

  const handleGoogleLogin = () => {
    localStorage.setItem(
      "pendingDeviceId",
      deviceId
    );

    window.location.href =
      "http://localhost:8080/oauth2/authorization/google";
  };

  /* =========================================
      GUEST LOGIN
  ========================================= */

  const handleGuestLogin =
    async () => {
      setLoading(true);

      try {
        const loginResult =
          await login(
            authApi.guestLogin(deviceId)
          );

           console.log(loginResult);

        if (loginResult.success) {
          if (
            loginResult.isNewUser
          ) {
            navigate(
              "/role-selection"
            );
          } else {
            navigate("/dashboard");
          }
        } else {
          setError(true);

          setErrorMessage(
            loginResult.error ||
              "Guest login failed"
          );
        }
      } catch (error) {
        setError(true);

        setErrorMessage(
          "Guest login failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  /* =========================================
      RESEND OTP
  ========================================= */

  const handleResendOtp =
    async () => {
      if (resendTimer > 0) return;

      await sendOtp();
    };

  /* =========================================
      BACK
  ========================================= */

  const handleBackToPhone = () => {
    setShowOtp(false);

    setOtp(Array(6).fill(""));

    setError(false);

    setErrorMessage("");

    setConfirmationResult(null);

    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();

      delete window.recaptchaVerifier;
    }
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-6 bg-gray-200">
        {/* BG */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_35%)]" />

        {/* GRID */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:45px_45px]" />

        {/* FLOAT */}
        <motion.div
          animate={{
            y: [0, -40, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute top-0 left-0 w-[420px] h-[420px] bg-pink-500/10 rounded-full blur-[120px]"
        />

        {/* MAIN CONTAINER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.9,
          }}
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
            md:w-[75%]
            lg:w-[99%]
            md:mx-auto
            md:grid-cols-1
            lg:grid-cols-12
          "
        >
          {/* LEFT SIDE */}

          <div className="flex flex-col justify-between p-8 sm:p-12 lg:col-span-6 bg-white">
            <div id="recaptcha-container"></div>

            {/* TOP BRAND */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-pink-500 to-rose-500 shadow-md shadow-pink-500/20">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>

              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Secure Login
              </span>
            </div>

            <div className="my-auto py-8">
              {/* TITLE */}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                {!showOtp ? (
                  <>
                    Welcome{" "}
                    <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                      Back
                    </span>
                  </>
                ) : (
                  <>
                    Verify{" "}
                    <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                      OTP
                    </span>
                  </>
                )}
              </h1>

              {/* SUBTITLE */}
              <p className="text-sm text-slate-500 max-w-sm mt-3 leading-relaxed">
                {!showOtp
                  ? "Access your premium wholesale platform securely with real-time inventory synchronizations."
                  : `Enter verification code sent to +91 ${phone}`}
              </p>

              {/* PHONE LOGIN */}
              {!showOtp ? (
                <>
                  <div className="mt-8 space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Phone Number
                    </label>

                    <div
                      className={`relative flex items-center rounded-xl border transition-all duration-300 bg-slate-50 ${
                        error
                          ? "border-red-500"
                          : "border-slate-200 hover:border-slate-300 focus-within:border-pink-500 focus-within:shadow-[0_0_15px_rgba(244,63,94,0.08)] focus-within:ring-1 focus-within:ring-pink-500/30 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-center pl-4 text-slate-400">
                        <Phone className="h-5 w-5" />
                      </div>

                      <span className="pl-3 pr-2 text-sm font-semibold text-slate-400 border-r border-slate-200">
                        +91
                      </span>

                      <input
                        type="tel"
                        value={phone}
                        onChange={
                          handlePhoneChange
                        }
                        onKeyDown={
                          handlePhoneKeyDown
                        }
                        placeholder="9876543210"
                        disabled={loading}
                        maxLength={10}
                        className="w-full tracking-[0.10em] bg-transparent py-4 pl-3 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none"
                      />
                    </div>

                    {/* ERROR */}
                    <AnimatePresence>
                      {errorMessage && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: -10,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                          }}
                          className="mt-3 flex items-center gap-2 text-red-500 text-sm"
                        >
                          <XCircle size={16} />

                          {errorMessage}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* CONTINUE */}
                  <motion.button
                    whileHover={{
                      scale: loading
                        ? 1
                        : 1.01,
                      y: loading
                        ? 0
                        : -1,
                    }}
                    whileTap={{
                      scale: loading
                        ? 1
                        : 0.99,
                    }}
                    onClick={sendOtp}
                    disabled={
                      loading ||
                      phone.length !== 10
                    }
                    className={`
                      relative
                      group
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-3
                      rounded-xl
                      py-4
                      text-sm
                      font-bold
                      text-white
                      overflow-hidden
                      mt-6
                      transition-all
                      duration-500
                      ${
                        loading
                          ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 shadow-[0_0_40px_rgba(192,38,211,0.35)]"
                          : "bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30"
                      }
                    `}
                  >
                    {/* LOADING BG */}
                    {loading && (
                      <>
                        <motion.div
                          animate={{
                            x: [
                              "-100%",
                              "100%",
                            ],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat:
                              Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />

                        <motion.div
                          animate={{
                            scale: [
                              1,
                              1.4,
                              1,
                            ],
                            opacity: [
                              0.4,
                              1,
                              0.4,
                            ],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat:
                              Infinity,
                          }}
                          className="absolute inset-0 bg-fuchsia-400/20 blur-2xl"
                        />
                      </>
                    )}

                    {!loading && (
                      <span className="absolute inset-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:animate-shine" />
                    )}

                    {loading ? (
                      <>
                        <motion.div
                          animate={{
                            rotate: 360,
                          }}
                          transition={{
                            duration: 1,
                            repeat:
                              Infinity,
                            ease: "linear",
                          }}
                          className="relative flex items-center justify-center"
                        >
                          <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white" />
                        </motion.div>

                        <motion.span
                          animate={{
                            opacity: [
                              0.6,
                              1,
                              0.6,
                            ],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat:
                              Infinity,
                          }}
                        >
                          Sending Secure OTP...
                        </motion.span>
                      </>
                    ) : (
                      <>
                        Continue

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>

                  {/* DIVIDER */}
                  <div className="relative my-6 flex items-center justify-center">
                    <div className="w-full border-t border-slate-200"></div>

                    <span className="absolute bg-white px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                      OR
                    </span>
                  </div>

                  {/* GOOGLE */}
                  <motion.button
                    whileHover={{
                      scale: 1.01,
                    }}
                    whileTap={{
                      scale: 0.99,
                    }}
                    onClick={
                      handleGoogleLogin
                    }
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:text-slate-900"
                  >
                    <FcGoogle size={20} />

                    Continue with Google
                  </motion.button>

                  {/* GUEST */}
                  <motion.button
                    whileHover={{
                      scale: 1.01,
                    }}
                    whileTap={{
                      scale: 0.99,
                    }}
                    onClick={
                      handleGuestLogin
                    }
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 bg-neutral-900 text-white hover:bg-black mt-4"
                  >
                    <User className="h-4 w-4" />

                    Continue as Guest
                  </motion.button>
                </>
              ) : (
                <>
                  {/* OTP BOX */}
                  <div className="grid grid-cols-6 gap-3 mt-8">
                    {otp.map(
                      (digit, index) => (
                        <motion.input
                          key={index}
                          whileFocus={{
                            scale: 1.05,
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          ref={(el) =>
                            (inputsRef.current[
                              index
                            ] = el)
                          }
                          onChange={(e) =>
                            handleChange(
                              e.target.value,
                              index
                            )
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(
                              e,
                              index
                            )
                          }
                          onPaste={
                            handlePaste
                          }
                          disabled={loading}
                          autoFocus={
                            index === 0
                          }
                          className={`w-full h-14 rounded-2xl text-center text-xl font-black outline-none transition-all duration-300 border ${
                            error
                              ? "border-red-500"
                              : "border-slate-200 bg-slate-50 text-slate-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                          }`}
                        />
                      )
                    )}
                  </div>

                  {/* VERIFY */}
                  {loading && (
                    <motion.div
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      className="mt-6 flex items-center justify-center gap-3 text-fuchsia-600 font-semibold"
                    >
                      <motion.div
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 1,
                          repeat:
                            Infinity,
                          ease: "linear",
                        }}
                        className="relative"
                      >
                        <div className="w-6 h-6 rounded-full border-2 border-fuchsia-200 border-t-fuchsia-600" />
                      </motion.div>

                      Verifying Secure OTP...
                    </motion.div>
                  )}

                  {/* SUCCESS */}
                  {success && (
                    <div className="mt-5 flex items-center justify-center gap-2 text-green-500">
                      <CheckCircle2 size={18} />

                      OTP Sent Successfully
                    </div>
                  )}

                  {/* ERROR */}
                  {errorMessage && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-red-500 text-sm">
                      <XCircle size={16} />

                      {errorMessage}
                    </div>
                  )}

                  {/* RESEND */}
                  <button
                    onClick={
                      handleResendOtp
                    }
                    disabled={
                      resendTimer > 0
                    }
                    className="mt-6 w-full text-center text-sm font-semibold text-pink-500 hover:text-pink-600 transition"
                  >
                    {resendTimer > 0
                      ? `Resend OTP in ${resendTimer}s`
                      : "Resend OTP"}
                  </button>

                  {/* BACK */}
                  <motion.button
                    whileHover={{
                      scale: 1.01,
                    }}
                    whileTap={{
                      scale: 0.99,
                    }}
                    onClick={
                      handleBackToPhone
                    }
                    className="mt-4 w-full py-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
                  >
                    Back to Phone Entry
                  </motion.button>
                </>
              )}
            </div>

            {/* FOOTER */}
            <p className="text-center text-xs text-slate-400 lg:text-left">
              By signing in, you agree to
              our{" "}
              <a
                href="#"
                className="underline hover:text-slate-600"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="underline hover:text-slate-600"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>

          {/* RIGHT SIDE */}

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 1,
            }}
            className="relative hidden flex-col justify-between p-12 lg:col-span-6 lg:flex bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 overflow-hidden"
          >
            {/* KEEPED YOUR BG + GRID */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_25%)]" />

            <div className="absolute inset-0 opacity-[0.10] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

            {/* CENTER */}
            <div className="relative my-auto flex flex-col items-center justify-center text-center">
              <div className="relative mb-8 flex h-48 w-48 items-center justify-center">
                {/* OUTER */}
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-white/20"
                />

                {/* SECOND */}
                <motion.div
                  animate={{
                    scale: [1, 1.04, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute h-36 w-36 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md rotate-12"
                />

                {/* MAIN CARD */}
                <motion.div
                  whileHover={{
                    y: -5,
                    rotate: 0,
                  }}
                  className="absolute h-32 w-32 rounded-2xl bg-gradient-to-b from-white/25 to-white/5 p-4 shadow-xl backdrop-blur-lg border border-white/30 flex flex-col items-center justify-center -rotate-6"
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

                {/* FLOAT */}
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-2 -left-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-950/40 border border-white/20 text-white shadow-lg backdrop-blur-md"
                >
                  <Layers className="h-5 w-5" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 6, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950/40 border border-white/20 text-white shadow-lg backdrop-blur-md"
                >
                  <Cpu className="h-5 w-5" />
                </motion.div>
              </div>

              {/* TEXT */}
              <h2 className="text-3xl font-black tracking-tight text-white">
                Stock Linker
              </h2>

              <p className="mt-3 text-sm font-medium text-white/80 max-w-xs leading-relaxed">
                Wholesale Ordering Made
                Simple. Designed
                exclusively for modern
                buyers and global
                suppliers.
              </p>
            </div>

            {/* BOTTOM */}
            <div className="relative z-10 rounded-xl bg-white/10 p-4 border border-white/10 backdrop-blur-sm flex justify-between items-center text-left">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-white/60">
                  System Throughput
                </p>

                <p className="text-sm font-bold text-white mt-0.5">
                  99.99% Live Connection
                </p>
              </div>

              <div className="flex gap-1">
                {[...Array(4)].map(
                  (_, i) => (
                    <span
                      key={i}
                      className={`w-1 h-3 rounded-full bg-emerald-300 ${
                        i === 3
                          ? "animate-pulse"
                          : ""
                      }`}
                    />
                  )
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}