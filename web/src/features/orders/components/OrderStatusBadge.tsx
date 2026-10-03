import type { BuyerOrder } from "@/src/features/marketplace/types";
import { CheckCircle2, CircleX, Clock3, TimerOff } from "lucide-react";

export function OrderStatusBadge({ status }: { status: BuyerOrder["status"] }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/90 px-3 py-1 text-xs font-semibold text-amber-800">
        <Clock3 className="size-3.5" aria-hidden="true" />
        Pending
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-3 py-1 text-xs font-semibold text-emerald-800">
        <CheckCircle2 className="size-3.5" aria-hidden="true" />
        Completed
      </span>
    );
  }
  if (status === "cancelled") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50/90 px-3 py-1 text-xs font-semibold text-rose-700">
        <CircleX className="size-3.5" aria-hidden="true" />
        Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
      <TimerOff className="size-3.5" aria-hidden="true" />
      Expired
    </span>
  );
}
