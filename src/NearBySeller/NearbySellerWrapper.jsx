// NearbySellerWrapper.js
import React from "react";
import MainLayout from "../Layout/MainLayout";
import NearbySellerPage from "./NearbySellerPage";

export default function NearbySellerWrapper() {
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Nearbyseller", path: "/nearbyseller" },
    { label: "Compare Prices", isCurrent: true }
  ];

  return (
    <MainLayout 
      activeNav="home"
      breadcrumbItems={breadcrumbItems}
      maxWidth={1400}
    >
      <NearbySellerPage />
    </MainLayout>
  );
}