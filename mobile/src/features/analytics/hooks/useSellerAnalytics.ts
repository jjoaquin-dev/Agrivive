import { useCallback, useEffect, useState } from "react";
import { fetchSellerAnalytics } from "../api/seller-analytics";
import type { AnalyticsUnit, SellerAnalyticsResponse } from "../types";

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getAnalyticsRange(days: number) {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  return { from: dateOnly(start), to: dateOnly(end) };
}

export function useSellerAnalytics(days: number, productId?: string, unit?: AnalyticsUnit) {
  const [analytics, setAnalytics] = useState<SellerAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      setAnalytics(await fetchSellerAnalytics({ ...getAnalyticsRange(days), productId, unit }));
    } catch (err: any) {
      console.error("Failed to load seller analytics", err);
      setError(err?.message || "Could not load analytics. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [days, productId, unit]);

  useEffect(() => {
    void load();
  }, [load]);

  return { analytics, loading, refreshing, error, refresh: () => load(true) };
}
