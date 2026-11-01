"use client";

import { CheckCircle2 } from "lucide-react";
import type { BuyerOrder } from "@/src/features/marketplace/types";
import { formatPeso as money } from "@/src/lib/money";

export function OrderPaymentBreakdown({ order }: { order: BuyerOrder }) {
  const total = Number(order.totalAmount);
  const estimatedSavings = Math.round(total * 0.3);

  return (
    <div className="rounded-2xl border border-[#E8E8E8] bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-[17px] font-bold text-[#14231A]">
        Payment details
      </h2>

      <div className="space-y-2.5 text-[14px]">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-neutral-600">
            <span>{item.productName}</span>
            <span className="font-medium text-[#14231A]">{money(item.subtotal)}</span>
          </div>
        ))}

        <div className="flex justify-between font-semibold text-[#457D00]">
          <span>Surplus savings</span>
          <span>- {money(estimatedSavings)}</span>
        </div>

        <div className="flex justify-between text-neutral-600">
          <span>Service Fee</span>
          <span className="font-semibold text-neutral-700">FREE</span>
        </div>
      </div>

      <div className="border-t border-[#E8E8E8] pt-3 flex items-baseline justify-between">
        <span className="text-[16px] font-bold text-[#14231A]">Total</span>
        <span className="font-heading text-[24px] font-bold text-[#457D00]">
          {money(total)}
        </span>
      </div>

      {/* Food Waste Reduction Callout */}
      <div className="rounded-xl border border-[#D5EAC3] bg-[#F7FAF4] p-3 flex items-start gap-2.5">
        <CheckCircle2 className="size-4 shrink-0 text-[#457D00] mt-0.5" />
        <div className="text-[12px] leading-relaxed text-[#2D4E00]">
          <p className="font-medium">You&apos;re helping reduce food waste!</p>
          <p className="text-neutral-600">Thank you for choosing surplus products.</p>
        </div>
      </div>
    </div>
  );
}
