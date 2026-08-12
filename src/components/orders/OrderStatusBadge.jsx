import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  pending: { label: "Pending", variant: "warning" },
  preparing: { label: "Preparing", variant: "navy" },
  ongoing: { label: "Ongoing", variant: "default" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function OrderStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: "secondary" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export const ORDER_STATUSES = Object.keys(STATUS_CONFIG);
export { STATUS_CONFIG };
