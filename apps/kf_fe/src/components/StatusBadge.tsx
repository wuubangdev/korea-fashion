import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  value?: string;
};

export function StatusBadge({ value }: StatusBadgeProps) {
  const label = value || "N/A";

  return <Badge>{label}</Badge>;
}
