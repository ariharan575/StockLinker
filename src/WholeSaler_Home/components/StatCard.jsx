// components/StatCard.jsx
import React from "react";
import AnimatedCounter from "./AnimatedCounter";
import { TrendUpIcon, BoxIcon, MessageIcon, PackageIcon } from "./Icons";

const ICONS = { box: BoxIcon, message: MessageIcon, package: PackageIcon };

function StatCard({ label, value, delta, trend, caption, icon, index = 0 }) {
  const Icon = ICONS[icon] || BoxIcon;
  const isUp = trend === "up";

  return (
    <div
      style={{ animationDelay: `${index * 90}ms` }}
      className="group relative flex-1 animate-[fadeUp_0.6s_ease-out_both] overflow-hidden rounded-2xl bg-white/80 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-white/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* soft glow accent that appears on hover */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-200/0 blur-2xl transition-colors duration-500 group-hover:bg-indigo-300/30" />

      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Icon className="h-5 w-5" />
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
            isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}
        >
          <TrendUpIcon className={`h-3 w-3 ${isUp ? "" : "rotate-90"}`} />
          {delta}%
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
        <AnimatedCounter value={value} />
      </p>
      <p className="mt-1 text-xs text-slate-400">{caption}</p>
    </div>
  );
}

export default React.memo(StatCard);
