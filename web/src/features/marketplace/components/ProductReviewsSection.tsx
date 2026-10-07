"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingStars } from "@/src/components/RatingStars";
import { ApiError, isAbortError } from "@/src/lib/api";
import { getProductReviewEligibility, getProductReviews } from "../api/marketplace";
import type { ProductReviewEligibility, ProductReviewsResponse } from "../types";
import { ProductReviewForm } from "./ProductReviewForm";
import { ReviewSummaryCard } from "./ReviewSummaryCard";

type EligibilityState =
  | { kind: "loading" }
  | { kind: "guest" }
  | { kind: "ready"; data: ProductReviewEligibility }
  | { kind: "error"; message: string };

export function ProductReviewsSection({ productId }: { productId: string }) {
  const [data, setData] = useState<ProductReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [eligibility, setEligibility] = useState<EligibilityState>({ kind: "loading" });

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

  const loadEligibility = useCallback(async (signal?: AbortSignal) => {
    setEligibility({ kind: "loading" });
    try {
      const eligibilityData = await getProductReviewEligibility(productId, signal);
      if (!signal?.aborted) setEligibility({ kind: "ready", data: eligibilityData });
    } catch (reason) {
      if (signal?.aborted || isAbortError(reason)) return;
      if (reason instanceof ApiError && reason.status === 401) setEligibility({ kind: "guest" });
      else setEligibility({ kind: "error", message: reason instanceof ApiError ? reason.message : "We could not check if you can review this product." });
    }
  }, [productId]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    void loadEligibility(controller.signal);
    return () => controller.abort();
  }, [load, loadEligibility]);

  async function refreshAfterReview() {
    await Promise.all([load(), loadEligibility()]);
  }

  return (
    <section id="product-reviews" aria-labelledby="product-reviews-heading" className="mt-12 scroll-mt-24 border-t pt-8">
      <div className="flex items-center gap-2">
        <Star aria-hidden="true" className="size-5 fill-amber-400 text-amber-400" />
        <h2 id="product-reviews-heading" className="font-heading text-xl font-bold">Product ratings and comments</h2>
      </div>
      {eligibility.kind === "loading" ? (
        <Skeleton className="mt-5 h-40 rounded-[20px]" aria-label="Checking review access" />
      ) : eligibility.kind === "guest" ? (
        <Card className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[20px] border-border/80 p-5 shadow-xs">
          <div>
            <p className="font-semibold text-foreground">Bought this produce?</p>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to leave a rating and comment after pickup is complete.</p>
          </div>
          <Link className={buttonVariants({ className: "min-h-11 rounded-xl px-5 font-semibold" })} href={`/login?next=${encodeURIComponent(`/marketplace/${productId}#product-reviews`)}`}>Sign in to review</Link>
        </Card>
      ) : eligibility.kind === "error" ? (
        <Alert variant="destructive" className="mt-5 rounded-xl">
          <AlertDescription>{eligibility.message}</AlertDescription>
          <Button type="button" variant="outline" className="mt-3 min-h-11 rounded-xl" onClick={() => void loadEligibility()}>Try again</Button>
        </Alert>
      ) : eligibility.data.purchases.length ? (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-muted-foreground">Your completed pickup lets you rate this product and add a comment.</p>
          {eligibility.data.purchases.map((purchase) => (
            <ProductReviewForm key={purchase.itemId} purchase={purchase} productId={productId} onSaved={() => void refreshAfterReview()} />
          ))}
        </div>
      ) : (
        <Card className="mt-5 rounded-[20px] border-border/80 p-5 shadow-xs">
          <p className="font-semibold text-foreground">Reviews are open to buyers after pickup</p>
          <p className="mt-1 text-sm text-muted-foreground">Once you complete a pickup for this product, you can leave a rating and comment here.</p>
        </Card>
      )}

      {loading ? (
        <div className="mt-5 grid gap-5 md:grid-cols-[280px_minmax(0,1fr)]" aria-label="Loading product reviews">
          <Skeleton className="h-44 rounded-[20px]" />
          <Skeleton className="h-44 rounded-[20px]" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mt-5 rounded-xl">
          <AlertDescription>{error}</AlertDescription>
          <Button type="button" variant="outline" className="mt-3 min-h-11 rounded-xl" onClick={() => void load()}>Try again</Button>
        </Alert>
      ) : data?.count ? (
        <div className="mt-5 grid gap-5 md:grid-cols-[280px_minmax(0,1fr)]">
          <ReviewSummaryCard average={data.average} count={data.count} breakdown={data.breakdown} singular="rating" />
          <div className="space-y-4">
            {data.reviews.map((review) => (
              <Card key={review.id} className="rounded-[18px] border-border/80 p-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{review.buyerName}</span>
                    <Badge variant="secondary" className="text-[10px] font-normal">Verified purchase</Badge>
                  </div>
                  <time className="text-xs text-muted-foreground" dateTime={review.createdAt}>
                    {new Date(review.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                  </time>
                </div>
                <div className="mt-2"><RatingStars rating={review.rating} /></div>
                {review.review ? <p className="mt-2 text-sm leading-6 text-foreground/90">{review.review}</p> : null}
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="mt-5 rounded-[20px] border-border/80 shadow-xs">
          <Empty className="py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon"><MessageSquare aria-hidden="true" className="size-5" /></EmptyMedia>
              <EmptyTitle>No product ratings yet</EmptyTitle>
              <EmptyDescription>Buyers can leave a rating and comment after pickup is complete.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Card>
      )}
    </section>
  );
}
