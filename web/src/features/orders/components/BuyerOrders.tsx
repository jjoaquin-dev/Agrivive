"use client";

import { Breadcrumbs } from "@/src/components/Breadcrumbs";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, RefreshCw, Search, ShoppingBag } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/src/components/PageContainer";
import { ApiError, isTrustAccessMessage } from "@/src/lib/api";
import { ConfirmationModalComponent } from "@/src/components/ConfirmationModalComponent";
import { TrustAccessNotice } from "@/src/features/trust/components/TrustAccessNotice";
import { useCart } from "@/src/features/cart/CartProvider";
import { getBuyerProfile } from "@/src/features/profile/api/profile";
import { cancelBuyerOrder } from "../api/orders";
import { useBuyerOrders } from "../hooks/useBuyerOrders";
import { OrderCard } from "./OrderCard";
import { OrderFilterTabs, type OrderTab } from "./OrderFilterTabs";
import { OrderSortDropdown, type OrderSortOption } from "./OrderSortDropdown";
import { OrderCancelToast } from "./OrderCancelToast";
import { OrderSuccessToast } from "./OrderSuccessToast";
import { BuyerTrustBanner } from "./BuyerTrustBanner";
import type { BuyerOrder } from "@/src/features/marketplace/types";

type SortOption = OrderSortOption;

export function BuyerOrders() {
  const checkoutId = useSearchParams()?.get("checkout");
  const { clear: clearCart } = useCart();
  const { orders, nextCursor, loading, loadingMore, error, load, updateOrder } = useBuyerOrders();
  const [activeTab, setActiveTab] = useState<OrderTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [cancellingOrder, setCancellingOrder] = useState<BuyerOrder | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [cancelNotice, setCancelNotice] = useState<string | null>(null);
  const [showCheckoutToast, setShowCheckoutToast] = useState(Boolean(checkoutId));
  const [trustWarning, setTrustWarning] = useState<string | null>(null);
  const [trustRestriction, setTrustRestriction] = useState<string | null>(null);
  const clearedCheckoutRef = useRef<string | null>(null);

  const refreshTrustStatus = () => {
    getBuyerProfile().then((res) => {
      setTrustWarning(res.trustWarning ?? null);
      setTrustRestriction(res.trustRestriction?.message ?? null);
    }).catch(() => {});
  };

  useEffect(() => { refreshTrustStatus(); }, []);

  useEffect(() => {
    if (checkoutId && clearedCheckoutRef.current !== checkoutId) {
      clearedCheckoutRef.current = checkoutId;
      clearCart();
      setShowCheckoutToast(true);
    }
  }, [checkoutId, clearCart]);

  async function handleConfirmCancel() {
    if (!cancellingOrder) return;
    setCancelLoading(true);
    setCancelError("");
    try {
      const updated = await cancelBuyerOrder(cancellingOrder.id);
      updateOrder(updated);
      setCancellingOrder(null);
      setCancelNotice(`Reservation #AGR-${updated.id.slice(0, 8).toUpperCase()} was cancelled.`);
      refreshTrustStatus();
    } catch (reason) {
      setCancelError(reason instanceof ApiError ? reason.message : "We could not cancel this reservation. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  }

  const counts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    completed: orders.filter((o) => o.status === "completed").length,
    archived: orders.filter((o) => o.status === "cancelled" || o.status === "expired").length,
  }), [orders]);

  const filteredOrders = useMemo(() => {
    let result = orders.filter((o) =>
      activeTab === "all" ? true : activeTab === "archived" ? o.status === "cancelled" || o.status === "expired" : o.status === activeTab
    );
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((o) =>
        o.id.toLowerCase().includes(q) || o.status.toLowerCase().includes(q) || o.items.some((i) => i.productName.toLowerCase().includes(q))
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
        <div>
          <Breadcrumbs items={[{ label: "Orders" }]} />
        </div>

        <header>
          <h1 className="font-heading text-[28px] font-bold tracking-tight text-[#14231A] leading-tight">All Orders</h1>
          <p className="mt-4 text-xs text-[#5F7367]">Check all orders and reservations at a single place. It&apos;s easy to manage.</p>
        </header>

        <OrderSuccessToast
          show={showCheckoutToast}
          onDismiss={() => setShowCheckoutToast(false)}
        />

        <OrderCancelToast notice={cancelNotice} onDismiss={() => setCancelNotice(null)} />

        <BuyerTrustBanner trustRestriction={trustRestriction} trustWarning={trustWarning} />

        {error && isTrustAccessMessage(error) ? <div className="mb-4"><TrustAccessNotice message={error} /></div> : null}
        {error && !isTrustAccessMessage(error) ? (
          <Alert variant="destructive" className="mb-4 border border-rose-200 p-4 rounded-xl">
            <RefreshCw className="size-4" />
            <AlertTitle className="text-sm font-semibold">Orders could not refresh</AlertTitle>
            <AlertDescription className="text-xs">{error}{orders.length ? " Previous reservations are shown below." : ""}</AlertDescription>
            <Button type="button" variant="outline" className="mt-2 h-10 min-h-[40px] text-xs font-semibold" onClick={() => void load()}>Try again</Button>
          </Alert>
        ) : null}

        <OrderFilterTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full sm:w-[340px]">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5F7367]" aria-hidden="true" />
            <input
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, produce name, status…"
              className="h-10 min-h-[40px] w-full rounded-full border border-[#E8E8E8] bg-white pl-10 pr-4 text-xs sm:text-sm text-[#14231A] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00]/40"
            />
          </div>
          <OrderSortDropdown value={sortBy} onChange={setSortBy} />
        </div>

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
            {filteredOrders.map((order) => <OrderCard key={order.id} order={order} onCancel={setCancellingOrder} />)}
            {nextCursor && !error && activeTab === "all" ? (
              <div className="flex justify-center pt-3">
                <Button type="button" variant="outline" disabled={loadingMore} onClick={() => void load(nextCursor)} className="h-10 min-h-[40px] rounded-xl px-6 font-semibold text-xs border border-[#E8E8E8] bg-white hover:bg-neutral-50">
                  {loadingMore ? "Loading orders…" : "Load more orders"}
                </Button>
              </div>
            ) : null}
          </div>
        )}

        <ConfirmationModalComponent
          open={Boolean(cancellingOrder)}
          onClose={() => { if (!cancelLoading) { setCancellingOrder(null); setCancelError(""); } }}
          onConfirm={handleConfirmCancel}
          loading={cancelLoading}
          variant="destructive"
          title="Cancel Reservation"
          description={cancelError ? `${cancelError} Please try again.` : `Are you sure you want to cancel reservation #AGR-${cancellingOrder?.id.slice(0, 8).toUpperCase()}? The reserved produce will return to store inventory.`}
          confirmLabel="Cancel reservation"
          cancelLabel="Keep reservation"
        />
      </PageContainer>
    </main>
  );
}
