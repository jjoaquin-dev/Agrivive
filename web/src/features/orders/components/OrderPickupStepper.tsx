import { AlertCircle, Check, CheckCircle2, Clock, Info, Package, Store, XCircle } from "lucide-react";
import type { BuyerOrder } from "@/src/features/marketplace/types";

interface OrderPickupStepperProps {
  status: BuyerOrder["status"];
  createdAt: string;
  expiresAt: string | null;
  shopName?: string;
  cancellationReason?: string | null;
}

function formatExpirationTime(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit", hour12: true });
  } catch {
    return "";
  }
}

export function OrderPickupStepper({ status, createdAt, expiresAt, shopName, cancellationReason }: OrderPickupStepperProps) {
  const isCancelled = status === "cancelled";
  const isExpired = status === "expired";
  const isCompleted = status === "completed";
  const isPending = status === "pending";
  const seller = shopName || "the stall vendor";
  const untilTime = expiresAt ? formatExpirationTime(expiresAt) : "";

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
      caption: isPending ? "Present pass at stall" : "Visit stall",
      done: isCompleted,
      current: isPending,
      alert: false,
      icon: isPending ? Clock : isCompleted ? Check : Store,
    },
    {
      id: "completed",
      label: isCancelled ? "Cancelled" : isExpired ? "Expired" : "Completed",
      caption: isCompleted
        ? "Success"
        : isCancelled
          ? "Returned"
          : isExpired
            ? "Unclaimed"
            : untilTime
              ? `Until ${untilTime}`
              : "Pending",
      done: isCompleted,
      current: isCancelled || isExpired,
      alert: isCancelled || isExpired,
      icon: isCancelled || isExpired ? XCircle : Package,
    },
  ];

  const explanation = isPending
    ? {
        container: "bg-[#F0F5FF] border border-[#D0E2FF]",
        icon: Info,
        iconColor: "text-[#2563EB]",
        titleColor: "text-[#1E3A8A]",
        descColor: "text-[#2563EB]",
        title: "Your order is ready at the stall!",
        description: `Please present your pickup pass to ${seller} before the reservation expires.`,
      }
    : isExpired
      ? {
          container: "bg-[#FEF6F6] border border-[#FCD8D8]",
          icon: AlertCircle,
          iconColor: "text-[#DC2626]",
          titleColor: "text-[#991B1B]",
          descColor: "text-[#B91C1C]",
          title: "This reservation has expired",
          description: `The pickup window ended before the pass was scanned at the stall. Unclaimed items were returned to ${seller}'s inventory to avoid food waste.`,
        }
      : isCancelled
        ? {
            container: "bg-[#F9FAFB] border border-[#E5E7EB]",
            icon: XCircle,
            iconColor: "text-[#6B7280]",
            titleColor: "text-[#1F2937]",
            descColor: "text-[#4B5563]",
            title: "This reservation was cancelled",
            description: cancellationReason
              ? `Reason: ${cancellationReason}. Items were returned to ${seller}'s inventory.`
              : `This reservation was cancelled and items were returned to ${seller}'s inventory.`,
          }
        : {
            container: "bg-[#F0FDF4] border border-[#DCFCE7]",
            icon: CheckCircle2,
            iconColor: "text-[#16A34A]",
            titleColor: "text-[#14532D]",
            descColor: "text-[#15803D]",
            title: "Order completed at the stall!",
            description: `Your pickup pass was verified by ${seller}. Thank you for helping reduce surplus food waste!`,
          };

  const ExplanationIcon = explanation.icon;

  return (
    <div className="rounded-[16px] border border-[#E8E8E8] bg-white p-6 shadow-sm" aria-label="Pickup progress">
      <div className="relative flex items-center justify-between">
        {/* Connecting track lines */}
        <div className="absolute left-8 right-8 top-5 -translate-y-1/2 h-0.5 bg-[#E8E8E8]" aria-hidden="true" />
        <div
          className="absolute left-8 top-5 -translate-y-1/2 h-0.5 bg-[#457D00] transition-all duration-300"
          style={{ width: isCompleted ? "calc(100% - 64px)" : isPending ? "50%" : "0%" }}
          aria-hidden="true"
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const circleClass = step.alert
            ? "border-[#B85450] bg-red-50 text-[#B85450]"
            : step.done
              ? "border-[#457D00] bg-[#457D00] text-white"
              : step.current
                ? "border-2 border-[#457D00] bg-white text-[#457D00]"
                : "border-2 border-[#E8E8E8] bg-white text-neutral-400";

          const labelClass = step.alert
            ? "text-[#B85450] font-bold"
            : step.current
              ? "text-[#457D00] font-bold"
              : step.done
                ? "text-[#14231A] font-semibold"
                : "text-neutral-500 font-semibold";

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
              <div className={`flex size-10 items-center justify-center rounded-full transition-all ${circleClass}`}>
                <Icon className="size-4" aria-hidden="true" />
              </div>
              <span className={`mt-2 text-[14px] ${labelClass}`}>{step.label}</span>
              <span className="mt-0.5 text-[12px] text-neutral-400">{step.caption}</span>
            </div>
          );
        })}
      </div>

      {/* Explanation Banner matching Photo 2 */}
      <div className={`mt-5 flex items-start gap-3 rounded-[14px] p-4 ${explanation.container}`}>
        <ExplanationIcon className={`size-5 shrink-0 mt-0.5 ${explanation.iconColor}`} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className={`text-[13px] font-bold sm:text-[14px] ${explanation.titleColor}`}>
            {explanation.title}
          </p>
          <p className={`mt-0.5 text-[12px] leading-relaxed sm:text-[13px] ${explanation.descColor}`}>
            {explanation.description}
          </p>
        </div>
      </div>
    </div>
  );
}
