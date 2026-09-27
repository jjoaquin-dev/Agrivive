"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  LogIn,
  LogOut,
  Menu,
  ShoppingCart,
  Store,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { useCart } from "@/src/features/cart/CartProvider";
import { PageContainer } from "./PageContainer";
import { MarketplaceHeaderSearch, MARKETPLACE_PRODUCT_TYPES } from "./MarketplaceHeaderSearch";
import { cn } from "@/lib/utils";

export function BuyerSiteHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending } = authClient.useSession();
  const { itemCount, isReady: cartReady, setDrawerOpen } = useCart();

  useEffect(() => {
    if (!profileOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) setProfileOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileOpen]);

  async function signOut() {
    await authClient.signOut();
    setMenuOpen(false);
    setProfileOpen(false);
    router.replace("/marketplace");
    router.refresh();
  }

  const cartButton = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="relative size-9 shrink-0 rounded-xl"
      aria-label={`Open cart, ${cartReady ? itemCount : 0} items`}
      onClick={() => { setDrawerOpen(true); setMenuOpen(false); }}
    >
      <ShoppingCart aria-hidden="true" className="size-4" />
      {cartReady && itemCount > 0 ? <span className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">{itemCount}</span> : null}
    </Button>
  );

  const account = isPending ? (
    <span className="h-9 w-20 animate-pulse rounded-xl bg-muted" aria-label="Checking account" />
  ) : session?.user ? (
    <div ref={profileMenuRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-9 rounded-xl"
        aria-label="Open profile menu"
        aria-expanded={profileOpen}
        aria-haspopup="menu"
        aria-controls="buyer-profile-menu"
        onClick={() => setProfileOpen((open) => !open)}
      >
        <User aria-hidden="true" className="size-4" />
      </Button>
      {profileOpen ? (
        <div id="buyer-profile-menu" role="menu" className="absolute right-0 top-full z-40 mt-2 w-64 rounded-xl border bg-popover p-2 text-popover-foreground shadow-lg">
          <p className="truncate px-3 py-2 text-xs text-muted-foreground">{session.user.name || session.user.email}</p>
          <Link href="/profile" role="menuitem" onClick={() => setProfileOpen(false)} className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm hover:bg-muted">
            <User aria-hidden="true" className="size-4" />Profile &amp; settings
          </Link>
          <Button type="button" role="menuitem" variant="ghost" size="sm" onClick={() => void signOut()} className="w-full justify-start">
            <LogOut data-icon="inline-start" />Sign out
          </Button>
        </div>
      ) : null}
    </div>
  ) : (
    <div className="flex items-center gap-1">
      <Link href="/login" aria-label="Sign in" title="Sign in" className={buttonVariants({ variant: "ghost", size: "icon", className: "size-9 rounded-xl" })}>
        <LogIn aria-hidden="true" className="size-4" />
      </Link>
      <Link href="/signup" aria-label="Create account" title="Create account" className={buttonVariants({ variant: "ghost", size: "icon", className: "size-9 rounded-xl" })}>
        <UserPlus aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <PageContainer className="flex min-h-[64px] items-center gap-3 sm:gap-5">
        <Link href="/marketplace" aria-label="Agrivive marketplace" className="flex shrink-0 items-center gap-2">
          <Image src="/brand/agrivive-logo-icon.png" alt="" width={32} height={32} className="size-8 rounded-lg" priority />
          <span className="font-heading text-base font-bold tracking-[0.12em] text-primary sm:text-lg">AGRIVIVE</span>
        </Link>

        <MarketplaceHeaderSearch idPrefix="desktop-header" className="hidden max-w-2xl flex-1 md:flex" />

        <div className="ml-auto flex shrink-0 items-center gap-1">
          {account}
          {cartButton}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 rounded-xl md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </PageContainer>

      <nav aria-label="Browse produce" className="hidden border-t md:block">
        <PageContainer className="flex items-center gap-2 overflow-x-auto py-2">
          <Link href="/marketplace" className={cn(buttonVariants({ size: "sm" }), "shrink-0 gap-2")}>
            <Store aria-hidden="true" className="size-4" />Browse produce
          </Link>
          <Link href="/marketplace" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "shrink-0")}>All listings</Link>
          {MARKETPLACE_PRODUCT_TYPES.map((type) => (
            <Link
              key={type.value}
              href={`/marketplace?productType=${encodeURIComponent(type.value)}`}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "shrink-0 whitespace-nowrap")}
            >
              {type.label}
            </Link>
          ))}
          <span className="mx-1 h-5 shrink-0 border-l" aria-hidden="true" />
          <Link href="/orders" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "shrink-0 gap-2")}>
            <ClipboardList aria-hidden="true" className="size-4" />Orders
          </Link>
        </PageContainer>
      </nav>

      {menuOpen ? (
        <nav aria-label="Mobile buyer navigation" className="grid gap-2 border-t px-4 py-3 md:hidden">
          <MarketplaceHeaderSearch idPrefix="mobile-header" />
          <Link href="/marketplace" onClick={() => setMenuOpen(false)} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "justify-start")}>
            <Store data-icon="inline-start" />All listings
          </Link>
          {MARKETPLACE_PRODUCT_TYPES.map((type) => (
            <Link
              key={type.value}
              href={`/marketplace?productType=${encodeURIComponent(type.value)}`}
              onClick={() => setMenuOpen(false)}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "justify-start")}
            >
              {type.label}
            </Link>
          ))}
          <Link href="/orders" onClick={() => setMenuOpen(false)} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "justify-start")}>
            <ClipboardList data-icon="inline-start" />Orders
          </Link>
          {!session?.user && !isPending ? <>
            <Link href="/login" onClick={() => setMenuOpen(false)} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "justify-start")}><LogIn data-icon="inline-start" />Sign in</Link>
            <Link href="/signup" onClick={() => setMenuOpen(false)} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "justify-start")}><UserPlus data-icon="inline-start" />Create account</Link>
          </> : null}
        </nav>
      ) : null}
    </header>
  );
}
