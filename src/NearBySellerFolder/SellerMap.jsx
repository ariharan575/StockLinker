import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Star, PackageCheck } from 'lucide-react';

const createCustomIcon = (seller) => {
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `
      <div class="relative group cursor-pointer transition-transform hover:scale-110 z-50">
        <div class="w-10 h-10 rounded-full border-2 border-rose-500 overflow-hidden bg-white shadow-lg shadow-rose-200/50">
          <img src="${seller.image}" class="w-full h-full object-cover" alt="logo" />
        </div>
        ${seller.verified ? '<div class="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white shadow-sm"></div>' : ''}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const userIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div class="w-4 h-4 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 rounded-full border-2 border-white shadow-lg shadow-rose-300/50 animate-pulse"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function SellerMap({ center, sellers }) {
  return (
    <div className="w-full h-[400px] rounded-[2rem] overflow-hidden border border-slate-200/60 shadow-sm relative z-0 bg-slate-50 group">
      <MapContainer center={center} zoom={13} className="w-full h-full" zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap'
        />
        
        {/* User Location & Radius */}
        <Marker position={center} icon={userIcon} />
        <Circle 
          center={center} 
          radius={5000} 
          pathOptions={{ color: '#F43F5E', fillColor: '#F43F5E', fillOpacity: 0.04, weight: 1.5, dashArray: '4' }} 
        />

        {/* Sellers */}
        {sellers.map((seller) => (
          <Marker key={seller.id} position={seller.location} icon={createCustomIcon(seller)}>
            <Popup className="rounded-2xl overflow-hidden shadow-xl border-0">
              <div className="p-1 min-w-[200px]">
                <h3 className="font-semibold text-slate-900 text-base">{seller.name}</h3>
                <div className="flex items-center gap-1 text-amber-500 text-xs my-1">
                  <Star size={12} fill="currentColor" /> {seller.rating} 
                  <span className="text-slate-400 ml-1">({seller.reviews})</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{seller.category}</p>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-rose-600 bg-rose-50 px-2 py-1 rounded-md">{seller.distance}</span>
                  {seller.inStock ? (
                    <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      <PackageCheck size={12} /> In Stock
                    </span>
                  ) : (
                    <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded-md">Out of Stock</span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Floating Map Controls */}
      <button className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] bg-white/95 backdrop-blur-sm text-slate-700 px-6 py-3 rounded-full shadow-lg shadow-slate-200/50 border border-slate-200/50 text-sm font-bold hover:bg-white transition-all hover:scale-105 flex items-center gap-2 opacity-90 group-hover:opacity-100">
        <MapPin size={18} className="text-rose-500" />
        Search this area
      </button>
    </div>
  );
}