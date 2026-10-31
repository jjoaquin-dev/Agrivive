"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState, useRef, useEffect, FormEvent } from "react";
import { Bell, ChevronDown, Menu, MessageCircle, Search, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { useCart } from "@/src/features/cart/CartProvider";
import { NotificationDropdownComponent } from "@/src/features/notifications/components/NotificationDropdownComponent";
import { useBuyerNotifications } from "@/src/features/notifications/hooks/useBuyerNotifications";
import { PageContainer } from "./PageContainer";
import { BuyerAccountMenu } from "./BuyerAccountMenu";
import { BuyerSiteHeaderNav, BuyerSiteHeaderNavFallback } from "./BuyerSiteHeaderNav";
import { HeaderCategoryDropdown } from "./HeaderCategoryDropdown";

const navCategories = [
  "All Categories",
  "Leafy Greens",
  "Fruit Vegetables",
  "Root Vegetables",
  "Pod Vegetables",
  "Tuber Vegetables",
  "Bulb Vegetables",
];

export function BuyerSiteHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
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

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory !== "All Categories") params.set("productType", selectedCategory);
    router.push(`/marketplace?${params.toString()}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/95 backdrop-blur shadow-xs">
      {/* Top Main Bar */}
      <div className="border-b border-neutral-100 py-2.5">
        <PageContainer className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-1.5" aria-label="Agrivive home">
            <Image
              src="/brand/agrivive-logo-full-new.png"
              alt="Agrivive"
              width={130}
              height={36}
              className="h-[36px] w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          {/* Integrated Search Bar (Landing Page Style) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl items-center rounded-full border border-neutral-300 bg-neutral-50/70 p-1 pl-4 transition-all focus-within:border-[#457D00] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#457D00]/20"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vegetable name..."
              className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-500 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none"
            />
            <HeaderCategoryDropdown
              categories={navCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <button
              type="submit"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#457D00] text-white shadow-xs transition-transform hover:bg-[#386600] active:scale-95"
              aria-label="Search produce"
            >
              <Search className="size-4" />
            </button>
          </form>

          {/* User & Marketplace Actions */}
          <div className="flex items-center gap-3">
            {/* Messages & Notifications (left side of profile avatar) */}
            <Link
              href="/messages"
              className="relative flex size-9 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 hover:text-[#457D00]"
              aria-label="Messages"
            >
              <MessageCircle className="size-5" />
            </Link>

            {/* Notifications Popover Trigger */}
            <div ref={notificationRef} className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="relative flex size-9 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 hover:text-[#457D00]"
                aria-label="Toggle notifications modal"
                aria-expanded={notificationsOpen}
                aria-haspopup="dialog"
              >
                <Bell className="size-5" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-2xs">
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
              className="relative flex min-h-10 items-center gap-1.5 rounded-xl border border-neutral-200/80 bg-background px-3 text-xs font-semibold text-foreground hover:bg-muted"
              aria-label={`Open cart, ${cartReady ? itemCount : 0} items`}
              onClick={() => {
                setDrawerOpen(true);
                setMenuOpen(false);
              }}
            >
              <ShoppingCart aria-hidden="true" className="size-4 text-[#457D00]" />
              <span className="hidden sm:inline">Cart</span>
              {cartReady && itemCount > 0 ? (
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#457D00] text-[10px] font-bold text-white">
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
