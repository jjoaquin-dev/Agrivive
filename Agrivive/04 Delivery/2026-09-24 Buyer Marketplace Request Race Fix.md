# Buyer Marketplace Request Race Fix

Date: 2026-09-24

## What changed

- Preserved browser `AbortError` exceptions in the shared web API client instead of reporting them as connection failures.
- Added active-request guards to the marketplace listing and product detail effects.
- Prevented aborted or stale requests from overwriting successful data, loading state, or error state.

## Why

The browser can cancel an earlier request while the marketplace or product page is rendering. That cancelled request was being shown as `We could not connect to Agrivive`, and on product pages it made a valid listing look unavailable even when the backend returned it successfully.

## Affected paths

- `web/src/lib/api.ts`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`

## Verification

- `cd web && bun run typecheck` — passed.
- `cd web && bun run build` — passed.
- `GET http://localhost:3000/marketplace/products` — returned `200`.
- `GET http://localhost:3000/marketplace/products/929fb9b8-6580-4245-b6cc-3d05fea64eb6` — returned `200`.
- Manual verification reported by the owner: seller order scanning works.
- Manual verification reported by the owner: buyer direct buying works.

