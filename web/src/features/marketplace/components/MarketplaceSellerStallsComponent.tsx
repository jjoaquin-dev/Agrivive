import Link from "next/link";
import { ArrowUpRight, MapPin, Store } from "lucide-react";
import type { StallOverviewItem } from "../api/overview";

interface Props {
  stalls: StallOverviewItem[];
}

export const MarketplaceSellerStallsComponent = ({ stalls }: Props) => {
  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-50 p-1.5 text-[#457D00]">
              <Store className="size-4" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">
              Participating Market Stalls
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Verified local sellers and market vendors offering surplus produce in Davao City
          </p>
        </div>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#457D00] hover:underline"
        >
          <span>Browse All</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stalls.map((stall) => (
          <div
            key={stall.id}
            className="flex flex-col justify-between rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 transition hover:border-neutral-200 hover:bg-white"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-neutral-900">{stall.shopName}</span>
                <span className="shrink-0 rounded-full bg-lime-100 px-2 py-0.5 text-[10px] font-bold text-[#457D00]">
                  {stall.activeListings} Active Lots
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 flex items-center gap-1 text-xs text-neutral-500">
                <MapPin className="size-3 shrink-0 text-neutral-400" />
                <span>{stall.detailAddress}</span>
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-neutral-200/60 pt-2.5 text-xs">
              <span className="text-neutral-500">Available Surplus</span>
              <span className="font-bold text-neutral-900">{stall.totalStockKg} kg</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
