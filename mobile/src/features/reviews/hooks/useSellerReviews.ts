import { useCallback, useEffect, useState } from "react";
import {
  fetchSellerReviewsList,
  replyToReview,
} from "../api/seller-reviews";
import type { ReviewFilter, ReviewItem, ReviewKind, ReviewsSummary } from "../types";

export function useSellerReviews() {
  const [summary, setSummary] = useState<ReviewsSummary>({
    count: 0,
    average: null,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    unansweredCount: 0,
  });
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<ReviewKind>("pickup");
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetchSellerReviewsList({
        kind,
        filter,
        rating: selectedRating,
      });
      setSummary(res.summary);
      setReviews(res.reviews);
    } catch (err: any) {
      setError(err?.message || "Could not load ratings and reviews.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [kind, filter, selectedRating]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const submitReply = async (reviewId: string, replyText: string) => {
    const res = await replyToReview(reviewId, replyText, kind);
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, sellerResponse: res.sellerResponse } : r)),
    );
    setSummary((prev) => ({
      ...prev,
      unansweredCount: Math.max(0, prev.unansweredCount - 1),
    }));
  };

  return {
    summary,
    reviews,
    loading,
    refreshing,
    error,
    kind,
    setKind,
    filter,
    setFilter,
    selectedRating,
    setSelectedRating,
    refresh: () => loadData(true),
    submitReply,
  };
}
