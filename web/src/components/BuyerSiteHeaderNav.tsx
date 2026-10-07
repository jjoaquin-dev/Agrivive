"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Bell, ClipboardList, Store } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageContainer } from "./PageContainer";
import { MarketplaceHeaderSearch, MARKETPLACE_PRODUCT_TYPES } from "./MarketplaceHeaderSearch";
import { cn } from "@/lib/utils";

type BuyerSiteHeaderNavProps = {
  menuOpen: boolean;
  hasSession: boolean;
  onCloseMenu: () => void;
};

export function BuyerSiteHeaderNav({ menuOpen, hasSession, onCloseMenu }: BuyerSiteHeaderNavProps) {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const selectedProductType = searchParams?.get("productType") ?? "";
  const isMarketplace = pathname === "/marketplace";
  const isAllListings = isMarketplace && !selectedProductType;
  const isOrders = pathname === "/orders" || pathname.startsWith("/orders/");

  function navLink(active: boolean, className = "") {
    return cn(buttonVariants({ variant: active ? "default" : "ghost", size: "sm" }), "shrink-0", className);
  }

  return (
    <>
      <nav aria-label="Browse produce" className="hidden border-t md:block">
        <PageContainer className="flex items-center gap-2 overflow-x-auto py-2">
          <Link href="/marketplace" className={navLink(false, "gap-2")}>
            <Store aria-hidden="true" className="size-4" />Browse produce
          </Link>
          <Link href="/marketplace" aria-current={isAllListings ? "page" : undefined} className={navLink(isAllListings)}>All listings</Link>
          {MARKETPLACE_PRODUCT_TYPES.map((type) => {
            const active = isMarketplace && selectedProductType === type.value;
            return (
              <Link key={type.value} href={`/marketplace?productType=${encodeURIComponent(type.value)}`} aria-current={active ? "page" : undefined} className={navLink(active, "whitespace-nowrap")}>
                {type.label}
              </Link>
            );
          })}
          <span className="mx-1 h-5 shrink-0 border-l" aria-hidden="true" />
          <Link href="/orders" aria-current={isOrders ? "page" : undefined} className={navLink(isOrders, "gap-2")}>
            <ClipboardList aria-hidden="true" className="size-4" />Orders
          </Link>
        </PageContainer>
      </nav>

      {menuOpen ? (
        <nav aria-label="Mobile buyer navigation" className="grid gap-2 border-t px-4 py-3 md:hidden">
          <MarketplaceHeaderSearch idPrefix="mobile-header" />
          <Link href="/marketplace" aria-current={isAllListings ? "page" : undefined} onClick={onCloseMenu} className={cn(navLink(isAllListings), "justify-start")}>
            <Store data-icon="inline-start" />All listings
          </Link>
          {MARKETPLACE_PRODUCT_TYPES.map((type) => {
            const active = isMarketplace && selectedProductType === type.value;
            return (
              <Link key={type.value} href={`/marketplace?productType=${encodeURIComponent(type.value)}`} aria-current={active ? "page" : undefined} onClick={onCloseMenu} className={cn(navLink(active), "justify-start")}>
                {type.label}
              </Link>
            );
          })}
          <Link href="/orders" aria-current={isOrders ? "page" : undefined} onClick={onCloseMenu} className={cn(navLink(isOrders), "justify-start")}>
            <ClipboardList data-icon="inline-start" />Orders
          </Link>
          {hasSession ? <Link href="/notifications" onClick={onCloseMenu} className={cn(navLink(false), "justify-start")}>
            <Bell data-icon="inline-start" />Notifications
          </Link> : null}
        </nav>
      ) : null}
    </>
  );
}

export function BuyerSiteHeaderNavFallback({ menuOpen }: { menuOpen: boolean }) {
  return menuOpen
    ? <div className="h-12 border-t md:hidden" aria-hidden="true" />
    : <div className="hidden h-12 border-t md:block" aria-hidden="true" />;
}
