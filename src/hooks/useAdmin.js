// hooks/useAdminAuth.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminLogin } from "@/api/admin";

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      // Save Token & Admin Info to localStorage
      if (data?.token) {
        localStorage.setItem("adminToken", data.token);
        if (data?.admin) {
          localStorage.setItem("adminData", JSON.stringify(data.admin));
        }
      }

      // Invalidate queries to refresh state
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}