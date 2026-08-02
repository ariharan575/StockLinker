import {
  Home, LayoutGrid, BarChart2, MapPin, ShoppingCart, FileText,
  MessageSquare, RotateCcw, Bookmark, Settings, HelpCircle,
  Search, TrendingUp, Zap, Clock,Bell,User,Briefcase,Truck,Package,Users
} from 'lucide-react';

// Import C from constants (named export)
import { C } from '../../Layout/common/constants';


// ─── QUICK ACTIONS ────────────────────────────────────────────────────
export const QUICK_ACTIONS = [
  { id: 1, label: 'Find Products',   desc: 'Browse wholesale items',    Icon: Search,       color: C.brand, bg: C.bLight, path: '/category' },
  { id: 2, label: 'Compare Prices',  desc: 'Best deals with suppliers', Icon: BarChart2,    color: C.green, bg: C.gLight, path: '/Compare' },
  { id: 3, label: 'Nearby Sellers',  desc: '24 suppliers within 5km',     Icon: MapPin,       color: C.brand, bg: C.bLight, path: '/nearby' },
  { id: 4, label: 'My Orders',       desc: '3 orders in progress',        Icon: ShoppingCart, color: C.green, bg: C.gLight, path: '/orders' },
  { id: 5, label: 'Saved Suppliers', desc: '12 saved for quick access',   Icon: Bookmark,     color: C.brand, bg: C.bLight, path: '/saved' },
  { id: 6, label: 'Messages',        desc: '3 unread conversations',      Icon: MessageSquare,color: C.green, bg: C.gLight, path: '/message' },
];



// ─── WHY FEATURES ────────────────────────────────────────────────────
export const WHY_FEATURES = [
  { Icon: TrendingUp, title: 'Better Pricing', desc: 'Compare across 500+ suppliers', color: '#EC4899' },
  { Icon: Zap, title: 'Fast Procurement', desc: 'Order in under 2 minutes', color: '#0EA5E9' },
  { Icon: MapPin, title: 'Nearby Discovery', desc: 'Suppliers within your area', color: '#EC4899' },
  { Icon: MessageSquare, title: 'Direct Connect', desc: 'Chat & call suppliers directly', color: '#0EA5E9' },
  { Icon: RotateCcw, title: 'Smart Reordering', desc: 'Repeat orders with one tap', color: '#EC4899' },
  { Icon: BarChart2, title: 'Price Intelligence', desc: 'Market insights at a glance', color: '#0EA5E9' },
];
