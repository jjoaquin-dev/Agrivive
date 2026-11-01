import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchSellerWeightedVisibility, type SellerVisibilityItem } from "../api/seller-visibility";

/** The Visibility Guide list: fetched once, sorted by score, paged in slices. */
export function useVisibilityGuide() {
  const [list, setList] = useState<SellerVisibilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState(3);
  const [page, setPage] = useState(1);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchSellerWeightedVisibility();
      setList(response.weightedSurplus || []);
    } catch (reason: any) {
      setError(reason?.message || "Could not load the Visibility Guide.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  const sorted = useMemo(() => [...list].sort((a, b) => {
    const scoreA = a.score ?? -1;
    const scoreB = b.score ?? -1;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return (a.rank ?? 999) - (b.rank ?? 999);
  }), [list]);

  const pageItems = useMemo(() => sorted.slice((page - 1) * pageSize, page * pageSize), [sorted, page, pageSize]);

  return { items: pageItems, total: sorted.length, loading, error, reload, page, setPage, pageSize, setPageSize };
}
