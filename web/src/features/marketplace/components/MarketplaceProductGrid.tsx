import { RefreshCw, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketplaceProduct } from "../types";
import { ProductCard } from "./ProductCard";

interface MarketplaceProductGridProps {
  products: MarketplaceProduct[];
  loading: boolean;
  stale: boolean;
  loadingMore: boolean;
  error: string;
  nextCursor: string | null;
  onRetry: () => void;
  onLoadMore: () => void;
  selectedSellerId: string | null;
  onSelectSeller: (sellerId: string) => void;
}

export function MarketplaceProductGrid({
  products,
  loading,
  stale,
  loadingMore,
  error,
  nextCursor,
  onRetry,
  onLoadMore,
  selectedSellerId,
  onSelectSeller,
}: MarketplaceProductGridProps) {
  if (loading && !products.length) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Skeleton key={item} className="h-80 rounded-[18px]" />
        ))}
      </div>
    );
  }

  if (error && !products.length) {
    return <Alert variant="destructive" className="mb-5"><RefreshCw className="size-4" />
      <AlertTitle>Listings could not load</AlertTitle><AlertDescription>{error}</AlertDescription>
      <Button type="button" variant="outline" className="mt-3 min-h-11" onClick={onRetry}>Try again</Button>
    </Alert>;
  }

  if (products.length === 0) {
    return (
      <Empty className="min-h-72 border-border/80 bg-white/70 py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon"><Search /></EmptyMedia>
          <EmptyTitle>No listings match yet</EmptyTitle>
          <EmptyDescription>Try a wider search or change your filters.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      {error ? <Alert variant="destructive" className="mb-4"><RefreshCw className="size-4" />
        <AlertTitle>Listings could not refresh</AlertTitle>
        <AlertDescription>{stale ? "Showing previous listings. Prices and stock may have changed." : error}</AlertDescription>
        <Button type="button" variant="outline" className="mt-3 min-h-11" onClick={onRetry}>Try again</Button>
      </Alert> : null}
      {loading && stale ? <p className="mb-3 text-sm text-muted-foreground" role="status">Updating listings. Previous results are shown below.</p> : null}
      <div className={`grid gap-4 sm:grid-cols-2 ${stale ? "pointer-events-none opacity-70" : ""}`} inert={stale}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selected={selectedSellerId === product.seller.id}
            onSelectSeller={onSelectSeller}
          />
        ))}
      </div>
      {nextCursor && !stale ? (
        <div className="flex justify-center pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="min-h-11 rounded-xl px-6 font-semibold"
          >
            {loadingMore ? "Loading listings…" : "Load more listings"}
          </Button>
        </div>
      ) : null}
    </>
  );
}
