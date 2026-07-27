import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Truck, CheckCircle2, Building2, Loader2, AlertCircle, Bell, MessageSquare
} from 'lucide-react';
import { networkApi } from '../Authentication/services/api';

export const CTA_GRAD = 'linear-gradient(to right, #EC4899, #F43F5E, #F97316)';

// 🌍 DYNAMIC DISTRICT CENTERS (Prevents NaN Crashes and Auto-Centers Map)
const DISTRICT_CENTERS = {
  "Chennai": [13.0827, 80.2707],
  "Salem": [11.6643, 78.1460],
  "Coimbatore": [11.0168, 76.9558],
  "Pudukottai": [10.3797, 78.8205],
  "Thiruvarur": [10.7725, 79.6363]
};

function LiveToast({ notification, onClose }) {
  if (!notification) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-white border border-emerald-200 shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[300px]">
      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
        <Bell size={20} className="animate-bounce" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-zinc-900">{notification.type === 'NEW_NEARBY_USER' ? 'Live Radar Update' : 'Network Update'}</h4>
        <p className="text-xs text-zinc-500">{notification.message}</p>
      </div>
      <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">×</button>
    </motion.div>
  );
}

const createCustomIcon = (supplier) => {
  const initial = supplier.name ? supplier.name.charAt(0).toUpperCase() : "S";
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `<div class="relative group cursor-pointer transition-transform hover:scale-105 duration-300 z-50"><div class="w-10 h-10 rounded-md border-2 border-[#F43F5E] overflow-hidden bg-white shadow-lg flex items-center justify-center font-black text-lg text-white" style="background: ${CTA_GRAD}">${initial}</div></div>`,
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
    if (center && !isNaN(center[0]) && !isNaN(center[1])) map.flyTo(center, 13, { duration: 1.5 }); 
  }, [center, map]);
  return null;
};

const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay } });

const FilterDropdown = ({ label, options, value, onChange }) => (
  <div className="relative inline-block flex-shrink-0">
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`appearance-none pl-3 pr-8 py-1.5 border text-sm font-medium rounded-md shadow-sm outline-none cursor-pointer transition-all ${value ? 'bg-[#FDF2F8] border-[#FBCFE8] text-[#E11D48]' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}>
      <option value="">{label}</option>
      {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
    </select>
    <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${value ? 'text-[#E11D48]' : 'text-zinc-400'}`} size={14} />
  </div>
);

