import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "./SectionHeader";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";
import { orderApi } from "../services/api";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await orderApi.getDashboardOrders();
        if (isMounted) setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchOrders();
    return () => { isMounted = false; };
  }, []);

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
        {/* ========================================================= */}
        {/* LOADING SKELETONS (Horizontal Scroll)                     */}
        {/* ========================================================= */}
        {isLoading && (
          <motion.div 
            key="loading" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex flex-row overflow-x-auto no-scrollbar gap-3 sm:gap-4 px-1 sm:px-2 md:px-3 pb-6 pt-2 mt-4"
          >
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="w-[260px] xs:w-[280px] sm:w-[300px] md:w-[320px] shrink-0 bg-white border border-slate-100 rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 h-[190px] shadow-sm animate-pulse flex flex-col justify-between"
              >
                <div className="flex justify-between">
                  <div className="w-20 h-4 bg-slate-200 rounded" />
                  <div className="w-16 h-4 bg-slate-100 rounded" />
                </div>
                <div className="w-32 h-5 bg-slate-200 rounded mt-2" />
                <div className="w-full h-10 bg-slate-50 rounded-[8px] mt-4" />
                <div className="flex justify-between items-end mt-4 pt-3 border-t border-slate-50">
                  <div className="w-16 h-3 bg-slate-100 rounded" />
                  <div className="w-24 h-6 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* EMPTY STATE                                               */}
        {/* ========================================================= */}
        {!isLoading && orders.length === 0 && (
          <motion.div 
            key="empty" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-4 mx-1 sm:mx-2 md:mx-3 bg-white rounded-[20px] p-6 border-2 border-dashed border-slate-200 shadow-sm"
          >
            <EmptyState title="No orders yet" description="When buyers place orders, they will appear here." />
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* SUCCESS DATA RENDERING (Horizontal Single Row)            */}
        {/* ========================================================= */}
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

              return (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -3 }}
                  className="w-[260px] xs:w-[280px] sm:w-[300px] md:w-[320px] shrink-0 bg-white rounded-[16px] sm:rounded-[20px] p-3.5 sm:p-5 border border-slate-200 shadow-sm hover:shadow-[0_12px_30px_-10px_rgba(15,23,42,0.12)] hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Order ID & Date */}
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] font-inter uppercase tracking-widest text-slate-400 font-bold mb-0.5 sm:mb-1">Order ID</span>
                        <span className="text-[13px] sm:text-[14px] font-sora font-bold text-slate-900 leading-none group-hover:text-pink-600 transition-colors">
                          #{order.orderNumber.substring(0, 10)}...
                        </span>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-inter font-semibold text-slate-500 bg-slate-50 px-2 sm:px-2.5 py-1 rounded-[6px] border border-slate-100 shrink-0">
                        {formatDate(order.placedAt)}
                      </span>
                    </div>

                    {/* Middle: Buyer Name & Status */}
                    <div className="flex justify-between items-center mb-3 sm:mb-4 gap-2">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] sm:text-[10px] font-inter uppercase tracking-widest text-slate-400 font-bold mb-0.5 sm:mb-1">Buyer</span>
                        <span className="text-[13px] sm:text-[14px] font-sora font-bold text-slate-800 truncate">
                          {order.buyerName}
                        </span>
                      </div>
                      <div className="shrink-0">
                        <StatusBadge status={order.status} />
                      </div>
                    </div>

                    {/* Items Summary Box */}
                    <div className="bg-slate-50/80 rounded-[8px] sm:rounded-[10px] p-2 sm:p-2.5 border border-slate-100 mb-2 sm:mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      <span className="text-[11px] sm:text-[12px] font-inter font-medium text-slate-600 truncate">
                        {itemSummary}
                      </span>
                    </div>
                  </div>

                  {/* Footer: Total Value */}
                  <div className="pt-3 sm:pt-4 border-t border-slate-100 flex justify-between items-end">
                    <span className="text-[9px] sm:text-[10px] font-inter font-bold uppercase tracking-widest text-slate-400">Total Value</span>
                    <span className="text-[16px] sm:text-[18px] font-sora font-bold text-slate-900 leading-none">
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global utility to completely hide scrollbar but keep swipe functionality */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}