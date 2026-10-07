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
      className={`relative w-full shrink-0 overflow-hidden rounded-[14px] bg-agrivive-background ${tall ? "h-72" : "h-52"}`}
    >
        <Link
          href={`/marketplace/${product.id}`}
        className="relative block h-full w-full"
        aria-label={`View ${product.productName}`}
      >
        <div className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-105">
          <ProductImage
            src={product.imageUrl}
            alt={product.productName}
            category={product.productType}
          />
        </div>
      </Link>

      <div className="pointer-events-none absolute left-2.5 top-2.5">
        {soldOut ? (
          <Badge
            variant="destructive"
            className="px-2 py-0.5 text-[10px] font-bold uppercase shadow-xs"
          >
            Sold out
          </Badge>
        ) : isReduced ? (
          <Badge className="border-none bg-agrivive-terracotta px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
            {discountPct}% OFF
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="border-none bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-xs backdrop-blur-xs"
          >
            {product.productType}
          </Badge>
        )}
      </div>

      <button
        type="button"
        onClick={handleToggleSave}
        disabled={!ready || saving}
        title={error || (isSaved ? "Remove from saved" : "Save produce")}
        aria-label={
          error ||
          (isSaved
            ? `Remove ${product.productName} from saved items`
            : `Save ${product.productName}`)
        }
        aria-pressed={isSaved}
        aria-busy={saving}
        className={`absolute right-2.5 top-2.5 flex size-11 items-center justify-center rounded-full border shadow-xs backdrop-blur-xs transition active:scale-95 disabled:cursor-wait disabled:opacity-70 ${
          isSaved
            ? "border-agrivive-terracotta bg-agrivive-terracotta text-white"
            : "border-border/60 bg-white/90 text-agrivive-terracotta hover:bg-white"
        }`}
      >
        {saving ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Heart
            className={`size-4 ${isSaved ? "fill-white" : "fill-agrivive-terracotta/20"}`}
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  );
}
