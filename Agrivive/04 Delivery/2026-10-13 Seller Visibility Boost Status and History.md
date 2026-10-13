---
title: Seller Visibility Boost Status and History
type: implementation-status
status: implemented
date: 2026-10-13
---

# Seller Visibility Boost Status and History

## What changed

- Added a seller-protected endpoint for the latest visibility boost of one product.
- Added a seller-protected endpoint that lists up to 100 boost records, newest first.
- Added clear seller-facing status labels for waiting, sent to the social workflow, failed, needs your choice, and not now.
- Updated the product boost screen to load and display the latest boost status, reason, date, price change, and retry guidance.
- Added a Boost history screen with status filters and a link back to each product's current boost status.
- Added a Boost history link to Analytics and registered the new mobile route.
- Kept internal failure details out of the response; sellers receive a safe retry message.
- No database migration was needed because `seller_visibility_boosts` already stores the required history and statuses.

## Why

The seller could submit a visibility boost but could not see whether it was waiting, accepted by the n8n workflow, failed, or declined. The new status display makes the worker state visible, while the history page gives sellers one place to review all boost requests across their listings.

`Sent to social workflow` means the backend worker received a successful response from the configured n8n webhook. It does not claim that a social platform has finished publishing the post.

## Affected paths

- `backend/src/modules/seller/index/seller.visibility-boost.ts`
- `backend/src/modules/seller/services/seller.visibility-boost.read.ts`
- `backend/src/modules/seller/services/seller.visibility-boost.history.list.ts`
- `mobile/src/features/boost/api/visibility-boosts.ts`
- `mobile/src/features/boost/types.ts`
- `mobile/app/(app)/boost/[productId].tsx`
- `mobile/app/(app)/boosts.tsx`
- `mobile/app/(app)/analytics.tsx`
- `mobile/app/(app)/_layout.tsx`

## Verification

- `git diff --check` passed.
- `bunx tsc --noEmit` passed in `backend/`.
- `bun build src/index.ts --outdir dist --target bun` passed in `backend/`.
- `bun run typecheck` passed in `mobile/`.
- No database migration was generated or applied for this UI/API read feature.
- Authenticated API and physical Android checks remain pending until the preview build is installed and tested.

## Commit

Not committed yet.
