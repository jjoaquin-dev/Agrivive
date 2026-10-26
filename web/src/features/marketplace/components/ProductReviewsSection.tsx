"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
      else setEligibility({ kind: "error", message: reason instanceof ApiError ? reason.message : "We could not check review access." });
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
    <section id="product-reviews" aria-labelledby="product-reviews-heading" className="space-y-4 scroll-mt-24">
      <div className="flex items-center gap-2">
        <Star aria-hidden="true" className="size-5 fill-amber-400 text-amber-400" />
        <h2 id="product-reviews-heading" className="font-heading text-[18px] font-semibold text-[#14231A]">
          Product ratings and comments
        </h2>
      </div>

      {eligibility.kind === "loading" ? (
        <Skeleton className="h-32 rounded-[16px] border border-[#E8E8E8] bg-white" aria-label="Checking review access" />
      ) : eligibility.kind === "guest" ? (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-[#E8E8E8] bg-white p-5 shadow-sm">
          <div>
            <p className="text-[14px] font-semibold text-foreground">Bought this produce?</p>
            <p className="mt-1 text-[12px] text-muted-foreground">Sign in to leave a rating and comment after pickup is complete.</p>
          </div>
          <Link
            className="inline-flex h-10 min-h-[40px] items-center rounded-xl bg-[#457D00] px-4 text-[14px] font-semibold text-white shadow-xs hover:bg-[#386600]"
            href={`/login?next=${encodeURIComponent(`/marketplace/${productId}#product-reviews`)}`}
          >
            Sign in to review
          </Link>
        </div>
      ) : eligibility.kind === "error" ? (
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription>{eligibility.message}</AlertDescription>
          <Button type="button" variant="outline" className="mt-3 rounded-xl border-[#E8E8E8]" onClick={() => void loadEligibility()}>
            Try again
          </Button>
        </Alert>
      ) : eligibility.data.purchases.length ? (
        <div className="space-y-4">
          <p className="text-[12px] text-muted-foreground">Your completed pickup lets you rate this product and add a comment.</p>
          {eligibility.data.purchases.map((purchase) => (
            <ProductReviewForm key={purchase.itemId} purchase={purchase} productId={productId} onSaved={() => void refreshAfterReview()} />
          ))}
        </div>
      ) : (
        <div className="rounded-[16px] border border-[#E8E8E8] bg-white p-5 shadow-sm">
          <p className="text-[14px] font-semibold text-foreground">Reviews are open to buyers after pickup</p>
          <p className="mt-1 text-[12px] text-muted-foreground">Once you complete a pickup for this product, you can leave a rating and comment here.</p>
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]" aria-label="Loading product reviews">
          <Skeleton className="h-44 rounded-[16px] border border-[#E8E8E8] bg-white" />
          <Skeleton className="h-44 rounded-[16px] border border-[#E8E8E8] bg-white" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription>{error}</AlertDescription>
          <Button type="button" variant="outline" className="mt-3 rounded-xl border-[#E8E8E8]" onClick={() => void load()}>
            Try again
          </Button>
        </Alert>
      ) : data?.count ? (
        <div className="grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
          <ReviewSummaryCard average={data.average} count={data.count} breakdown={data.breakdown} singular="rating" />
          <div className="space-y-4">
            {data.reviews.map((review) => (
              <div key={review.id} className="rounded-[16px] border border-[#E8E8E8] bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-foreground">{review.buyerName}</span>
                    <span className="rounded-full border border-[#CDE5BA] bg-[#F0F7EB] px-2 py-0.5 text-[10px] font-semibold text-[#386600]">
                      Verified purchase
                    </span>
                  </div>
                  <time className="text-[12px] text-muted-foreground" dateTime={review.createdAt}>
                    {new Date(review.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                  </time>
                </div>
                <div className="mt-2"><RatingStars rating={review.rating} /></div>
                {review.review ? <p className="mt-2 text-[14px] leading-relaxed text-foreground/90">{review.review}</p> : null}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-[16px] border border-[#E8E8E8] bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-[#F0F7EB] text-[#457D00]">
            <MessageSquare className="size-5" />
          </div>
          <p className="mt-3 text-[14px] font-semibold text-[#14231A]">No product ratings yet</p>
          <p className="mt-1 text-[12px] text-muted-foreground">Buyers can leave a rating and comment after pickup is complete.</p>
        </div>
      )}
    </section>
  );
}
