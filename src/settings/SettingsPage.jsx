"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";

import { AccountSection } from "./sections/AccountSection";
import { BusinessSection } from "./sections/BusinessSection";
import { DeliverySection } from "./sections/DeliverySection";
import { InventorySection } from "./sections/InventorySection";
import { TeamSection } from "./sections/TeamSection";

export default function SettingsPage({ activeSection = "account", onSectionChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [active, setActive] = useState(activeSection);

  // Update active when prop changes
  useEffect(() => {
    if (activeSection) {
      setActive(activeSection);
    }
  }, [activeSection]);

  const [editedData, setEditedData] = useState({
    // Account
    userName: "Boomathi",
    userId: "#AB-567955",
    role: "Wholesaler",
    phone: "+91 9876543210",
    email: "flowermoon@gmail.com",
    MemberSince: "7 sep 2005",

    // Business
    companyName: "Arun Wholesale Traders",
    businessType: "Wholesale",
    category: "Groceries & FMCG",
    gstNumber: "29ABCDE1234F1Z5",
    operatingTiming: "7AM - 9PM",
    altPhone: "+91 9123456780",
    businessEmail: "support@aruntraders.com",
    location: "Salem, Tamil Nadu",
    yearsInBusiness: "12 Years",
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

  // Handle section change and notify parent
  const handleSectionChange = (section) => {
    setActive(section);
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  const renderContent = () => {
    switch (active) {
      case "account":
        return (
          <AccountSection
            editedData={editedData}
            handleFieldChange={handleFieldChange}
            isEditing={editingSection === "account"}
            handleEditClick={handleEditClick}
            handleSaveClick={handleSaveClick}
          />
        );
      case "business":
        return (
          <BusinessSection
            editedData={editedData}
            handleFieldChange={handleFieldChange}
            isEditing={editingSection === "business"}
            handleEditClick={handleEditClick}
            handleSaveClick={handleSaveClick}
          />
        );
      case "delivery":
        return (
          <DeliverySection
            editedData={editedData}
            handleFieldChange={handleFieldChange}
            isEditing={editingSection === "delivery"}
            handleEditClick={handleEditClick}
            handleSaveClick={handleSaveClick}
          />
        );
      case "inventory":
        return <InventorySection />;
      case "team":
        return <TeamSection />;
      default:
        return (
          <AccountSection
            editedData={editedData}
            handleFieldChange={handleFieldChange}
            isEditing={editingSection === "account"}
            handleEditClick={handleEditClick}
            handleSaveClick={handleSaveClick}
          />
        );
    }
  };

  // Add section navigation tabs at the top
  const renderSectionTabs = () => {
    const sections = [
      { id: "account", label: "Account" },
      { id: "business", label: "Business" },
      { id: "delivery", label: "Delivery" },
      { id: "inventory", label: "Inventory" },
      { id: "team", label: "Team" },
    ];

    return (
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 border-b border-zinc-200 pb-2 min-w-max">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={`
                px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                ${
                  active === section.id
                    ? "bg-gradient-to-r from-sky-500 via-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/20"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }
              `}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`
        relative
        min-h-screen
        overflow-hidden
        transition-all
        duration-500
        bg-[#f5f7fb]
      `}
    >
      {/* GRID PATTERN */}
      <div
        className={`
          absolute
          inset-0
          opacity-[0.03]
          bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)]
          bg-[size:60px_60px]
        `}
      />

      {/* BG BLUR EFFECTS */}
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-[120px]" />

      <div className="h-4" />

      {/* BODY */}
      <div className="relative flex px-3 md:px-6 pb-8">
        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-pink-500 to-rose-500 text-white shadow-2xl shadow-pink-500/30 xl:hidden"
        >
          <Menu size={24} />
        </button>

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-7xl">
            {/* Section Tabs */}
            {/* {renderSectionTabs()} */}
            
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
    </div>
  );
}