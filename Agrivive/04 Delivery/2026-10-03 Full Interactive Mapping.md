# Full Interactive Marketplace Mapping

Date: 2026-10-03

## What changed

Added the buyer marketplace’s interactive seller map while keeping the existing product filters, browser location controls, distance display, and Google Maps directions behavior.

- Added `GET /marketplace/sellers/map`.
- Added one map result per matching seller with coordinates, distance, address, pickup instructions, and matching product count.
- Added `unmappedSellerCount` so matching sellers without coordinates remain visible as a clear map limitation.
- Reused the marketplace visibility rules and shared the existing clamped spherical-law-of-cosines distance expression between product and map queries.
- Changed marketplace product results so sellers without coordinates can still appear in the list when no location filter is active.
- Added a client-only Leaflet map with OpenStreetMap tiles and visible attribution.
- Added marker clustering for dense seller locations.
- Added seller popups with signed seller profile images, initials fallbacks, seller identity, storefront, and directions links.
- Added synchronized seller selection between map markers and marketplace cards.
- Added stale-data preservation, loading feedback, retry behavior, mobile map-above-list layout, and desktop split view.
- Kept search product-based; no Google Places or seller-name search was added.

## Why it changed

The repository already supported location-based marketplace filtering and external directions, but buyers could not compare matching sellers spatially or move between a seller pin and the corresponding listing cards. The dedicated seller-map query avoids tying map coverage to the product card cursor, while the synchronized list/map interaction preserves the familiar marketplace browsing flow.

The interface follows Jakob Nielsen’s Jakob’s Law and Recognition Over Recall through familiar map, card, popup, and directions patterns. It applies Visibility of System Status to map loading and retry states, Fitts’s Law to map and seller controls, Luke Wroblewski’s mobile-first ergonomics to the map-above-list layout, and Gestalt Proximity/Common Region to keep map context and seller details grouped.

## API contract

```text
GET /marketplace/sellers/map
```

The endpoint accepts the existing marketplace filters:

```text
search
productType
unit
sellerType
minPrice
maxPrice
minQuantity
maxQuantity
latitude
longitude
radiusKm
```

It returns:

```ts
{
  sellers: Array<{
    id: string;
    name: string;
    shopName: string;
    image: string | null;
    sellerType: string;
    detailAddress: string;
    pickupInstructions: string | null;
    latitude: number;
    longitude: number;
    distanceKm: number | null;
    productCount: number;
  }>;
  unmappedSellerCount: number;
}
```

## Distance formula

Agrivive uses the server-side spherical law of cosines with an Earth radius of 6,371 km:

```text
d = 6371 × acos(clamp(
  cos(latitudeBuyer) × cos(latitudeSeller) ×
    cos(longitudeSeller − longitudeBuyer)
  + sin(latitudeBuyer) × sin(latitudeSeller),
  −1,
  1
))
```

Latitude and longitude are converted to radians by the database trigonometric functions. The web client displays the returned `distanceKm` and does not calculate a second distance value.

## Affected paths

### Backend

- `backend/src/modules/marketplace/index.ts`
- `backend/src/modules/marketplace/index/marketplace.sellers.map.ts`
- `backend/src/modules/marketplace/model/marketplace.sellers.map.ts`
- `backend/src/modules/marketplace/services/marketplace.sellers.map.ts`
- `backend/src/utils/s3-avatar/index.ts`
- `backend/src/modules/marketplace/services/marketplace.distance.ts`
- `backend/src/modules/marketplace/services/marketplace.visibility.ts`
- `backend/src/modules/marketplace/services/marketplace.products.list.ts`

### Web

