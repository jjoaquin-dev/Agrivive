"use client";

import { Breadcrumbs } from "@/src/components/Breadcrumbs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Sparkles, Store } from "lucide-react";
import { PageContainer } from "@/src/components/PageContainer";
import { ProductCard } from "@/src/features/marketplace/components/ProductCard";
import type { MarketplaceProduct } from "@/src/features/marketplace/types";
import { useBuyerWishlist } from "../WishlistProvider";
import { listBuyerWishlist } from "../api/wishlist";
import { authClient } from "@/src/lib/auth-client";

export function BuyerFavorites() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { savedProductIds, ready: wishlistReady } = useBuyerWishlist();
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionPending) return;
    if (!session?.user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    listBuyerWishlist()
      .then((res) => {
        if (!active) return;
        setProducts(res.products ?? []);
      })
      .catch(() => {
        if (!active) return;
        setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session?.user, sessionPending]);

  const visibleProducts = products.filter((p) => savedProductIds.has(p.id));

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#fdfdfd] pb-16 pt-8">
      <PageContainer>
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <Breadcrumbs items={[{ label: "Saved items" }]} />

          {visibleProducts.length > 0 ? (
            <span className="rounded-full border border-[#D5E7C4] bg-[#F0F7EB] px-3 py-1 text-xs font-bold text-[#386600]">
              {visibleProducts.length} saved {visibleProducts.length === 1 ? "item" : "items"}
            </span>
          ) : null}
        </div>

        {/* Page Title & Heading */}
        <div className="mb-8 space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#FFF4E5] text-[#FEA938]">
              <Heart className="size-5 fill-[#FEA938]" />
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              My Favorites
            </h1>
          </div>
          <p className="text-xs text-neutral-500 sm:text-sm">
            Quickly check stock, prices, and reserve fresh harvests from your favorite stalls.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading || !wishlistReady ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-[24px] border border-neutral-200/60 bg-white p-4"
              />
            ))}
          </div>
        ) : visibleProducts.length === 0 ? (
          /* Empty State */
          <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-[28px] border border-neutral-200/80 bg-white p-8 text-center shadow-xs sm:p-12">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#FFF8ED] text-[#FEA938]">
              <Heart className="size-8 stroke-[1.5]" />
            </div>
            <h2 className="font-heading text-lg font-bold text-neutral-900 sm:text-xl">
              No favorite produce yet
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500 sm:text-sm">
              Tap the heart icon on any vegetable or fruit listing in the marketplace to save it here for easy reservation and price tracking.
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/marketplace"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#457D00] px-6 text-xs font-bold text-white shadow-xs transition hover:bg-[#386600] active:scale-95"
              >
                <Store className="size-4" />
                <span>Explore Marketplace</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </PageContainer>
    </main>
  );
}
