import React from "react";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 md:mx-2 font-inter">
      <div>
        <h2 className="font-sora text-[21px] sm:text-[28px] font-semibold tracking-tight text-gray-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[13px] sm:text-[15px] text-gray-500">
            {subtitle}
          </p>
        )}
      </div>

      {action ? (
        <button onClick={action.onClick} className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 hover:text-gray-900 transition-colors">
          {action.label} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ) : (
        <button className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 hover:text-gray-900 transition-colors">
          View All <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}