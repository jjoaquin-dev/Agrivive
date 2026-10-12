"use client";

import { ShoppingBasket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BuyerOrderItem } from "@/src/features/marketplace/types";
import { ProductImage } from "@/src/features/marketplace/components/ProductImage";

function money(value: string | number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(value));
}

export function OrderItemsCard({ items }: { items: BuyerOrderItem[] }) {
  return (
    <Card className="overflow-hidden rounded-[24px] border-border/80 bg-white shadow-[0_8px_24px_rgba(31,77,58,0.04)]">
      <CardHeader className="border-b border-border/60 pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
          <ShoppingBasket className="size-4 text-agrivive-primary" aria-hidden="true" />
          Items Ordered ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border/60" aria-label="Reserved products">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 p-4 sm:p-5">
              {/* Square produce thumbnail */}
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-agrivive-background">
                <ProductImage
                  src={item.imageUrl}
                  alt={item.productName}
                  category={item.productType ?? "Produce"}
                />
              </div>

              {/* Product Info */}
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-heading text-sm font-bold text-foreground sm:text-base">
                  {item.productName}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>Unit: <strong className="font-semibold text-foreground capitalize">{item.scalingType}</strong></span>
                  <span>•</span>
                  <span>Qty: <strong className="font-semibold text-foreground">{Number(item.quantity).toLocaleString()}</strong></span>
                </div>
                <p className="font-heading text-sm font-bold text-agrivive-primary">
                  {money(item.subtotal)}
                </p>
              </div>

              {/* Status Pill */}
              <div className="shrink-0 text-right">
                <span className="inline-flex items-center rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                  Ready at stall
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
