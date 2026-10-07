# One-shot Integration Completion

Date: 2026-10-03

## What changed

Completed the repository-level integration batch while excluding Market Basket Analysis and live recommendations, n8n marketing automation, background mobile push notifications, payment processing, shelf-life work, and host-specific deployment execution.

- Email delivery now uses an explicit `EMAIL_PROVIDER` choice: Resend for production and Mailtrap for local testing. Missing provider credentials fail clearly, OTP values are not logged by default, and simulated delivery requires `ALLOW_DEV_EMAIL_LOG=true` outside production. Existing verification and trust-notice idempotency keys remain in place.
- Order expiry, inquiry deadline processing, and trust-notice delivery now run from a dedicated worker with an immediate run, 60-second interval, safe logging, and graceful shutdown. API and worker startup are documented as separate processes.
- Buyer notices now return `readAt` and support recipient-scoped read and mark-all-read routes.
- Seller storefront responses now include nullable coordinates.
- Buyer web now has a notification inbox, buyer order messaging, browser location filtering with shareable URL parameters, distance display through existing product cards, and Google Maps directions links when coordinates exist.
- Seller mobile now has order reporting with supported reason choices, 5–2,000 character validation, Expo SDK 57 document selection, 5 MB evidence checks, sequential uploads, progress states, stop/resume behavior, and retained reports after partial upload failure.
- Web and mobile environment templates were added without secrets. The mobile template documents LAN-device and Android emulator values.

## Why it changed

The remaining integration gaps were blocking coherent buyer, seller, email, and scheduled-job workflows even though the underlying API contracts already existed. These changes connect the existing contracts without adding excluded product areas or deployment-provider files.

The buyer inbox follows familiar notification patterns and keeps status visible, applying Jakob Nielsen’s Recognition Over Recall and Visibility of System Status, Jakob’s Law, and Fitts’s target guidance. Buyer messages are kept in a separate order section using Miller’s Law and chunking, with inline feedback following Caroline Jarrett and Gerry Gaffney’s error-prevention guidance. Location controls stay adjacent to marketplace filters using proximity and mobile-first touch targets. Seller reporting uses large primary actions, a bounded common region, and visible upload status in line with Fitts’s Law, Gestalt’s Law of Common Region, and Nielsen’s Visibility of System Status.

## Affected paths

### Backend

- `backend/.env.example`
- `backend/README.md`
- `backend/package.json`
- `backend/src/index.ts`
- `backend/src/worker.ts`
- `backend/src/jobs/run-scheduled.ts`
- `backend/src/utils/email/index.ts`
- `backend/src/modules/buyer/index.ts`
- `backend/src/modules/buyer/index/buyer.notices.read.ts`
- `backend/src/modules/buyer/model/buyer.notices.ts`
- `backend/src/modules/buyer/services/buyer.notices.list.ts`
- `backend/src/modules/buyer/services/buyer.notice.read.ts`
- `backend/src/modules/buyer/services/buyer.notices.read-all.ts`
- `backend/src/modules/marketplace/services/marketplace.seller.get.ts`

### Web

- `web/.env.example`
- `web/app/notifications/page.tsx`
- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/features/notifications/`
- `web/src/features/orders/api/inquiries.ts`
- `web/src/features/orders/components/OrderDetail.tsx`
- `web/src/features/orders/components/OrderMessages.tsx`
- `web/src/features/orders/components/OrderSellerCard.tsx`
- `web/src/features/marketplace/components/ActiveFilters.tsx`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`
- `web/src/features/marketplace/components/MarketplaceFilters.tsx`
- `web/src/features/marketplace/components/SellerStorefront.tsx`
- `web/src/features/marketplace/hooks/useMarketplaceBrowser.ts`
- `web/src/features/marketplace/types.ts`
- `web/src/lib/maps.ts`

### Mobile

- `mobile/.env.example`
- `mobile/package.json`
- `mobile/bun.lock`
- `mobile/app/(app)/orders/[id].tsx`
- `mobile/src/features/orders/api/seller-reports.ts`
- `mobile/src/features/orders/components/SellerOrderReportModal.tsx`
- `mobile/src/features/orders/components/seller-order-report.styles.ts`

## Verification performed

- `backend`: `bunx tsc --noEmit` passed.
- `backend`: `bun build src/index.ts --outdir dist-check-final --target bun` passed.
- `backend`: `bunx drizzle-kit check` passed.
- `web`: `bunx tsc --noEmit` passed.
- `web`: final `bun run build` passed and included `/notifications` and the updated `/orders/[id]` route in the generated route list.
- `mobile`: `bun run typecheck` passed after adding `expo-document-picker@~57.0.3`.
- `mobile`: the repository Android export validation passed and produced the Hermes bundle after the native dependency addition.
- Runtime smoke checks passed: `GET /health` returned 200, `GET /health/ready` returned 200, and `GET /openapi/json` returned 200. The OpenAPI document included the buyer notice read and mark-all-read routes.
- No automated endpoint test suite was added, per repository instructions.

