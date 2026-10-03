"use client";

import Link from "next/link";
import { ArrowRight, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { BuyerOrder } from "@/src/features/marketplace/types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderCardItems } from "./OrderCardItems";

function money(value: string | number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(value));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function OrderCard({ order }: { order: BuyerOrder }) {
  const isPending = order.status === "pending";
  const orderNumber = `AGR-${order.id.slice(0, 8).toUpperCase()}`;

  return (
    <Card className="overflow-hidden rounded-[18px] border border-border/80 bg-white shadow-xs transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        {/* Top Metadata Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="size-4 rounded border border-border/80 bg-muted/30" aria-hidden="true" />
            <span className="font-semibold text-foreground">Stall: Davao Market Stall</span>
            <span>·</span>
            <span>Date of Order: <strong className="font-medium text-foreground">{formatDate(order.createdAt)}</strong></span>
          </div>
          <div className="font-mono text-xs font-semibold text-foreground">
            Order ID: {orderNumber}
          </div>
        </div>

        {/* Dashed Divider */}
        <div className="my-3.5 border-t border-dashed border-border/70" />

        {/* Content Row / Table Columns */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.5fr_0.8fr_1fr_1.2fr_1fr] md:items-center">
          {/* Product Column */}
          <div>
            <OrderCardItems items={order.items} />
          </div>

          {/* Price Column */}
          <div>
            <span className="text-[11px] font-medium text-muted-foreground md:hidden">Price: </span>
            <span className="font-heading text-base font-bold text-foreground">
              {money(order.totalAmount)}
            </span>
          </div>

          {/* Payment Column */}
          <div>
            <p className="text-sm font-medium text-foreground">Cash on pickup</p>
            <p className="text-[11px] text-muted-foreground">Pay at market stall</p>
          </div>

          {/* Status Column */}
          <div className="flex flex-col items-start gap-1">
            <OrderStatusBadge status={order.status} />
            <span className="text-[11px] text-muted-foreground">
              {isPending && order.expiresAt
                ? `Please pick up before ${formatDate(order.expiresAt)}`
                : order.status === "completed"
                  ? `Completed on ${formatDate(order.updatedAt)}`
                  : "Reservation closed"}
            </span>
          </div>

          {/* Action Column */}
          <div className="flex flex-col items-stretch gap-2 sm:items-end md:items-stretch">
            {isPending ? (
              <Link
                href={`/orders/${order.id}`}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-agrivive-primary px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-agrivive-primaryPressed active:translate-y-px"
              >
                <QrCode className="size-3.5" aria-hidden="true" />
                View Pass
              </Link>
            ) : (
              <Link
                href={`/orders/${order.id}`}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-agrivive-border bg-white px-4 text-xs font-semibold text-agrivive-primary shadow-xs transition hover:bg-agrivive-background active:translate-y-px"
              >
                View details
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            )}

            {isPending ? (
              <Link
                href={`/orders/${order.id}#cancel`}
                className="inline-flex min-h-9 items-center justify-center rounded-xl border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 active:translate-y-px"
              >
                Cancel Order
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-h-9 cursor-not-allowed items-center justify-center rounded-xl border border-border/40 bg-muted/30 px-3 text-xs font-medium text-muted-foreground/60"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
