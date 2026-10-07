import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { fetchSellerTrust, requestTrustCorrection } from "../api/seller-trust";
import type { SellerTrustResponse } from "../types";
import { ApiError } from "../../../api/client";

export function useSellerTrust() {
  const [trust, setTrust] = useState<SellerTrustResponse>({ events: [], notices: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      setTrust(await fetchSellerTrust());
    } catch (err: any) {
      if (err instanceof ApiError && [401, 403].includes(err.statusCode)) {
        setTrust({ events: [], notices: [] });
      }
      setError(err?.message || "Could not load trust history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    void load();
  }, [load]));

  const requestCorrection = useCallback(async (eventId: string, reason: string) => {
    await requestTrustCorrection(eventId, reason);
    await load(true);
  }, [load]);

  return { trust, loading, refreshing, error, refresh: () => load(true), requestCorrection };
}
