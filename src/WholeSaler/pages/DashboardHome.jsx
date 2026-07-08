import React, { useState } from "react";
import HeroSection from "../components/HeroSection";
import ProductTable from "../components/ProductTable";
import InquirySection from "../components/InquirySection";
import OrdersTable from "../components/OrdersTable";
import Footer from '../../HomePage/layout/Footer'
import SupplierSection from "../components/SupplierSection";
import { SkeletonCard, SkeletonRow } from "../components/Skeleton";
import useDashboardData from "../hooks/useDashboardData";

function DashboardHome() {
  const { isLoading, kpis, products: initialProducts, orders, orderTabs, enquiries, suppliers } =
    useDashboardData();

  const [products, setProducts] = useState(initialProducts);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        <div style={{ animationDelay: "0ms" }} className="animate-[fadeUp_0.6s_ease-out_both]">
          <HeroSection userName="Boomathi" kpis={kpis} />
        </div>

        <div style={{ animationDelay: "80ms" }} className="animate-[fadeUp_0.6s_ease-out_both]">
          {isLoading ? (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : (
            <ProductTable products={products} setProducts={setProducts} />
          )}
        </div>

        <div style={{ animationDelay: "140ms" }} className="animate-[fadeUp_0.6s_ease-out_both]">
          {isLoading ? (
            <div className="flex gap-4 overflow-x-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <InquirySection enquiries={enquiries} />
          )}
        </div>

        <div style={{ animationDelay: "200ms" }} className="animate-[fadeUp_0.6s_ease-out_both]">
          <OrdersTable orders={orders} tabs={orderTabs} />
        </div>

        <div style={{ animationDelay: "260ms" }} className="animate-[fadeUp_0.6s_ease-out_both]">
          <SupplierSection suppliers={suppliers} />
        </div>
       
      </div>
    <Footer/>   
    </div>

  );
}

export default DashboardHome;
