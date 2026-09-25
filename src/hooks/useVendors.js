import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getVendors,
  getVendorById,
  getVendorMenuById,
  // createVendor,
  updateVendor,
  updateVendorStatus,
  deleteVendor,
} from "@/api/vendors";

export function useVendors(filters = {}) {
  return useQuery({
    queryKey: ["vendors", filters],
    queryFn: () => getVendors(filters),
    placeholderData: (prev) => prev,
  });
}

export function useVendor(id) {
  return useQuery({
    queryKey: ["vendors", id],
    queryFn: () => getVendorById(id),
    enabled: !!id,
  });
}

export function useVendorMenu(id) {
  return useQuery({
    queryKey: ["vendors", id],
    queryFn: () => getVendorMenuById(id),
    enabled: !!id,
  });
}

// export function useCreateVendor() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: createVendor,
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendors"] }),
//   });
// }

export function useUpdateVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateVendor(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendors"] }),
  });
}

export function useUpdateVendorStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateVendorStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendors"] }),
  });
}

export function useDeleteVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vndors"] });
      queryClient.invalidateQueries({ queryKey: ["products"] }); // cascading delete on the backend
    },
  });
}