"use client";

import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import type { BuyerOrderItem } from "@/src/features/marketplace/types";
import { ProductImage } from "@/src/features/marketplace/components/ProductImage";

function money(value: string | number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(value));
}

export function OrderItemsCard({ items, status = "pending" }: { items: BuyerOrderItem[]; status?: string }) {
  const badgeLabel = status === "completed" ? "Picked up" : status === "expired" ? "Expired" : status === "cancelled" ? "Cancelled" : "Ready at stall";

  return (
    <div className="rounded-[16px] border border-[#E8E8E8] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <ShoppingBasket className="size-5 text-[#457D00]" aria-hidden="true" />
        <h2 className="text-[18px] font-semibold text-[#14231A]">
          Items Ordered ({items.length})
        </h2>
      </div>

      <div className="mt-4 divide-y divide-[#E8E8E8]" aria-label="Reserved products">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/marketplace/${item.productId}`}
            className="group flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 transition-opacity hover:opacity-95 cursor-pointer"
          >
            {/* Produce thumbnail & Info */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-[12px] border border-[#E8E8E8] bg-[#F8F6F1]">
                <ProductImage
                  src={item.imageUrl}
                  alt={item.productName}
                  category={item.productType ?? "Produce"}
                />
              </div>

              <div className="min-w-0 space-y-0.5">
                <p className="text-[14px] font-bold text-[#14231A] group-hover:text-[#457D00] transition-colors">
                  {item.productName}
                </p>
                <p className="text-[12px] text-neutral-500">
                  Unit: <span className="capitalize">{item.scalingType}</span> • Qty: {Number(item.quantity).toLocaleString()}
                </p>
                <p className="text-[14px] font-bold text-[#457D00]">
                  {money(item.subtotal)}
                </p>
              </div>
            </div>

            {/* Status Pill Badge */}
            <div className="shrink-0 text-right">
              <span className="inline-flex items-center rounded-full border border-orange-200/70 bg-[#FFF7ED] px-3 py-1 text-xs font-semibold text-[#EA580C]">
                {badgeLabel}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
