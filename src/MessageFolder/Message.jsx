import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

import { Footer, Header, Sidebar } from "../HomePageFolder/layout";
import MessagePage from "./MessagePage";
import { C, FONT_BODY } from "../HomePageFolder/common";

export default function Nearby() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  return (
    <div
      className="overflow-hidden w-full"
      style={{
        backgroundColor: C.page,
        height: "100vh", // Strict 100vh to prevent browser scrolling
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
        <main
          className="px-4 md:px-6 lg:px-8 py-5 flex flex-col overflow-hidden w-full"
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            // Exact calculation: viewport height minus header height (64px)
            height: "calc(100vh - 64px)",
          }}
        >
          {/* MessagePage will now correctly expand to fill this exact box 
            without pushing the parent height or triggering page scroll 
          */}
          <MessagePage/>
        </main>
      </div>
    </div>
  );
}