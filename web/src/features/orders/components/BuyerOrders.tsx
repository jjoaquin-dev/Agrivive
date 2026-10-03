"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, RefreshCw, Search, ShoppingBag } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/src/lib/api";
import type { BuyerOrder } from "@/src/features/marketplace/types";
import { PageContainer } from "@/src/components/PageContainer";
import { listBuyerOrders } from "../api/orders";
import { OrderCard } from "./OrderCard";
import { OrderFilterTabs, type OrderTab } from "./OrderFilterTabs";

type SortOption = "newest" | "oldest" | "highest" | "lowest";

export function BuyerOrders() {
  const checkoutId = useSearchParams()?.get("checkout");
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<OrderTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  async function load(cursor?: string) {
    if (cursor) setLoadingMore(true); else setLoading(true);
    setError("");
    try {
      const result = await listBuyerOrders(cursor);
      setOrders((current) => (cursor ? [...current, ...result.orders] : result.orders));
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
    let result = orders;
    if (activeTab === "pending") result = result.filter((o) => o.status === "pending");
    else if (activeTab === "completed") result = result.filter((o) => o.status === "completed");
    else if (activeTab === "archived") result = result.filter((o) => o.status === "cancelled" || o.status === "expired");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((o) =>
        o.id.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q) ||
        o.items.some((item) => item.productName.toLowerCase().includes(q))
      );
    }

    return [...result].sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "highest") return Number(b.totalAmount) - Number(a.totalAmount);
      if (sortBy === "lowest") return Number(a.totalAmount) - Number(b.totalAmount);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders, activeTab, searchQuery, sortBy]);

  return (
    <main className="min-h-[calc(100vh-72px)] bg-agrivive-background py-6 text-foreground sm:py-8 lg:py-10">
      <PageContainer>
        {/* Header matching reference */}
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              All Orders
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Check all orders and reservations at a single place. It&apos;s easy to manage.
            </p>
          </div>
          <Link href="/marketplace" className={buttonVariants({ className: "min-h-11 rounded-xl px-5 font-semibold" })}>
            Browse marketplace<ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </header>

        {checkoutId ? (
          <Alert className="mb-6 border-emerald-200 bg-emerald-50 text-emerald-950">
            <CheckCircle2 className="size-4 text-emerald-700" />
            <AlertTitle>Cart reserved successfully!</AlertTitle>
            <AlertDescription>Your pickup pass and QR code are ready below.</AlertDescription>
          </Alert>
        ) : null}

        {error ? (
          <Alert variant="destructive" className="mb-6">
            <RefreshCw className="size-4" />
            <AlertTitle>Orders could not load</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button type="button" variant="outline" className="mt-2" onClick={() => void load()}>Try again</Button>
          </Alert>
        ) : null}

        {/* Tab Navigation with Underline Indicator */}
        <OrderFilterTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

        {/* Search & Sort Toolbar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, produce name, status…"
              className="h-11 w-full rounded-xl border border-input bg-white pl-10 pr-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agrivive-sage"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="order-sort-select" className="text-xs font-semibold text-muted-foreground">
              Sort By:
            </label>
            <select
              id="order-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-11 rounded-xl border border-input bg-white px-3 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agrivive-sage"
            >
              <option value="newest">New Order</option>
              <option value="oldest">Oldest Order</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Table Column Headers (Desktop) */}
        <div className="mb-2 hidden grid-cols-[1.5fr_0.8fr_1fr_1.2fr_1fr] items-center px-5 py-2.5 text-xs font-semibold text-muted-foreground md:grid">
          <div className="flex items-center gap-2">
            <span className="size-4 rounded border border-border/80 bg-muted/30" aria-hidden="true" />
            <span>Product</span>
          </div>
          <div>Price</div>
          <div>Payment</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {/* Order Cards List */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((item) => <Skeleton key={item} className="h-44 rounded-2xl bg-white" />)}
          </div>
        ) : filteredOrders.length === 0 ? (
          <Empty className="rounded-[20px] border border-border/80 bg-white p-8 shadow-xs">
            <EmptyHeader>
              <EmptyMedia variant="icon"><ShoppingBag className="text-agrivive-primary" /></EmptyMedia>
              <EmptyTitle>No orders match</EmptyTitle>
              <EmptyDescription>
                {searchQuery ? "Try a different search query or clear your search." : "No orders found in this category."}
              </EmptyDescription>
            </EmptyHeader>
            <Link href="/marketplace" className={buttonVariants()}>Browse marketplace</Link>
          </Empty>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)}
            {nextCursor && activeTab === "all" ? (
              <div className="flex justify-center pt-4">
                <Button type="button" variant="outline" disabled={loadingMore} onClick={() => void load(nextCursor)} className="min-h-11 rounded-xl px-6 font-semibold">
                  {loadingMore ? "Loading orders…" : "Load more orders"}
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </PageContainer>
    </main>
  );
}
