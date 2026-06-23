// SupplierComparison.jsx
// Full File - Properly Aligned and Structured

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Truck,
  Star,
  Phone,
  Eye,
  Zap,
  ShieldCheck,
  Navigation,
  X,
  BadgeCheck,
  Package,
  Clock,
  CheckCircle2
} from "lucide-react";

// ============================================
// CONSTANTS & STYLES
// ============================================

export const CTA_GRAD = "linear-gradient(to right, #EC4899, #F43F5E, #F97316)";

const PROFILE_IMAGE_URL =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150";

// ============================================
// SUPPLIER DATA
// ============================================

const SUPPLIERS = [
  {
    id: 1,
    name: "Reliance Digital B2B",
    location: "Andheri Mumbai",
    distance: 1.2,
    trust: true,
    rating: 4.9,
    delivery: 1,
    business: "Authorized Distributor",
    minimum: { qty: 50, price: 100 },
    bulk: { qty: 100, price: 170 },
    price: 95,
    stock: 850,
    reviews: 1240,
    phone: "+919820012345"
  },
  {
    id: 2,
    name: "TechMart Wholesale",
    location: "Kurla Mumbai",
    distance: 3.8,
    trust: true,
    rating: 4.7,
    delivery: 2,
    business: "Regional Distributor",
    minimum: { qty: 25, price: 80 },
    bulk: { qty: 75, price: 130 },
    price: 88,
    stock: 320,
    reviews: 892,
    phone: "+919876543210"
  },
  {
    id: 3,
    name: "Galaxy Electronics Hub",
    location: "Dharavi Mumbai",
    distance: 5.1,
    trust: true,
    rating: 4.6,
    delivery: 3,
    business: "National Wholesale",
    minimum: { qty: 50, price: 120 },
    bulk: { qty: 150, price: 220 },
    price: 90,
    stock: 1200,
    reviews: 2110,
    phone: "+919900167890"
  },
  {
    id: 4,
    name: "Prime Tech Suppliers",
    location: "Vashi",
    distance: 12,
    trust: false,
    rating: 4.3,
    delivery: 5,
    business: "Reseller",
    minimum: { qty: 20, price: 60 },
    bulk: { qty: 80, price: 120 },
    price: 105,
    stock: 200,
    reviews: 450,
    phone: "+919123456789"
  },
  {
    id: 5,
    name: "Metro Electronics",
    location: "Bandra",
    distance: 6,
    trust: true,
    rating: 4.8,
    delivery: 2,
    business: "Premium Seller",
    minimum: { qty: 30, price: 90 },
    bulk: { qty: 100, price: 150 },
    price: 92,
    stock: 700,
    reviews: 900,
    phone: "+919888888888"
  },
  {
    id: 6,
    name: "Smart Stock Traders",
    location: "Powai",
    distance: 4,
    trust: true,
    rating: 4.9,
    delivery: 1,
    business: "Verified Seller",
    minimum: { qty: 40, price: 95 },
    bulk: { qty: 120, price: 160 },
    price: 91,
    stock: 600,
    reviews: 1300,
    phone: "+919777777777"
  },
  {
    id: 7,
    name: "Digital World",
    location: "Thane",
    distance: 15,
    trust: false,
    rating: 4.2,
    delivery: 5,
    business: "Retail Supplier",
    minimum: { qty: 20, price: 70 },
    bulk: { qty: 60, price: 110 },
    price: 110,
    stock: 300,
    reviews: 300,
    phone: "+919666666666"
  },
  {
    id: 8,
    name: "Electro Hub",
    location: "Navi Mumbai",
    distance: 18,
    trust: true,
    rating: 4.5,
    delivery: 3,
    business: "Wholesale",
    minimum: { qty: 50, price: 130 },
    bulk: { qty: 200, price: 250 },
    price: 98,
    stock: 900,
    reviews: 700,
    phone: "+919555555555"
  },
  {
    id: 9,
    name: "Future Gadgets",
    location: "Worli",
    distance: 9,
    trust: true,
    rating: 4.7,
    delivery: 2,
    business: "Distributor",
    minimum: { qty: 60, price: 140 },
    bulk: { qty: 150, price: 230 },
    price: 94,
    stock: 500,
    reviews: 600,
    phone: "+919444444444"
  },
  {
    id: 10,
    name: "Alpha Traders",
    location: "Colaba",
    distance: 20,
    trust: false,
    rating: 4.1,
    delivery: 6,
    business: "Supplier",
    minimum: { qty: 10, price: 50 },
    bulk: { qty: 50, price: 90 },
    price: 115,
    stock: 150,
    reviews: 200,
    phone: "+919333333333"
  }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

const money = value => "₹" + value.toLocaleString("en-IN");

// ============================================
// COMPONENTS
// ============================================

function Rank({ number }) {
  const styles = {
    1: "bg-gradient-to-br from-yellow-300 to-amber-500 text-yellow-900 shadow-yellow-200",
    2: "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-700 shadow-slate-200",
    3: "bg-gradient-to-br from-orange-300 to-orange-500 text-orange-900 shadow-orange-200"
  };

  return (
    <div
      className={`
        w-9 h-9 rounded-full flex items-center justify-center
        font-bold text-sm shadow-md
        ${
          styles[number] ||
          "bg-slate-100 text-slate-500 border border-slate-200"
        }
      `}
    >
      {number}
    </div>
  );
}

// ============================================
// SUPPLIER DETAILS MODAL
// ============================================

function SupplierDetailsModal({ supplier, close }) {
  if (!supplier) return null;

  const saving = supplier.bulk.price - supplier.minimum.price * 2;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="
          fixed
          inset-0
          z-50
          bg-black/40
          backdrop-blur-sm
          flex
          items-center
          justify-center
          p-5
        "
        onClick={close}
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.85,
            y: 40
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.85
          }}
          transition={{
            type: "spring",
            duration: 0.5
          }}
          onClick={e => e.stopPropagation()}
          className="
            w-full
            max-w-xl
            bg-white
            rounded-3xl
            shadow-2xl
            border
            border-slate-200
            overflow-hidden
          "
        >
          <div className="p-6 flex justify-between items-center border-b">
            <div className="flex gap-3">
              <img
                src={PROFILE_IMAGE_URL}
                className="w-14 h-14 rounded-2xl object-cover"
                alt={supplier.name}
              />
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Boomathi
                </h2>
                <p className="text-sm text-slate-400">{supplier.business}</p>
              </div>
            </div>
            <button
              onClick={close}
              className="p-2 rounded-xl hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-xs text-slate-400">Rating</p>
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                  <Star size={15} fill="currentColor" />
                  {supplier.rating}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-xs text-slate-400">Stock Available</p>
                <b>{supplier.stock} Units</b>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <p>
                <MapPin size={16} className="inline mr-2" />
                {supplier.location}
              </p>
              <p>
                <Truck size={16} className="inline mr-2" />
                Delivery {supplier.delivery} days
              </p>
              <p>
                <Package size={16} className="inline mr-2" />
                Minimum Order {supplier.minimum.qty} KG
              </p>
              <p>
                {supplier.trust && (
                  <BadgeCheck size={16} className="inline mr-2 text-emerald-500" />
                )}
                Verified Supplier
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-3">Price Comparison</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded-2xl p-4">
                  <p className="text-xs text-slate-400">Minimum</p>
                  <b>{supplier.minimum.qty} KG</b>
                  <p className="text-blue-600 font-bold">
                    {money(supplier.minimum.price)}
                  </p>
                </div>
                <div className="border rounded-2xl p-4">
                  <p className="text-xs text-slate-400">Bulk Deal</p>
                  <b>{supplier.bulk.qty} KG</b>
                  <p className="text-blue-600 font-bold">
                    {money(supplier.bulk.price)}
                  </p>
                  <p className="text-xs text-emerald-600 font-semibold">
                    Save ₹{saving}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={`tel:${supplier.phone}`}
                style={{
                  background: CTA_GRAD
                }}
                className="
                  flex-1
                  py-3
                  rounded-xl
                  text-white
                  text-center
                  font-semibold
                "
              >
                <Phone size={16} className="inline mr-2" />
                Call Supplier
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================
// SUPPLIER ROW COMPONENT
// ============================================

