"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { listMarketplaceDeals } from "../api/marketplace";
import type { MarketplaceProduct } from "../types";
import { ProductCard } from "./ProductCard";

// Hidden when there are no deals or the request fails: the row is extra, not required.
export function MarketplaceDealsRow() {
  const [deals, setDeals] = useState<MarketplaceProduct[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    listMarketplaceDeals(controller.signal)
      .then((response) => setDeals(response.products))
      .catch(() => {
        if (!controller.signal.aborted) setDeals([]);
      });
    return () => controller.abort();
  }, []);

  if (deals === null) {
    return (
      <div className="flex gap-4 overflow-hidden sm:grid sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-80 w-[78vw] max-w-[300px] shrink-0 rounded-2xl sm:w-auto" />
        ))}
      </div>
    );
  }

  if (!deals.length) return null;

  return (
    <section aria-labelledby="top-deals-heading">
      <div className="mb-4">
        <p className="type-eyebrow text-agrivive-primary">Top deals</p>
        <h2 id="top-deals-heading" className="mt-1 font-heading text-2xl font-bold tracking-tight text-agrivive-ink">
          Lowest prices on top-ranked produce
        </h2>
        <p className="mt-0.5 text-xs text-agrivive-stone">
          Priced 30% or more below normal, ranked by freshness, stock, seller reliability and past listings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {deals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
