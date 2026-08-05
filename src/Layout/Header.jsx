import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Mic, Bell, Settings, ChevronDown, 
  Menu, X, Check, Clock, Loader2, Package, 
  LayoutGrid, Store, ChevronRight, Users, MessageSquare, Sparkles, Truck,
  User, LogOut, MonitorSmartphone 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../Authentication/services/api';
import {dashboardApi, notificationApi} from '../Shopkeeper_Home/Services/api'
import { useAuth } from '../Authentication/context/AuthContext';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Helper to get 2 initials safely
const getInitials = (name) => {
  if (!name || name === "Loading...") return "US";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
};

// ==========================================
// REUSABLE SUBCOMPONENTS
// ==========================================
const Logo = memo(() => (
  <div className="flex items-center gap-2.5 cursor-pointer group">
    <div className="relative w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm overflow-hidden border border-slate-800 transition-transform duration-300 group-hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-sky-400 opacity-20 blur-[4px] group-hover:opacity-30 transition-opacity" />
      <svg className="w-[18px] h-[18px] text-white relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7V4a2 2 0 012-2h3m0 0l-3 3m3-3L6 5M20 7v10a2 2 0 01-2 2h-3m0 0l3-3m-3 3l2-2M4 17v3a2 2 0 002 2h3m-7-5l3 3m-3-3l2-2" />
        <circle cx="12" cy="12" r="2" fill="currentColor" className="text-pink-500" />
      </svg>
    </div>
    <span className="text-[19px] font-[800] tracking-tight text-slate-900 leading-none">
      STOCK<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-sky-500">LINKER</span>
    </span>
  </div>
));

