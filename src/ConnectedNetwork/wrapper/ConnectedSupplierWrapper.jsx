import React from "react";
import MainLayout from "../../Layout/MainLayout";
import ConnectedSupplierPage from "../pages/ConnectedSupplierPage";

export default function ConnectedSupplierWrapper() {

  return (
    <MainLayout 
      activeNav="suppliers"
      maxWidth={1400}
      pageBackground="#FAFAFA"
    >
      <ConnectedSupplierPage />
    </MainLayout>
  );
}