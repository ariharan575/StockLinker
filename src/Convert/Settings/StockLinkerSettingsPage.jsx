// ============================================================================
// STOCKLINKER ENTERPRISE SETTINGS PAGE
// React JS + Vite + Tailwind + Framer Motion
// FILE: SettingsPage.jsx
// ============================================================================

"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Store,
  User,
  Building2,
  Truck,
  Bell,
  Palette,
  Users,
  ChevronRight,
  Moon,
  Sun,
  Sparkles,
  ShieldCheck,
  Package2,
  Boxes,
  MapPinned,
  Clock3,
  Camera,
  Pencil,
  TrendingUp,
  ShoppingBag,
  Languages,
  Save,
  LogOut,
  Menu,
  X,
  BellRing,
  Warehouse,
  CircleUserRound,
  Smartphone,
  Laptop,
  Monitor,
  CheckCircle2,
  PackageCheck,
  Activity,
  MapPin,
  Mail,
  Phone,
  Building,
  Layers3,
  BadgeCheck,
  TimerReset,
  Eye,
  UserCog,
  BriefcaseBusiness,
} from "lucide-react";

// ============================================================================
// UTIL
// ============================================================================

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// SIDEBAR MENU
// ============================================================================

const MENU = [
  {
    id: "account",
    label: "Account",
    icon: User,
  },

  {
    id: "business",
    label: "Business",
    icon: Building2,
  },

  {
    id: "delivery",
    label: "Store & Delivery",
    icon: Truck,
  },

  {
    id: "inventory",
    label: "Products & Inventory",
    icon: Boxes,
  },

  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },

  {
    id: "appearance",
    label: "Appearance & Language",
    icon: Palette,
  },

  {
    id: "team",
    label: "Team Details",
    icon: Users,
  },
];

// ============================================================================
// INFO ROW
// ============================================================================

function InfoRow({
  darkMode,
  label,
  value,
}) {
  return (
    <div
      className={cn(
        `
        py-4
        border-b
        transition-all
        duration-300
        `,
        darkMode
          ? "border-white/6"
          : "border-zinc-200"
      )}
    >
      <p
        className={cn(
          `
          text-[12px]
          font-semibold
          tracking-wide
          uppercase
          `,
          darkMode
            ? "text-zinc-500"
            : "text-zinc-400"
        )}
      >
        {label}
      </p>

      <h3
        className={cn(
          `
          mt-2
          text-[15px]
          md:text-[16px]
          font-bold
          `,
          darkMode
            ? "text-white"
            : "text-zinc-900"
        )}
      >
        {value}
      </h3>
    </div>
  );
}

// ============================================================================
// DEVICE CARD
// ============================================================================

