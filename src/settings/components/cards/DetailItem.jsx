import React from "react";

export function DetailItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition-all duration-300 cursor-pointer hover:border-pink-400 hover:bg-pink-50/60">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <h3 className="mt-3 text-[15px] font-bold leading-relaxed text-zinc-900">
        {value || "Not provided"}
      </h3>
    </div>
  );
}