"use client";

import { Suspense, useCallback, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/src/components/PageContainer";
import { useMarketplaceBrowser } from "../hooks/useMarketplaceBrowser";
import { ActiveFilters } from "./ActiveFilters";
import { MarketplaceFilterSidebar } from "./MarketplaceFilterSidebar";
import { MarketplaceHero } from "./MarketplaceHero";
import { MarketplaceCategories } from "./MarketplaceCategories";
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
  const [showMap, setShowMap] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const mapParams = new URLSearchParams(searchKey);
  const handleSelectSellerFromMap = useCallback((sellerId: string) => {
    setSelectedSellerId(sellerId);
  }, []);

  const handleSelectSellerFromCard = useCallback((sellerId: string) => {
    setSelectedSellerId(sellerId);
    setShowMap(true);
    window.requestAnimationFrame(() => {
      document.getElementById("interactive-seller-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  // Calculate active filter count for mobile badge
  const activeFilterCount = [
    Boolean(searchQuery),
    hasLocation,
    Boolean(filters.productType),
    Boolean(filters.unit),
    Boolean(filters.sellerType),
    Boolean(filters.minPrice || filters.maxPrice),
    Boolean(filters.minQuantity || filters.maxQuantity),
  ].filter(Boolean).length;

  return (
    <div className="flex min-h-[calc(100vh-68px)] flex-col bg-[#fdfdfd]">
      <main className="flex-1 py-6 text-foreground lg:py-8">
        <PageContainer className="space-y-8 lg:space-y-10">
          {/* 1. Hero Section */}
          <MarketplaceHero
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            onSearchSubmit={handleSearch}
          />

          {/* 2. Shop by Category Section */}
          <MarketplaceCategories
            selectedType={filters.productType}
            onSelectCategory={(type) => handleFilterChange("productType", type)}
          />

          {/* 3. Find a Seller Nearby Section */}
          {showMap && (
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
                onCloseMap={() => setShowMap(false)}
              />
            </div>
          )}

          {/* 4. Fresh produce near you Section */}
          <section className="pt-1">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
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

              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="inline-flex lg:hidden items-center gap-1.5 rounded-xl border border-neutral-200/80 bg-white px-3 py-2 text-xs font-semibold text-[#14231A] shadow-2xs hover:bg-[#FAF9F5] active:scale-95 transition"
                >
                  <SlidersHorizontal className="size-3.5 text-[#457D00]" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="inline-flex size-4 items-center justify-center rounded-full bg-[#457D00] text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
              {/* Left Column: Desktop Sticky Filter Sidebar */}
              <div className="hidden lg:block lg:sticky lg:top-[124px]">
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
                  onUseCoordinates={handleUseCoordinates}
                />
              </div>

              {/* Mobile Filter Drawer */}
              <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                <SheetContent side="left" className="w-[310px] overflow-y-auto p-4 sm:max-w-md">
                  <SheetHeader className="border-none px-1 pb-3">
                    <SheetTitle className="text-base text-[#457D00]">Filter Produce</SheetTitle>
                  </SheetHeader>
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
                    onUseCoordinates={handleUseCoordinates}
                  />
                </SheetContent>
              </Sheet>

              {/* Right Column: Product Grid */}
              <div className="min-w-0 space-y-6">
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
                  onSelectSeller={handleSelectSellerFromCard}
                />
              </div>
            </div>
          </section>
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
