import { useCallback, useRef, useState } from "react";
import { fetchSellerBoostHistory } from "../api/visibility-boosts";
import type { SellerVisibilityBoost } from "../types";

/** Boost history pages, shared by the Active and History sections so there is one fetch. */
export function useBoostHistory() {
  const [items, setItems] = useState<SellerVisibilityBoost[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const cursorRef = useRef<string | null>(null);

  const load = useCallback(async (reset = true) => {
    if (reset) { setLoading(true); setError(""); }
    else setLoadingMore(true);
    try {
      const response = await fetchSellerBoostHistory({ limit: 20, cursor: reset ? undefined : cursorRef.current ?? undefined });
      setItems((previous) => (reset ? response.items : [...previous, ...response.items]));
      cursorRef.current = response.nextCursor ?? null;
      setNextCursor(cursorRef.current);
    } catch (reason: any) {
      setError(reason?.message || "Could not load boost history.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (cursorRef.current && !loadingMore && !loading) void load(false);
  }, [load, loading, loadingMore]);

  return { items, nextCursor, loading, loadingMore, error, reload: () => load(true), loadMore };
}
