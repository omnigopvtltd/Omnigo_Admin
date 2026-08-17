import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zoneApi } from "../api/zone";

export const useZones = () => {
  const queryClient = useQueryClient();

  // Fetch zones list
  const zonesQuery = useQuery({
    queryKey: ["zones"],
    queryFn: zoneApi.getZones,
  });

  // Create zone mutation
  const createMutation = useMutation({
    mutationFn: zoneApi.createZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });

  // Update zone mutation
  const updateMutation = useMutation({
    mutationFn: zoneApi.updateZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });

  // Delete zone mutation
  const deleteMutation = useMutation({
    mutationFn: zoneApi.deleteZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });

  // Status toggle mutation
  const toggleStatusMutation = useMutation({
    mutationFn: zoneApi.toggleZoneStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });

  return {
    zones: zonesQuery.data?.zones || [],
    isLoading: zonesQuery.isLoading,
    isError: zonesQuery.isError,
    error: zonesQuery.error,
    refetch: zonesQuery.refetch,
    createZone: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateZone: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteZone: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    toggleStatus: toggleStatusMutation.mutateAsync,
  };
};