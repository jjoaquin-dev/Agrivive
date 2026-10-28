"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listMarketplaceProducts } from "@/src/features/marketplace/api/marketplace";
import type { MarketplaceProduct } from "@/src/features/marketplace/types";
import { HomeFeaturedProduceCard } from "./HomeFeaturedProduceCard";

export function HomeFeaturedProduce() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    listMarketplaceProducts(new URLSearchParams({ limit: "4" }), controller.signal)
      .then((res) => {
        if (active) {
          setProducts(res.products.slice(0, 4));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return (
    <section id="live-inventory" className="bg-[#FAF9F5] py-16 sm:py-20 border-b border-neutral-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-[#457D00] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#457D00]">
                Live Inventory
              </span>
            </div>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Freshly Rescued Today
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Wholesome produce available right now across Davao with verified price savings.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#457D00] hover:text-[#386600]"
          >
            See all available produce <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Dynamic Live Cards from Sellers */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[380px] animate-pulse rounded-[22px] border border-neutral-200/70 bg-white p-3.5"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <HomeFeaturedProduceCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[22px] border border-neutral-200/70 bg-white p-12 text-center">
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
    </section>
  );
}
