"use client";

import Link from "next/link";
import { Check, Compass, MapPin, ShoppingBasket, ShoppingCart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { isTrustAccessMessage } from "@/src/lib/api";
import { getDirectionsUrl } from "@/src/lib/maps";
import { TrustAccessNotice } from "@/src/features/trust/components/TrustAccessNotice";
import type { MarketplaceProduct } from "../types";
import { MessageSellerButton } from "./MessageSellerButton";

function money(value: string | number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(value));
}

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
}: ProductInfoCardProps) {
  const previousPrice = product.basePrice == null ? null : Number(product.basePrice);
  const currentPrice = Number(product.productPrice);
  const isReduced = previousPrice !== null && previousPrice > currentPrice;
  const directionsUrl = getDirectionsUrl(
    product.seller.latitude,
    product.seller.longitude,
    product.seller.detailAddress,
  );

  return (
    <div className="flex h-full flex-col justify-between space-y-5 rounded-[24px] border border-[#E5E2DA] bg-white p-6 shadow-xs lg:col-span-1">
      <div className="space-y-5">
        {/* Category & Title */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E7C4] bg-[#F0F7EB] px-2.5 py-0.5 text-[11px] font-semibold text-[#386600]">
            <ShoppingBasket className="size-3 text-[#457D00]" />
            {product.productType}
          </span>
          <h1 className="font-heading text-[26px] font-bold leading-tight text-[#14231A]">
            {product.productName}
          </h1>

          {/* Pricing & Stock */}
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#EAECE0] pb-4 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-[24px] font-bold text-[#457D00]">
                {money(currentPrice)}
              </span>
              {isReduced ? (
                <del className="text-[12px] text-muted-foreground">
                  {money(previousPrice!)}
                </del>
              ) : null}
              <span className="text-[12px] text-muted-foreground">
                /{product.scalingType}
              </span>
            </div>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${
              soldOut
                ? "border border-red-200 bg-red-50 text-red-700"
                : "border border-[#D5E7C4] bg-[#F0F7EB] text-[#386600]"
            }`}>
              {!soldOut && <Check className="size-3 stroke-[2.5] text-[#457D00]" />}
              {soldOut ? "Sold out" : `${Number(product.productQty).toLocaleString()} ${product.scalingType} available`}
            </span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="space-y-3 text-[14px]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[12px] text-muted-foreground">Seller</span>
              <p>
                <Link href={`/sellers/${product.seller.id}`} className="font-bold text-[#457D00] hover:underline">
                  {product.seller.shopName}
                </Link>
              </p>
            </div>
            <MessageSellerButton context="product" id={product.id} compact />
          </div>
        </div>

        {/* Pickup Location Box */}
        <div className="space-y-1.5 rounded-2xl border border-[#EAECE0] bg-[#FAF9F5] p-4 text-[14px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-semibold text-foreground">Pickup details</span>
            {directionsUrl ? (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#457D00] hover:text-[#386600] hover:underline"
              >
                <Compass className="size-3.5 shrink-0" aria-hidden="true" />
                <span>Get Direction</span>
              </a>
            ) : null}
          </div>
          <p className="flex items-start gap-1.5 text-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[#457D00]" />
            <span>{product.seller.detailAddress}</span>
          </p>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            {product.seller.pickupInstructions || "Ask the seller for the best pickup time after reserving."}
          </p>
        </div>

        {/* Error or Cart Notice */}
        {orderError ? isTrustAccessMessage(orderError)
          ? <TrustAccessNotice message={orderError} />
          : <Alert variant="destructive" className="rounded-xl"><AlertDescription>{orderError}</AlertDescription></Alert>
          : null}
        {cartMessage ? <Alert className="rounded-xl border-[#CDE5BA] bg-[#F0F7EB] text-[#244218]"><AlertDescription>{cartMessage}</AlertDescription></Alert> : null}

        {/* Quantity Input */}
        <div className="space-y-1.5">
          <label htmlFor="reservation-quantity" className="text-[12px] font-semibold text-foreground">
            Quantity to reserve
          </label>
          <input
            id="reservation-quantity"
            type="number"
            min="0.01"
            max={Number(product.productQty)}
            step="0.01"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            disabled={soldOut || ordering}
            className="h-10 min-h-[40px] w-full rounded-full border border-[#EAECE0] bg-white px-4 text-[14px] text-foreground outline-none transition focus:border-[#457D00] focus:ring-2 focus:ring-[#457D00]/20 disabled:opacity-60"
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
            className="h-10 min-h-[40px] rounded-xl border border-[#D5DAC6] bg-[#F9F8F1] text-[14px] font-semibold text-neutral-800 hover:bg-[#F3F2EA]"
          >
            <ShoppingCart className="size-4" />Add to cart
          </Button>
          <Button
            type="button"
            onClick={onBuyNow}
            disabled={soldOut || ordering}
            className="h-10 min-h-[40px] rounded-xl bg-[#457D00] text-[14px] font-semibold text-white shadow-xs hover:bg-[#386600]"
          >
            {ordering ? "Reserving…" : "Buy now"}
          </Button>
        </div>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Payment happens directly at pickup. Reservations expire after 24 hours.
        </p>
      </div>
    </div>
  );
}
