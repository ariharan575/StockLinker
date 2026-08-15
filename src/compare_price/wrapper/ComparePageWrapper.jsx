import React from "react";
import MainLayout from "../../layout/MainLayout";
import ComparePrice from "../pages/ComparePrice";
import { C } from "../../layout/common/constants"; 

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