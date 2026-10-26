import { Clock, MapPin } from "lucide-react";
import { getDirectionsUrl } from "@/src/lib/maps";
import { sellerTypeLabel } from "../marketplace-labels";
import type { MarketplaceSellerProfile } from "../types";
import { SellerFollowButton } from "./SellerFollowButton";
import { SellerProfileAvatar } from "./SellerProfileAvatar";
import { MessageSellerButton } from "./MessageSellerButton";

export function SellerStorefrontHeader({ seller }: { seller: MarketplaceSellerProfile }) {
  const directionsUrl = getDirectionsUrl(seller.latitude, seller.longitude);

  return (
    <header className="rounded-[24px] border border-[#E8E8E8] bg-white p-6 shadow-sm flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
      {/* Left Column: Avatar & Vendor Identity */}
      <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
        <SellerProfileAvatar imageUrl={seller.image} shopName={seller.shopName} />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-[26px] font-bold text-neutral-900 leading-tight">
              {seller.shopName}
            </h1>
            <span className="inline-flex items-center rounded-full bg-[#EAF7ED] px-2.5 py-0.5 text-[11px] font-bold text-[#16A34A] uppercase tracking-wide">
              {sellerTypeLabel(seller.sellerType)}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <SellerFollowButton sellerId={seller.id} />
            <MessageSellerButton context="seller" id={seller.id} iconOnly />
          </div>

          <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-500 pt-0.5 max-w-md">
            Browse the fresh produce this seller has available for pickup at local markets.
          </p>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="hidden lg:block h-28 w-px bg-neutral-200/80 shrink-0" aria-hidden="true" />

      {/* Right Column: Pickup Location & Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 pt-4 lg:pt-0 border-t border-neutral-100 lg:border-t-0 shrink-0 lg:max-w-xl">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF7ED] text-[#16A34A]">
            <MapPin className="size-4.5" aria-hidden="true" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <h3 className="text-[13px] font-bold text-neutral-900">Pickup location</h3>
            <p className="text-xs text-neutral-500 leading-snug line-clamp-2">
              {seller.detailAddress || "Bankerohan Public Market, Stall #42"}
            </p>
            {directionsUrl ? (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs font-bold text-[#16A34A] hover:underline pt-0.5"
              >
                Get directions
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF4E5] text-[#EA580C]">
            <Clock className="size-4.5" aria-hidden="true" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <h3 className="text-[13px] font-bold text-neutral-900">Pickup details</h3>
            <p className="text-xs text-neutral-500 leading-snug">
              {seller.pickupInstructions || "Ask the seller about the best pickup time after reserving your items."}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
