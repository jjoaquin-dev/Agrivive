"use client";

import { useEffect, useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { useBuyerWishlist } from "@/src/features/wishlist/WishlistProvider";

const iconButton =
  "flex size-11 items-center justify-center rounded-full border border-agrivive-border bg-white text-neutral-700 transition hover:border-agrivive-primary/40 hover:text-agrivive-primary active:scale-95 cursor-pointer disabled:opacity-50";

export function ProductListingActions({ productId, productName }: { productId: string; productName: string }) {
  const { savedProductIds, toggleProduct, pendingProductIds } = useBuyerWishlist();
  const isSaved = savedProductIds.has(productId);
  const isPending = pendingProductIds.has(productId);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2000);
    return () => clearTimeout(timer);
  }, [notice]);

  async function copyLink() {
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
        className={`${iconButton} ${isSaved ? "border-red-200 bg-red-50 text-destructive" : ""}`}
      >
        <Heart className={`size-4 ${isSaved ? "fill-red-500" : "fill-transparent"}`} />
      </button>
      <span role="status" aria-live="polite" className="sr-only">{notice}</span>
      {notice ? (
        <span className="pointer-events-none absolute right-6 top-20 rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          {notice}
        </span>
      ) : null}
    </div>
  );
}
