"use client";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Authentication/context/AuthContext";

import { AccountSection } from "./sections/AccountSection";
import { BusinessSection } from "./sections/BusinessSection";
import { StoreCategoriesSection } from "./sections/StoreCategoriesSection";
import { DeliveryInsightsSection } from "./sections/DeliveryInsightsSection";
import { profileApi } from "../Authentication/services/api";

// --- ADDED PREMIUM COMPONENTS IMPORTS ---
import { PremiumToast } from "../components/PremiumToast"; 
import { DataFetchError } from "../components/DataFetchError"; 

export default function SettingsPage({ activeSection = "account", onSectionChange }) {
  const { role } = useAuth(); // SECURE JWT ROLE
  const isWholesaler = role?.toUpperCase() === "WHOLESALER";

  const [editingSection, setEditingSection] = useState(null);
  const [active, setActive] = useState(activeSection);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- ADDED STATE FOR DATA FETCH ERROR ---
  const [fetchError, setFetchError] = useState(false); 
  
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
    // Protection fallback
    if (activeSection === "delivery-insights" && !isWholesaler) {
      setActive("store");
      if (onSectionChange) onSectionChange("store");
    } else {
      setActive(activeSection);
    }
  }, [activeSection, isWholesaler, onSectionChange]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetchError(false); // Reset error state before fetch
        const res = await profileApi.getProfile();
        const data = res.data.data;
        setEditedData({
          userName: data.ownerName || "",
          userId: data.userId || "",
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
          deliveryRadius: data.coverageRadiusKm ? `${data.coverageRadiusKm}` : "",
          minOrder: data.minimumOrderValue ? `${data.minimumOrderValue}` : "",
          deliveryCharges: data.deliveryCharge ? `${data.deliveryCharge}` : "",
          deliveryDays: data.operatingDays || "",
          routeSchedule: data.routeSchedule || "",
          trustScore: data.trustScore || 0,
          marketplaceRank: data.marketplaceRank || 0,
          verificationStatus: data.verificationStatus || "Pending",
          subCategories: data.subCategories || [],
          totalProducts: data.totalProducts || 0,
          lowStockCount: data.lowStockCount || 0,
          bestSellingProduct: data.bestSellingProduct || "",
          fastMovingCategory: data.fastMovingCategory || ""
        });
      } catch (error) {
        setFetchError(true); // --- TRIGGER ERROR COMPONENT ON FAIL ---
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const showNotification = (type, msg) => {
    setNotification({ type, msg });
    // setTimeout(() => setNotification(null), 3000); // Removed inline timeout since PremiumToast handles it smoothly
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
    // --- ADDED CHECK TO SHOW PREMIUM ERROR STATE ---
    if (fetchError) {
      return <DataFetchError onRetry={() => window.location.reload()} />;
    }

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
        
        {/* --- REPLACED OLD NOTIFICATION WITH PREMIUM TOAST --- */}
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
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}