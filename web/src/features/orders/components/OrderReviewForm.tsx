"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Camera } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RatingPicker } from "@/src/components/RatingStars";
import { ApiError } from "@/src/lib/api";
import type { BuyerOrderReview } from "@/src/features/marketplace/types";
import { createBuyerOrderReview, editBuyerOrderReview, uploadBuyerReviewPhoto } from "../api/orders";

const photoTypes = ["image/jpeg", "image/png", "image/webp"];
const maxPhotoBytes = 5 * 1024 * 1024;

type Props = {
  orderId: string;
  existing: BuyerOrderReview | null;
  onSaved: (review: BuyerOrderReview, notice?: string) => void;
  onDuplicate: () => void;
  onCancel?: () => void;
};

/** One screen: product stars, service stars, one optional comment, one optional photo. */
export function OrderReviewForm({ orderId, existing, onSaved, onDuplicate, onCancel }: Props) {
  const [productRating, setProductRating] = useState(existing?.productRating ?? 0);
  const [serviceRating, setServiceRating] = useState(existing?.serviceRating ?? 0);
  const [comment, setComment] = useState(existing?.review ?? "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState<{ product?: string; service?: string; photo?: string; form?: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!photo) { setPreview(""); return; }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  function choosePhoto(file: File | undefined) {
    if (!file) { setPhoto(null); return; }
    if (!photoTypes.includes(file.type)) { setPhoto(null); setErrors((e) => ({ ...e, photo: "Use a JPG, PNG, or WebP photo." })); return; }
    if (file.size > maxPhotoBytes) { setPhoto(null); setErrors((e) => ({ ...e, photo: "Use a photo under 5 MB." })); return; }
    setErrors((e) => ({ ...e, photo: undefined }));
    setPhoto(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const next = {
      product: productRating < 1 ? "Pick a star rating for the produce." : undefined,
      service: serviceRating < 1 ? "Pick a star rating for the seller." : undefined,
    };
    if (next.product || next.service) { setErrors(next); return; }
    setSaving(true);
    setErrors({});
    const input = { productRating, serviceRating, review: comment.trim() };
    let saved: BuyerOrderReview;
    try {
      saved = existing ? await editBuyerOrderReview(orderId, input) : await createBuyerOrderReview(orderId, input);
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 409) {
        setErrors({ form: "This review was already sent. We’re refreshing it." });
        onDuplicate();
      } else {
        setErrors({ form: reason instanceof ApiError ? reason.message : "We could not save your review. Try again." });
      }
      setSaving(false);
      return;
    }
    if (photo) {
      try {
        saved = await uploadBuyerReviewPhoto(orderId, photo);
      } catch (reason) {
        onSaved(saved, `Your review is saved, but the photo was not. ${reason instanceof ApiError ? reason.message : "Try adding it again."}`);
        return;
      }
    }
    onSaved(saved);
  }

  const shownPhoto = preview || existing?.photoUrl || "";
  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5" noValidate>
      <div>
        <RatingPicker value={productRating} onChange={(value) => { setProductRating(value); setErrors((e) => ({ ...e, product: undefined })); }} label="How was the produce?" />
        {errors.product ? <p role="alert" className="mt-1 text-xs text-destructive">{errors.product}</p> : null}
      </div>
      <div>
        <RatingPicker value={serviceRating} onChange={(value) => { setServiceRating(value); setErrors((e) => ({ ...e, service: undefined })); }} label="How was the seller?" />
        <p className="mt-1 text-xs text-muted-foreground">Think about pickup, talking with the seller, and whether your order was right.</p>
        {errors.service ? <p role="alert" className="mt-1 text-xs text-destructive">{errors.service}</p> : null}
      </div>
      <div>
        <label className="block text-xs font-semibold text-foreground" htmlFor={`review-comment-${orderId}`}>
          Comment <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id={`review-comment-${orderId}`}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={2000}
          rows={3}
          placeholder="Share a few words about your pickup"
          className="mt-1 w-full resize-y rounded-xl border border-[#E8E8E8] bg-white px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00]/20 focus-visible:border-[#457D00]"
        />
      </div>
      <div>
        <label htmlFor={`review-photo-${orderId}`} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#E8E8E8] bg-white px-4 text-sm font-semibold text-foreground hover:bg-muted">
          <Camera aria-hidden="true" className="size-4" />
          {shownPhoto ? "Change photo" : "Add a photo"} <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input id={`review-photo-${orderId}`} type="file" accept={photoTypes.join(",")} className="sr-only" onChange={(event) => choosePhoto(event.target.files?.[0])} />
        {shownPhoto ? <img src={shownPhoto} alt="Your review photo" className="mt-3 h-32 w-32 rounded-xl border border-[#E8E8E8] object-cover" /> : null}
        {errors.photo ? <p role="alert" className="mt-1 text-xs text-destructive">{errors.photo}</p> : null}
      </div>
      {errors.form ? <Alert variant="destructive" className="text-xs"><AlertDescription>{errors.form}</AlertDescription></Alert> : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving} className="min-h-12 h-12 rounded-xl bg-[#457D00] px-6 text-[14px] font-semibold text-white hover:bg-[#457D00]/90 active:translate-y-px">
          {saving ? "Saving…" : existing ? "Save changes" : "Post review"}
        </Button>
        {onCancel ? <Button type="button" variant="outline" onClick={onCancel} className="min-h-12 h-12 rounded-xl px-6 text-[14px]">Cancel</Button> : null}
      </div>
    </form>
  );
}
