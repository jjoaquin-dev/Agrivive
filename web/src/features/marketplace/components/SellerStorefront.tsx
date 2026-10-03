"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Store } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/src/components/PageContainer";
import { ApiError, isAbortError } from "@/src/lib/api";
import { getMarketplaceSeller, listMarketplaceProducts } from "../api/marketplace";
import { sellerTypeLabel } from "../marketplace-labels";
import type { MarketplaceProduct, MarketplaceSellerProfile } from "../types";
import { ProductCard } from "./ProductCard";
import { SellerProfileAvatar } from "./SellerProfileAvatar";
import { getDirectionsUrl } from "@/src/lib/maps";

function StorefrontLoading() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-background py-6 lg:py-8" aria-label="Loading seller page" aria-busy="true">
      <PageContainer>
        <Skeleton className="h-40 rounded-[20px]" />
        <Skeleton className="mt-8 h-8 w-56" />
        <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => <Skeleton key={item} className="h-[380px] rounded-2xl" />)}
        </div>
      </PageContainer>
    </main>
  );
}

export function SellerStorefront() {
  const params = useParams<{ id: string }>();
  const sellerId = params?.id ?? "";
  const [seller, setSeller] = useState<MarketplaceSellerProfile | null>(null);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [loadMoreError, setLoadMoreError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const loadMoreController = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setLoadingMore(false);
    setError("");
    setLoadMoreError("");
    setSeller(null);
    setProducts([]);
    setNextCursor(null);
    const query = new URLSearchParams({ sellerId, limit: "12" });
    Promise.all([
      getMarketplaceSeller(sellerId, controller.signal),
      listMarketplaceProducts(query, controller.signal),
    ])
      .then(([sellerResult, listingResult]) => {
        if (!active) return;
        setSeller(sellerResult);
        setProducts(listingResult.products);
        setNextCursor(listingResult.nextCursor);
      })
      .catch((reason: unknown) => {
        if (!active || isAbortError(reason)) return;
        setError(reason instanceof ApiError ? reason.message : "We could not load this seller page.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => {
      active = false;
      controller.abort();
      loadMoreController.current?.abort();
      loadMoreController.current = null;
    };
  }, [sellerId, retryKey]);

  async function loadMore() {
    if (!sellerId || !nextCursor || loadingMore) return;
    const controller = new AbortController();
    loadMoreController.current = controller;
    setLoadingMore(true);
    setLoadMoreError("");
    const query = new URLSearchParams({ sellerId, cursor: nextCursor, limit: "12" });
    try {
      const result = await listMarketplaceProducts(query, controller.signal);
      setProducts((current) => [...current, ...result.products]);
      setNextCursor(result.nextCursor);
    } catch (reason) {
      if (!isAbortError(reason)) {
        setLoadMoreError(reason instanceof ApiError ? reason.message : "We could not load more products.");
      }
    } finally {
      if (loadMoreController.current === controller) {
        loadMoreController.current = null;
        setLoadingMore(false);
      }
    }
  }

  if (loading) return <StorefrontLoading />;

  const directionsUrl = getDirectionsUrl(seller?.latitude ?? null, seller?.longitude ?? null);

  return (
    <main className="min-h-[calc(100vh-72px)] bg-background py-6 text-foreground sm:py-8 lg:py-10">
      <PageContainer>
        <Link href="/marketplace" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft aria-hidden="true" className="size-4" />Marketplace
        </Link>

        {error || !seller ? (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Seller page could not load</AlertTitle>
            <AlertDescription>{error || "We could not find this seller."}</AlertDescription>
            <Button type="button" variant="outline" className="mt-3" onClick={() => setRetryKey((current) => current + 1)}>
              Try again
            </Button>
          </Alert>
        ) : (
          <>
            <header className="mt-5 grid gap-5 rounded-[20px] border border-border/80 bg-white p-5 shadow-[0_14px_32px_rgba(31,77,58,0.08)] md:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)] md:items-center md:gap-10 md:p-8">
              <div className="flex min-w-0 items-start gap-4 border-l-4 border-primary pl-4 sm:pl-5">
                <SellerProfileAvatar imageUrl={seller.image} shopName={seller.shopName} />
                <div className="min-w-0">
                  <Badge variant="secondary" className="mb-2">{sellerTypeLabel(seller.sellerType)}</Badge>
                  <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">{seller.shopName}</h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    Browse the fresh produce this seller has available for pickup.
                  </p>
                </div>
              </div>

              <dl className="grid gap-4 border-t border-border/70 pt-4 text-sm md:border-l md:border-t-0 md:pl-6 md:pt-0">
                <div>
                  <dt className="flex items-center gap-2 font-semibold text-foreground">
                    <MapPin aria-hidden="true" className="size-4 shrink-0 text-primary" />Pickup location
                  </dt>
                  <dd className="mt-1 pl-6 leading-6 text-muted-foreground">{seller.detailAddress}</dd>
                  {directionsUrl ? <a href={directionsUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center pl-6 text-sm font-semibold text-agrivive-primary hover:underline">Get directions</a> : null}
                </div>
                <div>
                  <dt className="flex items-center gap-2 font-semibold text-foreground">
                    <Store aria-hidden="true" className="size-4 shrink-0 text-primary" />Pickup details
                  </dt>
                  <dd className="mt-1 pl-6 leading-6 text-muted-foreground">
                    {seller.pickupInstructions || "Ask the seller about the best pickup time after reserving."}
                  </dd>
                </div>
              </dl>
            </header>

            <section aria-labelledby="seller-products-heading" className="pt-8">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 id="seller-products-heading" className="font-heading text-2xl font-bold">Available products</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{products.length} products shown</p>
                </div>
              </div>

              {products.length === 0 ? (
                <Empty className="border-y py-10">
                  <EmptyHeader>
                    <EmptyMedia variant="icon"><Store /></EmptyMedia>
                    <EmptyTitle>No available products yet</EmptyTitle>
                    <EmptyDescription>This seller has no produce for sale right now. Browse the marketplace to find other local sellers.</EmptyDescription>
                  </EmptyHeader>
                  <Button render={<Link href="/marketplace" />} nativeButton={false}>Browse marketplace</Button>
                </Empty>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => <ProductCard key={product.id} product={product} />)}
                  </div>
                  {nextCursor ? (
                    <div className="flex flex-col items-center gap-3 pt-7">
                      {loadMoreError ? (
                        <Alert variant="destructive" className="w-full max-w-xl">
                          <AlertDescription>{loadMoreError}</AlertDescription>
                          <Button type="button" variant="outline" className="mt-3" onClick={loadMore}>Try again</Button>
                        </Alert>
                      ) : (
                        <Button type="button" variant="outline" className="min-h-12" onClick={loadMore} disabled={loadingMore}>
                          {loadingMore ? "Loading products…" : "Load more products"}
                        </Button>
                      )}
                    </div>
                  ) : null}
                </>
              )}
            </section>
          </>
        )}
      </PageContainer>
    </main>
  );
}
