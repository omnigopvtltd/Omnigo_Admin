import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createMenu, getMenu, toggleProductAvailability } from "@/api/menu";

export function useCreateMenu(restaurantId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      alert("Menu saved and updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["menu", { restaurantId }] });
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to save menu");
    },
  });
}

export function useMenu(params = {}) {
  return useQuery({
    queryKey: ["menu", params],
    queryFn: () => getMenu(params),
  });
}

export function useToggleProductAvailability(params = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleProductAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu", params] });
    },
  });
}