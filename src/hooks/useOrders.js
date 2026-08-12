import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/api/orders";

export function useOrders({ status, search } = {}) {
  return useQuery({
    queryKey: ["orders", { status, search }],
    queryFn: () => getOrders({ status, search }),
    placeholderData: (prev) => prev,
  });
}
