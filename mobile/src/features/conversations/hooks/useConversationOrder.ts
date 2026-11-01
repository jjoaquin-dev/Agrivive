import { useCallback, useEffect, useState } from "react";
import { fetchSellerOrder } from "../../orders/api/seller-orders";
import type { SellerOrder } from "../../orders/types";

export function useConversationOrder(orderId?: string | null) {
  const [order, setOrder] = useState<SellerOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!orderId) {
      setOrder(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSellerOrder(orderId);
      setOrder(data);
    } catch (err: any) {
      setError(err?.message || "Could not load order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { order, loading, error, refresh: load };
}
