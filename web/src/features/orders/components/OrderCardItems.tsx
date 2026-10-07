"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { BuyerOrderItem } from "@/src/features/marketplace/types";
import { ProductImage } from "@/src/features/marketplace/components/ProductImage";

export function OrderCardItems({ items }: { items: BuyerOrderItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const first = items[0];
  const remaining = items.slice(1);

  if (!first) {
    return <span className="text-sm text-muted-foreground">No item details</span>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className="relative h-96 w-full overflow-hidden rounded-[16px] border border-border/70 bg-agrivive-background">
          <ProductImage src={first.imageUrl} alt={first.productName} category={first.productType ?? "Produce"} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">
            {first.productName}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Quantity: {Number(first.quantity).toLocaleString()} {first.scalingType}
          </p>
        </div>
      </div>

      {remaining.length > 0 ? (
        <>
          {expanded ? (
            <div className="mt-1 flex flex-col gap-2 border-t border-border/50 pt-2">
              {remaining.map((item) => (
                <div key={item.id} className="flex items-center gap-3 pl-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-agrivive-background">
                    <ProductImage src={item.imageUrl} alt={item.productName} category={item.productType ?? "Produce"} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Quantity: {Number(item.quantity).toLocaleString()} {item.scalingType}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="mt-0.5 inline-flex items-center gap-1 self-start text-xs font-semibold text-agrivive-primary hover:underline"
          >
            {expanded ? (
              <>Show less <ChevronUp className="size-3.5" /></>
            ) : (
              <>Show more ({remaining.length}) <ChevronDown className="size-3.5" /></>
            )}
          </button>
        </>
      ) : null}
    </div>
  );
}
