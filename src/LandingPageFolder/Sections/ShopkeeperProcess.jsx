import React from "react";
import {
  Search,
  Radio,
  IndianRupee,
  Truck,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ShopkeeperProcess() {
  return (
    <div className="w-full min-h-screen bg-[#f0f0f0] px-4 py-12 sm:px-6 md:py-20 lg:px-8 mt-10 font-sans antialiased rounded-[1rem]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto "
      >
        {/* Header Section from Screenshot (57).jpg */}
        <div className="mb-12 md:mb-16 text-center max-w-4xl mx-auto px-4 ">

          <h3 className="mt-5 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
            Search → Compare → Select
          </h3>
          
          <p className="mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-gray-600 font-medium">
            Designed for India's fast-moving wholesale ecosystem with automation, intelligence, and operational visibility.
          </p>
        </div>

        {/* Adaptive Grid System */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          
          {/* Step 01 */}
          <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100/80"
          >
            <div>
              {/* Header inside Card: Row setup keeps it perfectly rectangular on mobile */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                  <Search className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 bg-sky-50/70 px-2.5 py-1 rounded-md">
                  Step 01
                </span>
              </div>

              <div className="mt-5">
                <h4 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                  Discover
                </h4>
                <p className="mt-2 text-xs md:text-sm leading-relaxed text-gray-500 font-medium">
                  Search products naturally using text, voice, regional names, or marketplace intelligence.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center text-xs font-bold text-sky-500 tracking-wide cursor-pointer group/btn">
              <span>Explore feature</span>
              <ChevronRight className="ml-1 h-3.5 w-3.5 transform transition-transform group-hover/btn:translate-x-1" />
            </div>
          </motion.div>

          {/* Step 02 */}
          <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100/80"
          >
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                  <Radio className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 bg-sky-50/70 px-2.5 py-1 rounded-md">
                  Step 02
                </span>
              </div>

              <div className="mt-5">
                <h4 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                  Match
                </h4>
                <p className="mt-2 text-xs md:text-sm leading-relaxed text-gray-500 font-medium">
                  Instantly identify wholesalers, availability, logistics capability and supplier quality.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center text-xs font-bold text-sky-500 tracking-wide cursor-pointer group/btn">
              <span>Explore feature</span>
              <ChevronRight className="ml-1 h-3.5 w-3.5 transform transition-transform group-hover/btn:translate-x-1" />
            </div>
          </motion.div>

          {/* Step 03 */}
          <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100/80"
          >
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 bg-sky-50/70 px-2.5 py-1 rounded-md">
                  Step 03
                </span>
              </div>

              <div className="mt-5">
                <h4 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                  Compare
                </h4>
                <p className="mt-2 text-xs md:text-sm leading-relaxed text-gray-500 font-medium">
                  Live pricing continuously reorders suppliers and exposes the lowest cost opportunity.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center text-xs font-bold text-sky-500 tracking-wide cursor-pointer group/btn">
              <span>Explore feature</span>
              <ChevronRight className="ml-1 h-3.5 w-3.5 transform transition-transform group-hover/btn:translate-x-1" />
            </div>
          </motion.div>

          {/* Step 04 */}
          <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100/80"
          >
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                  <Truck className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 bg-sky-50/70 px-2.5 py-1 rounded-md">
                  Step 04
                </span>
              </div>

              <div className="mt-5">
                <h4 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                  Buy
                </h4>
                <p className="mt-2 text-xs md:text-sm leading-relaxed text-gray-500 font-medium">
                  Choose the most efficient supplier based on price, delivery speed and inventory confidence.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center text-xs font-bold text-sky-500 tracking-wide cursor-pointer group/btn">
              <span>Explore feature</span>
              <ChevronRight className="ml-1 h-3.5 w-3.5 transform transition-transform group-hover/btn:translate-x-1" />
            </div>
          </motion.div>

        </div>

        {/* Real-Time Bottom Badge */}
        <div className="mt-14  flex justify-center">
          <div className="rounded-full bg-white border border-gray-200/80 shadow-sm px-6 py-3">
            <span className="text-xs font-bold tracking-[0.2em] text-gray-600 block text-center">
              REALTIME SHOPKEEPER PROCUREMENT ENGINE
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}