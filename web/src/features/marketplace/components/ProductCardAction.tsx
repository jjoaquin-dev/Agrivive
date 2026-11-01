"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MarketplaceProduct } from "../types";

interface ProductCardActionProps {
  product: MarketplaceProduct;
  soldOut: boolean;
  quantityInCart: number;
  onAddToCart: (qty: number) => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function ProductCardAction({
  product,
  soldOut,
  quantityInCart,
  onAddToCart,
  onIncrement,
  onDecrement,
}: ProductCardActionProps) {
  const [selectedQty, setSelectedQty] = useState(1);
  const maxStock = Math.max(1, Number(product.productQty) || 1);

  if (soldOut) {
    return (
      <Button
        type="button"
        disabled
        className="h-[42px] w-full rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider opacity-60"
      >
        Sold out
      </Button>
    );
  }

  if (quantityInCart > 0) {
    return (
      <div className="flex h-[42px] w-full items-center justify-between rounded-full border border-agrivive-primary/20 bg-agrivive-background px-2 py-1 shadow-2xs">
        <button
          type="button"
          onClick={onDecrement}
          aria-label="Decrease quantity"
          className="flex size-8 items-center justify-center rounded-full bg-white text-neutral-700 shadow-2xs transition active:scale-90 hover:bg-neutral-50"
        >
          <Minus className="size-3" />
        </button>
        <span className="text-xs font-semibold text-agrivive-primary">
          {quantityInCart} in cart
        </span>
        <button
          type="button"
          onClick={onIncrement}
          disabled={quantityInCart >= maxStock}
          aria-label="Increase quantity"
          className="flex size-8 items-center justify-center rounded-full bg-white text-neutral-700 shadow-2xs transition active:scale-90 hover:bg-neutral-50 disabled:opacity-40"
        >
          <Plus className="size-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex h-[42px] w-[84px] shrink-0 items-center justify-between rounded-full border border-neutral-200/80 bg-neutral-100/80 px-1 shadow-2xs">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedQty((prev) => Math.max(1, prev - 1));
          }}
          disabled={selectedQty <= 1}
          aria-label="Decrease quantity"
          className="flex size-7 items-center justify-center rounded-full bg-white text-neutral-700 shadow-2xs transition active:scale-90 hover:bg-neutral-50 disabled:opacity-30"
        >
          <Minus className="size-3" />
        </button>
        <span className="text-center text-xs font-semibold tabular-nums text-neutral-900">
          {selectedQty}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedQty((prev) => Math.min(maxStock, prev + 1));
          }}
          disabled={selectedQty >= maxStock}
          aria-label="Increase quantity"
          className="flex size-7 items-center justify-center rounded-full bg-white text-neutral-700 shadow-2xs transition active:scale-90 hover:bg-neutral-50 disabled:opacity-30"
        >
          <Plus className="size-3" />
        </button>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAddToCart(selectedQty);
        }}
        className="group flex min-h-[42px] flex-1 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#457D00] hover:bg-[#386600] px-6 py-2.5 text-xs font-semibold tracking-wide text-white shadow-2xs transition-all active:scale-95 cursor-pointer"
      >
        <ShoppingCart className="cart-wiggle-on-hover size-4 stroke-[2] shrink-0 text-white" />
        <span className="truncate font-semibold">Add to Cart</span>
      </button>
    </div>
  );
}
