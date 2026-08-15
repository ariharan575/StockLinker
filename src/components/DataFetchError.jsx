import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, WifiOff, ServerCrash, ChevronRight } from "lucide-react";

export function DataFetchError({ 
  onRetry, 
  errorTitle = "Unable to connect to the server", 
  errorMessage = "We're having trouble retrieving your workspace data. This usually happens due to a network interruption or an expired secure session." 
}) {
  return (
    <div className="flex min-h-[75vh] w-full items-center justify-center p-4 sm:p-8 bg-[#FAFAFA]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 max-w-[1000px] w-full bg-white p-6 sm:p-12 lg:p-16 rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-rose-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        {/* Illustration Section */}
        <div className="flex-1 w-full flex justify-center items-center relative py-4 sm:py-6 lg:py-0">
          <div className="relative w-40 h-40 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Animated Rings */}
            <div className="absolute inset-0 border-[15px] sm:border-[30px] border-rose-50/50 rounded-full animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
            <div className="absolute inset-4 sm:inset-6 border-[10px] sm:border-[20px] border-rose-100/50 rounded-full" />
            
            {/* Center Box */}
            <div className="relative z-10 w-20 h-20 sm:w-32 sm:h-32 bg-white rounded-[20px] sm:rounded-[28px] shadow-[0_10px_40px_rgba(225,29,72,0.2)] border border-rose-100 flex items-center justify-center">
              <ServerCrash className="w-10 h-10 sm:w-16 sm:h-16 text-rose-500" strokeWidth={1.5} />
            </div>
            
            {/* Floating Icon 1 */}
            <motion.div 
              animate={{ y: [-6, 6, -6] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute -top-1 -right-1 sm:-top-4 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center z-20"
            >
              <WifiOff className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            </motion.div>
            
            {/* Floating Icon 2 */}
            <motion.div 
              animate={{ y: [6, -6, 6] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute -bottom-2 -left-1 sm:-bottom-6 sm:-left-2 w-11 h-11 sm:w-14 sm:h-14 bg-slate-900 rounded-xl shadow-lg flex items-center justify-center z-20"
            >
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-[1.2] w-full flex flex-col items-center lg:items-start text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500 animate-pulse" />
            Connection Error
          </div>
          
          <h2 className="text-[24px] sm:text-[36px] font-extrabold text-slate-900 tracking-tight leading-[1.2] sm:leading-[1.1] mb-3 sm:mb-4">
            {errorTitle}
          </h2>
          
          <p className="text-[14px] sm:text-[16px] text-slate-500 leading-relaxed mb-6 sm:mb-8 max-w-lg">
            {errorMessage}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button 
              onClick={onRetry}
              className="group relative flex items-center justify-center gap-2.5 w-full sm:w-auto rounded-xl sm:rounded-2xl bg-slate-900 px-6 sm:px-8 py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-bold text-white overflow-hidden transition-all hover:bg-slate-800 hover:shadow-[0_8px_25px_rgba(15,23,42,0.3)] active:scale-95"
            >
              <RefreshCcw className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-180 duration-500" />
              <span className="relative z-10">Retry Connection</span>
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center justify-center gap-1 w-full sm:w-auto px-6 py-3.5 sm:py-4 text-[13px] sm:text-[14px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl sm:rounded-2xl transition-colors"
            >
              Hard Refresh <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Quick Troubleshooting */}
          <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-slate-100 w-full max-w-lg text-left">
            <p className="text-[11px] sm:text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Troubleshooting</p>
            <ul className="space-y-2 text-[12px] sm:text-[13px] text-slate-500 font-medium">
              <li className="flex items-start gap-2"><span className="text-slate-300 font-bold">•</span> Check your active internet connection or router.</li>
              <li className="flex items-start gap-2"><span className="text-slate-300 font-bold">•</span> Ensure you haven't logged out in another browser tab.</li>
              <li className="flex items-start gap-2"><span className="text-slate-300 font-bold">•</span> Disable strict ad-blockers that might block our secure APIs.</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}