"use client";

import Image from "next/image";
import { Receipt, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BuyerOrder } from "@/src/features/marketplace/types";

function money(value: string | number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(value));
}

export function OrderPaymentBreakdown({ order }: { order: BuyerOrder }) {
  const total = Number(order.totalAmount);
  const estimatedSavings = Math.round(total * 0.3);

  return (
    <Card className="overflow-hidden rounded-[24px] border-border/80 bg-white shadow-[0_8px_24px_rgba(31,77,58,0.04)]">
      <CardHeader className="border-b border-border/60 pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
          <Receipt className="size-4 text-agrivive-primary" />
          Payment details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Itemized list */}
        <div className="space-y-2 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-muted-foreground">
              <span className="line-clamp-1 max-w-[200px] text-foreground">
                {item.productName} ({item.quantity} {item.scalingType})
              </span>
              <span className="font-medium text-foreground">{money(item.subtotal)}</span>
            </div>
          ))}
        </div>

        {/* Savings line */}
        <div className="flex justify-between text-sm font-semibold text-emerald-700">
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3.5" />
            Surplus savings
          </span>
          <span>- {money(estimatedSavings)}</span>
        </div>

        {/* Platform fee */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Stall reservation fee</span>
          <span className="font-semibold text-emerald-600">FREE</span>
        </div>

        {/* Divider & Total */}
        <div className="border-t border-border/80 pt-3">
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-base font-bold text-foreground">Total</span>
            <span className="font-heading text-2xl font-bold text-agrivive-primary">
              {money(total)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Pay directly at the market stall during QR pickup.
          </p>
        </div>

        {/* Celebratory 3D Nano Banana Wellness Badge */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-amber-50/40 to-emerald-100/40 p-4">
          <div className="flex items-center gap-3">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-white/60 bg-white shadow-xs">
              <Image
                src="/brand/cute-veggies-order.jpg"
                alt="3D Nano Banana and Tomato Wellness mascot"
                fill
                className="object-cover object-center"
              />
            </div>
            <div>
              <p className="flex items-center gap-1 text-xs font-bold text-emerald-800">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                Verified Surplus Rescue
              </p>
              <p className="mt-0.5 text-xs text-emerald-950/80">
                You helped keep fresh vegetables on dinner tables and out of landfills!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
