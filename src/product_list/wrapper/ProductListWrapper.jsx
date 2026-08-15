// ProductCategoryWrapper.js
import React from "react";
import MainLayout from "../../layout/MainLayout";
import ProductListPage from "../pages/ProductListPage";

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
      <ProductListPage/>
    </MainLayout>
  );
}