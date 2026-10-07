"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ApiError, isAbortError } from "@/src/lib/api";
import { authClient } from "@/src/lib/auth-client";
import { listBuyerWishlist, removeBuyerWishlistProduct, saveBuyerWishlistProduct } from "./api/wishlist";

type WishlistContextValue = {
  savedProductIds: ReadonlySet<string>;
  ready: boolean;
  pendingProductIds: ReadonlySet<string>;
  error: string;
  toggleProduct: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() ?? "/marketplace";
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [savedProductIds, setSavedProductIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  const [pendingProductIds, setPendingProductIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  const load = useCallback(async (signal?: AbortSignal) => {
    if (!session?.user) {
      setSavedProductIds(new Set());
      setReady(!sessionPending);
      return;
    }
    setReady(false);
    try {
      const response = await listBuyerWishlist(signal);
      if (!signal?.aborted) {
        setSavedProductIds(new Set(response.productIds));
        setError("");
      }
    } catch (reason) {
      if (!isAbortError(reason) && !signal?.aborted) {
        setError(reason instanceof ApiError ? reason.message : "Saved items could not load.");
      }
    } finally {
      if (!signal?.aborted) setReady(true);
    }
  }, [session?.user, sessionPending]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const toggleProduct = useCallback(async (productId: string) => {
    if (sessionPending || pendingProductIds.has(productId)) return;
    if (!session?.user) {
      const returnPath = `${pathname}${window.location.search}`;
      router.push(`/login?next=${encodeURIComponent(returnPath)}`);
      return;
    }

    const wasSaved = savedProductIds.has(productId);
    setError("");
    setPendingProductIds((current) => new Set(current).add(productId));
    setSavedProductIds((current) => {
      const next = new Set(current);
      if (wasSaved) next.delete(productId);
      else next.add(productId);
      return next;
    });

    try {
      const response = wasSaved
        ? await removeBuyerWishlistProduct(productId)
        : await saveBuyerWishlistProduct(productId);
      setSavedProductIds((current) => {
        const next = new Set(current);
        if (response.saved) next.add(productId);
        else next.delete(productId);
        return next;
      });
    } catch (reason) {
      setSavedProductIds((current) => {
        const next = new Set(current);
        if (wasSaved) next.add(productId);
        else next.delete(productId);
        return next;
      });
      setError(reason instanceof ApiError ? reason.message : "We could not update saved items.");
    } finally {
      setPendingProductIds((current) => {
        const next = new Set(current);
        next.delete(productId);
        return next;
      });
    }
  }, [pathname, pendingProductIds, router, savedProductIds, session?.user, sessionPending]);

  const value = useMemo(() => ({ savedProductIds, ready, pendingProductIds, error, toggleProduct }), [savedProductIds, ready, pendingProductIds, error, toggleProduct]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
      <p className="sr-only" aria-live="polite">{error}</p>
    </WishlistContext.Provider>
  );
}

export function useBuyerWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useBuyerWishlist must be used within WishlistProvider");
  return context;
}

