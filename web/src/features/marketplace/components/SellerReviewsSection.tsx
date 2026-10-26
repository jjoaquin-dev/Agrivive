"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Star, Store } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { isAbortError } from "@/src/lib/api";
import { RatingStars } from "@/src/components/RatingStars";
import { getSellerReviews } from "../api/marketplace";
import type { SellerReviewsResponse } from "../types";
import { ReviewSummaryCard } from "./ReviewSummaryCard";

export function SellerReviewsSection({ sellerId, shopName }: { sellerId: string; shopName: string }) {
  const [data, setData] = useState<SellerReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError("");
    getSellerReviews(sellerId, controller.signal)
      .then((res) => { if (active) setData(res); })
      .catch((err) => {
        if (active && !isAbortError(err)) {
          setData(null);
          setError(err instanceof Error ? err.message : "We could not load seller reviews.");
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [sellerId, retryKey]);

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Store className="size-5 text-[#457D00]" />
          <h2 className="font-heading text-[18px] font-semibold text-[#14231A]">Seller ratings & reviews</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <Skeleton className="h-44 rounded-[16px] border border-[#E8E8E8] bg-white" />
          <Skeleton className="h-44 rounded-[16px] border border-[#E8E8E8] bg-white" />
        </div>
      </section>
    );
  }

  const hasReviews = data && data.count > 0;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Store className="size-5 text-[#457D00]" />
        <h2 className="font-heading text-[18px] font-semibold text-[#14231A]">Seller ratings & reviews</h2>
        <span className="rounded-full border border-[#CDE5BA] bg-[#F0F7EB] px-2.5 py-0.5 text-[11px] font-semibold text-[#386600]">
          {shopName}
        </span>
      </div>

      {error ? (
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription>{error}</AlertDescription>
          <Button type="button" variant="outline" className="mt-3 rounded-xl border-[#E8E8E8]" onClick={() => setRetryKey((c) => c + 1)}>
            Try again
          </Button>
        </Alert>
      ) : null}

      {!error && !hasReviews ? (
        <div className="rounded-[16px] border border-[#E8E8E8] bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-[#F0F7EB] text-[#457D00]">
            <Star className="size-5" />
          </div>
          <p className="mt-3 text-[14px] font-semibold text-[#14231A]">No seller reviews yet</p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Reviews are posted by verified buyers after completing an in-person pickup.
          </p>
        </div>
      ) : !error && data ? (
        <div className="grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
          <ReviewSummaryCard average={data.average} count={data.count} breakdown={data.breakdown} singular="review" />
          <div className="space-y-4">
            {data.reviews.map((item) => (
              <div key={item.id} className="rounded-[16px] border border-[#E8E8E8] bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-foreground">{item.buyerName}</span>
                    <span className="rounded-full border border-[#CDE5BA] bg-[#F0F7EB] px-2 py-0.5 text-[10px] font-semibold text-[#386600]">
                      Verified pickup
                    </span>
                  </div>
                  <span className="text-[12px] text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="mt-2">
                  <RatingStars rating={item.rating} />
                </div>
                {item.review ? (
                  <p className="mt-2 text-[14px] leading-relaxed text-foreground/90">{item.review}</p>
                ) : null}
                {item.sellerResponse ? (
                  <div className="mt-3 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] p-3 text-[12px]">
                    <div className="flex items-center gap-1.5 font-semibold text-[#457D00]">
                      <MessageSquare className="size-3" />
                      <span>Seller response</span>
                    </div>
                    <p className="mt-1 leading-relaxed text-muted-foreground">{item.sellerResponse}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
