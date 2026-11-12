"use client";

import { CheckCircle2 } from "lucide-react";
import type { BuyerOrder } from "@/src/features/marketplace/types";
import { formatPeso as money } from "@/src/lib/money";

export function OrderPaymentBreakdown({ order }: { order: BuyerOrder }) {
  const total = Number(order.totalAmount);
  const estimatedSavings = Math.round(total * 0.3);

  return (
    <div className="rounded-2xl border border-agrivive-line bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-agrivive-ink">
        Payment details
      </h2>

      <div className="space-y-2.5 text-sm">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-neutral-600">
            <span>{item.productName}</span>
            <span className="font-medium text-agrivive-ink">{money(item.subtotal)}</span>
          </div>
        ))}

        <div className="flex justify-between font-semibold text-agrivive-primary">
          <span>Surplus savings</span>
          <span>- {money(estimatedSavings)}</span>
        </div>

        <div className="flex justify-between text-neutral-600">
          <span>Service Fee</span>
          <span className="font-semibold text-neutral-700">FREE</span>
        </div>
      </div>

      <div className="border-t border-agrivive-line pt-3 flex items-baseline justify-between">
        <span className="text-base font-bold text-agrivive-ink">Total</span>
        <span className="font-heading text-2xl font-bold text-agrivive-primary">
          {money(total)}
        </span>
      </div>

      {/* Food Waste Reduction Callout */}
      <div className="rounded-xl border border-[#D5EAC3] bg-[#F7FAF4] p-3 flex items-start gap-2.5">
        <CheckCircle2 className="size-4 shrink-0 text-agrivive-primary mt-0.5" />
        <div className="text-xs leading-relaxed text-[#2D4E00]">
          <p className="font-medium">You&apos;re helping reduce food waste!</p>
          <p className="text-neutral-600">Thank you for choosing surplus products.</p>
        </div>
      </div>
    </div>
  );
}
