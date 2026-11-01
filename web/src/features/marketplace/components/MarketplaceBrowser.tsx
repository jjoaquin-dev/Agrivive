"use client";

import { Suspense, useCallback, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/src/components/PageContainer";
import { useMarketplaceBrowser } from "../hooks/useMarketplaceBrowser";
import { ActiveFilters } from "./ActiveFilters";
import { MarketplaceHero } from "./MarketplaceHero";
import { MarketplaceDealsRow } from "./MarketplaceDealsRow";
import { MarketplaceSellerSection } from "./MarketplaceSellerSection";
import { MarketplaceProductGrid } from "./MarketplaceProductGrid";
import { MarketplaceFooter } from "./MarketplaceFooter";

function BrowserFallback() {
  return (
    <main className="min-h-screen bg-[#fdfdfd] py-8">
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
    handleUseCoordinates,
  } = useMarketplaceBrowser();

  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);

  const mapParams = new URLSearchParams(searchKey);
  const handleSelectSellerFromMap = useCallback((sellerId: string) => {
    setSelectedSellerId(sellerId);
  }, []);

  const handleSelectSellerFromCard = useCallback((sellerId: string) => {
    setSelectedSellerId(sellerId);
    window.requestAnimationFrame(() => {
      document.getElementById("interactive-seller-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-68px)] flex-col bg-[#fdfdfd]">
      <main className="flex-1 py-6 text-foreground lg:py-8">
        <PageContainer className="space-y-8 lg:space-y-10">
          {/* 1. Hero */}
          <MarketplaceHero
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            onSearchSubmit={handleSearch}
          />

          {/* 2. Priority deals (hidden when there are none) */}
          <MarketplaceDealsRow />

          {/* 5. Results */}
          <section>
            <div className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#457D00]">
                Today&apos;s selection
              </p>
              <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-[#14231A]">
                Fresh produce near you
              </h2>
              <p className="mt-0.5 text-xs text-[#5F7367]">
                {products.length} {products.length === 1 ? "listing" : "listings"} available
              </p>
            </div>

            <div className="mb-6">
              <ActiveFilters
                filters={filters}
                search={searchQuery}
                hasLocation={hasLocation}
                onRemoveFilter={(key) => handleFilterChange(key, "")}
                onRemoveSearch={handleRemoveSearch}
                onRemoveLocation={handleRemoveLocation}
                onClearAll={clearFilters}
              />
            </div>

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
              onSelectSeller={handleSelectSellerFromCard}
            />
          </section>

          {/* 6. Find a seller nearby (map and seller cards), after the products */}
          <div id="interactive-seller-map">
            <MarketplaceSellerSection
              sellers={sellerMap.sellers}
              unmappedSellerCount={sellerMap.unmappedSellerCount}
              latitude={mapParams.get("latitude") ? Number(mapParams.get("latitude")) : null}
              longitude={mapParams.get("longitude") ? Number(mapParams.get("longitude")) : null}
              radiusKm={mapParams.get("radiusKm") ? Number(mapParams.get("radiusKm")) : null}
              selectedSellerId={selectedSellerId}
              loading={sellerMapLoading}
              error={sellerMapError}
              onSelectSeller={handleSelectSellerFromMap}
              onRetry={retrySellerMap}
            />
          </div>
        </PageContainer>
      </main>

      {/* 5. Dark Forest Green Footer */}
      <MarketplaceFooter />
    </div>
  );
}

export function MarketplaceBrowser() {
  return (
    <Suspense fallback={<BrowserFallback />}>
      <MarketplaceBrowserContent />
    </Suspense>
  );
}
