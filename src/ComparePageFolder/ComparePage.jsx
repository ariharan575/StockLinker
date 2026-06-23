import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

import { Footer, Header, Sidebar } from "../HomePageFolder/layout";
import ComparePrice from "../Compare";
import { C, FONT_BODY } from "../HomePageFolder/common";

export default function ComparePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  return (
    <div
      style={{
        backgroundColor: C.page,
        minHeight: "100vh",
        fontFamily: FONT_BODY,
        color: C.body,
      }}
    >
      <style>{`
        * {
          -webkit-font-smoothing: antialiased;
        }

        .breadcrumb-bar {
          position: sticky;
          top: 64px;
          z-index: 30;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .main-area {
          padding-top: 0px;
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
        setActive={setActiveNav}
      />

      {/* MAIN */}
      <div className="pt-16 lg:pl-60">
        
        {/* breadcrumb only inside main */}
        <div className="breadcrumb-bar">
          <div
            className="px-4 md:px-6 lg:px-8 py-4"
            style={{
              maxWidth: 1400,
              margin: "0 auto",
            }}
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-slate-500 hover:text-slate-900 cursor-pointer">
                Home
              </span>

              <ChevronRight size={15} className="text-slate-400" />

              <span className="text-slate-500 hover:text-slate-900 cursor-pointer">
                Smartphones
              </span>

              <ChevronRight size={15} className="text-slate-400" />

              <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-900 font-semibold text-[13px]">
                Compare Prices
              </span>
            </div>
          </div>
        </div>

        <main
          className="px-4 md:px-6 lg:px-8 py-5"
          style={{
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          <ComparePrice />
        </main>

        <Footer />
      </div>
    </div>
  );
}