function DeviceCard({
  darkMode,
  icon: Icon,
  name,
  browser,
  status,
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
        scale: 1.01,
      }}
      transition={{
        duration: 0.25,
      }}
      className={cn(
        `
        rounded-3xl
        border
        p-4
        transition-all
        duration-300
        shadow-xl
        `,
        darkMode
          ? `
            border-white/10
            bg-white/[0.04]
            hover:border-pink-500/30
            hover:bg-pink-500/[0.05]
          `
          : `
            border-zinc-200
            bg-white
            hover:border-pink-300
            hover:bg-pink-50/50
          `
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-sky-500/10
            text-sky-500
          "
        >
          <Icon size={20} />
        </div>

        <div className="flex-1">
          <h3
            className={cn(
              `
              text-sm
              font-bold
              `,
              darkMode
                ? "text-white"
                : "text-zinc-900"
            )}
          >
            {name}
          </h3>

          <p
            className={cn(
              `
              mt-1
              text-xs
              `,
              darkMode
                ? "text-zinc-400"
                : "text-zinc-500"
            )}
          >
            {browser}
          </p>
        </div>

        <div
          className="
            rounded-full
            bg-emerald-500/10
            px-3
            py-1
            text-[11px]
            font-bold
            text-emerald-400
          "
        >
          {status}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// SMALL STATS CARD
// ============================================================================

function StatsCard({
  darkMode,
  title,
  value,
  icon: Icon,
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.3,
      }}
      className={cn(
        `
        rounded-[28px]
        border
        p-4
        shadow-xl
        transition-all
        duration-300
        `,
        darkMode
          ? `
            border-white/10
            bg-white/[0.04]
            hover:border-pink-500/20
            hover:bg-pink-500/[0.04]
          `
          : `
            border-zinc-200
            bg-white
            hover:border-pink-200
            hover:bg-pink-50/40
          `
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              `
              text-[12px]
              font-semibold
              `,
              darkMode
                ? "text-zinc-400"
                : "text-zinc-500"
            )}
          >
            {title}
          </p>

          <h3
            className={cn(
              `
              mt-2
              text-2xl
              font-black
              `,
              darkMode
                ? "text-white"
                : "text-zinc-900"
            )}
          >
            {value}
          </h3>
        </div>

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-2xl
            bg-sky-500/10
            text-sky-500
          "
        >
          <Icon size={18} />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN
// ============================================================================

export default function SettingsPage() {
  const [darkMode, setDarkMode] =
    useState(true);

  const [active, setActive] =
    useState("account");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  // ==========================================================================
  // MAIN CONTENT
  // ==========================================================================

  function renderContent() {
    // ==========================================================================
    // ACCOUNT
    // ==========================================================================

    if (active === "account") {
      return (
        <motion.div
          key="account"
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -10,
          }}
          transition={{
            duration: 0.45,
          }}
          className="space-y-5"
        >
          {/* PROFILE */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.1,
            }}
            className={cn(
              `
              relative
              overflow-hidden
              rounded-[34px]
              border
              p-5
              md:p-6
              shadow-2xl
              `,
              darkMode
                ? `
                  border-white/10
                  bg-[#0b1220]/80
                `
                : `
                  border-zinc-200
                  bg-white
                `
            )}
          >
            {/* BG */}

            <div
              className="
                absolute
                right-0
                top-0
                h-[280px]
                w-[280px]
                rounded-full
                bg-pink-500/10
                blur-[120px]
              "
            />

            {/* TOP */}

            <div
              className="
                relative
                flex
                flex-col
                gap-6
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* LEFT */}

              <div className="flex items-center gap-5">
                <motion.div
                  whileHover={{
                    scale: 1.03,
                  }}
                  className="relative"
                >
                  <div
                    className="
                      flex
                      h-24
                      w-24
                      items-center
                      justify-center
                      rounded-[30px]
                      bg-gradient-to-br
                      from-sky-500
                      via-pink-500
                      to-rose-500
                      text-white
                      shadow-[0_30px_60px_rgba(236,72,153,0.35)]
                    "
                  >
                    <Store size={36} />
                  </div>

                  <button
                    className="
                      absolute
                      -bottom-2
                      -right-2
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-2xl
                      bg-sky-500
                      text-white
                      shadow-xl
                    "
                  >
                    <Camera size={17} />
                  </button>
                </motion.div>

                {/* DETAILS */}

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2
                      className={cn(
                        `
                        text-2xl
                        md:text-3xl
                        font-black
                        tracking-tight
                        `,
                        darkMode
                          ? "text-white"
                          : "text-zinc-900"
                      )}
                    >
                      Ajith Traders
                    </h2>

                    <div
                      className="
                        rounded-full
                        bg-emerald-500/10
                        px-3
                        py-1
                        text-[11px]
                        font-bold
                        text-emerald-400
                      "
                    >
                      VERIFIED
                    </div>
                  </div>

                  <p
                    className={cn(
                      `
                      mt-3
                      text-sm
                      `,
                      darkMode
                        ? "text-zinc-400"
                        : "text-zinc-500"
                    )}
                  >
                    Enterprise wholesale marketplace
                    partner
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <div
                      className="
                        rounded-2xl
                        bg-sky-500/10
                        px-4
                        py-2
                        text-xs
                        font-bold
                        text-sky-400
                      "
                    >
                      Trust Score 92%
                    </div>

                    <div
                      className="
                        rounded-2xl
                        bg-pink-500/10
                        px-4
                        py-2
                        text-xs
                        font-bold
                        text-pink-400
                      "
                    >
                      Rank #12 Marketplace
                    </div>
                  </div>
                </div>
              </div>

              {/* BUTTON */}

              <button
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  bg-sky-500
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-xl
                  transition-all
                  duration-300
                  hover:scale-[1.03]
                "
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            </div>

            {/* SPACE */}

            <div className="h-7" />

            {/* CONTENT */}

            <div className="grid gap-5 xl:grid-cols-2">
              {/* LEFT */}

              <motion.div
                whileHover={{
                  y: -2,
                }}
                className={cn(
                  `
                  rounded-[30px]
                  border
                  p-5
                  shadow-xl
                  `,
                  darkMode
                    ? `
                      border-white/10
                      bg-white/[0.03]
                    `
                    : `
                      border-zinc-200
                      bg-zinc-50/70
                    `
                )}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3
                      className={cn(
                        `
                        text-lg
                        font-black
                        `,
                        darkMode
                          ? "text-white"
                          : "text-zinc-900"
                      )}
                    >
                      Account Information
                    </h3>

                    <p
                      className={cn(
                        `
                        mt-1
                        text-sm
                        `,
                        darkMode
                          ? "text-zinc-400"
                          : "text-zinc-500"
                      )}
                    >
                      Personal profile information
                    </p>
                  </div>

                  <button
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-2xl
                      bg-sky-500/10
                      text-sky-500
                    "
                  >
                    <Pencil size={16} />
                  </button>
                </div>

                <InfoRow
                  darkMode={darkMode}
                  label="Owner Name"
                  value="Ajith"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="User ID"
                  value="#SL-298219"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="Role"
                  value="Wholesaler"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="Email Address"
                  value="boomathi@gmail.com"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="Phone Number"
                  value="+91 9876543210"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="Year In Business"
                  value="12 Years"
                />
              </motion.div>

              {/* RIGHT */}

              <motion.div
                whileHover={{
                  y: -2,
                }}
                className={cn(
                  `
                  rounded-[30px]
                  border
                  p-5
                  shadow-xl
                  `,
                  darkMode
                    ? `
                      border-white/10
                      bg-white/[0.03]
                    `
                    : `
                      border-zinc-200
                      bg-zinc-50/70
                    `
                )}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3
                      className={cn(
                        `
                        text-lg
                        font-black
                        `,
                        darkMode
                          ? "text-white"
                          : "text-zinc-900"
                      )}
                    >
                      Devices & Sessions
                    </h3>

                    <p
                      className={cn(
                        `
                        mt-1
                        text-sm
                        `,
                        darkMode
                          ? "text-zinc-400"
                          : "text-zinc-500"
                      )}
                    >
                      Connected device tracking
                    </p>
                  </div>

                  <button
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-2xl
                      bg-pink-500/10
                      text-pink-500
                    "
                  >
                    <Eye size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <StatsCard
                    darkMode={darkMode}
                    title="Connected"
                    value="06"
                    icon={Smartphone}
                  />

                  <StatsCard
                    darkMode={darkMode}
                    title="Active"
                    value="04"
                    icon={Activity}
                  />
                </div>

                <div className="mt-5 space-y-4">
                  <DeviceCard
                    darkMode={darkMode}
                    icon={Laptop}
                    name="Windows Laptop"
                    browser="Chrome Browser"
                    status="ACTIVE"
                  />

                  <DeviceCard
                    darkMode={darkMode}
                    icon={Smartphone}
                    name="Samsung S24"
                    browser="Android App"
                    status="ACTIVE"
                  />

                  <DeviceCard
                    darkMode={darkMode}
                    icon={Monitor}
                    name="Office Desktop"
                    browser="Edge Browser"
                    status="ONLINE"
                  />
                </div>
              </motion.div>
            </div>

            {/* STATS */}

            <div
              className="
                mt-5
                grid
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
              "
            >
              <StatsCard
                darkMode={darkMode}
                title="Orders"
                value="12.4K"
                icon={ShoppingBag}
              />

              <StatsCard
                darkMode={darkMode}
                title="Products"
                value="2.4K"
                icon={Package2}
              />

              <StatsCard
                darkMode={darkMode}
                title="Deliveries"
                value="8.9K"
                icon={Truck}
              />

              <StatsCard
                darkMode={darkMode}
                title="Growth"
                value="+28%"
                icon={TrendingUp}
              />
            </div>
          </motion.div>
        </motion.div>
      );
    }

    // ==========================================================================
    // BUSINESS
    // ==========================================================================

    if (active === "business") {
      return (
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="grid gap-5 xl:grid-cols-2"
        >
          {/* BUSINESS */}

          <div
            className={cn(
              `
              rounded-[32px]
              border
              p-5
              shadow-xl
              `,
              darkMode
                ? `
                  border-white/10
                  bg-[#0b1220]/80
                `
                : `
                  border-zinc-200
                  bg-white
                `
            )}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  className={cn(
                    `
                    text-2xl
                    font-black
                    `,
                    darkMode
                      ? "text-white"
                      : "text-zinc-900"
                  )}
                >
                  Business Information
                </h2>

                <p
                  className={cn(
                    `
                    mt-2
                    text-sm
                    `,
                    darkMode
                      ? "text-zinc-400"
                      : "text-zinc-500"
                  )}
                >
                  Business identity details
                </p>
              </div>

              <button
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-sky-500/10
                  text-sky-500
                "
              >
                <Pencil size={17} />
              </button>
            </div>

            <InfoRow
              darkMode={darkMode}
              label="Owner Name"
              value="Ajith"
            />

            <InfoRow
              darkMode={darkMode}
              label="Company Name"
              value="Ajith Traders"
            />

            <InfoRow
              darkMode={darkMode}
              label="Business Type"
              value="Wholesale"
            />

            <InfoRow
              darkMode={darkMode}
              label="Category"
              value="Groceries & FMCG"
            />

            <InfoRow
              darkMode={darkMode}
              label="GST Number"
              value="29ABCDE1234F1Z5"
            />

            <InfoRow
              darkMode={darkMode}
              label="Operating Hours"
              value="7AM - 9PM"
            />
          </div>

          {/* CONTACT */}

          <div
            className={cn(
              `
              rounded-[32px]
              border
              p-5
              shadow-xl
              `,
              darkMode
                ? `
                  border-white/10
                  bg-[#0b1220]/80
                `
                : `
                  border-zinc-200
                  bg-white
                `
            )}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  className={cn(
                    `
                    text-2xl
                    font-black
                    `,
                    darkMode
                      ? "text-white"
                      : "text-zinc-900"
                  )}
                >
                  Contact Details
                </h2>

                <p
                  className={cn(
                    `
                    mt-2
                    text-sm
                    `,
                    darkMode
                      ? "text-zinc-400"
                      : "text-zinc-500"
                  )}
                >
                  Business communication details
                </p>
              </div>

              <button
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-sky-500/10
                  text-sky-500
                "
              >
                <Pencil size={17} />
              </button>
            </div>

            <InfoRow
              darkMode={darkMode}
              label="Phone Number"
              value="+91 9876543210"
            />

            <InfoRow
              darkMode={darkMode}
              label="Alternate Number"
              value="+91 9090909090"
            />

            <InfoRow
              darkMode={darkMode}
              label="Email Address"
              value="support@boomathi.com"
            />

            <InfoRow
              darkMode={darkMode}
              label="Location"
              value="Salem, Tamil Nadu"
            />

            <InfoRow
              darkMode={darkMode}
              label="Verification"
              value="Approved"
            />
          </div>
        </motion.div>
      );
    }

    // ==========================================================================
    // DELIVERY
    // ==========================================================================

    if (active === "delivery") {
      return (
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="space-y-5"
        >
          <div
            className={cn(
              `
              rounded-[32px]
              border
              p-5
              shadow-xl
              `,
              darkMode
                ? `
                  border-white/10
                  bg-[#0b1220]/80
                `
                : `
                  border-zinc-200
                  bg-white
                `
            )}
          >
            <div className="grid gap-5 xl:grid-cols-2">
              {/* ADDRESS */}

              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2
                      className={cn(
                        `
                        text-xl
                        font-black
                        `,
                        darkMode
                          ? "text-white"
                          : "text-zinc-900"
                      )}
                    >
                      Address Details
                    </h2>

                    <p
                      className={cn(
                        `
                        mt-1
                        text-sm
                        `,
                        darkMode
                          ? "text-zinc-400"
                          : "text-zinc-500"
                      )}
                    >
                      Store and warehouse address
                    </p>
                  </div>

                  <button
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-2xl
                      bg-sky-500/10
                      text-sky-500
                    "
                  >
                    <Pencil size={16} />
                  </button>
                </div>

                <InfoRow
                  darkMode={darkMode}
                  label="Address Line 1"
                  value="12 Market Street"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="Address Line 2"
                  value="Near Central Market"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="City"
                  value="Salem"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="District"
                  value="Salem"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="Pincode"
                  value="636007"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="Landmark"
                  value="Near Bus Stand"
                />
              </div>

              {/* DELIVERY */}

              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2
                      className={cn(
                        `
                        text-xl
                        font-black
                        `,
                        darkMode
                          ? "text-white"
                          : "text-zinc-900"
                      )}
                    >
                      Delivery Settings
                    </h2>

                    <p
                      className={cn(
                        `
                        mt-1
                        text-sm
                        `,
                        darkMode
                          ? "text-zinc-400"
                          : "text-zinc-500"
                      )}
                    >
                      Logistics configuration
                    </p>
                  </div>

                  <button
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-2xl
                      bg-sky-500/10
                      text-sky-500
                    "
                  >
                    <Pencil size={16} />
                  </button>
                </div>

                <InfoRow
                  darkMode={darkMode}
                  label="Delivery Radius"
                  value="60 KM"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="Minimum Order"
                  value="₹1,000"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="Delivery Charges"
                  value="₹50"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="Fast Delivery"
                  value="Enabled"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="Coverage Areas"
                  value="18 Locations"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="Average Delivery"
                  value="35 Minutes"
                />
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // ==========================================================================
    // INVENTORY
    // ==========================================================================

    if (active === "inventory") {
      return (
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="space-y-5"
        >
          <div
            className="
              grid
              gap-4
              md:grid-cols-2
              xl:grid-cols-4
            "
          >
            <StatsCard
              darkMode={darkMode}
              title="Categories"
              value="18"
              icon={Layers3}
            />

            <StatsCard
              darkMode={darkMode}
              title="Products"
              value="2480"
              icon={Package2}
            />

            <StatsCard
              darkMode={darkMode}
              title="Low Stock"
              value="28"
              icon={Activity}
            />

            <StatsCard
              darkMode={darkMode}
              title="Warehouse"
              value="06"
              icon={Warehouse}
            />
          </div>
        </motion.div>
      );
    }

    // ==========================================================================
    // NOTIFICATION
    // ==========================================================================

    if (active === "notifications") {
      return (
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="space-y-5"
        >
          <div
            className={cn(
              `
              rounded-[32px]
              border
              p-5
              shadow-xl
              `,
              darkMode
                ? `
                  border-white/10
                  bg-[#0b1220]/80
                `
                : `
                  border-zinc-200
                  bg-white
                `
            )}
          >
            <div
              className="
                flex
                flex-col
                gap-4
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className="
                    relative
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-[24px]
                    bg-gradient-to-br
                    from-sky-500
                    via-pink-500
                    to-rose-500
                    text-white
                    shadow-xl
                  "
                >
                  <BellRing size={28} />

                  <div
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-full
                      bg-red-500
                      text-[10px]
                      font-bold
                      text-white
                    "
                  >
                    9
                  </div>
                </div>

                <div>
                  <h2
                    className={cn(
                      `
                      text-2xl
                      font-black
                      `,
                      darkMode
                        ? "text-white"
                        : "text-zinc-900"
                    )}
                  >
                    Live Notification Center
                  </h2>

                  <p
                    className={cn(
                      `
                      mt-2
                      text-sm
                      `,
                      darkMode
                        ? "text-zinc-400"
                        : "text-zinc-500"
                    )}
                  >
                    Real-time marketplace and
                    delivery updates
                  </p>
                </div>
              </div>

              <button
                className="
                  rounded-2xl
                  bg-sky-500
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                "
              >
                View Alerts
              </button>
            </div>
          </div>
        </motion.div>
      );
    }

    // ==========================================================================
    // APPEARANCE
    // ==========================================================================

    if (active === "appearance") {
      return (
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="space-y-5"
        >
          <div
            className={cn(
              `
              rounded-[32px]
              border
              p-5
              shadow-xl
              `,
              darkMode
                ? `
                  border-white/10
                  bg-[#0b1220]/80
                `
                : `
                  border-zinc-200
                  bg-white
                `
            )}
          >
            <h2
              className={cn(
                `
                text-2xl
                font-black
                `,
                darkMode
                  ? "text-white"
                  : "text-zinc-900"
              )}
            >
              Appearance & Language
            </h2>

            {/* LANGUAGE */}

            <div className="mt-7">
              <h3
                className={cn(
                  `
                  mb-4
                  text-sm
                  font-bold
                  `,
                  darkMode
                    ? "text-zinc-300"
                    : "text-zinc-700"
                )}
              >
                Language
              </h3>

              <div className="flex flex-wrap gap-4">
                <button
                  className="
                    rounded-2xl
                    bg-sky-500
                    px-6
                    py-3
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  English
                </button>

                <button
                  className="
                    rounded-2xl
                    bg-pink-500
                    px-6
                    py-3
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  தமிழ்
                </button>
              </div>
            </div>

            {/* THEME */}

            <div className="mt-8">
              <h3
                className={cn(
                  `
                  mb-4
                  text-sm
                  font-bold
                  `,
                  darkMode
                    ? "text-zinc-300"
                    : "text-zinc-700"
                )}
              >
                Theme Mode
              </h3>

              <div
                className="
                  grid
                  gap-4
                  md:grid-cols-2
                "
              >
                <button
                  onClick={() =>
                    setDarkMode(true)
                  }
                  className={cn(
                    `
                    rounded-3xl
                    border
                    p-5
                    transition-all
                    duration-300
                    `,
                    darkMode
                      ? `
                        border-sky-500
                        bg-sky-500/10
                      `
                      : `
                        border-zinc-200
                      `
                  )}
                >
                  <Moon className="mx-auto" />

                  <h3 className="mt-4 font-bold">
                    Dark Mode
                  </h3>
                </button>

                <button
                  onClick={() =>
                    setDarkMode(false)
                  }
                  className={cn(
                    `
                    rounded-3xl
                    border
                    p-5
                    transition-all
                    duration-300
                    `,
                    !darkMode
                      ? `
                        border-pink-500
                        bg-pink-500/10
                      `
                      : `
                        border-zinc-200
                      `
                  )}
                >
                  <Sun className="mx-auto" />

                  <h3 className="mt-4 font-bold">
                    Light Mode
                  </h3>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // ==========================================================================
    // TEAM
    // ==========================================================================

    if (active === "team") {
      return (
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            grid
            gap-5
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {[
            {
              name: "Arun Kumar",
              role: "Manager",
            },

            {
              name: "Prakash",
              role: "Delivery Staff",
            },

            {
              name: "Ramesh",
              role: "Inventory Staff",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -5,
                scale: 1.01,
              }}
              className={cn(
                `
                rounded-[32px]
                border
                p-5
                shadow-xl
                transition-all
                duration-300
                `,
                darkMode
                  ? `
                    border-white/10
                    bg-[#0b1220]/80
                    hover:border-pink-500/20
                    hover:bg-pink-500/[0.04]
                  `
                  : `
                    border-zinc-200
                    bg-white
                  `
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-[24px]
                    bg-gradient-to-br
                    from-sky-500
                    via-pink-500
                    to-rose-500
                    text-white
                  "
                >
                  <CircleUserRound size={28} />
                </div>

                <div>
                  <h3
                    className={cn(
                      `
                      text-lg
                      font-black
                      `,
                      darkMode
                        ? "text-white"
                        : "text-zinc-900"
                    )}
                  >
                    {item.name}
                  </h3>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-sky-400
                      font-semibold
                    "
                  >
                    {item.role}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <InfoRow
                  darkMode={darkMode}
                  label="Phone"
                  value="+91 9876543210"
                />

                <InfoRow
                  darkMode={darkMode}
                  label="Status"
                  value="Active"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    }

    return null;
  }

  // ==========================================================================
  // MAIN
  // ==========================================================================

  return (
    <div
      className={cn(
        `
        relative
        min-h-screen
        overflow-hidden
        transition-all
        duration-500
        `,
        darkMode
          ? "bg-[#070b17]"
          : "bg-[#f5f7fb]"
      )}
    >
      {/* GRID */}

      <div
        className={cn(
          `
          absolute
          inset-0
          opacity-[0.03]
          `,
          darkMode
            ? `
              bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
            `
            : `
              bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)]
            `
        )}
        style={{
          backgroundSize: "60px 60px",
        }}
      />

      {/* BG */}

      <div
        className="
          absolute
          left-0
          top-0
          h-[420px]
          w-[420px]
          rounded-full
          bg-pink-500/10
          blur-[120px]
        "
      />

      <div
        className="
          absolute
          bottom-0
          right-0
          h-[420px]
          w-[420px]
          rounded-full
          bg-sky-500/10
          blur-[120px]
        "
      />

      {/* NAVBAR */}

      <header
        className={cn(
          `
          sticky
          top-0
          z-50
          border-b
          backdrop-blur-2xl
          `,
          darkMode
            ? `
              border-white/10
              bg-[#070b17]/80
            `
            : `
              border-zinc-200
              bg-white/80
            `
        )}
      >
        <div
          className="
            flex
            h-[76px]
            items-center
            justify-between
            px-4
            md:px-6
          "
        >
          {/* LEFT */}

          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setMobileOpen(true)
              }
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-white/5
                xl:hidden
              "
            >
              <Menu size={20} />
            </button>

            {/* LOGO */}

            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-[22px]
                  bg-gradient-to-br
                  from-sky-500
                  via-pink-500
                  to-rose-500
                  text-white
                  shadow-[0_20px_40px_rgba(236,72,153,0.35)]
                "
              >
                <Store size={22} />
              </div>

              <div>
                <h1
                  className={cn(
                    `
                    text-lg
                    font-black
                    `,
                    darkMode
                      ? "text-white"
                      : "text-zinc-900"
                  )}
                >
                  StockLinker
                </h1>

                <p
                  className={cn(
                    `
                    text-xs
                    `,
                    darkMode
                      ? "text-zinc-400"
                      : "text-zinc-500"
                  )}
                >
                  Enterprise Settings
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-3">
            <button
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-white/5
              "
            >
              <Bell size={18} />

              <div
                className="
                  absolute
                  right-1
                  top-1
                  h-2
                  w-2
                  rounded-full
                  bg-red-500
                "
              />
            </button>

            <button
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-sky-500
                text-white
                shadow-xl
              "
            >
              {darkMode ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* GAP */}

      <div className="h-3" />

      {/* BODY */}

      <div className="relative flex">
        {/* SIDEBAR */}

        <aside
          className={cn(
            `
            hidden
            xl:flex
            sticky
            top-[88px]
            h-[calc(100vh-110px)]
            w-[280px]
            flex-col
            px-4
            `,
            darkMode
              ? "bg-transparent"
              : "bg-transparent"
          )}
        >
          {/* SETTINGS */}

          <div className="mb-4 px-3">
            <h2
              className={cn(
                `
                text-xs
                font-black
                uppercase
                tracking-[0.18em]
                `,
                darkMode
                  ? "text-zinc-500"
                  : "text-zinc-400"
              )}
            >
              SETTINGS
            </h2>
          </div>

          {/* MENU */}

          <div className="space-y-2 overflow-y-auto pr-1">
            {MENU.map((item) => {
              const Icon = item.icon;

              const activeItem =
                active === item.id;

              return (
                <motion.button
                  whileHover={{
                    x: 4,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  key={item.id}
                  onClick={() =>
                    setActive(item.id)
                  }
                  className={cn(
                    `
                    group
                    flex
                    w-full
                    items-center
                    gap-4
                    rounded-2xl
                    px-4
                    py-3.5
                    transition-all
                    duration-300
                    `,
                    activeItem
                      ? `
                        bg-gradient-to-r
                        from-sky-500/15
                        via-pink-500/10
                        to-rose-500/15
                      `
                      : `
                        hover:bg-pink-500/[0.08]
                      `
                  )}
                >
                  <Icon
                    size={19}
                    className={cn(
                      `
                      transition-all
                      duration-300
                      `,
                      activeItem
                        ? "text-white"
                        : darkMode
                        ? `
                          text-zinc-400
                          group-hover:text-white
                        `
                        : `
                          text-zinc-700
                          group-hover:text-zinc-900
                        `
                    )}
                  />

                  <span
                    className={cn(
                      `
                      text-sm
                      font-bold
                      transition-all
                      duration-300
                      `,
                      activeItem
                        ? "text-white"
                        : darkMode
                        ? `
                          text-zinc-400
                          group-hover:text-white
                        `
                        : `
                          text-zinc-700
                          group-hover:text-zinc-900
                        `
                    )}
                  >
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* LOGOUT */}

          <div className="mt-auto pb-3 pt-5">
            <button
              className="
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-3xl
                bg-gradient-to-r
                from-rose-500
                to-red-500
                px-5
                py-4
                text-sm
                font-bold
                text-white
                shadow-xl
                transition-all
                duration-300
                hover:scale-[1.02]
              "
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* CONTENT */}

        <main className="min-w-0 flex-1 px-4 pb-10 md:px-6">
          {/* HERO */}

          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className={cn(
              `
              relative
              overflow-hidden
              rounded-[36px]
              border
              p-6
              md:p-7
              shadow-2xl
              `,
              darkMode
                ? `
                  border-white/10
                  bg-[#0b1220]/80
                `
                : `
                  border-zinc-200
                  bg-white
                `
            )}
          >
            {/* BG */}

            <div
              className="
                absolute
                right-0
                top-0
                h-[260px]
                w-[260px]
                rounded-full
                bg-sky-500/10
                blur-[120px]
              "
            />

            <div className="relative">
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-gradient-to-r
                  from-sky-500/10
                  via-pink-500/10
                  to-rose-500/10
                  px-4
                  py-2
                  text-[11px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-pink-400
                "
              >
                <Sparkles size={13} />
                Enterprise SaaS
              </div>

              <div
                className="
                  mt-5
                  flex
                  flex-col
                  gap-5
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >
                <div>
                  <h1
                    className={cn(
                      `
                      text-3xl
                      md:text-5xl
                      font-black
                      tracking-tight
                      `,
                      darkMode
                        ? "text-white"
                        : "text-zinc-900"
                    )}
                  >
                    {
                      MENU.find(
                        (x) =>
                          x.id === active
                      )?.label
                    }
                  </h1>

                  <p
                    className={cn(
                      `
                      mt-3
                      max-w-2xl
                      text-sm
                      leading-relaxed
                      `,
                      darkMode
                        ? "text-zinc-400"
                        : "text-zinc-500"
                    )}
                  >
                    Production-level enterprise
                    business management dashboard
                    with modern SaaS interaction,
                    responsive layouts and advanced
                    marketplace operations.
                  </p>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    bg-sky-500
                    px-6
                    py-4
                    text-sm
                    font-black
                    text-white
                    shadow-xl
                  "
                >
                  <Save size={18} />
                  Save Changes
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* SPACE */}

          <div className="h-5" />

          {/* CONTENT */}

          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}