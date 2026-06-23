import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { C, EASE } from '../common/constants';
import HeroImges from '../../assets/Store.png';


export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative w-full overflow-hidden rounded-[24px] lg:rounded-[32px] mb-8 bg-white border border-[#F1F1F4]"
      style={{ height: "320px", boxShadow: "0 30px 70px rgba(15,23,42,0.06)" }}
    >
      {/* Premium Aura Gradients */}
      <div 
        className="absolute -top-40 -right-20 w-[450px] h-[450px] rounded-full blur-[100px] opacity-[0.12] pointer-events-none z-0" 
        style={{ background: "#FF4D8D" }} 
      />
      <div 
        className="absolute -bottom-32 -left-20 w-[350px] h-[350px] rounded-full blur-[100px] opacity-[0.10] pointer-events-none z-0" 
        style={{ background: "#e1d6d3" }} 
      />

      {/* MAIN WRAPPER */}
      <div className="relative z-10 flex h-full w-full">
        
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-[55%] h-full px-6 sm:px-10 lg:px-10 flex flex-col justify-center relative z-20">
          
          {/* Typographic Hierarchy */}
          <div className="flex flex-col gap-1">
            <h2 className="text-[12px] sm:text-[13px] font-bold tracking-[0.25em] uppercase text-[#8CA3BA]">
              Welcome Back,
            </h2>
            <h1 className="text-[42px] sm:text-[48px] lg:text-[54px] ps-0.5 font-black leading-[1.05] tracking-[-0.025em] select-none" style={{fontFamily:'"Clash Display","Satoshi","Plus Jakarta Sans","Inter",sans-serif'}}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF3D81] via-[#FF5C7A] to-[#FF9A5C] drop-shadow-[0_6px_18px_rgba(255,77,141,0.18)]">
                Boomathi
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="mt-3 lg:mt-4 text-[14px] sm:text-[15px] text-[#6B7280] font-medium leading-relaxed max-w-[480px]">
            Discover verified wholesalers, compare prices instantly, and manage every purchase from one intelligent sourcing platform.
          </p>

          {/* Search Bar Action */}
          <motion.div 
            whileHover={{ y: -2 }} 
            className="mt-6 flex items-center w-full max-w-[500px] h-[52px] sm:h-[56px] rounded-full bg-white border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:shadow-[0_8px_30px_rgba(255,77,141,0.12)] focus-within:border-[#FF4D8D]/30 transition-all duration-300 overflow-hidden"
          >
            <Search className="ml-5 w-5 h-5 text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search products, suppliers, categories..." 
              className="flex-1 h-full px-3 bg-transparent text-[14px] font-medium text-gray-800 placeholder:text-gray-400 outline-none border-none focus:ring-0"
              style={{ fontFamily: '"Inter", -apple-system, sans-serif' }}
            />
            <button 
              className="mr-1.5 w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] rounded-full flex items-center justify-center text-white transition-transform duration-300 hover:scale-105 active:scale-95 shrink-0 shadow-md" 
              style={{ background: "linear-gradient(135deg, #FF4D8D, #FF7A59)" }}
            >
              <Search className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="hidden lg:flex relative w-[45%] h-full items-center justify-center p-3.5 z-10">
          <motion.img 
            initial={{ scale: 1.05, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 1, ease: EASE }} 
            src={HeroImges} 
            alt="StockLinker Platform" 
            className="w-full h-full object-cover object-center rounded-[24px] shadow-sm" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent pointer-events-none" />
        </div>
        
      </div>
    </motion.section>
  );
}