// hooks/useDashboardData.js
import { useEffect, useState } from "react";
import {
  kpiData,
  initialProducts,
  enquiries,
  orders,
  orderTabs,
  suppliers,
} from "../data/mockData";

/**
 * In production this hook would fetch from your API (React Query / SWR).
 * It currently returns local mock data after a short simulated delay so
 * the skeleton loaders in DashboardHome have something to demonstrate.
 */
export default function useDashboardData() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return {
    isLoading,
    kpis: kpiData,
    products: initialProducts,
    enquiries,
    orders,
    orderTabs,
    suppliers,
  };
}
