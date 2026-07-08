import React from "react";
import { motion } from "framer-motion";
import StoreImage from "../../assets/Store.png";

// Reusable StatCard Component
const StatCard = ({ label, value, icon: Icon , index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
    whileHover={{ y: -3 }}
    className="flex items-center gap-3 bg-white border border-[#F1F1F4] px-4 py-3 rounded-[18px] shadow-[0_4px_12px_rgba(15,23,42,0.06)] min-w-[160px] h-[76px]"
  >
    <div className="text-[#FF4D8D] bg-[#FFF0F5] p-2 rounded-full">
     <Icon size={16} strokeWidth={2} />
     </div>
    <div className="flex flex-col">
      <span className="text-[11px] text-[#8CA3BA] uppercase tracking-wider font-semibold">
        {label}
      </span>
      <span className="text-[15px] font-bold text-[#111827]">
        {value}
      </span>
    </div>
  </motion.div>
);

const WholesalerHero = ({ userName = "Boomathi", kpis = [] }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden rounded-[32px] bg-white border border-[#F1F1F4] shadow-[0_30px_70px_rgba(15,23,42,0.06)] h-[320px] "
    >
      {/* Ambient Aura Background */}
      <div className="absolute -top-40 -right-20 w-[450px] h-[450px] rounded-full blur-[100px] opacity-[0.12] pointer-events-none bg-[#FF4D8D]" />
      <div className="absolute -bottom-32 -left-20 w-[350px] h-[350px] rounded-full blur-[100px] opacity-[0.10] pointer-events-none bg-[#FF7A59]" />

      <div className="relative z-10 flex h-full w-full">
        {/* Left Content */}
        <div className="w-full lg:w-[55%] h-full px-8 lg:px-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-[12px] font-bold tracking-[0.25em] uppercase text-[#8CA3BA] ">
              WELCOME BACK,
            </h2>
            <h1 className="text-[48px] font-black text-[#111827] leading-[1.1] tracking-[-0.025em]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF4D8D] to-[#FF7A59]" style={{fontFamily:'"Clash Display","Satoshi","Plus Jakarta Sans","Inter",sans-serif'}} >
                {userName} 
              </span>
            </h1>
            <p className="mt-4 text-[15px] text-[#6B7280] font-medium leading-relaxed max-w-[480px]">
              Manage your inventory, receive buyer enquiries, fulfil wholesale orders, and grow your business through StockLinker.</p>
          </motion.div>

          {/* KPI Cards */}
          <div className="mt-8 flex gap-4">
            {kpis.map((kpi, i) => (
              <StatCard key={i} {...kpi} index={i} />
            ))}
          </div>
        </div>

        {/* Right Image */}
        <div className="hidden lg:flex w-[45%] h-full p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-full rounded-[24px] overflow-hidden"
          >
            <img
              src={StoreImage}
              alt="Wholesale Dashboard"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default React.memo(WholesalerHero);