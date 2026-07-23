import React from "react";
import { motion } from "framer-motion";
import { PackageSearch, ChevronRight } from "lucide-react";
import { SectionBox } from "../components/layout/SectionBox";
import { DetailItem } from "../components/cards/DetailItem";

export function InventorySection({ subCategories = [], totalProducts = 0, lowStockCount = 0, bestSellingProduct = "N/A", fastMovingCategory = "N/A" }) {
  return (
    <SectionBox title="Products & Inventory" subtitle="Manage inventory categories, stock insights and product analytics.">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-5">
          <h3 className="mb-5 text-xl font-black text-zinc-900">Product Insights</h3>
          <div className="grid gap-4">
            <DetailItem label="🏆 Best Selling Product" value={bestSellingProduct} />
            <DetailItem label="📦 Total Active Products" value={totalProducts.toString()} />
            <DetailItem label="⚠️ Low Stock Alerts" value={lowStockCount.toString()} />
            <DetailItem label="🚀 Fast Moving Category" value={fastMovingCategory} />
          </div>
        </div>
        <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-5 max-h-[530px] overflow-y-auto custom-scroll relative">
          <h3 className="mb-5 text-xl font-black sticky top-0 bg-zinc-50 py-2 text-zinc-900 z-10">Product Categories</h3>
          <div className="grid gap-4">
            {subCategories.length === 0 && <p className="text-sm text-slate-500">No categories found.</p>}
            {subCategories.map((item) => (
              <motion.div whileHover={{ x: 4 }} key={item.id} className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 cursor-pointer transition-all duration-300 hover:border-pink-400 hover:bg-pink-50/60">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 overflow-hidden">
                    {item.imageName ? (
                       <img src={item.imageName} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                       <PackageSearch size={18} />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900">{item.name}</h4>
                </div>
                <ChevronRight size={18} className="text-zinc-400" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionBox>
  );
}