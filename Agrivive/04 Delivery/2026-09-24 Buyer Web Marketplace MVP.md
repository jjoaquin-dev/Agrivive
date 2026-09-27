# Buyer Web Marketplace MVP

Date: 2026-09-24

## What changed

Implemented the approved buyer marketplace web MVP for browsing produce, searching and filtering listings, using optional 10 km location filtering, viewing product details, reserving one product with an idempotency key, viewing buyer orders, showing active reservation QR codes, and cancelling pending reservations.

Aligned the header and buyer page bodies with one shared `PageContainer` so their left and right gutters stay consistent across desktop and mobile widths.

The shared API client includes credentials, abort-aware requests, and clear handling for network and HTTP errors. Development and production Next.js output now use `.next-dev` and `.next` separately to avoid stale chunk collisions. Login, signup, and email verification preserve a safe `next` destination.

## Why

This delivers the approved reference layout and buyer flow while keeping browsing public and making reservations, order history, QR pickup, and cancellation available to authenticated buyers. Cart, favorites, reviews, messaging, recommendations, and batch ordering remain out of scope.

## Affected paths

- `web/app/marketplace/`
- `web/app/orders/`
- `web/app/(auth)/login/page.tsx`
- `web/app/(auth)/signup/page.tsx`
- `web/app/(auth)/verify-email/page.tsx`
- `web/src/lib/api.ts`
- `web/src/lib/navigation.ts`
- `web/src/components/SiteHeader.tsx`
- `web/src/components/PageContainer.tsx`
- `web/src/features/marketplace/`
- `web/src/features/orders/`
- `web/next.config.ts`
- `web/package.json`
- `web/bun.lock`

No backend contract changes were made.

## Verification

- `cd web && bun run typecheck` passed.
- `cd web && bun run build` passed.
- Shared spacing-container update typechecked and built successfully.
- Production build generated marketplace and orders routes successfully.
- Manual browser acceptance checks remain for backend-connected data, geolocation permission states, reservation idempotency, QR visibility, cancellation, and 360px keyboard/accessibility behavior.
