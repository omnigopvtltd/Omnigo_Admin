// import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
// import {
//   createRiders,
//   deleteRider,
//   getRiders,
//   updateRider,
//   updateRiderStatus,
// } from "@/api/riders";

// // ==========================================
// // 1. Hook: Get Riders List
// // ==========================================
// export function useRiders({ status, search } = {}) {
//   return useQuery({
//     queryKey: ["riders", { status, search }],
//     queryFn: () => getRiders({ status, search }),
//     placeholderData: (prev) => prev,
//   });
// }

// // ==========================================
// // 2. Hook: Create Rider
// // ==========================================
// export function useCreateRider() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: createRiders,
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["riders"] }),
//   });
// }

// // ==========================================
// // 3. Hook: Update Rider (Info/Zones)
// // ==========================================
// export function useUpdateRider() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, payload }) => updateRider(id, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["riders"] });
//     },
//   });
// }

// // ==========================================
// // 4. Hook: Update Status (Block/Unblock)
// // ==========================================
// export function useUpdateRiderStatus() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, isBlocked }) => updateRiderStatus(id, isBlocked),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["riders"] });
//     },
//   });
// }

// // ==========================================
// // 5. Hook: Delete Rider
// // ==========================================
// export function useDeleteRider() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: deleteRider,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["riders"] });
//     },
//   });
// }


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRiders, getRiderById, createRider, updateRider, updateRiderBlockStatus, deleteRider,
  reviewCnicVerification, reviewFaceVerification, getRiderWallet, adjustRiderWallet, deductBikeInstallment,
} from "@/api/riders";

export function useRiders(filters = {}) {
  return useQuery({
    queryKey: ["riders", filters],
    queryFn: () => getRiders(filters),
    placeholderData: (prev) => prev,
  });
}

export function useRider(id) {
  return useQuery({
    queryKey: ["riders", id],
    queryFn: () => getRiderById(id),
    enabled: !!id,
  });
}

export function useCreateRider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRider,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["riders"] }),
  });
}

export function useUpdateRider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateRider(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["riders"] }),
  });
}

export function useUpdateRiderBlockStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isBlocked }) => updateRiderBlockStatus(id, isBlocked),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["riders"] }),
  });
}

export function useDeleteRider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRider,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["riders"] }),
  });
}

export function useReviewCnic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, rejectionReason }) => reviewCnicVerification(id, { status, rejectionReason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["riders"] }),
  });
}

export function useReviewFace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, rejectionReason }) => reviewFaceVerification(id, { status, rejectionReason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["riders"] }),
  });
}

export function useRiderWallet(id) {
  return useQuery({
    queryKey: ["riders", id, "wallet"],
    queryFn: () => getRiderWallet(id),
    enabled: !!id,
  });
}

export function useAdjustRiderWallet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, type, amount, reason }) => adjustRiderWallet(id, { type, amount, reason }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      queryClient.invalidateQueries({ queryKey: ["riders", vars.id, "wallet"] });
    },
  });
}

export function useDeductBikeInstallment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deductBikeInstallment,
    onSuccess: (data) => {
      alert(data?.message || "Installment deducted successfully!");
      // Refresh riders list to reflect updated wallet balance
      queryClient.invalidateQueries({ queryKey: ["riders"] });
    },
    onError: (error) => {
      alert(
        error.response?.data?.message || "Failed to deduct bike installment."
      );
    },
  });
}