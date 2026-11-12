"use client";

import Link from "next/link";
import { Check, ShoppingBasket, ShoppingCart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { isTrustAccessMessage } from "@/src/lib/api";
import { TrustAccessNotice } from "@/src/features/trust/components/TrustAccessNotice";
import type { MarketplaceProduct } from "../types";
import { MessageSellerButton } from "./MessageSellerButton";
import { ProductPickupBox } from "./ProductPickupBox";
import { ProductListingActions } from "./ProductListingActions";
import { formatPeso as money } from "@/src/lib/money";
import { formatNumber } from "@/src/lib/format";

interface ProductInfoCardProps {
  product: MarketplaceProduct;
  quantity: string;
  setQuantity: (val: string) => void;
  soldOut: boolean;
  ordering: boolean;
  orderError: string;
  cartMessage: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
  reserveBlockedReason?: string | null;
  reserveWarning?: string | null;
}

export function ProductInfoCard({
  product,
  quantity,
  setQuantity,
  soldOut,
  ordering,
  orderError,
  cartMessage,
  onAddToCart,
  onBuyNow,
  reserveBlockedReason = null,
  reserveWarning = null,
}: ProductInfoCardProps) {
  const previousPrice = product.basePrice == null ? null : Number(product.basePrice);
  const currentPrice = Number(product.productPrice);
  const stock = Number(product.productQty);
  const stockText = formatNumber(stock);
  // Five or fewer left reads as a warning so buyers know to hurry.
  const lowStock = !soldOut && stock <= 5;
  const isReduced = previousPrice !== null && previousPrice > currentPrice;

  return (
    <div className="flex h-full flex-col justify-between space-y-5 rounded-2xl border border-agrivive-border bg-white p-6 shadow-sm lg:col-span-1">
      <div className="space-y-5">
        {/* Category & Title */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-agrivive-primary/25 bg-agrivive-mist px-2.5 py-0.5 text-xs font-semibold text-agrivive-primary">
              <ShoppingBasket className="size-3 text-agrivive-primary" />
              {product.productType}
            </span>
            <ProductListingActions productId={product.id} productName={product.productName} />
          </div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-agrivive-ink">
            {product.productName}
          </h1>

          {/* Pricing & Stock */}
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-agrivive-line pb-4 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-2xl font-bold text-agrivive-primary">
                {money(currentPrice)}
              </span>
              {isReduced ? (
                <del className="text-xs text-muted-foreground">
                  {money(previousPrice!)}
                </del>
              ) : null}
              <span className="text-xs text-muted-foreground">
                /{product.scalingType}
              </span>
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold tabular-nums ${
              soldOut
                ? "border border-red-200 bg-red-50 text-destructive"
                : lowStock
                  ? "border border-amber-200 bg-amber-50 text-amber-800"
                  : "border border-agrivive-primary/25 bg-agrivive-mist text-agrivive-primary"
            }`}>
              {!soldOut && !lowStock && <Check className="size-3.5 text-agrivive-primary" />}
              {soldOut ? "Sold out" : `${lowStock ? "Only " : ""}${stockText} ${product.scalingType} ${lowStock ? "left" : "available"}`}
            </span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs text-muted-foreground">Seller</span>
              <p>
                <Link href={`/sellers/${product.seller.id}`} className="font-bold text-agrivive-primary hover:underline">
                  {product.seller.shopName}
                </Link>
              </p>
            </div>
            <MessageSellerButton context="product" id={product.id} compact />
          </div>
        </div>

        <ProductPickupBox seller={product.seller} />

        {/* Error or Cart Notice */}
        {orderError ? isTrustAccessMessage(orderError)
          ? <TrustAccessNotice message={orderError} />
          : <Alert variant="destructive" className="rounded-xl"><AlertDescription>{orderError}</AlertDescription></Alert>
          : null}
        {cartMessage ? <Alert className="rounded-xl border-[#CDE5BA] bg-agrivive-mist text-agrivive-forest"><AlertDescription>{cartMessage}</AlertDescription></Alert> : null}

        {/* Quantity Input */}
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor="reservation-quantity" className="text-xs font-semibold text-foreground">
              Quantity to reserve
            </label>
            {!soldOut ? <span className="text-xs text-muted-foreground">Max {stockText} {product.scalingType}</span> : null}
          </div>
          <input
            id="reservation-quantity"
            type="number"
            inputMode="decimal"
            min="0.01"
            max={Number(product.productQty)}
            step="0.01"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            disabled={soldOut || ordering}
            className="h-12 min-h-12 w-full rounded-full border border-agrivive-line bg-white px-4 text-base text-foreground outline-none transition focus:border-agrivive-primary focus:ring-2 focus:ring-agrivive-primary/20 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Purchase Controls & Disclaimer anchored to bottom */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onAddToCart}
            disabled={soldOut || ordering}
            className="h-12 min-h-12 rounded-xl border border-[#D5DAC6] bg-[#F9F8F1] text-sm font-semibold text-neutral-800 hover:bg-[#F3F2EA]"
          >
            <ShoppingCart className="size-4" />Add to cart
          </Button>
          <Button
            type="button"
            onClick={onBuyNow}
            disabled={soldOut || ordering || Boolean(reserveBlockedReason)}
            className="h-12 min-h-12 rounded-xl bg-agrivive-primary text-sm font-semibold text-white shadow-sm hover:bg-agrivive-primary/90 active:translate-y-px"
          >
            {ordering ? "Reserving…" : "Reserve for pickup"}
          </Button>
        </div>
        {reserveBlockedReason ? (
          <Alert variant="destructive" className="rounded-xl" role="alert">
            <AlertDescription><strong>You cannot reserve right now.</strong> {reserveBlockedReason}</AlertDescription>
          </Alert>
        ) : reserveWarning ? (
          <Alert className="rounded-xl border-amber-300 bg-amber-50 text-amber-900"><AlertDescription>{reserveWarning}</AlertDescription></Alert>
        ) : null}
        <p className="text-xs font-semibold leading-relaxed text-neutral-800">
          Agrivive does not check produce quality. Please look over your items when you pick up.
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Payment happens directly at pickup. You pick a time today or tomorrow.
        </p>
      </div>
    </div>
  );
}
