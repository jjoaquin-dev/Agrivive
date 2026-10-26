"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { listMarketplaceProducts } from "../api/marketplace";
import type { MarketplaceProduct, MarketplaceProductType } from "../types";
import { ProductCard } from "./ProductCard";

interface SimilarProduceProps {
  currentProductId: string;
  productType: MarketplaceProductType;
}

export function SimilarProduceSection({ currentProductId, productType }: SimilarProduceProps) {
  const [items, setItems] = useState<MarketplaceProduct[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const params = new URLSearchParams({ productType, limit: "4" });
    listMarketplaceProducts(params, controller.signal)
      .then((res) => {
        if (!active) return;
        setItems(res.products.filter((p) => p.id !== currentProductId).slice(0, 3));
      })
      .catch(() => { if (active) setItems([]); });
    return () => { active = false; controller.abort(); };
  }, [currentProductId, productType]);

  if (items.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-[#457D00]" />
        <h2 className="font-heading text-[18px] font-semibold text-[#14231A]">Similar produce</h2>
      </div>
      <div className="grid max-w-[1120px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <div key={product.id} className="w-full max-w-[360px]">
            <ProductCard product={product} tallImage />
          </div>
        ))}
      </div>
    </section>
  );
}
