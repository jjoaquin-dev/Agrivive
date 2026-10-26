"use client";

import { Calendar, PiggyBank } from "lucide-react";
import type { BuyerOrder } from "@/src/features/marketplace/types";

function money(value: string | number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(value));
}

interface OrderSummaryHeaderProps {
  order: BuyerOrder;
}

export function OrderSummaryHeader({ order }: OrderSummaryHeaderProps) {
  const total = Number(order.totalAmount);
  const estimatedSavings = Math.round(total * 0.3);
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-1.5" aria-label="Order summary">
      {/* Top Metadata Row: Order ID, Date, and Savings Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
          <span className="font-semibold text-neutral-400 uppercase tracking-wider">
            ORDER ID:{" "}
            <span className="font-bold text-[#E94C00]">
              AGR-{order.id.slice(0, 8).toUpperCase()}
            </span>
          </span>
          <span className="text-neutral-300" aria-hidden="true">•</span>
          <span className="inline-flex items-center gap-1.5 text-neutral-500">
            <Calendar className="size-3.5 text-neutral-400" aria-hidden="true" />
            <span>{formattedDate}</span>
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-[#F0FDF4] px-3 py-1 text-xs font-semibold text-[#16A34A] shadow-2xs">
          <PiggyBank className="size-3.5 text-[#16A34A]" aria-hidden="true" />
          <span>You saved {money(estimatedSavings)}</span>
        </span>
      </div>

      {/* Main Title and Total Amount Row */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 pt-0.5">
        <h1 className="font-heading text-2xl sm:text-[28px] font-bold tracking-tight text-[#14231A] leading-tight">
          Surplus Produce Reservation
        </h1>

        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <span className="text-xs sm:text-sm font-medium text-neutral-400">
            Total:
          </span>
          <span className="font-heading text-2xl sm:text-[28px] font-bold tracking-tight text-[#14231A]">
            {money(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
