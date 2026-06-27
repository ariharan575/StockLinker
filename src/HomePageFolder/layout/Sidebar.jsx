import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from "react-router-dom";

import { NAV_ITEMS } from '../data';
import { FONT_BODY } from '../common/constants';

export default function Sidebar({ open, setOpen, active, setActive }) {

    const navigate = useNavigate();
    const location = useLocation();
  
  return (
    <>
      {/* OVERLAY FOR MOBILE */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 z-40 flex flex-col
          bg-gradient-to-b from-[#0f1b2d] via-[#132a44] to-[#101426] mt-3.5 border-r border-white/[0.04]
          transition-transform duration-300 ease-in-out rounded-r-xl
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
        }}
      >
        {/* NAV */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, Icon, badge, path }) => {
            const isActive = active === id;

            return (
              <motion.button
                key={id}
                onClick={() => {
                  setActive(id);
                  if (window.innerWidth < 1024) setOpen(false);
                  navigate(path);
                }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium relative group transition-all duration-200
                  ${isActive
                    ? "text-white bg-white/[0.08] border border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
                    : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
                  }
                `}
                style={{ fontFamily: FONT_BODY }}
              >
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200 ${
                    isActive ? "text-white" : "text-white/40 group-hover:text-white/80"
                  }`}
                />
                <span className="flex-1 text-left tracking-wide">{label}</span>
                {badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                      isActive ? "bg-white/20 text-white" : "bg-indigo-500/15 text-indigo-300 group-hover:bg-indigo-500/25"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* LOGOUT SECTION */}
        <div className="p-4 border-t border-white/[0.04] mt-auto">
          <motion.button
            onClick={() => console.log("Logout clicked")}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium relative group transition-all duration-200 text-white/70 hover:text-red-400 hover:bg-red-500/[0.08] border border-transparent"
            style={{ fontFamily: FONT_BODY }}
          >
            <svg
              className="w-[18px] h-[18px] flex-shrink-0 text-white/40 group-hover:text-red-400/80 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="flex-1 text-left tracking-wide">Logout</span>
          </motion.button>
        </div>
      </aside>
    </>
  );
}