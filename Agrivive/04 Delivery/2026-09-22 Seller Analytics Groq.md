---
title: Seller Analytics Groq
type: implementation-status
status: working
date: 2026-09-22
---

# Seller Analytics with Groq

## What changed

- Added `GET /seller/analytics/summary` for verified sellers.
- Added seller-wide and product/unit-filtered analytics for posted, available, reserved, completed, cancelled, expired, remaining, completed sales totals, sell-through, period change, and recurring listings.
- Added nullable order transition timestamps for completed, cancelled, and expired orders.
- Backfilled existing order transition timestamps from `updated_at` after the migration so historical statuses remain reportable.
- Updated QR completion, buyer cancellation, seller cancellation, and expiry transactions to record the matching timestamp.
- Added an on-demand Groq summary using only validated aggregate metrics. Missing credentials, timeout, non-success responses, and invalid output return the metrics with `summaryStatus: unavailable`.
- Added the mobile Analytics screen with period, product, and unit filters, exact metric cards, performance values, descriptive summary, and loading, empty, offline, retry, and Groq-unavailable states.
- Added a Home link to Analytics while keeping Reservations as a bottom tab.

## Affected paths

- `backend/src/db/schema.ts`
- `backend/drizzle/20260922150000_seller_analytics_order_timestamps/`
- `backend/src/modules/seller/model/seller.analytics.ts`
- `backend/src/modules/seller/index/seller.analytics.ts`
- `backend/src/modules/seller/services/seller.analytics.ts`
- `backend/src/modules/seller/services/seller.analytics.metrics.ts`
- `backend/src/modules/seller/services/seller.analytics.summary.ts`
- `backend/.env.example`
- `backend/src/modules/seller/services/seller.scan-order.ts`
- `backend/src/modules/seller/services/seller.order.cancel.ts`
- `backend/src/modules/buyer/services/buyer.order.cancel.ts`
- `backend/src/modules/buyer/services/buyer.order.expire.ts`
- `mobile/app/(app)/analytics.tsx`
- `mobile/src/features/analytics/`
- `mobile/app/(app)/_layout.tsx`
- `mobile/app/(app)/(tabs)/home.tsx`

## Verification

- Database migration applied successfully.
- Existing completed, cancelled, and expired orders were backfilled from their existing `updated_at` values.
- Confirmed `orders.completed_at`, `orders.cancelled_at`, and `orders.expired_at` exist.
- Unauthenticated analytics requests correctly return `401 Unauthorized`.
- `bunx tsc --noEmit` passed in `backend/`.
- `bun build src/index.ts --outdir dist --target bun` passed in `backend/`.
- `bunx tsc --noEmit` passed in `mobile/`.
- `bunx expo export --platform android --no-bytecode` passed.
- Authenticated Postman/OpenAPI checks, Groq success, Groq timeout fallback, and physical Android verification remain pending.

## Security and scope

- `GROQ_API_KEY` and `GROQ_MODEL` belong in the server environment only.
- No API key or secret is recorded in this vault note.
- Groq describes backend metrics; it does not calculate or modify quantities, prices, totals, or statuses.
- n8n marketing automation, payment, profit, forecasting, recommendations, and weather advisories remain separate features.

## Commit

Not committed yet.
