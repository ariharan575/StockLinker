// ConnectedSupplierWrapper.js
import React from "react";
import MainLayout from "../Layout/MainLayout";
import ConnectedSupplierPage from "./ConnectedSupplierPage";

export default function ConnectedSupplierWrapper() {
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Nearbyseller", path: "/nearbyseller" },
    { label: "Compare Prices", isCurrent: true }
  ];

  return (
    <MainLayout 
      activeNav="suppliers"
      breadcrumbItems={breadcrumbItems}
      maxWidth={1400}
    >
      <ConnectedSupplierPage />
    </MainLayout>
  );
}