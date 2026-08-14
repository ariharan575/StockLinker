import React from "react";
import MainLayout from "../../Layout/MainLayout";
import NearbySellerPage from "../pages/NearbySellerDiscoveryPage"; // Points to the file above

export default function NearbySellerWrapper() {

  return (
    <MainLayout 
      activeNav="home"
      maxWidth={1440}
      pageBackground="#FAFAFA"
      customStyles={{ backgroundColor: "#FAFAFA" }}
    >
      <NearbySellerPage />
    </MainLayout>
  );
}