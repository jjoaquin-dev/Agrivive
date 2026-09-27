"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/src/components/PageContainer";
import { useMarketplaceBrowser } from "../hooks/useMarketplaceBrowser";
import type { MarketplaceProductType } from "../types";
import { ActiveFilters } from "./ActiveFilters";
import { MarketplaceFilters } from "./MarketplaceFilters";
import { MarketplaceHero } from "./MarketplaceHero";
import { MarketplaceProductGrid } from "./MarketplaceProductGrid";

const PRODUCT_TYPES: MarketplaceProductType[] = [
  "Leafy Greens",
  "Root and Tuber Vegetables",
  "Bulb and Stem Vegetables",
  "Flower Vegetables",
  "Fruit Vegetables",
  "Seeds and Legumes",
];

function BrowserFallback() {
  return (
    <main className="min-h-screen bg-background py-8">
      <PageContainer>
        <Skeleton className="h-36 w-full rounded-2xl" />
        <Skeleton className="mt-6 h-36 w-full rounded-2xl" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => <Skeleton key={item} className="h-96 rounded-2xl" />)}
        </div>
      </PageContainer>
    </main>
  );
}

function MarketplaceBrowserContent() {
  const {
    products,
    nextCursor,
    searchInput,
    setSearchInput,
    loading,
    loadingMore,
    error,
    filters,
    searchQuery,
    hasLocation,
    filterProps,
    handleSearch,
    handleFilterChange,
    handleRemoveSearch,
    handleRemoveLocation,
    clearFilters,
    handleLoadMore,
    retry,
  } = useMarketplaceBrowser();

  return (
    <main className="min-h-[calc(100vh-72px)] bg-background py-6 text-foreground lg:py-8">
      <PageContainer>
        <MarketplaceHero searchInput={searchInput} onSearchInputChange={setSearchInput} onSearchSubmit={handleSearch} />
        <nav aria-label="Browse by produce category" className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => handleFilterChange("productType", "")}
            aria-pressed={!filters.productType}
            className={`min-h-11 shrink-0 rounded-full px-4 text-xs font-semibold transition-colors ${!filters.productType ? "bg-agrivive-primary text-white shadow-xs" : "border border-border bg-white text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >All produce</button>
          {PRODUCT_TYPES.map((type) => {
            const isSelected = filters.productType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleFilterChange("productType", isSelected ? "" : type)}
                aria-pressed={isSelected}
                className={`min-h-11 shrink-0 rounded-full px-4 text-xs font-semibold transition-colors ${isSelected ? "bg-agrivive-primary text-white shadow-xs" : "border border-border bg-white text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >{type}</button>
            );
          })}
        </nav>

        <div className="mt-3">
          <MarketplaceFilters {...filterProps} idPrefix="marketplace-filter" />
        </div>
        <div className="py-4">
          <p className="font-semibold text-foreground">{loading ? "Finding produce..." : `${products.length} listings shown`}</p>
        </div>
        <section aria-live="polite">
          <ActiveFilters
            filters={filters}
            search={searchQuery}
            hasLocation={hasLocation}
            onRemoveFilter={(key) => handleFilterChange(key, "")}
            onRemoveSearch={handleRemoveSearch}
            onRemoveLocation={handleRemoveLocation}
            onClearAll={clearFilters}
          />
          <MarketplaceProductGrid
            products={products}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            nextCursor={nextCursor}
            onRetry={retry}
            onLoadMore={handleLoadMore}
          />
        </section>
      </PageContainer>
    </main>
  );
}

export function MarketplaceBrowser() {
  return <Suspense fallback={<BrowserFallback />}><MarketplaceBrowserContent /></Suspense>;
}