function SupplierRow({ s, index, onView }) {
  const saving = s.bulk.price - s.minimum.price * 2;

  return (
    <motion.tr
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        delay: index * 0.05
      }}
      className="border-b border-slate-100 hover:bg-slate-50 transition"
    >
      <td className="p-5">
        <Rank number={index + 1} />
      </td>

      <td className="p-5">
        <div className="flex items-center gap-3">
          <img
            src={PROFILE_IMAGE_URL}
            className="w-11 h-11 rounded-xl object-cover"
            alt={s.name}
          />
          <div>
            <p className="font-semibold text-sm text-slate-900">{s.name}</p>
            <p className="text-xs text-slate-400">{s.business}</p>
          </div>
        </div>
      </td>

      <td className="p-4 text-sm">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          {s.location}
        </div>
        <p className="text-xs text-slate-400">{s.distance} km away</p>
      </td>

      <td className="p-4">
        <p className="font-semibold">{s.minimum.qty} KG</p>
        <p className="text-blue-600 font-bold">{money(s.minimum.price)}</p>
      </td>

      <td className="p-4">
        <p className="font-bold text-slate-900">{money(s.price)}/KG</p>
      </td>

      <td className="p-4">
        <p className="font-semibold">{s.bulk.qty} KG</p>
        <p className="text-blue-600 font-bold">{money(s.bulk.price)}</p>
        <span className="text-xs text-emerald-600 font-semibold">
          Save ₹{saving}
        </span>
      </td>

      <td className="p-4">
        <div className="flex items-center gap-1 text-yellow-500 font-semibold">
          <Star size={14} fill="currentColor" />
          {s.rating}
        </div>
        <p className="text-xs text-slate-400">{s.reviews} reviews</p>
      </td>

      <td className="p-4">
        <div className="flex items-center gap-1 text-sm">
          <Truck size={14} />
          {s.delivery} days
        </div>
      </td>

      <td className="p-4">
        <div className="flex gap-2">
          <button
            onClick={() => onView(s)}
            className="
              px-4
              py-2
              rounded-xl
              text-xs
              font-semibold
              flex
              items-center
              gap-1
              text-white
              shadow-sm
            "
            style={{
              background: CTA_GRAD
            }}
          >
            <Eye size={14} />
            View
          </button>
          <a
            href={`tel:${s.phone}`}
            className="
              px-4
              py-2
              rounded-xl
              text-xs
              font-semibold
              bg-slate-900
              text-white
              flex
              items-center
              gap-1
            "
          >
            <Phone size={14} />
            Call
          </a>
        </div>
      </td>
    </motion.tr>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function SupplierComparison() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const filters = [
    ["near", "Nearby", Navigation],
    ["cheap", "Cheapest", Zap],
    ["trust", "Trusted Seller", ShieldCheck],
    ["rating", "Top Rating", Star],
    ["fast", "Fast Delivery", Truck]
  ];

  const data = useMemo(() => {
    let result = [...SUPPLIERS];

    if (search) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "near") {
      result.sort((a, b) => a.distance - b.distance);
    }

    if (filter === "cheap") {
      result.sort((a, b) => a.price - b.price);
    }

    if (filter === "trust") {
      result = result.filter(item => item.trust);
    }

    if (filter === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (filter === "fast") {
      result.sort((a, b) => a.delivery - b.delivery);
    }

    return result;
  }, [search, filter]);

  return (
    <>
      <SupplierDetailsModal
        supplier={selectedSupplier}
        close={() => setSelectedSupplier(null)}
      />

      <div
        className="
          bg-white
          rounded-[32px]
          border
          border-slate-200
          shadow-[0_25px_70px_rgba(15,23,42,0.08)]
          p-5
          md:p-8
          transition-all
        "
      >
        <div
          className="
            flex
            flex-col
            lg:flex-row
            justify-between
            gap-5
            mb-7
          "
        >
          <div>
            <h2
              className="
                text-xl
                md:text-2xl
                font-bold
                text-slate-900
              "
            >
              Supplier Comparison
            </h2>
            <p
              className="
                text-sm
                text-slate-400
                mt-1
              "
            >
              Compare pricing, trust and delivery from verified suppliers
            </p>
          </div>

          <div
            className="
              relative
              w-full
              lg:w-[360px]
            "
          >
            <Search
              size={18}
              className="
                absolute
                left-4
                top-3.5
                text-slate-400
              "
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search supplier, location..."
              className="
                w-full
                pl-11
                pr-5
                py-3.5
                rounded-2xl
                border
                border-slate-200
                outline-none
                bg-white
                text-sm
                focus:ring-4
                focus:ring-pink-100
                transition
              "
            />
          </div>
        </div>

        <div
          className="
            flex
            gap-3
            overflow-x-auto
            pb-5
          "
        >
          {filters.map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`
                flex
                items-center
                gap-2
                px-5
                py-2.5
                rounded-full
                border
                text-sm
                font-semibold
                whitespace-nowrap
                transition-all
                duration-300
                ${
                  filter === id
                    ? "text-white shadow-lg scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }
              `}
              style={
                filter === id
                  ? {
                      background: CTA_GRAD
                    }
                  : {}
              }
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        <div
          className="
            rounded-3xl
            border
            border-slate-200
            overflow-hidden
            bg-white
            shadow-[0_15px_45px_rgba(15,23,42,0.06)]
          "
        >
          <div
            className="
              overflow-x-auto
              overflow-y-auto
              max-h-[620px]
              [&::-webkit-scrollbar]:hidden
              [-ms-overflow-style:none]
              [scrollbar-width:none]
            "
          >
            <table className="min-w-[1250px] w-full">
              <thead>
                <tr
                  className="
                    bg-slate-50
                    text-[11px]
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  {[
                    "Rank",
                    "Supplier",
                    "Location",
                    "Min.Qty & Price",
                    "Your.Qty Price",
                    "Bulk.Qty & Saving",
                    "Rating",
                    "Delivery",
                    "Action"
                  ].map(title => (
                    <th
                      key={title}
                      className="p-4 text-left font-semibold"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 6).map((s, index) => (
                  <SupplierRow
                    key={s.id}
                    s={s}
                    index={index}
                    onView={setSelectedSupplier}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}