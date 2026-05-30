import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  value?: string;
};

export function StatusBadge({ value }: StatusBadgeProps) {
  const normalized = String(value || "N/A").toUpperCase();
  const label = normalized.replace(/_/g, " ");
  const variant =
    ["DELIVERED", "PAID", "COMPLETED", "SUCCESS", "CONFIRMED"].includes(normalized)
      ? "success"
      : ["NEW", "PENDING", "PROCESSING", "SHIPPED", "UNPAID", "UNFULFILLED"].includes(normalized)
        ? "warning"
        : ["CANCELLED", "FAILED", "RETURNED", "REFUNDED"].includes(normalized)
          ? "danger"
          : "secondary";

  return <Badge variant={variant}>{label}</Badge>;
}
