import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Search, MapPin, ChevronDown, ShieldCheck, 
  Star, Clock, Award, Package, SlidersHorizontal, 
  Box, Truck, CheckCircle2, Building2
} from 'lucide-react';

/* ----------------------------------------------------------------------- */
/* DESIGN TOKENS — Enterprise B2B SaaS System                              */
/* ----------------------------------------------------------------------- */

export const CTA_GRAD = 'linear-gradient(to right, #EC4899, #F43F5E, #F97316)';

const C = {
  bgBase: "#FAFAFA",
  bgSurface: "#FFFFFF",
  border: "#E4E4E7", 
  textPrimary: "#09090B", 
  textSecondary: "#52525B", 
  textMuted: "#A1A1AA", 
  brand: "#09090B",
  brandHover: "#27272A",
  success: "#059669",
  successSoft: "#D1FAE5",
  warning: "#D97706",
  warningSoft: "#FEF3C7",
  blue: "#2563EB",
  pinkSoft: "#FDF2F8", 
  pinkBorder: "#FBCFE8",
  shadowSoft: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)", 
  shadowHover: "0 10px 25px -5px rgba(244, 63, 94, 0.15), 0 8px 10px -6px rgba(244, 63, 94, 0.1)",
};

const FONTS = {
  main: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

function useGoogleFonts() {
  useEffect(() => {
    if (document.getElementById("sl-fonts-b2b")) return;
    const link = document.createElement("link");
    link.id = "sl-fonts-b2b";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── MOCK DATA (Augmented for B2B) ──────────────────────────────────────────

const MOCK_SUPPLIERS = [
  {
    id: 1,
    name: "Apex Electronics Mfg.",
    category: "Electronics & Appliances",
    location: "Andheri East, Mumbai",
    coords: [19.1136, 72.8697],
    distance: "1.2 km",
    rating: 4.8,
    reviews: 124,
    verification: ["GST Verified", "Top Supplier"],
    experience: "12 Yrs",
    orders: "10k+",
    responseTime: "< 5 min",
    status: "Available",
    avatar: "https://picsum.photos/seed/apex/150",
    readyStock: true,
    moq: "50 Units",
    deliveryEstimate: "1-2 Days",
    products: [
      { name: "Smartphones", image: "https://picsum.photos/seed/p1/100" },
      { name: "Adapters", image: "https://picsum.photos/seed/p2/100" },
      { name: "Cables", image: "https://picsum.photos/seed/p3/100" },
      { name: "Sensors", image: "https://picsum.photos/seed/p4/100" }
    ]
  },
  {
    id: 2,
    name: "Zenith Textiles Ltd.",
    category: "Apparel & Fabrics",
    location: "Lower Parel, Mumbai",
    coords: [18.9953, 72.8258],
    distance: "3.5 km",
    rating: 4.6,
    reviews: 89,
    verification: ["Business Verified"],
    experience: "8 Yrs",
    orders: "5k+",
    responseTime: "15 min",
    status: "Available",
    avatar: "https://picsum.photos/seed/zenith/150",
    readyStock: true,
    moq: "200 Meters",
    deliveryEstimate: "3-5 Days",
    products: [
      { name: "Cotton", image: "https://picsum.photos/seed/p5/100" },
      { name: "Denim", image: "https://picsum.photos/seed/p6/100" },
      { name: "Silk Blends", image: "https://picsum.photos/seed/p7/100" }
    ]
  },
  {
    id: 3,
    name: "Global Pack Solutions",
    category: "Packaging Materials",
    location: "Kurla Industrial, Mumbai",
    coords: [19.0726, 72.8845],
    distance: "4.1 km",
    rating: 4.9,
    reviews: 312,
    verification: ["GST Verified", "ISO 9001"],
    experience: "15 Yrs",
    orders: "25k+",
    responseTime: "10 min",
    status: "Busy",
    avatar: "https://picsum.photos/seed/globalpack/150",
    readyStock: false,
    moq: "1000 Pcs",
    deliveryEstimate: "7 Days",
    products: [
      { name: "Corrugated", image: "https://picsum.photos/seed/p9/100" },
      { name: "Bubble Wrap", image: "https://picsum.photos/seed/p10/100" },
      { name: "Tape Rolls", image: "https://picsum.photos/seed/p11/100" }
    ]
  },
  {
    id: 4,
    name: "Nexus Hardware Co.",
    category: "Industrial Hardware",
    location: "Saki Naka, Mumbai",
    coords: [19.0962, 72.8877],
    distance: "2.4 km",
    rating: 4.7,
    reviews: 215,
    verification: ["ISO 9001", "GST Verified"],
    experience: "20 Yrs",
    orders: "50k+",
    responseTime: "1 hr",
    status: "Available",
    avatar: "https://picsum.photos/seed/nexus/150",
    readyStock: true,
    moq: "100 Units",
    deliveryEstimate: "1 Day",
    products: [
      { name: "Fasteners", image: "https://picsum.photos/seed/p12/100" },
      { name: "Hand Tools", image: "https://picsum.photos/seed/p13/100" },
      { name: "Power Drills", image: "https://picsum.photos/seed/p14/100" }
    ]
  }
];

// ─── MAP UTILITIES ──────────────────────────────────────────────────────

const createCustomIcon = (seller) => {
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `
      <div class="relative group cursor-pointer transition-transform hover:scale-105 duration-300 z-50">
        <div class="w-9 h-9 rounded-md border border-zinc-200 overflow-hidden bg-white shadow-sm flex items-center justify-center transition-all group-hover:border-blue-500">
          <img src="${seller.avatar}" class="w-full h-full object-cover" alt="logo" />
        </div>
        ${seller.readyStock ? `<div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-600 rounded-full border-2 border-white shadow-sm"></div>` : ''}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
};

const userIcon = L.divIcon({
  className: 'bg-transparent',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-6 h-6 bg-blue-600 rounded-full opacity-20 animate-ping"></div>
      <div class="relative w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm bg-blue-600"></div>
    </div>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────

const PrimaryButton = ({ children, className = "", ...props }) => (
  <motion.button
    whileHover={{ 
      y: -1, 
      scale: 1.01, 
      boxShadow: "0 6px 15px -3px rgba(244, 63, 94, 0.3)" 
    }}
    whileTap={{ scale: 0.98 }}
    style={{ background: CTA_GRAD }}
    className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-md shadow-sm transition-all border-none ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

const SecondaryButton = ({ children, className = "", ...props }) => (
  <motion.button
    whileHover={{ 
      y: -1, 
      backgroundColor: C.pinkSoft, 
      borderColor: "#F43F5E", 
      color: "#E11D48",
      boxShadow: "0 2px 8px rgba(244, 63, 94, 0.05)"
    }}
    whileTap={{ scale: 0.98 }}
    className={`inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-zinc-700 text-sm font-medium rounded-md border border-zinc-200 shadow-sm transition-all duration-200 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

const Badge = ({ children, variant = "default", icon: Icon }) => {
  const variants = {
    default: "bg-zinc-100 text-zinc-700 border-zinc-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    brand: "bg-pink-50 text-pink-600 border-pink-200"
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold border rounded-md ${variants[variant]}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

const NearbySellerHeader = () => (
  <div className="pb-4 md:pb-5 w-full flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4 border-b border-zinc-200 bg-white px-4 md:px-6">
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
        <Building2 size={24} className="text-[#F43F5E]" />
        Nearby Seller Network
      </h1>
      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs md:text-sm text-zinc-500 font-medium">
        <span className="flex items-center gap-1"><MapPin size={14} className="text-[#F43F5E]" /> Mumbai</span>
        <span className="hidden md:inline">•</span>
        <span className="bg-zinc-50 px-2 py-0.5 border border-zinc-100 rounded-md">10 km radius</span>
        <span className="hidden md:inline">•</span>
        <span className="text-zinc-700 font-semibold">1,248 Verified Suppliers</span>
      </div>
    </motion.div>
    <motion.div 
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-wrap items-center gap-2"
    >
      {["Electronics", "Packaging", "Hardware", "Textiles"].map((cat) => (
        <span key={cat} className="px-3 py-1 bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs font-medium rounded-full cursor-pointer hover:bg-[#FDF2F8] hover:text-[#F43F5E] hover:border-[#FBCFE8] transition-all duration-200 shadow-sm">
          {cat}
        </span>
      ))}
    </motion.div>
  </div>
);

const SellerSearchToolbar = () => (
  <div className="flex flex-col lg:flex-row gap-3 items-center justify-between py-3 px-4 md:px-6 bg-white border-b border-zinc-200 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/90">
    <div className="relative w-full lg:max-w-md flex-shrink-0 group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#F43F5E] transition-colors" size={16} />
      <input 
        type="text" 
        placeholder="Search sellers, products, categories..." 
        className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#F43F5E] focus:border-[#F43F5E] transition-all shadow-inner"
      />
    </div>
    <SellerFilters />
  </div>
);

const SellerFilters = () => {
  const filters = ["Category", "Distance", "Verified", "Ready Stock", "Rating", "Response Time"];
  return (
    <div className="flex items-center gap-2 md:gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar pb-1 lg:pb-0">
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white text-sm font-medium rounded-md shadow-sm hover:bg-zinc-800 flex-shrink-0 transition-colors"
      >
        <SlidersHorizontal size={14} /> Filters
      </motion.button>
      <div className="h-5 w-px bg-zinc-200 hidden lg:block mx-1"></div>
      {filters.map((f) => (
        <motion.button 
          key={f} 
          whileHover={{ y: -1, backgroundColor: "#FDF2F8", borderColor: "#FBCFE8", color: "#E11D48" }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-600 text-sm font-medium rounded-md flex-shrink-0 transition-all shadow-sm"
        >
          {f} <ChevronDown size={14} className="opacity-70" />
        </motion.button>
      ))}
      <div className="ml-auto flex items-center gap-2 pl-2 flex-shrink-0">
        <span className="text-xs text-zinc-500 font-medium hidden sm:inline">Sort:</span>
        <button className="flex items-center gap-1 text-sm font-semibold text-zinc-900 hover:text-[#F43F5E] transition-colors">
          Recommended <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
};

const SellerCard = ({ supplier, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ 
        scale: 1.002, 
        borderColor: "#FBCFE8", 
        boxShadow: "0 8px 20px -6px rgba(244, 63, 94, 0.12)" 
      }}
      className="bg-white border border-zinc-200 rounded-lg p-4 md:p-5 shadow-sm mb-4 flex flex-col gap-3.5 relative overflow-hidden group transition-all duration-300"
    >
      {/* Decorative gradient strip on hover */}
      <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[#EC4899] via-[#F43F5E] to-[#F97316] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3 md:gap-4">
          <motion.div whileHover={{ scale: 1.05 }} className="relative flex-shrink-0">
            <img src={supplier.avatar} alt={supplier.name} className="w-12 h-12 md:w-14 md:h-14 rounded-md border border-zinc-200 object-cover shadow-sm group-hover:border-[#FBCFE8] transition-colors" />
            {supplier.readyStock && <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-px shadow-sm"><CheckCircle2 size={12} className="text-emerald-500 fill-emerald-100" /></div>}
          </motion.div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h3 className="text-base font-bold text-zinc-900 leading-tight group-hover:text-[#E11D48] transition-colors">{supplier.name}</h3>
              {supplier.readyStock && <Badge variant="success">Ready Stock</Badge>}
            </div>
            <p className="text-xs text-zinc-500 font-medium mb-1.5">{supplier.category}</p>
            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-2 text-xs">
              <span className="flex items-center gap-1 text-zinc-600"><MapPin size={12} className="text-zinc-400"/> {supplier.location} ({supplier.distance})</span>
              <span className="text-zinc-300 hidden sm:inline">•</span>
              <span className="flex items-center gap-1 text-zinc-900 font-semibold"><Star size={12} className="fill-amber-400 text-amber-400" /> {supplier.rating} <span className="text-zinc-500 font-normal">({supplier.reviews})</span></span>
              <span className="text-zinc-300 hidden sm:inline">•</span>
              <div className="flex gap-2">
                {supplier.verification.map((v, i) => (
                  <span key={i} className="flex items-center gap-1 text-blue-700 font-medium"><ShieldCheck size={12} /> {v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="text-left sm:text-right flex-shrink-0 mt-1 sm:mt-0">
          <p className="text-[11px] font-semibold text-emerald-600 mb-0.5 flex items-center sm:justify-end gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>{supplier.status}</p>
          <p className="text-[11px] text-zinc-500 flex items-center sm:justify-end gap-1"><Clock size={10}/> Replies in {supplier.responseTime}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-3 border-y border-zinc-100">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium"><Award size={12} className="text-zinc-400"/> Experience</span>
          <span className="text-sm font-semibold text-zinc-900">{supplier.experience}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium"><Package size={12} className="text-zinc-400"/> Orders Fulfilled</span>
          <span className="text-sm font-semibold text-zinc-900">{supplier.orders}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium"><Box size={12} className="text-zinc-400"/> Min. Order (MOQ)</span>
          <span className="text-sm font-semibold text-zinc-900">{supplier.moq}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium"><Truck size={12} className="text-zinc-400"/> Est. Delivery</span>
          <span className="text-sm font-semibold text-zinc-900">{supplier.deliveryEstimate}</span>
        </div>
      </div>

      {/* Products & Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 mt-0.5">
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {supplier.products.map((prod, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ y: -2, scale: 1.05, boxShadow: "0 4px 10px -2px rgba(244,63,94,0.15)" }}
              className="group/prod relative border border-zinc-200 rounded-md overflow-hidden w-12 h-12 cursor-pointer flex-shrink-0"
            >
              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover transition-transform duration-300 group-hover/prod:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover/prod:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-1">
                <span className="text-[9px] text-white font-medium text-center leading-tight px-1 drop-shadow-sm">{prod.name}</span>
              </div>
            </motion.div>
          ))}
          <motion.div 
            whileHover={{ backgroundColor: "#FDF2F8", color: "#F43F5E", borderColor: "#FBCFE8" }}
            className="border border-dashed border-zinc-300 rounded-md w-12 h-12 flex items-center justify-center text-xs text-zinc-500 font-medium cursor-pointer transition-all flex-shrink-0"
          >
            +12
          </motion.div>
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <SecondaryButton className="flex-1 lg:flex-none">View Profile</SecondaryButton>
          <PrimaryButton className="flex-1 lg:flex-none shadow-[0_2px_10px_0_rgb(244,63,94,0.2)] hover:shadow-[0_4px_15px_rgba(244,63,94,0.3)]">
            Contact Seller
          </PrimaryButton>
        </div>
      </div>
    </motion.div>
  );
};

const SellerList = () => (
  <div className="flex flex-col">
    <AnimatePresence>
      {MOCK_SUPPLIERS.map((supplier, index) => (
        <SellerCard key={supplier.id} supplier={supplier} index={index} />
      ))}
    </AnimatePresence>
  </div>
);

const StickySellerMap = ({ center, sellers }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[calc(100vh-140px)] rounded-lg overflow-hidden border border-zinc-200 shadow-sm relative sticky top-[120px] group"
    >
      <MapContainer center={center} zoom={13} className="w-full h-full z-0" zoomControl={false} attributionControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        <Marker position={center} icon={userIcon} />
        {/* Kept Circle strictly Blue as requested */}
        <Circle 
          center={center} 
          radius={4000} 
          pathOptions={{ color: '#2563EB', fillColor: '#2563EB', fillOpacity: 0.04, weight: 1.5 }} 
        />
        {sellers.map((seller) => (
          <Marker key={seller.id} position={seller.coords} icon={createCustomIcon(seller)}>
            <Popup className="rounded-md shadow-md border-none custom-popup-b2b">
              <div className="p-2 min-w-[180px]">
                <h4 className="text-sm font-bold text-zinc-900 mb-0.5">{seller.name}</h4>
                <p className="text-[11px] text-zinc-500 font-medium mb-2">{seller.category}</p>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-2">
                  <span className="text-xs font-semibold text-zinc-900">{seller.distance}</span>
                  <span className="text-xs font-bold text-zinc-900 flex items-center gap-1">
                    <Star size={10} className="fill-amber-400 text-amber-400" /> {seller.rating}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapController center={center} />
      </MapContainer>
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md shadow-sm border border-zinc-200 transition-transform group-hover:scale-[1.02]">
        <p className="text-xs font-semibold text-zinc-900 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Map View
        </p>
      </div>
    </motion.div>
  );
};

// ─── MAIN PAGE COMPONENT ────────────────────────────────────────────────

export default function NearbySellerDiscoveryPage() {
  useGoogleFonts();
  const mapCenter = [19.0760, 72.8777];

  return (
    <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: FONTS.main }}>
      {/* Enterprise Header Area */}
      <NearbySellerHeader />
      <SellerSearchToolbar />

      {/* Main Content Layout */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT: Seller Results (70%) */}
          <div className="w-full lg:w-[65%] xl:w-[70%]">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-1.5">
                Found <span className="text-[#F43F5E]">{MOCK_SUPPLIERS.length}</span> suppliers near you
              </h2>
            </div>
            <SellerList />
          </div>

          {/* RIGHT: Sticky Map (30%) */}
          <div className="hidden lg:block lg:w-[35%] xl:w-[30%] relative">
            <StickySellerMap center={mapCenter} sellers={MOCK_SUPPLIERS} />
          </div>

        </div>
      </div>
      
      {/* Custom styles needed for Leaflet overrides and hiding scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-popup-b2b .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1), 0 2px 6px -2px rgba(0, 0, 0, 0.06);
          border: 1px solid #E4E4E7;
          overflow: hidden;
        }
        .custom-popup-b2b .leaflet-popup-content {
          margin: 0;
          font-family: 'Inter', sans-serif;
        }
        .custom-popup-b2b .leaflet-popup-tip {
          background: white;
          border-left: 1px solid #E4E4E7;
          border-top: 1px solid #E4E4E7;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}