const PremiumIconButton = memo(({ children, onClick, badge, active }) => (
  <motion.button
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 border shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-pink-500/30
      ${active 
        ? 'bg-slate-100 border-slate-200 text-slate-900 shadow-[inset_0_2px_4px_rgba(15,23,42,0.02)]' 
        : 'bg-white border-slate-200/60 text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
      }`}
  >
    {children}
    {badge > 0 && (
      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
        {badge > 9 ? '9+' : badge}
      </span>
    )}
  </motion.button>
));

// ==========================================
// SMART SEARCH BAR
// ==========================================
const SmartSearchBar = ({ isMobile }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ products: [], categories: [], sellers: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ products: [], categories: [], sellers: [] });
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await dashboardApi.globalSearch(query);
        setResults(data);
        setShowDropdown(data.products.length > 0 || data.categories.length > 0 || data.sellers.length > 0);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleProductClick = (product) => {
    setShowDropdown(false);
    navigate('/Compare', { state: { openModal: true, selectedProduct: { id: product.id, name: product.name } } });
  };
  const handleCategoryClick = (parentCategoryId) => {
    setShowDropdown(false);
    navigate('/category', { state: { selectedCategoryId: parentCategoryId } });
  };
  const handleSellerClick = (businessProfileId) => {
    setShowDropdown(false);
    navigate(`/storefront/${businessProfileId}`);
  };

  return (
    <div className="relative w-full z-50" ref={dropdownRef}>
      <div className={`relative flex items-center group w-full ${isMobile ? 'h-11 md:h-10' : 'h-10'}`}>
        <div className={`relative flex items-center w-full bg-slate-50/80 border border-slate-200/60 shadow-[inset_0_1px_2px_rgba(15,23,42,0.02)] focus-within:bg-white focus-within:border-pink-500/40 focus-within:shadow-[0_4px_12px_rgba(236,72,153,0.08)] transition-all overflow-hidden ${isMobile ? 'rounded-2xl md:rounded-xl' : 'rounded-xl'}`}>
          <Search size={18} className="absolute left-3 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (query.trim().length >= 2) setShowDropdown(true); }}
            placeholder={isMobile ? "Search..." : "Search products, suppliers, categories..."}
            className={`w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-medium pl-10 pr-12 ${isMobile ? 'h-11 md:h-10 text-[15px] md:text-[14px]' : 'h-10 text-[14px]'}`}
          />
          <div className="absolute right-2 flex items-center">
            {isSearching ? <Loader2 className="w-4 h-4 text-pink-400 animate-spin mr-2" /> : <Mic size={14} className="text-slate-400" />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} 
            className="absolute top-[calc(100%+8px)] left-0 w-full bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[16px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden z-[100] max-h-[400px] overflow-y-auto p-1.5 space-y-1"
          >
            {results.products.length > 0 && (
              <div className="mb-2">
                <div className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Products</div>
                {results.products.map(p => (
                  <button key={`prod-${p.id}`} onClick={() => handleProductClick(p)} className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors"><Package size={14} /></div>
                      <span className="font-semibold text-slate-700 text-[13px] group-hover:text-pink-600 transition-colors truncate">{p.name}</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {results.categories.length > 0 && (
              <div className="mb-2">
                <div className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Categories</div>
                {results.categories.map(c => (
                  <button key={`cat-${c.id}`} onClick={() => handleCategoryClick(c.parentCategoryId)} className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors"><LayoutGrid size={14} /></div>
                      <div className="text-left overflow-hidden">
                        <span className="block font-semibold text-[13px] text-slate-700 group-hover:text-pink-600 transition-colors truncate">{c.name}</span>
                        <span className="block text-[10px] font-medium text-slate-400">{c.type === 'SUBCATEGORY' ? 'Sub-Category' : 'Main Category'}</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {results.sellers.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Partners</div>
                {results.sellers.map(s => (
                  <button key={`sel-${s.businessProfileId}`} onClick={() => handleSellerClick(s.businessProfileId)} className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors"><Store size={14} /></div>
                      <div className="text-left overflow-hidden">
                        <span className="block font-semibold text-[13px] text-slate-700 group-hover:text-pink-600 transition-colors truncate">{s.businessName}</span>
                        <span className="block text-[10px] font-medium text-slate-400 truncate">{s.location}</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// MAIN HEADER COMPONENT
// ==========================================

export default function Header({ open, setOpen }) {
  const navigate = useNavigate(); 
  
  // Auth Context
  const { logout, logoutAll, isAuthenticated } = useAuth(); 

  const [notifOpen, setNotifOpen] = useState(false);
  const [profOpen, setProfOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Profile State (Fetched securely from DB, stored locally in Header)
  const [profileData, setProfileData] = useState({ 
    ownerName: 'Loading...', 
    role: 'Loading...', 
    businessProfileId: null 
  });

  const notifRef = useRef(null);
  const profRef = useRef(null);

  // 1. Fetch Profile Data directly from DB
  useEffect(() => {
    let isMounted = true;

    const fetchProfileFromDB = async () => {
      try {
        const res = await profileApi.getProfile();
        if (isMounted) {
          const data = res.data.data;
          setProfileData({
            ownerName: data.ownerName || 'User',
            role: data.businessType || 'Partner',
            businessProfileId: data.businessProfileId || ''
          });
        }
      } catch (err) {
        console.error("Failed to load profile from DB", err);
      }
    };

    if (isAuthenticated) fetchProfileFromDB();

    return () => { isMounted = false; };
  }, [isAuthenticated]);

  // 2. Load Notifications & STOMP Hook
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadNotifications = async () => {
      try {
        const res = await notificationApi.getNotifications();
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    };
    loadNotifications();

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws', null, { withCredentials: true }),
      onConnect: () => {
        client.subscribe('/user/queue/notifications', (message) => {
          const newNotif = JSON.parse(message.body);
          setNotifications(prev => [newNotif, ...prev]);
          setUnreadCount(prev => prev + 1);
        });
      }
    });
    client.activate();
    
    return () => client.deactivate();
  }, [isAuthenticated]);

  // 3. Handlers
  const handleNotificationClick = async (notif) => {
    setNotifOpen(false); 
    if (!notif.read) {
      try {
        await notificationApi.markAsRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (e) {}
    }
    if (notif.type === 'ORDER') navigate('/orders');
    else if (notif.type === 'CONNECTION') navigate('/network');
    else if (notif.type === 'MESSAGE') navigate('/message');
    else if (notif.type === 'ENQUIRY') navigate('/compare');
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {}
  };

  const handleMenuAction = (action) => {
    setProfOpen(false);
    action();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profRef.current && !profRef.current.contains(e.target)) setProfOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type) => {
    switch(type) {
      case 'ORDER': return <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Truck size={14}/></div>;
      case 'CONNECTION': return <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><Users size={14}/></div>;
      case 'MESSAGE': return <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><MessageSquare size={14}/></div>;
      case 'ENQUIRY': return <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><Sparkles size={14}/></div>;
      default: return <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0"><Bell size={14}/></div>;
    }
  };

  const calculateTimeAgo = (dateStr) => {
    const minutes = Math.floor((new Date() - new Date(dateStr)) / 60000);
    if (minutes < 60) return `${minutes || 1}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <>
      {/* DESKTOP HEADER */}
      <header className="hidden lg:flex fixed top-0 inset-x-0 h-[72px] z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 items-center">
        <div className="w-[280px] 2xl:w-[300px] h-full flex items-center px-6 border-r border-slate-200/80 shrink-0"><Logo /></div>
        <div className="flex-1 w-full max-w-[480px] xl:max-w-[560px] ml-6 xl:ml-8 relative"><SmartSearchBar isMobile={false} /></div>

        <div className="ml-auto flex items-center gap-3 px-6 shrink-0">
          
          {/* NOTIFICATION BELL */}
          <div className="relative" ref={notifRef}>
            <PremiumIconButton badge={unreadCount} active={notifOpen} onClick={() => { setNotifOpen(!notifOpen); setProfOpen(false); }}>
              <Bell size={18} strokeWidth={2} className={notifOpen ? 'fill-slate-900/10 text-slate-900' : ''} />
            </PremiumIconButton>
            
            <AnimatePresence>
              {notifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className="absolute right-0 top-[calc(100%+12px)] w-[380px] bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200/80 shadow-[0_24px_48px_-12px_rgba(15,23,42,0.15)] overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-[14px] font-[700] text-slate-900 tracking-tight">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-[12px] font-[600] text-sky-500 hover:text-sky-600 transition-colors flex items-center gap-1">
                        <Check size={14} /> Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-col max-h-[360px] overflow-y-auto overscroll-contain no-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 text-[13px] font-medium">You're all caught up!</div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => handleNotificationClick(notif)}
                          className={`px-5 py-3.5 flex gap-3.5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0 group ${!notif.read ? 'bg-sky-50/30' : ''}`}
                        >
                          {getNotifIcon(notif.type)}
                          <div className="flex-1 min-w-0 pt-0.5">
                            <p className="text-[13px] text-slate-800 font-bold leading-tight truncate">{notif.title}</p>
                            <p className="text-[12px] text-slate-500 mt-1 line-clamp-2 leading-snug">{notif.message}</p>
                            <div className="flex items-center gap-1.5 mt-2 text-slate-400">
                              <Clock size={10} />
                              <p className="text-[10px] font-medium">{calculateTimeAgo(notif.createdAt)}</p>
                            </div>
                          </div>
                          {!notif.read && <div className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0 shadow-sm" />}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <PremiumIconButton onClick={() => navigate('/settings')} active={false}><Settings size={18} strokeWidth={2} /></PremiumIconButton>
          <div className="h-8 w-[1px] bg-slate-200 mx-2" />

          {/* DYNAMIC PROFILE DROPDOWN */}
          <div className="relative" ref={profRef}>
            <button 
              onClick={() => { setProfOpen(!profOpen); setNotifOpen(false); }} 
              className={`flex items-center gap-3 p-1.5 pr-3 rounded-2xl border transition-all focus:outline-none
                ${profOpen ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-transparent border-transparent hover:border-slate-200 hover:bg-slate-50'}
              `}
            >
              <div className="w-9 h-9 rounded-[12px] flex items-center justify-center text-[13px] font-bold text-white bg-gradient-to-br from-slate-700 to-slate-900 shadow-sm shrink-0">
                {getInitials(profileData.ownerName)}
              </div>
              <div className="text-left hidden xl:block">
                <p className="text-[14px] font-[700] text-slate-900 leading-none">{profileData.ownerName}</p>
                <p className="text-[12px] mt-1.5 text-slate-500 font-[500] leading-none capitalize">{profileData.role}</p>
              </div>
              <ChevronDown size={14} className="text-slate-400 ml-1 hidden xl:block" />
            </button>
            
            <AnimatePresence>
              {profOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="absolute right-0 top-[calc(100%+12px)] w-64 bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200/80 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.1)] overflow-hidden"
                >
                  <div className="px-4 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 font-bold flex items-center justify-center text-[14px] shadow-sm shrink-0">
                      {getInitials(profileData.ownerName)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[14px] font-[700] text-slate-900 leading-tight truncate">{profileData.ownerName}</p>
                      <p className="text-[12px] text-slate-500 font-medium capitalize mt-0.5 truncate">{profileData.role}</p>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        if(profileData.businessProfileId) {
                          handleMenuAction(() => navigate(`/storefront/${profileData.businessProfileId}`));
                        }
                      }} 
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[13px] font-[600] rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors group"
                    >
                      <User size={16} className="text-slate-400 group-hover:text-slate-700" /> My Profile
                    </button>
                    <div className="h-[1px] bg-slate-100 mx-2 my-1" />
                    <button onClick={() => handleMenuAction(logout)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[13px] font-[600] rounded-xl hover:bg-rose-50 text-rose-600 transition-colors">
                      <LogOut size={16} /> Log Out
                    </button>
                    <button onClick={() => handleMenuAction(logoutAll)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[13px] font-[600] rounded-xl hover:bg-rose-50 text-rose-600 transition-colors mt-0.5">
                      <MonitorSmartphone size={16} /> Log out of all devices
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* TABLET / MOBILE HEADER */}
      <div className="block lg:hidden w-full relative z-40">
        <motion.header
          className="fixed flex items-center justify-between px-3 md:px-5 shadow-[0_8px_32px_rgba(15,23,42,0.06)]"
          initial={false}
          animate={{
            top: 12, left: 12, right: 12, height: isScrolled ? 60 : (window.innerWidth >= 768 ? 72 : 68),
            borderRadius: isScrolled ? 20 : 24, backgroundColor: isScrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: isScrolled ? '0 12px 40px -12px rgba(15,23,42,0.12), inset 0 0 0 1px rgba(255,255,255,0.8)' : '0 8px 30px -10px rgba(15,23,42,0.08), inset 0 0 0 1px rgba(255,255,255,0.8)'
          }}
        >
          <motion.div animate={{ scale: isScrolled ? 0.95 : 1 }} className="shrink-0"><Logo /></motion.div>
          <div className="hidden md:block flex-1 max-w-[280px] mx-6"><SmartSearchBar isMobile={true} /></div>
          
          <div className="flex items-center gap-2">
            <PremiumIconButton badge={unreadCount} onClick={() => { setNotifOpen(!notifOpen); setProfOpen(false); }}><Bell size={18} strokeWidth={2} /></PremiumIconButton>
            
            {/* Tablet Profile Trigger */}
            <div className="hidden md:flex relative" ref={profRef}>
               <button onClick={() => { setProfOpen(!profOpen); setNotifOpen(false); }} className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white font-bold flex items-center justify-center text-[13px] shadow-sm">
                 {getInitials(profileData.ownerName)}
               </button>
            </div>

            <PremiumIconButton onClick={() => setOpen(!open)} active={open}><AnimatePresence mode="wait">{open ? <motion.div key="close"><X size={20}/></motion.div> : <motion.div key="menu"><Menu size={20}/></motion.div>}</AnimatePresence></PremiumIconButton>
          </div>
        </motion.header>
      </div>
    </>
  );
}