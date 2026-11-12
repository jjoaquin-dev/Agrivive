"use client";

import Link from "next/link";
import { ArrowRight, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { BuyerOrder } from "@/src/features/marketplace/types";
import { ProductImage } from "@/src/features/marketplace/components/ProductImage";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatPeso as money } from "@/src/lib/money";
import { formatDate as manilaDate, formatTime as manilaTime } from "@/src/lib/format";

function formatDate(iso: string) {
  return manilaDate(iso);
}

function formatExpiration(iso: string) {
  const datePart = manilaDate(iso);
  const timePart = manilaTime(iso, { hour: "numeric", minute: "2-digit", hour12: true });
  return `${datePart}, ${timePart}`;
}

export function OrderCard({
  order,
  onCancel,
}: {
  order: BuyerOrder;
  onCancel?: (order: BuyerOrder) => void;
}) {
  const isPending = order.status === "pending";
  const isCompleted = order.status === "completed";
  const orderNumber = `AGR-${order.id.slice(0, 8).toUpperCase()}`;
  const firstItem = order.items[0];

  return (
    <Card className="min-h-[160px] overflow-hidden rounded-2xl border border-agrivive-line bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        {/* Top Header Strip: 12px font size with 16px bottom separation */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-agrivive-line mb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-agrivive-primary inline-block" aria-hidden="true" />
            <span className="font-semibold text-agrivive-ink">Davao Market Stall</span>
            <span className="text-agrivive-line">|</span>
            <span className="text-agrivive-stone font-medium">{formatDate(order.createdAt)}</span>
          </div>
          <div className="font-mono text-xs text-agrivive-stone">
            Order #{orderNumber}
          </div>
        </div>

        {/* Content Row with 24px column spacing */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_1.2fr_auto] lg:items-center">
          {/* 1. Product Preview */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative size-[60px] shrink-0 overflow-hidden rounded-xl bg-agrivive-background border border-agrivive-line">
              {firstItem ? (
                <ProductImage
                  src={firstItem.imageUrl}
                  alt={firstItem.productName}
                  category={firstItem.productType ?? "Produce"}
                  className="size-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-heading text-sm font-semibold text-agrivive-ink">
                {firstItem?.productName ?? "Produce"}
              </h4>
              <p className="mt-0.5 text-xs text-agrivive-stone font-normal">
                {firstItem ? `${Number(firstItem.quantity)} ${firstItem.scalingType}` : ""}
                {order.items.length > 1 ? ` (+${order.items.length - 1} more)` : ""}
              </p>
            </div>
          </div>

          {/* 2. Order Total */}
          <div>
            <p className="text-xs text-agrivive-stone font-normal">Order total</p>
            <p className="mt-0.5 font-heading text-base font-bold text-agrivive-ink">
              {money(order.totalAmount)}
            </p>
          </div>

          {/* 3. Payment Method */}
          <div>
            <p className="text-xs text-agrivive-stone font-normal">Payment</p>
            <p className="mt-0.5 text-sm font-semibold text-agrivive-ink">Cash on pickup</p>
            <p className="mt-0.5 text-xs text-agrivive-stone">Pay at market stall</p>
          </div>

          {/* 4. Status */}
          <div className="flex flex-col items-start">
            <OrderStatusBadge status={order.status} />
            <p className="mt-1 text-xs text-agrivive-stone font-normal">
              {isCompleted
                ? `Completed ${formatDate(order.updatedAt)}`
                : isPending && order.expiresAt
                  ? `Hold expires ${formatExpiration(order.expiresAt)}`
                  : "Reservation closed"}
            </p>
          </div>

          {/* 5. 40px Actions Area with 8px Spacing */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:justify-end">
            {isPending ? (
              <>
                <Link
                  href={`/orders/${order.id}`}
                  className="h-12 min-h-12 px-4 rounded-xl font-semibold text-sm bg-agrivive-primary hover:bg-agrivive-primary/90 text-white inline-flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <QrCode className="size-3.5" aria-hidden="true" />
                  <span>View Pass</span>
                </Link>
                <button
                  type="button"
                  onClick={() => onCancel?.(order)}
                  className="h-12 min-h-12 px-3 rounded-xl font-semibold text-sm border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 inline-flex items-center justify-center transition active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  Cancel Order
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/orders/${order.id}`}
                  className="h-12 min-h-12 px-4 rounded-xl font-semibold text-sm border border-agrivive-line bg-white text-agrivive-ink hover:bg-neutral-50 inline-flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <span>View details</span>
                  <ArrowRight className="size-3.5 text-agrivive-stone" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  disabled
                  className="h-10 min-h-[40px] px-3 rounded-xl font-medium text-xs border border-agrivive-line bg-neutral-50 text-neutral-400 inline-flex items-center justify-center cursor-not-allowed opacity-60 whitespace-nowrap"
                >
                  Cancel Order
                </button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
