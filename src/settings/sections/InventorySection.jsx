import React from "react";
import { motion } from "framer-motion";
import {
  Package2,
  Warehouse,
  Activity,
  TrendingUp,
  PackageSearch,
  ChevronRight,
} from "lucide-react";
import { SectionBox } from "../layout/SectionBox";
import { SmallCard } from "../cards/SmallCard";
import { DetailItem } from "../cards/DetailItem";

export function InventorySection() {
  return (
    <SectionBox
      title="Products & Inventory"
      subtitle="Manage inventory categories, stock insights and product analytics."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div
          className={`
            rounded-[28px]
            border
            border-zinc-200
            bg-zinc-50
            p-5
          `}
        >
          <h3
            className={`
              mb-5
              text-xl
              font-black
              text-zinc-900
            `}
          >
            Product Insights
          </h3>

          <div className="grid gap-4">
            <DetailItem label="Best Selling Product" value="Premium Rice" />
            <DetailItem label="Monthly Growth" value="+24%" />
            <DetailItem label="Inventory Value" value="₹8.2 Lakhs" />
            <DetailItem label="Fast Moving Category" value="Groceries" />
          </div>
        </div>

        <div
          className={`
            rounded-[28px]
            border
            border-zinc-200
            bg-zinc-50
            p-5
            max-h-[500px]
            overflow-y-auto
            custom-scroll
          `}
        >
          <h3
            className={`
              mb-5
              text-xl
              font-black
              sticky
              top-0
              bg-inherit
              py-2
              text-zinc-900
            `}
          >
            Product Categories
          </h3>

          <div className="grid gap-4">
            {[
              "Groceries",
              "Vegetables",
              "Beverages",
              "FMCG",
              "Snacks",
              "Oils",
              "Dairy",
              "Frozen Foods",
              "Bakery",
              "Spices",
              "Grains",
              "Personal Care",
              "Household",
              "Baby Care",
              "Pet Supplies",
            ].map((item) => (
              <motion.div
                whileHover={{ x: 4 }}
                key={item}
                className={`
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-zinc-200
                  bg-white
                  p-4
                  cursor-pointer
                  transition-all
                  duration-300
                  hover:border-pink-400
                  hover:bg-pink-50/60
                `}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-sky-500/10
                      text-sky-400
                    "
                  >
                    <PackageSearch size={18} />
                  </div>
                  <h4
                    className={`
                      text-sm
                      font-bold
                      text-zinc-900
                    `}
                  >
                    {item}
                  </h4>
                </div>
                <ChevronRight size={18} className="text-zinc-400" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SmallCard title="Total Products" value="2,480" icon={Package2} />
        <SmallCard title="Categories" value="24" icon={Warehouse} />
        <SmallCard title="Low Stock" value="14" icon={Activity} />
        <SmallCard title="Top Selling" value="Rice" icon={TrendingUp} />
      </div>
    </SectionBox>
  );
}