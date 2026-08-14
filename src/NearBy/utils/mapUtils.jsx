import L from 'leaflet';
import { CTA_GRAD } from './constants';

export const getSafeCenter = (coord) => {
  if (Array.isArray(coord) && coord.length >= 2) {
    const lat = parseFloat(coord[0]);
    const lng = parseFloat(coord[1]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }
  return [13.0827, 80.2707];
};

export const createCustomIcon = (supplier) => {
  const initial = supplier.name ? supplier.name.charAt(0).toUpperCase() : "S";
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `<div class="relative group cursor-pointer transition-transform hover:scale-105 duration-300 z-50"><div class="w-10 h-10 rounded-xl border border-pink-200 overflow-hidden bg-white shadow-lg flex items-center justify-center font-['Manrope',_sans-serif] font-extrabold text-lg text-white" style="background: ${CTA_GRAD}">${initial}</div></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -45]
  });
};

export const userIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div class="relative flex items-center justify-center"><div class="absolute w-8 h-8 bg-blue-600 rounded-full opacity-30 animate-ping"></div><div class="relative w-4 h-4 rounded-full border-[3px] border-white shadow-md bg-blue-600"></div></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});