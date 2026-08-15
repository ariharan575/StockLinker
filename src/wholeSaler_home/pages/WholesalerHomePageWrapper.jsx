import React from "react";
import MainLayout from "../../layout/MainLayout";
import DashboardHome from "./DashboardHome";

export default function ProductCategoryWrapper() {
  return (
    <MainLayout 
      activeNav="categories"
      maxWidth={1440}
      pageBackground="#ffffff"
      breadcrumbBackground="#ffffff"
      breadcrumbBorder="#f3f4f6"
      contentPadding="px-0 pt-0"
      customStyles={{ backgroundColor: "#ffffff" }}
    >
      <DashboardHome/>
    </MainLayout>
  );
}