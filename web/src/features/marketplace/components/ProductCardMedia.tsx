"use client";

import Link from "next/link";
import { Heart, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useBuyerWishlist } from "@/src/features/wishlist/WishlistProvider";
import type { MarketplaceProduct } from "../types";
import { ProductImage } from "./ProductImage";

export function ProductCardMedia({
  product,
  soldOut,
  tall = false,
}: {
  product: MarketplaceProduct;
  soldOut: boolean;
  tall?: boolean;
}) {
  const { savedProductIds, ready, pendingProductIds, error, toggleProduct } =
    useBuyerWishlist();
  const isSaved = savedProductIds.has(product.id);
  const saving = pendingProductIds.has(product.id);
  const basePrice =
    product.basePrice == null ? null : Number(product.basePrice);
  const currentPrice = Number(product.productPrice);
  const isReduced = basePrice !== null && basePrice > currentPrice;
  const discountPct = isReduced
    ? Math.round(((basePrice - currentPrice) / basePrice) * 100)
    : 0;

  function handleToggleSave(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    void toggleProduct(product.id);
  }

  return (
    <div
      className={`relative w-full shrink-0 overflow-hidden rounded-2xl bg-[#F4F7EE] ${
        tall ? "h-64" : "h-[196px]"
      }`}
    >
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
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      {/* Top-Left: Warm Peach Discount Pill */}
      <div className="pointer-events-none absolute left-3 top-3 z-10">
        {soldOut ? (
          <Badge
            variant="destructive"
            className="flex h-[28px] items-center rounded-full px-3 text-xs font-bold uppercase shadow-sm"
          >
            Sold out
          </Badge>
        ) : isReduced ? (
          <span className="inline-flex h-[28px] items-center rounded-full bg-[#FEC878] px-3 text-xs font-bold text-white shadow-sm">
            {discountPct}% OFF
          </span>
        ) : null}
      </div>

      {/* Top-Right: Circular White Heart Button with Tooltip */}
      <div className="group/heart absolute right-3 top-3 z-10">
        <button
          type="button"
          onClick={handleToggleSave}
          disabled={!ready || saving}
          aria-label={
            error ||
            (isSaved
              ? `Remove ${product.productName} from favorites`
              : `Add ${product.productName} to favorites`)
          }
          aria-pressed={isSaved}
          aria-busy={saving}
          className={`flex size-10 items-center justify-center rounded-full border border-black/5 bg-white shadow-sm transition active:scale-95 disabled:cursor-wait disabled:opacity-70 ${
            isSaved
              ? "text-[#FEA938]"
              : "text-[#14231A] hover:bg-neutral-50"
          }`}
        >
          {saving ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Heart
              className={`size-5 ${
                isSaved ? "fill-[#FEA938] text-[#FEA938]" : "fill-transparent text-[#14231A]"
              }`}
              aria-hidden="true"
            />
          )}
        </button>

        {/* Floating Tooltip */}
        <div
          role="tooltip"
          className="pointer-events-none absolute right-0 top-full mt-1.5 hidden whitespace-nowrap rounded-lg bg-neutral-900/90 px-2.5 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-xs transition group-hover/heart:block sm:block sm:opacity-0 sm:group-hover/heart:opacity-100"
        >
          {isSaved ? "Remove from favorites" : "Add to favorites"}
        </div>
      </div>
    </div>
  );
}
