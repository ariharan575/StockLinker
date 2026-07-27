import React from "react";
import MainLayout from "../Layout/MainLayout";
import NearbySellerPage from "./NearbySellerPage"; // Points to the file above

export default function NearbySellerWrapper() {
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Network", path: "/network" },
    { label: "Discover", isCurrent: true }
  ];

  return (
    <MainLayout 
      activeNav="home"
      breadcrumbItems={breadcrumbItems}
      maxWidth={1440}
      pageBackground="#FAFAFA"
      customStyles={{ backgroundColor: "#FAFAFA" }}
    >
      <NearbySellerPage />
    </MainLayout>
  );
}