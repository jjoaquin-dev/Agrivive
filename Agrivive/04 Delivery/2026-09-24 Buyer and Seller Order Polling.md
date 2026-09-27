# Buyer and Seller Order Polling

Date: 2026-09-24

## What changed

- Added a reusable web polling hook with abort handling, visibility pause/resume, retry backoff, and terminal-error stopping.
- Buyer order details refresh pending orders every 15 seconds and stop after completion, cancellation, or expiry.
- Added a last-updated indicator and non-blocking refresh errors to the buyer order detail page.
- Seller mobile order details refresh pending orders every 10 seconds while the app is active, pause when backgrounded, and stop after terminal states.
- Added optional abort signals to seller order reads.
- Documented the polling rules in the buyer web design guide.

## Why

Order status can change after a buyer reserves produce or a seller scans a pickup QR. Polling gives the current MVP timely updates without adding a persistent WebSocket service.

## Affected paths

- `web/src/lib/usePolling.ts`
- `web/src/features/orders/components/OrderDetail.tsx`
- `mobile/app/(app)/orders/[id].tsx`
- `mobile/src/features/orders/api/seller-orders.ts`
- `.agents/design/web-design/DESIGN.md`

## Verification

- `cd backend && bunx tsc --noEmit` — passed.
- `cd backend && bun build src/index.ts --outdir dist --target bun` — passed.
- `cd web && bun run typecheck` — passed.
- `cd web && bun run build` — passed.
- `cd mobile && bun run typecheck` — passed.

## Manual testing pending

- Confirm a buyer sees seller scan completion without refreshing.
- Confirm a seller sees buyer cancellation without refreshing.
- Confirm polling pauses when the browser/app is backgrounded.

