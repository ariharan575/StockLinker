import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Star } from 'lucide-react';
import { MapController } from './MapController';
import { getSafeCenter, createCustomIcon, userIcon } from '../../utils/mapUtils';
import 'leaflet/dist/leaflet.css';

export const StickySellerMap = React.memo(({ center, sellers }) => {
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