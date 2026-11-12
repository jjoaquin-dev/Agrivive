"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingStars } from "@/src/components/RatingStars";
import { ApiError, isAbortError } from "@/src/lib/api";
import { getProductReviews } from "../api/marketplace";
import type { ProductReviewsResponse } from "../types";
import { ReviewSummaryCard } from "./ReviewSummaryCard";
import { formatDate } from "@/src/lib/format";

export function ProductReviewsSection({ productId }: { productId: string }) {
  const [data, setData] = useState<ProductReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");
    try {
      setData(await getProductReviews(productId, signal));
    } catch (reason) {
      if (isAbortError(reason)) return;
      setError(reason instanceof ApiError ? reason.message : "We could not load product reviews.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return (
    <section id="product-reviews" aria-labelledby="product-reviews-heading" className="space-y-4 scroll-mt-24">
      <div className="flex items-center gap-2">
        <Star aria-hidden="true" className="size-5 fill-amber-400 text-amber-400" />
        <h2 id="product-reviews-heading" className="font-heading text-lg font-semibold text-agrivive-ink">
          Product ratings and comments
        </h2>
      </div>

      <p className="text-xs text-muted-foreground">Buyers rate the produce from their order page after pickup. One rating covers every item in that order.</p>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]" aria-label="Loading product reviews">
          <Skeleton className="h-44 rounded-2xl border border-agrivive-line bg-white" />
          <Skeleton className="h-44 rounded-2xl border border-agrivive-line bg-white" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription>{error}</AlertDescription>
          <Button type="button" variant="outline" className="mt-3 rounded-xl border-agrivive-line" onClick={() => void load()}>
            Try again
          </Button>
        </Alert>
      ) : data?.count ? (
        <div className="grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
          <ReviewSummaryCard average={data.average} count={data.count} breakdown={data.breakdown} singular="rating" />
          <div className="space-y-4">
            {data.reviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-agrivive-line bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{review.buyerName}</span>
                    <span className="rounded-full border border-[#CDE5BA] bg-agrivive-mist px-2 py-0.5 text-xs font-semibold text-agrivive-primary">
                      Verified purchase
                    </span>
                  </div>
                  <time className="text-xs text-muted-foreground" dateTime={review.createdAt}>
                    {formatDate(review.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                  </time>
                </div>
                <div className="mt-2"><RatingStars rating={review.rating} /></div>
                {review.review ? <p className="mt-2 text-sm leading-relaxed text-foreground/90">{review.review}</p> : null}
                {review.photoUrl ? <img src={review.photoUrl} alt={`Photo from ${review.buyerName}`} loading="lazy" className="mt-3 h-28 w-28 rounded-xl border border-agrivive-line object-cover" /> : null}
                {review.sellerResponse ? (
                  <div className="mt-3 rounded-xl border border-agrivive-line bg-[#FAFAFA] p-3 text-xs">
                    <div className="font-semibold text-agrivive-primary">Seller response</div>
                    <p className="mt-1 leading-relaxed text-muted-foreground">{review.sellerResponse}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-agrivive-line bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-agrivive-mist text-agrivive-primary">
            <MessageSquare className="size-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-agrivive-ink">No product ratings yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Buyers can rate the produce after pickup is complete.</p>
        </div>
      )}
    </section>
  );
}
