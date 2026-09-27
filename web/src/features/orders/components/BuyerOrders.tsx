"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, RefreshCw, ShoppingBag, Store } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/src/lib/api";
import type { BuyerOrder } from "@/src/features/marketplace/types";
import { PageContainer } from "@/src/components/PageContainer";
import { listBuyerOrders } from "../api/orders";
import { OrderCard } from "./OrderCard";

type OrderTab = "all" | "pending" | "completed" | "archived";

export function BuyerOrders() {
  const checkoutId = useSearchParams()?.get("checkout");
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<OrderTab>("all");

  async function load(cursor?: string) {
    if (cursor) setLoadingMore(true); else setLoading(true);
    setError("");
    try {
      const result = await listBuyerOrders(cursor);
      setOrders((current) => cursor ? [...current, ...result.orders] : result.orders);
      setNextCursor(result.nextCursor);
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 401) window.location.assign("/login?next=/orders");
      else setError(reason instanceof ApiError ? reason.message : "We could not load your reservations.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const counts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    completed: orders.filter((o) => o.status === "completed").length,
    archived: orders.filter((o) => o.status === "cancelled" || o.status === "expired").length,
  }), [orders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "pending") return orders.filter((o) => o.status === "pending");
    if (activeTab === "completed") return orders.filter((o) => o.status === "completed");
    if (activeTab === "archived") return orders.filter((o) => o.status === "cancelled" || o.status === "expired");
    return orders;
  }, [orders, activeTab]);

  return (
    <main className="min-h-[calc(100vh-72px)] bg-agrivive-background py-8 text-foreground">
      <PageContainer>
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-agrivive-sage/40 bg-white px-3 py-1 text-xs font-semibold text-agrivive-primary">
              <Store className="size-3.5" />
              <span>Davao City Market Pickups</span>
            </div>
            <h1 className="mt-2.5 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Your reservations
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Track active pickup passes and view your purchase history with local stalls.
            </p>
          </div>
          <Link href="/marketplace" className={buttonVariants({ variant: "outline" })}>
            Find more produce<ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </header>

        {checkoutId ? (
          <Alert className="mb-6 border-emerald-200 bg-emerald-50 text-emerald-950">
            <CheckCircle2 className="size-4 text-emerald-700" />
            <AlertTitle>Cart reserved successfully!</AlertTitle>
            <AlertDescription>Each market stall has its own pickup pass and code ready below.</AlertDescription>
          </Alert>
        ) : null}

        {error ? (
          <Alert variant="destructive" className="mb-6">
            <RefreshCw className="size-4" />
            <AlertTitle>Reservations could not load</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button type="button" variant="outline" className="mt-2" onClick={() => void load()}>Try again</Button>
          </Alert>
        ) : null}

        {/* Status Filter Tabs */}
        {!loading && orders.length > 0 ? (
          <nav aria-label="Filter orders by status" className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All reservations", count: counts.all, alert: false },
              { id: "pending", label: "Active pickups", count: counts.pending, alert: counts.pending > 0 },
              { id: "completed", label: "Completed", count: counts.completed, alert: false },
              { id: "archived", label: "Past / Cancelled", count: counts.archived, alert: false },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as OrderTab)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-agrivive-primary text-white shadow-xs"
                    : "border border-border bg-white text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : tab.alert
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-muted text-muted-foreground"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        ) : null}

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((item) => <Skeleton key={item} className="h-36 rounded-2xl bg-white" />)}
          </div>
        ) : null}

        {!loading && !error && filteredOrders.length === 0 ? (
          <Empty className="rounded-2xl border border-border bg-white p-8">
            <EmptyHeader>
              <EmptyMedia variant="icon"><ShoppingBag className="text-agrivive-primary" /></EmptyMedia>
              <EmptyTitle>No reservations found</EmptyTitle>
              <EmptyDescription>
                {activeTab === "pending"
                  ? "You have no pending pickups waiting at the market."
                  : "When you reserve fresh surplus produce, your pickup passes will appear here."}
              </EmptyDescription>
            </EmptyHeader>
            <Link href="/marketplace" className={buttonVariants()}>Browse marketplace</Link>
          </Empty>
        ) : null}

        {!loading && !error && filteredOrders.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)}
            {nextCursor && activeTab === "all" ? (
              <div className="flex justify-center pt-4">
                <Button type="button" variant="outline" disabled={loadingMore} onClick={() => void load(nextCursor)}>
                  {loadingMore ? "Loading reservations…" : "Load more reservations"}
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </PageContainer>
    </main>
  );
}