- `web/package.json`
- `web/bun.lock`
- `web/app/layout.tsx`
- `web/src/lib/maps.ts`
- `web/src/components/MarketplaceHeaderSearch.tsx`
- `web/src/features/marketplace/api/seller-map.ts`
- `web/src/features/marketplace/types.ts`
- `web/src/features/marketplace/hooks/useMarketplaceBrowser.ts`
- `web/src/features/marketplace/components/InteractiveSellerMap.tsx`
- `web/src/features/marketplace/components/MarketplaceHero.tsx`
- `web/src/features/marketplace/components/seller-map-popup.ts`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`
- `web/src/features/marketplace/components/MarketplaceProductGrid.tsx`
- `web/src/features/marketplace/components/ProductCard.tsx`

## Verification performed

- `cd backend && bunx tsc --noEmit` passed.
- `cd backend && bun build src/index.ts --outdir dist --target bun` passed.
- `cd backend && bunx drizzle-kit check` passed.
- `cd web && bunx tsc --noEmit` passed.
- `cd web && bun run build` passed after allowing the Next.js child process to run.
- Web dependencies installed and lockfile updated with `leaflet`, `leaflet.markercluster`, `@types/leaflet`, and `@types/leaflet.markercluster`.
- Runtime smoke checks passed:
  - `GET /health` returned 200.
  - `GET /health/ready` returned 200.
  - `GET /openapi/json` returned 200.
  - `GET /marketplace/sellers/map` returned 200 with seller-map data.
- The seller-map response includes a signed `image` field for sellers with private profile photos and `null` when no photo exists.
- Browser verification passed on `/marketplace`:
  - Three seller markers rendered.
  - Leaflet and OpenStreetMap attribution were visible.
  - Marker popup displayed seller details, storefront link, and Google directions link.
- The popup implementation includes the seller profile photo, seller name/type, and initials fallback.
  - Selecting the Ariannix marker opened its popup and pressed the matching seller card.
- `git diff --check` reported no whitespace errors.
- No automated endpoint suite was added, consistent with repository instructions.

## Web compile cache fix

The web development server previously used a custom `.next-dev` output directory. That directory was tracked in Git and could race with Next.js file generation on Windows, producing slow cold starts and missing `build-manifest.json` errors. The web now uses Next.js's standard `.next` output for both development and production, ignores `.next-dev` defensively, removes the generated `.next-dev` files from Git tracking, and no longer includes `.next-dev/types` in the TypeScript project.

Affected paths:

- `web/next.config.ts`
- `web/.gitignore`
- `web/tsconfig.json`
- Removed generated `web/.next-dev/` cache files from Git tracking and disk.

Additional verification:

- `cd web && bunx tsc --noEmit` passed.
- `cd web && bun run build` passed; the optimized build completed successfully in 6.5 seconds.
- Fresh development requests against the existing local server returned 200 for `/` and `/marketplace`, 404 for `/_not-found` as expected, and 200 again for a repeated `/marketplace` request.
- `web/.next/build-manifest.json` exists.
- No `.next-dev` directory or tracked `.next-dev` files remain after the cleanup.

## Owner acceptance

On 2026-10-03, the owner reported that all implemented integration and interactive buyer marketplace changes were manually checked and working as expected. Manual acceptance is complete for the repository-level scope described in this note.

The owner-confirmed scope includes:

- Test the map with the real buyer marketplace filters and a seller without coordinates.
- Verify the 5 km, 10 km, 25 km, and 50 km location choices on a real browser/device.
- Verify geolocation permission granted, denied, unavailable, timeout, and clear-location behavior.
- Verify shared URLs restore marketplace filters and location parameters.
- Verify marker clustering and card-to-marker selection on desktop and mobile widths.
- Verify OpenStreetMap tile usage, attribution, caching, and traffic remain appropriate for the intended beta deployment. The public tile service does not provide a production SLA.
- Verify Google directions links on a mobile device with coordinates available.
- Verify a seller profile photo appears in the map popup and a seller without a photo shows initials.
- Confirm API and web deployment configuration separately; no host-specific deployment was performed.

## Research references

- [Leaflet Quick Start](https://leafletjs.com/examples/quick-start/)
- [Leaflet API reference](https://leafletjs.com/reference)
- [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/)
- [W3C Geolocation API Working Draft (2021-05-20)](https://www.w3.org/TR/2021/WD-geolocation-API-20210520/)
- [Google Maps URLs documentation](https://developers.google.com/maps/documentation/urls/get-started)

## Commit

No commit was created in this delivery. Add the commit hash and message here if the owner creates one.
