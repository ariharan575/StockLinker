import {
  Home, LayoutGrid, BarChart2, MapPin, ShoppingCart, 
  MessageSquare, Bookmark, Settings, HelpCircle, 
  Package, User, Briefcase, Store, Truck
} from 'lucide-react';

export const getNavItems = (role) => {
  const isWholesaler = role?.toUpperCase() === 'WHOLESALER';

  // Base items for both roles - path is always /dashboard now
  const items = [
    { id: 'home', label: 'Home', Icon: Home, path: '/dashboard' },
    { id: 'cat', label: 'Product Categories', Icon: LayoutGrid, path: '/category' },
  ];

  // Role specific items
  if (isWholesaler) {
    items.push({ id: 'product', label: 'Inventory', Icon: Package, path: '/product' });
    items.push({ id: 'nearby', label: 'Nearby Buyers', Icon: MapPin, path: '/nearby' });
    items.push({ id: 'orders', label: 'My Orders', Icon: ShoppingCart, path: '/orders' });
    items.push({ id: 'saved', label: 'Connected Buyers', Icon: Bookmark, path: '/saved' });
    items.push({ id: 'messages', label: 'Messages', Icon: MessageSquare, badge: 3, path: '/message' });
  } else {
    items.push({ id: 'compare', label: 'Compare Price', Icon: BarChart2, path: '/compare' });
    items.push({ id: 'nearby', label: 'Nearby Sellers', Icon: MapPin, path: '/nearby' });
    items.push({ id: 'orders', label: 'My Orders', Icon: ShoppingCart, path: '/orders' });
    items.push({ id: 'saved', label: 'Connected Suppliers', Icon: Bookmark, path: '/saved' });
    items.push({ id: 'messages', label: 'Messages', Icon: MessageSquare, badge: 3, path: '/message' });
  }

  // Settings Sub-menu logic based on role
  const settingsChildren = [
    { id: 'account', label: 'Account', Icon: User, path: '/settings/account' },
    { id: 'business', label: 'Business', Icon: Briefcase, path: '/settings/business' },
    { id: 'store', label: 'Store & Categories', Icon: Store, path: '/settings/store' },
  ];

  if (isWholesaler) {
    settingsChildren.push({ id: 'delivery', label: 'Delivery & Insights', Icon: Truck, path: '/settings/delivery-insights' });
  }

  items.push({
    id: 'settings',
    label: 'Settings',
    Icon: Settings,
    children: settingsChildren
  });

  items.push({ id: 'help', label: 'Help & Support', Icon: HelpCircle, path: '/help' });

  return items;
};

export const getNavTabs = (role) => {
  const isWholesaler = role?.toUpperCase() === 'WHOLESALER';
  
  const tabs = [
    // Path is always /dashboard now
    { id: 'home', label: 'Home', Icon: Home, path: '/dashboard' },
    { id: 'nearby', label: isWholesaler ? 'Buyers' : 'Nearby', Icon: MapPin, path: '/nearby' },
  ];

  if (isWholesaler) {
    tabs.push({ id: 'inventory', label: 'Inventory', Icon: Package, path: '/product' });
  } else {
    tabs.push({ id: 'compare', label: 'Compare', Icon: BarChart2, path: '/compare' });
  }

  tabs.push({ id: 'orders', label: 'Orders', Icon: ShoppingCart, path: '/orders' });
  tabs.push({ id: 'settings', label: 'Settings', Icon: Settings, path: '/settings/account' });

  return tabs;
};