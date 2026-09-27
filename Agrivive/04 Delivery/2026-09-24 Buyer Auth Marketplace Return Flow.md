# Buyer Auth Marketplace Return Flow

Date: 2026-09-24

## What changed

Changed the buyer authentication default return destination to `/marketplace`.

- Guest marketplace → sign in → marketplace.
- Marketplace → signup → email verification → sign in → marketplace.
- Explicit `next` destinations remain preserved, so a Buy Now sign-in still returns to the product page.

## Affected paths

- `web/src/lib/navigation.ts`
- `web/app/(auth)/login/page.tsx`
- `web/app/(auth)/signup/page.tsx`
- `web/app/(auth)/verify-email/page.tsx`

## Verification

- `cd web && bun run typecheck` passed.
- `cd web && bun run build` passed.
