"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // --- ADDED TANSTACK QUERY ---
import { useAuth } from "../Authentication/context/AuthContext";

import { AccountSection } from "./sections/AccountSection";
import { BusinessSection } from "./sections/BusinessSection";
import { StoreCategoriesSection } from "./sections/StoreCategoriesSection";
import { DeliveryInsightsSection } from "./sections/DeliveryInsightsSection";
import { profileApi } from "../Authentication/services/api";

// --- ADDED PREMIUM COMPONENTS IMPORTS ---
import { PremiumToast } from "../components/PremiumToast"; 
import { DataFetchError } from "../components/DataFetchError"; 

// ============================================================
// ✅ PREMIUM SETTINGS SKELETON
// ============================================================
const SettingsSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-6">
    <div className="h-[120px] sm:h-[160px] bg-slate-200/80 rounded-[24px] border border-slate-100" />
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
      <div className="h-[400px] bg-slate-200/80 rounded-[24px] border border-slate-100" />
      <div className="h-[400px] bg-slate-200/80 rounded-[24px] border border-slate-100" />
    </div>
  </div>
);

export default function SettingsPage({ activeSection = "account", onSectionChange }) {
  const { role } = useAuth(); 
  const queryClient = useQueryClient();
  const isWholesaler = role?.toUpperCase() === "WHOLESALER";

  const [editingSection, setEditingSection] = useState(null);
  const [active, setActive] = useState(activeSection);
  
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const [editedData, setEditedData] = useState({
    userName: "", userId: "", phone: "", email: "", MemberSince: "",
    companyName: "", businessType: "", category: "", gstNumber: "", operatingTiming: "",
    altPhone: "", businessEmail: "", location: "", yearsInBusiness: "",
    addressLine1: "", addressLine2: "", city: "", district: "", state: "", pincode: "",
    landmark: "", deliveryRadius: "", minOrder: "", deliveryCharges: "",
    deliveryDays: "", routeSchedule: "",
    trustScore: 0, marketplaceRank: 0, verificationStatus: "",
    subCategories: [], totalProducts: 0, lowStockCount: 0, bestSellingProduct: "", fastMovingCategory: ""
  });

  useEffect(() => { 
    if (activeSection === "delivery-insights" && !isWholesaler) {
      setActive("store");
      if (onSectionChange) onSectionChange("store");
    } else {
      setActive(activeSection);
    }
  }, [activeSection, isWholesaler, onSectionChange]);

  // ✅ TANSTACK QUERY INTEGRATION
  const { 
    data: profileData, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['userSettingsProfile'],
    queryFn: async () => {
      const res = await profileApi.getProfile();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000, // Instant cache access for 5 minutes
  });

  // Sync React Query cache into local state for editing
  useEffect(() => {
    if (profileData) {
      setEditedData({
        userName: profileData.ownerName || "",
        userId: profileData.userId || "",
        phone: profileData.mobileNumber || "",
        email: profileData.businessEmail || "",
        MemberSince: "Active", 
        companyName: profileData.businessName || "",
        businessType: profileData.businessType || "",
        gstNumber: profileData.gstNumber || "",
        altPhone: profileData.alternateMobileNumber || "",
        businessEmail: profileData.businessEmail || "",
        location: `${profileData.city || ''}, ${profileData.state || ''}`,
        yearsInBusiness: profileData.yearsInBusiness ? `${profileData.yearsInBusiness} Years` : "",
        operatingTiming: (profileData.openingTime && profileData.closingTime) ? `${profileData.openingTime} - ${profileData.closingTime}` : "",
        addressLine1: profileData.addressLine1 || "",
        addressLine2: profileData.addressLine2 || "",
        city: profileData.city || "",
        district: profileData.district || "",
        state: profileData.state || "",
        pincode: profileData.pincode || "",
        landmark: profileData.landmark || "",
        deliveryRadius: profileData.coverageRadiusKm ? `${profileData.coverageRadiusKm}` : "",
        minOrder: profileData.minimumOrderValue ? `${profileData.minimumOrderValue}` : "",
        deliveryCharges: profileData.deliveryCharge ? `${profileData.deliveryCharge}` : "",
        deliveryDays: profileData.operatingDays || "",
        routeSchedule: profileData.routeSchedule || "",
        trustScore: profileData.trustScore || 0,
        marketplaceRank: profileData.marketplaceRank || 0,
        verificationStatus: profileData.verificationStatus || "Pending",
        subCategories: profileData.subCategories || [],
        totalProducts: profileData.totalProducts || 0,
        lowStockCount: profileData.lowStockCount || 0,
        bestSellingProduct: profileData.bestSellingProduct || "",
        fastMovingCategory: profileData.fastMovingCategory || ""
      });
    }
  }, [profileData]);

  const showNotification = (type, msg) => {
    setNotification({ type, msg });
  };

  const handleEditClick = (section) => setEditingSection(section);

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      if (editingSection === "account") {
        await profileApi.updateAccount({ ownerName: editedData.userName, mobileNumber: editedData.phone, businessEmail: editedData.email });
      } else if (editingSection === "business") {
        await profileApi.updateBusiness({ businessName: editedData.companyName, businessType: editedData.businessType, gstNumber: editedData.gstNumber, alternateMobileNumber: editedData.altPhone, yearsInBusiness: parseInt(editedData.yearsInBusiness) || 0 });
      } else if (editingSection === "store") {
        await profileApi.updateStore({ addressLine1: editedData.addressLine1, addressLine2: editedData.addressLine2, city: editedData.city, district: editedData.district, state: editedData.state, pincode: editedData.pincode, landmark: editedData.landmark });
      } else if (editingSection === "delivery-insights") {
        await profileApi.updateDeliveryInsights({ 
            coverageRadiusKm: parseInt(editedData.deliveryRadius) || 0, 
            minimumOrderValue: parseFloat(editedData.minOrder.toString().replace('₹', '')) || 0, 
            deliveryCharge: parseFloat(editedData.deliveryCharges.toString().replace('₹', '')) || 0, 
            operatingDays: editedData.deliveryDays, 
            routeSchedule: editedData.routeSchedule,
            bestSellingProduct: editedData.bestSellingProduct,
            fastMovingCategory: editedData.fastMovingCategory
        });
      }
      
      // Tell TanStack Query that the data has changed, so it updates the cache
      queryClient.invalidateQueries({ queryKey: ['userSettingsProfile'] });
      
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
    // --- SHOW PREMIUM ERROR STATE ---
    if (isError) {
      return <DataFetchError onRetry={() => refetch()} />;
    }

    // --- SHOW PREMIUM SKELETON ---
    if (isLoading) {
      return <SettingsSkeleton />;
    }

    const sharedProps = { editedData, handleFieldChange, isEditing: !isSaving && editingSection === active, isSaving, handleEditClick, handleSaveClick };

    switch (active) {
      case "account": return <AccountSection {...sharedProps} />;
      case "business": return <BusinessSection {...sharedProps} />;
      case "store": return <StoreCategoriesSection {...sharedProps} />;
      case "delivery-insights": return <DeliveryInsightsSection {...sharedProps} />;
      default: return <AccountSection {...sharedProps} />;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}} />

      <div className="relative min-h-screen overflow-hidden transition-all duration-500 font-['Inter',_sans-serif] antialiased">
        <PremiumToast 
          isVisible={!!notification} 
          type={notification?.type || 'info'} 
          message={notification?.msg} 
          onClose={() => setNotification(null)} 
        />
        
        <div className="h-2 sm:h-4" />
        <div className="relative flex px-3 sm:px-5 lg:px-8 2xl:px-12 pb-6 sm:pb-8">
          <main className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-7xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}