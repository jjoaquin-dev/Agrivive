---
title: Seller Follows and Quality Completion
type: delivery
date: 2026-10-06
status: code-complete; owner acceptance pending
---

# Seller Follows and Quality Completion — 2026-10-06

## What changed and why

- Buyers can follow a public seller from its storefront and unfollow later. The seller's **first newly public, buyable listing** produces one durable event; the separate worker sends in-app notices to buyers who were following when the event happened. Existing listings are backfilled as already announced, so rollout does not send historical alerts. Restocks and edits to a previously public product do not create another event. The worker uses row locking and a unique buyer/event key for safe retries.
- The existing buyer inbox now combines order notices and followed-seller listing notices. Existing order IDs stay unchanged; listing IDs use `listing:`. Listing notices show shop/product name snapshots and link to the product only while it remains available, otherwise to the seller page. Unfollowing stops future undelivered notices but keeps past notices.
- Trust monitoring is now `monitoring-v2`: verified non-response is 1 point, verified seller cancellation is 2, and a completed order with any 1–2-star rating is 1 rating signal, counted once per order. Written reviews remain context, and unverified reports are separate allegations worth zero points. Admin and seller displays explain these as monitoring signals, not account penalties. FR-23 and the proposal's FR-28 trust language are **partially covered by policy**, not passed; no suspension, report decision, or text scoring was added.
- Seller analytics summaries now use existing metrics without an external AI call. Marketplace, seller page, orders, buyer notices, and seller analytics retain the last successful display through a transient refresh failure, show a previous-information message, and offer retry. Protected data is cleared on observed 401/403 responses. Stale stock cards cannot be used for buying until a successful refresh.

This batch excludes n8n promotion (Objective 1 / FR-18), real-data MBA development (Objective 3 / FR-19 and related FR-07/FR-27 association claims), push/email campaigns, wishlist availability alerts, and production deployment.

## Affected paths

- Database and migration: `backend/src/db/schema.ts`; `backend/drizzle/20261005213227_seller_follow_notices/{migration.sql,snapshot.json}`.
- Follow API: `backend/src/modules/buyer/index/buyer.seller.follow.ts`, `model/buyer.seller.follow.ts`, `services/buyer.seller.follow.{eligible,read,save,remove}.ts`, and `backend/src/modules/buyer/index.ts`.
- Publication and delivery: `backend/src/utils/seller-listing-event/index.ts`; seller product create, update, stock-change, and reactivate services; `backend/src/jobs/send-seller-listing-notices.ts` and `run-scheduled.ts`.
- Notice API: buyer notice list/read/read-all services and notice model.
- Trust and analytics: `backend/src/utils/trust/score.ts`, admin performance model, seller analytics summary service; `web/src/features/admin/`, `mobile/src/features/trust/`, and `mobile/src/features/analytics/`.
- Buyer UI and recovery: `web/src/features/marketplace/components/SellerFollowButton.tsx`, `SellerStorefrontHeader.tsx`, `SellerStorefront.tsx`, seller-follow API; buyer notifications; marketplace browser/product grid/location hook; `web/src/features/orders/components/{BuyerOrders,OrderDetail,OrderCancellation}.tsx` and `web/src/features/orders/hooks/useBuyerOrders.ts`.
- Guides: `backend/README.md`, `backend/API_ENDPOINTS.md`, `backend/.env.example`, and [[2026-10-06 Requirement Verification Record]].

No commit was created, so there is no commit hash/message to record.

## API acceptance examples

Use a signed-in active **buyer** Better Auth cookie or bearer session token. Substitute a public seller user ID; these requests have no body.

| Request | Expected result |
|---|---|
| `GET /buyer/follows/:sellerId` | `200 {"sellerId":"…","following":false}` initially. |
| `POST /buyer/follows/:sellerId` twice | Each returns `200 {"sellerId":"…","following":true}`; one follow row. |
| `DELETE /buyer/follows/:sellerId` twice | Each returns `200 {"sellerId":"…","following":false}`. |
| Follow own shop | `403`; follow missing/nonpublic shop → `404`; signed-out request → authentication failure. |
| `GET /buyer/notices` | Recipient's order and listing notices; listing ID starts `listing:`, `orderId` is null, and product/shop snapshots are present. |
| `POST /buyer/notices/listing:<uuid>/read` | Recipient's notice with non-null `readAt`; another buyer's ID → `404`. |
| `POST /buyer/notices/read-all` | `200 {"updatedCount":n}` for that buyer only. |

After following, publish a *new* available product, run the worker, and check that exactly one listing notice appears. Repeat the worker: no duplicate. Publish an initially hidden product, then activate/restock it into its first buyable state: one notice. Edit price/restock an already public product: no new notice. Unfollow before worker delivery: no notice for that event. Make the notified product unavailable: the inbox must offer the seller-page fallback. Repeat with two buyers to verify recipient isolation.

## Verification performed

- Passed: backend, web, and mobile TypeScript checks; API and worker Bun builds; Drizzle migration consistency check; Next production build; Android Expo export.
- Passed: currently running local API returned HTTP 200 for `/health`, `/health/ready`, and `/openapi/json`; OpenAPI included the follow and notice-read paths. This checks route availability, **not** endpoint behavior.
- Passed: an anonymous `GET /buyer/follows/:sellerId` returned HTTP 401. No authenticated follow or delivery behavior was tested.
- Not run: migration on a test database, because only a remote database connection was available and it was not approved as disposable. **Do not run the migration against that remote database without explicit owner authorization.**
- Not run: authenticated follow/notice lifecycle, DB rollback/retry/isolation, 20 timing samples for pages/search/QR/analytics, 1366×768 and 360px visual review, cross-browser/device tests, and external-service outage tests. None is recorded as passed.
- No automated endpoint test suite was added, in keeping with the repository's manual API testing instruction.

## Remaining owner-only acceptance

1. Apply the migration to a disposable or approved test DB, then execute every API case above. Keep API and exactly one worker process separate. Confirm no historical alerts after migration, idempotency, first-publication trigger, unfollow-before-delivery, and cross-buyer isolation.
2. At 1366×768 on web and 360px on seller mobile, inspect normal/loading/stale/error states, keyboard/touch targets, follow return from login, and the listing-notice fallback.
3. Collect **20 normal-condition samples each** for primary pages, search/filter, QR validation, and seller analytics. Record all values and slowest result against the proposal's 3-second (pages/search/QR) or 5-second (analytics) target. No timing claim is made here.
4. Verify Android 10+ on a real device; Chrome, Edge, Firefox, and Safari; HTTPS; reconnect/persistence; advisory/email/object-store outage behavior; and beta availability on the chosen host. These are owner/release checks, not established by builds.
5. Review the trust weights and account-action wording with the project owner/professor. Monitoring does not fulfill a requirement that explicitly calls for automated restriction or sentiment analysis.

The follow control uses a familiar Follow/Following toggle and explicit status (**Jakob Nielsen's Jakob's Law and Visibility of System Status**), while its 48px target supports **Paul Fitts's Law**. The inbox shows shop/product names rather than codes (**Jakob Nielsen and Rolf Molich's Recognition over Recall**).
