"use client";

import Link from "next/link";
import { Heart, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCart } from "@/src/features/cart/CartProvider";
import type { MarketplaceProduct } from "../types";
import { ProductImage } from "./ProductImage";
import { ProductCardAction } from "./ProductCardAction";
import { useBuyerWishlist } from "@/src/features/wishlist/WishlistProvider";

function money(value: string | number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(value));
}

export function ProductCard({
  product,
  selected = false,
  onSelectSeller,
}: {
  product: MarketplaceProduct;
  selected?: boolean;
  onSelectSeller?: (sellerId: string) => void;
}) {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const { savedProductIds, ready: wishlistReady, pendingProductIds, error: wishlistError, toggleProduct } = useBuyerWishlist();
  const isSaved = savedProductIds.has(product.id);
  const saving = pendingProductIds.has(product.id);
  const cartItem = items.find((item) => item.id === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;

  const soldOut = product.availability === "sold_out" || Number(product.productQty) <= 0;
  const basePrice = product.basePrice ? Number(product.basePrice) : null;
  const currentPrice = Number(product.productPrice);
  const isReduced = basePrice !== null && basePrice > currentPrice;
  const discountPct = isReduced ? Math.round(((basePrice - currentPrice) / basePrice) * 100) : 0;

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

  function handleToggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    void toggleProduct(product.id);
  }

  return (
    <Card
      id={`seller-card-${product.seller.id}`}
      data-seller-id={product.seller.id}
      className={`group relative flex h-80 flex-col justify-between overflow-hidden rounded-[20px] border bg-white p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        selected ? "border-agrivive-primary ring-2 ring-agrivive-sage/60" : "border-border/80 hover:border-primary/40"
      }`}
    >
      {/* Hero Image Container with Badges */}
      <div className="relative h-32 w-full overflow-hidden rounded-[14px] bg-agrivive-background">
        <Link
          href={`/marketplace/${product.id}`}
          className="relative block h-full w-full"
          aria-label={`View ${product.productName}`}
        >
          <div className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-105">
            <ProductImage src={product.imageUrl} alt={product.productName} category={product.productType} />
          </div>
        </Link>

        {/* Top-Left Badge: Discount Pill or Sold Out */}
        <div className="pointer-events-none absolute left-2.5 top-2.5">
          {soldOut ? (
            <Badge variant="destructive" className="px-2 py-0.5 text-[10px] font-bold uppercase shadow-xs">
              Sold out
            </Badge>
          ) : isReduced ? (
            <Badge className="border-none bg-agrivive-terracotta px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              {discountPct}% OFF
            </Badge>
          ) : (
            <Badge variant="secondary" className="border-none bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-xs backdrop-blur-xs">
              {product.productType}
            </Badge>
          )}
        </div>

        {/* Top-Right Save / Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleSave}
          disabled={!wishlistReady || saving}
          title={wishlistError || (isSaved ? "Remove from saved" : "Save produce")}
          aria-label={wishlistError || (isSaved ? `Remove ${product.productName} from saved items` : `Save ${product.productName}`)}
          aria-pressed={isSaved}
          aria-busy={saving}
          className={`absolute right-2.5 top-2.5 flex size-11 min-h-11 min-w-11 items-center justify-center rounded-full border shadow-xs backdrop-blur-xs transition active:scale-95 disabled:cursor-wait disabled:opacity-70 ${
            isSaved
              ? "border-agrivive-terracotta bg-agrivive-terracotta text-white"
              : "border-border/60 bg-white/90 text-agrivive-terracotta hover:bg-white"
          }`}
        >
          {saving ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Heart className={`size-4 ${isSaved ? "fill-white" : "fill-agrivive-terracotta/20"}`} />}
        </button>
      </div>

      {/* Middle Information Area */}
      <div className="flex flex-col gap-1 pt-2">
        {/* Category & Stall Kicker */}
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-agrivive-terracotta">
          <span className="truncate">{product.productType}</span>
          <span className="truncate text-muted-foreground/80">{product.seller.shopName}</span>
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
            <span className="text-xs text-muted-foreground">/{product.scalingType}</span>
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
