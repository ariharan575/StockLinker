import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Mic, ScanLine, Bell, MessageSquare, LayoutDashboard, Box, 
  Grid, ArrowLeftRight, Users, MapPin, ShoppingCart, Archive, 
  MessageCircle, FileText, BarChart2, Heart, Clock, Settings, 
  ChevronRight, TrendingUp, TrendingDown, Star, Phone, Map, 
  Plus, CheckCircle2, AlertCircle, ShoppingBag, ShieldCheck, Zap,Store ,
  CheckCircle ,ChevronDown ,BrainCircuit,Layers ,Truck ,Activity ,ArrowRightLeft ,RefreshCw ,
  Globe,Home ,ClipboardList,Truck as TruckFast,DollarSign,ArrowRight,MoreVertical,Sparkles,
  Filter 
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';


const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const containerVar = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVar = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

 
// --- MOCK DATA ---

const COMPARE_PRODUCTS = [
  {
    name: "Aavin Milk - 1L",
    demand: "High",
    stock: "Low",
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=300",
    suppliers: [
      { name: "FreshFarm", time: "30 mins", min: 50, rating: 4.8, price: 29.00 },
      { name: "MilkLand", time: "45 mins", min: 100, rating: 4.9, price: 26.00, best: true, aiRec: true },
      { name: "Dairy Best", time: "1 hr", min: 20, rating: 4.5, price: 30.00 },
    ],
    savings: 150.00,
    marginIncrease: "+12%"
  },
  {
    name: "Basmati Rice - 5kg",
    demand: "Trending",
    stock: "Adequate",
    category: "Grains",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=300",
    suppliers: [
      { name: "BestRice Hub", time: "Tomorrow", min: 20, rating: 4.9, price: 340.00, best: true },
      { name: "GrainMart", time: "2 Days", min: 50, rating: 4.6, price: 360.00 },
      { name: "City Whole.", time: "Today", min: 10, rating: 4.4, price: 380.00 },
    ],
    savings: 800.00,
    marginIncrease: "+8%"
  },
  {
    name: "Sunflower Oil - 1L",
    demand: "Stable",
    stock: "Critical",
    category: "Essentials",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300",
    suppliers: [
      { name: "PureMart", time: "2 hrs", min: 30, rating: 4.7, price: 149.00, best: true, aiRec: true },
      { name: "OilHub", time: "4 hrs", min: 50, rating: 4.5, price: 158.00 },
      { name: "Healthy Oils", time: "Tomorrow", min: 100, rating: 4.8, price: 142.00, fastest: false },
    ],
    savings: 450.00,
    marginIncrease: "+15%"
  }
];

