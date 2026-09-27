import Link from "next/link";
import { Info, MapPin, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import type { BuyerOrder, MarketplaceProduct } from "@/src/features/marketplace/types";

interface OrderSellerCardProps {
  order: BuyerOrder;
  product: MarketplaceProduct | null;
}

export function OrderSellerCard({ order, product }: OrderSellerCardProps) {
  return (
    <Card className="overflow-hidden border-border/80 bg-white">
      <CardHeader className="border-b border-border/60 pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
          <Store className="size-4 text-agrivive-primary" aria-hidden="true" />
          Market stall & pickup location
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {product ? (
          <div className="space-y-3">
            <div>
              <Link
                href={`/sellers/${product.seller.id}`}
                className="font-heading text-lg font-bold text-agrivive-primary hover:underline"
              >
                {product.seller.shopName}
              </Link>
              <p className="text-xs capitalize text-muted-foreground">
                {product.seller.sellerType.replaceAll("_", " ")}
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-agrivive-background/60 p-3.5 text-sm">
              <p className="flex items-start gap-2 font-medium text-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-agrivive-primary" aria-hidden="true" />
                <span>{product.seller.detailAddress}</span>
              </p>
              {product.seller.pickupInstructions ? (
                <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                  <Info className="mt-0.5 size-3.5 shrink-0 text-agrivive-sage" aria-hidden="true" />
                  <span>{product.seller.pickupInstructions}</span>
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {order.items.map((item) => (
                <Link
                  key={item.id}
                  href={`/marketplace/${item.productId}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  View {item.productName}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            Stall pickup details are no longer available for this listing.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
