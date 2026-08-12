import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getHomeChefs,
  getHomeChefById,
  createHomeChef,
  updateHomeChef,
  updateHomeChefStatus,
  deleteHomeChef,
} from "@/api/homeChefs";

export function useHomeChefs(filters = {}) {
  return useQuery({
    queryKey: ["homeChefs", filters],
    queryFn: () => getHomeChefs(filters),
    placeholderData: (prev) => prev,
  });
}

export function useHomeChef(id) {
  return useQuery({
    queryKey: ["homeChefs", id],
    queryFn: () => getHomeChefById(id),
    enabled: !!id,
  });
}

export function useCreateHomeChef() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHomeChef,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["homeChefs"] }),
  });
}

export function useUpdateHomeChef() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateHomeChef(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["homeChefs"] }),
  });
}

export function useUpdateHomeChefStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateHomeChefStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["homeChefs"] }),
  });
}

export function useDeleteHomeChef() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHomeChef,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeChefs"] });
      queryClient.invalidateQueries({ queryKey: ["products"] }); // cascading delete on the backend
    },
  });
}