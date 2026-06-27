"use client";

import React, { useState } from "react";

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
  Monitor,
  Smartphone,
  TabletSmartphone,
  CheckCircle2,
  Activity,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Layers3,
  PackageSearch,
  ToggleLeft,
  ToggleRight,
  CircleDot,
  BadgeCheck,
} from "lucide-react";

// ============================================================================
// UTIL
// ============================================================================

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// MENU
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
// SMALL CARD
// ============================================================================

function SmallCard({
  title,
  value,
  darkMode,
  icon: Icon,
}) {
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.01,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
      }}
      className={cn(
        `
        rounded-[28px]
        border
        p-4
        shadow-xl
        transition-all
        duration-300
        cursor-pointer
        `,
        darkMode
          ? `
            border-white/10
            bg-[#111827]
            shadow-black/30
            hover:border-pink-500/50
            hover:bg-pink-500/[0.08]
          `
          : `
            border-zinc-200
            bg-white
            shadow-zinc-200/60
            hover:border-pink-400
            hover:bg-pink-50/80
          `
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              `
              text-xs
              font-semibold
              uppercase
              tracking-[0.12em]
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
              mt-3
              text-xl
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
            text-sky-400
          "
        >
          <Icon size={19} />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// DETAIL ITEM (READ ONLY)
// ============================================================================

function DetailItem({
  label,
  value,
  darkMode,
}) {
  return (
    <div
      className={cn(
        `
        rounded-2xl
        border
        p-4
        transition-all
        duration-300
        cursor-pointer
        `,
        darkMode
          ? `
            border-white/6
            bg-white/[0.02]
            hover:border-pink-500/40
            hover:bg-pink-500/[0.05]
          `
          : `
            border-zinc-200
            bg-zinc-50
            hover:border-pink-400
            hover:bg-pink-50/60
          `
      )}
    >
      <p
        className={cn(
          `
          text-xs
          font-semibold
          uppercase
          tracking-[0.14em]
          `,
          darkMode
            ? "text-zinc-500"
            : "text-zinc-500"
        )}
      >
        {label}
      </p>

      <h3
        className={cn(
          `
          mt-3
          text-[15px]
          font-bold
          leading-relaxed
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
// EDITABLE DETAIL ITEM
// ============================================================================

function EditableDetailItem({
  label,
  value,
  darkMode,
  isEditing,
  onChange,
  fieldKey,
}) {
  if (isEditing) {
    return (
      <div
        className={cn(
          `
          rounded-2xl
          border
          p-4
          transition-all
          duration-300
          `,
          darkMode
            ? `
              border-sky-500/40
              bg-sky-500/[0.05]
            `
            : `
              border-sky-300
              bg-sky-50
            `
        )}
      >
        <p
          className={cn(
            `
            text-xs
            font-semibold
            uppercase
            tracking-[0.14em]
            `,
            darkMode
              ? "text-sky-400"
              : "text-sky-600"
          )}
        >
          {label}
        </p>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className={cn(
            `
            mt-3
            w-full
            text-[15px]
            font-bold
            leading-relaxed
            outline-none
            bg-transparent
            border-b
            pb-1
            `,
            darkMode
              ? `
                text-white
                border-white/20
                focus:border-sky-400
              `
              : `
                text-zinc-900
                border-zinc-300
                focus:border-sky-500
              `
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        `
        rounded-2xl
        border
        p-4
        transition-all
        duration-300
        cursor-pointer
        `,
        darkMode
          ? `
            border-white/6
            bg-white/[0.02]
            hover:border-pink-500/40
            hover:bg-pink-500/[0.05]
          `
          : `
            border-zinc-200
            bg-zinc-50
            hover:border-pink-400
            hover:bg-pink-50/60
          `
      )}
    >
      <p
        className={cn(
          `
          text-xs
          font-semibold
          uppercase
          tracking-[0.14em]
          `,
          darkMode
            ? "text-zinc-500"
            : "text-zinc-500"
        )}
      >
        {label}
      </p>

      <h3
        className={cn(
          `
          mt-3
          text-[15px]
          font-bold
          leading-relaxed
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
// SECTION BOX
// ============================================================================

function SectionBox({
  darkMode,
  title,
  subtitle,
  children,
  action,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className={cn(
        `
        overflow-hidden
        rounded-[34px]
        border
        shadow-2xl
        `,
        darkMode
          ? `
            border-white/10
            bg-[#0f172a]
            shadow-black/30
          `
          : `
            border-zinc-200
            bg-white
            shadow-zinc-200/70
          `
      )}
    >
      <div
        className={cn(
          `
          flex
          flex-col
          gap-5
          border-b
          p-5
          md:flex-row
          md:items-center
          md:justify-between
          md:p-6
          `,
          darkMode
            ? "border-white/10"
            : "border-zinc-200"
        )}
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500/10 via-pink-500/10 to-rose-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-pink-400">
              <Sparkles size={12} />
              StockLinker
            </div>
          </div>
          <h2
            className={cn(
              `
              mt-3
              text-3xl
              md:text-4xl
              font-black
              tracking-tight
              `,
              darkMode
                ? "text-white"
                : "text-zinc-900"
            )}
          >
            {title}
          </h2>

          <p
            className={cn(
              `
              mt-2
              text-sm
              leading-relaxed
              `,
              darkMode
                ? "text-zinc-400"
                : "text-zinc-500"
            )}
          >
            {subtitle}
          </p>
        </div>

        {action}
      </div>

      <div className="p-5 md:p-6">
        {children}
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN
// ============================================================================

export default function SettingsPage() {
  const [active, setActive] =
    useState("account");

  const [darkMode, setDarkMode] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  // Notification settings state
  const [notifSettings, setNotifSettings] = useState({
    orderAlerts: true,
    stockAlerts: true,
    paymentAlerts: true,
    systemUpdates: false,
    marketingEmails: false,
  });

  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState("tamil");

  const toggleNotif = (key) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Edit states for different sections
  const [editingSection, setEditingSection] = useState(null);
  const [editedData, setEditedData] = useState({
    // Account
    ownerName: "Boomathi",
    userId: "#SL-829101",
    role: "Wholesaler",
    phone: "+91 9876543210",
    email: "arun@gmail.com",
    yearsInBusiness: "12 Years",
    // Business
    companyName: "Arun Wholesale Traders",
    businessType: "Wholesale",
    category: "Groceries & FMCG",
    gstNumber: "29ABCDE1234F1Z5",
    operatingTiming: "7AM - 9PM",
    altPhone: "+91 9123456780",
    businessEmail: "support@aruntraders.com",
    location: "Salem, Tamil Nadu",
    // Delivery
    addressLine1: "12 Market Street",
    addressLine2: "Near Old Bus Stand",
    city: "Salem",
    district: "Salem",
    pincode: "636007",
    landmark: "Near Vegetable Market",
    deliveryRadius: "60 KM",
    minOrder: "₹1,000",
    deliveryCharges: "₹50",
    fastDelivery: "Enabled",
    deliveryDays: "Monday - Saturday",
    routeSchedule: "Tuesday → Salem Route",
  });

  const handleEditClick = (section) => {
    setEditingSection(section);
  };

  const handleSaveClick = () => {
    setEditingSection(null);
  };

  const handleFieldChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  // ==========================================================================
  // CONTENT
  // ==========================================================================

  function renderContent() {
    // ==========================================================================
    // ACCOUNT
    // ==========================================================================

    if (active === "account") {
      const isEditing = editingSection === "account";

      return (
        <div className="space-y-6">
          <SectionBox
            darkMode={darkMode}
            title="Profile Overview"
            subtitle="Manage your account identity, connected devices and business access."
            action={
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => isEditing ? handleSaveClick() : handleEditClick("account")}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  bg-sky-500/10
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-sky-400
                  cursor-pointer
                  hover:bg-sky-500/20
                  transition-all
                "
              >
                {isEditing ? <Save size={17} /> : <Pencil size={17} />}
                {isEditing ? "Save Changes" : "Edit Profile"}
              </motion.button>
            }
          >
            <div
              className="
                flex
                flex-col
                gap-6
                lg:flex-row
                lg:items-start
                lg:justify-between
              "
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative"
                >
                  <div
                    className="
                      flex
                      h-28
                      w-28
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
                    <Store size={40} />
                  </div>
                  <button
                    className="
                      absolute
                      -bottom-2
                      -right-2
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white
                      text-zinc-900
                      cursor-pointer
                      hover:scale-105
                      transition-transform
                    "
                  >
                    <Camera size={17} />
                  </button>
                </motion.div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2
                      className={cn(
                        `
                        text-3xl
                        md:text-4xl
                        font-black
                        `,
                        darkMode
                          ? "text-white"
                          : "text-zinc-900"
                      )}
                    >
                      Arun Traders
                    </h2>
                  </div>
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
                    Premium Wholesale Partner
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-emerald-500/10
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    text-emerald-400
                  "
                >
                  <ShieldCheck size={14} />
                  Verified
                </div>
                <div
                  className="
                    rounded-2xl
                    bg-sky-500/10
                    px-4
                    py-1.5
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
                    py-1.5
                    text-xs
                    font-bold
                    text-pink-400
                  "
                >
                  Marketplace Rank #12
                </div>
              </div>
            </div>

            <div className="mt-8" />

            <div className="grid gap-5 lg:grid-cols-2">
              <div
                className={cn(
                  `
                  rounded-[28px]
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
                      bg-zinc-50
                    `
                )}
              >
                <div className="mb-5">
                  <h3
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
                    User identity and account details
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <EditableDetailItem
                    darkMode={darkMode}
                    label="Owner Name"
                    value={editedData.ownerName}
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                    fieldKey="ownerName"
                  />
                  <EditableDetailItem
                    darkMode={darkMode}
                    label="User ID"
                    value={editedData.userId}
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                    fieldKey="userId"
                  />
                  <EditableDetailItem
                    darkMode={darkMode}
                    label="Role"
                    value={editedData.role}
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                    fieldKey="role"
                  />
                  <EditableDetailItem
                    darkMode={darkMode}
                    label="Phone Number"
                    value={editedData.phone}
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                    fieldKey="phone"
                  />
                  <EditableDetailItem
                    darkMode={darkMode}
                    label="Email Address"
                    value={editedData.email}
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                    fieldKey="email"
                  />
                  <EditableDetailItem
                    darkMode={darkMode}
                    label="Years In Business"
                    value={editedData.yearsInBusiness}
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                    fieldKey="yearsInBusiness"
                  />
                </div>
              </div>

              <div
                className={cn(
                  `
                  rounded-[28px]
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
                      bg-zinc-50
                    `
                )}
              >
                <div className="mb-5">
                  <h3
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
                    Connected devices and login status
                  </p>
                </div>

                <div className="grid gap-4">
                  <DetailItem
                    darkMode={darkMode}
                    label="Connected Devices"
                    value="6 Devices Active"
                  />

                  <div className="grid gap-4">
                    <div
                      className={cn(
                        `
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        border
                        p-4
                        cursor-pointer
                        transition-all
                        duration-300
                        `,
                        darkMode
                          ? `
                            border-white/6
                            bg-white/[0.02]
                            hover:border-pink-500/40
                            hover:bg-pink-500/[0.05]
                          `
                          : `
                            border-zinc-200
                            bg-white
                            hover:border-pink-400
                            hover:bg-pink-50/60
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
                            text-sky-400
                          "
                        >
                          <Monitor size={20} />
                        </div>
                        <div>
                          <h4
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
                            Chrome • Windows
                          </h4>
                          <p className="mt-1 text-xs text-emerald-400 font-semibold">
                            Active Now
                          </p>
                        </div>
                      </div>
                      <CheckCircle2 className="text-emerald-400" size={18} />
                    </div>

                    <div
                      className={cn(
                        `
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        border
                        p-4
                        cursor-pointer
                        transition-all
                        duration-300
                        `,
                        darkMode
                          ? `
                            border-white/6
                            bg-white/[0.02]
                            hover:border-pink-500/40
                            hover:bg-pink-500/[0.05]
                          `
                          : `
                            border-zinc-200
                            bg-white
                            hover:border-pink-400
                            hover:bg-pink-50/60
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
                            bg-pink-500/10
                            text-pink-400
                          "
                        >
                          <Smartphone size={20} />
                        </div>
                        <div>
                          <h4
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
                            Android • Chrome
                          </h4>
                          <p className="mt-1 text-xs text-zinc-400 font-semibold">
                            Last Login 2 Hours Ago
                          </p>
                        </div>
                      </div>
                      <div className="rounded-full bg-zinc-500/10 px-3 py-1 text-[10px] font-bold text-zinc-400">
                        Saved
                      </div>
                    </div>

                    <div
                      className={cn(
                        `
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        border
                        p-4
                        cursor-pointer
                        transition-all
                        duration-300
                        `,
                        darkMode
                          ? `
                            border-white/6
                            bg-white/[0.02]
                            hover:border-pink-500/40
                            hover:bg-pink-500/[0.05]
                          `
                          : `
                            border-zinc-200
                            bg-white
                            hover:border-pink-400
                            hover:bg-pink-50/60
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
                            text-sky-400
                          "
                        >
                          <TabletSmartphone size={20} />
                        </div>
                        <div>
                          <h4
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
                            iPad • Safari
                          </h4>
                          <p className="mt-1 text-xs text-zinc-400 font-semibold">
                            Last Active Yesterday
                          </p>
                        </div>
                      </div>
                      <div className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-bold text-amber-400">
                        Idle
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SmallCard darkMode={darkMode} title="Orders" value="12,482" icon={ShoppingBag} />
              <SmallCard darkMode={darkMode} title="Products" value="2,480" icon={Package2} />
              <SmallCard darkMode={darkMode} title="Deliveries" value="8,921" icon={Truck} />
              <SmallCard darkMode={darkMode} title="Growth" value="+24%" icon={TrendingUp} />
            </div>
          </SectionBox>
        </div>
      );
    }

    // ==========================================================================
    // BUSINESS
    // ==========================================================================

    if (active === "business") {
      const isEditing = editingSection === "business";

      return (
        <SectionBox
          darkMode={darkMode}
          title="Business Details"
          subtitle="Business identity, ownership and contact information."
          action={
            <button
              onClick={() => isEditing ? handleSaveClick() : handleEditClick("business")}
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                bg-sky-500/10
                px-5
                py-3
                text-sm
                font-bold
                text-sky-400
                cursor-pointer
                hover:bg-sky-500/20
                transition-all
              "
            >
              {isEditing ? <Save size={17} /> : <Pencil size={17} />}
              {isEditing ? "Save Changes" : "Edit Details"}
            </button>
          }
        >
          <div className="grid gap-5 xl:grid-cols-2">
            <div
              className={cn(
                `
                rounded-[28px]
                border
                p-5
                `,
                darkMode
                  ? `
                    border-white/10
                    bg-white/[0.03]
                  `
                  : `
                    border-zinc-200
                    bg-zinc-50
                  `
              )}
            >
              <div className="mb-5">
                <h3
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
                  Business Information
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Owner Name"
                  value={editedData.ownerName}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="ownerName"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Company Name"
                  value={editedData.companyName}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="companyName"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Business Type"
                  value={editedData.businessType}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="businessType"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Category"
                  value={editedData.category}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="category"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="GST Number"
                  value={editedData.gstNumber}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="gstNumber"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Operating Timing"
                  value={editedData.operatingTiming}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="operatingTiming"
                />
              </div>
            </div>

            <div
              className={cn(
                `
                rounded-[28px]
                border
                p-5
                `,
                darkMode
                  ? `
                    border-white/10
                    bg-white/[0.03]
                  `
                  : `
                    border-zinc-200
                    bg-zinc-50
                  `
              )}
            >
              <div className="mb-5">
                <h3
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
                  Contact Details
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Phone Number"
                  value={editedData.phone}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="phone"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Alternate Number"
                  value={editedData.altPhone}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="altPhone"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Business Email"
                  value={editedData.businessEmail}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="businessEmail"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Location"
                  value={editedData.location}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="location"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SmallCard darkMode={darkMode} title="Coverage Radius" value="60 KM" icon={MapPinned} />
            <SmallCard darkMode={darkMode} title="Coverage Areas" value="18" icon={Layers3} />
            <SmallCard darkMode={darkMode} title="Delivery Time" value="35 Min" icon={Clock3} />
            <SmallCard darkMode={darkMode} title="Verified" value="Approved" icon={ShieldCheck} />
          </div>
        </SectionBox>
      );
    }

    // ==========================================================================
    // DELIVERY
    // ==========================================================================

    if (active === "delivery") {
      const isEditing = editingSection === "delivery";

      return (
        <SectionBox
          darkMode={darkMode}
          title="Store & Delivery"
          subtitle="Store address, delivery coverage and logistics configuration."
          action={
            <button
              onClick={() => isEditing ? handleSaveClick() : handleEditClick("delivery")}
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                bg-sky-500/10
                px-5
                py-3
                text-sm
                font-bold
                text-sky-400
                cursor-pointer
                hover:bg-sky-500/20
                transition-all
              "
            >
              {isEditing ? <Save size={17} /> : <Pencil size={17} />}
              {isEditing ? "Save Changes" : "Edit Address"}
            </button>
          }
        >
          <div className="grid gap-5 xl:grid-cols-2">
            <div
              className={cn(
                `
                rounded-[28px]
                border
                p-5
                `,
                darkMode
                  ? `
                    border-white/10
                    bg-white/[0.03]
                  `
                  : `
                    border-zinc-200
                    bg-zinc-50
                  `
              )}
            >
              <h3
                className={cn(
                  `
                  mb-5
                  text-xl
                  font-black
                  `,
                  darkMode
                    ? "text-white"
                    : "text-zinc-900"
                )}
              >
                Store Address Details
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Address Line 1"
                  value={editedData.addressLine1}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="addressLine1"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Address Line 2"
                  value={editedData.addressLine2}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="addressLine2"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="City"
                  value={editedData.city}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="city"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="District"
                  value={editedData.district}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="district"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Pincode"
                  value={editedData.pincode}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="pincode"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Landmark"
                  value={editedData.landmark}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="landmark"
                />
              </div>
            </div>

            <div
              className={cn(
                `
                rounded-[28px]
                border
                p-5
                `,
                darkMode
                  ? `
                    border-white/10
                    bg-white/[0.03]
                  `
                  : `
                    border-zinc-200
                    bg-zinc-50
                  `
              )}
            >
              <h3
                className={cn(
                  `
                  mb-5
                  text-xl
                  font-black
                  `,
                  darkMode
                    ? "text-white"
                    : "text-zinc-900"
                )}
              >
                Delivery Configuration
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Delivery Radius"
                  value={editedData.deliveryRadius}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="deliveryRadius"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Minimum Order"
                  value={editedData.minOrder}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="minOrder"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Delivery Charges"
                  value={editedData.deliveryCharges}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="deliveryCharges"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Fast Delivery"
                  value={editedData.fastDelivery}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="fastDelivery"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Delivery Days"
                  value={editedData.deliveryDays}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="deliveryDays"
                />
                <EditableDetailItem
                  darkMode={darkMode}
                  label="Route Schedule"
                  value={editedData.routeSchedule}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  fieldKey="routeSchedule"
                />
              </div>
            </div>
          </div>
        </SectionBox>
      );
    }

    // ==========================================================================
    // INVENTORY
    // ==========================================================================

    if (active === "inventory") {
      return (
        <SectionBox
          darkMode={darkMode}
          title="Products & Inventory"
          subtitle="Manage inventory categories, stock insights and product analytics."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Product Insights - Left Side */}
            <div
              className={cn(
                `
                rounded-[28px]
                border
                p-5
                `,
                darkMode
                  ? `
                    border-white/10
                    bg-white/[0.03]
                  `
                  : `
                    border-zinc-200
                    bg-zinc-50
                  `
              )}
            >
              <h3
                className={cn(
                  `
                  mb-5
                  text-xl
                  font-black
                  `,
                  darkMode
                    ? "text-white"
                    : "text-zinc-900"
                )}
              >
                Product Insights
              </h3>

              <div className="grid gap-4">
                <DetailItem darkMode={darkMode} label="Best Selling" value="Premium Rice" />
                <DetailItem darkMode={darkMode} label="Monthly Growth" value="+24%" />
                <DetailItem darkMode={darkMode} label="Stock Value" value="₹8.2 Lakhs" />
                <DetailItem darkMode={darkMode} label="Fast Moving" value="Groceries" />
              </div>
            </div>

            {/* Product Categories - Right Side with Scroll */}
            <div
              className={cn(
                `
                rounded-[28px]
                border
                p-5
                max-h-[500px]
                overflow-y-auto
                custom-scroll
                `,
                darkMode
                  ? `
                    border-white/10
                    bg-white/[0.03]
                  `
                  : `
                    border-zinc-200
                    bg-zinc-50
                  `
              )}
            >
              <h3
                className={cn(
                  `
                  mb-5
                  text-xl
                  font-black
                  sticky
                  top-0
                  bg-inherit
                  py-2
                  `,
                  darkMode
                    ? "text-white"
                    : "text-zinc-900"
                )}
              >
                Product Categories
              </h3>

              <div className="grid gap-4">
                {[
                  "Groceries",
                  "Vegetables",
                  "Beverages",
                  "FMCG",
                  "Snacks",
                  "Oils",
                  "Dairy",
                  "Frozen Foods",
                  "Bakery",
                  "Spices",
                  "Grains",
                  "Personal Care",
                  "Household",
                  "Baby Care",
                  "Pet Supplies",
                ].map((item) => (
                  <motion.div
                    whileHover={{ x: 4 }}
                    key={item}
                    className={cn(
                      `
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      p-4
                      cursor-pointer
                      transition-all
                      duration-300
                      `,
                      darkMode
                        ? `
                          border-white/6
                          bg-white/[0.02]
                          hover:border-pink-500/40
                          hover:bg-pink-500/[0.05]
                        `
                        : `
                          border-zinc-200
                          bg-white
                          hover:border-pink-400
                          hover:bg-pink-50/60
                        `
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-2xl
                          bg-sky-500/10
                          text-sky-400
                        "
                      >
                        <PackageSearch size={18} />
                      </div>
                      <h4
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
                        {item}
                      </h4>
                    </div>
                    <ChevronRight size={18} className="text-zinc-400" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Cards Below */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SmallCard darkMode={darkMode} title="Total Products" value="2,480" icon={Package2} />
            <SmallCard darkMode={darkMode} title="Categories" value="24" icon={Warehouse} />
            <SmallCard darkMode={darkMode} title="Low Stock" value="14" icon={Activity} />
            <SmallCard darkMode={darkMode} title="Top Selling" value="Rice" icon={TrendingUp} />
          </div>
        </SectionBox>
      );
    }

    // ==========================================================================
    // NOTIFICATION
    // ==========================================================================

    if (active === "notifications") {
      return (
        <SectionBox
          darkMode={darkMode}
          title="Notification Center"
          subtitle="Live operational alerts, order updates and system notifications."
        >
          <div className="grid gap-6">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="
                rounded-[30px]
                bg-gradient-to-r
                from-sky-500/10
                via-pink-500/10
                to-rose-500/10
                p-5
              "
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-sky-500 via-pink-500 to-rose-500 text-white">
                    <BellRing size={26} />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
                    >
                      9
                    </motion.div>
                  </div>
                  <div>
                    <h3 className={cn(`text-2xl font-black`, darkMode ? "text-white" : "text-zinc-900")}>
                      Real-Time Notifications
                    </h3>
                    <p className={cn(`mt-2 text-sm`, darkMode ? "text-zinc-300" : "text-zinc-600")}>
                      Live order alerts and stock updates enabled.
                    </p>
                  </div>
                </div>
                <button className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-zinc-900 cursor-pointer hover:scale-105 transition-transform">
                  View All Alerts
                </button>
              </div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className={cn(`rounded-2xl border p-5 flex items-center justify-between cursor-pointer transition-all duration-300 hover:border-pink-500/40`, darkMode ? `border-white/10 bg-white/[0.03] hover:bg-pink-500/[0.05]` : `border-zinc-200 bg-zinc-50 hover:border-pink-400 hover:bg-pink-50/60`)}>
                <div>
                  <h4 className={cn(`font-black`, darkMode ? "text-white" : "text-zinc-900")}>Order Alerts</h4>
                  <p className="text-sm text-zinc-400 mt-1">New order notifications</p>
                </div>
                <button onClick={() => toggleNotif("orderAlerts")} className="cursor-pointer">
                  {notifSettings.orderAlerts ? <ToggleRight className="text-sky-400" size={32} /> : <ToggleLeft className="text-zinc-500" size={32} />}
                </button>
              </div>
              <div className={cn(`rounded-2xl border p-5 flex items-center justify-between cursor-pointer transition-all duration-300 hover:border-pink-500/40`, darkMode ? `border-white/10 bg-white/[0.03] hover:bg-pink-500/[0.05]` : `border-zinc-200 bg-zinc-50 hover:border-pink-400 hover:bg-pink-50/60`)}>
                <div>
                  <h4 className={cn(`font-black`, darkMode ? "text-white" : "text-zinc-900")}>Stock Alerts</h4>
                  <p className="text-sm text-zinc-400 mt-1">Low inventory warnings</p>
                </div>
                <button onClick={() => toggleNotif("stockAlerts")} className="cursor-pointer">
                  {notifSettings.stockAlerts ? <ToggleRight className="text-sky-400" size={32} /> : <ToggleLeft className="text-zinc-500" size={32} />}
                </button>
              </div>
              <div className={cn(`rounded-2xl border p-5 flex items-center justify-between cursor-pointer transition-all duration-300 hover:border-pink-500/40`, darkMode ? `border-white/10 bg-white/[0.03] hover:bg-pink-500/[0.05]` : `border-zinc-200 bg-zinc-50 hover:border-pink-400 hover:bg-pink-50/60`)}>
                <div>
                  <h4 className={cn(`font-black`, darkMode ? "text-white" : "text-zinc-900")}>Payment Alerts</h4>
                  <p className="text-sm text-zinc-400 mt-1">Transaction updates</p>
                </div>
                <button onClick={() => toggleNotif("paymentAlerts")} className="cursor-pointer">
                  {notifSettings.paymentAlerts ? <ToggleRight className="text-sky-400" size={32} /> : <ToggleLeft className="text-zinc-500" size={32} />}
                </button>
              </div>
              <div className={cn(`rounded-2xl border p-5 flex items-center justify-between cursor-pointer transition-all duration-300 hover:border-pink-500/40`, darkMode ? `border-white/10 bg-white/[0.03] hover:bg-pink-500/[0.05]` : `border-zinc-200 bg-zinc-50 hover:border-pink-400 hover:bg-pink-50/60`)}>
                <div>
                  <h4 className={cn(`font-black`, darkMode ? "text-white" : "text-zinc-900")}>System Updates</h4>
                  <p className="text-sm text-zinc-400 mt-1">Platform announcements</p>
                </div>
                <button onClick={() => toggleNotif("systemUpdates")} className="cursor-pointer">
                  {notifSettings.systemUpdates ? <ToggleRight className="text-sky-400" size={32} /> : <ToggleLeft className="text-zinc-500" size={32} />}
                </button>
              </div>
            </div>
          </div>
        </SectionBox>
      );
    }

    // ==========================================================================
    // APPEARANCE
    // ==========================================================================

    if (active === "appearance") {
      return (
        <SectionBox
          darkMode={darkMode}
          title="Appearance & Language"
          subtitle="Customize theme, language and interface experience."
        >
          <div className="grid gap-6">
            <div>
              <h3 className={cn(`text-lg font-black mb-4`, darkMode ? "text-white" : "text-zinc-900")}>Language Preference</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  onClick={() => setSelectedLanguage("tamil")}
                  className={cn(
                    `rounded-[28px] border p-5 text-left transition-all cursor-pointer`,
                    selectedLanguage === "tamil"
                      ? `border-sky-500/50 bg-sky-500/20 ring-2 ring-sky-500/50`
                      : darkMode
                      ? `border-white/10 bg-white/[0.03] hover:bg-sky-500/10 hover:border-sky-500/30`
                      : `border-zinc-200 bg-zinc-50 hover:bg-sky-50 hover:border-sky-300`
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={cn(`font-black`, selectedLanguage === "tamil" ? "text-sky-400" : darkMode ? "text-white" : "text-zinc-900")}>Tamil</h3>
                      <p className={cn(`mt-2 text-sm`, darkMode ? "text-zinc-400" : "text-zinc-500")}>தமிழ் மொழி</p>
                    </div>
                    {selectedLanguage === "tamil" && <BadgeCheck className="text-sky-400" size={24} />}
                  </div>
                </button>
                <button
                  onClick={() => setSelectedLanguage("english")}
                  className={cn(
                    `rounded-[28px] border p-5 text-left transition-all cursor-pointer`,
                    selectedLanguage === "english"
                      ? `border-pink-500/50 bg-pink-500/20 ring-2 ring-pink-500/50`
                      : darkMode
                      ? `border-white/10 bg-white/[0.03] hover:bg-pink-500/10 hover:border-pink-500/30`
                      : `border-zinc-200 bg-zinc-50 hover:bg-pink-50 hover:border-pink-300`
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={cn(`font-black`, selectedLanguage === "english" ? "text-pink-400" : darkMode ? "text-white" : "text-zinc-900")}>English</h3>
                      <p className={cn(`mt-2 text-sm`, darkMode ? "text-zinc-400" : "text-zinc-500")}>English Language</p>
                    </div>
                    {selectedLanguage === "english" && <BadgeCheck className="text-pink-400" size={24} />}
                  </div>
                </button>
              </div>
            </div>

            <div>
              <h3 className={cn(`text-lg font-black mb-4`, darkMode ? "text-white" : "text-zinc-900")}>Theme Preference</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  onClick={() => setDarkMode(true)}
                  className={cn(
                    `rounded-[30px] border p-3.5 transition-all text-center cursor-pointer`,
                    darkMode
                      ? `border-sky-500/50 bg-sky-500/20 ring-2 ring-sky-500/50`
                      : darkMode
                      ? `border-white/10 bg-white/[0.03] hover:bg-sky-500/10`
                      : `border-zinc-200 bg-zinc-50 hover:bg-sky-50`
                  )}
                >
                  <Moon className={`mx-auto ${darkMode ? "text-sky-400" : "text-zinc-500"}`} size={32} />
                  <h3 className={cn(` text-xl font-black `, darkMode ? "text-white" : "text-zinc-900")}>Dark Mode</h3>
                </button>
                <button
                  onClick={() => setDarkMode(false)}
                  className={cn(
                    `rounded-[30px] border p-3.5 transition-all text-center cursor-pointer`,
                    !darkMode
                      ? `border-pink-500/50 bg-pink-500/20 ring-2 ring-pink-500/50`
                      : darkMode
                      ? `border-white/10 bg-white/[0.03] hover:bg-pink-500/10`
                      : `border-zinc-200 bg-zinc-50 hover:bg-pink-50`
                  )}
                >
                  <Sun className={`mx-auto ${!darkMode ? "text-pink-400" : "text-zinc-500"}`} size={32} />
                  <h3 className={cn(` text-xl font-black `, darkMode ? "text-white" : "text-zinc-900")}>Light Mode</h3>
                </button>
              </div>
            </div>
          </div>
        </SectionBox>
      );
    }

    // ==========================================================================
    // TEAM
    // ==========================================================================

    return (
      <SectionBox
        darkMode={darkMode}
        title="Team Details"
        subtitle="Manage staff roles, permissions and employee details."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-h-[600px] overflow-y-auto custom-scroll pr-1">
          {[
            { name: "Ravi Kumar", role: "Delivery Manager", since: "2022" },
            { name: "Vignesh", role: "Inventory Staff", since: "2023" },
            { name: "Hari", role: "Billing Staff", since: "2024" },
            { name: "Priya", role: "Sales Manager", since: "2021" },
            { name: "Suresh", role: "Warehouse Lead", since: "2020" },
            { name: "Meena", role: "Customer Support", since: "2024" },
          ].map((item) => (
            <motion.div
              whileHover={{ y: -4 }}
              key={item.name}
              className={cn(
                `
                rounded-[30px]
                border
                p-5
                shadow-xl
                cursor-pointer
                transition-all
                duration-300
                `,
                darkMode
                  ? `
                    border-white/10
                    bg-white/[0.03]
                    hover:border-pink-500/40
                    hover:bg-pink-500/[0.05]
                  `
                  : `
                    border-zinc-200
                    bg-white
                    hover:border-pink-400
                    hover:bg-pink-50/60
                  `
              )}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-sky-500/10 text-sky-600">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className={cn(`text-lg font-black`, darkMode ? "text-white" : "text-zinc-900")}>{item.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-sky-400">{item.role}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-4">
                <DetailItem darkMode={darkMode} label="Status" value="Active Employee" />
                <DetailItem darkMode={darkMode} label="Working Since" value={item.since} />
              </div>
            </motion.div>
          ))}
        </div>
      </SectionBox>
    );
  }

  // ==========================================================================
  // MAIN UI
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
      {/* GRID PATTERN */}
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
            `,
          "bg-[size:60px_60px]"
        )}
      />

      {/* BG BLUR EFFECTS */}
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-[120px]" />

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
        <div className="flex h-[78px] items-center justify-between px-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 xl:hidden cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-[26px] bg-gradient-to-br from-sky-500 via-pink-500 to-rose-500 text-white shadow-[0_25px_60px_rgba(236,72,153,0.35)]">
                <Store size={24} />
              </div>
              <div>
                <h1 className={cn(`text-xl font-black`, darkMode ? "text-white" : "text-zinc-900")}>StockLinker</h1>
                <p className={cn(`mt-1 text-xs`, darkMode ? "text-zinc-400" : "text-zinc-500")}>Enterprise Settings</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5  cursor-pointer">
              <Bell size={18} className={`${darkMode ? 'text-white' : 'text-black' }`}/>
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500"
              />
            </button>
            <motion.button
              whileTap={{ rotate: 180, scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 cursor-pointer"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
          </div>
        </div>
      </header>

      <div className="h-4" />

      {/* BODY */}
      <div className="relative flex px-3 md:px-6 pb-8">
        {/* SIDEBAR - DESKTOP */}
        <aside
          className={cn(
            `
            sticky
            top-[96px]
            hidden
            h-[calc(100vh-120px)]
            w-[280px]
            flex-col
            overflow-hidden
            rounded-[34px]
            border
            shadow-2xl
            xl:flex
            `,
            darkMode
              ? `
                border-white/10
                bg-[#0b1020]
              `
              : `
                border-zinc-200
                bg-white
              `
          )}
        >
          <div className={cn(`border-b p-6`, darkMode ? "border-white/10" : "border-zinc-200")}>
            <h2 className={cn(`text-2xl font-black`, darkMode ? "text-white" : "text-zinc-900")}>Settings</h2>
            <p className={cn(`mt-2 text-sm`, darkMode ? "text-zinc-400" : "text-zinc-500")}>Business control center</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {MENU.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    whileHover={{ x: 4 }}
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={cn(
                      `
                      group
                      flex
                      w-full
                      items-center
                      gap-4
                      rounded-2xl
                      px-4
                      py-3
                      transition-all
                      duration-300
                      cursor-pointer
                      `,
                      active === item.id
                        ? `
                          bg-gradient-to-r
                          from-sky-500
                          via-pink-500
                          to-rose-500/70
                        `
                        : `
                          hover:bg-pink-500/15
                        `
                    )}
                  >
                    <Icon
                      size={19}
                      className={cn(
                        `transition-all duration-300`,
                        active === item.id
                          ? `text-white`
                          : darkMode
                          ? `text-zinc-400 group-hover:text-white`
                          : `text-zinc-700 group-hover:text-zinc-900`
                      )}
                    />
                    <span
                      className={cn(
                        `text-sm font-bold transition-all duration-300`,
                        active === item.id
                          ? `text-white`
                          : darkMode
                          ? `text-zinc-400 group-hover:text-white`
                          : `text-zinc-700 group-hover:text-zinc-900`
                      )}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
          <div className="p-4">
            <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 px-5 py-4 text-sm font-bold text-white cursor-pointer hover:opacity-90 transition-opacity">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* MOBILE SIDEBAR */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-[90] bg-black/60 xl:hidden"
              />
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", damping: 24 }}
                className="fixed left-0 top-0 z-[100] h-full w-[300px] bg-[#0b1020] xl:hidden"
              >
                <div className="flex items-center justify-between p-5">
                  <h2 className="text-2xl font-black text-white">Settings</h2>
                  <button onClick={() => setMobileOpen(false)} className="text-white cursor-pointer">
                    <X />
                  </button>
                </div>
                <div className="space-y-2 p-4">
                  {MENU.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActive(item.id);
                          setMobileOpen(false);
                        }}
                        className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-white hover:bg-pink-500/15 cursor-pointer transition-all"
                      >
                        <Icon size={18} />
                        <span className="font-bold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1 xl:pl-6">
          <div className="mx-auto w-full max-w-7xl px-2 sm:px-3">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'};
        }
      `}</style>
    </div>
  );
}