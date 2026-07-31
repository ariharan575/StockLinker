import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import SettingsPage from "./SettingsPage";

export default function SettingsRouter() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveSettingsSection = () => {
    const path = location.pathname;
    if (path.includes('/settings/account')) return 'account';
    if (path.includes('/settings/business')) return 'business';
    if (path.includes('/settings/delivery')) return 'delivery';
    if (path.includes('/settings/inventory')) return 'inventory';
    return 'account';
  };

  const activeSettingsSection = getActiveSettingsSection();

  const handleSettingsSectionChange = (section) => {
    const sectionPaths = {
      account: '/settings/account',
      business: '/settings/business',
      delivery: '/settings/delivery',
      inventory: '/settings/inventory',
    };
    navigate(sectionPaths[section]);
  };

  return (
    <MainLayout 
      activeNav="settings"
      maxWidth={1500}
      pageBackground="#FAFAFA" /* Slightly softer premium white/gray */
      breadcrumbBackground="#FAFAFA"
      breadcrumbBorder="#F1F5F9" /* Lighter slate border */
      contentPadding=""
      customStyles={{ backgroundColor: "#FAFAFA" }}
    >
      <SettingsPage 
        activeSection={activeSettingsSection}
        onSectionChange={handleSettingsSectionChange}
      />
    </MainLayout>
  );
}