import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRevenueOverview, getRestaurantEarnings, getRiderEarnings, getCommissionSummary,
  getWithdrawRequests, updateWithdrawRequestStatus, getTransactions,
} from "@/api/finance";

export function useRevenueOverview(range = "30d") {
  return useQuery({ queryKey: ["finance", "revenue", range], queryFn: () => getRevenueOverview({ range }) });
}

export function useRestaurantEarnings(filters = {}) {
  return useQuery({
    queryKey: ["finance", "restaurant-earnings", filters],
    queryFn: () => getRestaurantEarnings(filters),
    placeholderData: (prev) => prev,
  });
}

export function useRiderEarnings(filters = {}) {
  return useQuery({
    queryKey: ["finance", "rider-earnings", filters],
    queryFn: () => getRiderEarnings(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCommissionSummary(range = "30d") {
  return useQuery({ queryKey: ["finance", "commission", range], queryFn: () => getCommissionSummary({ range }) });
}

export function useWithdrawRequests(filters = {}) {
  return useQuery({
    queryKey: ["finance", "withdrawals", filters],
    queryFn: () => getWithdrawRequests(filters),
    placeholderData: (prev) => prev,
  });
}

export function useUpdateWithdrawRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, adminNote }) => updateWithdrawRequestStatus(id, { status, adminNote }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["finance"] }),
  });
}

export function useTransactions(filters = {}) {
  return useQuery({
    queryKey: ["finance", "transactions", filters],
    queryFn: () => getTransactions(filters),
    placeholderData: (prev) => prev,
  });
}