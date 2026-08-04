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
    if (path.includes('/settings/store')) return 'store';
    if (path.includes('/settings/delivery-insights')) return 'delivery-insights';
    return 'account';
  };

  const activeSettingsSection = getActiveSettingsSection();

  const handleSettingsSectionChange = (section) => {
    const sectionPaths = {
      account: '/settings/account',
      business: '/settings/business',
      store: '/settings/store',
      'delivery-insights': '/settings/delivery-insights',
    };
    navigate(sectionPaths[section]);
  };

  return (
    <MainLayout 
      activeNav="settings"
      maxWidth={1500}
      pageBackground="#FAFAFA"
      breadcrumbBackground="#FAFAFA"
      breadcrumbBorder="#F1F5F9"
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