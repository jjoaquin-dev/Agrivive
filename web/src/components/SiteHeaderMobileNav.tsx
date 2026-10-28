"use client";

import Link from "next/link";
import { BarChart3, Bell, ClipboardList, LogIn, LogOut, ShoppingCart, Store, UserPlus } from "lucide-react";
import { PageContainer } from "./PageContainer";

type SiteHeaderMobileNavProps = {
  menuOpen: boolean;
  isPending: boolean;
  session: { user?: { name?: string | null; email?: string | null } } | null | undefined;
  userName: string;
  cartReady: boolean;
  itemCount: number;
  onCloseMenu: () => void;
  onSignOut: () => void;
};

export function SiteHeaderMobileNav({
  menuOpen,
  isPending,
  session,
  userName,
  cartReady,
  itemCount,
  onCloseMenu,
  onSignOut,
}: SiteHeaderMobileNavProps) {
  if (!menuOpen) return null;

  return (
    <nav id="mobile-navigation" className="border-t border-agrivive-border py-3 md:hidden" aria-label="Mobile navigation">
      <PageContainer className="flex flex-col gap-1">
        <Link href="/marketplace" className="inline-flex items-center gap-3 rounded-lg px-3 py-3 font-semibold text-agrivive-primary hover:bg-agrivive-background" onClick={onCloseMenu}>
          <Store aria-hidden="true" size={18} />Marketplace
        </Link>
        <Link href="/marketplace/overview" className="inline-flex items-center gap-3 rounded-lg px-3 py-3 font-semibold text-agrivive-text hover:bg-agrivive-background" onClick={onCloseMenu}>
          <BarChart3 aria-hidden="true" size={18} />Public Overview
        </Link>
        <Link href="/orders" className="inline-flex items-center gap-3 rounded-lg px-3 py-3 font-semibold text-agrivive-text hover:bg-agrivive-background" onClick={onCloseMenu}>
          <ClipboardList aria-hidden="true" size={18} />Orders
        </Link>
        {session?.user ? (
          <Link href="/notifications" className="inline-flex items-center gap-3 rounded-lg px-3 py-3 font-semibold text-agrivive-text hover:bg-agrivive-background" onClick={onCloseMenu}>
            <Bell aria-hidden="true" size={18} />Notifications
          </Link>
        ) : null}
        <Link href="/cart" className="inline-flex items-center gap-3 rounded-lg px-3 py-3 font-semibold text-agrivive-text hover:bg-agrivive-background" onClick={onCloseMenu}>
          <ShoppingCart aria-hidden="true" size={18} />Cart{cartReady && itemCount ? ` (${itemCount})` : ""}
        </Link>
        {isPending ? (
          <span className="mx-3 h-11 animate-pulse rounded-lg bg-agrivive-background" aria-label="Checking account" />
        ) : session?.user ? (
          <>
            <div className="mx-3 rounded-lg bg-agrivive-background px-3 py-3">
              <p className="text-xs text-agrivive-muted">Signed in as</p>
              <p className="truncate text-sm font-semibold text-agrivive-text">{userName}</p>
            </div>
            <button type="button" onClick={onSignOut} className="inline-flex min-h-11 items-center gap-3 rounded-lg px-3 py-3 text-left font-semibold text-agrivive-error hover:bg-red-50">
              <LogOut aria-hidden="true" size={18} />Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="inline-flex items-center gap-3 rounded-lg px-3 py-3 font-semibold text-agrivive-text hover:bg-agrivive-background" onClick={onCloseMenu}>
              <LogIn aria-hidden="true" size={18} />Sign in
            </Link>
            <Link href="/signup" className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-agrivive-primary px-3 py-3 text-center font-semibold text-white" onClick={onCloseMenu}>
              <UserPlus aria-hidden="true" size={18} />Register
            </Link>
          </>
        )}
      </PageContainer>
    </nav>
  );
}
