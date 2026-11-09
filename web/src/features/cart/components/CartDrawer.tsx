"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ApiError, isTrustAccessMessage } from "@/src/lib/api";
import { TrustAccessNotice } from "@/src/features/trust/components/TrustAccessNotice";
import { useCart } from "../CartProvider";
import { createCartCheckout } from "../api/cart";
import { getMarketplaceProduct } from "@/src/features/marketplace/api/marketplace";
import { ReservePickupModal, type ReserveSeller } from "@/src/features/reservation/components/ReservePickupModal";
import type { PickupChoice } from "@/src/features/reservation/api/reservation";
import { getBuyerProfile } from "@/src/features/profile/api/profile";
import { CartSellerHeaderComponent } from "./CartSellerHeaderComponent";
import { CartItemComponent } from "./CartItemComponent";
import { formatPeso as money } from "@/src/lib/money";

export function CartDrawer() {
  const pathname = usePathname();
  const router = useRouter();
  const { items, itemCount, isReady, drawerOpen, setDrawerOpen, updateQuantity, refreshItem, removeItem, clear } = useCart();
  const [checkoutError, setCheckoutError] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [trustWarning, setTrustWarning] = useState<string | null>(null);
  const [trustRestriction, setTrustRestriction] = useState<string | null>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    let cancelled = false;
    getBuyerProfile()
      .then((res) => {
        if (!cancelled) {
          setTrustWarning(res.trustWarning ?? null);
          setTrustRestriction(res.trustRestriction?.message ?? null);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [drawerOpen]);

  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.productPrice) * item.quantity, 0), [items]);

  const itemsBySeller = useMemo(() => {
    const groups = new Map<string, typeof items>();
    for (const item of items) {
      const key = item.seller.shopName || "Local Stall";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    }
    return Array.from(groups.entries());
  }, [items]);

  const reserveSellers: ReserveSeller[] = Array.from(new Map(items.map((item) => [item.seller.id, item])).values()).map((first) => ({
    sellerId: first.seller.id, shopName: first.seller.shopName, address: first.seller.detailAddress,
    lines: items.filter((item) => item.seller.id === first.seller.id).map((item) => `${item.quantity} ${item.scalingType} ${item.productName}`),
    amount: items.filter((item) => item.seller.id === first.seller.id).reduce((sum, item) => sum + Number(item.productPrice) * item.quantity, 0),
  }));

  if (pathname === "/") return null;

  async function handleCheckout(pickups: PickupChoice[]) {
    if (!items.length || checkingOut) return;
    setCheckingOut(true);
    setCheckoutError("");
    const chosen = new Set(pickups.map((pickup) => pickup.sellerId));
    const reserved = items.filter((item) => chosen.has(item.seller.id));
    try {
      const result = await createCartCheckout(reserved.map((item) => ({ productId: item.id, quantity: item.quantity })), pickups, crypto.randomUUID());
      if (reserved.length === items.length) clear(); else reserved.forEach((item) => removeItem(item.id));
      setShowReserveModal(false);
      setDrawerOpen(false);
      router.push(`/orders?checkout=${encodeURIComponent(result.checkoutId)}`);
    } catch (reason) {
      if (reason instanceof ApiError && reason.status !== 409) { setCheckoutError(reason.message); if (reason.status !== 401) { setCheckingOut(false); if (reason.status === 403) setShowReserveModal(false); return; } }
      if (reason instanceof ApiError && reason.status === 401) {
        setShowReserveModal(false);
        setDrawerOpen(false);
        router.push("/login?next=%2Fcart");
        return;
      }
      if (reason instanceof ApiError && reason.status === 409) {
        const fresh = await Promise.all(items.map((item) => getMarketplaceProduct(item.id).catch(() => null)));
        fresh.forEach((product) => { if (product) refreshItem(product); });
      }
      setCheckoutError(reason instanceof ApiError && reason.status === 409
        ? "Some items changed. The cart has been updated; review it and try again."
        : reason instanceof ApiError ? reason.message : "We could not reserve your cart. Please try again.");
    } finally { setCheckingOut(false); }
  }

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="right" className="flex flex-col gap-0 bg-agrivive-background sm:max-w-lg p-0">
        <SheetHeader className="border-b border-border/80 bg-white p-5 pr-14 text-left">
          <SheetTitle className="font-heading text-xl font-bold text-foreground">
            Your cart <span className="font-body text-sm font-medium text-muted-foreground">({itemCount} items)</span>
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Review produce from local stalls. Each store receives its own pickup pass.
          </SheetDescription>
        </SheetHeader>

        {!isReady ? (
          <div className="m-6 h-40 animate-pulse rounded-2xl bg-white" aria-label="Loading cart" />
        ) : items.length > 0 ? (
          <div data-lenis-prevent className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-5">
            {trustWarning ? (
              <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-900">
                <AlertTriangle className="size-4 shrink-0 text-amber-600" />
                <AlertTitle className="font-semibold text-amber-900">
                  {trustWarning.toLowerCase().includes("cancel") ? "Cancellation warning" : "Missed pickup warning"}
                </AlertTitle>
                <AlertDescription className="text-xs leading-relaxed text-amber-800">
                  {trustWarning}
                </AlertDescription>
              </Alert>
            ) : null}
            {itemsBySeller.map(([shopName, sellerItems]) => (
              <div key={shopName} className="space-y-2.5">
                <CartSellerHeaderComponent shopName={shopName} />
                <div className="space-y-3">
                  {sellerItems.map((item, index) => (
                    <div key={item.id} className="cart-item-enter" style={{ animationDelay: `${index * 70}ms` }}>
                      <CartItemComponent
                        item={item}
                        onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                        onRemove={() => removeItem(item.id)}
                        onNavigate={() => setDrawerOpen(false)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <Image src="/brand/empty-cart.webp" alt="" width={360} height={377} sizes="160px" className="h-auto w-40 max-w-full" />
            <h3 className="mt-4 font-heading text-lg font-bold">Your cart is empty</h3>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">Reserve fresh surplus produce from Davao public markets.</p>
            <Button render={<Link href="/marketplace" />} nativeButton={false} onClick={() => setDrawerOpen(false)} className="mt-5 min-h-12 rounded-xl px-6">
              Browse marketplace<ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        )}

        {items.length > 0 ? (
          <SheetFooter className="border-t border-border/80 bg-white p-5">
            {trustRestriction || (checkoutError && isTrustAccessMessage(checkoutError)) ? (
              <TrustAccessNotice message={trustRestriction || checkoutError} onNavigate={() => setDrawerOpen(false)} />
            ) : checkoutError ? (
              <Alert variant="destructive" className="mb-3">
                <AlertDescription>{checkoutError}</AlertDescription>
                <Button type="button" variant="link" className="min-h-11 justify-start px-0 text-xs" onClick={() => setCheckoutError("")}>
                  <RefreshCw className="size-3.5" />Review cart
                </Button>
              </Alert>
            ) : null}
            <div className="flex items-center justify-between pb-3">
              <span className="text-sm font-medium text-muted-foreground">Total to pay at pickup</span>
              <span className="font-heading text-2xl font-bold text-agrivive-primary">{money(total)}</span>
            </div>
            <Button
              type="button"
              onClick={() => setShowReserveModal(true)}
              disabled={checkingOut || !isReady || Boolean(trustRestriction)}
              className="group min-h-12 h-12 w-full rounded-xl text-sm font-semibold active:translate-y-px"
            >
              {checkingOut ? "Reserving…" : "Reserve for pickup"}<ArrowRight data-icon="inline-end" className="transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
            <p className="pt-2 text-center text-xs text-muted-foreground">
              Agrivive does not check produce quality. Please look over your items when you pick up.
            </p>
          </SheetFooter>
        ) : null}

        <ReservePickupModal
          open={showReserveModal}
          onClose={() => { setShowReserveModal(false); setCheckoutError(""); }}
          onConfirm={handleCheckout}
          loading={checkingOut}
          error={showReserveModal ? checkoutError : ""}
          total={money(total)}
          sellers={reserveSellers}
        />
      </SheetContent>
    </Sheet>
  );
}
