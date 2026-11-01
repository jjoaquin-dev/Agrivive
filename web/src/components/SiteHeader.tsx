"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Bell, ClipboardList, LogOut, Menu, ShoppingCart, Store, UserCircle, X } from "lucide-react";
import { authClient } from "@/src/lib/auth-client";
import { useCart } from "@/src/features/cart/CartProvider";
import { PageContainer } from "./PageContainer";
import { SiteHeaderMobileNav } from "./SiteHeaderMobileNav";
import { ConfirmationModalComponent } from "./ConfirmationModalComponent";

export function SiteHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const { itemCount, isReady: cartReady } = useCart();
  const userName = session?.user?.name || session?.user?.email || "Buyer profile";

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await authClient.signOut();
      setShowSignOutModal(false);
      setProfileOpen(false);
      setMenuOpen(false);
      router.replace("/marketplace");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-agrivive-border/80 bg-white/95 shadow-md backdrop-blur">
      <PageContainer className="flex min-h-[68px] items-center justify-between gap-5">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-1.5"
          aria-label="Agrivive home"
        >
          <Image
            src="/brand/agrivive-logo-full-new.png"
            alt="Agrivive"
            width={130}
            height={36}
            className="h-[36px] w-auto object-contain transition-transform group-hover:scale-105"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-2 text-sm font-semibold md:flex" aria-label="Primary navigation">
          <Link href="/marketplace" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-agrivive-background px-3 text-agrivive-primary hover:bg-agrivive-sage/25">
            <Store aria-hidden="true" size={18} /> Marketplace
          </Link>
          <Link href="/marketplace/overview" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-agrivive-muted hover:bg-agrivive-background hover:text-agrivive-primary">
            <BarChart3 aria-hidden="true" size={18} /> Overview
          </Link>
          <Link href="/orders" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-agrivive-muted hover:bg-agrivive-background hover:text-agrivive-primary">
            <ClipboardList aria-hidden="true" size={18} /> Orders
          </Link>
          {session?.user ? (
            <Link href="/notifications" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-agrivive-muted hover:bg-agrivive-background hover:text-agrivive-primary">
              <Bell aria-hidden="true" size={18} /> Updates
            </Link>
          ) : null}
          <Link href="/cart" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-agrivive-muted hover:bg-agrivive-background hover:text-agrivive-primary" aria-label={`Cart, ${cartReady ? itemCount : 0} items`}>
            <ShoppingCart aria-hidden="true" size={18} /> Cart
            {cartReady && itemCount ? (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-agrivive-primary px-1.5 text-xs text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
        </nav>

        <div className="relative hidden items-center gap-3 md:flex">
          {isPending ? (
            <span
              className="h-11 w-28 animate-pulse rounded-xl bg-agrivive-background"
              aria-label="Checking account"
            />
          ) : session?.user ? (
            <>
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                aria-label={`Open profile for ${userName}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-agrivive-primary hover:bg-agrivive-background"
              >
                <UserCircle aria-hidden="true" size={20} />
                <span>Profile</span>
                <span className="max-w-36 truncate">{userName}</span>
              </button>
              {profileOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-14 z-20 w-64 rounded-2xl border border-agrivive-border bg-white p-2 shadow-md"
                >
                  <div className="border-b border-agrivive-border px-3 py-2">
                    <p className="text-xs text-agrivive-muted">Signed in as</p>
                    <p className="truncate text-sm font-semibold text-agrivive-text">
                      {session.user.email}
                    </p>
                  </div>
                  <Link
                    href="/orders"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="mt-1 inline-flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-agrivive-text hover:bg-agrivive-background"
                  >
                    <ClipboardList aria-hidden="true" size={17} />
                    Orders
                  </Link>
                  <Link
                    href="/notifications"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="inline-flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-agrivive-text hover:bg-agrivive-background"
                  >
                    <Bell aria-hidden="true" size={17} />
                    Notifications
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfileOpen(false);
                      setShowSignOutModal(true);
                    }}
                    className="inline-flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-agrivive-error hover:bg-red-50"
                  >
                    <LogOut aria-hidden="true" size={17} />
                    Sign out
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <Link href="/login" className="inline-flex min-h-10 items-center rounded-xl px-3.5 text-xs font-semibold text-agrivive-muted hover:bg-agrivive-background hover:text-agrivive-primary">
                Sign in
              </Link>
              <Link href="/signup" className="inline-flex min-h-10 items-center rounded-xl bg-agrivive-primary px-4 text-xs font-semibold text-white shadow-sm transition-[background-color,transform] hover:bg-agrivive-primaryPressed active:scale-[0.98]">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-agrivive-border text-agrivive-primary md:hidden [&>span]:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </PageContainer>

      <SiteHeaderMobileNav
        menuOpen={menuOpen}
        isPending={isPending}
        session={session}
        userName={userName}
        cartReady={cartReady}
        itemCount={itemCount}
        onCloseMenu={() => setMenuOpen(false)}
        onSignOut={() => {
          setMenuOpen(false);
          setShowSignOutModal(true);
        }}
      />

      <ConfirmationModalComponent
        open={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleSignOut}
        loading={signingOut}
        variant="destructive"
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
        confirmLabel="Sign out"
        cancelLabel="No"
      />
    </header>
  );
}
