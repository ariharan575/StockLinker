// components/StatusBadge.jsx
import React from "react";

const STATUS_STYLES = {
  pending: "bg-slate-100 text-slate-700 ring-slate-200 shadow-sm",
  processing: "bg-slate-200 text-slate-800 ring-slate-300",
  out_for_delivery: "bg-slate-800 text-white ring-slate-900",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
};

function StatusBadge({ status, pulse = false }) {
  const key = status ? status.toLowerCase() : "pending";
  const style = STATUS_STYLES[key] || "bg-slate-100 text-slate-700 ring-slate-200";
  const displayStatus = status ? status.replace(/_/g, ' ') : "Pending";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset transition-all duration-300 ${style}`}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-50" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {displayStatus}
    </span>
  );
}

export default React.memo(StatusBadge);