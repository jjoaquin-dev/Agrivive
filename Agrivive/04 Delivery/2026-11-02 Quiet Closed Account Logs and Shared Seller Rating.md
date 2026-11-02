---
title: Quiet Closed Account Logs and Shared Seller Rating
type: delivery
date: 2026-11-02
---

# Quiet Closed Account Logs and Shared Seller Rating

## What changed

- Mobile: a paused or blocked account no longer fills the dev console with red errors. `logApiError(label, err)` in `mobile/src/api/client.ts` prints a one-line warning for that case and a normal error for anything else. 14 data-loading catches now use it (Activity, Messages, Home, analytics, advisories, inventory, product, seller messages, product questions, notifications, orders).
- Backend: seller reliability for AHP-TOPSIS now averages order ratings and product ratings together (divided by 5, 0.5 when none), matching what the trust score already reads. Files: `backend/src/modules/marketplace/services/marketplace.products.list.ts`, `backend/src/utils/visibility-ranking/load.ts`.

## Why

- The redirect to the problem screen already worked; the red errors were noise from each screen.
- Trust counted both rating tables but ranking counted only order ratings, so the two could disagree (FR-14: buyers rate the product and the seller).

## Paper check (no code change)

- Trust and rating re-read against the paper (Table 17, Table 18, Equation 3). Owner will edit the paper for buyer cancellations (separate count rule) and the Three-Strike wording. The 90-day window and low rating = 1 point stay and get one sentence each in the paper.
- Stale text: `backend/README.md` still says percent price drops and an n8n product link; the app uses a peso amount and n8n makes no link.

## Verification

- `bun run typecheck` in `mobile/` passed. `bunx tsc --noEmit` in `backend/` passed. Not run on a device; ranking SQL not run against a database.
- `backend/dist/` not rebuilt; it still has the old ranking.
- Owner reports the mobile app is finished.

## Commit

95f43b4 "quiet closed-account logs, shared seller rating, closed account screen, readme fix". `backend/dist/` rebuilt; `backend/README.md` price drop lines now say peso amount, final price, no AI link.
