"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, Clock, QrCode, ShoppingBag } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/src/features/orders/components/OrderStatusBadge";
import type { BuyerOrder } from "@/src/features/marketplace/types";

interface ProfileOrdersSummaryCardProps {
  orders: BuyerOrder[];
  loading: boolean;
  pendingCount: number;
}

export function ProfileOrdersSummaryCard({ orders, loading, pendingCount }: ProfileOrdersSummaryCardProps) {
  return (
    <Card className="rounded-2xl border border-border/80 bg-white p-6 shadow-md sm:p-7">
      <div className="flex items-center justify-between border-b border-border/70 pb-4">
        <div className="flex items-center gap-2.5">
          <ClipboardList className="size-5 text-agrivive-primary" />
          <h2 className="font-heading text-lg font-bold text-foreground">Your Reservations</h2>
        </div>
        {!loading && pendingCount > 0 ? (
          <Badge variant="outline" className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-700">
            <Clock className="size-3" />
            {pendingCount} ready for pickup
          </Badge>
        ) : null}
      </div>

      {loading ? (
        <div className="space-y-3 py-4">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-agrivive-background text-agrivive-primary">
            <ShoppingBag className="size-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-foreground">No reservations yet</p>
          <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
            Reserve fresh produce from verified local Davao stalls and collect directly at pickup.
          </p>
          <Link href="/marketplace" className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4 min-h-11 rounded-xl" })}>
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border/60 py-1">
          {orders.slice(0, 5).map((order) => {
            const firstItem = order.items?.[0];
            const extraCount = (order.items?.length || 0) - 1;
            const title = firstItem
              ? `${firstItem.productName}${extraCount > 0 ? ` +${extraCount} more` : ""}`
              : `Order #${order.id.slice(0, 6)}`;
            const price = Number(order.totalAmount || 0);
            const isPending = order.status === "pending";

            return (
              <div key={order.id} className="flex flex-col gap-2.5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-heading text-sm font-bold text-foreground">{title}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    ₱{price.toFixed(2)} · {new Date(order.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <Link
                  href={`/orders/${order.id}`}
                  className={`inline-flex min-h-9 items-center gap-1.5 self-start rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors sm:self-center ${
                    isPending
                      ? "bg-agrivive-primary text-white hover:bg-agrivive-primaryPressed"
                      : "text-agrivive-primary hover:bg-agrivive-background"
                  }`}
                >
                  {isPending ? <QrCode className="size-3.5" /> : null}
                  <span>{isPending ? "Show QR Pass" : "View details"}</span>
                  {!isPending ? <ArrowRight className="size-3.5" /> : null}
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <Link
        href="/orders"
        className={buttonVariants({
          variant: "ghost",
          className: "mt-3 min-h-11 w-full justify-between rounded-xl border border-border/70 text-xs font-semibold hover:bg-agrivive-background",
        })}
      >
        <span>View all reservations</span>
        <ArrowRight className="size-4" />
      </Link>
    </Card>
  );
}
