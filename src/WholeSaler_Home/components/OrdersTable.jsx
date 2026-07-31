import React, { useEffect, useState } from "react";
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
    <div className="w-full font-inter">
      <SectionHeader title="Recent Orders" subtitle="Your latest transactions" />
      
      {isLoading ? (
        <div className="mt-6 animate-pulse space-y-2">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="h-14 bg-gray-50 border border-gray-100 rounded-lg w-full" />
           ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No orders yet" description="When buyers place orders, they will appear here." />
        </div>
      ) : (
        <div className="mt-6 w-full border border-1 border-slate-200 shadow-md p-2.5 py-5 overflow-x-auto no-scrollbar pb-4">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-3 pb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Order ID</th>
                <th className="px-3 pb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Buyer</th>
                <th className="px-3 pb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">Items</th>
                <th className="px-3 pb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Value</th>
                <th className="px-3 pb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-3 pb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const itemSummary = order.items && order.items.length > 0 
                  ? `${order.items[0].productName} ${order.items.length > 1 ? `+${order.items.length - 1}` : ''}`
                  : "No items";

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="">
                      <span className="px-2 font-sora text-[13px] text-gray-600">
                        {order.orderNumber.substring(0, 12)}...
                      </span>
                    </td>
                    <td className=" py-3.5 text-[14px] font-semibold text-gray-900">
                      {order.buyerName}
                    </td>
                    <td className="py-3.5 text-[13px] text-gray-500 hidden md:table-cell">
                      {itemSummary}
                    </td>
                    <td className="py-3.5 font-sora text-[14px] font-semibold text-gray-900">
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3.5 text-[13px] text-gray-500 text-right">
                      {formatDate(order.placedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}