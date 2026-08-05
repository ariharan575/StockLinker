import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import BottomNavigation from "./BottomNavigation";
import { C, FONT_BODY } from "./common";
import Navbar from '../Landing/Sections/Navbar'

export default function MainLayout({ 
  children, 
  activeNav = "home",
  maxWidth = 1400,
  customStyles = {},
  pageBackground = C.page,
  contentPadding = ""
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(path);
  };

  const PREMIUM_EASE = [0.16, 1, 0.3, 1];
const TRANSITION_ENTERPRISE = { duration: 0.5, ease: PREMIUM_EASE };
  const TRANSITION_MICRO = { duration: 0.3, ease: "easeOut" };

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

        .main-area {
          padding-top: 0px;
        }

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

      {/* MAIN CONTENT WRAPPER */}
      <div
        className={`pt-[75px] lg:pt-16 pb-20 lg:pb-0 ${
          activeNav === "settings"
            ? "lg:pl-62"
            : 
          activeNav === "messages"  
            ? "lg:pl-56"
            : "2xl:pl-[280px] lg:pl-[260px] "
        }`}
      >        
        {/* Main Content */}
        <main className={`${contentPadding} w-full`}>
          {children}
        </main>
      </div>

      {/* BOTTOM NAVIGATION (Responsive Injection) */}
      <BottomNavigation active={activeNav} />
    </div>
  );
}