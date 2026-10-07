import { MapPin, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDirectionsUrl } from "@/src/lib/maps";
import { sellerTypeLabel } from "../marketplace-labels";
import type { MarketplaceSellerProfile } from "../types";
import { SellerFollowButton } from "./SellerFollowButton";
import { SellerProfileAvatar } from "./SellerProfileAvatar";

export function SellerStorefrontHeader({ seller }: { seller: MarketplaceSellerProfile }) {
  const directionsUrl = getDirectionsUrl(seller.latitude, seller.longitude);

  return (
    <header className="mt-5 grid gap-5 rounded-[20px] border border-border/80 bg-white p-5 shadow-[0_14px_32px_rgba(31,77,58,0.08)] md:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)] md:items-center md:gap-10 md:p-8">
      <div className="flex min-w-0 items-start gap-4 border-l-4 border-primary pl-4 sm:pl-5">
        <SellerProfileAvatar imageUrl={seller.image} shopName={seller.shopName} />
        <div className="min-w-0">
          <Badge variant="secondary" className="mb-2">{sellerTypeLabel(seller.sellerType)}</Badge>
          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">{seller.shopName}</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Browse the fresh produce this seller has available for pickup.
          </p>
          <SellerFollowButton sellerId={seller.id} />
        </div>
      </div>

      <dl className="grid gap-4 border-t border-border/70 pt-4 text-sm md:border-l md:border-t-0 md:pl-6 md:pt-0">
        <div>
          <dt className="flex items-center gap-2 font-semibold text-foreground">
            <MapPin aria-hidden="true" className="size-4 shrink-0 text-primary" />Pickup location
          </dt>
          <dd className="mt-1 pl-6 leading-6 text-muted-foreground">{seller.detailAddress}</dd>
          {directionsUrl ? <a href={directionsUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center pl-6 text-sm font-semibold text-agrivive-primary hover:underline">Get directions</a> : null}
        </div>
        <div>
          <dt className="flex items-center gap-2 font-semibold text-foreground">
            <Store aria-hidden="true" className="size-4 shrink-0 text-primary" />Pickup details
          </dt>
          <dd className="mt-1 pl-6 leading-6 text-muted-foreground">
            {seller.pickupInstructions || "Ask the seller about the best pickup time after reserving."}
          </dd>
        </div>
      </dl>
    </header>
  );
}
