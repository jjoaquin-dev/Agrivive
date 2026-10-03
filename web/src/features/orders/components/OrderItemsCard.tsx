import { ShoppingBasket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BuyerOrderItem } from "@/src/features/marketplace/types";

function money(value: string | number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(value));
}

export function OrderItemsCard({ items }: { items: BuyerOrderItem[] }) {
  return (
    <Card className="overflow-hidden rounded-[20px] border-border/80 bg-white shadow-[0_10px_24px_rgba(31,77,58,0.05)]">
      <CardHeader className="border-b border-border/60 pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
          <ShoppingBasket className="size-4 text-agrivive-primary" aria-hidden="true" />
          Reserved produce ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border/60" aria-label="Reserved products">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 p-4 text-sm sm:px-6">
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {Number(item.quantity).toLocaleString()} {item.scalingType}
                </p>
              </div>
              <div className="text-right">
                <p className="font-heading font-bold text-agrivive-primary">{money(item.subtotal)}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
