"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCart } from "@/src/features/cart/CartProvider";
import type { MarketplaceProduct } from "../types";
import { ProductCardAction } from "./ProductCardAction";
import { ProductCardMedia } from "./ProductCardMedia";

function money(value: string | number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatCategory(category: string) {
  if (!category) return "";
  return category
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

  function handleIncrement() {
    const maxQty = Number(product.productQty);
    if (quantityInCart < maxQty) updateQuantity(product.id, quantityInCart + 1);
  }

  function handleDecrement() {
    if (quantityInCart <= 1) removeItem(product.id);
    else updateQuantity(product.id, quantityInCart - 1);
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
      id={`seller-card-${product.seller.id}`}
      data-seller-id={product.seller.id}
      onClick={handleCardClick}
      className={`group relative flex h-full w-full max-w-[300px] cursor-pointer flex-col justify-between overflow-hidden rounded-[28px] bg-white p-4 pb-4.5 transition-all duration-300 hover:-translate-y-1 ${
        selected
          ? "border-[1.5px] border-[#457D00] shadow-[0_8px_28px_rgba(69,125,0,0.14)]"
          : "border-[1.5px] border-transparent shadow-[0_8px_26px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)]"
      }`}
    >
      <div className="flex flex-1 flex-col">
        <ProductCardMedia product={product} soldOut={soldOut} tall={tallImage} />

        {/* Content Area with 16px (1rem) image-to-content gap */}
        <div className="flex flex-1 flex-col justify-between mt-4">
          <div>
            {/* Category & Location Kicker: 12px, Medium (500), Muted Gray, +0.05em tracking */}
            <div className="min-w-0 flex items-center gap-1.5 text-[12px] font-medium text-[#6B7280] tracking-[0.05em]">
              <span className="shrink-0">
                {formatCategory(product.productType)}
              </span>
              <span className="text-[#96B125] shrink-0 font-normal">•</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSeller?.(product.seller.id);
                }}
                className="min-w-0 flex items-center gap-1 truncate text-[#6B7280] font-medium hover:text-[#457D00] transition-colors"
                title={product.seller.shopName}
              >
                <MapPin className="size-3.5 shrink-0 text-[#FEA938]" />
                <span className="truncate">{product.seller.shopName}</span>
              </button>
            </div>

            {/* Product Title: 18px (1.125rem), Semi-bold (600), Dark Neutral (#111827), Line-height 1.35, 6px micro-gap */}
            <h3 className="mt-1.5 line-clamp-2 font-heading text-[18px] font-semibold leading-[1.35] tracking-tight text-[#111827]">
              <Link
                href={`/marketplace/${product.id}`}
                className="transition-colors hover:text-[#457D00] focus-visible:underline focus-visible:outline-none"
              >
                {product.productName}
              </Link>
            </h3>
          </div>

          {/* Pricing & Stock Remaining: 16px macro-gap, 20px Bold tabular price, 13px/14px secondary info */}
          <div className="mt-4 flex items-baseline justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-[20px] font-bold tabular-nums tracking-tight text-[#457D00] leading-none">
                {money(currentPrice)}
              </span>
              {isReduced ? (
                <del className="text-[13px] font-normal tabular-nums text-[#4B5563] leading-none">
                  {money(basePrice!)}
                </del>
              ) : null}
              <span className="text-[14px] text-[#4B5563] font-normal leading-none">
                / {product.scalingType}
              </span>
            </div>

            <div className="text-[13px] font-normal text-[#4B5563]">
              <span className="font-semibold text-[#111827] tabular-nums">{Number(product.productQty).toLocaleString()}</span>
              <span> left</span>
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
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      </div>
    </Card>
  );
}
