"use client";

import { Suspense, useCallback, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/src/components/PageContainer";
import { useMarketplaceBrowser } from "../hooks/useMarketplaceBrowser";
import { ActiveFilters } from "./ActiveFilters";
import { MarketplaceFilterSidebar } from "./MarketplaceFilterSidebar";
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
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-96 rounded-2xl" />
          ))}
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
    staleProducts,
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
  const [showMap, setShowMap] = useState(true);

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
        <MarketplaceHero
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onSearchSubmit={handleSearch}
        />

        <section aria-live="polite" className="mt-8 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          {/* Left Column: Filter Sidebar */}
          <div className="lg:sticky lg:top-[124px]">
            <MarketplaceFilterSidebar
              values={filterProps.values}
              onChange={handleFilterChange}
              onClearAll={clearFilters}
              resultsCount={products.length}
              showMap={showMap}
              onToggleMap={setShowMap}
              hasLocation={hasLocation}
              locationStatus={locationStatus}
              locationError={locationError}
              onUseLocation={handleUseLocation}
            />
          </div>

          {/* Right Column: Main Content Area */}
          <div className="min-w-0 space-y-6">
            {/* Collapsible Interactive Map Strip */}
            {showMap && (
              <div className="relative isolate z-0 overflow-hidden rounded-[24px] border border-border/80 bg-white p-2 shadow-[0_8px_24px_rgba(31,77,58,0.04)]">
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
            )}

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
              stale={staleProducts}
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
  return (
    <Suspense fallback={<BrowserFallback />}>
      <MarketplaceBrowserContent />
    </Suspense>
  );
}
