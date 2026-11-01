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
    <section aria-labelledby="priority-deals-heading">
      <div className="mb-4">
        <p className="type-eyebrow text-[#457D00]">Priority deals</p>
        <h2 id="priority-deals-heading" className="mt-1 font-heading text-2xl font-bold tracking-tight text-[#14231A]">
          Lowest prices with priority picks
        </h2>
        <p className="mt-0.5 text-xs text-[#5F7367]">
          Priced 30% or more below normal, ranked by freshness, stock, seller reliability and past listings.
        </p>
      </div>

      {/* Phones: swipeable row. Desktop: grid. */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
        {deals.map((product) => (
          <div key={product.id} className="w-[78vw] max-w-[300px] shrink-0 snap-start sm:w-auto sm:max-w-none">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
