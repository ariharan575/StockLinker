// components/OrdersTable.jsx
import React, { useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";
import { InboxIcon, EyeIcon } from "./Icons";
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
    <section className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm transition-shadow duration-500 hover:shadow-md sm:p-8">
      <SectionHeader
        icon={<InboxIcon className="h-5 w-5 text-slate-800" />}
        title="Recent Orders"
        subtitle="Your latest 5 transactions"
      />
      
      <div className="flex items-center justify-end pb-6 sm:hidden">
        <a href="/orders" className="group inline-flex items-center gap-1.5 text-[14px] font-bold text-slate-600 transition-colors hover:text-slate-900">
          View All Orders <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>

      {isLoading ? (
        <div className="pt-4 animate-pulse space-y-4">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="h-16 bg-slate-100 rounded-2xl w-full" />
           ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="pt-4">
          <EmptyState
            icon={<InboxIcon className="h-7 w-7 text-slate-400" />}
            title="No orders yet"
            description="When buyers place orders from your catalog, they will appear here."
          />
        </div>
      ) : (
        <div className="-mx-6 overflow-x-auto px-6 pb-6 pt-2 sm:-mx-8 sm:px-8">
          <table className="w-full min-w-[800px] border-separate border-spacing-y-2.5 text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                <th className="pb-4 pl-7 pr-4">Order ID</th>
                <th className="px-4 pb-4">Buyer Name</th>
                <th className="px-4 pb-4">Items</th>
                <th className="px-4 pb-4">Order Value</th>
                <th className="px-4 pb-4">Status</th>
                <th className="px-4 pb-4">Date</th>
                <th className="pb-4 pr-7 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const itemSummary = order.items && order.items.length > 0 
                  ? `${order.items[0].productName} ${order.items.length > 1 ? `+${order.items.length - 1} more` : ''}`
                  : "No items";

                return (
                  <tr
                    key={order.id}
                    className="group transition-all duration-300 ease-out hover:-translate-y-[2px] [&>td]:bg-slate-50 [&>td]:py-4 [&>td]:transition-all [&>td]:duration-300 [&>td]:first:rounded-l-[20px] [&>td]:last:rounded-r-[20px] hover:[&>td]:shadow-md hover:[&>td]:bg-white border border-transparent hover:border-slate-200"
                  >
                    <td className="relative pl-7 pr-4">
                      <div className="absolute inset-y-3 left-0 w-[3px] origin-center scale-y-0 rounded-r-full bg-slate-800 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                      <span className="font-mono text-[13px] font-bold tracking-tight text-slate-700">
                        {order.orderNumber.substring(0, 14)}
                      </span>
                    </td>
                    <td className="px-4 text-[14px] font-bold text-slate-900">
                      {order.buyerName}
                    </td>
                    <td className="px-4 text-[13px] font-semibold text-slate-500">
                      {itemSummary}
                    </td>
                    <td className="px-4 text-[15px] font-bold tracking-tight text-slate-900">
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4">
                      <StatusBadge status={order.status} pulse={order.status === "PENDING"} />
                    </td>
                    <td className="px-4 text-[13px] font-bold text-slate-400">
                      {formatDate(order.placedAt)}
                    </td>
                    <td className="pr-5 text-right">
                      <button
                        type="button"
                        className="group/btn inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 opacity-0 transition-all duration-300 hover:bg-slate-900 hover:text-white group-hover:opacity-100 focus:opacity-100 sm:opacity-100 shadow-sm"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}