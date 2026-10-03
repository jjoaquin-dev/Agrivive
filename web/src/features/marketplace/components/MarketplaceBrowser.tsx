"use client";

import { Suspense, useCallback, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/src/components/PageContainer";
import { useMarketplaceBrowser } from "../hooks/useMarketplaceBrowser";
import { ActiveFilters } from "./ActiveFilters";
import { MarketplaceFilters } from "./MarketplaceFilters";
import { MarketplaceHero } from "./MarketplaceHero";
import { MarketplaceProductGrid } from "./MarketplaceProductGrid";
import { InteractiveSellerMap } from "./InteractiveSellerMap";

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
    searchKey,
    products,
    nextCursor,
    searchInput,
    setSearchInput,
    loading,
    loadingMore,
    error,
    sellerMap,
    sellerMapLoading,
    sellerMapError,
    filters,
    searchQuery,
    hasLocation,
    locationStatus,
    locationError,
    filterProps,
    handleSearch,
    handleFilterChange,
    handleRemoveSearch,
    handleRemoveLocation,
    clearFilters,
    handleLoadMore,
    retrySellerMap,
    retry,
    handleUseLocation,
  } = useMarketplaceBrowser();
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const mapParams = new URLSearchParams(searchKey);
  const handleSelectSeller = useCallback((sellerId: string) => {
    setSelectedSellerId(sellerId);
    window.requestAnimationFrame(() => {
      document.getElementById(`seller-card-${sellerId}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, []);

  return (
    <main className="min-h-[calc(100vh-68px)] bg-background py-6 text-foreground lg:py-10">
      <PageContainer>
        <MarketplaceHero searchInput={searchInput} onSearchInputChange={setSearchInput} onSearchSubmit={handleSearch} />
        <div className="mt-3">
          <MarketplaceFilters {...filterProps} idPrefix="marketplace-filter" hasLocation={hasLocation} locationStatus={locationStatus} locationError={locationError} onUseLocation={handleUseLocation} />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border/80 pt-5">
          <p className="text-sm font-semibold text-foreground">Listings and pickup map</p>
          <p className="text-sm font-semibold text-agrivive-primary" aria-live="polite">{loading ? "Finding produce" : `${products.length} listings shown`}</p>
        </div>
        <section aria-live="polite" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,1.05fr)] lg:items-start">
          <div className="order-first lg:order-last lg:sticky lg:top-4">
            <InteractiveSellerMap
              sellers={sellerMap.sellers}
              unmappedSellerCount={sellerMap.unmappedSellerCount}
              latitude={mapParams.get("latitude") ? Number(mapParams.get("latitude")) : null}
              longitude={mapParams.get("longitude") ? Number(mapParams.get("longitude")) : null}
              radiusKm={mapParams.get("radiusKm") ? Number(mapParams.get("radiusKm")) : null}
              selectedSellerId={selectedSellerId}
              loading={sellerMapLoading}
              error={sellerMapError}
              onSelectSeller={handleSelectSeller}
              onRetry={retrySellerMap}
            />
          </div>
          <div className="min-w-0">
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
              selectedSellerId={selectedSellerId}
              onSelectSeller={handleSelectSeller}
            />
          </div>
        </section>
      </PageContainer>
    </main>
  );
}

export function MarketplaceBrowser() {
  return <Suspense fallback={<BrowserFallback />}><MarketplaceBrowserContent /></Suspense>;
}
