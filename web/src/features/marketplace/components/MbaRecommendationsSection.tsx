"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCcw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiError, isAbortError } from "@/src/lib/api";
import { getMarketplaceProductRecommendations } from "../api/recommendations";
import type { MarketplaceProductRecommendationResponse } from "../types";
import { ProductCard } from "./ProductCard";

export function MbaRecommendationsSection({ productId }: { productId: string }) {
  const [data, setData] = useState<MarketplaceProductRecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecommendations = useCallback((signal?: AbortSignal) => {
    setLoading(true);
    setError("");
    return getMarketplaceProductRecommendations(productId, signal)
      .then((result) => setData(result))
      .catch((reason: unknown) => {
        if (isAbortError(reason)) return;
        setError(reason instanceof ApiError ? reason.message : "Recommendations are unavailable right now.");
      })
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    const controller = new AbortController();
    void loadRecommendations(controller.signal);
    return () => controller.abort();
  }, [loadRecommendations]);

  if (loading) {
    return (
      <section aria-label="Loading suggested pairings" className="mt-12 border-t pt-8">
        <div className="h-7 w-56 animate-pulse rounded bg-muted" />
        <div className="mt-5 grid max-w-[1120px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-[37rem] w-full max-w-[360px] animate-pulse rounded-[20px] bg-card" />)}
        </div>
      </section>
    );
  }

  if (error || data?.status === "unavailable") {
    return (
      <section aria-live="polite" className="mt-12 border-t pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold"><Sparkles className="size-5 text-primary" aria-hidden="true" />Suggested pairings</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pairings are temporarily unavailable.</p>
          </div>
          <Button type="button" variant="outline" onClick={() => void loadRecommendations()} className="min-h-11"><RefreshCcw aria-hidden="true" data-icon="inline-start" />Try again</Button>
        </div>
      </section>
    );
  }

  if (!data || data.recommendations.length === 0 || data.status === "disabled" || data.status === "collecting") return null;

  const demo = data.status === "demo" || data.source === "synthetic";
  return (
    <section aria-labelledby="mba-recommendations-title" className="mt-12 border-t pt-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="mba-recommendations-title" className="flex items-center gap-2 font-heading text-xl font-bold"><Sparkles className="size-5 text-primary" aria-hidden="true" />{demo ? "Suggested pairings" : "Frequently bought together"}</h2>
        {demo && <Badge variant="outline">Sample data</Badge>}
      </div>
      <div className="mt-5 grid max-w-[1120px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.recommendations.map((product) => (
          <div key={product.id} className="w-full max-w-[360px]">
            <ProductCard product={product} tallImage />
          </div>
        ))}
      </div>
    </section>
  );
}
