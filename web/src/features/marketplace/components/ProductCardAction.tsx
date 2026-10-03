"use client";

import { MapPin, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MarketplaceProduct } from "../types";

interface ProductCardActionProps {
  product: MarketplaceProduct;
  soldOut: boolean;
  quantityInCart: number;
  onAddToCart: (e: React.MouseEvent) => void;
  onIncrement: (e: React.MouseEvent) => void;
  onDecrement: (e: React.MouseEvent) => void;
  onSelectSeller?: (sellerId: string) => void;
}

export function ProductCardAction({
  product,
  soldOut,
  quantityInCart,
  onAddToCart,
  onIncrement,
  onDecrement,
  onSelectSeller,
}: ProductCardActionProps) {
  if (soldOut) {
    return (
      <Button
        type="button"
        disabled
        className="h-11 min-h-11 w-full rounded-xl text-xs font-bold uppercase tracking-wider"
      >
        Sold out
      </Button>
    );
  }

  if (quantityInCart > 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex h-11 min-h-11 flex-1 items-center justify-between rounded-xl border border-agrivive-primary/30 bg-agrivive-background px-2 shadow-xs">
          <button
            type="button"
            onClick={onDecrement}
            aria-label="Decrease quantity"
            className="flex size-8 items-center justify-center rounded-lg bg-white text-foreground shadow-2xs hover:bg-agrivive-sage/20 active:translate-y-px"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="text-xs font-bold text-agrivive-primary">
            {quantityInCart} in cart
          </span>
          <button
            type="button"
            onClick={onIncrement}
            aria-label="Increase quantity"
            className="flex size-8 items-center justify-center rounded-lg bg-white text-foreground shadow-2xs hover:bg-agrivive-sage/20 active:translate-y-px"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => onSelectSeller?.(product.seller.id)}
          title="Highlight stall on map"
          aria-label="Highlight stall on map"
          className="flex size-11 min-h-11 min-w-11 items-center justify-center rounded-xl border border-border/80 bg-white text-agrivive-primary shadow-xs transition hover:bg-agrivive-background hover:border-agrivive-primary active:translate-y-px"
        >
          <MapPin className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        onClick={onAddToCart}
        className="h-11 min-h-11 flex-1 gap-2 rounded-xl bg-agrivive-primary text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-agrivive-primaryPressed active:translate-y-px"
      >
        <ShoppingBag className="size-4" />
        <span>Add to cart</span>
      </Button>
      <button
        type="button"
        onClick={() => onSelectSeller?.(product.seller.id)}
        title="Highlight stall on map"
        aria-label="Highlight stall on map"
        className="flex size-11 min-h-11 min-w-11 items-center justify-center rounded-xl border border-border/80 bg-white text-agrivive-primary shadow-xs transition hover:bg-agrivive-background hover:border-agrivive-primary active:translate-y-px"
      >
        <MapPin className="size-4" />
      </button>
    </div>
  );
}
