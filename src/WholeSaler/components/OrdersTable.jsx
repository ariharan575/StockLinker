// components/OrdersTable.jsx
import React, { useMemo, useState } from "react";
import SectionHeader from "./SectionHeader";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";
import { InboxIcon, EyeIcon } from "./Icons";

function OrdersTable({ orders, tabs }) {
  const [activeTab, setActiveTab] = useState("all");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    const list =
      activeTab === "all"
        ? orders
        : orders.filter((o) => o.status.toLowerCase() === activeTab);

    return [...list].sort((a, b) =>
      sortAsc ? a.value - b.value : b.value - a.value
    );
  }, [orders, activeTab, sortAsc]);

  return (
    <section className="rounded-[32px] border border-slate-200/40 bg-white/60 p-6 shadow-[0_12px_50px_rgb(0,0,0,0.06)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.03)] sm:p-8">
      <SectionHeader
        icon={<InboxIcon className="h-5 w-5" />}
        title="Order Overview"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex items-center justify-end pb-6 sm:hidden">
        <a href="#" className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-slate-600 transition-colors hover:text-indigo-600">
          View All Orders <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>

      {filtered.length === 0 ? (
        <div className="pt-4">
          <EmptyState
            icon={<InboxIcon className="h-7 w-7" />}
            title="No orders found"
            description="Try selecting another tab, or check back once buyers place new orders."
          />
        </div>
      ) : (
        <div className="-mx-6 overflow-x-auto px-6 pb-6 pt-2 sm:-mx-8 sm:px-8">
          <table className="w-full min-w-[800px] border-separate border-spacing-y-2.5 text-left">
            <thead>
              <tr className="text-[11.5px] font-bold uppercase tracking-[0.15em] text-slate-400">
                <th className="pb-4 pl-7 pr-4">Order ID</th>
                <th className="px-4 pb-4">Buyer Name</th>
                <th className="px-4 pb-4">Items</th>
                <th className="px-4 pb-4">
                  <button
                    type="button"
                    onClick={() => setSortAsc((s) => !s)}
                    className="group inline-flex items-center gap-2 transition-colors duration-300 hover:text-indigo-600"
                    aria-label="Sort by order value"
                  >
                    Order Value
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500 transition-all duration-300 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                      {sortAsc ? "↑" : "↓"}
                    </span>
                  </button>
                </th>
                <th className="px-4 pb-4">Status</th>
                <th className="px-4 pb-4">Date</th>
                <th className="pb-4 pr-7 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="group transition-all duration-300 ease-out  hover:-translate-y-[2px] [&>td]:bg-slate-50 [&>td]:py-4 [&>td]:transition-all [&>td]:duration-300 [&>td]:first:rounded-l-[20px] [&>td]:last:rounded-r-[20px] [&>td]:shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:[&>td]:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:[&>td]:bg-slate-50/50"
                >
                  <td className="relative pl-7 pr-4">
                    <div className="absolute inset-y-3 left-0 w-[3px] origin-center scale-y-0 rounded-r-full bg-indigo-500 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                    <span className="font-mono text-[13.5px] font-bold tracking-tight text-slate-700">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-4 text-[14.5px] font-semibold text-slate-900">
                    {order.buyer}
                  </td>
                  <td className="px-4 text-[14.5px] font-medium text-slate-500 opacity-90">
                    {order.items}
                  </td>
                  <td className="px-4 text-[16px] font-bold tracking-tight text-slate-900">
                    ₹{order.value.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4">
                    <StatusBadge status={order.status} pulse={order.status === "Pending"} />
                  </td>
                  <td className="px-4 text-[13.5px] font-medium text-slate-400 opacity-80">
                    {order.date}
                  </td>
                  <td className="pr-5 text-right">
                    <button
                      type="button"
                      className="group/btn inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-slate-500 opacity-0 transition-all duration-300 hover:bg-white hover:text-indigo-600 hover:shadow-[0_2px_10px_rgba(0,0,0,0.04)] group-hover:opacity-100 focus:opacity-100 sm:opacity-100"
                    >
                      <EyeIcon className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default React.memo(OrdersTable);