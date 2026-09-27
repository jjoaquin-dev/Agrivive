"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, LogIn, LogOut, Menu, ShoppingCart, Store, UserCircle, UserPlus, X } from "lucide-react";
import { authClient } from "@/src/lib/auth-client";
import { useCart } from "@/src/features/cart/CartProvider";
import { PageContainer } from "./PageContainer";

export function SiteHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const { itemCount, isReady: cartReady } = useCart();
  const userName = session?.user?.name || session?.user?.email || "Buyer profile";

  async function handleSignOut() {
    await authClient.signOut();
    setProfileOpen(false);
    setMenuOpen(false);
    router.replace("/marketplace");
    router.refresh();
  }

  return (
    <header className="border-b border-agrivive-border bg-white">
      <PageContainer className="flex min-h-[72px] items-center justify-between gap-5">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Agrivive home">
          <Image src="/brand/agrivive-logo-icon.png" alt="" width={40} height={40} className="h-10 w-10 rounded-xl" priority />
          <span className="hidden font-heading text-lg font-bold tracking-[0.12em] text-agrivive-primary sm:inline">AGRIVIVE</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" aria-label="Primary navigation">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-agrivive-primary hover:text-agrivive-primaryPressed"><Store aria-hidden="true" size={18} strokeWidth={1.8} />Marketplace</Link>
          <Link href="/orders" className="inline-flex items-center gap-2 text-agrivive-muted hover:text-agrivive-primary"><ClipboardList aria-hidden="true" size={18} strokeWidth={1.8} />Orders</Link>
          <Link href="/cart" className="inline-flex items-center gap-2 text-agrivive-muted hover:text-agrivive-primary" aria-label={`Cart, ${cartReady ? itemCount : 0} items`}><ShoppingCart aria-hidden="true" size={18} strokeWidth={1.8} />Cart{cartReady && itemCount ? <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-agrivive-primary px-1.5 text-xs text-white">{itemCount}</span> : null}</Link>
        </nav>

        <div className="relative hidden items-center gap-3 md:flex">
          {isPending ? <span className="h-11 w-28 animate-pulse rounded-[10px] bg-agrivive-background" aria-label="Checking account" /> : session?.user ? <>
            <button type="button" onClick={() => setProfileOpen((current) => !current)} aria-expanded={profileOpen} aria-haspopup="menu" aria-label={`Open profile for ${userName}`} className="inline-flex min-h-11 items-center gap-2 rounded-[10px] px-3 text-sm font-semibold text-agrivive-primary hover:bg-agrivive-background"><UserCircle aria-hidden="true" size={20} strokeWidth={1.8} /><span>Profile</span><span className="max-w-36 truncate">{userName}</span></button>
            {profileOpen ? <div role="menu" className="absolute right-0 top-14 z-20 w-64 rounded-xl border border-agrivive-border bg-white p-2 shadow-[0_12px_30px_rgba(31,77,58,0.12)]"><div className="border-b border-agrivive-border px-3 py-2"><p className="text-xs text-agrivive-muted">Signed in as</p><p className="truncate text-sm font-semibold text-agrivive-text">{session.user.email}</p></div><Link href="/orders" role="menuitem" onClick={() => setProfileOpen(false)} className="mt-1 inline-flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-agrivive-text hover:bg-agrivive-background"><ClipboardList aria-hidden="true" size={17} />Orders</Link><button type="button" role="menuitem" onClick={handleSignOut} className="inline-flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-agrivive-error hover:bg-red-50"><LogOut aria-hidden="true" size={17} />Sign out</button></div> : null}
          </> : <><Link href="/login" className="inline-flex min-h-11 items-center gap-2 rounded-[10px] px-4 text-sm font-semibold text-agrivive-primary hover:bg-agrivive-background"><LogIn aria-hidden="true" size={18} strokeWidth={1.8} />Sign in</Link><Link href="/signup" className="inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-agrivive-primary px-4 text-sm font-semibold text-white hover:bg-agrivive-primaryPressed"><UserPlus aria-hidden="true" size={18} strokeWidth={1.8} />Create account</Link></>}
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border border-agrivive-border text-agrivive-primary md:hidden [&>span]:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X aria-hidden="true" size={20} strokeWidth={2} /> : <Menu aria-hidden="true" size={20} strokeWidth={2} />}
        </button>
      </PageContainer>

      {menuOpen ? (
        <nav id="mobile-navigation" className="border-t border-agrivive-border py-3 md:hidden" aria-label="Mobile navigation">
          <PageContainer className="flex flex-col gap-1">
            <Link href="/marketplace" className="inline-flex items-center gap-3 rounded-lg px-3 py-3 font-semibold text-agrivive-primary hover:bg-agrivive-background" onClick={() => setMenuOpen(false)}><Store aria-hidden="true" size={18} />Marketplace</Link>
            <Link href="/orders" className="inline-flex items-center gap-3 rounded-lg px-3 py-3 font-semibold text-agrivive-text hover:bg-agrivive-background" onClick={() => setMenuOpen(false)}><ClipboardList aria-hidden="true" size={18} />Orders</Link>
            <Link href="/cart" className="inline-flex items-center gap-3 rounded-lg px-3 py-3 font-semibold text-agrivive-text hover:bg-agrivive-background" onClick={() => setMenuOpen(false)}><ShoppingCart aria-hidden="true" size={18} />Cart{cartReady && itemCount ? ` (${itemCount})` : ""}</Link>
            {isPending ? <span className="mx-3 h-11 animate-pulse rounded-lg bg-agrivive-background" aria-label="Checking account" /> : session?.user ? <><div className="mx-3 rounded-lg bg-agrivive-background px-3 py-3"><p className="text-xs text-agrivive-muted">Signed in as</p><p className="truncate text-sm font-semibold text-agrivive-text">{userName}</p></div><button type="button" onClick={handleSignOut} className="inline-flex min-h-11 items-center gap-3 rounded-lg px-3 py-3 text-left font-semibold text-agrivive-error hover:bg-red-50"><LogOut aria-hidden="true" size={18} />Sign out</button></> : <><Link href="/login" className="inline-flex items-center gap-3 rounded-lg px-3 py-3 font-semibold text-agrivive-text hover:bg-agrivive-background" onClick={() => setMenuOpen(false)}><LogIn aria-hidden="true" size={18} />Sign in</Link><Link href="/signup" className="mt-1 inline-flex items-center justify-center gap-2 rounded-[10px] bg-agrivive-primary px-3 py-3 text-center font-semibold text-white" onClick={() => setMenuOpen(false)}><UserPlus aria-hidden="true" size={18} />Create account</Link></>}
          </PageContainer>
        </nav>
      ) : null}
    </header>
  );
}
