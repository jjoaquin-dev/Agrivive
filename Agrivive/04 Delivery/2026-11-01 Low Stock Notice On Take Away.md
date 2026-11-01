---
title: Low Stock Notice On Take Away
type: delivery
date: 2026-11-01
status: code complete, not tested by owner
---

# Low Stock Notice On Take Away

## Finding

The "Alert me when stock is low" amount already produced a "Running low" notice, but only when a buyer reservation took the amount down to it. A seller using Take Away (offline sale, damaged, spoiled) never got the notice.

## What changed

- The notice logic moved from `buyer.order.reserve.ts` to the shared `backend/src/utils/seller-notifications/stock-level.ts` (`notifyStockLevel`).
- `seller.product.stock-change.ts` now calls it after a Take Away on an active listing, so reaching the alert amount (or zero) creates "Running low" or "Sold out".
- The notice fires once when the amount crosses the alert level, not on every change below it. It follows the existing Stock and Price phone-alert setting.
- The mobile Notifications screen already shows both kinds (`sellerNoticeMapper.ts`). No mobile change.

## Owner test

`PATCH` the stock of a listing with an alert amount set (Take Away so the amount ends at or under it). Expect one "Running low" item in `GET /seller/notifications`.

## Verification

`bunx tsc --noEmit` and `bun build src/index.ts` passed in `backend/`. Not tested against a database.