const SellerCard = ({ supplier, index }) => {
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
    } catch (err) { console.error(err); } 
    finally { setIsConnecting(false); }
  };

  const handleMessageClick = () => {
    navigate('/messages', {
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
      console.error("Missing business profile reference for this supplier.");
    }
  };

  const displaySubs = supplier.subCategories?.slice(0, 3) || [];
  const remainingCount = (supplier.totalSubCategories || 0) - displaySubs.length;

  return (
    <motion.div {...fadeUp(index * 0.05)} whileHover={{ scale: 1.002, borderColor: "#FBCFE8", boxShadow: "0 8px 20px -6px rgba(244, 63, 94, 0.12)" }} className="bg-white border border-zinc-200 rounded-lg p-4 md:p-5 shadow-sm mb-4 flex flex-col gap-3.5 relative overflow-hidden group transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-md shadow-sm flex items-center justify-center font-black text-xl text-white" style={{ background: CTA_GRAD }}>{initial}</div>
            {verified && <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-px shadow-sm"><CheckCircle2 size={12} className="text-emerald-500 fill-emerald-100" /></div>}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h3 className="text-base font-bold text-zinc-900 leading-tight group-hover:text-[#E11D48] transition-colors">{name}</h3>
              {supplier.readyStock && <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold border rounded-md bg-amber-50 text-amber-700 border-amber-200 uppercase tracking-wide">Ready Stock</span>}
              {connectStatus === 'CONNECTED' && <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold border rounded-md bg-emerald-50 text-emerald-700 border-emerald-200 uppercase tracking-wide">Connected</span>}
            </div>
            <p className="text-xs text-zinc-500 font-medium mb-1.5">{supplier.category || "General Business"}</p>
            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-2 text-xs">
              <span className="flex items-center gap-1 text-zinc-600"><MapPin size={12} className="text-zinc-400"/> {supplier.location} ({supplier.distance})</span>
              <span className="text-zinc-300 hidden sm:inline">•</span>
              <span className="flex items-center gap-1 text-zinc-900 font-semibold"><Star size={12} className="fill-amber-400 text-amber-400" /> {supplier.rating > 0 ? supplier.rating : "New"} <span className="text-zinc-500 font-normal">({supplier.reviews || 0})</span></span>
              <span className="text-zinc-300 hidden sm:inline">•</span>
              <div className="flex gap-2">{verified && <span className="flex items-center gap-1 text-blue-700 font-medium"><ShieldCheck size={12} /> Business Verified</span>}</div>
            </div>
          </div>
        </div>
        <div className="text-left sm:text-right flex-shrink-0 mt-1 sm:mt-0">
          <p className="text-[11px] font-semibold text-emerald-600 mb-0.5 flex items-center sm:justify-end gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>{supplier.status || "Active"}</p>
          <p className="text-[11px] text-zinc-500 flex items-center sm:justify-end gap-1"><Clock size={10}/> Replies in {supplier.responseTime || "< 1 hr"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-3 border-y border-zinc-100">
        <div className="flex flex-col gap-0.5"><span className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium"><Award size={12} className="text-zinc-400"/> Experience</span><span className="text-sm font-semibold text-zinc-900">{supplier.experience || "New"}</span></div>
        <div className="flex flex-col gap-0.5"><span className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium"><Package size={12} className="text-zinc-400"/> Orders Fulfilled</span><span className="text-sm font-semibold text-zinc-900">{supplier.orders || "New"}</span></div>
        <div className="flex flex-col gap-0.5"><span className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium"><MapPin size={12} className="text-zinc-400"/> Delivery Radius</span><span className="text-sm font-semibold text-zinc-900">{supplier.deliveryRadius || "Not Set"}</span></div>
        <div className="flex flex-col gap-0.5"><span className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium"><Truck size={12} className="text-zinc-400"/> Est. Delivery</span><span className="text-sm font-semibold text-zinc-900">{supplier.deliveryEstimate || "Standard"}</span></div>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 mt-0.5">
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 no-scrollbar items-center">
          {displaySubs.map((sub, idx) => (
            <motion.div key={idx} whileHover={{ y: -2, scale: 1.05 }} className="relative border border-zinc-200 rounded-md overflow-hidden w-12 h-12 flex-shrink-0 group/prod cursor-pointer">
              <img src={sub.image} alt={sub.name} className="w-full h-full object-cover transition-transform duration-300 group-hover/prod:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/prod:opacity-100 transition-opacity duration-200 flex items-center justify-center p-1">
                <span className="text-[8px] text-white font-bold text-center leading-tight drop-shadow-md">{sub.name}</span>
              </div>
            </motion.div>
          ))}
          {remainingCount > 0 && <div className="border border-dashed border-zinc-300 rounded-md w-12 h-12 flex items-center justify-center text-xs text-zinc-500 font-bold bg-zinc-50 flex-shrink-0 cursor-default">+{remainingCount}</div>}
          {(!displaySubs || displaySubs.length === 0) && <span className="text-xs text-zinc-400 font-medium italic">No categories linked</span>}
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button 
            onClick={handleViewProfile}
            className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 bg-white text-zinc-700 text-sm font-medium rounded-md border border-zinc-200 shadow-sm hover:bg-zinc-50 transition-all duration-200"
          >
            View Profile
          </button>
          
          {connectStatus === 'PENDING' ? (
            <button disabled className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-500 text-sm font-semibold rounded-md border border-slate-200 shadow-inner cursor-not-allowed">Requested</button>
          ) : connectStatus === 'CONNECTED' ? (
            <button 
              onClick={handleMessageClick}
              className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 text-sm font-semibold rounded-md shadow-sm transition-all hover:bg-emerald-100">
              <MessageSquare size={16} className="mr-2"/> Message
            </button>
          ) : (
            <button onClick={handleConnect} disabled={isConnecting} style={{ background: CTA_GRAD }} className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 text-white text-sm font-semibold rounded-md shadow-[0_2px_10px_0_rgb(244,63,94,0.2)] hover:shadow-[0_4px_15px_rgba(244,63,94,0.3)] transition-all disabled:opacity-70">
              {isConnecting ? <Loader2 size={16} className="animate-spin" /> : "Connect"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const StickySellerMap = React.memo(({ center, sellers }) => {
  return (
    <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full h-[calc(100vh-140px)] rounded-lg overflow-hidden border border-zinc-200 shadow-sm relative sticky top-[120px] group">
      <MapContainer center={center} zoom={12} className="w-full h-full z-0" zoomControl={false} attributionControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        <Marker position={center} icon={userIcon} />
        <Circle center={center} radius={4000} pathOptions={{ color: '#2563EB', fillColor: '#2563EB', fillOpacity: 0.04, weight: 1.5 }} />
        {sellers.map((seller, index) => {
          const safeCenterLat = isNaN(center[0]) ? 13.0827 : center[0];
          const safeCenterLng = isNaN(center[1]) ? 80.2707 : center[1];
          const lat = safeCenterLat + (Math.sin(index) * 0.03);
          const lng = safeCenterLng + (Math.cos(index) * 0.03);
          
          return (
            <Marker key={seller.id} position={[lat, lng]} icon={createCustomIcon(seller)}>
              <Popup className="rounded-md shadow-md border-none custom-popup-b2b">
                <div className="p-2 min-w-[180px]">
                  <h4 className="text-sm font-bold text-zinc-900 mb-0.5">{seller.name || "Business"}</h4>
                  <p className="text-[11px] text-zinc-500 font-medium mb-2">{seller.category || "General"}</p>
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-2">
                    <span className="text-xs font-semibold text-zinc-900">{seller.distance}</span>
                    <span className="text-xs font-bold text-zinc-900 flex items-center gap-1"><Star size={10} className="fill-amber-400 text-amber-400" /> {seller.rating > 0 ? seller.rating : "New"}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        <MapController center={center} />
      </MapContainer>
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md shadow-sm border border-zinc-200 transition-transform group-hover:scale-[1.02]">
        <p className="text-xs font-semibold text-zinc-900 flex items-center gap-2"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>Live District Radar</p>
      </div>
    </motion.div>
  );
});

export default function NearbySellerDiscoveryPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("");
  const [responseFilter, setResponseFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentDistrict, setCurrentDistrict] = useState("Chennai");

  const [liveToast, setLiveToast] = useState(null);

  const mapCenter = useMemo(() => DISTRICT_CENTERS[currentDistrict] || DISTRICT_CENTERS["Chennai"], [currentDistrict]);

  useEffect(() => {
    fetchSellers();
    
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws', null, { withCredentials: true }),
      debug: () => {}, 
      onConnect: () => {
        client.subscribe('/user/queue/notifications', (message) => {
          const notification = JSON.parse(message.body);
          setLiveToast(notification);
          setTimeout(() => setLiveToast(null), 5000);
          
          if (notification.type === 'NEW_NEARBY_USER') {
            fetchSellers(); 
          } else if (notification.type === 'ACCEPTED') {
            fetchSellers();
          }
        });
      }
    });
    client.activate();
    
    return () => {
      if (client.active) client.deactivate();
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchSellers(); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, verifiedFilter, ratingFilter, distanceFilter, responseFilter, categoryFilter]);

  const fetchSellers = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (categoryFilter) params.category = categoryFilter;
      if (verifiedFilter === "yes") params.verified = true;
      if (ratingFilter) params.minRating = parseFloat(ratingFilter);
      if (distanceFilter) params.maxDistance = parseInt(distanceFilter);
      if (responseFilter) params.responseTime = responseFilter;

      const response = await networkApi.getNearbySellers(params);
      let fetchedData = response.data?.data || [];
      
      setSuppliers(fetchedData);
      
      if (fetchedData.length > 0) {
        const districtStr = fetchedData[0].distance.replace("In ", "");
        if (DISTRICT_CENTERS[districtStr]) setCurrentDistrict(districtStr);
      }
    } catch (err) { console.error(err); setError("Failed to locate nearby network."); } 
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence>
        <LiveToast notification={liveToast} onClose={() => setLiveToast(null)} />
      </AnimatePresence>

      <div className="pb-4 md:pb-5 w-full flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4 border-b border-zinc-200 bg-white px-4 md:px-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2"><Building2 size={24} className="text-[#F43F5E]" /> District Discovery Network</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs md:text-sm text-zinc-500 font-medium"><span className="flex items-center gap-1"><MapPin size={14} className="text-[#F43F5E]" /> {currentDistrict} Zone</span><span className="hidden md:inline">•</span><span className="bg-zinc-50 px-2 py-0.5 border border-zinc-100 rounded-md">Smart Proximity</span><span className="hidden md:inline">•</span><span className="text-zinc-700 font-semibold">{suppliers.length} Partners</span></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex flex-wrap items-center gap-2">
          {["Electronics", "Packaging", "Hardware", "Textiles"].map((cat) => (
            <span key={cat} onClick={() => setCategoryFilter(cat)} className="px-3 py-1 bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs font-medium rounded-full cursor-pointer hover:bg-[#FDF2F8] hover:text-[#F43F5E] hover:border-[#FBCFE8] transition-all duration-200 shadow-sm">{cat}</span>
          ))}
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between py-3 px-4 md:px-6 bg-white border-b border-zinc-200 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/90">
        <div className="relative w-full lg:max-w-md flex-shrink-0 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#F43F5E] transition-colors" size={16} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search sellers, products, categories..." className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#F43F5E] focus:border-[#F43F5E] transition-all shadow-inner" />
        </div>
        
        {/* 🚀 FILTERS RESTORED HERE */}
        <div className="flex items-center gap-2 md:gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white text-sm font-medium rounded-md shadow-sm hover:bg-zinc-800 flex-shrink-0 transition-colors">
            <SlidersHorizontal size={14} /> Filters
          </button>
          <div className="h-5 w-px bg-zinc-200 hidden lg:block mx-1"></div>
          <FilterDropdown label="Category" value={categoryFilter} onChange={setCategoryFilter} options={[{value:'Electronics', label:'Electronics'}, {value:'Packaging', label:'Packaging'}, {value:'Groceries', label:'Groceries'}]} />
          <FilterDropdown label="Distance" value={distanceFilter} onChange={setDistanceFilter} options={[{value:'10', label:'< 10 km'}, {value:'25', label:'< 25 km'}, {value:'50', label:'< 50 km'}]} />
          <FilterDropdown label="Verified" value={verifiedFilter} onChange={setVerifiedFilter} options={[{value:'yes', label:'Verified Only'}]} />
          <FilterDropdown label="Rating" value={ratingFilter} onChange={setRatingFilter} options={[{value:'4', label:'4.0+ Rating'}, {value:'4.5', label:'4.5+ Rating'}]} />
          <FilterDropdown label="Response Time" value={responseFilter} onChange={setResponseFilter} options={[{value:'< 1 hr', label:'< 1 Hour'}, {value:'< 24 hrs', label:'< 24 Hours'}]} />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[65%] xl:w-[70%]">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-1.5">Found <span className="text-[#F43F5E]">{suppliers.length}</span> partners</h2>
            </div>
            
            <div className="flex flex-col relative min-h-[300px]">
              {isLoading ? (
                <div className="absolute inset-0 z-10 bg-[#FAFAFA]/80 backdrop-blur-sm flex items-center justify-center"><Loader2 className="w-10 h-10 text-[#F43F5E] animate-spin" /></div>
              ) : error ? (
                <div className="flex items-center justify-center py-20 text-red-500"><AlertCircle className="mr-2"/> {error}</div>
              ) : null}
              
              <AnimatePresence>
                {suppliers.map((supplier, index) => (
                  <SellerCard key={supplier.id} supplier={supplier} index={index} />
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="hidden lg:block lg:w-[35%] xl:w-[30%] relative">
            <StickySellerMap center={mapCenter} sellers={suppliers} />
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `.custom-popup-b2b .leaflet-popup-content-wrapper { border-radius: 8px; padding: 0; box-shadow: 0 4px 12px -2px rgba(0,0,0,0.1); border: 1px solid #E4E4E7; overflow: hidden; } .custom-popup-b2b .leaflet-popup-content { margin: 0; font-family: 'Inter', sans-serif; } .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}} />
    </div>
  );
}