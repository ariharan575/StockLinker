import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import SettingsPage from "./SettingsPage";

export default function SettingsRoute() {
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

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Settings", path: "/settings" },
    { label: activeSettingsSection, isCurrent: true }
  ];

  return (
    <MainLayout 
      activeNav="settings"
      breadcrumbItems={breadcrumbItems}
      maxWidth={1500}
      pageBackground="#F8FAFC"
      breadcrumbBackground="#F8FAFC"
      breadcrumbBorder="#e2e8f0"
      contentPadding=""
      customStyles={{ backgroundColor: "#F8FAFC" }}
    >
      <SettingsPage 
        activeSection={activeSettingsSection}
        onSectionChange={handleSettingsSectionChange}
      />
    </MainLayout>
  );
}