import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Store, ArrowRight, Check, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RoleSelectionPage() {
  const [role, setRole] = useState("SHOPKEEPER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { selectRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") setRole("WHOLESALER");
      if (e.key === "ArrowLeft") setRole("SHOPKEEPER");
      if (e.key === "Enter" && role && !loading) {
        handleContinue();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [role, loading]);

  const handleContinue = async () => {
    if (!role) return;
    
    setLoading(true);
    setError("");
    
    const result = await selectRole(role);
    
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Failed to select role. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10">
        
        {/* HEADER */}
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900"
          >
            Choose Your Role
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 mt-2"
          >
            This helps us customize your experience
          </motion.p>
        </div>

        {/* ROLE CARDS */}
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          
          {/* SHOPKEEPER */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !loading && setRole("SHOPKEEPER")}
            className={`relative flex-1 rounded-xl cursor-pointer transition-all duration-300 ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
              role === "SHOPKEEPER"
                ? "bg-gradient-to-r from-pink-500 to-red-500 p-[2px]"
                : "bg-gradient-to-r from-gray-200 to-gray-300 p-[2px] opacity-0 hover:opacity-100"
            }`} />
            
            <div
              className={`relative p-6 rounded-xl bg-white transition-all duration-300 ${
                role === "SHOPKEEPER"
                  ? "shadow-xl border-0"
                  : "border border-gray-200 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg transition-all duration-300 ${
                  role === "SHOPKEEPER" ? "bg-pink-100 text-pink-500" : "bg-gray-100 text-gray-500"
                }`}>
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">SHOPKEEPER</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Browse and order from suppliers
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-green-500" />
                  <span>Browse wholesale products</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-green-500" />
                  <span>Place bulk orders</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-green-500" />
                  <span>Track shipments</span>
                </div>
              </div>

              {role === "SHOPKEEPER" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full p-1.5 shadow-lg"
                >
                  <Check size={16} />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* WHOLESALER */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !loading && setRole("WHOLESALER")}
            className={`relative flex-1 rounded-xl cursor-pointer transition-all duration-300 ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
              role === "WHOLESALER"
                ? "bg-gradient-to-r from-pink-500 to-red-500 p-[2px]"
                : "bg-gradient-to-r from-gray-200 to-gray-300 p-[2px] opacity-0 hover:opacity-100"
            }`} />
            
            <div
              className={`relative p-6 rounded-xl bg-white transition-all duration-300 ${
                role === "WHOLESALER"
                  ? "shadow-xl border-0"
                  : "border border-gray-200 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg transition-all duration-300 ${
                  role === "WHOLESALER" ? "bg-pink-100 text-pink-500" : "bg-gray-100 text-gray-500"
                }`}>
                  <Store size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">WHOLESALER</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Sell and manage your products
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-green-500" />
                  <span>List your products</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-green-500" />
                  <span>Manage inventory</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-green-500" />
                  <span>Process orders</span>
                </div>
              </div>

              {role === "WHOLESALER" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full p-1.5 shadow-lg"
                >
                  <Check size={16} />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* BUTTON */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          disabled={!role || loading}
          onClick={handleContinue}
          className={`mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-300 ${
            role && !loading
              ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Continue <ArrowRight size={16} />
            </>
          )}
        </motion.button>

        {/* Skip Option */}
        <p className="text-center text-sm text-gray-400 mt-4">
          You can change this later in settings
        </p>
      </div>
    </div>
  );
}