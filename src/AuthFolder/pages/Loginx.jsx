import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, User, Phone, CheckCircle, XCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../config/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useDeviceId } from "../hooks/useDeviceId";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";

export default function SaaSAuthUI() {
  const [phone, setPhone] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  
  const inputsRef = useRef([]);
  const { login } = useAuth();
  const deviceId = useDeviceId();
  const navigate = useNavigate();

  const isOtpComplete = otp.every((digit) => digit !== "");

  // Setup Recaptcha
  const setupRecaptcha = async () => {
    if (window.recaptchaVerifier) {
      await window.recaptchaVerifier.clear();
      delete window.recaptchaVerifier;
    }
    
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          console.log("Recaptcha solved");
        },
        "expired-callback": () => {
          console.log("Recaptcha expired");
        }
      }
    );
    await window.recaptchaVerifier.render();
  };

  // Format phone number - Remove +91 if user types it
  const formatPhoneNumber = (input) => {
    // Remove all non-digits
    let cleaned = input.replace(/\D/g, '');
    
    // If number starts with 91 and length > 10, remove the 91 prefix
    if (cleaned.startsWith('91') && cleaned.length > 10) {
      cleaned = cleaned.substring(2);
    }
    
    // Limit to 10 digits
    cleaned = cleaned.slice(0, 10);
    
    return cleaned;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  // Send OTP
  const sendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError(true);
      setErrorMessage("Please enter a valid 10-digit phone number");
      return;
    }
    
    setLoading(true);
    setError(false);
    setErrorMessage("");
    
    try {
      await setupRecaptcha();
      // Always add +91 prefix for Firebase
      const formattedPhone = `+91${phone}`;
      
      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );
      
      setConfirmationResult(result);
      setShowOtp(true);
      setSuccess(true);
      
      // Start resend timer
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
      console.error("OTP Error:", error);
      setError(true);
      setErrorMessage(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIND THIS SECTION (around line 158) and REPLACE:

// Verify OTP
const handleVerify = async () => {
  if (!isOtpComplete) return;
  
  setLoading(true);
  setError(false);
  setErrorMessage("");
  
  try {
    const enteredOtp = otp.join("");
    const result = await confirmationResult.confirm(enteredOtp);
    const idToken = await result.user.getIdToken();
    
    // Call backend
    const loginResult = await login(authApi.phoneLogin(idToken, deviceId));

    console.log("Phone login result:", loginResult);  // ✅ DEBUG LOG

    // ✅ FIXED: Navigate to role-selection (not "billa")
    if (loginResult.success) {
      if (loginResult.isNewUser) {
        console.log("New user - redirecting to role selection");  // ✅ DEBUG LOG
        navigate("/role-selection");  // ✅ CHANGED FROM "/billa"
      } else {
        console.log("Existing user - redirecting to dashboard");  // ✅ DEBUG LOG
        navigate("/dashboard");
      }
    } else {
      setError(true);
      setErrorMessage(loginResult.error || "Login failed. Please try again.");
      setOtp(Array(6).fill(""));
      inputsRef.current[0]?.focus();
    }
  } catch (error) {
    console.error("Verification failed:", error);
    setError(true);
    setErrorMessage("Invalid OTP. Please try again.");
    setOtp(Array(6).fill(""));
    inputsRef.current[0]?.focus();
  } finally {
    setLoading(false);
  }
};

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (isOtpComplete && confirmationResult && !loading) {
      handleVerify();
    }
  }, [otp]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(false);
    setErrorMessage("");
    
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
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

  // ✅ FIXED: Google Login Handler
  const handleGoogleLogin = () => {
    // Store current deviceId in localStorage for after redirect
    localStorage.setItem('pendingDeviceId', deviceId);
    // Redirect to backend OAuth endpoint
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  // ✅ FIXED: Guest Login Handler
 // ✅ FIXED Guest Login Handler
const handleGuestLogin = async () => {
  setLoading(true);
  setError(false);
  setErrorMessage("");
  
  try {
    const loginResult = await login(authApi.guestLogin(deviceId));
    console.log("Guest login result:", loginResult);  // ✅ DEBUG LOG
    
    if (loginResult.success) {
      if (loginResult.isNewUser) {
        console.log("New guest - redirecting to role selection");  // ✅ DEBUG LOG
        navigate("/role-selection");
      } else {
        console.log("Existing guest - redirecting to dashboard");  // ✅ DEBUG LOG
        navigate("/dashboard");
      }
    } else {
      setError(true);
      setErrorMessage(loginResult.error || "Guest login failed");
    }
  } catch (error) {
    console.error("Guest login failed:", error);
    setError(true);
    setErrorMessage("Guest login failed. Please try again.");
  } finally {
    setLoading(false);
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
    setConfirmationResult(null);
    // Clear recaptcha
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      delete window.recaptchaVerifier;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* LEFT PANEL */}
        <div className="p-10 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div id="recaptcha-container"></div>
            
            {!showOtp ? (
              <>
                <h1 className="text-3xl font-bold mb-2">Welcome Back 👋</h1>
                <p className="text-gray-500 mb-8">Login to continue your journey</p>

                <div className="mb-5">
                  <label className="text-md text-gray-800 mb-1.5 block">Phone Number</label>
                  <div className={`flex items-center border rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-pink-400 ${error && !showOtp ? 'border-red-500' : ''}`}>
                    <Phone className="text-gray-400 mr-3" size={18} />
                    <span className="text-gray-400 pr-2 bg-gray-50 px-2 py-1 rounded">+91</span>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={handlePhoneChange}
                      className="outline-none transition text-lg flex-1 ml-2" 
                      placeholder="9876543210"
                      disabled={loading}
                      maxLength={10}
                    />
                  </div>
                  {error && !showOtp && errorMessage && (
                    <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">Enter 10-digit mobile number</p>
                </div>

                <button
                  onClick={sendOtp}
                  disabled={loading || !phone || phone.length !== 10}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Continue"} 
                  {!loading && <ArrowRight size={18} />}
                </button>

                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="px-3 text-gray-400 text-sm">OR</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <button 
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 border py-3 rounded-xl hover:bg-gray-50 transition"
                >
                  <FcGoogle size={20} /> Continue with Google
                </button>

                <button 
                  onClick={handleGuestLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 mt-4 bg-gray-900 text-white py-3 rounded-xl hover:bg-black transition disabled:opacity-50"
                >
                  <User size={18} /> Continue as Guest
                </button>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-2">Verify OTP 🔐</h1>
                <p className="text-gray-500 mb-6 text-sm">
                  Enter the 6-digit code sent to <span className="font-semibold">+91 {phone}</span>
                </p>

                {success && (
                  <div className="mb-4 p-2 bg-green-50 text-green-600 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle size={16} /> OTP sent successfully!
                  </div>
                )}

                <motion.div
                  animate={error ? { x: [-10, 10, -8, 8, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-6 gap-3 mb-4"
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      ref={(el) => (inputsRef.current[index] = el)}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      className={`w-full h-14 text-center text-xl font-semibold border rounded-xl outline-none transition ${
                        error ? "border-red-500" : "focus:ring-2 focus:ring-pink-400"
                      }`}
                      disabled={loading}
                      autoFocus={index === 0}
                    />
                  ))}
                </motion.div>

                {error && errorMessage && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mb-4 text-center flex items-center justify-center gap-1"
                  >
                    <XCircle size={14} /> {errorMessage}
                  </motion.p>
                )}

                <button
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || loading}
                  className="text-sm text-center w-full text-pink-500 hover:text-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </button>

                <button
                  onClick={handleBackToPhone}
                  className="w-full py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                >
                  Back to Phone Entry
                </button>
              </>
            )}
          </motion.div>
        </div>

        {/* RIGHT PANEL */}
        <div className="hidden md:flex lg:flex relative bg-gradient-to-br from-pink-500 to-red-500 items-center justify-center overflow-hidden md:flex-col lg:flex-col">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"
          />

          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="business"
            className="w-40 mb-6 z-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          <div className="text-center text-white z-10 px-6">
            <h1 className="text-5xl font-extrabold tracking-tight mb-3">
              StockLinker
            </h1>
            <p className="text-lg opacity-90 mb-2">
              Wholesale Ordering Made Simple
            </p>
            <p className="text-sm opacity-80">For Buyers & Sellers</p>
          </div>
        </div>
      </div>
    </div>
  );
}