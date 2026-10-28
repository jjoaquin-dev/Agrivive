# 2026-10-27 Marketplace Seller Distance and Map Locator Integration

## Context & Objectives
Fix the marketplace seller distance filter and interactive map integration. Previously, selecting a distance (`1km`, `3km`, `5km`, `10km`) did not render a radius circle on the Leaflet map, caused backend HTTP 400 Bad Request errors (`"Latitude, longitude, and radiusKm are required together"`), and failed to filter stalls or produce listings. Additionally, align the "Add to Cart" button across product cards to the official Agrivive primary brand green palette (`#457D00`).

## Why
- **Visibility of System Status & Jakob Nielsen**: Users must understand whether their location is active, currently detecting, or experiencing an error. Showing a distance pill as active when no location coordinates were bound created false mental models.
- **Postel's Law (Robustness Principle)**: Forgiving interaction design — when clicking a distance without active location, the system automatically triggers browser geolocation. If GPS access is denied or unavailable on desktop browsers, a one-click fallback to the central Davao City market hub (`7.0731, 125.6128`) allows immediate local browsing.
- **Law of Similarity & Common Region (Gestalt Psychology)**: 
  - The interactive Leaflet map now frames the user's location pin ("You are here") and radius circle bounds dynamically (`circle.getBounds()`), visually enclosing all eligible seller stalls within the highlighted zone.
  - The "Add to Cart" CTA buttons now use the canonical Forest Green (`#457D00`) with white text and icons, harmonizing with price displays, section headers, badges, and primary action standards across the application.
- **Tesler's Law (Conservation of Complexity)**: The frontend absorbs coordinate orchestration: synchronizing `latitude`, `longitude`, and `radiusKm` atomically so the backend query validation passes cleanly.

## What Changed
1. **`useMarketplaceLocation.ts`**:
   - Enhanced `handleUseLocation(preferredRadius?: string)` to pass the target radius directly on GPS resolution.
   - Added `handleUseCoordinates(latitude, longitude, preferredRadius?)` providing seamless manual and fallback coordinate assignment (e.g., Davao City center).

2. **`useMarketplaceBrowser.ts`**:
   - Initialized `radiusKm` to empty string (`""`) when not specified in query parameters, preventing deceptive default highlights.
   - Updated `handleFilterChange` so selecting a distance without coordinates triggers geolocation automatically, and clearing distance resets all location parameters in unison.
   - Exported `handleUseCoordinates` to consumers.

3. **`MarketplaceFilterSidebar.tsx`**:
   - Bound `hasLocation`, `locationStatus`, `locationError`, `onUseLocation`, and `onUseCoordinates`.
   - Distance pills now only highlight when location is genuinely active.
   - Added clear button when location is active and intuitive feedback states:
     - Detecting: `"Finding your location…"`
     - Active: `"📍 Filtering stalls within X km of your location"`
     - Error: Clear error message with `"Use Davao City center instead"` quick action.
   - Preserved file size strictly at <= 200 lines.

4. **`InteractiveSellerMap.tsx`**:
   - Dynamic Viewport Fitting: Automatically calls `map.fitBounds(circle.getBounds())` whenever `radiusKm` or coordinates update, centering the user's location and keeping all stalls within the boundary in view.
   - Added permanent `"You are here"` tooltip to the center user marker.
   - Kept file size strictly at <= 200 lines.

5. **`MarketplaceBrowser.tsx`**:
   - Connected `handleUseCoordinates` to both the desktop sidebar and mobile filter drawer instances of `MarketplaceFilterSidebar`.

6. **`ProductCardAction.tsx` & `HomeFeaturedProduceCard.tsx`**:
   - Aligned the "Add to Cart" CTA buttons with the official 5-color palette primary green (`#457D00` background, `#386600` hover, and crisp `text-white`), replacing outdated lime-green (`#B4EB4A` / `#B8EB5E`) for full aesthetic consistency across marketplace product cards and home featured produce cards.

## Affected Files
- `web/src/features/marketplace/hooks/useMarketplaceLocation.ts`
- `web/src/features/marketplace/hooks/useMarketplaceBrowser.ts`
- `web/src/features/marketplace/components/MarketplaceFilterSidebar.tsx`
- `web/src/features/marketplace/components/InteractiveSellerMap.tsx`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`
- `web/src/features/marketplace/components/ProductCardAction.tsx`
- `web/src/features/home/components/HomeFeaturedProduceCard.tsx`

## Verification Performed
- **Static Type Analysis**: Ran `bunx tsc --noEmit` across both `web/` and `backend/`; 0 errors reported.
- **File Constraints**: Verified all modified files adhere to the strict 200-line limit:
  - `useMarketplaceLocation.ts`: 58 lines
  - `useMarketplaceBrowser.ts`: 198 lines
  - `MarketplaceFilterSidebar.tsx`: 200 lines
  - `InteractiveSellerMap.tsx`: 198 lines
  - `ProductCardAction.tsx`: 115 lines
  - `HomeFeaturedProduceCard.tsx`: 158 lines
- **Parameter Atomic Synchronization**: Verified URL parameters always pair `latitude`, `longitude`, and `radiusKm` together or clear them simultaneously, completely preventing the backend 400 validation error.
