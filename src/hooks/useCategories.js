import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories, createCategory, updateCategory, deleteCategory, reorderCategories,
  createSubCategory, updateSubCategory, deleteSubCategory,
} from "@/api/categories";
import { useSocket } from "@/hooks/useSocket";

export function useCategories() {
  const queryClient = useQueryClient();
  const { socket, status, connect } = useSocket(null, "/");

  useEffect(() => {
    connect();
  }, [connect]);

  // Real-Time Socket Listener
  useEffect(() => {
    if (!socket || status !== "connected") return;

    const handleCategoryCreated = (newCat) => {
      queryClient.setQueryData(["categories"], (old = []) => [...old, newCat]);
    };

    const handleCategoryUpdated = (updatedCat) => {
      queryClient.setQueryData(["categories"], (old = []) =>
        old.map((c) => (c._id === updatedCat._id ? updatedCat : c))
      );
    };

    const handleCategoryDeleted = ({ id }) => {
      queryClient.setQueryData(["categories"], (old = []) =>
        old.filter((c) => c._id !== id)
      );
    };

    const handleCategoriesReordered = () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    };

    socket.on("category:created", handleCategoryCreated);
    socket.on("category:updated", handleCategoryUpdated);
    socket.on("category:deleted", handleCategoryDeleted);
    socket.on("categories:reordered", handleCategoriesReordered);

    return () => {
      socket.off("category:created", handleCategoryCreated);
      socket.off("category:updated", handleCategoryUpdated);
      socket.off("category:deleted", handleCategoryDeleted);
      socket.off("categories:reordered", handleCategoriesReordered);
    };
  }, [socket, status, queryClient]);

  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useReorderCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderCategories,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useCreateSubCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateSubCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subId, payload }) => updateSubCategory(subId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteSubCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}