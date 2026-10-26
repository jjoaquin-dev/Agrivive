"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, RefreshCw, Search, ShoppingBag } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/src/components/PageContainer";
import { isTrustAccessMessage } from "@/src/lib/api";
import { TrustAccessNotice } from "@/src/features/trust/components/TrustAccessNotice";
import { useCart } from "@/src/features/cart/CartProvider";
import { useBuyerOrders } from "../hooks/useBuyerOrders";
import { OrderCard } from "./OrderCard";
import { OrderFilterTabs, type OrderTab } from "./OrderFilterTabs";
import { OrderSortDropdown, type OrderSortOption } from "./OrderSortDropdown";

type SortOption = OrderSortOption;

export function BuyerOrders() {
  const checkoutId = useSearchParams()?.get("checkout");
  const { clear: clearCart } = useCart();
  const { orders, nextCursor, loading, loadingMore, error, load } = useBuyerOrders();
  const [activeTab, setActiveTab] = useState<OrderTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const clearedCheckoutRef = useRef<string | null>(null);

  useEffect(() => {
    if (checkoutId && clearedCheckoutRef.current !== checkoutId) {
      clearedCheckoutRef.current = checkoutId;
      clearCart();
    }
  }, [checkoutId, clearCart]);

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
    <main className="min-h-[calc(100vh-72px)] bg-[#FDFDFD] px-6 py-6 text-foreground">
      <PageContainer className="space-y-6">
        {/* Top Back Navigation Link */}
        <div>
          <Link
            href="/marketplace"
            className="inline-flex min-h-[36px] items-center gap-2 text-[14px] font-medium text-neutral-500 transition-colors hover:text-black cursor-pointer"
          >
            <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />
            <span>Back to Marketplace</span>
          </Link>
        </div>

        {/* Header: 28px bold heading, 16px gap to 12px text */}
        <header>
          <h1 className="font-heading text-[28px] font-bold tracking-tight text-[#14231A] leading-tight">
            All Orders
          </h1>
          <p className="mt-4 text-xs text-[#5F7367]">
            Check all orders and reservations at a single place. It&apos;s easy to manage.
          </p>
        </header>

        {/* Success Banner: 16px separation */}
        {checkoutId ? (
          <div className="mb-4">
            <Alert className="border border-[#E8E8E8] bg-emerald-50/70 text-emerald-950 p-4 rounded-xl shadow-2xs">
              <CheckCircle2 className="size-4 text-emerald-700" />
              <AlertTitle className="text-sm font-semibold">Cart reserved successfully!</AlertTitle>
              <AlertDescription className="text-xs text-emerald-800">Your pickup pass and QR code are ready below.</AlertDescription>
            </Alert>
          </div>
        ) : null}

        {error && isTrustAccessMessage(error) ? <div className="mb-4"><TrustAccessNotice message={error} /></div> : null}
        {error && !isTrustAccessMessage(error) ? (
          <Alert variant="destructive" className="mb-4 border border-rose-200 p-4 rounded-xl">
            <RefreshCw className="size-4" />
            <AlertTitle className="text-sm font-semibold">Orders could not refresh</AlertTitle>
            <AlertDescription className="text-xs">{error}{orders.length ? " Previous reservations are shown below." : ""}</AlertDescription>
            <Button type="button" variant="outline" className="mt-2 h-10 min-h-[40px] text-xs font-semibold" onClick={() => void load()}>Try again</Button>
          </Alert>
        ) : null}

        {/* Tab Navigation: 14px text, 44px height, 16px horizontal padding, 2px active underline */}
        <OrderFilterTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

        {/* Search & Sort: 340px search width, 40px height, 16px gap, responsive wrapping */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full sm:w-[340px]">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5F7367]" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, produce name, status…"
              className="h-10 min-h-[40px] w-full rounded-full border border-[#E8E8E8] bg-white pl-10 pr-4 text-xs sm:text-sm text-[#14231A] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00]/40"
            />
          </div>
          <OrderSortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {/* Order Cards List: 12px vertical spacing between cards */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => <Skeleton key={item} className="h-40 rounded-[16px] bg-white border border-[#E8E8E8]" />)}
          </div>
        ) : filteredOrders.length === 0 ? (
          <Empty className="rounded-[16px] border border-[#E8E8E8] bg-white p-8 shadow-xs">
            <EmptyHeader>
              <EmptyMedia variant="icon"><ShoppingBag className="text-[#457D00]" /></EmptyMedia>
              <EmptyTitle className="text-base font-bold text-[#14231A]">No orders match</EmptyTitle>
              <EmptyDescription className="text-xs text-[#5F7367]">
                {searchQuery ? "Try a different search query or clear your search." : "No orders found in this category."}
              </EmptyDescription>
            </EmptyHeader>
            <Link href="/marketplace" className="h-10 min-h-[40px] px-5 rounded-xl font-semibold text-xs bg-[#457D00] hover:bg-[#386600] text-white inline-flex items-center gap-2 shadow-xs transition active:scale-95">
              Browse marketplace
            </Link>
          </Empty>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)}
            {nextCursor && !error && activeTab === "all" ? (
              <div className="flex justify-center pt-3">
                <Button type="button" variant="outline" disabled={loadingMore} onClick={() => void load(nextCursor)} className="h-10 min-h-[40px] rounded-xl px-6 font-semibold text-xs border border-[#E8E8E8] bg-white hover:bg-neutral-50">
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
