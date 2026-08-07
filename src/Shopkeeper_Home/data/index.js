import {
  Home, LayoutGrid, BarChart2, MapPin, ShoppingCart, FileText,
  MessageSquare, RotateCcw, Bookmark, Settings, HelpCircle,
  Search, TrendingUp, Zap, Clock,Bell,User,Briefcase,Truck,Package,Users
} from 'lucide-react';

// Import C from constants (named export)
import { C } from '../../Layout/common/constants';

// ─── WHY FEATURES ────────────────────────────────────────────────────
export const WHY_FEATURES = [
  { Icon: TrendingUp, title: 'Better Pricing', desc: 'Compare across 500+ suppliers', color: '#EC4899' },
  { Icon: Zap, title: 'Fast Procurement', desc: 'Order in under 2 minutes', color: '#0EA5E9' },
  { Icon: MapPin, title: 'Nearby Discovery', desc: 'Suppliers within your area', color: '#EC4899' },
  { Icon: MessageSquare, title: 'Direct Connect', desc: 'Chat & call suppliers directly', color: '#0EA5E9' },
  { Icon: RotateCcw, title: 'Smart Reordering', desc: 'Repeat orders with one tap', color: '#EC4899' },
  { Icon: BarChart2, title: 'Price Intelligence', desc: 'Market insights at a glance', color: '#0EA5E9' },
];
