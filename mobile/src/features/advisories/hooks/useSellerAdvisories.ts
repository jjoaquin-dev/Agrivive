import { useCallback, useEffect, useState } from "react";
import { fetchSellerAdvisories } from "../api/seller-advisories";
import type { SellerAdvisoriesResponse } from "../types";

export function useSellerAdvisories() {
  const [advisories, setAdvisories] = useState<SellerAdvisoriesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      setAdvisories(await fetchSellerAdvisories());
    } catch (err: any) {
      console.error("Failed to load seller advisories", err);
      setError(err?.message || "Could not load advisories. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { advisories, loading, refreshing, error, refresh: () => load(true) };
}
