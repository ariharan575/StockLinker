import React from "react";
import {
  ClipboardCheck,
  Route,
  PackageCheck,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function WholesalerProcess() {
  return (
    <div className="w-full bg-[#f0f0f0] px-4 py-10 sm:px-5 md:px-6 lg:px-7 xl:px-8 lg:py-16 mt-10 rounded-[1rem] font-sans antialiased overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-[1600px] mx-auto"
      >
        {/* Header */}
        <div className="mb-10 md:mb-14 text-center max-w-4xl mx-auto px-2">
          <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-4 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-[0.22em] text-emerald-600">
            Realtime Fulfillment Intelligence
          </span>

          <h3 className="mt-5 text-[2rem] leading-[1.05] font-black tracking-tight text-gray-950 sm:text-[2.8rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.3rem]">
            Confirm → Track → Deliver → Reorder
          </h3>

          <p className="mt-4 text-sm sm:text-[15px] md:text-base leading-relaxed text-gray-500 font-medium max-w-3xl mx-auto">
            Coordinate fulfillment, monitor deliveries, and automate repeat orders from one intelligent logistics platform.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-3 xl:gap-5 items-stretch">

          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group flex flex-col justify-between rounded-[24px] border border-gray-100 bg-white p-5 lg:p-4 xl:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] min-h-[220px] sm:min-h-[240px] lg:min-h-[250px]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 lg:h-9 lg:w-9 xl:h-11 xl:w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ClipboardCheck className="h-5 w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                </div>

                <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] xl:text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                  Step 04
                </span>
              </div>

              <div className="mt-5 lg:mt-4">
                <h4 className="text-lg sm:text-xl lg:text-[19px] xl:text-[22px] font-bold tracking-tight text-gray-900">
                  Confirm
                </h4>

                <p className="mt-3 text-[13px] sm:text-sm leading-[1.7] text-gray-500 font-medium">
                  Validate orders with realtime inventory checks and warehouse confirmation workflows.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center text-[11px] font-bold tracking-wide text-emerald-600 cursor-pointer group/btn">
              <span>Explore feature</span>

              <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group flex flex-col justify-between rounded-[24px] border border-gray-100 bg-white p-5 lg:p-4 xl:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] min-h-[220px] sm:min-h-[240px] lg:min-h-[250px]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 lg:h-9 lg:w-9 xl:h-11 xl:w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <Route className="h-5 w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                </div>

                <span className="rounded-md bg-sky-50 px-2 py-1 text-[9px] xl:text-[10px] font-black uppercase tracking-[0.18em] text-sky-600">
                  Step 05
                </span>
              </div>

              <div className="mt-5 lg:mt-4">
                <h4 className="text-lg sm:text-xl lg:text-[19px] xl:text-[22px] font-bold tracking-tight text-gray-900">
                  Track
                </h4>

                <p className="mt-3 text-[13px] sm:text-sm leading-[1.7] text-gray-500 font-medium">
                  Monitor shipments with optimized routing and realtime transport visibility.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center text-[11px] font-bold tracking-wide text-sky-600 cursor-pointer group/btn">
              <span>Explore feature</span>

              <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group flex flex-col justify-between rounded-[24px] border border-gray-100 bg-white p-5 lg:p-4 xl:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] min-h-[220px] sm:min-h-[240px] lg:min-h-[250px]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 lg:h-9 lg:w-9 xl:h-11 xl:w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <PackageCheck className="h-5 w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                </div>

                <span className="rounded-md bg-violet-50 px-2 py-1 text-[9px] xl:text-[10px] font-black uppercase tracking-[0.18em] text-violet-600">
                  Step 06
                </span>
              </div>

              <div className="mt-5 lg:mt-4">
                <h4 className="text-lg sm:text-xl lg:text-[19px] xl:text-[22px] font-bold tracking-tight text-gray-900">
                  Deliver
                </h4>

                <p className="mt-3 text-[13px] sm:text-sm leading-[1.7] text-gray-500 font-medium">
                  Complete deliveries with fulfillment verification and payment confirmation.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center text-[11px] font-bold tracking-wide text-violet-600 cursor-pointer group/btn">
              <span>Explore feature</span>

              <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </div>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group flex flex-col justify-between rounded-[24px] border border-gray-100 bg-white p-5 lg:p-4 xl:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] min-h-[220px] sm:min-h-[240px] lg:min-h-[250px]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 lg:h-9 lg:w-9 xl:h-11 xl:w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <RefreshCw className="h-5 w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                </div>

                <span className="rounded-md bg-orange-50 px-2 py-1 text-[9px] xl:text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">
                  Step 07
                </span>
              </div>

              <div className="mt-5 lg:mt-4">
                <h4 className="text-lg sm:text-xl lg:text-[19px] xl:text-[22px] font-bold tracking-tight text-gray-900">
                  Reorder
                </h4>

                <p className="mt-3 text-[13px] sm:text-sm leading-[1.7] text-gray-500 font-medium">
                  Generate smart repeat purchases using inventory and demand insights.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center text-[11px] font-bold tracking-wide text-orange-600 cursor-pointer group/btn">
              <span>Explore feature</span>

              <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </div>
          </motion.div>

        </div>

        {/* Bottom Badge */}
        <div className="mt-12 md:mt-14 flex justify-center">
          <div className="rounded-full border border-gray-200 bg-white px-5 py-3 shadow-sm">
            <span className="block text-center text-[10px] sm:text-xs font-black tracking-[0.2em] text-gray-600">
              WHOLESALE FULFILLMENT INTELLIGENCE
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}