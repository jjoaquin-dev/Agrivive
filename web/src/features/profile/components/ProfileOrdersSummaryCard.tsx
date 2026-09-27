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
    <Card className="rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2.5">
          <ClipboardList className="size-5 text-primary" />
          <h2 className="font-heading text-lg font-bold">Your Reservations</h2>
        </div>
        {!loading && pendingCount > 0 ? (
          <Badge variant="outline" className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
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
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <ShoppingBag className="size-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-foreground">No reservations yet</p>
          <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
            Reserve fresh produce from verified local Davao stalls and collect directly at pickup.
          </p>
          <Link href="/marketplace" className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4 rounded-xl" })}>
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border/60 py-2">
          {orders.slice(0, 4).map((order) => {
            const firstItem = order.items?.[0];
            const extraCount = (order.items?.length || 0) - 1;
            const title = firstItem
              ? `${firstItem.productName}${extraCount > 0 ? ` +${extraCount} more` : ""}`
              : `Order #${order.id.slice(0, 6)}`;
            const price = Number(order.totalAmount || 0);

            return (
              <div key={order.id} className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-sm text-foreground">{title}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    ₱{price.toFixed(2)} · {new Date(order.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <Link
                  href={`/orders/${order.id}`}
                  className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-primary hover:underline sm:self-center"
                >
                  <QrCode className="size-3.5" />
                  <span>Show QR</span>
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
          className: "mt-3 w-full justify-between rounded-xl border border-border/60 text-xs font-semibold hover:bg-muted/50",
        })}
      >
        <span>View all reservations</span>
        <ArrowRight className="size-4" />
      </Link>
    </Card>
  );
}
