import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronDown,
  ArrowRight,
  X,
  RotateCcw,
  BadgeCheck,
  MapPin,
  Copy,
  ArrowUpDown,
  Download,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Dummy data                                                                 */
/* -------------------------------------------------------------------------- */

const TABS = [
  { key: "all", label: "All Orders", count: null },
  { key: "active", label: "Active", count: 32 },
  { key: "processing", label: "Processing", count: 18 },
  { key: "delivered", label: "Delivered", count: 74 },
  { key: "cancelled", label: "Cancelled", count: 4 },
];

const STATUS_STYLES = {
  Delivered: "bg-emerald-50 text-emerald-600",
  Processing: "bg-amber-50 text-amber-600",
  "In Transit": "bg-amber-50 text-amber-600",
  Cancelled: "bg-rose-50 text-rose-600",
  "Order Completed": "bg-emerald-50 text-emerald-600",
};

const ORDERS = [
  {
    id: "SL-928392",
    placedOn: "20 Jun 2026, 11:30 AM",
    status: "Delivered",
    deliveredOn: "24 Jun 2026",
    deliveredLabel: "Delivered on",
    invoiceId: "INV-2026-06-928392",
    supplier: {
      name: "ABC Fashion Wholesale",
      verified: true,
      location: "Tirupur, Tamil Nadu",
      gstin: "33ABCDE1234F1Z5",
      businessType: "Manufacturer",
    },
    products: [
      { name: "Premium Cotton Shirt", sku: "SH-001", qty: "50 Units", rate: 800, total: 40000 },
      { name: "Denim Jeans", sku: "JN-022", qty: "30 Units", rate: 1000, total: 30000 },
      { name: "Sports Shoes", sku: "SS-105", qty: "20 Units", rate: 500, total: 10000 },
      { name: "Cotton Kurta Set", sku: "KS-089", qty: "15 Units", rate: 200, total: 3000 },
    ],
    totalValue: 83000,
    bill: {
      totalAmount: 83000,
      discount: 0,
      tax: 0,
      finalAmount: 83000,
    },
    totalProducts: 4,
    totalQuantity: 115,
  },
  {
    id: "SL-928391",
    placedOn: "18 Jun 2026, 09:15 AM",
    status: "Processing",
    deliveredOn: "25 Jun 2026",
    deliveredLabel: "Expected Delivery",
    invoiceId: "INV-2026-06-928391",
    supplier: {
      name: "Global Houseware Ltd.",
      verified: true,
      location: "Delhi, Delhi",
      gstin: "07ABCDE1234F1Z5",
      businessType: "Distributor",
    },
    products: [
      { name: "Plastic Storage Box", sku: "PB-001", qty: "100 Units", rate: 200, total: 20000 },
      { name: "Kitchen Rack", sku: "KR-002", qty: "40 Units", rate: 300, total: 12000 },
      { name: "Steel Water Bottle", sku: "SB-003", qty: "60 Units", rate: 150, total: 9000 },
      { name: "Lunch Box", sku: "LB-004", qty: "50 Units", rate: 136, total: 6800 },
    ],
    totalValue: 47800,
    bill: {
      totalAmount: 47800,
      discount: 0,
      tax: 0,
      finalAmount: 47800,
    },
    totalProducts: 4,
    totalQuantity: 250,
  },
  {
    id: "SL-928390",
    placedOn: "16 Jun 2026, 04:20 PM",
    status: "Delivered",
    deliveredOn: "20 Jun 2026",
    deliveredLabel: "Delivered on",
    invoiceId: "INV-2026-06-928390",
    supplier: {
      name: "Shree Traders",
      verified: true,
      location: "Madurai, Tamil Nadu",
      gstin: "33ABCDE1234F1Z5",
      businessType: "Wholesaler",
    },
    products: [
      { name: "Wooden Dinner Set", sku: "WD-001", qty: "20 Units", rate: 840, total: 16800 },
      { name: "Stainless Steel Tumbler", sku: "ST-002", qty: "40 Units", rate: 200, total: 8000 },
    ],
    totalValue: 24800,
    bill: {
      totalAmount: 24800,
      discount: 0,
      tax: 0,
      finalAmount: 24800,
    },
    totalProducts: 2,
    totalQuantity: 60,
  },
];

