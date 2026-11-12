import Link from "next/link";
import { Compass, MapPin, Store, User } from "lucide-react";
import type { BuyerOrder, MarketplaceProduct } from "@/src/features/marketplace/types";
import { getDirectionsUrl } from "@/src/lib/maps";

interface OrderSellerCardProps {
  order: BuyerOrder;
  product: MarketplaceProduct | null;
}

export function OrderSellerCard({ product }: OrderSellerCardProps) {
  const directionsUrl = product ? getDirectionsUrl(product.seller.latitude, product.seller.longitude) : null;

  return (
    <div className="rounded-2xl border border-agrivive-line bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store className="size-5 text-agrivive-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-agrivive-ink">
            Market stall & pickup location
          </h2>
        </div>
        {product ? (
          <Link
            href={`/sellers/${product.seller.id}`}
            className="text-sm font-semibold text-agrivive-primary hover:text-agrivive-primary/80 hover:underline"
          >
            View Stall
          </Link>
        ) : null}
      </div>

      <div className="mt-4">
        {product ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-11 shrink-0 overflow-hidden rounded-full border border-agrivive-line bg-neutral-100 flex items-center justify-center">
                {product.seller.image ? (
                  <img src={product.seller.image} alt={product.seller.shopName} className="size-full object-cover" />
                ) : (
                  <User className="size-5 text-neutral-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-agrivive-ink">{product.seller.shopName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-xl bg-agrivive-wash border border-agrivive-border p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EBF5E3] text-agrivive-primary">
                <MapPin className="size-4.5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-agrivive-ink">{product.seller.detailAddress || "Stall #___, Bankerohan Public Market"}</p>
                <p className="text-xs text-neutral-500">Davao City, Philippines</p>
                {directionsUrl ? (
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-agrivive-primary hover:underline"
                  >
                    <Compass className="size-3.5" />
                    <span>Get directions</span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Market stall information is unavailable.</p>
        )}
      </div>
    </div>
  );
}
