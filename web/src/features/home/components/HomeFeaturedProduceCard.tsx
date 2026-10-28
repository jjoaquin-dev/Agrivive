"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Heart, MapPin, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/src/features/cart/CartProvider";
import { useBuyerWishlist } from "@/src/features/wishlist/WishlistProvider";
import { ProductImage } from "@/src/features/marketplace/components/ProductImage";
import type { MarketplaceProduct } from "@/src/features/marketplace/types";

function money(value: string | number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function HomeFeaturedProduceCard({ product }: { product: MarketplaceProduct }) {
  const { items, addItem, setDrawerOpen } = useCart();
  const { savedProductIds, toggleProduct, pendingProductIds } = useBuyerWishlist();
  const [selectedQty, setSelectedQty] = useState(1);

  const isFav = savedProductIds.has(product.id);
  const saving = pendingProductIds.has(product.id);
  const cartItem = items.find((item) => item.id === product.id);
  const inCart = cartItem?.quantity ?? 0;

  const maxQty = Math.max(1, Math.floor(Number(product.productQty) || 1));
  const soldOut = product.availability === "sold_out" || Number(product.productQty) <= 0;
  const basePrice = product.basePrice ? Number(product.basePrice) : null;
  const currentPrice = Number(product.productPrice);
  const isReduced = basePrice !== null && basePrice > currentPrice;
  const discountPct = isReduced ? Math.round(((basePrice - currentPrice) / basePrice) * 100) : 0;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    addItem(product, selectedQty);
    setDrawerOpen(true);
  }

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-neutral-200/70 bg-white p-3.5 shadow-[0_4px_20px_-2px_rgba(20,40,25,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-6px_rgba(20,60,35,0.12)]">
      <div>
        {/* Seamless Image Container */}
        <div className="relative h-48 w-full overflow-hidden rounded-[18px] bg-white p-1">
          <Link
            href={`/marketplace/${product.id}`}
            className="relative flex h-full w-full items-center justify-center"
            aria-label={`View ${product.productName}`}
          >
            <div className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-105">
              <ProductImage
                src={product.imageUrl}
                alt={product.productName}
                category={product.productType}
                className="h-full w-full object-contain mix-blend-multiply"
              />
            </div>
          </Link>

          {/* Top-Left: Golden Amber Discount Badge */}
          <div className="pointer-events-none absolute left-3 top-3 z-10">
            {discountPct > 0 ? (
              <span className="inline-flex items-center rounded-full bg-[#FEA938] px-2.5 py-0.5 text-[11px] font-bold text-neutral-950 shadow-2xs">
                {discountPct}% OFF
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-[#EBF3E6] px-2.5 py-0.5 text-[11px] font-bold text-[#457D00] shadow-2xs">
                Fresh Surplus
              </span>
            )}
          </div>

          {/* Top-Right: Clean Wishlist Heart */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void toggleProduct(product.id);
            }}
            disabled={saving}
            aria-label={isFav ? "Remove from saved items" : "Save item"}
            className={`absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full border shadow-2xs backdrop-blur-md transition active:scale-95 ${
              isFav
                ? "border-red-400 bg-red-500 text-white"
                : "border-neutral-200/80 bg-white/90 text-neutral-600 hover:bg-white hover:text-red-500"
            }`}
          >
            <Heart
              className={`size-4 ${isFav ? "fill-white" : "fill-transparent"}`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Identity & Metadata Zone */}
        <div className="flex flex-col gap-2 pt-3">
          <div className="flex items-center justify-between gap-1 text-[11px]">
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-semibold text-neutral-700">
              {product.productType}
            </span>
            <div className="flex items-center gap-1 text-neutral-500 truncate max-w-[130px]">
              <MapPin className="size-3 shrink-0 text-[#457D00]" />
              <span className="truncate">{product.seller.shopName || "Local Stall"}</span>
            </div>
          </div>

          <h3 className="line-clamp-1 font-heading text-[15px] font-bold text-neutral-900 leading-snug group-hover:text-[#457D00] transition-colors">
            <Link href={`/marketplace/${product.id}`}>{product.productName}</Link>
          </h3>

          {/* Price & Stock */}
          <div className="flex items-baseline justify-between pt-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-xl font-bold text-[#457D00]">
                {money(currentPrice)}
              </span>
              {isReduced ? (
                <del className="text-xs font-medium text-neutral-400">
                  {money(basePrice!)}
                </del>
              ) : null}
              <span className="text-xs text-neutral-500 font-semibold">
                / {product.scalingType}
              </span>
            </div>

            <span className="text-xs font-semibold text-neutral-500">
              {soldOut ? "Sold out" : `${Number(product.productQty)} ${product.scalingType}s left`}
            </span>
          </div>
        </div>
      </div>

      {/* Action Zone: Quantity Selector + Cart CTA */}
      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-2">
        <div className="flex h-10 items-center rounded-full border border-neutral-200/80 bg-neutral-100/80 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setSelectedQty((prev) => Math.max(1, prev - 1))}
            disabled={selectedQty <= 1 || soldOut}
            aria-label="Decrease quantity"
            className="flex size-7 items-center justify-center rounded-full bg-white text-neutral-700 shadow-2xs transition active:scale-90 hover:bg-neutral-50 disabled:opacity-30"
          >
            <Minus className="size-3" />
          </button>
          <span className="w-7 text-center text-xs font-bold text-neutral-900">
            {selectedQty}
          </span>
          <button
            type="button"
            onClick={() => setSelectedQty((prev) => Math.min(maxQty, prev + 1))}
            disabled={selectedQty >= maxQty || soldOut}
            aria-label="Increase quantity"
            className="flex size-7 items-center justify-center rounded-full bg-white text-neutral-700 shadow-2xs transition active:scale-90 hover:bg-neutral-50 disabled:opacity-30"
          >
            <Plus className="size-3" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#457D00] hover:bg-[#386600] px-4 text-xs font-bold text-white shadow-2xs transition-all active:scale-95 cursor-pointer disabled:bg-neutral-300 disabled:cursor-not-allowed"
        >
          {soldOut ? (
            <span>Sold out</span>
          ) : inCart > 0 ? (
            <>
              <Check className="size-3.5 stroke-[3] text-white" />
              <span>{inCart} in cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="size-3.5 stroke-[2.5] text-white" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
