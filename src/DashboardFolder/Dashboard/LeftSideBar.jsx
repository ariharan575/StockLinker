// LeftSideBar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Building2, 
  Package, 
  FileText, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Activity,
  Menu,
  X
} from 'lucide-react';

// Navigation Configuration
const navigationConfig = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Orders', path: '/orders', icon: ShoppingCart },
    ]
  },
  {
    section: 'Network',
    items: [
      { label: 'Retailers', path: '/retailers', icon: Users },
      { label: 'Wholesalers', path: '/wholesalers', icon: Building2 },
      { label: 'Inventory', path: '/inventory', icon: Package },
    ]
  },
  {
    section: 'System',
    items: [
      { label: 'Reports', path: '/reports', icon: FileText },
      { label: 'Settings', path: '/settings', icon: Settings },
      { label: 'Support', path: '/support', icon: HelpCircle },
    ]
  }
];

// Sidebar Item Component
const SidebarItem = ({ item, isCollapsed, isActive }) => {
  const { label, path, icon: Icon } = item;

  return (
    <div className="relative group px-3">
      <Link
        to={path}
        aria-label={label}
        className={`
          flex items-center gap-3 px-4 py-3 h-[44px] rounded-xl transition-all duration-200 ease-out outline-none relative
          focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]
          ${isActive
            ? 'bg-[#6366F1]/15 text-white'
            : 'text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] hover:translate-x-[4px]'
          }
          ${isCollapsed ? 'justify-center px-0' : 'justify-start'}
        `}
      >
        {/* Active Left Indicator Bar */}
        {isActive && !isCollapsed && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#6366F1] rounded-r-full" />
        )}

        <Icon
          size={20}
          className={`shrink-0 transition-colors duration-200 ${
            isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'
          }`}
        />

        {!isCollapsed && (
          <span className="text-[14px] font-medium tracking-[0.01em] whitespace-nowrap overflow-hidden font-sans">
            {label}
          </span>
        )}
      </Link>

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div 
          className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 bg-[#1E293B] text-white text-[13px] font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-xl whitespace-nowrap border border-slate-700"
          role="tooltip"
        >
          {label}
        </div>
      )}
    </div>
  );
};

// Desktop Sidebar Component
const DesktopSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`
        hidden lg:flex flex-col h-screen bg-[#0F172A] border-r border-[#1E293B] sticky top-0
        transition-[width] duration-300 ease-in-out relative z-40 shrink-0
        ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}
      `}
      aria-label="Main Navigation"
    >
      {/* Logo Section */}
      <div className="h-[80px] shrink-0 flex items-center justify-center px-4 border-b border-[#1E293B]">
        <div className={`flex items-center gap-3 w-full ${isCollapsed ? 'justify-center' : 'justify-start px-2'}`}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shrink-0 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <Activity size={18} strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap">
              <span className="text-white font-semibold text-base tracking-tight leading-tight font-sans">StockLinker</span>
              <span className="text-[11px] text-indigo-400 font-medium uppercase tracking-[0.1em] mt-0.5">Marketplace</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {navigationConfig.map((section, idx) => (
          <div key={idx} className="flex flex-col space-y-1">
            {!isCollapsed && (
              <h3 className="px-7 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.1em] font-sans">
                {section.section}
              </h3>
            )}
            {section.items.map((item) => (
              <SidebarItem
                key={item.label}
                item={item}
                isCollapsed={isCollapsed}
                isActive={location.pathname.startsWith(item.path)}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-24 w-7 h-7 flex items-center justify-center bg-[#1E293B] border border-slate-700 text-slate-300 rounded-full hover:bg-slate-700 hover:text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 z-50 shadow-md"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!isCollapsed}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};

// Mobile Drawer Component
const MobileDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden
          transition-opacity duration-300 ease-in-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[280px] bg-[#0F172A] z-50 lg:hidden flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Header */}
        <div className="h-[80px] flex items-center justify-between px-6 border-b border-[#1E293B] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              <Activity size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold text-base tracking-tight leading-tight font-sans">StockLinker</span>
              <span className="text-[11px] text-indigo-400 font-medium uppercase tracking-[0.1em] mt-0.5">Marketplace</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {navigationConfig.map((section, idx) => (
            <div key={idx} className="flex flex-col space-y-1">
              <h3 className="px-7 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.1em] font-sans">
                {section.section}
              </h3>
              {section.items.map((item) => (
                <SidebarItem
                  key={item.label}
                  item={item}
                  isCollapsed={false}
                  isActive={location.pathname.startsWith(item.path)}
                />
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

// Main LeftSideBar Component (Responsive Layout Structure)
const LeftSideBar = ({ children }) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-500/30">
      {/* Desktop/Laptop Fixed & Collapsible Sidebar */}
      <DesktopSidebar />

      {/* Tablet/Mobile Overlay Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="lg:hidden h-[60px] bg-white border-b border-slate-200 flex items-center px-4 shrink-0 shadow-sm z-30">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Open menu"
            aria-expanded={isMobileDrawerOpen}
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 font-semibold text-slate-800 tracking-tight">StockLinker</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeftSideBar;