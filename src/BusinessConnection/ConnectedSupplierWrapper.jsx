import React from "react";
import MainLayout from "../Layout/MainLayout";
import ConnectedSupplierPage from "./ConnectedSupplierPage";

export default function ConnectedSupplierWrapper() {
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Network", path: "/network" },
    { label: "Connections", isCurrent: true }
  ];

  return (
    <MainLayout 
      activeNav="suppliers"
      breadcrumbItems={breadcrumbItems}
      maxWidth={1400}
      pageBackground="#FAFAFA"
      customStyles={{ backgroundColor: "#FAFAFA" }}
    >
      <ConnectedSupplierPage />
    </MainLayout>
  );
}