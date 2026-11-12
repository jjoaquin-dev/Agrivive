"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/src/components/QuantityStepper";
import type { MarketplaceProduct } from "../types";

interface ProductCardActionProps {
  product: MarketplaceProduct;
  soldOut: boolean;
  quantityInCart: number;
  onAddToCart: (qty: number) => void;
  onChangeQuantity: (qty: number) => void;
  onRemove: () => void;
}

export function ProductCardAction({
  product,
  soldOut,
  quantityInCart,
  onAddToCart,
  onChangeQuantity,
  onRemove,
}: ProductCardActionProps) {
  const [selectedQty, setSelectedQty] = useState(1);
  const stock = Number(product.productQty);
  const maxStock = Number.isFinite(stock) && stock > 0 ? stock : 1;
  const startQty = Math.min(selectedQty, maxStock);
  const stepperClass = "h-12 rounded-full border border-neutral-200/80 bg-neutral-100/80 px-1 shadow-sm [&_input]:w-7";
  const roundButton = "size-9 bg-white shadow-sm";

  if (soldOut) {
    return (
      <Button
        type="button"
        disabled
        className="h-12 w-full rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider opacity-60"
      >
        Sold out
      </Button>
    );
  }

  if (quantityInCart > 0) {
    return (
      <div className="flex h-12 w-full items-center justify-between gap-2 rounded-full border border-agrivive-primary/20 bg-agrivive-background px-1 shadow-sm">
        <QuantityStepper
          value={quantityInCart}
          max={maxStock}
          label={`${product.productName} quantity in cart`}
          onChange={onChangeQuantity}
          onRemove={onRemove}
          className="min-w-0 flex-1"
          buttonClassName={roundButton}
        />
        <span className="shrink-0 pr-3 text-xs font-semibold text-agrivive-primary">in cart</span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-nowrap items-center gap-2">
      <QuantityStepper
        value={startQty}
        max={maxStock}
        label={`${product.productName} quantity`}
        onChange={setSelectedQty}
        className={`shrink-0 ${stepperClass}`}
        buttonClassName={roundButton}
      />

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAddToCart(startQty);
        }}
        className="group flex min-h-12 min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-agrivive-primary hover:bg-agrivive-primary/90 px-2 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-95 cursor-pointer"
      >
        <ShoppingCart className="cart-wiggle-on-hover size-4 shrink-0 text-white" />
        <span className="font-semibold">Add to Cart</span>
      </button>
    </div>
  );
}
