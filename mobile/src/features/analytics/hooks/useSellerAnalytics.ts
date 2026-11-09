import { useCallback, useEffect, useState } from "react";
import { fetchSellerAnalytics } from "../api/seller-analytics";
import type { AnalyticsUnit, SellerAnalyticsResponse } from "../types";
import type { DateRange } from "../dateRange";
import { ApiError, logApiError } from "../../../api/client";

export function useSellerAnalytics(range: DateRange, productId?: string, unit?: AnalyticsUnit) {
  const [analytics, setAnalytics] = useState<SellerAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      setAnalytics(await fetchSellerAnalytics({ from: range.from, to: range.to, productId, unit }));
    } catch (err: any) {
      logApiError("Failed to load seller analytics", err);
      if (err instanceof ApiError && [401, 403].includes(err.statusCode)) setAnalytics(null);
      setError(err?.message || "Could not load analytics. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [range.from, range.to, productId, unit]);

  useEffect(() => {
    void load();
  }, [load]);

  return { analytics, loading, refreshing, error, refresh: () => load(true) };
}
