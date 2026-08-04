import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, ChevronDown, ShieldCheck, 
  Star, Clock, Award, Package, SlidersHorizontal, 
  Truck, CheckCircle2, Building2, Loader2, LayoutGrid, X
} from 'lucide-react';
import { typographyStyles } from '../Compare_Price/config/constants';
import { networkApi } from '../Authentication/services/api';
import { categoryApi} from '../Shopkeeper_Home/Services/api'
import { useAuth } from '../Authentication/context/AuthContext';

// --- PREMIUM COMPONENTS IMPORTS ---
import { PremiumToast } from "../components/PremiumToast";
import { DataFetchError } from "../components/DataFetchError";

// ============================================================
// IMAGE UTILS FOR CATEGORIES
// ============================================================
const subcategoryImages = import.meta.glob(
  "../assets/subcategories/*", 
  { eager: true, import: "default" }
);

const getSubcategoryImageUrl = (imageName) => {
  if (!imageName) return null;
  if (imageName.startsWith('http') || imageName.startsWith('data:')) return imageName;
  
  const matchingKey = Object.keys(subcategoryImages).find(key => key.includes(imageName));
  return matchingKey ? subcategoryImages[matchingKey] : null;
};

export const CTA_GRAD = 'linear-gradient(to right, #EC4899, #F43F5E, #F97316)';

const DISTRICT_CENTERS = {
  "Chennai": [13.0827, 80.2707],
  "Salem": [11.6643, 78.1460],
  "Coimbatore": [11.0168, 76.9558],
  "Pudukottai": [10.3797, 78.8205],
  "Thiruvarur": [10.7725, 79.6363]
};

