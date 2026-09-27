import Link from "next/link";
import { ArrowRight, Calendar, MapPin, QrCode, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { BuyerOrder } from "@/src/features/marketplace/types";
import { OrderStatusBadge } from "./OrderStatusBadge";

function money(value: string | number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(value));
}

export function OrderCard({ order }: { order: BuyerOrder }) {
  const isPending = order.status === "pending";
  const first = order.items[0];
  const title = order.items.length > 1
    ? `${order.items.length} produce items`
    : first?.productName || "Produce reservation";
  const quantity = order.items.length > 1
    ? `${order.items.length} items from this stall`
    : first ? `${Number(first.quantity).toLocaleString()} ${first.scalingType}` : "Reservation details";
  const dateFormatted = new Date(order.createdAt).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/orders/${order.id}`}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agrivive-sage"
    >
      <Card
        className={`overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
          isPending
            ? "border-agrivive-primary/30 bg-white hover:border-agrivive-primary"
            : "border-border/80 bg-white hover:border-border"
        }`}
      >
        <CardContent className="p-5 sm:p-6">
          {/* Header Row: Stall Attribution + Status Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-agrivive-background text-agrivive-primary">
                <Store className="size-3.5" aria-hidden="true" />
              </span>
              <span className="font-mono text-xs font-semibold text-muted-foreground">
                AGR-{order.id.slice(0, 6).toUpperCase()}
              </span>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          {/* Main Content Row */}
          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-agrivive-primary transition-colors">
                {title}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{quantity}</p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3 text-agrivive-sage" aria-hidden="true" />
                  {dateFormatted}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3 text-agrivive-sage" aria-hidden="true" />
                  Davao City Market
                </span>
              </div>
            </div>

            {/* Price & Action Badge */}
            <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
              <div className="sm:text-right">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total</span>
                <p className="font-heading text-xl font-bold text-agrivive-primary">{money(order.totalAmount)}</p>
              </div>

              {isPending && order.qrPayload ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                  <QrCode className="size-3.5 text-emerald-700" aria-hidden="true" />
                  Pass ready
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-agrivive-primary">
                  View details
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
