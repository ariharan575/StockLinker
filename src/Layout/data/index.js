import {
  Home, LayoutGrid, BarChart2, MapPin, ShoppingCart, FileText,
  MessageSquare, RotateCcw, Bookmark, Settings, HelpCircle,
  Search, TrendingUp, Zap, Clock,Bell,User,Briefcase,Truck,Package,Users
} from 'lucide-react';

// Import C from constants (named export)
import { C } from '../../Layout/common/constants';

// ─── NAVIGATION ITEMS ────────────────────────────────────────────────

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', Icon: Home, path: '/dashboard' },
  { id: 'cat', label: 'Product Categories', Icon: LayoutGrid, path: '/category' },
  { id: 'compare', label: 'Compare Price', Icon: BarChart2, path: '/compare' },
  { id: 'nearby', label: 'Nearby Sellers', Icon: MapPin, path: '/nearby' },
  { id: 'orders', label: 'My Orders', Icon: ShoppingCart, path: '/orders' },
  { id: 'messages', label: 'Messages', Icon: MessageSquare, badge: 3, path: '/message' },
  { id: 'saved', label: 'Saved Suppliers', Icon: Bookmark, path: '/saved' },
//   { id: 'add', label: 'Add Products', Icon: Bookmark, path: '/add' },
  { id: 'product', label: 'Inventary', Icon: Bookmark, path: '/product' },
  { 
    id: 'settings', 
    label: 'Settings', 
    Icon: Settings, 
    children: [
      { id: 'account', label: 'Account', Icon: User, path: '/settings/account' },
      { id: 'business', label: 'Business', Icon: Briefcase, path: '/settings/business' },
      { id: 'delivery', label: 'Store & Delivery', Icon: Truck, path: '/settings/delivery' },
      { id: 'inventory', label: 'Products', Icon: Package, path: '/settings/inventory' },
    ]
  },
  { id: 'help', label: 'Help & Support', Icon: HelpCircle, path: '/help' },
];