"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import { listMarketplaceProducts } from "@/src/features/marketplace/api/marketplace";
import type { MarketplaceProduct } from "@/src/features/marketplace/types";
import { HomeFeaturedProduceCard } from "./HomeFeaturedProduceCard";

export function HomeFeaturedProduce() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    listMarketplaceProducts(new URLSearchParams({ limit: "4" }), controller.signal)
      .then((res) => {
        if (active) {
          setProducts(res.products.slice(0, 4));
        }
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadKey]);

  return (
    <section id="live-inventory" className="bg-white py-16 sm:py-24 border-b border-neutral-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-[#457D00] animate-pulse" />
              <span className="type-eyebrow text-[#457D00]">Live Inventory</span>
            </div>
            <h2 className="type-section mt-3 font-heading text-neutral-900">Freshly Rescued Today</h2>
            <p className="type-lede mt-3 text-neutral-600">Fresh produce available right now across Davao.</p>
          </div>
          <Link
            href="/marketplace"
            className="group inline-flex min-h-11 items-center gap-1.5 self-start rounded-full text-sm font-bold text-[#457D00] hover:text-[#386600] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00] focus-visible:ring-offset-2 sm:self-auto"
          >
            See all available produce
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Dynamic Live Cards from Sellers: the wrapper reveals once; state changes inside it never replay the entrance */}
        <div data-reveal className="mt-10 sm:mt-12">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[380px] animate-pulse rounded-[22px] border border-neutral-200/70 bg-white p-3.5"
              />
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="rounded-[22px] border border-neutral-200/70 bg-white p-12 text-center">
            <p className="text-sm font-medium text-neutral-700">
              We could not load today&apos;s produce.
            </p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#457D00] px-6 text-sm font-bold text-white transition hover:bg-[#386600] active:scale-95"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Try Again
            </button>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <HomeFeaturedProduceCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[22px] border border-neutral-200/70 bg-white p-12 text-center">
            <p className="text-sm font-medium text-neutral-600">
              No surplus produce listed right now. Check back shortly as local stalls update their inventory!
            </p>
            <Link
              href="/marketplace"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#457D00] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#386600]"
            >
              Browse Marketplace <ArrowRight className="size-3.5" />
            </Link>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
