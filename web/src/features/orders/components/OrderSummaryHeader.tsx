"use client";

import { Calendar, CheckCircle2, Sparkles, Tag } from "lucide-react";
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
  // Calculate estimated surplus savings (approx 25-30% saved from standard market retail)
  const estimatedSavings = Math.round(total * 0.3);
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-PH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col justify-between gap-4 rounded-[24px] border border-border/80 bg-white p-5 shadow-[0_8px_24px_rgba(31,77,58,0.04)] sm:flex-row sm:items-center sm:p-6">
      {/* Left: Order ID & Item count */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-wider text-agrivive-terracotta">
            Order ID: AGR-{order.id.slice(0, 8).toUpperCase()}
          </span>
          <span className="inline-block size-1 rounded-full bg-border" />
          <span className="text-xs font-medium text-muted-foreground">
            {order.items.length} {order.items.length === 1 ? "item" : "items"}
          </span>
        </div>
        <p className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Surplus Produce Reservation
        </p>
      </div>

      {/* Middle/Right: Price & Savings Pill */}
      <div className="flex flex-wrap items-center gap-4 sm:justify-end">
        <div className="text-left sm:text-right">
          <p className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {money(total)}
          </p>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            <Sparkles className="size-3.5 text-emerald-600" />
            <span>You saved ~{money(estimatedSavings)}</span>
          </div>
        </div>

        {/* Date Stamp */}
        <div className="flex items-center gap-1.5 border-t border-border/60 pt-2 text-xs text-muted-foreground sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
          <Calendar className="size-3.5" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