## Remaining owner-only acceptance checks

These require real accounts, provider credentials, devices, or external systems:

- Resend production delivery and Mailtrap local delivery, including confirming no OTP appears in logs when development logging is disabled.
- Buyer notice read and mark-all-read behavior, buyer order questions and seller replies, and the existing reservation/cancellation/expiry/QR/review/report flows.
- Browser location permission granted, denied, timed out, and cleared; distance filtering; and directions links.
- Seller report creation, image/PDF evidence upload, cancellation, retry, and partial-upload recovery on a device.
- Existing S3, analytics, advisory, admin, and stakeholder flows.
- API and worker running as separate processes with the selected deployment environment.
- Final hosting credentials, DNS, production configuration, and owner acceptance.

## Formula and research references for browser location filtering

### Distance formula used by Agrivive

Agrivive calculates straight-line surface distance between the buyer location and seller coordinates with the spherical law of cosines:

```text
d = R × acos(clamp(
  sin(latitudeBuyer) × sin(latitudeSeller)
  + cos(latitudeBuyer) × cos(latitudeSeller)
    × cos(longitudeSeller − longitudeBuyer),
  −1,
  1
))
```

Where:

- `d` is the distance in kilometres.
- `R` is `6371` kilometres, the approximate mean Earth radius.
- Latitudes and longitudes are converted to radians by the database trigonometric functions.
- `clamp(-1, 1)` protects `acos` from small floating-point rounding errors.

The implementation is in `backend/src/modules/marketplace/services/marketplace.products.list.ts`. The result is returned as `distanceKm`, and a listing is included when `distanceKm <= radiusKm`. This is a straight-line geographic distance, not driving distance, walking distance, or travel time.

### Product-radius interpretation

The `5 km`, `10 km`, `25 km`, and `50 km` choices are initial product thresholds, not universal research constants. They provide progressively wider pickup searches:

- `5 km`: very nearby pickup.
- `10 km`: default local search.
- `25 km`: broader city or municipal search.
- `50 km`: wider regional search.

The thresholds should be validated later against buyer behavior, seller density, transport patterns, and actual marketplace usage. Research supports distance-based and radius-based access filtering, but does not establish these exact four values as universal defaults.

### Dated references

As of 2026-10-03, a reference must be published on or before 2021-10-03 to be strictly at least five years old. References from 2022 are useful standards history but do not meet that strict age requirement yet.

1. **Price, Langford, and Higgs (2021), geographical access to services.** Describes a web-based system for computing accessibility to geographically located service points, including distance-based and cumulative-opportunity approaches.
   - https://onlinelibrary.wiley.com/doi/10.1111/tgis.12744

2. **Banerjee, Patro, Dietz, and Chakraborty (2020), “Analyzing ‘Near Me’ Services.”** Examines distance-based retrieval and warns that proximity ranking can create exposure bias for businesses located farther from popular search areas.
   - https://arxiv.org/abs/2011.07359

3. **Guo et al. (2020), location privacy and proximity queries.** Discusses radius-based location queries and how location error can make the effective search area too large or too small.
   - https://onlinelibrary.wiley.com/doi/10.1155/2020/8892079

4. **W3C Geolocation API Working Draft (2021-05-20).** Defines browser geolocation coordinates, permission handling, and the `PERMISSION_DENIED`, `POSITION_UNAVAILABLE`, and `TIMEOUT` error codes used by the location control.
   - https://www.w3.org/TR/2021/WD-geolocation-API-20210520/

5. **Cole and Schamberg (2021), geodetic coordinates and spherical calculations.** Uses spherical-law-of-cosines equations for geodetic coordinates and discusses the approximation introduced by treating Earth as a sphere rather than an ellipsoid.
   - https://arxiv.org/abs/2111.13254

6. **W3C Geolocation API Recommendation (2022-09-01).** A later formal standards reference for permission, cached locations, timeout behavior, and unavailable position data. It is included for standards history but is not yet five years old as of this note.
   - https://www.w3.org/TR/2022/REC-geolocation-20220901/

7. **Google Maps URLs documentation.** Documents the universal cross-platform directions URL used by Agrivive when seller coordinates are available.
   - https://developers.google.com/maps/documentation/urls/get-started

## Commit

No commit was created in this delivery. Commit hash and message can be added here if the owner creates one.
