"use client";

import { Breadcrumbs } from "@/src/components/Breadcrumbs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, isAbortError, isTrustAccessMessage } from "@/src/lib/api";
import { authClient } from "@/src/lib/auth-client";
import { usePolling } from "@/src/lib/usePolling";
import type { BuyerOrder, MarketplaceProduct } from "@/src/features/marketplace/types";
import { getMarketplaceProduct } from "@/src/features/marketplace/api/marketplace";
import { getBuyerOrder } from "../api/orders";
import { OrderQr } from "./OrderQr";
import { OrderSummaryHeader } from "./OrderSummaryHeader";
import { OrderPaymentBreakdown } from "./OrderPaymentBreakdown";
import { OrderReviews } from "./OrderReviews";
import { OrderPickupStepper } from "./OrderPickupStepper";
import { OrderSellerCard } from "./OrderSellerCard";
import { OrderItemsCard } from "./OrderItemsCard";
import { OrderReportModal } from "./OrderReportModal";
import { OrderMessages } from "./OrderMessages";
import { OrderCancellation } from "./OrderCancellation";
import { TrustAccessNotice } from "@/src/features/trust/components/TrustAccessNotice";

export function OrderDetail() {
  const router = useRouter();
  const id = useParams<{ id: string }>()?.id ?? "";
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const accountId = session?.user?.id ?? null;
  const [order, setOrder] = useState<BuyerOrder | null>(null);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const lastOrder = useRef<BuyerOrder | null>(null);
  const loadRun = useRef(0);
  const loadedAccount = useRef<string | null>(null);

  const load = useCallback(async () => {
    const run = ++loadRun.current;
    setLoading(!lastOrder.current);
    setError("");
    if (!lastOrder.current) setProducts([]);
    try {
      const loaded = await getBuyerOrder(id);
      if (run !== loadRun.current) return;
      lastOrder.current = loaded;
      setOrder(loaded);
      setLastUpdated(new Date());
      const listingDetails = await Promise.all(
        loaded.items.map(async (item) => {
          try { return await getMarketplaceProduct(item.productId); } catch { return null; }
        }),
      );
      if (run !== loadRun.current) return;
      setProducts(listingDetails.filter((item): item is MarketplaceProduct => item !== null));
    } catch (reason) {
      if (run !== loadRun.current) return;
      if (reason instanceof ApiError && [401, 403].includes(reason.status)) {
        lastOrder.current = null; setOrder(null); setProducts([]);
        if (reason.status === 401) router.replace(`/login?next=${encodeURIComponent(`/orders/${id}`)}`);
        else setError(reason.message);
      } else setError(reason instanceof ApiError ? reason.message : "We could not load this reservation.");
    } finally {
      if (run === loadRun.current) setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (sessionPending) return;
    if (!accountId) {
      loadRun.current++; loadedAccount.current = null; lastOrder.current = null; setOrder(null); setProducts([]);
      router.replace(`/login?next=${encodeURIComponent(`/orders/${id}`)}`);
      return;
    }
    loadedAccount.current = accountId; lastOrder.current = null; setOrder(null); setProducts([]); setLastUpdated(null);
    void load();
    return () => { loadRun.current++; };
  }, [accountId, sessionPending, load, router, id]);

  const refreshPendingOrder = useCallback(async (signal: AbortSignal) => {
    const latest = await getBuyerOrder(id, signal);
    lastOrder.current = latest; setOrder(latest); setLastUpdated(new Date()); setError("");
  }, [id]);

  usePolling(refreshPendingOrder, {
    enabled: Boolean(order?.status === "pending" && !loading),
    intervalMs: 15_000,
    runImmediately: false,
    onError: (reason) => {
      if (isAbortError(reason)) return;
      if (reason instanceof ApiError && [401, 403].includes(reason.status)) {
        lastOrder.current = null; setOrder(null); setProducts([]);
        if (reason.status === 401) router.replace(`/login?next=${encodeURIComponent(`/orders/${id}`)}`);
        else setError(reason.message);
        return;
      }
      setError(reason instanceof ApiError ? reason.message : "We could not refresh this reservation.");
    },
    shouldStop: (reason) => reason instanceof ApiError && [401, 403, 404].includes(reason.status),
  });

  if ((loading && !order) || (order && order.id !== id) || (order && (sessionPending || !accountId || loadedAccount.current !== accountId))) {
    return <main className="min-h-screen bg-[#FDFDFD] p-6"><div className="mx-auto max-w-7xl"><Skeleton className="h-[540px] rounded-[16px] border border-[#E8E8E8] bg-white" /></div></main>;
  }
  if (error && !order) {
    return (
      <main className="min-h-screen bg-[#FDFDFD] p-6">
        <div className="mx-auto max-w-7xl">
          {isTrustAccessMessage(error) ? <TrustAccessNotice message={error} /> : <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <Button type="button" variant="outline" className="mt-4 min-h-[40px] rounded-xl border-[#E8E8E8]" onClick={() => void load()}>Try again</Button>
        </div>
      </main>
    );
  }
  if (!order) return null;

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#FDFDFD] px-6 py-6 text-foreground">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs items={[{ label: "Orders", href: "/orders" }, { label: "Order details" }]} />

        <div className="mt-4"><OrderSummaryHeader order={order} /></div>

        {error ? (
          <div className="mt-4">
            {isTrustAccessMessage(error) ? <TrustAccessNotice message={error} /> : <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="flex flex-col gap-5 lg:col-span-2">
            <OrderPickupStepper
              status={order.status}
              createdAt={order.createdAt}
              expiresAt={order.expiresAt}
              shopName={products[0]?.seller.shopName}
              cancellationReason={order.cancellationReason}
            />
            <OrderItemsCard items={order.items} status={order.status} />
            <OrderSellerCard order={order} product={products[0]} />
            <OrderMessages orderId={order.id} refreshKey={lastUpdated?.getTime() ?? 0} />
            {order.status === "completed" ? <OrderReviews order={order} /> : null}

            <div className="flex items-center justify-between px-1 pt-2">
              <OrderCancellation
                order={order}
                onCancelled={(updated) => { lastOrder.current = updated; setOrder(updated); }}
                onAuthorizationFailure={(status) => {
                  lastOrder.current = null; setOrder(null); setProducts([]);
                  if (status === 401) router.replace(`/login?next=${encodeURIComponent(`/orders/${id}`)}`);
                  else setError("Account is temporarily restricted");
                }}
              />
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
              >
                <AlertTriangle className="size-3.5 text-neutral-400" />
                <span>Report an issue with this order</span>
              </button>
            </div>

            <OrderReportModal orderId={order.id} isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
          </section>

          <aside className="flex flex-col gap-5 lg:col-span-1">
            <div className="sticky top-6 flex flex-col gap-5">
              <OrderQr payload={order.qrPayload} status={order.status} orderId={order.id} shopName={products[0]?.seller.shopName} totalAmount={order.totalAmount} />
              <OrderPaymentBreakdown order={order} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
