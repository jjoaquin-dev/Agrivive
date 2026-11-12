"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Store, UserMinus } from "lucide-react";
import { listSellerFollows, removeSellerFollow, type FollowedSeller } from "@/src/features/marketplace/api/seller-follows";

export function ProfileFollowedSellers() {
  const [sellers, setSellers] = useState<FollowedSeller[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    listSellerFollows(controller.signal)
      .then((res) => setSellers(res.sellers))
      .catch(() => { if (!controller.signal.aborted) setError("Could not load the sellers you follow."); });
    return () => controller.abort();
  }, []);

  async function unfollow(sellerId: string) {
    setError("");
    try {
      await removeSellerFollow(sellerId);
      setSellers((current) => current?.filter((s) => s.sellerId !== sellerId) ?? null);
    } catch {
      setError("Could not unfollow this seller. Try again.");
    }
  }

  return (
    <div className="rounded-2xl border border-agrivive-border bg-white p-6 shadow-[0_4px_20px_rgba(20,35,26,0.05)]">
      <h2 className="font-heading text-lg font-bold text-neutral-900">Sellers You Follow</h2>
      <p className="mt-1 text-xs text-neutral-500">You get a notice when they post, restock or lower a price.</p>
      {error ? <p role="alert" className="mt-3 text-xs text-destructive">{error}</p> : null}
      {sellers === null && !error ? <div className="mt-4 h-16 animate-pulse rounded-2xl bg-neutral-100" /> : null}
      {sellers?.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-600">You are not following any sellers yet. Open a stall and tap Follow.</p>
      ) : (
        <ul className="mt-4 divide-y divide-neutral-100">
          {sellers?.map((seller) => (
            <li key={seller.sellerId} className="flex items-center gap-3 py-3">
              <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-agrivive-mist text-agrivive-primary">
                {seller.image ? <img src={seller.image} alt="" className="size-full object-cover" /> : <Store className="size-5" />}
              </div>
              <Link href={`/sellers/${seller.sellerId}`} className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-neutral-900 hover:text-agrivive-primary">{seller.shopName}</p>
                <p className="truncate text-xs text-neutral-500">{seller.address}</p>
              </Link>
              <button
                type="button"
                onClick={() => void unfollow(seller.sellerId)}
                className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-agrivive-border px-4 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                <UserMinus className="size-3.5" aria-hidden="true" /> Unfollow
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
