import React from "react";
import MainLayout from "../../Layout/MainLayout";
import ComparePrice from "../pages/ComparePrice";
import { C } from "../../Shopkeeper_Home/common"; // Optionally, you can change this to import from './config/constants' if you prefer

export default function ComparePageWrapper() {
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Smartphones", path: "/smartphones" },
    { label: "Compare Prices", isCurrent: true }
  ];

  return (
    <MainLayout 
      activeNav="compare"
      breadcrumbItems={breadcrumbItems}
      maxWidth={1400}
      contentPadding="px-4 md:px-6 lg:px-8 py-3"
      breadcrumbBackground="white"
      breadcrumbBorder="#e5e7eb"
      >
      <ComparePrice />
    </MainLayout>
  );
}