const BUY_AGAIN = [
  { name: "Premium Cotton Shirt", supplier: "ABC Fashion Wholesale", date: "20 Jun 2026", qty: "50 Units" },
  { name: "Denim Jeans", supplier: "ABC Fashion Wholesale", date: "20 Jun 2026", qty: "30 Units" },
  { name: "Sports Shoes", supplier: "ABC Fashion Wholesale", date: "20 Jun 2026", qty: "20 Units" },
];

const RECENT_SUPPLIERS = [
  { name: "ABC Fashion Wholesale", location: "Tirupur, Tamil Nadu", products: "120+ Products" },
  { name: "Global Houseware Ltd.", location: "Delhi, Delhi", products: "80+ Products" },
  { name: "Shree Traders", location: "Madurai, Tamil Nadu", products: "95+ Products" },
  { name: "Kumar Enterprises", location: "Ludhiana, Punjab", products: "70+ Products" },
  { name: "Maha Supply Co.", location: "Mumbai, Maharashtra", products: "110+ Products" },
];

const SORT_OPTIONS = ["Newest First", "Oldest First", "Amount High", "Amount Low"];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatINR = (n) => `₹${n.toLocaleString("en-IN")}`;

function useClickOutside(ref, onOutside) {
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}

/* -------------------------------------------------------------------------- */
/* Sort dropdown                                                              */
/* -------------------------------------------------------------------------- */

function SortDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Newest First");
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[15px] font-[500] leading-[22px] text-slate-700 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50 transition-colors"
      >
        <ArrowUpDown size={15} className="text-slate-400" />
        Sort: {selected}
        <ChevronDown size={15} className="text-slate-400" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-2 w-44 rounded-[14px] bg-white border border-slate-200/80 shadow-[0_12px_32px_rgba(0,0,0,0.09)] p-1.5 z-20"
          >
            <p className="text-[13px] font-[700] leading-[20px] uppercase tracking-[0.08em] text-slate-400 px-2.5 pt-1 pb-1.5">
              Sort By
            </p>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setSelected(opt);
                  setOpen(false);
                }}
                className={`w-full text-left text-[15px] leading-[22px] rounded-lg px-2.5 py-2 transition-colors ${
                  selected === opt
                    ? "bg-rose-50 text-rose-500 font-[600]"
                    : "text-slate-700 font-[500] hover:bg-slate-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Filter dropdown                                                            */
/* -------------------------------------------------------------------------- */

function FilterDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[15px] font-[500] leading-[22px] text-slate-700 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50 transition-colors"
      >
        <Filter size={15} className="text-slate-400" />
        Filter
        <ChevronDown size={15} className="text-slate-400" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-2 w-64 rounded-[14px] bg-white border border-slate-200/80 shadow-[0_12px_32px_rgba(0,0,0,0.09)] p-4 z-20"
          >
            <p className="text-[18px] font-[700] leading-[26px] tracking-[-0.02em] text-slate-900 mb-3">Filters</p>

            <label className="block text-[13px] font-[700] leading-[20px] uppercase tracking-[0.08em] text-slate-400 mb-1.5">
              Supplier
            </label>
            <button className="w-full flex items-center justify-between text-[15px] font-[500] leading-[22px] text-slate-700 rounded-lg border border-slate-200 px-2.5 py-2 mb-3">
              All Suppliers <ChevronDown size={15} className="text-slate-400" />
            </button>

            <label className="block text-[13px] font-[700] leading-[20px] uppercase tracking-[0.08em] text-slate-400 mb-1.5">
              Date Range
            </label>
            <button className="w-full flex items-center justify-between text-[15px] font-[500] leading-[22px] text-slate-700 rounded-lg border border-slate-200 px-2.5 py-2 mb-3">
              Select Range <ChevronDown size={15} className="text-slate-400" />
            </button>

            <label className="block text-[13px] font-[700] leading-[20px] uppercase tracking-[0.08em] text-slate-400 mb-1.5">
              Status
            </label>
            <button className="w-full flex items-center justify-between text-[15px] font-[500] leading-[22px] text-slate-700 rounded-lg border border-slate-200 px-2.5 py-2 mb-4">
              Any Status <ChevronDown size={15} className="text-slate-400" />
            </button>

            <button
              onClick={() => setOpen(false)}
              className="w-full text-[15px] font-[600] leading-[22px] text-white rounded-lg py-2 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500"
            >
              Apply
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Order card                                                                 */
/* -------------------------------------------------------------------------- */

function OrderCard({ order, index, onViewMore }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="rounded-[16px] bg-white border border-slate-200/60 p-4 md:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] mb-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.2fr_0.8fr] gap-5 md:gap-0 items-center">
        
        {/* --- COLUMN 1: Order Details --- */}
        <div className="flex flex-col md:pr-5">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[17px] font-[700] leading-[24px] tracking-[-0.02em] text-slate-900">{order.id}</span>
            <Copy 
              size={15} 
              className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" 
            />
            <span
              className={`inline-block text-[13px] font-[700] leading-[20px] px-2 py-0.5 rounded-md uppercase tracking-[0.06em] ${STATUS_STYLES[order.status]}`}
            >
              {order.status}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-[15px] leading-[22px] text-slate-700">
              <span className="text-[14px] font-[500] leading-[20px] text-slate-400">Placed on:</span> <span className="font-[600]">{order.placedOn}</span>
            </p>
            <p className="text-[15px] leading-[22px] text-slate-700">
              <span className="text-[14px] font-[500] leading-[20px] text-slate-400">
                {order.deliveredLabel || "Delivered on"}:
              </span>{" "}
              <span className="font-[600]">{order.deliveredOn}</span>
            </p>
          </div>
        </div>

        {/* --- COLUMN 2: Supplier Details --- */}
        <div className="flex flex-col md:border-l md:border-slate-100 md:px-6">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[17px] font-[700] leading-[24px] tracking-[-0.02em] text-slate-900">
              {order.supplier.name}
            </span>
            {order.supplier.verified && (
              <BadgeCheck size={16} className="text-blue-500 shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[15px] font-[400] leading-[22px] text-slate-500 mb-1.5">
            <MapPin size={15} className="text-slate-400" />
            <span>{order.supplier.location}</span>
          </div>
          <p className="text-[14px] font-[400] leading-[20px] text-slate-500">
            {order.totalProducts} Items Included
          </p>
        </div>

        {/* --- COLUMN 3: Order Summary & Actions --- */}
        <div className="flex flex-col md:border-l md:border-slate-100 md:pl-6 md:items-end text-left md:text-right mt-2 md:mt-0">
          <p className="text-[14px] font-[500] leading-[20px] text-slate-400 mb-0.5">
            Total Bill Amount
          </p>
          <p className="text-[18px] font-[800] leading-[26px] text-slate-900 mb-3">
            ₹{order.totalValue?.toLocaleString('en-IN') || "0"}
          </p>
          
          <button 
            onClick={() => onViewMore(order)}
            className="w-full md:w-auto h-[36px] flex items-center justify-center gap-1.5 text-[15px] font-[600] leading-[22px] text-white rounded-lg px-5 bg-gradient-to-r from-pink-500 to-orange-500 shadow-sm shadow-orange-500/20 hover:shadow-md hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
          >
            View Details
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Buy again card                                                             */
/* -------------------------------------------------------------------------- */

function BuyAgainCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.15 + index * 0.06 }}
      className="rounded-[16px] bg-white border border-slate-200/80 p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
    >
      <p className="text-[17px] font-[700] leading-[24px] tracking-[-0.02em] text-slate-900 mb-0.5">{item.name}</p>
      <p className="text-[15px] font-[400] leading-[22px] text-slate-500 mb-2">{item.supplier}</p>
      <p className="text-[15px] leading-[22px] text-slate-700 mb-0.5">
        <span className="text-[14px] font-[500] leading-[20px] text-slate-400">Last ordered:</span> <span className="font-[600]">{item.date}</span>
      </p>
      <p className="text-[15px] leading-[22px] text-slate-700 mb-2.5">
        <span className="text-[14px] font-[500] leading-[20px] text-slate-400">Qty:</span> <span className="font-[600]">{item.qty}</span>
      </p>
      <button className="w-full h-[34px] flex items-center justify-center gap-1.5 text-[15px] font-[500] leading-[22px] text-rose-500 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors">
        <RotateCcw size={14} />
        Reorder
      </button>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Order Details Modal                                                        */
/* -------------------------------------------------------------------------- */

function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  const statusStyles = {
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-[18px] font-[700] leading-[26px] tracking-[-0.02em] text-slate-900 flex items-center gap-2.5">
              Order {order.id}
              <span
                className={`inline-flex px-2 py-0.5 rounded-full text-[13px] font-[700] leading-[20px] uppercase tracking-[0.06em] border ${
                  statusStyles[order.status] || "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                {order.status}
              </span>
            </h2>
            <p className="text-[15px] font-[400] leading-[22px] text-slate-500 mt-1">Placed on {order.placedOn}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] mb-6">
            <div>
              <span className="text-[14px] font-[700] leading-[20px] uppercase tracking-[0.08em] text-slate-400 mb-2.5 block">
                Delivery & Invoice
              </span>
              <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-[500] leading-[20px] text-slate-400">{order.deliveredLabel}</span>
                  <span className="text-[15px] font-[600] leading-[22px] text-slate-900">{order.deliveredOn}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-[500] leading-[20px] text-slate-400">Invoice ID</span>
                  <span className="text-[15px] font-[600] leading-[22px] text-slate-900">{order.invoiceId}</span>
                </div>
                <div className="pt-2.5 border-t border-slate-200">
                  <button className="flex items-center justify-center w-full gap-1.5 bg-white border border-slate-200 text-slate-700 text-[15px] font-[500] leading-[22px] rounded-[8px] h-[36px] shadow-sm hover:bg-slate-50 transition-colors">
                    <Download size={16} />
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[14px] font-[700] leading-[20px] uppercase tracking-[0.08em] text-slate-400 mb-2.5 block">
                Seller Details
              </span>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 border border-slate-100">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[17px] font-[700] leading-[24px] tracking-[-0.02em] text-slate-900">{order.supplier.name}</span>
                  {order.supplier.verified && <BadgeCheck size={17} className="text-blue-500" />}
                </div>
                <div className="flex items-center gap-1.5 text-[15px] font-[400] leading-[22px] text-slate-500">
                  <MapPin size={16} className="text-slate-400" />
                  {order.supplier.location}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200">
                  <div>
                    <span className="text-[14px] font-[500] leading-[20px] text-slate-400 block mb-0.5">Business Type</span>
                    <span className="text-[15px] font-[600] leading-[22px] text-slate-900">{order.supplier.businessType}</span>
                  </div>
                  <div>
                    <span className="text-[14px] font-[500] leading-[20px] text-slate-400 block mb-0.5">GSTIN</span>
                    <span className="text-[15px] font-[600] leading-[22px] text-slate-900">{order.supplier.gstin}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <span className="text-[14px] font-[700] leading-[20px] uppercase tracking-[0.08em] text-slate-400 mb-2.5 block">
            Product Details ({order.products.length} Items)
          </span>
          <div className="overflow-x-auto border border-slate-200 rounded-xl mb-6">
            <table className="w-full min-w-[500px] border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[14px] font-[700] leading-[20px] uppercase tracking-[0.08em] text-slate-400">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4 whitespace-nowrap">SKU</th>
                  <th className="py-3 px-4 whitespace-nowrap">Quantity</th>
                  <th className="py-3 px-4 whitespace-nowrap">Rate</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.products.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-[16px] font-[600] leading-[24px] text-slate-900 whitespace-nowrap">
                      {p.name}
                    </td>
                    <td className="py-3 px-4 text-[15px] font-[500] leading-[22px] text-slate-700 whitespace-nowrap">{p.sku}</td>
                    <td className="py-3 px-4 text-[15px] font-[500] leading-[22px] text-slate-700 whitespace-nowrap">{p.qty}</td>
                    <td className="py-3 px-4 text-[15px] font-[500] leading-[22px] text-slate-700 whitespace-nowrap">
                      {formatINR(p.rate)}
                    </td>
                    <td className="py-3 px-4 text-[15px] font-[700] leading-[22px] text-slate-900 text-right whitespace-nowrap">
                      {formatINR(p.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-end">
            <div className="w-full md:w-1/2 lg:w-1/3 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <span className="text-[14px] font-[700] leading-[20px] uppercase tracking-[0.08em] text-slate-400 mb-3 block">
                Bill Summary
              </span>
              <div className="space-y-2.5 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-[500] leading-[20px] text-slate-400">Subtotal Amount</span>
                  <span className="text-[15px] font-[600] leading-[22px] text-slate-700">{formatINR(order.bill.totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-[500] leading-[20px] text-slate-400">Discount</span>
                  <span className="text-[15px] font-[600] leading-[22px] text-slate-700">{formatINR(order.bill.discount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-[500] leading-[20px] text-slate-400">Tax (0%)</span>
                  <span className="text-[15px] font-[600] leading-[22px] text-slate-700">{formatINR(order.bill.tax)}</span>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[18px] font-[700] leading-[26px] tracking-[-0.02em] text-slate-900">Final Bill Amount</span>
                  <span className="text-[18px] font-[800] leading-[26px] text-slate-900">
                    {formatINR(order.bill.finalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main page                                                                  */
/* -------------------------------------------------------------------------- */

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [modalOrder, setModalOrder] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#F8FAFC] ps-4 py-2"
    >
      {/* Hero */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-[24px] font-[800] leading-[28px] tracking-[-0.02em] text-slate-900">
            My Orders
          </h1>
          <p className="text-[15px] font-[400] leading-[22px] text-slate-500 mt-0.5">
            Track and manage all your wholesale orders
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] px-3 py-2 w-full md:w-[280px]">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search orders, suppliers..."
            className="w-full text-[15px] font-[500] leading-[22px] text-slate-900 placeholder:text-[15px] placeholder:font-[400] placeholder:text-slate-400 outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Tabs + filter/sort row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 mb-6 pb-0">
        <div className="flex items-center gap-5 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative flex items-center gap-1.5 pb-2.5 whitespace-nowrap"
            >
              <span
                className={`transition-colors ${
                  activeTab === tab.key
                    ? "text-[15px] font-[600] leading-[22px] text-rose-500"
                    : "text-[15px] font-[500] leading-[22px] text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </span>
              {tab.count !== null && (
                <span
                  className={`text-[13px] font-[600] leading-[20px] px-1.5 py-0.5 rounded-md ${
                    activeTab === tab.key
                      ? "bg-rose-50 text-rose-500"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -bottom-px left-0 right-0 h-[2px] bg-rose-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 pb-2.5 sm:pb-2.5">
          <SortDropdown />
          <FilterDropdown />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-5 items-start">
        {/* Orders list — 75% */}
        <div className="space-y-3.5">
          {ORDERS.map((order, i) => (
            <OrderCard key={order.id} order={order} index={i} onViewMore={setModalOrder} />
          ))}
        </div>

        {/* Buy Again — 25% */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[18px] font-[700] leading-[26px] tracking-[-0.02em] text-slate-900">Buy Again</h2>
            <button className="text-[15px] font-[500] leading-[22px] text-rose-500 hover:text-rose-600">
              View All
            </button>
          </div>
          <div className="space-y-2.5">
            {BUY_AGAIN.map((item, i) => (
              <BuyAgainCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Recently Viewed Suppliers */}
<div className="mt-10">
  {/* Header */}
  <div className="flex items-center justify-between mb-5">
    <div>
      <h2 className="text-[22px] font-[700] tracking-[-0.03em] text-slate-900">
        Recently Viewed Suppliers
      </h2>

      <p className="text-[15px] text-slate-500 mt-1">
        Continue exploring suppliers you've recently visited.
      </p>
    </div>

    <button
      className="
      h-10
      px-4
      rounded-xl
      border
      border-slate-200
      bg-white
      text-[14px]
      font-[600]
      text-slate-700
      hover:bg-slate-50
      hover:shadow-md
      transition-all
    "
    >
      View All
    </button>
  </div>

  {/* Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
    {RECENT_SUPPLIERS.slice(0, 4).map((s, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          delay: i * 0.08,
        }}
        whileHover={{
          y: -6,
        }}
        className="
          group
          relative
          overflow-hidden
          rounded-3xl
          border
          border-slate-200/70
          bg-gradient-to-br
          from-white
          via-white
          to-slate-50
          p-5
          shadow-[0_8px_30px_rgba(15,23,42,0.05)]
          hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]
          transition-all
          duration-300
          cursor-pointer
        "
      >

          <div className="min-w-0">
              <h3 className="truncate text-[18px] font-[700] tracking-[-0.02em] text-slate-900">
                {s.name}
              </h3>

              <p className="mt-1 truncate text-[14px] text-slate-500">
                📍 {s.location}
              </p>

              <p className="mt-3 text-[14px] font-[500] text-slate-600">
                {s.products}
              </p>
            </div>

        {/* Bottom Divider */}
        <div className=" border-t border-slate-100 pt-4 flex items-center justify-between">
          <span className="text-[13px] text-slate-400">
            Viewed Recently
          </span>

          <span className="text-[13px] font-[600] text-rose-500 group-hover:text-rose-600">
            Open Supplier →
          </span>
        </div>
      </motion.div>
    ))}
  </div>
</div>

      {/* Order Details Modal triggered by View Details */}
      <AnimatePresence>
        {modalOrder && <OrderDetailsModal order={modalOrder} onClose={() => setModalOrder(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}