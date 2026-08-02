// ProductCategoryWrapper.js
import React from "react";
import MainLayout from "../Layout/MainLayout";
import SupplierStorefront from "./pages/SupplierStorefront";

export default function ProductCategoryWrapper() {

  return (
    <MainLayout 
      activeNav="categories"
      maxWidth={1440}
      pageBackground="#F8FAFC"
      breadcrumbBackground="#F8FAFC"
      breadcrumbBorder="#e2e8f0"
      contentPadding=""
      customStyles={{ backgroundColor: "#F8FAFC" }}
    >
      <SupplierStorefront/>
    </MainLayout>
  );
}