"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Link2, MoreHorizontal, Share2 } from "lucide-react";
import { useBuyerWishlist } from "@/src/features/wishlist/WishlistProvider";

const iconButton =
  "flex size-11 items-center justify-center rounded-full border border-[#E5E2DA] bg-white text-neutral-700 transition hover:border-[#457D00]/40 hover:text-[#457D00] active:scale-95 cursor-pointer disabled:opacity-50";

export function ProductListingActions({ productId, productName }: { productId: string; productName: string }) {
  const { savedProductIds, toggleProduct, pendingProductIds } = useBuyerWishlist();
  const isSaved = savedProductIds.has(productId);
  const isPending = pendingProductIds.has(productId);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2000);
    return () => clearTimeout(timer);
  }, [notice]);

  async function copyLink() {
    setMenuOpen(false);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("Link copied");
    } catch {
      setNotice("Could not copy link");
    }
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: productName, url: window.location.href });
      } catch {
        // The share sheet was closed, so there is nothing to report.
      }
      return;
    }
    await copyLink();
  }

  return (
    <div className="relative flex items-center gap-2">
      <button type="button" onClick={() => void share()} aria-label="Share listing" className={iconButton}>
        <Share2 className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => void toggleProduct(productId)}
        disabled={isPending}
        aria-pressed={isSaved}
        aria-label={isSaved ? "Remove from saved items" : "Save listing"}
        className={`${iconButton} ${isSaved ? "border-red-200 bg-red-50 text-red-600" : ""}`}
      >
        <Heart className={`size-4 ${isSaved ? "fill-red-500" : "fill-transparent"}`} />
      </button>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="More options"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className={iconButton}
        >
          <MoreHorizontal className="size-4" />
        </button>
        {menuOpen ? (
          <div role="menu" className="absolute right-0 top-12 z-20 w-44 overflow-hidden rounded-2xl border border-[#E5E2DA] bg-white p-1.5 shadow-md">
            <button
              type="button"
              role="menuitem"
              onClick={() => void copyLink()}
              className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 text-left text-sm font-medium text-neutral-800 transition hover:bg-[#F0F7EB] cursor-pointer"
            >
              <Link2 className="size-4 text-[#457D00]" />
              Copy link
            </button>
          </div>
        ) : null}
      </div>
      <span role="status" aria-live="polite" className="sr-only">{notice}</span>
      {notice ? (
        <span className="pointer-events-none absolute right-6 top-20 rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          {notice}
        </span>
      ) : null}
    </div>
  );
}
