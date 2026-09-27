"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, MapPin, ShoppingCart, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/src/features/cart/CartProvider";
import type { MarketplaceProduct } from "../types";
import { ProductImage } from "./ProductImage";
import { MarketplacePrice } from "./MarketplacePrice";

function sellerTypeLabel(type: string) {
  if (type === "retail_vendor") return "Retail";
  if (type === "supplier_vendor") return "Direct vendor";
  return "Farm direct";
}

export function ProductCard({ product }: { product: MarketplaceProduct }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const soldOut = product.availability === "sold_out" || Number(product.productQty) <= 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-0 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl motion-reduce:transition-none">
      {/* Product Image & Floating Badges */}
      <Link
        href={`/marketplace/${product.id}`}
        className="relative block h-48 w-full overflow-hidden bg-agrivive-background sm:h-52"
        aria-label={`View ${product.productName}`}
      >
        <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
          <ProductImage src={product.imageUrl} alt={product.productName} category={product.productType} />
        </div>

        {/* Floating Category Tag */}
        <div className="absolute left-3 top-3">
          <Badge
            variant="secondary"
            className="border-none bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-foreground shadow-xs backdrop-blur-md"
          >
            {product.productType}
          </Badge>
        </div>

        {/* Floating Availability Badge */}
        <div className="absolute right-3 top-3">
          {soldOut ? (
            <Badge variant="destructive" className="px-2.5 py-0.5 text-[11px] font-semibold shadow-xs">
              Sold out
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="gap-1 border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 backdrop-blur-md dark:text-emerald-300"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available
            </Badge>
          )}
        </div>
      </Link>

      {/* Card Header: Seller Stall & Product Name */}
      <CardHeader className="gap-2 p-4 pb-2">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex min-w-0 items-center gap-1.5">
            <Store className="size-3.5 shrink-0 text-primary" />
            <span className="truncate font-medium text-foreground/80">{product.seller.shopName}</span>
          </div>
          <Badge variant="outline" className="shrink-0 text-[10px] font-normal">
            {sellerTypeLabel(product.seller.sellerType)}
          </Badge>
        </div>

        <CardTitle className="line-clamp-2 text-base font-bold leading-snug sm:text-lg">
          <Link
            href={`/marketplace/${product.id}`}
            className="text-foreground transition-colors hover:text-primary focus-visible:underline focus-visible:outline-none"
          >
            {product.productName}
          </Link>
        </CardTitle>
      </CardHeader>

      {/* Card Content: Price, Stock & Add to Cart */}
      <CardContent className="flex flex-1 flex-col justify-between gap-4 px-4 pb-4 pt-1">
        <div className="flex items-baseline justify-between gap-2">
          <MarketplacePrice
            basePrice={product.basePrice}
            currentPrice={product.productPrice}
            unit={product.scalingType}
          />
          <span className="text-right text-xs text-muted-foreground">
            {Number(product.productQty).toLocaleString()} {product.scalingType} left
          </span>
        </div>

        <Button
          type="button"
          variant={justAdded ? "secondary" : "default"}
          size="sm"
          disabled={soldOut}
          onClick={handleAddToCart}
          className="w-full gap-2 rounded-xl py-2 font-medium shadow-xs transition-all duration-200"
        >
          {justAdded ? (
            <>
              <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>Added to cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="size-4" />
              <span>Add to cart</span>
            </>
          )}
        </Button>
      </CardContent>

      {/* Card Footer: Pickup Location */}
      <CardFooter className="gap-2 border-t bg-muted/25 px-4 py-2.5 text-xs text-muted-foreground">
        <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
        <span className="truncate">{product.seller.detailAddress}</span>
        {product.seller.distanceKm !== null ? (
          <span className="shrink-0 font-medium text-foreground/70">· {product.seller.distanceKm.toFixed(1)} km</span>
        ) : null}
      </CardFooter>
    </Card>
  );
}
