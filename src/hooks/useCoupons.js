import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/api/coupons";

export function useCoupons(filters = {}) {
  return useQuery({
    queryKey: ["coupons", filters],
    queryFn: () => getCoupons(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCoupon,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateCoupon(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });
}