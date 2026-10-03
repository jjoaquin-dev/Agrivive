"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import type { BuyerOrderItem } from "@/src/features/marketplace/types";

export function OrderCardItems({ items }: { items: BuyerOrderItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const first = items[0];
  const remaining = items.slice(1);

  if (!first) {
    return <span className="text-sm text-muted-foreground">No item details</span>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-agrivive-background">
          <Package className="size-6 text-agrivive-primary/60" aria-hidden="true" />
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
                    <Package className="size-4 text-agrivive-primary/40" aria-hidden="true" />
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
