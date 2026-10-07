"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useCart } from "@/src/features/cart/CartProvider";
import type { MarketplaceProduct } from "../types";
import { ProductCardAction } from "./ProductCardAction";
import { ProductCardMedia } from "./ProductCardMedia";

function money(value: string | number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(value));
}

export function ProductCard({
  product,
  selected = false,
  onSelectSeller,
  tallImage = false,
}: {
  product: MarketplaceProduct;
  selected?: boolean;
  onSelectSeller?: (sellerId: string) => void;
  tallImage?: boolean;
}) {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const cartItem = items.find((item) => item.id === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;

  const soldOut =
    product.availability === "sold_out" || Number(product.productQty) <= 0;
  const basePrice = product.basePrice ? Number(product.basePrice) : null;
  const currentPrice = Number(product.productPrice);
  const isReduced = basePrice !== null && basePrice > currentPrice;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    addItem(product, 1);
  }

  function handleIncrement(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const maxQty = Number(product.productQty);
    if (quantityInCart < maxQty) updateQuantity(product.id, quantityInCart + 1);
  }

  function handleDecrement(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (quantityInCart <= 1) removeItem(product.id);
    else updateQuantity(product.id, quantityInCart - 1);
  }

  return (
    <Card
      id={`seller-card-${product.seller.id}`}
      data-seller-id={product.seller.id}
      className={`group relative flex h-auto min-h-80 flex-col justify-between overflow-hidden rounded-[20px] border bg-white p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        selected
          ? "border-agrivive-primary ring-2 ring-agrivive-sage/60"
          : "border-border/80 hover:border-primary/40"
      }`}
    >
      <ProductCardMedia product={product} soldOut={soldOut} tall={tallImage} />

      {/* Middle Information Area */}
      <div className="flex flex-col gap-1 pt-2">
        {/* Category & Stall Kicker */}
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-agrivive-terracotta">
          <span className="truncate">{product.productType}</span>
          <span className="truncate text-muted-foreground/80">
            {product.seller.shopName}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="line-clamp-1 text-sm font-bold text-foreground">
          <Link
            href={`/marketplace/${product.id}`}
            className="transition-colors hover:text-agrivive-primary focus-visible:underline focus-visible:outline-none"
          >
            {product.productName}
          </Link>
        </h3>

        {/* Price & Stock Row */}
        <div className="flex items-baseline justify-between gap-1 pt-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-base font-bold text-foreground sm:text-lg">
              {money(currentPrice)}
            </span>
            {isReduced ? (
              <del className="text-xs text-muted-foreground">
                {money(basePrice!)}
              </del>
            ) : null}
            <span className="text-xs text-muted-foreground">
              /{product.scalingType}
            </span>
          </div>

          <span className="text-[11px] font-medium text-muted-foreground">
            {Number(product.productQty).toLocaleString()} left
          </span>
        </div>
      </div>

      {/* Bottom Action Area (Split Button / Stepper) */}
      <div className="pt-2">
        <ProductCardAction
          product={product}
          soldOut={soldOut}
          quantityInCart={quantityInCart}
          onAddToCart={handleAddToCart}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onSelectSeller={onSelectSeller}
        />
      </div>
    </Card>
  );
}
