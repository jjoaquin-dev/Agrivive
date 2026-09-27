---
title: Backend Completion Batch
type: delivery
date: 2026-09-28
status: implemented; database rollout complete; owner API checks pending
---

# Backend Completion Batch

## What changed

- Added `backend/API_ENDPOINTS.md` as the endpoint and route-file map for Gemini and client work.
- Added listing-scoped buyer questions and seller replies, while keeping the existing order inquiry flow intact.
- Added seller share-copy output with a marketplace link built from `WEB_APP_URL`.
- Corrected inventory-age scoring to use the seller-entered `inventoryAgeDays` field and applied score-based ranking to marketplace pages with a stable cursor.
- Added seller-recorded storage temperature and a Q10 planning estimate path. The estimate requires inventory age plus a matching sourced record in `SHELF_LIFE_REFERENCES_JSON`; the checked-in example intentionally contains no crop values.
- Added private report evidence uploads and short-lived downloads limited to the report creator.
- Added a read-only stakeholder aggregate endpoint with server-side allowlisted emails.
- Expanded aggregate admin monitoring with weighted event points, evidence counts, and delivery status. Admin has no report decision or account-action endpoint. Allegations are counted separately and do not affect weighted points.
- Added public liveness and database readiness endpoints.
- Added database indexes used by marketplace ranking, inquiry access, and trust monitoring.
- Excluded Market Basket Analysis and n8n as requested.

## Why

The backend still had gaps in pre-order communication, buyer-feed visibility ranking, share text, numeric advisories, report evidence storage, stakeholder aggregates, and operational readiness. The admin workflow must remain automated and monitoring-only; the system may calculate and display monitoring values but does not let an admin review, dismiss, warn, restrict, or suspend a user.

## Affected paths

- `backend/API_ENDPOINTS.md`, `backend/.env.example`, `backend/dist/index.js`
- `backend/src/index.ts`, `backend/src/db/schema.ts`
- `backend/src/modules/auth/services/auth.session.ts`
- `backend/src/modules/admin/model/admin.performance.ts`, `backend/src/modules/admin/services/admin.performance.ts`
- `backend/src/modules/buyer/index.ts`, `backend/src/modules/buyer/index/buyer.product.inquiry.ts`, `backend/src/modules/buyer/model/buyer.product.inquiry.ts`, `backend/src/modules/buyer/services/buyer.product.inquiry.create.ts`, `backend/src/modules/buyer/services/buyer.product.inquiry.read.ts`
- `backend/src/modules/buyer/index/buyer.order.report.ts`, `backend/src/modules/buyer/model/buyer.order.report.evidence.ts`
- `backend/src/modules/marketplace/services/marketplace.products.list.ts`, `backend/src/modules/marketplace/services/marketplace.product.get.ts`
- `backend/src/modules/seller/index.ts`, `backend/src/modules/seller/index/seller.product.inquiry.ts`, `backend/src/modules/seller/index/seller.product.share.ts`
- `backend/src/modules/seller/model/seller.product.inquiry.ts`, `backend/src/modules/seller/model/seller.product.share.ts`
- `backend/src/modules/seller/services/seller.product.inquiry.list.ts`, `backend/src/modules/seller/services/seller.product.inquiry.reply.ts`, `backend/src/modules/seller/services/seller.product.share.ts`
- `backend/src/modules/seller/index/seller.order.report.ts`, `backend/src/modules/seller/model/seller.order.report.evidence.ts`
- `backend/src/modules/seller/model/seller.product.create.ts`, `backend/src/modules/seller/model/seller.product.ts`, `backend/src/modules/seller/services/seller.product.create.ts`, `backend/src/modules/seller/services/seller.product.update.ts`
- `backend/src/modules/seller/model/seller.advisories.ts`, `backend/src/modules/seller/services/seller.advisories.ts`, `backend/src/modules/seller/services/seller.trust.events.ts`, `backend/src/modules/seller/services/seller.weighted.surplus.visibility.ts`
- `backend/src/modules/stakeholder/index.ts`, `backend/src/modules/stakeholder/index/stakeholder.summary.ts`, `backend/src/modules/stakeholder/model/stakeholder.summary.ts`, `backend/src/modules/stakeholder/services/stakeholder.summary.ts`
- `backend/src/utils/s3/private-upload.ts`, `backend/src/utils/s3/private-download.ts`, `backend/src/utils/shelf-life/index.ts`, `backend/src/utils/trust/score.ts`, `backend/src/utils/trust/report-evidence.upload.ts`, `backend/src/utils/trust/report-evidence.list.ts`, `backend/src/utils/visibility-score/index.ts`
- `backend/drizzle/20260927171256_agrivive_backend_completion/`
- `backend/drizzle/20260927172401_marketplace_visibility_monitoring_indexes/`
- `Agrivive/04 Delivery/Open Decisions.md` (clarified monitor-only admin behavior and remaining shelf-life/visibility inputs)

## Verification

- `bunx tsc --noEmit`: passed.
- `bun build src/index.ts --outdir dist --target bun`: passed.
- `bunx drizzle-kit check`: passed.
- `bunx drizzle-kit migrate`: passed; both pending migrations were applied to the configured database.
- Read-only database verification: `sellers_product.storage_temperature_c` exists and both `20260927171256_agrivive_backend_completion` and `20260927172401_marketplace_visibility_monitoring_indexes` are recorded as applied.
- `git diff --check`: no whitespace errors in the edited backend files; it still reports the existing blank line at the end of the already-modified root `AGENTS.md` and line-ending normalization notices.
- Manual OpenAPI/Postman endpoint checks remain for the project owner.

## Rollout and remaining data checks

- The two additive Drizzle migrations are now applied to the configured Supabase database. This fixed the runtime query failure for the missing `sellers_product.storage_temperature_c` column.
- `SHELF_LIFE_REFERENCES_JSON` has no approved crop entries yet; numeric estimates stay unavailable until sourced values are configured.
- The current visibility weights and tiers are the existing prototype settings. Stakeholder validation recorded in Open Decisions D-07 remains pending.
- Production uptime, HTTPS, browser/device behavior, offline sync, and measured response-time targets need deployment/client verification and are outside this backend-only batch.
- No manual testing is recorded complete until the owner reports the results.
