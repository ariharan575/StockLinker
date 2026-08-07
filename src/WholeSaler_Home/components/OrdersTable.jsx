import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query"; 
import SectionHeader from "./SectionHeader";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";
import { orderApi } from "../services/api";

const OrderSkeleton = () => (
  <div className="w-[260px] xs:w-[280px] sm:w-[300px] md:w-[320px] shrink-0 bg-white border border-slate-200 rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 h-[190px] shadow-sm animate-pulse flex flex-col justify-between">
    <div className="flex justify-between">
      <div className="w-20 h-4 bg-slate-200/80 rounded" />
      <div className="w-16 h-4 bg-slate-100 rounded" />
    </div>
    <div className="w-32 h-5 bg-slate-200/80 rounded mt-2" />
    <div className="w-full h-10 bg-slate-50 rounded-[8px] mt-4" />
    <div className="flex justify-between items-end mt-4 pt-3 border-t border-slate-50">
      <div className="w-16 h-3 bg-slate-100 rounded" />
      <div className="w-24 h-6 bg-slate-200/80 rounded" />
    </div>
  </div>
);

export default function OrdersTable({ onError }) {

  const { 
    data: orders = [], 
    isLoading, 
    isError,
    error // ✅ Extracted the error object
  } = useQuery({
    queryKey: ['dashboardRecentOrders'],
    queryFn: async () => {
      const response = await orderApi.getDashboardOrders();
      let fetchedOrders = [];
      if (Array.isArray(response)) {
        fetchedOrders = response;
      } else if (response?.data && Array.isArray(response.data)) {
        fetchedOrders = response.data;
      } else if (response?.orders && Array.isArray(response.orders)) {
        fetchedOrders = response.orders;
      } else if (response?.data?.orders && Array.isArray(response.data.orders)) {
        fetchedOrders = response.data.orders;
      }
      return fetchedOrders;
    },
    staleTime: 5 * 60 * 1000, 
  });

  // ✅ Passed the exact error up to the global layout
  useEffect(() => {
    if (isError && onError) onError(error);
  }, [isError, error, onError]);

  const formatDate = (dateString) => {
    if (!dateString) return "Pending";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-full font-inter overflow-hidden">
      
      <div className="px-1 sm:px-2 md:px-3">
        <SectionHeader title="Recent Orders" subtitle="Your latest transactions" />
      </div>
      
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div 
            key="loading" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex flex-row overflow-x-auto no-scrollbar gap-3 sm:gap-4 px-1 sm:px-2 md:px-3 pb-6 pt-2 mt-4"
          >
            {[...Array(4)].map((_, i) => <OrderSkeleton key={i} />)}
          </motion.div>
        )}

        {!isLoading && orders.length === 0 && !isError && (
          <motion.div 
            key="empty" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-4"
          >
            <EmptyState 
              title="No orders yet" 
              description="When buyers place orders for your products, they will appear here." 
              actionLabel={null} 
            />
          </motion.div>
        )}

        {!isLoading && orders.length > 0 && (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-row overflow-x-auto no-scrollbar gap-3 sm:gap-4 px-1 sm:px-2 md:px-3 pb-6 pt-2 mt-2 sm:mt-4"
          >
            {orders.map((order, i) => {
              const itemSummary = order.items && order.items.length > 0 
                ? `${order.items[0].productName} ${order.items.length > 1 ? `+${order.items.length - 1} more` : ''}`
                : "No items";

              const safeOrderNumber = order.orderNumber || order.id || "0000000000";

              return (
                <motion.div 
                  key={order.id || i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -3 }}
                  className="w-[260px] xs:w-[280px] sm:w-[300px] md:w-[320px] shrink-0 bg-white rounded-[16px] sm:rounded-[20px] p-3.5 sm:p-5 border border-slate-200 shadow-sm hover:shadow-[0_12px_30px_-10px_rgba(15,23,42,0.12)] hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] font-inter uppercase tracking-widest text-slate-400 font-bold mb-0.5 sm:mb-1">Order ID</span>
                        <span className="text-[13px] sm:text-[14px] font-sora font-bold text-slate-900 leading-none group-hover:text-pink-600 transition-colors">
                          #{safeOrderNumber.substring(0, 10)}...
                        </span>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-inter font-semibold text-slate-500 bg-slate-50 px-2 sm:px-2.5 py-1 rounded-[6px] border border-slate-100 shrink-0">
                        {formatDate(order.placedAt || order.createdAt)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mb-3 sm:mb-4 gap-2">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] sm:text-[10px] font-inter uppercase tracking-widest text-slate-400 font-bold mb-0.5 sm:mb-1">Buyer</span>
                        <span className="text-[13px] sm:text-[14px] font-sora font-bold text-slate-800 truncate">
                          {order.buyerName || "Unknown Buyer"}
                        </span>
                      </div>
                      <div className="shrink-0">
                        <StatusBadge status={order.status} />
                      </div>
                    </div>

                    <div className="bg-slate-50/80 rounded-[8px] sm:rounded-[10px] p-2 sm:p-2.5 border border-slate-100 mb-2 sm:mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      <span className="text-[11px] sm:text-[12px] font-inter font-medium text-slate-600 truncate">
                        {itemSummary}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-slate-100 flex justify-between items-end">
                    <span className="text-[9px] sm:text-[10px] font-inter font-bold uppercase tracking-widest text-slate-400">Total Value</span>
                    <span className="text-[16px] sm:text-[18px] font-sora font-bold text-slate-900 leading-none">
                      ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}