import { Check, Clock, PackageCheck, Store, XCircle } from "lucide-react";
import type { BuyerOrder } from "@/src/features/marketplace/types";

interface OrderPickupStepperProps {
  status: BuyerOrder["status"];
  createdAt: string;
  expiresAt: string | null;
}

export function OrderPickupStepper({ status, createdAt, expiresAt }: OrderPickupStepperProps) {
  const isCancelled = status === "cancelled";
  const isExpired = status === "expired";
  const isCompleted = status === "completed";
  const isPending = status === "pending";

  const steps = [
    {
      id: "reserved",
      label: "Reserved",
      caption: new Date(createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric" }),
      done: true,
      current: false,
      alert: false,
      icon: Check,
    },
    {
      id: "pickup",
      label: "Ready for pickup",
      caption: isPending ? "Present pass at stall" : isCompleted ? "Picked up" : "Ended",
      done: isCompleted,
      current: isPending,
      alert: false,
      icon: isPending ? Clock : isCompleted ? Check : Store,
    },
    {
      id: "completed",
      label: isCancelled ? "Cancelled" : isExpired ? "Expired" : "Completed",
      caption: isCompleted
        ? "Produce received"
        : isCancelled
          ? "Returned to stock"
          : isExpired
            ? "Hold expired"
            : expiresAt
              ? `Until ${new Date(expiresAt).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" })}`
              : "24h hold",
      done: isCompleted,
      current: isCancelled || isExpired,
      alert: isCancelled || isExpired,
      icon: isCancelled || isExpired ? XCircle : PackageCheck,
    },
  ];

  return (
    <div className="rounded-[20px] border border-border/80 bg-white p-5 shadow-[0_10px_24px_rgba(31,77,58,0.05)] sm:p-6" aria-label="Pickup progress">
      <div className="relative flex items-center justify-between">
        {/* Connecting track line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-border" aria-hidden="true" />
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-agrivive-primary transition-all duration-300"
          style={{ width: isCompleted ? "calc(100% - 48px)" : isPending ? "50%" : "0%" }}
          aria-hidden="true"
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const circleClass = step.alert
            ? "border-destructive bg-destructive/10 text-destructive"
            : step.done
              ? "border-agrivive-primary bg-agrivive-primary text-white"
              : step.current
                ? "border-agrivive-primary bg-white text-agrivive-primary ring-4 ring-agrivive-sage/30"
                : "border-border bg-muted text-muted-foreground";

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
              <div
                className={`flex size-10 items-center justify-center rounded-full border-2 transition-all ${circleClass}`}
              >
                <Icon className="size-4" aria-hidden="true" />
              </div>
              <span className="mt-2 text-xs font-semibold text-foreground sm:text-sm">{step.label}</span>
              <span className="text-[11px] text-muted-foreground">{step.caption}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
