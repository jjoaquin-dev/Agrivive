import Link from "next/link";
import { ChevronRight, Store } from "lucide-react";
import type { ConversationLaunchContext } from "../types";
import { formatPeso } from "@/src/lib/money";

function formatMoney(value: string | number | null | undefined) {
  if (value == null || value === "") return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return formatPeso(num);
}

export function ConversationContextCard({ context }: { context: ConversationLaunchContext }) {
  const isProduct = context.contextType === "product";
  const title = isProduct ? context.productName || "Fresh Produce" : "Seller Consultation";
  const sellerTitle = context.sellerShopName || context.sellerName || "Verified Vendor";

  const formattedPrice = formatMoney(context.productPrice);
  const qtyNumber = context.productQty != null ? Number(context.productQty) : null;
  const isAvailable = qtyNumber != null && qtyNumber > 0;
  const availabilityBadge = qtyNumber != null
    ? isAvailable
      ? `${qtyNumber.toLocaleString()} ${context.scalingType || "unit"} AVAILABLE`
      : "SOLD OUT"
    : null;

  const cardContent = (
    <>
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm flex items-center justify-center">
          {context.productImageUrl ? (
            <img src={context.productImageUrl} alt={title} className="size-full object-cover" />
          ) : (
            <Store className="size-6 text-[#16A34A]" />
          )}
        </div>
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              {isProduct ? "Listing Reference" : "Consultation"}
            </span>
            {availabilityBadge && (
              <span
                className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-bold uppercase tracking-wider leading-none ${
                  isAvailable
                    ? "bg-[#FFF4E5] text-[#EA580C]"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {availabilityBadge}
              </span>
            )}
          </div>
          <span className="block truncate text-[15px] font-bold text-neutral-900">{title}</span>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {formattedPrice && (
              <span className="text-neutral-500 font-medium">
                {formattedPrice}
                {context.scalingType ? `/${context.scalingType}` : ""}
              </span>
            )}
            <span className="text-neutral-300">•</span>
            <span className="font-semibold text-[#16A34A]">
              {sellerTitle}
            </span>
          </div>
        </div>
      </div>

      {context.productId && (
        <span
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-900 shadow-sm transition group-hover:bg-neutral-50 group-hover:border-neutral-300"
        >
          <span>View listing</span>
          <ChevronRight className="size-3.5" />
        </span>
      )}
    </>
  );

  if (context.productId) {
    return (
      <Link
        href={`/marketplace/${context.productId}`}
        className="group mx-auto mb-4 flex w-[calc(100%-3rem)] max-w-xl items-center justify-between rounded-2xl border border-dashed border-[#D2D6DC] bg-white p-3.5 shadow-sm transition hover:border-[#16A34A]/60 cursor-pointer"
        aria-label={`View listing for ${title}`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="mx-auto mb-4 flex w-[calc(100%-3rem)] max-w-xl items-center justify-between rounded-2xl border border-dashed border-[#D2D6DC] bg-white p-3.5 shadow-sm">
      {cardContent}
    </div>
  );
}
