import React from "react";

export function DetailItem({ label, value }) {
  return (
    <div className="group rounded-[16px] border border-slate-200/60 bg-slate-50/50 p-4 transition-all duration-300 hover:bg-white hover:shadow-sm hover:border-slate-200">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <h3 className="mt-1.5 text-[14px] font-bold leading-snug text-slate-900 break-words">
        {value || "Not provided"}
      </h3>
    </div>
  );
}