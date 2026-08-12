import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSessions, createSession, updateSession, deleteSession, getSessionParticipants,
} from "@/api/riderSessions";

export function useRiderSessions(filters = {}) {
  return useQuery({
    queryKey: ["riderSessions", filters],
    queryFn: () => getSessions(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["riderSessions"] }),
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateSession(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["riderSessions"] }),
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["riderSessions"] }),
  });
}

export function useSessionParticipants(id, filters = {}) {
  return useQuery({
    queryKey: ["riderSessions", id, "participants", filters],
    queryFn: () => getSessionParticipants(id, filters),
    enabled: !!id,
  });
}