import React from "react";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center sm:items-end justify-between gap-3 md:mx-2 font-inter w-full">
      <div className="flex-1 pr-2 min-w-0">
        <h2 className="font-sora text-[19px] sm:text-[28px] font-semibold tracking-tight text-gray-900 leading-tight truncate sm:whitespace-normal">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[12px] sm:text-[15px] text-gray-500 truncate sm:whitespace-normal">
            {subtitle}
          </p>
        )}
      </div>

      {action ? (
        <button onClick={action.onClick} className="shrink-0 whitespace-nowrap flex items-center gap-1.5 text-[13px] md:me-5 font-semibold text-gray-600 hover:text-gray-900 transition-colors">
          {action.label} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ) : (
        <button className="shrink-0  whitespace-nowrap flex items-center gap-1.5 text-[13px] md:me-4 font-semibold text-gray-600 hover:text-gray-900 transition-colors">
          View All <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}