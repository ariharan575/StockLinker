// SettingsWrapper.js
import React from "react";
import MainLayout from "../Layout/MainLayout";
import SettingsPage from "./SettingsPage";

export default function SettingsWrapper() {
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Settings", path: "/settings" },
    { label: "Account", isCurrent: true }
  ];

  return (
    <MainLayout 
      activeNav="settings"
      breadcrumbItems={breadcrumbItems}
      maxWidth={1500}
      pageBackground="#F8FAFC"
      breadcrumbBackground="#F8FAFC"
      breadcrumbBorder="#e2e8f0"
      contentPadding="px-4 md:px-8 py-1.5"
      customStyles={{ backgroundColor: "#F8FAFC" }}
    >
      <SettingsPage />
    </MainLayout>
  );
}