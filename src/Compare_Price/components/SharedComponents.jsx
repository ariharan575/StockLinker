import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { C } from '../config/constants';

export const FloatingSurface = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    className={`bg-white shadow-sm w-full relative ${className}`}
    style={{ border: `1px solid ${C.border}`, borderRadius: '24px' }}
  >
    {children}
  </motion.div>
);

export const GradientButton = ({ children, onClick, className = "", icon: Icon, disabled }) => (
  <motion.button
    onClick={onClick} disabled={disabled}
    whileHover={!disabled ? { scale: 1.02 } : {}} whileTap={!disabled ? { scale: 0.98 } : {}}
    className={`relative inline-flex items-center justify-center font-inter font-semibold text-white transition-all overflow-hidden group ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    style={{ background: disabled ? '#94A3B8' : C.gradientCTA, borderRadius: '8px', boxShadow: disabled ? 'none' : '0 8px 24px -6px rgba(244,63,94,0.4)' }}
  >
    {!disabled && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />}
    <span className="relative z-10 flex items-center justify-center">
      {Icon && <Icon size={18} className="mr-2" />}
      {children}
    </span>
  </motion.button>
);

export function ScoreRing({ score, size = 48 }) {
  const r = size * 0.38;
  const c = 2 * Math.PI * r;
  const offset = c - ((score || 80) / 100) * c;
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="50%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
          <linearGradient id="scoreGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth={size * 0.08} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" 
          stroke={(score || 80) >= 90 ? "url(#scoreGradGreen)" : "url(#scoreGrad)"} 
          strokeWidth={size * 0.08}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-sora font-semibold text-[13px] text-[#0F172A]">{score || 80}</span>
    </div>
  );
}

export const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${type === 'success' ? 'bg-[#067647] border-[#05603A]' : 'bg-rose-600 border-rose-700'}`}
    >
      {type === 'success' ? <CheckCircle2 className="text-white" size={20} /> : <AlertTriangle className="text-white" size={20} />}
      <span className="text-white font-sora font-semibold text-[14px]">{message}</span>
      <button onClick={onClose} className="ml-4 text-white/80 hover:text-white"><X size={16}/></button>
    </motion.div>
  );
};

export const ErrorPopup = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}/>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10">
        <div className="bg-rose-50 border-b border-rose-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-rose-600">
            <AlertTriangle size={20} />
            <h3 className="font-sora font-bold text-[16px]">Quantity Alert</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20}/></button>
        </div>
        <div className="p-6">
          <p className="text-[14px] font-inter text-slate-700 leading-relaxed mb-6">{message}</p>
          <div className="flex justify-end">
            <button onClick={onClose} className="px-6 py-2.5 bg-[#0F172A] text-white rounded-xl text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-md">OK, Got it</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};