"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState, useRef, useEffect } from "react";
import { Bell, Menu, MessageCircle, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { useCart } from "@/src/features/cart/CartProvider";
import { NotificationDropdownComponent } from "@/src/features/notifications/components/NotificationDropdownComponent";
import { useBuyerNotifications } from "@/src/features/notifications/hooks/useBuyerNotifications";
import { PageContainer } from "./PageContainer";
import { BuyerAccountMenu } from "./BuyerAccountMenu";
import { BuyerSiteHeaderNav, BuyerSiteHeaderNavFallback } from "./BuyerSiteHeaderNav";
import { BuyerHeaderSearch } from "./BuyerHeaderSearch";

export function BuyerSiteHeader() {
  // The marketplace header uses the brand green band with the white logo.
  const pathname = usePathname() ?? "";
  // Every buyer page uses the green navbar, except the public marketplace overview.
  const onGreen = !pathname.startsWith("/marketplace/overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();
  const { itemCount, isReady: cartReady, setDrawerOpen } = useCart();
  const { unreadCount } = useBuyerNotifications();

  useEffect(() => {
    if (!notificationsOpen) return;
    const handleOutsideClick = (e: PointerEvent) => {
      if (!notificationRef.current?.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotificationsOpen(false);
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [notificationsOpen]);

  return (
    <header data-tone={onGreen ? "green" : "light"} className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/95 backdrop-blur shadow-sm">
      {/* Top Main Bar */}
      <div className={`border-b py-2.5 ${onGreen ? "border-[#457D00] bg-[#457D00]" : "border-neutral-100"}`}>
        <PageContainer className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="group -ml-3 flex shrink-0 items-center gap-1.5" aria-label="Agrivive home">
            <Image
              src={onGreen ? "/brand/agrivive-logo-full-white.png" : "/brand/agrivive-logo-full-new-transparent.png"}
              alt="Agrivive"
              width={130}
              height={36}
              className="h-[30px] w-auto object-contain transition-transform group-hover:scale-105 sm:h-[36px]"
              priority
            />
          </Link>

          {/* Integrated Search Bar (Landing Page Style) */}
          <Suspense fallback={null}>
            <BuyerHeaderSearch onGreen={onGreen} />
          </Suspense>

          {/* User & Marketplace Actions */}
          <div className="-mr-3 flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Messages & Notifications (left side of profile avatar) */}
            <Link
              href="/messages"
              className="buyer-header-icon group relative flex size-9 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 hover:text-[#457D00]"
              aria-label="Messages"
            >
              <MessageCircle className="icon-shake-on-hover size-5" />
            </Link>

            {/* Notifications Popover Trigger */}
            <div ref={notificationRef} className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="buyer-header-icon group relative flex size-9 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 hover:text-[#457D00]"
                aria-label="Toggle notifications modal"
                aria-expanded={notificationsOpen}
                aria-haspopup="dialog"
              >
                <Bell className="icon-shake-on-hover size-5" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white shadow-sm">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </button>

              {notificationsOpen ? (
                <NotificationDropdownComponent onClose={() => setNotificationsOpen(false)} />
              ) : null}
            </div>

            <BuyerAccountMenu onActionComplete={() => setMenuOpen(false)} />

            <Button
              type="button"
              variant="ghost"
              className="buyer-header-cta group relative flex min-h-10 items-center gap-1.5 rounded-xl border border-neutral-200/80 bg-background px-3 text-xs font-semibold text-foreground hover:bg-muted"
              aria-label={`Open cart, ${cartReady ? itemCount : 0} items`}
              onClick={() => {
                setDrawerOpen(true);
                setMenuOpen(false);
              }}
            >
              <ShoppingCart aria-hidden="true" className="cart-wiggle-on-hover size-4 text-[#457D00]" />
              <span className="hidden sm:inline">Cart</span>
              {cartReady && itemCount > 0 ? (
                <span key={itemCount} className="cart-count-bump inline-flex size-5 items-center justify-center rounded-full bg-[#457D00] text-xs font-bold text-white">
                  {itemCount}
                </span>
              ) : null}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-10 min-h-10 min-w-10 rounded-xl lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </PageContainer>
      </div>

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
