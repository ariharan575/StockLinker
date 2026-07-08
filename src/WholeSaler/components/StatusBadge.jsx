// components/StatusBadge.jsx
import React from "react";

const STATUS_STYLES = {
  new: "bg-indigo-50/80 text-indigo-700 ring-indigo-200/50",
  interested: "bg-emerald-50/80 text-emerald-700 ring-emerald-200/50",
  "follow up": "bg-amber-50/80 text-amber-700 ring-amber-200/50",
  pending: "bg-slate-50 text-slate-700 ring-slate-200/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]",
  confirmed: "bg-stone-50/80 text-stone-600 ring-stone-200/50",
  dispatched: "bg-sky-50/80 text-sky-700 ring-sky-200/50",
  delivered: "bg-gradient-to-b from-indigo-50/50 to-indigo-100/50 text-indigo-700 ring-indigo-200/60 shadow-[inset_0_1px_1px_rgba(255,255,255,1)]",
  cancelled: "bg-zinc-50/80 text-zinc-500 ring-zinc-200/50",
};

function StatusBadge({ status, pulse = false }) {
  const key = status.toLowerCase();
  const style = STATUS_STYLES[key] || "bg-slate-50 text-slate-500 ring-slate-200/50";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold ring-1 ring-inset transition-all duration-300 ${style}`}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-slate-500" />
        </span>
      )}
      {status}
    </span>
  );
}

export default React.memo(StatusBadge);