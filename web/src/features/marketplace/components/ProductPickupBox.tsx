import { Compass, MapPin } from "lucide-react";
import { getDirectionsUrl } from "@/src/lib/maps";
import type { MarketplaceProduct } from "../types";

/** Where to pick up, plus the seller's Trusted, Away and Closed badges. */
export function ProductPickupBox({ seller }: { seller: MarketplaceProduct["seller"] }) {
  const directionsUrl = getDirectionsUrl(seller.latitude, seller.longitude, seller.detailAddress);

  return (
    <>
    {/* Pickup Location Box */}
    <div className="space-y-1.5 rounded-2xl border border-agrivive-line bg-agrivive-wash p-4 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-foreground">Pickup details</span>
        {directionsUrl ? (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-agrivive-primary hover:text-agrivive-primary/80 hover:underline"
          >
            <Compass className="size-3.5 shrink-0" aria-hidden="true" />
            <span>Get Direction</span>
          </a>
        ) : null}
      </div>
      <p className="flex items-start gap-1.5 text-foreground">
        <MapPin className="mt-0.5 size-4 shrink-0 text-agrivive-primary" />
        <span>{seller.detailAddress}</span>
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {seller.pickupInstructions || "Ask the seller for the best pickup time after reserving."}
      </p>
    </div>

    {seller.away || seller.closedToday || seller.trustedSeller ? (
      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        {seller.trustedSeller ? <span className="rounded-full bg-[#E5F3D4] px-3 py-1 text-agrivive-forest">Trusted Seller</span> : null}
        {seller.away ? <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-amber-800">Away: replies may be slow. Pickups are not changed.</span> : null}
        {seller.closedToday ? <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700">Closed today. Choose tomorrow.</span> : null}
      </div>
    ) : null}
    </>
  );
}
