export const MOCK_USER = {
  name: 'Boomathi',
  shop: 'FM Stores',
  location: 'Coimbatore, Tamil Nadu',
  avatar: 'https://i.pravatar.cc/150?u=arun',
  notifications: 3,
};

export const quickActions = [
  { id: 1, name: 'Find Products', desc: 'Explore Products', icon: 'ShoppingBag', color: 'bg-blue-50/80 text-blue-600' },
  { id: 2, name: 'Nearby Wholesalers', desc: 'Find Near You', icon: 'MapPin', color: 'bg-emerald-50/80 text-emerald-600' },
  { id: 3, name: 'Compare Prices', desc: 'Get Best Deals', icon: 'Sliders', color: 'bg-amber-50/80 text-amber-600' },
  { id: 4, name: 'My Orders', desc: 'Track & Manage', icon: 'Package', color: 'bg-indigo-50/80 text-indigo-600', badge: 2 },
  { id: 5, name: 'Saved Suppliers', desc: 'Your Favorites', icon: 'Heart', color: 'bg-rose-50/80 text-rose-600' },
];

export const mobileQuickActions = [
  { label: 'Find Products', icon: '📦', color: 'bg-emerald-50/80 text-emerald-700 border-emerald-100/60 shadow-emerald-500/5' },
  { label: 'Nearby', icon: '🏢', color: 'bg-indigo-50/80 text-indigo-700 border-indigo-100/60 shadow-indigo-500/5' },
  { label: 'Compare', icon: '📊', color: 'bg-amber-50/80 text-amber-700 border-amber-100/60 shadow-amber-500/5' },
  { label: 'My Orders', icon: '🚚', color: 'bg-rose-50/80 text-rose-700 border-rose-100/60 shadow-rose-500/5' },
  { label: 'Saved', icon: '❤️', color: 'bg-purple-50/80 text-purple-700 border-purple-100/60 shadow-purple-500/5' },
  { label: 'Best Deals', icon: '🔥', color: 'bg-orange-50/80 text-orange-700 border-orange-100/60 shadow-orange-500/5' }
];

export const mobileNavTabs = [
  { label: 'Home', icon: 'Home' },
  { label: 'Categories', icon: 'Layers' },
  { label: 'Scan', icon: 'Scan', isCenter: true },
  { label: 'Orders', icon: 'Package' },
  { label: 'Account', icon: 'HelpCircle' }
];

export const desktopNavItems = [
  { name: 'Home', icon: 'Home' },
  { name: 'Find Products', icon: 'ShoppingBag' },
  { name: 'Nearby Suppliers', icon: 'MapPin' },
  { name: 'Compare Prices', icon: 'Sliders' },
  { name: 'My Orders', icon: 'Package' },
  { name: 'Saved Suppliers', icon: 'Heart' },
  { name: 'Messages', icon: 'Phone' },
  { name: 'Invoices', icon: 'Receipt' },
  { name: 'Settings', icon: 'Settings' },
];