import React from "react";
import { motion } from "framer-motion";
import { PackageSearch, ChevronRight } from "lucide-react";
import { SectionBox } from "../components/layout/SectionBox";
import { DetailItem } from "../components/cards/DetailItem";

export function InventorySection({ subCategories = [], totalProducts = 0, lowStockCount = 0, bestSellingProduct = "N/A", fastMovingCategory = "N/A" }) {
  return (
    <SectionBox title="Products & Inventory" subtitle="Manage inventory categories, stock insights and product analytics.">
      <div className="grid gap-5 sm:gap-6 lg:gap-8 lg:grid-cols-2">
        <div className="rounded-[20px] sm:rounded-[28px] border border-slate-200/60 bg-white/70 backdrop-blur-xl p-4 sm:p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
          <h3 className="mb-5 sm:mb-6 text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Product Insights</h3>
          <div className="grid gap-3 sm:gap-4">
            <DetailItem label="🏆 Best Selling Product" value={bestSellingProduct} />
            <DetailItem label="📦 Total Active Products" value={totalProducts.toString()} />
            <DetailItem label="⚠️ Low Stock Alerts" value={lowStockCount.toString()} />
            <DetailItem label="🚀 Fast Moving Category" value={fastMovingCategory} />
          </div>
        </div>
        
        <div className="rounded-[20px] sm:rounded-[28px] border border-slate-200/60 bg-white/70 backdrop-blur-xl p-4 sm:p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300 flex flex-col max-h-[400px] sm:max-h-[530px]">
          <h3 className="mb-4 sm:mb-5 text-lg sm:text-xl font-bold text-slate-900 tracking-tight shrink-0">Product Categories</h3>
          <div className="grid gap-3 sm:gap-4 overflow-y-auto custom-scroll pr-1 sm:pr-2 flex-1 min-h-0">
            {subCategories.length === 0 && <p className="text-sm text-slate-500 font-medium">No categories found.</p>}
            {subCategories.map((item) => (
              <motion.div 
                whileHover={{ x: 4 }} 
                key={item.id} 
                className="flex items-center justify-between rounded-xl sm:rounded-2xl border border-slate-100 bg-white p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:border-pink-200 hover:bg-pink-50/50 shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-sky-50 text-sky-500 overflow-hidden">
                    {item.imageName ? (
                       <img src={item.imageName} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                       <PackageSearch size={18} className="sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.name}</h4>
                </div>
                <ChevronRight size={18} className="text-slate-400 shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionBox>
  );
}