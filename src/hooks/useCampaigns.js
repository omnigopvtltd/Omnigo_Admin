import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign } from "@/api/campaigns";

export function useCampaigns(filters = {}) {
  return useQuery({
    queryKey: ["campaigns", filters],
    queryFn: () => getCampaigns(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateCampaign(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}