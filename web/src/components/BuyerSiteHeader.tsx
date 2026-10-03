"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  LogIn,
  LogOut,
  Menu,
  ShoppingCart,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { useCart } from "@/src/features/cart/CartProvider";
import { BUYER_PROFILE_IMAGE_UPDATED_EVENT, getBuyerProfile } from "@/src/features/profile/api/profile";
import { PageContainer } from "./PageContainer";
import { BuyerSiteHeaderNav, BuyerSiteHeaderNavFallback } from "./BuyerSiteHeaderNav";
import { MarketplaceHeaderSearch } from "./MarketplaceHeaderSearch";

export function BuyerSiteHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending } = authClient.useSession();
  const { itemCount, isReady: cartReady, setDrawerOpen } = useCart();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFailed, setProfileImageFailed] = useState(false);

  useEffect(() => {
    const userId = session?.user?.id;
    const sessionImage = session?.user?.image ?? null;
    if (!userId) {
      setProfileImage(null);
      return;
    }

    let cancelled = false;
    setProfileImage(sessionImage);
    getBuyerProfile()
      .then((response) => { if (!cancelled) setProfileImage(response.account.image); })
      .catch(() => { if (!cancelled) setProfileImage(sessionImage); });

    return () => { cancelled = true; };
  }, [session?.user?.id, session?.user?.image]);

  useEffect(() => {
    setProfileImageFailed(false);
  }, [profileImage]);

  useEffect(() => {
    const handleProfileImageUpdate = (event: Event) => {
      const imageUrl = (event as CustomEvent<string>).detail;
      if (imageUrl) setProfileImage(imageUrl);
    };
    window.addEventListener(BUYER_PROFILE_IMAGE_UPDATED_EVENT, handleProfileImageUpdate);
    return () => window.removeEventListener(BUYER_PROFILE_IMAGE_UPDATED_EVENT, handleProfileImageUpdate);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const closeOnOutside = (e: PointerEvent) => {
      if (!profileMenuRef.current?.contains(e.target as Node)) setProfileOpen(false);
    };
    const closeOnEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setProfileOpen(false); };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEsc);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEsc);
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
      className="relative size-11 min-h-11 min-w-11 shrink-0 rounded-xl"
      aria-label={`Open cart, ${cartReady ? itemCount : 0} items`}
      onClick={() => { setDrawerOpen(true); setMenuOpen(false); }}
    >
      <ShoppingCart aria-hidden="true" className="size-4" />
      {cartReady && itemCount > 0 ? (
        <span className="absolute right-1 top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
          {itemCount}
        </span>
      ) : null}
    </Button>
  );

  const account = isPending ? (
    <span className="h-11 w-20 animate-pulse rounded-xl bg-muted" aria-label="Checking account" />
  ) : session?.user ? (
    <div ref={profileMenuRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-11 min-h-11 min-w-11 rounded-xl border border-primary/30 bg-primary/5"
        aria-label="Open profile menu"
        aria-expanded={profileOpen}
        aria-haspopup="menu"
        aria-controls="buyer-profile-menu"
        onClick={() => setProfileOpen((open) => !open)}
      >
        {profileImage && !profileImageFailed ? (
          <img
            src={profileImage}
            alt={`Profile photo for ${session.user.name || "buyer"}`}
            className="size-8 rounded-lg object-cover ring-2 ring-primary/25"
            onError={() => setProfileImageFailed(true)}
          />
        ) : (
          <User aria-hidden="true" className="size-4" />
        )}
      </Button>
      {profileOpen ? (
        <div id="buyer-profile-menu" role="menu" className="absolute right-0 top-full z-40 mt-2 w-64 rounded-xl border bg-popover p-2 text-popover-foreground shadow-lg">
          <p className="truncate px-3 py-2 text-xs text-muted-foreground">{session.user.name || session.user.email}</p>
          <Link href="/profile" role="menuitem" onClick={() => setProfileOpen(false)} className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm hover:bg-muted">
            <User aria-hidden="true" className="size-4" />Profile &amp; settings
          </Link>
          <Link href="/notifications" role="menuitem" onClick={() => setProfileOpen(false)} className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm hover:bg-muted">
            <Bell aria-hidden="true" className="size-4" />Notifications
          </Link>
          <Button type="button" role="menuitem" variant="ghost" size="sm" onClick={() => void signOut()} className="w-full justify-start">
            <LogOut data-icon="inline-start" />Sign out
          </Button>
        </div>
      ) : null}
    </div>
  ) : (
    <div className="flex items-center gap-1">
      <Link href="/login" aria-label="Sign in" title="Sign in" className={buttonVariants({ variant: "ghost", size: "icon", className: "size-11 min-h-11 min-w-11 rounded-xl" })}>
        <LogIn aria-hidden="true" className="size-4" />
      </Link>
      <Link href="/signup" aria-label="Create account" title="Create account" className={buttonVariants({ variant: "ghost", size: "icon", className: "size-11 min-h-11 min-w-11 rounded-xl" })}>
        <UserPlus aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 shadow-[0_1px_0_rgba(31,77,58,0.03)] backdrop-blur">
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
            className="size-11 min-h-11 min-w-11 rounded-xl md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </PageContainer>

      <Suspense fallback={<BuyerSiteHeaderNavFallback menuOpen={menuOpen} />}>
        <BuyerSiteHeaderNav menuOpen={menuOpen} hasSession={Boolean(session?.user)} onCloseMenu={() => setMenuOpen(false)} />
      </Suspense>
    </header>
  );
}
