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
  loadingMore: boolean;
  error: string;
  nextCursor: string | null;
  onRetry: () => void;
  onLoadMore: () => void;
}

export function MarketplaceProductGrid({
  products,
  loading,
  loadingMore,
  error,
  nextCursor,
  onRetry,
  onLoadMore,
}: MarketplaceProductGridProps) {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-5">
        <RefreshCw className="size-4" />
        <AlertTitle>Listings could not load</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button type="button" variant="outline" onClick={onRetry}>Try again</Button>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Skeleton key={item} className="h-96 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Empty>
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
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {nextCursor ? (
        <div className="flex justify-center pt-8">
          <Button type="button" variant="outline" onClick={onLoadMore} disabled={loadingMore}>
            {loadingMore ? "Loading listings…" : "Load more listings"}
          </Button>
        </div>
      ) : null}
    </>
  );
}
