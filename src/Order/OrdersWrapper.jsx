// OrdersWrapper.js
import React from "react";
import MainLayout from "../Layout/MainLayout";
import OrdersPage from "./OrderPage";

export default function OrdersWrapper() {

  return (
    <MainLayout 
      activeNav="orders"
      breadcrumbBackground="white"
      breadcrumbBorder="#e5e7eb"
    >
      <OrdersPage />
    </MainLayout>
  );
}