import React from "react";

const STATUS_STYLES = {
  pending: "bg-gray-100 text-gray-600 border border-gray-200",
  processing: "bg-black text-white",
  out_for_delivery: "bg-gray-800 text-white",
  delivered: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

function StatusBadge({ status }) {
  const key = status ? status.toLowerCase() : "pending";
  const style = STATUS_STYLES[key] || "bg-gray-100 text-gray-600 border border-gray-200";
  const displayStatus = status ? status.replace(/_/g, ' ') : "Pending";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider rounded-md font-inter ${style}`}
    >
      {displayStatus}
    </span>
  );
}

export default React.memo(StatusBadge);