const getSafeCenter = (coord) => {
  if (Array.isArray(coord) && coord.length >= 2) {
    const lat = parseFloat(coord[0]);
    const lng = parseFloat(coord[1]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }
  return [13.0827, 80.2707];
};

const createCustomIcon = (supplier) => {
  const initial = supplier.name ? supplier.name.charAt(0).toUpperCase() : "S";
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `<div class="relative group cursor-pointer transition-transform hover:scale-105 duration-300 z-50"><div class="w-10 h-10 rounded-xl border border-pink-200 overflow-hidden bg-white shadow-lg flex items-center justify-center font-['Manrope',_sans-serif] font-extrabold text-lg text-white" style="background: ${CTA_GRAD}">${initial}</div></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -45]
  });
};

const userIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div class="relative flex items-center justify-center"><div class="absolute w-8 h-8 bg-blue-600 rounded-full opacity-30 animate-ping"></div><div class="relative w-4 h-4 rounded-full border-[3px] border-white shadow-md bg-blue-600"></div></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => { 
    const safeCoords = getSafeCenter(center);
    map.flyTo(safeCoords, 13, { duration: 1.5 }); 
  }, [center, map]);
  return null;
};

const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay } });

// Upgraded Filter Dropdown for SaaS feel
const FilterDropdown = ({ label, options, value, onChange }) => (
  <div className="relative inline-flex flex-shrink-0">
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className={`appearance-none pl-3.5 pr-9 py-2 border text-[13px] font-bold rounded-xl shadow-sm outline-none cursor-pointer transition-all duration-200 min-w-[140px]
      ${value ? 'bg-indigo-50 border-indigo-200 text-indigo-700 focus:ring-2 focus:ring-indigo-500/20' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 focus:border-slate-300'}`}
    >
      <option value="">{label}</option>
      {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
    </select>
    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${value ? 'text-indigo-600' : 'text-slate-400'}`} size={16} />
  </div>
);

// ===============================================
// ✅ ROLE-BASED SELLER CARD (UNTOUCHED)
// ===============================================
const SellerCard = ({ supplier, index, userRole, showNotification, onShowMore }) => {
  const navigate = useNavigate();
  const name = supplier.name || "Unnamed Business";
  const initial = name.charAt(0).toUpperCase();
  const verified = supplier.verification?.includes("Business Verified") || supplier.verificationStatus === "VERIFIED";
  
  const [connectStatus, setConnectStatus] = useState(supplier.connectionStatus || 'NONE');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (isConnecting) return; 
    setIsConnecting(true);
    try {
      await networkApi.requestConnection(supplier.id);
      setConnectStatus('PENDING');
      showNotification('success', 'Connection request sent successfully!');
    } catch (err) { 
      console.error(err); 
      showNotification('error', 'Failed to send connection request.');
    } 
    finally { setIsConnecting(false); }
  };

  const handleMessageClick = () => {
    navigate('/message', {
      state: {
        partnerToMessage: {
          id: supplier.userId || supplier.id,
          name: supplier.name,
          businessName: supplier.category,
          profileImage: null
        }
      }
    });
  };

  const handleViewProfile = () => {
    const profileId = supplier.businessProfileId || supplier.id;
    if (profileId) {
      navigate(`/storefront/${profileId}`);
    } else {
      console.error("Missing business profile reference.");
    }
  };

  const displaySubs = supplier.subCategories?.slice(0 , 5) || [];
  const remainingCount = (supplier.totalSubCategories || 0) - displaySubs.length;

  return (
    <motion.div {...fadeUp(index * 0.05)} className="bg-white border border-slate-200 rounded-[20px] p-3 md:p-4 shadow-sm hover:shadow-md hover:border-slate-300 mb-4 flex flex-col gap-4 relative overflow-hidden group transition-all duration-300 cursor-pointer">
      
      <div className="flex items-start gap-4 md:gap-5 w-full">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl shadow-sm flex items-center justify-center font-['Manrope',_sans-serif] font-extrabold text-2xl text-white border border-pink-100" style={{ background: CTA_GRAD }}>{initial}</div>
          {verified && <div className="absolute -bottom-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow-sm border border-slate-100"><CheckCircle2 size={16} className="text-[#17B26A] fill-[#ECFDF3]" /></div>}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2 w-full mb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-zora text-[16px] sm:text-[18px] font-extrabold text-gray-700 leading-tight transition-colors">{name}</h3>
              {supplier.readyStock && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold border rounded-md bg-amber-50 text-amber-700 border-amber-200 uppercase tracking-widest flex-shrink-0">Ready Stock</span>}
              {connectStatus === 'CONNECTED' && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold border rounded-md bg-[#ECFDF3] text-[#067647] border-[#DCFAE6] uppercase tracking-widest flex-shrink-0">Connected</span>}
            </div>
            
            <div className="flex-shrink-0 text-right mt-0.5 hidden sm:block">
              <p className="text-[12px] font-sora font-medium text-slate-500 flex items-center justify-end gap-1.5 whitespace-nowrap">
                <Clock size={12} className="text-slate-500"/> Replies in {supplier.responseTime || "< 1 hr"}
              </p>
            </div>
          </div>
          
          <p className="text-[13px] text-slate-500 font-sora font-medium mb-2">{supplier.category || "General Business"}</p>
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-2.5 text-[13px]">
            <span className="flex items-center gap-1 font-sora font-medium text-slate-600"><MapPin size={14} className="text-slate-400"/> {supplier.location} ({supplier.distance})</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-black font-extrabold"><Star size={14} className="fill-amber-400 text-amber-400" /> {supplier.rating > 0 ? supplier.rating : "New"} <span className="text-slate-400 font-medium font-['Inter',_sans-serif]">({supplier.reviews || 0})</span></span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="hidden md:flex gap-2">{verified && <span className="flex items-center gap-1.5 text-[#17B26A] font-bold"><ShieldCheck size={14} /> Business Verified</span>}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-row 2xl:mx-[20px] overflow-x-auto no-scrollbar md:grid md:grid-cols-4 gap-5 md:gap-4 py-4 border-y border-slate-100 w-full items-center">
        {userRole === 'SHOPKEEPER' ? (
          <>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max">
              <span className="text-[10px] sm:text-[11px] font-sora font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><Award size={12} className="hidden md:block"/> Experience</span>
              <span className="text-[14px] sm:text-[15px] font-sora font-semibold">{supplier.experience || "New"}</span>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><Package size={12} className="hidden md:block"/> Orders</span>
              <span className="font-['Manrope',_sans-serif] text-[14px] sm:text-[15px] font-sora font-semibold">{supplier.orders || "New"}</span>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><MapPin size={12} className="hidden md:block"/> Delivery Radius</span>
              <span className="font-['Manrope',_sans-serif] text-[14px] sm:text-[15px] font-sora font-semibold">{supplier.deliveryRadius || "Not Set"}</span>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max pr-2 md:pr-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><Truck size={12} className="hidden md:block"/> Est. Delivery</span>
              <span className="font-['Manrope',_sans-serif] text-[14px] sm:text-[15px] font-sora font-semibold">{supplier.deliveryEstimate || "Standard"}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max">
              <span className="text-[10px] sm:text-[11px] font-sora font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><Award size={12} className="hidden md:block"/> Experience</span>
              <span className="text-[14px] sm:text-[15px] font-sora font-semibold">{supplier.experience || "New"}</span>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><Building2 size={12} className="hidden md:block"/> Store Size</span>
              <span className="font-['Manrope',_sans-serif] text-[14px] sm:text-[15px] font-sora font-semibold capitalize">{supplier.storeSize?.toLowerCase() || "Not Set"}</span>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><Clock size={12} className="hidden md:block"/> Store Timing</span>
              <span className="font-['Manrope',_sans-serif] text-[14px] sm:text-[15px] font-sora font-semibold">{supplier.storeTiming || "Not Set"}</span>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-max pr-2 md:pr-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"><LayoutGrid size={12} className="hidden md:block"/> Categories</span>
              <span className="font-['Manrope',_sans-serif] text-[14px] sm:text-[15px] font-sora font-semibold">{supplier.totalSubCategories ? supplier.totalSubCategories + "+" : "New"}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex gap-2.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 no-scrollbar items-center">
          {displaySubs.map((sub, idx) => {
            const imgUrl = getSubcategoryImageUrl(sub.image) || sub.image;
            return (
              <motion.div key={idx} whileHover={{ y: -2 }} className="relative border border-slate-200 rounded-xl overflow-hidden w-12 h-12 flex-shrink-0 group/prod cursor-pointer shadow-sm">
                {imgUrl ? (
                  <img src={imgUrl} alt={sub.name} className="w-full h-full object-cover transition-transform duration-300 group-hover/prod:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-xs uppercase">{sub.name?.charAt(0)}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/prod:opacity-100 transition-opacity duration-200 flex items-center justify-center p-1">
                  <span className="text-[9px] text-white font-bold text-center leading-tight drop-shadow-md">{sub.name}</span>
                </div>
              </motion.div>
            );
          })}
          {remainingCount > 0 && (
            <div onClick={(e) => { e.stopPropagation(); if(onShowMore) onShowMore(supplier); }} className="border border-dashed border-slate-300 rounded-xl w-12 h-12 flex items-center justify-center text-[12px] text-slate-500 font-extrabold bg-slate-50 flex-shrink-0 cursor-pointer hover:bg-slate-100 transition-colors">
              +{remainingCount}
            </div>
          )}
          {(!displaySubs || displaySubs.length === 0) && <span className="text-[12px] text-slate-400 font-medium italic">No categories linked</span>}
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); handleViewProfile(); }}
            className="flex-1 lg:flex-none inline-flex items-center justify-center px-5 py-2.5 bg-white text-[14px] font-sora font-medium rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all duration-200 active:scale-95 whitespace-nowrap"
          >
            View Profile
          </button>
          
          {connectStatus === 'PENDING' ? (
            <button disabled className="flex-1 lg:flex-none inline-flex items-center justify-center px-6 py-2.5 bg-slate-100 text-slate-500 text-[13px] font-bold rounded-xl border border-slate-200 shadow-inner cursor-not-allowed whitespace-nowrap">Requested</button>
          ) : connectStatus === 'CONNECTED' ? (
            <button 
              onClick={(e) => { e.stopPropagation(); handleMessageClick(); }}
              className="flex-1 lg:flex-none inline-flex items-center justify-center px-6 py-2.5 bg-[#ECFDF3] text-[#067647] border border-[#DCFAE6] text-[13px] font-bold rounded-xl shadow-sm transition-all hover:bg-[#d1fadf] active:scale-95 whitespace-nowrap">
              <Loader2 size={16} className="mr-2"/> Message
            </button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); handleConnect(); }} disabled={isConnecting} className="flex-1 lg:flex-none inline-flex items-center justify-center px-6 py-2.5 bg-black text-white text-[13px] font-bold rounded-xl shadow-md hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 whitespace-nowrap">
              {isConnecting ? <Loader2 size={16} className="animate-spin" /> : "Connect"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ===============================================
// ✅ STICKY SELLER MAP (UNTOUCHED)
// ===============================================
const StickySellerMap = React.memo(({ center, sellers }) => {
  const safeCenter = getSafeCenter(center);
  const centerLat = safeCenter[0];
  const centerLng = safeCenter[1];

  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isDesktop) return null;

  return (
    <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full h-[calc(100vh-140px)] rounded-[24px] overflow-hidden border border-slate-200 shadow-sm relative sticky top-[120px] group">
      <MapContainer center={safeCenter} zoom={12} className="w-full h-full z-0" zoomControl={false} attributionControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        <Marker position={safeCenter} icon={userIcon} />
        <Circle center={safeCenter} radius={4000} pathOptions={{ color: '#000000', fillColor: '#000000', fillOpacity: 0.04, weight: 1.5 }} />
        {sellers.map((seller, index) => {
          const lat = centerLat + (Math.sin(index) * 0.03);
          const lng = centerLng + (Math.cos(index) * 0.03);
          
          return (
            <Marker key={seller.id} position={[lat, lng]} icon={createCustomIcon(seller)}>
              <Popup className="rounded-xl shadow-xl border-none custom-popup-b2b">
                <div className="p-3 min-w-[200px]">
                  <h4 className="font-['Manrope',_sans-serif] text-[15px] font-extrabold text-black mb-1 leading-tight">{seller.name || "Business"}</h4>
                  <p className="font-['Inter',_sans-serif] text-[12px] text-slate-500 font-medium mb-3">{seller.category || "General"}</p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <span className="font-['Inter',_sans-serif] text-[12px] font-bold text-slate-600">{seller.distance}</span>
                    <span className="font-['Inter',_sans-serif] text-[12px] font-bold text-black flex items-center gap-1.5"><Star size={12} className="fill-amber-400 text-amber-400" /> {seller.rating > 0 ? seller.rating : "New"}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        <MapController center={safeCenter} />
      </MapContainer>
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-md border border-slate-100 transition-transform group-hover:scale-[1.02]">
        <p className="font-['Manrope',_sans-serif] text-[13px] font-extrabold text-black flex items-center gap-2.5"><span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#17B26A]"></span></span>Live District Radar</p>
      </div>
    </motion.div>
  );
});

// ===============================================
// ✅ MAIN PAGE COMPONENT
// ===============================================
export default function NearbySellerDiscoveryPage() {
  const { role } = useAuth(); 
  const userRole = role?.toUpperCase() || "SHOPKEEPER";
  const targetLabel = userRole === "SHOPKEEPER" ? "Sellers" : "Buyers";

  // --- Core States ---
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [currentDistrict, setCurrentDistrict] = useState("Chennai");

  // --- Filter States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [scope, setScope] = useState("NEARBY"); 
  const [categoryIdFilter, setCategoryIdFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [deliveryRadiusFilter, setDeliveryRadiusFilter] = useState("");
  const [responseFilter, setResponseFilter] = useState("");

  const [notification, setNotification] = useState(null);

  const showNotification = (type, msg) => {
    setNotification({ type, msg });
  };

  const mapCenter = useMemo(() => DISTRICT_CENTERS[currentDistrict] || DISTRICT_CENTERS["Chennai"], [currentDistrict]);

  const hasActiveFilters = categoryIdFilter || ratingFilter || deliveryRadiusFilter || responseFilter || scope === "ALL" || searchQuery !== "";

  const clearAllFilters = () => {
    setScope("NEARBY");
    setCategoryIdFilter("");
    setRatingFilter("");
    setDeliveryRadiusFilter("");
    setResponseFilter("");
    setSearchQuery("");
  };

  // ✅ 1. FIXED CATEGORY FETCHING (Handles deeply nested responses)
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryApi.getAllCategories();
        // Fallback checks to ensure we extract the array perfectly
        const catData = res.data?.data || res.data || [];
        const formattedData = Array.isArray(catData) ? catData : [];
        setCategories(formattedData);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, []);

  // ✅ 2. FETCH SELLERS LOGIC
  const fetchSellers = async () => {
    setIsLoading(true);
    setFetchError(false);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (scope) params.scope = scope;
      if (categoryIdFilter) params.categoryId = categoryIdFilter;
      if (ratingFilter) params.minRating = parseFloat(ratingFilter);
      if (deliveryRadiusFilter) params.deliveryRadius = parseInt(deliveryRadiusFilter);
      if (responseFilter) params.responseTime = responseFilter;

      const response = await networkApi.getNearbySellers(params);
      let fetchedData = response.data?.data || [];

      setSuppliers(fetchedData);
      
      if (fetchedData.length > 0 && scope === "NEARBY") {
        const districtStr = fetchedData[0].distance.replace("In ", "");
        if (DISTRICT_CENTERS[districtStr]) setCurrentDistrict(districtStr);
      }
    } catch (err) { 
      console.error(err); 
      setFetchError(true);
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchSellers(); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, scope, categoryIdFilter, ratingFilter, deliveryRadiusFilter, responseFilter]);

  // STOMP WebSockets
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws', null, { withCredentials: true }),
      debug: () => {}, 
      onConnect: () => {
        client.subscribe('/user/queue/notifications', (message) => {
          const notif = JSON.parse(message.body);
          const title = notif.type === 'NEW_NEARBY_USER' ? 'Live Radar Update' : 'Network Update';
          showNotification('info', `${title}: ${notif.message}`);
          
          if (notif.type === 'NEW_NEARBY_USER' || notif.type === 'ACCEPTED') {
            fetchSellers(); 
          }
        });
      }
    });
    client.activate();
    
    return () => { if (client.active) client.deactivate(); };
  }, []);

  // ✅ 3. EXPANDED DROPDOWN DATA OPTIONS
  const categoryOptions = categories.map(cat => ({ value: cat.id, label: cat.name }));

  const radiusOptions = [
    {value:'5', label:'Within 5 km'},
    {value:'10', label:'Within 10 km'},
    {value:'25', label:'Within 25 km'},
    {value:'50', label:'Within 50 km'},
    {value:'100', label:'Within 100 km'},
    {value:'250', label:'Within 250 km'},
    {value:'500', label:'Statewide (500 km)'}
  ];

  const responseOptions = [
    {value:'< 1 hr', label:'Under 1 Hour'},
    {value:'< 4 hrs', label:'Under 4 Hours'},
    {value:'< 12 hrs', label:'Under 12 Hours'},
    {value:'< 24 hrs', label:'Under 24 Hours'},
    {value:'1-2 days', label:'1-2 Days'}
  ];

  const ratingOptions = [
    {value:'4.8', label:'4.8+ Top Rated'},
    {value:'4.5', label:'4.5+ Excellent'},
    {value:'4', label:'4.0+ Good'},
    {value:'3.5', label:'3.5+ Average'},
    {value:'3', label:'3.0+ All'}
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: typographyStyles }} />
      <div className="bg-[#FAFAFA] font-['Inter',_sans-serif] text-[#0F1626] min-h-screen pb-24">
        
        <PremiumToast 
          isVisible={!!notification} 
          type={notification?.type || 'info'} 
          message={notification?.msg} 
          onClose={() => setNotification(null)} 
        />

        {fetchError ? (
          <DataFetchError onRetry={fetchSellers} />
        ) : (
          <>
            {/* ✅ 4. PREMIUM MOBILE UI - Header Section */}
            <div className="pt-6 pb-4 w-full flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-slate-200 bg-white px-4 md:px-6">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-[24px] sm:text-[32px] font-extrabold tracking-tight text-gray-900">
                  {userRole === "SHOPKEEPER" ? "Nearby Suppliers" : "Nearby Buyers"}
                </h1>
                <p className="mt-1 text-[13px] sm:text-[15px] font-medium text-slate-500">
                  {userRole === "SHOPKEEPER"
                    ? "Discover verified wholesalers and distributors near your location."
                    : "Connect with verified shopkeepers in your region."}
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex bg-slate-100 p-1 rounded-[14px] w-full md:w-auto shadow-inner border border-slate-200/60">
                <button 
                  onClick={() => setScope("NEARBY")} 
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-[10px] text-[13px] font-extrabold transition-all duration-300 ${scope === "NEARBY" ? 'bg-white text-black shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-black'}`}
                >
                  Nearby {targetLabel}
                </button>
                <button 
                  onClick={() => setScope("ALL")} 
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-[10px] text-[13px] font-extrabold transition-all duration-300 ${scope === "ALL" ? 'bg-white text-black shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-black'}`}
                >
                  All {targetLabel}
                </button>
              </motion.div>
            </div>

            {/* ✅ 5. PREMIUM MOBILE UI - Filter Bar (Stacked nicely on mobile) */}
            <div className="flex flex-col gap-4 py-4 px-4 md:px-6 bg-white border-b border-slate-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] sticky top-[72px] z-30">
              
              {/* Search Bar - Full width on mobile */}
              <div className="relative w-full group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} strokeWidth={2.5} />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder={`Search ${targetLabel.toLowerCase()}, brands...`} 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-semibold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-sm" 
                />
              </div>
              
              {/* Filter Row - Smooth Horizontal Scrolling on Mobile */}
              <div className="flex items-center gap-2.5 w-full overflow-x-auto no-scrollbar pb-1">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-[13px] font-extrabold rounded-xl shadow-md flex-shrink-0">
                  <SlidersHorizontal size={14} /> Filters
                </div>
                
                <FilterDropdown label="Any Category" value={categoryIdFilter} onChange={setCategoryIdFilter} options={categoryOptions} />
                <FilterDropdown label="Delivery Radius" value={deliveryRadiusFilter} onChange={setDeliveryRadiusFilter} options={radiusOptions} />
                <FilterDropdown label="Response Time" value={responseFilter} onChange={setResponseFilter} options={responseOptions} />
                <FilterDropdown label="Rating" value={ratingFilter} onChange={setRatingFilter} options={ratingOptions} />

                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 hover:border-rose-200 rounded-xl whitespace-nowrap transition-colors shadow-sm flex-shrink-0">
                    <X size={14} strokeWidth={2.5} /> Clear All
                  </button>
                )}
              </div>
            </div>

            {/* RESULTS BODY */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 sm:py-6">
              <div className="flex flex-col lg:flex-row gap-6">
                
                <div className="w-full lg:w-[60%] xl:w-[70%]">
                  <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h2 className="text-[18px] sm:text-[20px] font-sora font-extrabold text-slate-800 flex items-center gap-1.5">
                      Found <span className="text-black text-[20px]">{suppliers.length}</span> {targetLabel}
                    </h2>
                    {scope === "ALL" && (
                      <span className="text-[12px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm w-fit">
                        <MapPin size={14} /> Showing Statewide
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col relative min-h-[300px]">
                    {isLoading ? (
                      <div className="absolute inset-0 z-10 bg-[#FAFAFA]/80 backdrop-blur-sm flex items-center justify-center rounded-[24px]">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                      </div>
                    ) : suppliers.length === 0 ? (
                       <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-[24px] shadow-sm p-6 text-center mt-2">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100 shadow-sm">
                          <Search className="w-8 h-8 text-slate-400" /> 
                        </div>
                        <h3 className="font-['Manrope',_sans-serif] text-[18px] font-extrabold text-black mb-2">
                          No {targetLabel.toLowerCase()} found
                        </h3>
                        <p className="text-[14px] text-slate-500 font-medium max-w-sm mb-6">
                          Try adjusting your filters, clearing the search, or switching to "All {targetLabel}".
                        </p>
                        {hasActiveFilters && (
                          <button onClick={clearAllFilters} className="bg-black text-white px-8 py-3 rounded-xl font-bold text-[13px] hover:bg-slate-800 transition-colors shadow-md active:scale-95">
                            Clear All Filters
                          </button>
                        )}
                      </div>
                    ) : null}
                    
                    <AnimatePresence>
                      {suppliers.map((supplier, index) => (
                        <SellerCard key={supplier.id} supplier={supplier} index={index} userRole={userRole} showNotification={showNotification} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="hidden lg:block lg:w-[40%] xl:w-[30%] relative">
                  <StickySellerMap center={mapCenter} sellers={suppliers} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}


// stockLinker
// BoomathiAriharan5679Love