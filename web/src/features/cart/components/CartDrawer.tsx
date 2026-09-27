"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Minus, Plus, RefreshCw, ShoppingCart, Store, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ApiError } from "@/src/lib/api";
import { useCart } from "../CartProvider";
import { createCartCheckout } from "../api/cart";
import { getMarketplaceProduct } from "@/src/features/marketplace/api/marketplace";
import { ProductImage } from "@/src/features/marketplace/components/ProductImage";

function money(value: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value);
}

export function CartDrawer() {
  const pathname = usePathname();
  const router = useRouter();
  const { items, itemCount, isReady, drawerOpen, setDrawerOpen, updateQuantity, refreshItem, removeItem, clear } = useCart();
  const [checkoutError, setCheckoutError] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

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

  if (pathname === "/") return null;

  async function handleCheckout() {
    if (!items.length || checkingOut) return;
    setCheckingOut(true);
    setCheckoutError("");
    try {
      const result = await createCartCheckout(items.map((item) => ({ productId: item.id, quantity: item.quantity })), crypto.randomUUID());
      clear();
      setDrawerOpen(false);
      router.push(`/orders?checkout=${encodeURIComponent(result.checkoutId)}`);
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 401) {
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
      <SheetContent side="right" className="flex flex-col gap-0 bg-agrivive-background sm:max-w-lg">
        <SheetHeader className="border-b border-border/80 bg-white p-5 pr-14 text-left">
          <SheetTitle className="font-heading text-xl font-bold text-foreground">
            Your cart <span className="font-sans text-sm font-medium text-muted-foreground">({itemCount} items)</span>
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Review produce from local stalls. Each store receives its own pickup pass.
          </SheetDescription>
        </SheetHeader>

        {!isReady ? (
          <div className="m-6 h-40 animate-pulse rounded-2xl bg-white" aria-label="Loading cart" />
        ) : items.length > 0 ? (
          <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">
            {itemsBySeller.map(([shopName, sellerItems]) => (
              <div key={shopName} className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-xs">
                <div className="flex items-center gap-2 border-b border-border/60 bg-agrivive-background/50 px-4 py-2.5">
                  <Store className="size-3.5 text-agrivive-primary" aria-hidden="true" />
                  <span className="font-heading text-xs font-bold text-foreground">{shopName}</span>
                </div>
                <div className="divide-y divide-border/60">
                  {sellerItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3.5">
                      <Link href={`/marketplace/${item.id}`} onClick={() => setDrawerOpen(false)} className="size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-agrivive-background">
                        <ProductImage src={item.imageUrl} alt={item.productName} category={item.productType} />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link href={`/marketplace/${item.id}`} onClick={() => setDrawerOpen(false)} className="line-clamp-1 text-sm font-semibold text-foreground hover:text-agrivive-primary">
                          {item.productName}
                        </Link>
                        <p className="font-heading text-xs font-bold text-agrivive-primary">
                          {money(Number(item.productPrice))}<span className="font-normal text-muted-foreground"> / {item.scalingType}</span>
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Button type="button" size="icon" variant="outline" className="size-8 min-h-8 rounded-lg" aria-label={`Reduce ${item.productName}`} onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}>
                              <Minus className="size-3.5" />
                            </Button>
                            <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                            <Button type="button" size="icon" variant="outline" className="size-8 min-h-8 rounded-lg" aria-label={`Increase ${item.productName}`} onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <Plus className="size-3.5" />
                            </Button>
                          </div>
                          <Button type="button" size="icon" variant="ghost" className="size-8 min-h-8 text-muted-foreground hover:text-destructive" aria-label={`Remove ${item.productName}`} onClick={() => removeItem(item.id)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-xs">
              <ShoppingCart aria-hidden="true" className="size-7 text-agrivive-primary" />
            </span>
            <h3 className="mt-4 font-heading text-lg font-bold">Your cart is empty</h3>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">Reserve fresh surplus produce from Davao public markets.</p>
            <Button render={<Link href="/marketplace" />} nativeButton={false} onClick={() => setDrawerOpen(false)} className="mt-5">
              Browse marketplace<ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        )}

        {items.length > 0 ? (
          <SheetFooter className="border-t border-border/80 bg-white p-5">
            {checkoutError ? (
              <Alert variant="destructive" className="mb-3">
                <AlertDescription>{checkoutError}</AlertDescription>
                <Button type="button" variant="link" className="min-h-8 justify-start px-0 text-xs" onClick={() => setCheckoutError("")}>
                  <RefreshCw className="size-3.5" />Review cart
                </Button>
              </Alert>
            ) : null}
            <div className="flex items-center justify-between pb-3">
              <span className="text-sm font-medium text-muted-foreground">Total to pay at pickup</span>
              <span className="font-heading text-2xl font-bold text-agrivive-primary">{money(total)}</span>
            </div>
            <Button type="button" onClick={() => void handleCheckout()} disabled={checkingOut || !isReady} className="h-12 w-full text-sm font-semibold">
              {checkingOut ? "Reserving…" : "Reserve cart for pickup"}<ArrowRight data-icon="inline-end" />
            </Button>
            <p className="pt-2 text-center text-[11px] text-muted-foreground">
              Direct pickup payment at stall. No upfront card required.
            </p>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
