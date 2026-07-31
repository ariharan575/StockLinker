"use client";
import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { AccountSection } from "./sections/AccountSection";
import { BusinessSection } from "./sections/BusinessSection";
import { DeliverySection } from "./sections/DeliverySection";
import { InventorySection } from "./sections/InventorySection";

import { profileApi } from "../Authentication/services/api";

export default function SettingsPage({ activeSection = "account", onSectionChange }) {
  const [editingSection, setEditingSection] = useState(null);
  const [active, setActive] = useState(activeSection);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const [editedData, setEditedData] = useState({
    userName: "", userId: "", role: "", phone: "", email: "", MemberSince: "",
    companyName: "", businessType: "", category: "", gstNumber: "", operatingTiming: "",
    altPhone: "", businessEmail: "", location: "", yearsInBusiness: "",
    addressLine1: "", addressLine2: "", city: "", district: "", state: "", pincode: "",
    landmark: "", deliveryRadius: "", minOrder: "", deliveryCharges: "",
    deliveryDays: "", routeSchedule: "",
    trustScore: 0, marketplaceRank: 0, verificationStatus: "",
    subCategories: [], totalProducts: 0, lowStockCount: 0, bestSellingProduct: "N/A", fastMovingCategory: "N/A"
  });

  useEffect(() => { if (activeSection) setActive(activeSection); }, [activeSection]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileApi.getProfile();
        const data = res.data.data;
        setEditedData({
          userName: data.ownerName || "",
          userId: data.userId || "",
          role: data.businessType || "User",
          phone: data.mobileNumber || "",
          email: data.businessEmail || "",
          MemberSince: "Active", 
          companyName: data.businessName || "",
          businessType: data.businessType || "",
          gstNumber: data.gstNumber || "",
          altPhone: data.alternateMobileNumber || "",
          businessEmail: data.businessEmail || "",
          location: `${data.city || ''}, ${data.state || ''}`,
          yearsInBusiness: data.yearsInBusiness ? `${data.yearsInBusiness} Years` : "",
          operatingTiming: (data.openingTime && data.closingTime) ? `${data.openingTime} - ${data.closingTime}` : "",
          addressLine1: data.addressLine1 || "",
          addressLine2: data.addressLine2 || "",
          city: data.city || "",
          district: data.district || "",
          state: data.state || "",
          pincode: data.pincode || "",
          landmark: data.landmark || "",
          deliveryRadius: data.coverageRadiusKm ? `${data.coverageRadiusKm} KM` : "",
          minOrder: data.minimumOrderValue ? `₹${data.minimumOrderValue}` : "",
          deliveryCharges: data.deliveryCharge ? `₹${data.deliveryCharge}` : "",
          deliveryDays: data.operatingDays || "",
          routeSchedule: data.routeSchedule || "",
          trustScore: data.trustScore || 0,
          marketplaceRank: data.marketplaceRank || 0,
          verificationStatus: data.verificationStatus || "Pending",
          subCategories: data.subCategories || [],
          totalProducts: data.totalProducts || 0,
          lowStockCount: data.lowStockCount || 0,
          bestSellingProduct: data.bestSellingProduct || "N/A",
          fastMovingCategory: data.fastMovingCategory || "N/A"
        });
      } catch (error) {
        showNotification("error", "Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const showNotification = (type, msg) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditClick = (section) => setEditingSection(section);

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      if (editingSection === "account") {
        await profileApi.updateAccount({ ownerName: editedData.userName, mobileNumber: editedData.phone, businessEmail: editedData.email });
      } else if (editingSection === "business") {
        await profileApi.updateBusiness({ businessName: editedData.companyName, businessType: editedData.businessType, gstNumber: editedData.gstNumber, alternateMobileNumber: editedData.altPhone, yearsInBusiness: parseInt(editedData.yearsInBusiness) || 0 });
      } else if (editingSection === "delivery") {
        await profileApi.updateDelivery({ addressLine1: editedData.addressLine1, addressLine2: editedData.addressLine2, city: editedData.city, district: editedData.district, state: editedData.state, pincode: editedData.pincode, landmark: editedData.landmark, coverageRadiusKm: parseInt(editedData.deliveryRadius) || 0, minimumOrderValue: parseFloat(editedData.minOrder.replace('₹', '')) || 0, deliveryCharge: parseFloat(editedData.deliveryCharges.replace('₹', '')) || 0, operatingDays: editedData.deliveryDays, routeSchedule: editedData.routeSchedule });
      }
      showNotification("success", "Changes saved successfully!");
      setEditingSection(null);
    } catch (error) {
      showNotification("error", error.response?.data?.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field, value) => setEditedData((prev) => ({ ...prev, [field]: value }));

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-pink-500 mb-4" />
          <p className="font-semibold text-sm sm:text-base">Loading enterprise profile...</p>
        </div>
      );
    }
    const sharedProps = { editedData, handleFieldChange, isEditing: !isSaving && editingSection === active, isSaving, handleEditClick, handleSaveClick };

    switch (active) {
      case "account": return <AccountSection {...sharedProps} />;
      case "business": return <BusinessSection {...sharedProps} />;
      case "delivery": return <DeliverySection {...sharedProps} />;
      case "inventory": return <InventorySection subCategories={editedData.subCategories} totalProducts={editedData.totalProducts} lowStockCount={editedData.lowStockCount} bestSellingProduct={editedData.bestSellingProduct} fastMovingCategory={editedData.fastMovingCategory} />;
      default: return <AccountSection {...sharedProps} />;
    }
  };

// Inside your SettingsPage.jsx, right before the main return wrapper:

  return (
    <>
      {/* 1. Injecting the Premium Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}} />

      {/* 2. Applying Inter as the base font, with antialiasing for crispness */}
      <div className="relative min-h-screen overflow-hidden transition-all duration-500 font-['Inter',_sans-serif] antialiased">
        <AnimatePresence>
          {/* Notification code remains the same... */}
        </AnimatePresence>
        
        <div className="h-2 sm:h-4" />
        <div className="relative flex px-3 sm:px-5 lg:px-8 2xl:px-12 pb-6 sm:pb-8">
          <main className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-7xl">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}