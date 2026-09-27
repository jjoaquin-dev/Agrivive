import type { BuyerOrder } from "@/src/features/marketplace/types";
import { CheckCircle2, CircleX, Clock3, TimerOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const labels: Record<BuyerOrder["status"], string> = {
  pending: "Pending pickup",
  completed: "Completed",
  cancelled: "Cancelled",
  expired: "Expired",
};

export function OrderStatusBadge({ status }: { status: BuyerOrder["status"] }) {
  const variants = { pending: "secondary", completed: "success", cancelled: "destructive", expired: "outline" } as const;
  const Icon = status === "completed" ? CheckCircle2 : status === "pending" ? Clock3 : status === "expired" ? TimerOff : CircleX;
  return <Badge variant={variants[status]} className="gap-1.5"><Icon aria-hidden="true" className="size-3.5" />{labels[status]}</Badge>;
}
