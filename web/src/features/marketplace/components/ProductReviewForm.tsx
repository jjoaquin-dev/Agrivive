"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RatingPicker, RatingStars } from "@/src/components/RatingStars";
import { ApiError } from "@/src/lib/api";
import type { ProductReviewEligibility } from "../types";
import { createProductReview } from "../api/marketplace";

type Purchase = ProductReviewEligibility["purchases"][number];

export function ProductReviewForm({ purchase, productId, onSaved }: { purchase: Purchase; productId: string; onSaved: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(purchase.review);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setSaved(purchase.review), [purchase.review]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating < 1 || saving) return;
    setSaving(true);
    setError("");
    try {
      const result = await createProductReview(productId, purchase.orderId, purchase.itemId, rating, comment.trim());
      setSaved(result);
      onSaved();
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 409) {
        setError("This product was already reviewed. We’re checking your review.");
        onSaved();
      } else {
        setError(reason instanceof ApiError ? reason.message : "We could not save your review. Try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Rate this product: {purchase.productName}</CardTitle>
      </CardHeader>
      <CardContent>
        {saved ? (
          <div role="status" className="flex items-start gap-3">
            <Star aria-hidden="true" className="mt-0.5 size-5 shrink-0 fill-amber-400 text-amber-400" />
            <div>
              <p className="font-semibold">Your rating</p>
              <div className="mt-1"><RatingStars rating={saved.rating} /></div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{saved.review || "No comment added."}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={(event) => void submit(event)} className="space-y-4">
            <RatingPicker value={rating} onChange={setRating} label="Your rating" />
            <div>
              <label className="block text-sm font-medium" htmlFor={`product-review-${purchase.itemId}`}>
                Comment <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id={`product-review-${purchase.itemId}`}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                maxLength={2000}
                rows={3}
                placeholder="Share a few words about this product"
                className="mt-2 w-full resize-y rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>
            {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
            <Button type="submit" disabled={rating < 1 || saving}>
              {saving ? "Saving…" : "Post product review"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
