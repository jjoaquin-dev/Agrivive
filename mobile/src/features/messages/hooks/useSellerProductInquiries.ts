import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { fetchSellerProductInquiries, replyToProductInquiry } from "../api/product-inquiries";
import type { SellerMessageFilter, SellerProductInquiryItem } from "../types";

export function useSellerProductInquiries() {
  const [filter, setFilter] = useState<SellerMessageFilter>("open");
  const [inquiries, setInquiries] = useState<SellerProductInquiryItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (reset = true) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const response = await fetchSellerProductInquiries({
        status: filter,
        limit: 20,
        cursor: reset ? undefined : nextCursor ?? undefined,
      });
      setInquiries((previous) => (reset ? response.items : [...previous, ...response.items]));
      setNextCursor(response.nextCursor);
    } catch (err: any) {
      console.error("Failed to load seller product inquiries", err);
      setError(err?.message || "Could not load listing questions.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [filter, nextCursor]);

  useFocusEffect(
    useCallback(() => {
      void load(true);
    }, [filter])
  );

  const refresh = useCallback(() => {
    setRefreshing(true);
    setNextCursor(null);
    void load(true);
  }, [load]);

  const loadMore = useCallback(() => {
    if (!nextCursor || loadingMore || loading) return;
    void load(false);
  }, [load, loading, loadingMore, nextCursor]);

  const reply = useCallback(async (inquiryId: string, text: string) => {
    setReplyingId(inquiryId);
    try {
      await replyToProductInquiry(inquiryId, text);
      const now = new Date().toISOString();
      setInquiries((prev) =>
        prev
          .map((item) =>
            item.id === inquiryId
              ? { ...item, reply: text, repliedAt: now }
              : item
          )
          .filter((item) => (filter === "open" ? !item.reply : true))
      );
    } finally {
      setReplyingId(null);
    }
  }, [filter]);

  return {
    filter,
    setFilter: (value: SellerMessageFilter) => {
      setNextCursor(null);
      setFilter(value);
    },
    inquiries,
    loading,
    refreshing,
    loadingMore,
    replyingId,
    error,
    refresh,
    loadMore,
    reply,
  };
}
