// OrdersWrapper.js
import React from "react";
import MainLayout from "../Layout/MainLayout";
import OrdersPage from "./OrderPage";

export default function OrdersWrapper() {
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Nearbyseller", path: "/nearbyseller" },
    { label: "Compare Prices", isCurrent: true }
  ];

  return (
    <MainLayout 
      activeNav="orders"
      breadcrumbItems={breadcrumbItems}
      breadcrumbBackground="white"
      breadcrumbBorder="#e5e7eb"
    >
      <OrdersPage />
    </MainLayout>
  );
}