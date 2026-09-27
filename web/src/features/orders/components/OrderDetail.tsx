"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, isAbortError } from "@/src/lib/api";
import { usePolling } from "@/src/lib/usePolling";
import type { BuyerOrder, MarketplaceProduct } from "@/src/features/marketplace/types";
import { getMarketplaceProduct } from "@/src/features/marketplace/api/marketplace";
import { PageContainer } from "@/src/components/PageContainer";
import { cancelBuyerOrder, getBuyerOrder } from "../api/orders";
import { OrderQr } from "./OrderQr";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderReviews } from "./OrderReviews";
import { OrderPickupStepper } from "./OrderPickupStepper";
import { OrderSellerCard } from "./OrderSellerCard";
import { OrderItemsCard } from "./OrderItemsCard";
import { OrderReportModal } from "./OrderReportModal";

export function OrderDetail() {
  const router = useRouter();
  const id = useParams<{ id: string }>()?.id ?? "";
  const [order, setOrder] = useState<BuyerOrder | null>(null);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [error, setError] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setProducts([]);
    try {
      const loaded = await getBuyerOrder(id);
      setOrder(loaded);
      setLastUpdated(new Date());
      const listingDetails = await Promise.all(loaded.items.map(async (item) => {
        try { return await getMarketplaceProduct(item.productId); } catch { return null; }
      }));
      setProducts(listingDetails.filter((item): item is MarketplaceProduct => item !== null));
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 401) router.replace(`/login?next=${encodeURIComponent(`/orders/${id}`)}`);
      else setError(reason instanceof ApiError ? reason.message : "We could not load this reservation.");
    } finally { setLoading(false); }
  }, [id, router]);

  useEffect(() => { void load(); }, [load]);

  const refreshPendingOrder = useCallback(async (signal: AbortSignal) => {
    const latest = await getBuyerOrder(id, signal);
    setOrder(latest);
    setLastUpdated(new Date());
    setError("");
  }, [id]);

  usePolling(refreshPendingOrder, {
    enabled: Boolean(order?.status === "pending" && !loading),
    intervalMs: 15_000,
    runImmediately: false,
    onError: (reason) => { if (!isAbortError(reason)) setError(reason instanceof ApiError ? reason.message : "We could not refresh this reservation."); },
    shouldStop: (reason) => reason instanceof ApiError && [401, 403, 404].includes(reason.status),
  });

  async function handleCancel() {
    if (!order || order.status !== "pending") return;
    setCancelling(true);
    setError("");
    try {
      setOrder(await cancelBuyerOrder(order.id));
      setShowCancelConfirm(false);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "We could not cancel this reservation. Try again.");
    } finally { setCancelling(false); }
  }

  if (loading) return <main className="min-h-screen bg-agrivive-background p-6"><PageContainer><Skeleton className="h-[540px] rounded-2xl bg-white" /></PageContainer></main>;
  if (error && !order) return <main className="min-h-screen bg-agrivive-background p-6"><PageContainer><Alert variant="destructive"><AlertDescription>{error}</AlertDescription><Button type="button" variant="outline" className="mt-2" onClick={() => void load()}>Try again</Button></Alert></PageContainer></main>;
  if (!order) return null;

  const first = order.items[0];
  const product = products[0];
  const title = order.items.length > 1 ? `${order.items.length} produce items reserved` : first?.productName || "Produce reservation";

  return (
    <main className="min-h-[calc(100vh-72px)] bg-agrivive-background py-8 text-foreground">
      <PageContainer>
        <Link href="/orders" className={`${buttonVariants({ variant: "ghost", size: "sm" })} -ml-3 text-muted-foreground hover:text-foreground`}>
          <ArrowLeft aria-hidden="true" className="size-4" />Back to reservations
        </Link>
        <header className="mt-3 flex flex-col justify-between gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-start">
          <div>
            <p className="font-mono text-xs font-semibold text-agrivive-terracotta">AGR-{order.id.slice(0, 6).toUpperCase()}</p>
            <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            {lastUpdated ? (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Updated {lastUpdated.toLocaleTimeString("en-PH")}{order.status === "pending" ? " · Auto-updating status" : ""}
              </p>
            ) : null}
          </div>
          <OrderStatusBadge status={order.status} />
        </header>

        {error ? <Alert variant="destructive" className="mt-5"><AlertDescription>{error}</AlertDescription></Alert> : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="flex flex-col gap-6">
            <OrderPickupStepper status={order.status} createdAt={order.createdAt} expiresAt={order.expiresAt} />

            <div className="lg:hidden">
              <OrderQr payload={order.qrPayload} status={order.status} orderId={order.id} shopName={product?.seller.shopName} />
            </div>

            <OrderItemsCard items={order.items} />
            <OrderSellerCard order={order} product={product} />

            {order.status === "completed" ? <OrderReviews order={order} /> : null}

            {order.status === "pending" ? (
              <div className="pt-2">
                {!showCancelConfirm ? (
                  <Button type="button" variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setShowCancelConfirm(true)}>
                    Cancel reservation
                  </Button>
                ) : (
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <h3 className="font-heading font-bold text-destructive">Cancel this reservation?</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          If you cancel, your reserved produce will go back to the store so someone else can buy it. You cannot undo this.
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <Button type="button" variant="destructive" onClick={() => void handleCancel()} disabled={cancelling}>
                            {cancelling ? "Cancelling…" : "Yes, cancel reservation"}
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setShowCancelConfirm(false)} disabled={cancelling}>
                            Keep reservation
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div className="border-t pt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-destructive"
                onClick={() => setShowReportModal(true)}
              >
                <AlertTriangle className="size-4 text-amber-600" />
                Report an issue with this order
              </Button>
            </div>

            <OrderReportModal
              orderId={order.id}
              isOpen={showReportModal}
              onClose={() => setShowReportModal(false)}
            />
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <OrderQr payload={order.qrPayload} status={order.status} orderId={order.id} shopName={product?.seller.shopName} />
            </div>
          </aside>
        </div>
      </PageContainer>
    </main>
  );
}
