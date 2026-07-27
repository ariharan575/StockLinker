// components/Layout/MainLayout.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { Header, Sidebar } from "../Shopkeeper_Home/layout";
import { C, FONT_BODY } from "../Shopkeeper_Home/common";

export default function MainLayout({ 
  children, 
  activeNav = "home",
  breadcrumbItems = [],
  maxWidth = 1400,
  showBreadcrumb = true,
  customStyles = {},
  pageBackground = C.page,
  breadcrumbBackground = "white",
  breadcrumbBorder = "#e5e7eb",
  contentPadding = "px-4 md:px-6 lg:px-8 py-5"
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle navigation
  const handleNavClick = (path) => {
    navigate(path);
  };

  // Get current page title from breadcrumb
  const getCurrentPageTitle = () => {
    if (breadcrumbItems.length > 0) {
      const lastItem = breadcrumbItems[breadcrumbItems.length - 1];
      return lastItem.label || lastItem;
    }
    return "";
  };

  // Default breadcrumb items if none provided
  const defaultBreadcrumb = [
    { label: "Home", path: "/" },
    { label: "Nearbyseller", path: "/nearbyseller" },
    { label: "Compare Prices", isCurrent: true }
  ];

  const items = breadcrumbItems.length > 0 ? breadcrumbItems : defaultBreadcrumb;

  return (
    <div
      style={{
        backgroundColor: pageBackground,
        minHeight: "100vh",
        fontFamily: FONT_BODY,
        color: C.body,
        ...customStyles
      }}
    >
      <style>{`
        * {
          -webkit-font-smoothing: antialiased;
        }

        .breadcrumb-bar {
          position: sticky;
          top: 55px;
          z-index: 30;
          background: ${breadcrumbBackground};
          border-bottom: 1px solid ${breadcrumbBorder};
        }

        .main-area {
          padding-top: 0px;
        }

        .settings-layout .breadcrumb-bar {
          background: #F8FAFC;
          border-bottom: 1px solid #e2e8f0;
        }

        /* Custom scrollbar styles */
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.3);
        }
      `}</style>

      {/* HEADER */}
      <Header 
        open={sidebarOpen} 
        setOpen={setSidebarOpen} 
      />

      {/* SIDEBAR */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        active={activeNav}
        setActive={() => {}}
      />

      {/* MAIN */}
      <div
        className={`pt-16 ${
          activeNav === "settings"
            ? "lg:pl-62"
            :
          activeNav === "messages"  
            ? "lg:pl-56 "
            : "lg:pl-60"
        }`}
      >        
        {/* Breadcrumb */}
        {showBreadcrumb && (
          <div className={`breadcrumb-bar lg:hidden ${activeNav === "settings" ? "pl-[24px]" : activeNav === "messages" && "lg:pl-[48px] pt-[8px]"}`}>
            <div
              className={`${contentPadding} py-1.5 sm:py-2`}
              style={{
                maxWidth: maxWidth,
                margin: "0 auto",
              }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium py-1 flex-wrap">
                {items.map((item, index) => {
                  const isLast = index === items.length - 1;
                  const isClickable = item.path && !item.isCurrent;

                  return (
                    <React.Fragment key={index}>
                      <span
                        className={`
                          ${isClickable ? "text-slate-500 hover:text-slate-900 cursor-pointer transition-colors" : ""}
                          ${isLast ? "bg-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-slate-900 font-semibold text-[11px] sm:text-[13px] shadow-sm border border-slate-200 capitalize" : ""}
                        `}
                        onClick={() => isClickable && handleNavClick(item.path)}
                      >
                        {item.label || item}
                      </span>

                      {!isLast && (
                        <ChevronRight size={14} className="text-slate-400" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main
          className={contentPadding}
          style={{
            maxWidth: maxWidth,
            margin: "0 auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}