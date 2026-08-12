import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getRevenueSeries, getRecentOrders } from "@/api/dashboard";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
  });
}

export function useRevenueSeries() {
  return useQuery({
    queryKey: ["dashboard", "revenue"],
    queryFn: getRevenueSeries,
  });
}

export function useRecentOrders() {
  return useQuery({
    queryKey: ["dashboard", "recent-orders"],
    queryFn: getRecentOrders,
  });
}
