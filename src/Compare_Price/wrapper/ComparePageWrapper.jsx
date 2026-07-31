import React from "react";
import MainLayout from "../../Layout/MainLayout";
import ComparePrice from "../pages/ComparePrice";
import { C } from "../../Layout/common/constants"; 

export default function ComparePageWrapper() {

  return (
    <MainLayout 
      activeNav="compare"
      breadcrumbBackground="white"
      breadcrumbBorder="#e5e7eb"
      >
      <ComparePrice />
    </MainLayout>
  );
}