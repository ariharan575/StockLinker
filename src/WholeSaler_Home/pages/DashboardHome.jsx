import React, { useState } from "react";
import HeroSection from "../components/HeroSection";
import ProductTable from "../components/ProductTable";
import InquirySection from "../components/InquirySection";
import OrdersTable from "../components/OrdersTable";
import { SkeletonCard, SkeletonRow } from "../components/Skeleton";
import useDashboardData from "../hooks/useDashboardData";
import NearbyBuyersSection from "../components/NearbyBuyersSection";
import Footer from '../../Layout/Footer';
import QuickAction from '../../Shopkeeper_Home/sections/QuickActions'


function DashboardHome() {
  const { isLoading, kpis, products: initialProducts, orders, orderTabs, enquiries } = useDashboardData();
  const [products, setProducts] = useState(initialProducts);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-inter">
      {/* Unified Canvas Container: Single column, deeply spaced, no wrapping boxes */}
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 sm:gap-8 lg:gap-10 px-2 ">
        
        <HeroSection userName="Boomathi" kpis={kpis} />
        <QuickAction/>
        <div>
          {isLoading ? (
            <div className="space-y-4 border border-gray-100 rounded-xl p-4">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : (
            <ProductTable products={products} setProducts={setProducts} />
          )}
        </div>

        <div>
          {isLoading ? (
            <div className="flex gap-6 overflow-x-hidden pt-4">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <InquirySection enquiries={enquiries} />
          )}
        </div>

        <div>
          <OrdersTable orders={orders} tabs={orderTabs} />
        </div>

        <div>
          <NearbyBuyersSection />
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default DashboardHome;