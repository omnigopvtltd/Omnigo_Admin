import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsApi } from "../api/cms";

// Fetch FAQs
export const useFAQs = (params) => {
  return useQuery({
    queryKey: ["faqs", params],
    queryFn: () => cmsApi.getAdminFAQs(params).then((res) => res.data),
  });
};

// FAQ Mutations
export const useFAQMutations = () => {
  const queryClient = useQueryClient();

  const createFAQ = useMutation({
    mutationFn: cmsApi.createFAQ,
    onSuccess: () => queryClient.invalidateQueries(["faqs"]),
  });

  const updateFAQ = useMutation({
    mutationFn: ({ id, data }) => cmsApi.updateFAQ(id, data),
    onSuccess: () => queryClient.invalidateQueries(["faqs"]),
  });

  const deleteFAQ = useMutation({
    mutationFn: cmsApi.deleteFAQ,
    onSuccess: () => queryClient.invalidateQueries(["faqs"]),
  });

  return { createFAQ, updateFAQ, deleteFAQ };
};

// Terms Hooks
export const useTerms = () => {
  return useQuery({
    queryKey: ["terms"],
    queryFn: () => cmsApi.getAdminTerms().then((res) => res.data),
  });
};

export const useSaveTerms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cmsApi.saveTerms,
    onSuccess: () => queryClient.invalidateQueries(["terms"]),
  });
};