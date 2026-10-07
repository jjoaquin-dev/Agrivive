"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { MessageSquare, Star } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingPicker, RatingStars } from "@/src/components/RatingStars";
import { ApiError, isAbortError } from "@/src/lib/api";
import type { BuyerOrder, BuyerOrderReview, BuyerProductReview } from "@/src/features/marketplace/types";
import {
  createBuyerOrderReview,
  createBuyerProductReview,
  getBuyerOrderReview,
  getBuyerProductReview,
} from "../api/orders";

type ExistingReviews = {
  seller: BuyerOrderReview | null;
  products: Record<string, BuyerProductReview | null>;
};

function alreadyReviewed(error: unknown) {
  return error instanceof ApiError && error.status === 404 ? null : Promise.reject(error);
}

function ReviewForm({
  title,
  itemName,
  inputId,
  existing,
  submit,
  onDuplicate,
}: {
  title: string;
  itemName?: string;
  inputId: string;
  existing: { rating: number; review: string | null } | null;
  submit: (rating: number, review: string) => Promise<{ rating: number; review: string | null }>;
  onDuplicate: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(existing);

  useEffect(() => {
    if (existing) setSaved(existing);
  }, [existing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating < 1 || saving) return;
    setSaving(true);
    setError("");
    try {
      setSaved(await submit(rating, comment.trim()));
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 409) {
        setError("This review was already sent. We’re refreshing its status.");
        onDuplicate();
      } else {
        setError(reason instanceof ApiError ? reason.message : "We could not save your review. Try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="rounded-[20px] border border-border/80 bg-white shadow-[0_8px_24px_rgba(31,77,58,0.04)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold">{title}{itemName ? `: ${itemName}` : ""}</CardTitle>
      </CardHeader>
      <CardContent>
        {saved ? (
          <div role="status" className="flex items-start gap-3">
            <Star aria-hidden="true" className="mt-0.5 size-5 shrink-0 fill-amber-400 text-amber-400" />
            <div>
              <p className="font-semibold text-foreground">Your rating</p>
              <div className="mt-1"><RatingStars rating={saved.rating} /></div>
              {saved.review ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{saved.review}</p> : <p className="mt-2 text-sm text-muted-foreground">No comment added.</p>}
            </div>
          </div>
        ) : (
          <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
            <RatingPicker value={rating} onChange={setRating} label="Your rating" />
            <label className="block text-sm font-semibold text-foreground/80" htmlFor={`review-comment-${inputId}`}>
              Comment <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id={`review-comment-${inputId}`}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={2000}
              rows={3}
              placeholder="Share a few words about your experience"
              className="w-full resize-y rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agrivive-primary/30"
            />
            {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
            <Button type="submit" disabled={rating < 1 || saving} className="min-h-12 rounded-xl px-6 font-semibold active:translate-y-px">
              {saving ? "Saving…" : itemName ? "Post product review" : "Post seller review"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export function OrderReviews({ order }: { order: BuyerOrder }) {
  const [reviews, setReviews] = useState<ExistingReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");
    try {
      const [seller, ...productReviews] = await Promise.all([
        getBuyerOrderReview(order.id, signal).catch(alreadyReviewed),
        ...order.items.map((item) => getBuyerProductReview(order.id, item.id, signal).catch(alreadyReviewed)),
      ]);
      if (signal?.aborted) return;
      setReviews({
        seller,
        products: Object.fromEntries(order.items.map((item, index) => [item.id, productReviews[index]])),
      });
    } catch (reason) {
      if (!signal?.aborted && !isAbortError(reason)) {
        setError(reason instanceof ApiError ? reason.message : "We could not check your review status.");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [order.id, order.items]);

  useEffect(() => {
    const controller = new AbortController();
    void loadReviews(controller.signal);
    return () => controller.abort();
  }, [loadReviews]);

  if (loading) return <div className="space-y-4" aria-label="Loading review forms"><Skeleton className="h-44 rounded-[20px]" /><Skeleton className="h-44 rounded-[20px]" /></div>;
  if (error || !reviews) {
    return <Alert variant="destructive"><AlertDescription>{error || "We could not check your review status."}</AlertDescription><Button type="button" variant="outline" className="mt-3 min-h-11 rounded-xl" onClick={() => void loadReviews()}>Try again</Button></Alert>;
  }

  return (
    <section aria-labelledby="order-reviews-heading" className="space-y-4">
      <div>
        <h2 id="order-reviews-heading" className="font-heading text-xl font-bold">Rate your pickup</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your feedback helps other buyers choose with care.</p>
      </div>
      <ReviewForm
        title="Rate the seller"
        inputId={`seller-${order.id}`}
        existing={reviews.seller}
        submit={(rating, review) => createBuyerOrderReview(order.id, rating, review)}
        onDuplicate={() => void loadReviews()}
      />
      {order.items.map((item) => (
        <ReviewForm
          key={item.id}
          title="Rate this product"
          itemName={item.productName}
          inputId={item.id}
          existing={reviews.products[item.id]}
          submit={(rating, review) => createBuyerProductReview(order.id, item.id, rating, review)}
          onDuplicate={() => void loadReviews()}
        />
      ))}
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><MessageSquare aria-hidden="true" className="size-4 text-agrivive-primary" />Only buyers with a completed pickup can leave a rating.</p>
    </section>
  );
}
