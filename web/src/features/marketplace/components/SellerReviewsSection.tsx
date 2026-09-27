"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Star, Store } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
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
      <section className="mt-10">
        <h2 className="font-heading text-xl font-bold">Seller ratings & reviews</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-[280px_1fr]">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
        </div>
      </section>
    );
  }

  const hasReviews = data && data.count > 0;

  return (
    <section className="mt-12 border-t pt-8">
      <div className="flex items-center gap-2">
        <Store className="size-5 text-primary" />
        <h2 className="font-heading text-xl font-bold">Seller ratings & reviews</h2>
        <Badge variant="outline" className="text-xs font-normal">{shopName}</Badge>
      </div>

      {error ? (
        <Alert variant="destructive" className="mt-5">
          <AlertDescription>{error}</AlertDescription>
          <Button type="button" variant="outline" className="mt-3" onClick={() => setRetryKey((current) => current + 1)}>Try again</Button>
        </Alert>
      ) : null}

      {!error && !hasReviews ? (
        <Card className="mt-5">
          <Empty className="py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon"><Star className="size-5" /></EmptyMedia>
              <EmptyTitle>No seller reviews yet</EmptyTitle>
              <EmptyDescription>
                Reviews are posted by verified buyers after completing an in-person pickup.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Card>
      ) : !error && data ? (
        <div className="mt-6 grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
          <ReviewSummaryCard average={data.average} count={data.count} breakdown={data.breakdown} singular="review" />
          <div className="space-y-4">
            {data.reviews.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{item.buyerName}</span>
                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">Verified pickup</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="mt-1.5">
                  <RatingStars rating={item.rating} />
                </div>
                {item.review ? (
                  <p className="mt-2 text-sm text-foreground/90 leading-relaxed">{item.review}</p>
                ) : null}
                {item.sellerResponse ? (
                  <div className="mt-3 rounded-lg bg-muted/50 p-3 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-primary">
                      <MessageSquare className="size-3" />
                      <span>Seller response</span>
                    </div>
                    <p className="mt-1 text-muted-foreground leading-relaxed">{item.sellerResponse}</p>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
