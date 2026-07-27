// ProductCategoryWrapper.js
import React from "react";
import MainLayout from "../Layout/MainLayout";
import ProductListPage from "./components/ProductListPage";

export default function ProductCategoryWrapper() {
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Nearbyseller", path: "/nearbyseller" },
    { label: "Compare Prices", isCurrent: true }
  ];

  return (
    <MainLayout 
      activeNav="categories"
      breadcrumbItems={breadcrumbItems}
      maxWidth={1500}
      pageBackground="#F8FAFC"
      breadcrumbBackground="#F8FAFC"
      breadcrumbBorder="#e2e8f0"
      contentPadding="md:ps-4"
      customStyles={{ backgroundColor: "#F8FAFC" }}
    >
      <ProductListPage/>
    </MainLayout>
  );
}