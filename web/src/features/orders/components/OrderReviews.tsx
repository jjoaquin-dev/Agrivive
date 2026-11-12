"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingStars } from "@/src/components/RatingStars";
import { ApiError, isAbortError } from "@/src/lib/api";
import type { BuyerOrder, BuyerOrderReview } from "@/src/features/marketplace/types";
import { getBuyerOrderReview } from "../api/orders";
import { OrderReviewForm } from "./OrderReviewForm";
import { formatDate } from "@/src/lib/format";

const dateFormat = { month: "short", day: "numeric", year: "numeric" } as const;

function SavedReview({ review, onEdit }: { review: BuyerOrderReview; onEdit: () => void }) {
  const canEdit = new Date(review.editableUntil).getTime() > Date.now();
  return (
    <div role="status" className="space-y-4">
      <div className="flex items-start gap-3">
        <Star aria-hidden="true" className="mt-0.5 size-5 shrink-0 fill-amber-400 text-amber-400" />
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-foreground">The produce</p>
            {review.productRating ? <div className="mt-1"><RatingStars rating={review.productRating} /></div> : <p className="mt-1 text-sm text-muted-foreground">Not rated.</p>}
          </div>
          <div>
            <p className="font-semibold text-foreground">The seller</p>
            <div className="mt-1"><RatingStars rating={review.serviceRating} /></div>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{review.review ?? "No comment added."}</p>
          {review.photoUrl ? <img src={review.photoUrl} alt="Your review photo" className="h-32 w-32 rounded-xl border border-agrivive-line object-cover" /> : null}
          {review.sellerResponse ? (
            <div className="rounded-xl border border-agrivive-line bg-[#FAFAFA] p-3 text-sm">
              <p className="font-semibold text-agrivive-primary">Seller response</p>
              <p className="mt-1 text-muted-foreground">{review.sellerResponse}</p>
            </div>
          ) : null}
        </div>
      </div>
      {canEdit ? (
        <div>
          <Button type="button" variant="outline" onClick={onEdit} className="min-h-12 rounded-xl px-5">Change my review</Button>
          <p className="mt-2 text-xs text-muted-foreground">You can change it until {formatDate(review.editableUntil, dateFormat)}.</p>
        </div>
      ) : <p className="text-xs text-muted-foreground">This review can no longer be changed.</p>}
    </div>
  );
}

export function OrderReviews({ order }: { order: BuyerOrder }) {
  const [review, setReview] = useState<BuyerOrderReview | null>(null);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");
    try {
      setReview(await getBuyerOrderReview(order.id, signal));
    } catch (reason) {
      if (signal?.aborted || isAbortError(reason)) return;
      if (reason instanceof ApiError && reason.status === 404) setReview(null);
      else setError(reason instanceof ApiError ? reason.message : "We could not check your review status.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [order.id]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  if (loading) return <div aria-label="Loading review form"><Skeleton className="h-64 rounded-2xl" /></div>;
  if (error) {
    return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription><Button type="button" variant="outline" className="mt-3 min-h-11 rounded-xl" onClick={() => void load()}>Try again</Button></Alert>;
  }

  return (
    <section aria-labelledby="order-reviews-heading" className="space-y-4">
      <div>
        <h2 id="order-reviews-heading" className="font-heading text-xl font-bold">Rate your pickup</h2>
        <p className="mt-1 text-sm text-muted-foreground">One quick review for the produce and the seller.</p>
      </div>
      <Card className="rounded-2xl border border-agrivive-line bg-white p-5 shadow-sm">
        <CardHeader className="p-0 pb-3"><CardTitle className="text-lg font-semibold text-foreground">{review && !editing ? "Your review" : review ? "Change your review" : "Your review"}</CardTitle></CardHeader>
        <CardContent className="p-0">
          {notice ? <Alert className="mb-4 text-sm"><AlertDescription>{notice}</AlertDescription></Alert> : null}
          {review && !editing ? (
            <SavedReview review={review} onEdit={() => { setNotice(""); setEditing(true); }} />
          ) : (
            <OrderReviewForm
              orderId={order.id}
              existing={review}
              onSaved={(saved, message) => { setReview(saved); setEditing(false); setNotice(message ?? ""); }}
              onDuplicate={() => { setEditing(false); void load(); }}
              onCancel={review ? () => setEditing(false) : undefined}
            />
          )}
        </CardContent>
      </Card>
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><MessageSquare aria-hidden="true" className="size-4 text-agrivive-primary" />Only buyers with a completed pickup can leave a rating.</p>
    </section>
  );
}
