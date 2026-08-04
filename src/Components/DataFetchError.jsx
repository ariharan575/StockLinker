import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, WifiOff, ServerCrash, ChevronRight } from "lucide-react";

export function DataFetchError({ onRetry, errorTitle = "Unable to connect to the server", errorMessage = "We're having trouble retrieving your workspace data. This usually happens due to a network interruption or an expired secure session." }) {
  return (
    <div className="flex min-h-[75vh] w-full items-center justify-center p-4 sm:p-8 bg-[#FAFAFA]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-[1000px] w-full bg-white p-8 sm:p-12 lg:p-16 rounded-[32px] border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="flex-1 w-full flex justify-center items-center relative py-6 lg:py-0">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
            <div className="absolute inset-0 border-[30px] border-rose-50/50 rounded-full animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
            <div className="absolute inset-6 border-[20px] border-rose-100/50 rounded-full" />
            <div className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-[28px] shadow-[0_10px_40px_rgba(225,29,72,0.2)] border border-rose-100 flex items-center justify-center">
              <ServerCrash className="w-12 h-12 sm:w-16 sm:h-16 text-rose-500" strokeWidth={1.5} />
            </div>
            <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center z-20">
              <WifiOff className="w-5 h-5 text-slate-400" />
            </motion.div>
            <motion.div animate={{ y: [8, -8, 8] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-2 w-14 h-14 bg-slate-900 rounded-xl shadow-lg flex items-center justify-center z-20">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </div>
        </div>

        <div className="flex-[1.2] w-full flex flex-col items-center lg:items-start text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-extrabold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Connection Error
          </div>
          <h2 className="text-[28px] sm:text-[36px] font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-4">
            {errorTitle}
          </h2>
          <p className="text-[15px] sm:text-[16px] text-slate-500 leading-relaxed mb-8 max-w-lg">
            {errorMessage}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={onRetry}
              className="group relative flex items-center justify-center gap-3 w-full sm:w-auto rounded-2xl bg-slate-900 px-8 py-4 text-[15px] font-bold text-white overflow-hidden transition-all hover:bg-slate-800 hover:shadow-[0_8px_25px_rgba(15,23,42,0.3)] active:scale-95"
            >
              <RefreshCcw className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
              <span className="relative z-10">Retry Connection</span>
            </button>
            <button onClick={() => window.location.reload()} className="flex items-center justify-center gap-1 w-full sm:w-auto px-6 py-4 text-[14px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-colors">
              Hard Refresh <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-100 w-full max-w-lg">
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Troubleshooting</p>
            <ul className="space-y-2.5 text-[13px] text-slate-500 font-medium">
              <li className="flex items-start gap-2.5"><span className="text-slate-300 font-bold">•</span> Check your active internet connection or router.</li>
              <li className="flex items-start gap-2.5"><span className="text-slate-300 font-bold">•</span> Ensure you haven't logged out in another browser tab.</li>
              <li className="flex items-start gap-2.5"><span className="text-slate-300 font-bold">•</span> Disable strict ad-blockers that might block our secure APIs.</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}