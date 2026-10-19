"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { useCart } from "@/src/features/cart/CartProvider";
import { PageContainer } from "./PageContainer";
import { BuyerAccountMenu } from "./BuyerAccountMenu";
import {
  BuyerSiteHeaderNav,
  BuyerSiteHeaderNavFallback,
} from "./BuyerSiteHeaderNav";
import { MarketplaceHeaderSearch } from "./MarketplaceHeaderSearch";

export function BuyerSiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const { itemCount, isReady: cartReady, setDrawerOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 shadow-[0_1px_0_rgba(31,77,58,0.03)] backdrop-blur">
      <PageContainer className="flex min-h-[66px] items-center gap-4 sm:gap-6">
        {/* Brand Lockup */}
        <Link
          href={session?.user ? "/marketplace" : "/"}
          aria-label={session?.user ? "Agrivive marketplace" : "Agrivive home"}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-agrivive-primary/5 p-1 transition-transform group-hover:scale-105">
            <Image
              src="/brand/agrivive-logo-icon.png"
              alt="Agrivive"
              width={36}
              height={36}
              className="size-8 object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-extrabold leading-none tracking-tight text-agrivive-primary">
              Agrivive
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <MarketplaceHeaderSearch
          idPrefix="desktop-header"
          className="hidden max-w-2xl flex-1 md:flex"
        />

        {/* Right Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <BuyerAccountMenu onActionComplete={() => setMenuOpen(false)} />

          <Button
            type="button"
            variant="ghost"
            className="relative flex min-h-10 items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 text-xs font-semibold text-foreground hover:bg-muted"
            aria-label={`Open cart, ${cartReady ? itemCount : 0} items`}
            onClick={() => {
              setDrawerOpen(true);
              setMenuOpen(false);
            }}
          >
            <ShoppingCart
              aria-hidden="true"
              className="size-4 text-agrivive-primary"
            />
            <span className="hidden sm:inline">Cart</span>
            {cartReady && itemCount > 0 ? (
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-agrivive-primary text-[10px] font-bold text-white">
                {itemCount}
              </span>
            ) : null}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 min-h-10 min-w-10 rounded-xl md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </PageContainer>

      <Suspense fallback={<BuyerSiteHeaderNavFallback menuOpen={menuOpen} />}>
        <BuyerSiteHeaderNav
          menuOpen={menuOpen}
          hasSession={Boolean(session?.user)}
          onCloseMenu={() => setMenuOpen(false)}
        />
      </Suspense>
    </header>
  );
}
