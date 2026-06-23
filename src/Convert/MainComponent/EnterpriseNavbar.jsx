/* =========================================================
SAAS LEVEL ENTERPRISE NAVBAR
Ultra Modern • Responsive • Animated • Premium UX
========================================================= */

import React, { useState, useEffect } from "react";

import {
  Search,
  Bell,
  Settings2,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  Users2,
  ShoppingBag,
  BarChart3,
  ShieldCheck,
  Command,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

export default function EnterpriseNavbar() {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    {
      title: "Customers",
      icon: Users2,
    },
    {
      title: "Orders",
      icon: ShoppingBag,
    },
    {
      title: "Analytics",
      icon: BarChart3,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      

      {/* GLASS BACKDROP */}
      <div className="absolute inset-0 bg-white/70 dark:bg-[#050816]/70 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10" />

      {/* GRADIENT LINE */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />

      <div className="relative max-w-[1600px] mx-auto">

        <div className="h-[84px] px-4 md:px-6 lg:px-10 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-10">

            {/* LOGO */}
            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              className="flex items-center gap-4 cursor-pointer"
            >

              <motion.div
                whileHover={{
                  rotate: 10,
                }}
                className="
                  relative
                  w-14
                  h-14
                  rounded-2xl
                  bg-gradient-to-br
                  from-pink-500
                  via-rose-500
                  to-orange-400
                  flex
                  items-center
                  justify-center
                  shadow-[0_10px_35px_rgba(236,72,153,0.45)]
                  overflow-hidden
                "
              >

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4),transparent_50%)]" />

                <Sparkles
                  size={24}
                  className="text-white relative z-10"
                />
              </motion.div>

              <div className="hidden sm:block">

                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  StockLinker
                </h1>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Enterprise Commerce Platform
                </p>
              </div>
            </motion.div>

            {/* DESKTOP NAV */}
            <nav className="hidden xl:flex items-center gap-2">

              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.button
                    key={item.title}
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className={`
                      relative
                      h-12
                      px-5
                      rounded-2xl
                      flex
                      items-center
                      gap-3
                      text-sm
                      font-semibold
                      transition-all
                      duration-300
                      ${
                        item.active
                          ? "bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 text-white shadow-lg shadow-pink-500/25"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                      }
                    `}
                  >

                    <Icon size={18} />

                    {item.title}

                    {item.active && (
                      <motion.div
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 rounded-2xl border border-white/10"
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* SEARCH */}
            <div className="hidden lg:flex items-center">

              <motion.div
                whileHover={{
                  y: -1,
                }}
                className="
                  relative
                  flex
                  items-center
                  w-[320px]
                  h-14
                  rounded-2xl
                  border
                  border-slate-200
                  dark:border-white/10
                  bg-slate-100/80
                  dark:bg-white/[0.04]
                  overflow-hidden
                "
              >

                <div className="absolute left-4">

                  <Search
                    size={18}
                    className="text-slate-400"
                  />
                </div>

                <input
                  placeholder="Search anything..."
                  className="
                    w-full
                    h-full
                    bg-transparent
                    outline-none
                    pl-12
                    pr-20
                    text-sm
                    text-slate-700
                    dark:text-white
                    placeholder:text-slate-400
                  "
                />

                <div className="absolute right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] text-slate-500">
                  <Command size={12} />
                  K
                </div>
              </motion.div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="hidden md:flex items-center gap-3">

              <ActionButton icon={Bell} />

              <ActionButton icon={Settings2} />

              <motion.button
                whileHover={{
                  rotate: 15,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() => setDarkMode(!darkMode)}
                className="
                  relative
                  w-14
                  h-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-pink-500
                  via-rose-500
                  to-orange-400
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-[0_10px_35px_rgba(236,72,153,0.35)]
                  overflow-hidden
                "
              >

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_40%)]" />

                {darkMode ? (
                  <Sun size={20} className="relative z-10" />
                ) : (
                  <Moon size={20} className="relative z-10" />
                )}
              </motion.button>
            </div>

            {/* PROFILE */}
            <div className="relative hidden md:block">

              <motion.button
                whileHover={{
                  y: -2,
                }}
                onClick={() => setProfileOpen(!profileOpen)}
                className="
                  h-14
                  pl-3
                  pr-4
                  rounded-2xl
                  border
                  border-slate-200
                  dark:border-white/10
                  bg-white/70
                  dark:bg-white/[0.04]
                  flex
                  items-center
                  gap-3
                  transition-all
                  duration-300
                  hover:border-pink-500/30
                "
              >

                <div className="relative">

                  <div className="
                    w-11
                    h-11
                    rounded-xl
                    bg-gradient-to-br
                    from-sky-500
                    via-cyan-500
                    to-blue-600
                    flex
                    items-center
                    justify-center
                    text-white
                    font-bold
                    shadow-lg
                  ">
                    SK
                  </div>

                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#050816]" />
                </div>

                <div className="text-left">

                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Surya Kumar
                  </p>

                  <p className="text-xs text-slate-500">
                    Enterprise Admin
                  </p>
                </div>

                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform duration-300 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              {/* PROFILE DROPDOWN */}
              <AnimatePresence>

                {profileOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="
                      absolute
                      top-[74px]
                      right-0
                      w-[320px]
                      rounded-3xl
                      border
                      border-slate-200
                      dark:border-white/10
                      bg-white
                      dark:bg-[#0B1120]
                      backdrop-blur-2xl
                      shadow-[0_25px_80px_rgba(0,0,0,0.18)]
                      overflow-hidden
                    "
                  >

                    <div className="p-5 border-b border-slate-200 dark:border-white/10">

                      <div className="flex items-center gap-4">

                        <div className="
                          w-16
                          h-16
                          rounded-2xl
                          bg-gradient-to-br
                          from-pink-500
                          via-rose-500
                          to-orange-400
                          flex
                          items-center
                          justify-center
                          text-white
                          font-black
                          text-lg
                        ">
                          SK
                        </div>

                        <div>

                          <h3 className="font-black text-slate-900 dark:text-white">
                            Surya Kumar
                          </h3>

                          <p className="text-sm text-slate-500 mt-1">
                            surya@stocklinker.com
                          </p>

                          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold border border-emerald-500/20">
                            <ShieldCheck size={12} />
                            Verified Account
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 space-y-1">

                      <DropdownItem label="My Profile" />
                      <DropdownItem label="Workspace Settings" />
                      <DropdownItem label="Billing & Plans" />
                      <DropdownItem label="Team Management" />

                    </div>

                    <div className="p-3 border-t border-slate-200 dark:border-white/10">

                      <button className="
                        w-full
                        h-12
                        rounded-2xl
                        bg-gradient-to-r
                        from-pink-500
                        via-rose-500
                        to-orange-400
                        text-white
                        font-bold
                        shadow-lg
                      ">
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="
                md:hidden
                w-12
                h-12
                rounded-2xl
                border
                border-slate-200
                dark:border-white/10
                bg-slate-100
                dark:bg-white/[0.05]
                flex
                items-center
                justify-center
                text-slate-700
                dark:text-white
              "
            >
              {mobileMenu ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>

          {mobileMenu && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="
                md:hidden
                px-4
                pb-4
              "
            >

              <div className="
                rounded-3xl
                border
                border-slate-200
                dark:border-white/10
                bg-white
                dark:bg-[#0B1120]
                overflow-hidden
                shadow-xl
              ">

                <div className="p-4 border-b border-slate-200 dark:border-white/10">

                  <div className="
                    flex
                    items-center
                    gap-3
                    h-14
                    rounded-2xl
                    bg-slate-100
                    dark:bg-white/[0.04]
                    px-4
                  ">

                    <Search
                      size={18}
                      className="text-slate-400"
                    />

                    <input
                      placeholder="Search..."
                      className="
                        bg-transparent
                        outline-none
                        flex-1
                        text-sm
                        text-slate-700
                        dark:text-white
                      "
                    />
                  </div>
                </div>

                <div className="p-3 space-y-2">

                  {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.title}
                        className={`
                          w-full
                          h-14
                          rounded-2xl
                          flex
                          items-center
                          gap-4
                          px-4
                          transition-all
                          duration-300
                          ${
                            item.active
                              ? "bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300"
                          }
                        `}
                      >

                        <Icon size={20} />

                        <span className="font-semibold">
                          {item.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

/* =========================================================
ACTION BUTTON
========================================================= */

function ActionButton({ icon: Icon }) {
  return (
    <motion.button
      whileHover={{
        y: -2,
      }}
      whileTap={{
        scale: 0.95,
      }}
      className="
        relative
        w-14
        h-14
        rounded-2xl
        border
        border-slate-200
        dark:border-white/10
        bg-white/70
        dark:bg-white/[0.04]
        flex
        items-center
        justify-center
        text-slate-700
        dark:text-white
        overflow-hidden
        transition-all
        duration-300
        hover:border-pink-500/20
      "
    >

      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-pink-500/[0.04] to-sky-500/[0.04]" />

      <Icon size={20} className="relative z-10" />
    </motion.button>
  );
}

/* =========================================================
DROPDOWN ITEM
========================================================= */

function DropdownItem({ label }) {
  return (
    <motion.button
      whileHover={{
        x: 4,
      }}
      className="
        w-full
        h-12
        px-4
        rounded-2xl
        text-left
        text-sm
        font-semibold
        text-slate-700
        dark:text-slate-300
        hover:bg-slate-100
        dark:hover:bg-white/[0.05]
        transition-all
        duration-300
      "
    >
      {label}
    </motion.button>
  );
}