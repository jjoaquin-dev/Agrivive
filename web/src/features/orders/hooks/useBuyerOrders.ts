"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { authClient } from "@/src/lib/auth-client";
import { ApiError } from "@/src/lib/api";
import type { BuyerOrder } from "@/src/features/marketplace/types";
import { listBuyerOrders } from "../api/orders";

export function useBuyerOrders() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id ?? null;
  const currentUser = useRef(userId);
  currentUser.current = userId;
  const generation = useRef(0);
  const cache = useRef<BuyerOrder[]>([]);
  const cacheOwner = useRef<string | null>(null);
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [owner, setOwner] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (cursor?: string) => {
    const requestedBy = currentUser.current;
    if (!requestedBy) return;
    const requestGeneration = generation.current;
    if (cursor) setLoadingMore(true);
    else setLoading(cacheOwner.current !== requestedBy || cache.current.length === 0);
    setError("");
    try {
      const result = await listBuyerOrders(cursor);
      if (requestedBy !== currentUser.current || requestGeneration !== generation.current) return;
      const updated = cursor ? [...cache.current, ...result.orders] : result.orders;
      cache.current = updated;
      cacheOwner.current = requestedBy;
      setOrders(updated);
      setOwner(requestedBy);
      setNextCursor(result.nextCursor);
    } catch (reason) {
      if (requestedBy !== currentUser.current || requestGeneration !== generation.current) return;
      if (reason instanceof ApiError && [401, 403].includes(reason.status)) {
        cache.current = [];
        cacheOwner.current = null;
        setOrders([]);
        setOwner(null);
        setNextCursor(null);
        if (reason.status === 401) window.location.assign("/login?next=/orders");
        else setError("You no longer have access to these reservations.");
      } else setError(reason instanceof ApiError ? reason.message : "We could not load your reservations.");
    } finally {
      if (requestedBy === currentUser.current && requestGeneration === generation.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isPending) return;
    generation.current++;
    cache.current = [];
    cacheOwner.current = null;
    setOrders([]);
    setOwner(null);
    setNextCursor(null);
    if (!userId) {
      window.location.assign("/login?next=/orders");
      return;
    }
    void load();
  }, [userId, isPending, load]);

  return { orders: owner === userId ? orders : [], nextCursor, loading, loadingMore, error, load };
}
