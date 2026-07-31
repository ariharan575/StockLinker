import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({ title = "No active records", description = "New data will appear here once available.", icon }) {
  return (
    <div className="flex w-full flex-col items-center justify-center border-y border-dashed border-gray-200 py-16 sm:py-24 text-center font-inter">
      <div className="mb-4 sm:mb-5 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gray-50 border border-gray-100">
        {icon || <Inbox className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" strokeWidth={1.5} />}
      </div>
      <h3 className="font-sora mb-1 sm:mb-2 text-[16px] sm:text-[18px] font-semibold text-gray-900">
        {title}
      </h3>
      <p className="max-w-sm text-[13px] sm:text-[14px] text-gray-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}