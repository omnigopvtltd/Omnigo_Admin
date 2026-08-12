import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getCustomers, updateCustomerStatus } from "@/api/customers";

// export function useCustomers({ status, search } = {}) {
//   return useQuery({
//     queryKey: ["users", { status, search }],
//     queryFn: () => getCustomers({ status, search }),
//     placeholderData: (prev) => prev,
//   });
// }

// export function useCustomerStatus() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, status }) => updateCustomerStatus(id, status),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
//   });
// }

export function useCustomers({ status, search } = {}) {
  return useQuery({
    queryKey: ["users", { status, search }],
    queryFn: () => getCustomers({ status, search }),
    placeholderData: (prev) => prev,
  });
}

export function useCustomerStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    // Receives { id, isBlocked } from UI
    mutationFn: ({ id, isBlocked }) => updateCustomerStatus(id, isBlocked),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}