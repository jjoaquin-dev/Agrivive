"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { isAbortError } from "@/src/lib/api";
import { getSellerReviews } from "../api/marketplace";

/** Seller-only rating pill shown beside the stall name. Hidden until the seller has a rating. */
export function SellerRatingPill({ sellerId }: { sellerId: string }) {
  const [average, setAverage] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getSellerReviews(sellerId, controller.signal)
      .then((res) => { setAverage(res.average); setCount(res.count); })
      .catch((err) => { if (!isAbortError(err)) setAverage(null); });
    return () => controller.abort();
  }, [sellerId]);

  if (!average || count === 0) return null;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-[#FFF9EE] px-2.5 py-1 text-xs font-bold text-[#8C5300]"
      aria-label={`Seller rating ${Number(average).toFixed(1)} out of 5 from ${count} ${count === 1 ? "review" : "reviews"}`}
    >
      <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
      {Number(average).toFixed(1)}
    </span>
  );
}
