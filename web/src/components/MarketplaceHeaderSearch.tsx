import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MarketplaceProductType } from "@/src/features/marketplace/types";
import { cn } from "@/lib/utils";

export const MARKETPLACE_PRODUCT_TYPES: { value: MarketplaceProductType; label: string }[] = [
  { value: "Leafy Greens", label: "Greens" },
  { value: "Root and Tuber Vegetables", label: "Roots & tubers" },
  { value: "Bulb and Stem Vegetables", label: "Bulbs & stems" },
  { value: "Flower Vegetables", label: "Flower vegetables" },
  { value: "Fruit Vegetables", label: "Fruit vegetables" },
  { value: "Seeds and Legumes", label: "Seeds & legumes" },
];

export function MarketplaceHeaderSearch({ idPrefix, className = "" }: { idPrefix: string; className?: string }) {
  return (
    <form action="/marketplace" method="get" role="search" className={cn("flex min-w-0", className)}>
      <label htmlFor={`${idPrefix}-product-type`} className="sr-only">Choose a produce category</label>
      <select id={`${idPrefix}-product-type`} name="productType" defaultValue="" className="min-h-11 w-32 shrink-0 rounded-l-lg border border-r-0 border-input bg-muted/50 px-3 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 sm:w-36">
        <option value="">All produce</option>
        {MARKETPLACE_PRODUCT_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
      </select>
      <label htmlFor={`${idPrefix}-marketplace-search`} className="sr-only">Search produce or seller</label>
      <input id={`${idPrefix}-marketplace-search`} name="search" type="search" placeholder="Search produce or seller" className="min-h-11 min-w-0 flex-1 border-y border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30" />
      <Button type="submit" size="icon" aria-label="Search marketplace" className="min-h-11 min-w-11 rounded-l-none rounded-r-lg">
        <Search aria-hidden="true" />
      </Button>
    </form>
  );
}