const SIDEBAR_SECTIONS = [
  {
    title: "MAIN",
    items: [
      { id: "home", label: "Dashboard", icon: Home, active: true },
      { id: "ai-insights", label: "AI Insights", icon: BrainCircuit, badge: "New" },
      { id: "nearby", label: "Nearby Suppliers", icon: Map },
      { id: "comparison", label: "Price Compare", icon: Layers },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { id: "inventory", label: "Smart Inventory", icon: Box, alert: true },
      { id: "orders", label: "Live Orders", icon: ClipboardList },
      { id: "deliveries", label: "Tracking", icon: TruckFast },
    ],
  },
  {
    title: "BUSINESS",
    items: [
      { id: "analytics", label: "Analytics", icon: BarChart2 },
      { id: "finances", label: "Finances", icon: DollarSign },
      { id: "messages", label: "Messages", icon: MessageSquare, count: 6 },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

const quickActions = [
  { id: 1, label: 'Find Products', icon: Search, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 2, label: 'Compare Prices', icon: Filter, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 3, label: 'Nearby Suppliers', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 4, label: 'My Orders', icon: ShoppingBag, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 5, label: 'Saved Suppliers', icon: Heart, color: 'text-orange-400', bg: 'bg-orange-50' },
  { id: 6, label: 'Messages', icon: MessageSquare, color: 'text-pink-500', bg: 'bg-pink-50', badge: 2 },
];

const categories = [
  { id: 1, label: 'Dairy & Milk', count: '125+ Products', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80' },
  { id: 2, label: 'Groceries', count: '320+ Products', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80' },
  { id: 3, label: 'Snacks & Branded Foods', count: '150+ Products', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=300&q=80' },
  { id: 4, label: 'Beverages', count: '80+ Products', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80' },
  { id: 5, label: 'Personal Care', count: '200+ Products', image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=300&q=80' },
  { id: 6, label: 'Household Needs', count: '180+ Products', image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=300&q=80' },
  { id: 7, label: 'Cleaning Essentials', count: '120+ Products', image: 'https://images.unsplash.com/photo-1584820927498-cafe8c1c969e?auto=format&fit=crop&w=300&q=80' },
];

const comparisonData = [
  { id: 1, supplier: 'FreshFarm Wholesale', logo: 'FW', price: '₹26.00', moq: '50 Pouches', delivery: '30 mins', deliveryType: 'Express', rating: 4.8, reviews: 125, isBestDeal: true, isConnected: true },
  { id: 2, supplier: 'Aavin Distributors', logo: 'AD', price: '₹28.00', moq: '40 Pouches', delivery: '1 Hour', rating: 4.5, reviews: 98, isConnected: false },
  { id: 3, supplier: 'Daily Needs Supplier', logo: 'DN', price: '₹29.00', moq: '60 Pouches', delivery: '2 Hours', rating: 4.2, reviews: 76, isConnected: false },
  { id: 4, supplier: 'Sri Balaji Traders', logo: 'SB', price: '₹30.50', moq: '60 Pouches', delivery: '3 Hours', rating: 4.0, reviews: 45, isConnected: false },
];

const mockData = {
  chartData: [
    { name: 'Mon', orders: 40, price: 12 }, { name: 'Tue', orders: 30, price: 11 },
    { name: 'Wed', orders: 60, price: 14 }, { name: 'Thu', orders: 45, price: 13 },
    { name: 'Fri', orders: 70, price: 15 }, { name: 'Sat', orders: 90, price: 16 },
    { name: 'Sun', orders: 85, price: 15 },
  ],
  categories: [
    { title: 'Electronics & Tech', tag: 'High Demand', count: '1,245', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80', items: ['Phone Cases', 'Charging Cables', 'Power Banks', 'Earbuds'] },
    { title: 'Fashion & Lifestyle', tag: 'Trending', count: '2,341', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80', items: ['Shoes', 'Watches', 'Bags', 'Clothing'] },
    { title: 'Home & Kitchen', tag: 'Stable', count: '1,112', img: 'https://images.unsplash.com/photo-1556910103-1c02745a872f?w=400&q=80', items: ['Appliances', 'Cookware', 'Storage', 'Decor'] },
    { title: 'Grocery & Essentials', tag: 'High Demand', count: '3,456', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80', items: ['Oils & Ghee', 'Pulses & Rice', 'Spices', 'Snacks'] },
  ],
  popularProducts: [
    { name: 'boAt Airdopes 141', brand: 'Earbuds', stock: 'In Stock', demand: 'High', rating: 4.6, reviews: 320, wholesale: 899, margin: '60%', delivery: '1-2 Days', supplier: 'GadgetHub', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80' },
    { name: 'Mi Power Bank 20000mAh', brand: 'Power Banks', stock: 'In Stock', demand: 'Very High', rating: 4.7, reviews: 256, wholesale: 1299, margin: '45%', delivery: '1-3 Days', supplier: 'TechWorld', img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80' },
    { name: 'Amul Pure Ghee 1L', brand: 'Dairy Products', stock: 'In Stock', demand: 'High', rating: 4.8, reviews: 512, wholesale: 430, margin: '22%', delivery: '1-2 Days', supplier: 'DairyMart', img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80' },
    { name: 'Tata Tea Premium 1kg', brand: 'Beverages', stock: 'In Stock', demand: 'High', rating: 4.5, reviews: 819, wholesale: 230, margin: '18%', delivery: '2-3 Days', supplier: 'FreshGrocer', img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80' },
    { name: 'Aashirvaad Atta 5kg', brand: 'Staples', stock: 'Low Stock', demand: 'Very High', rating: 4.7, reviews: 630, wholesale: 215, margin: '15%', delivery: '1-2 Days', supplier: 'Sri Balaji', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },
  ],
  nearbySellers: [
    { name: 'GadgetHub Wholesale', type: 'Electronics', rating: 4.6, distance: '1.2 km', online: true, products: '1,200+', img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=80' },
    { name: 'DairyMart Suppliers', type: 'Dairy Products', rating: 4.7, distance: '2.5 km', online: true, products: '850+', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80' },
    { name: 'Sri Balaji Traders', type: 'Groceries', rating: 4.4, distance: '3.1 km', online: false, products: '2,500+', img: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&q=80' },
    { name: 'FreshGrocer Hub', type: 'Fruits & Veggies', rating: 4.3, distance: '5.0 km', online: true, products: '400+', img: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400&q=80' },
  ],
  suppliers: [
    { name: 'DairyMart Suppliers', since: '2019', rating: 4.8, success: '98%', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' },
    { name: 'TechWorld Distributors', since: '2014', rating: 4.7, success: '96%', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80' },
    { name: 'Sri Balaji Traders', since: '2012', rating: 4.6, success: '97%', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&q=80' },
  ]
};

const nearbySellers = [
  { name: "GadgetHub Wholesale", category: "Electronics", distance: "1.2 km", products: "1,200+", rating: 4.6 , img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=80' },
  { name: "DairyMart Suppliers", category: "Dairy Products", distance: "2.5 km", products: "850+", rating: 4.7  ,img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80' },
  { name: "Sri Balaji Traders", category: "Groceries & Staples", distance: "3.1 km", products: "2,500+", rating: 4.4 ,img: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&q=80' },
  { name: "FreshGrocer Hub", category: "Fruits & Vegetables", distance: "5.8 km", products: "600+", rating: 4.3 ,img: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400&q=80' }
];

// --- COMPONENTS ---

const Header = () => (
  <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 h-[72px] flex items-center px-6  transition-all">
    
    <div className="flex items-center justify-between w-full max-w-[1600px] mx-auto gap-5">
      <div className="flex-1 max-w-full relative group pe-[55px]">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
        <div className="relative flex items-center w-full bg-slate-100/80 hover:bg-white border border-transparent hover:border-slate-300/60 rounded-xl transition-all shadow-sm">
          <Search size={18} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search AI recommendations, suppliers, products..."
            className="w-full h-10 pl-10 pr-24 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 font-medium"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded shrink-0 shadow-sm">⌘ K</kbd>
            <button className="p-1.5 text-slate-400 hover:text-purple-600 bg-white rounded-md border border-slate-200 shadow-sm transition-colors">
              <Mic size={14} />
            </button>
          </div>
        </div>
      </div>
      {/* Search Bar - Enterprise Style */}


      {/* Right Actions */}
      <div className="flex items-center gap-3 shrink-0">
                <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200/80 rounded-full px-4 py-1 shadow-sm text-[13px] font-bold text-slate-700 cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all">
                  <Globe className="w-4 h-4 text-slate-400" />
                  English
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-full cursor-pointer hover:bg-slate-100 transition-colors">
          <MapPin size={14} className="text-indigo-600" />
          <span className="text-[12px] font-bold text-slate-700">Chennai South</span>
          <ChevronDown size={14} className="text-slate-400" />
        </div>

        <div className="w-px h-6 bg-slate-200 mx-1"></div>

        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
          <Settings size={20} className="text-purple-600" />
        </button>

        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">4</span>
        </button>

        <div className="flex items-center gap-2 pl-2 cursor-pointer group">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" className="w-8 h-8 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200 group-hover:ring-purple-400 transition-all" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  </header>
);


const ShopByCategories = () => (
  <section className="bg-white rounded-2xl p-6 my-5 shadow-sm border border-gray-100">
    <SectionHeader title="Shop by Categories" actionLabel="View All" />
    <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <motion.div 
          whileHover={{ y: -4 }}
          key={cat.id} 
          className="min-w-[140px] flex flex-col items-center cursor-pointer group"
        >
          <div className="w-32 h-32 rounded-2xl bg-gray-50 mb-3 overflow-hidden border border-gray-100 group-hover:border-pink-200 group-hover:shadow-lg transition-all relative">
            <img src={cat.image} alt={cat.label} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
          </div>
          <span className="text-sm font-bold text-gray-900 text-center leading-tight mb-1">{cat.label}</span>
          <span className="text-[11px] text-gray-500 font-medium">{cat.count}</span>
        </motion.div>
      ))}
    </div>
  </section>
);

const QuickActions = () => (
  <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {quickActions.map((action) => (
        <motion.div
          whileHover={{ y: -2, scale: 1.02 }}
          key={action.id}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-pink-200 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white group relative"
        >
          <div className={`${action.bg} ${action.color} p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
            <action.icon className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-gray-700 text-center">{action.label}</span>
          {action.badge && (
            <span className="absolute top-3 right-3 bg-[#FF2D7A] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {action.badge}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  </section>
);

const Sidebar = () => (
  <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-slate-200/60 hidden lg:flex flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
    <div className="flex-1 overflow-y-auto no-scrollbar py-6 flex flex-col gap-8">
      {/* Logo */}
      <div className="px-6 flex items-center gap-3 cursor-pointer group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
          S
        </div>
        <span className="text-[20px] font-black tracking-tight text-slate-900">StockLinker</span>
      </div>

      {/* Nav */}
      <nav className="px-4 space-y-8">
        {SIDEBAR_SECTIONS.map((sec, idx) => (
          <div key={idx}>
            <h4 className="px-3 text-[10px] font-bold text-slate-400 tracking-widest mb-3 uppercase">{sec.title}</h4>
            <ul className="space-y-1">
              {sec.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                      item.active
                        ? "text-purple-700 bg-purple-50/80 shadow-sm border border-purple-100/50"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {item.active && (
                      <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-6 bg-purple-600 rounded-r-full" />
                    )}
                    <item.icon size={18} className={item.active ? "text-purple-600" : "text-slate-400 group-hover:text-slate-600 transition-colors"} strokeWidth={item.active ? 2.5 : 2} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && <span className="bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">{item.badge}</span>}
                    {item.alert && <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>}
                    {item.count && <span className="bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">{item.count}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
    
  </aside>
);

const ComparePrices = () => (
  <section className="bg-white rounded-2xl p-6 my-5 shadow-sm border border-gray-100">
    <SectionHeader title="Compare Prices & Choose Best Deal" actionLabel="View All" />
    <div className="flex gap-6">
      <div className="w-64 border border-gray-100 rounded-2xl  flex flex-col items-center relative overflow-hidden bg-gray-50/50">
        <div className="w-full h-75 mb-4 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify- p-2">
            <img src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80" alt="Aavin Milk" className="h-full object-contain mix-blend-multiply" />
        </div>
        <h3 className="font-bold text-gray-900 text-center mb-1">Aavin Milk</h3>
        <p className="text-xs text-gray-500 mb-4">500ml Pouch</p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="pb-3 font-medium">Supplier</th>
              <th className="pb-3 font-medium text-center">Price</th>
              <th className="pb-3 font-medium text-center">MOQ</th>
              <th className="pb-3 font-medium text-center">Delivery Time</th>
              <th className="pb-3 font-medium text-center">Rating</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group relative">
                <td className="py-4">
                  {row.isBestDeal && (
                    <div className="absolute left-0 top-0 -ml-2 mt-2 bg-[#FF2D7A] text-white text-[9px] font-bold px-2 py-0.5 rounded-r-md transform -rotate-12 shadow-sm">
                      Best Deal
                    </div>
                  )}
                  <div className="flex items-center gap-3 pl-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {row.logo}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{row.supplier}</p>
                      {row.isConnected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full mt-0.5">
                          <CheckCircle className="w-3 h-3" /> Connected
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <span className={`font-bold text-base ${row.isBestDeal ? 'text-[#FF2D7A]' : 'text-gray-900'}`}>{row.price}</span>
                </td>
                <td className="py-4 text-center text-gray-600">{row.moq}</td>
                <td className="py-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-gray-900">{row.delivery}</span>
                    {row.deliveryType && <span className="text-[10px] text-gray-500">{row.deliveryType}</span>}
                  </div>
                </td>
                <td className="py-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-yellow-500 font-bold">
                      <Star className="w-4 h-4 fill-current" /> {row.rating}
                    </div>
                    <span className="text-[10px] text-gray-400">({row.reviews})</span>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-[#FF2D7A] hover:border-[#FF2D7A] transition-colors bg-white">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-[#FF2D7A] hover:border-[#FF2D7A] transition-colors bg-white">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="bg-[#FF2D7A] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-pink-600 transition-colors shadow-sm">
                      Order Now
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
            View More Suppliers <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </section>
);

const SectionHeader = ({ title, actionLabel }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    {actionLabel && (
      <button className="text-[#FF2D7A] text-sm font-semibold hover:underline flex items-center gap-1">
        {actionLabel}
      </button>
    )}
  </div>
);


export default function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-900 flex">
      <Sidebar />
      
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
         <Header />
        <main className="flex-1 p-8 overflow-x-hidden">
          
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5"
                          >
                            <div>
                              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
                                Welcome back, Boomathi! <span className="inline-block origin-bottom-right hover:rotate-12 transition-transform cursor-default">👋</span>
                              </h1>
                              <p className="text-neutral-500 mt-2 text-sm md:text-base">Here's what's happening with your business today.</p>
                            </div>
                          </motion.div>
          <QuickActions />
          <ShopByCategories/>
          

          {/* PRODUCT CATEGORY ECOSYSTEM */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Product Category Ecosystem</h3>
              <button className="text-xs font-semibold text-indigo-600 hover:underline">View All Categories →</button>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {mockData.categories.map((cat, idx) => (
                <motion.div key={idx} whileHover={{ y: -4 }} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <img src={cat.img} alt={cat.title} className="w-16 h-16 object-cover rounded-lg" />
                    <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full">{cat.tag}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">{cat.title}</h4>
                  <ul className="text-xs text-gray-500 space-y-1 mb-4">
                    {cat.items.map((item, i) => <li key={i} className="flex items-center gap-1"><span className="w-1 h-1 bg-gray-300 rounded-full"></span> {item}</li>)}
                  </ul>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-xs text-gray-500">
                    <span className="font-semibold text-gray-900">{cat.count} <span className="font-normal text-gray-500">Products</span></span>
                    <span>14 Subcategories</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* POPULAR PRODUCTS INTELLIGENCE */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Popular Products Intelligence</h3>
              <button className="text-xs font-semibold text-indigo-600 hover:underline">View All Products →</button>
            </div>
            <div className="grid grid-cols-5 gap-5">
              {mockData.popularProducts.map((prod, idx) => (
                <motion.div key={idx} whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm relative group">
                  {idx === 0 && <span className="absolute top-3 left-3 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded">Best Seller</span>}
                  <div className="h-32 w-full flex items-center justify-center mb-4">
                    <img src={prod.img} alt={prod.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs mb-1 truncate">{prod.name}</h4>
                  <p className="text-[10px] text-gray-500 mb-3">{prod.brand}</p>
                  
                  <div className="flex justify-between text-[10px] mb-2">
                    <span className="text-gray-500">Stock Status</span>
                    <span className={prod.stock === 'In Stock' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>{prod.stock}</span>
                  </div>
                  <div className="flex justify-between text-[10px] mb-2">
                    <span className="text-gray-500">Market Demand</span>
                    <span className="text-red-500 font-semibold">{prod.demand}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-yellow-400"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/></div>
                    <span className="text-[10px] text-gray-500">{prod.rating} ({prod.reviews})</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 mb-4 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Wholesale Price</span>
                      <span className="font-bold text-gray-900">₹{prod.wholesale}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Retail Margin</span>
                      <span className="font-bold text-green-600">₹{Math.floor(prod.wholesale * 1.4)} ({prod.margin})</span>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg hover:bg-indigo-600 hover:text-white transition-colors">
                    Compare Prices
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <ComparePrices/>

      {/* 5. NEARBY SELLERS NETWORK */}
      <div>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-semibold text-slate-900">Nearby Sellers Network</h3>
          <button className="text-sm text-indigo-600 font-medium hover:underline">View All Sellers →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {nearbySellers.map((seller, i) => (
            <Card key={i} className="overflow-hidden group">
              <div className="h-24 bg-slate-200 relative">
                 <img src={seller.img} alt="" className='h-25 w-full object-cover' />
                 <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-emerald-600 flex items-center gap-1 shadow-sm">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Online
                 </div>
              </div>
              <div className="p-4 pt-0">
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center -mt-6 mb-2 relative z-10">
                   <Store size={20} className="text-indigo-600"/>
                </div>
                <h4 className="font-bold text-sm text-slate-900 truncate">{seller.name}</h4>
                <p className="text-xs text-slate-500 mb-3">{seller.category}</p>
                
                <div className="flex items-center gap-3 text-xs text-slate-600 mb-4">
                   <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400"/> {seller.rating}</span>
                   <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                   <span className="flex items-center gap-1"><MapPin size={12} className="text-slate-400"/> {seller.distance}</span>
                   <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                   <span>{seller.products} Prod.</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <button className="col-span-1 py-1.5 rounded border border-slate-200 text-xs font-medium text-slate-600 flex items-center justify-center gap-1 hover:bg-slate-50"><Phone size={12}/> Call</button>
                  <button className="col-span-1 py-1.5 rounded border border-slate-200 text-xs font-medium text-slate-600 flex items-center justify-center gap-1 hover:bg-slate-50"><MessageSquare size={12}/> Msg</button>
                  <button className="col-span-1 py-1.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-medium flex items-center justify-center hover:bg-indigo-100">Visit</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

          {/* SUPPLIERS SECTION */}
          <div className="grid grid-cols-2 gap-6 my-8">
            {/* Trusted Suppliers */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Trusted Suppliers</h3>
                <button className="text-xs font-semibold text-indigo-600 hover:underline">View All →</button>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 space-y-2">
                {mockData.suppliers.map((sup, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                    <div className="flex items-center gap-4">
                      <img src={sup.img} alt="Supplier" className="w-12 h-12 rounded-full border border-gray-200" />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{sup.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span>Since {sup.since}</span>
                          <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-current"/> {sup.rating}</span>
                          <span className="flex items-center gap-1 text-green-600"><ShieldCheck className="w-3 h-3"/> {sup.success} Success</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-100"><Phone className="w-4 h-4"/></button>
                      <button className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-100"><MessageSquare className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Suppliers */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Connected Suppliers</h3>
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl h-[calc(100%-2rem)] flex flex-col items-center justify-center  text-center hover:border-indigo-300 hover:bg-indigo-50/30 transition cursor-pointer">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">No Connected Suppliers Yet</h4>
                <p className="text-xs text-gray-500 mb-6 max-w-xs">Connect with trusted suppliers to start placing orders and get better deals.</p>
                <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-sm">
                  Add Your First Supplier
                </button>
              </div>
            </div>
          </div>

          {/* REORDER & RECENTLY VIEWED */}
          <div className="grid grid-cols-12 gap-6 mb-8">
            <div className="col-span-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Recently Viewed</h3>
                <button className="text-xs font-semibold text-indigo-600 hover:underline">View All →</button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {mockData.popularProducts.slice(0, 4).map((prod, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col items-center text-center">
                    <img src={prod.img} alt={prod.name} className="h-20 object-contain mb-3" />
                    <h4 className="font-bold text-xs text-gray-900 truncate w-full">{prod.name}</h4>
                    <p className="text-lg font-bold text-gray-900 mt-2">₹{prod.wholesale}</p>
                    <p className="text-[10px] text-gray-500">{prod.supplier}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-span-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Quick Reorder</h3>
                <button className="text-xs font-semibold text-indigo-600 hover:underline">View All →</button>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
                {[mockData.popularProducts[2], mockData.popularProducts[4], mockData.popularProducts[3]].map((prod, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={prod.img} alt={prod.name} className="w-10 h-10 object-contain border border-gray-100 rounded" />
                      <div>
                        <h4 className="font-semibold text-xs text-gray-900 truncate w-32">{prod.name}</h4>
                        <p className="text-[10px] text-gray-500">{prod.supplier}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">₹{prod.wholesale}</span>
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs">-</button>
                        <span className="px-2 text-xs font-medium border-x border-gray-200">10</span>
                        <button className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs">+</button>
                      </div>
                      <button className="w-7 h-7 bg-indigo-600 text-white rounded flex items-center justify-center hover:bg-indigo-700">
                        <ShoppingCart className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-2 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100 transition">
                  Add All To Cart
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}