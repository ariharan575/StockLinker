export const TABS = [
  { key: "all", label: "All Orders" },
  { key: "PENDING", label: "Pending Requests" },
  { key: "PROCESSING", label: "Processing" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
];

export const STATUS_STYLES = {
  DELIVERED: "bg-[#ECFDF3] text-[#067647] border-[#DCFAE6]",
  PROCESSING: "bg-slate-100 text-black border-slate-300",
  OUT_FOR_DELIVERY: "bg-pink-50 text-pink-600 border-pink-200",
  CANCELLED: "bg-[#FEF3F2] text-[#B42318] border-[#FEE4E2]",
  PENDING: "bg-slate-50 text-slate-600 border-slate-200",
};