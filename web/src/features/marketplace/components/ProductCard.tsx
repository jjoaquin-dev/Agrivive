"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCart } from "@/src/features/cart/CartProvider";
import type { MarketplaceProduct } from "../types";
import { ProductCardAction } from "./ProductCardAction";
import { ProductCardMedia } from "./ProductCardMedia";
import { formatPeso as money } from "@/src/lib/money";
import { formatNumber } from "@/src/lib/format";

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
  const router = useRouter();
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const cartItem = items.find((item) => item.id === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;

  const soldOut =
    product.availability === "sold_out" || Number(product.productQty) <= 0;
  const basePrice = product.basePrice ? Number(product.basePrice) : null;
  const currentPrice = Number(product.productPrice);
  const isReduced = basePrice !== null && basePrice > currentPrice;

  function handleAddToCart(qty: number) {
    if (soldOut) return;
    addItem(product, qty);
  }

  function handleCardClick(event: React.MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest("input")) {
      return;
    }
    router.push(`/marketplace/${product.id}`);
  }

  return (
    <Card
      data-seller-id={product.seller.id}
      onClick={handleCardClick}
      className={`group relative flex h-full w-full max-w-none sm:max-w-[300px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-white p-4 pb-4.5 transition-all duration-300 hover:-translate-y-1 ${
        selected
          ? "border-[1.5px] border-agrivive-primary shadow-[0_4px_20px_rgba(20,35,26,0.06)]"
          : "border-[1.5px] border-transparent shadow-[0_4px_20px_rgba(20,35,26,0.06)] hover:shadow-[0_8px_28px_rgba(20,35,26,0.09)]"
      }`}
    >
      <div className="flex flex-1 flex-col">
        <ProductCardMedia product={product} soldOut={soldOut} tall={tallImage} />

        {/* Content Area with 16px (1rem) image-to-content gap */}
        <div className="flex flex-1 flex-col justify-between mt-4">
          <div>
            {/* Category & Location Kicker: 12px, Medium (500), Muted Gray, +0.05em tracking */}
            <div className="min-w-0 flex items-center justify-between gap-2 text-xs font-medium text-[#6B7280]">
              <span className="truncate rounded-full bg-neutral-100 px-2.5 py-1 font-semibold text-agrivive-ink">
                {product.productType}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSeller?.(product.seller.id);
                }}
                className="min-w-0 flex items-center gap-1 truncate text-[#6B7280] font-medium hover:text-agrivive-primary transition-colors"
                title={product.seller.shopName}
              >
                <MapPin className="size-3.5 shrink-0 text-agrivive-primary" />
                <span className="truncate">{product.seller.shopName}</span>
              </button>
            </div>

            {/* Product Title: 18px (1.125rem), Semi-bold (600), Dark Neutral (#14231A), Line-height 1.35, 6px micro-gap */}
            <h3 className="mt-1.5 line-clamp-2 font-heading text-lg font-semibold leading-[1.35] tracking-tight text-agrivive-ink">
              <Link
                href={`/marketplace/${product.id}`}
                className="transition-colors hover:text-agrivive-primary focus-visible:underline focus-visible:outline-none"
              >
                {product.productName}
              </Link>
            </h3>
          </div>

          {/* Pricing & Stock Remaining: 16px macro-gap, 20px Bold tabular price, 13px/14px secondary info */}
          <div className="mt-4 flex items-baseline justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-xl font-bold tabular-nums tracking-tight text-agrivive-primary leading-none">
                {money(currentPrice)}
              </span>
              {isReduced ? (
                <del className="text-sm font-normal tabular-nums text-gray-600 leading-none">
                  {money(basePrice!)}
                </del>
              ) : null}
              <span className="text-sm text-gray-600 font-normal leading-none">
                / {product.scalingType}
              </span>
            </div>

            <div className="text-sm font-normal text-gray-600">
              <span className="tabular-nums">{formatNumber(Number(product.productQty))} {Number(product.productQty) === 1 || product.scalingType.endsWith("s") ? product.scalingType : `${product.scalingType}s`} left</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Quantity Selector + Add CTA: 14px (0.875rem) macro-gap */}
      <div className="mt-3.5">
        <ProductCardAction
          product={product}
          soldOut={soldOut}
          quantityInCart={quantityInCart}
          onAddToCart={handleAddToCart}
          onChangeQuantity={(qty) => updateQuantity(product.id, qty)}
          onRemove={() => removeItem(product.id)}
        />
      </div>
    </Card>
  );
}
