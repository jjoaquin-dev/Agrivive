# Buyer Web UX Principles

Date: 2026-09-24

## What changed

Added the approved UX and usability principles to `.agents/design/web-design/DESIGN.md`, grouped into familiarity, hierarchy, feedback, navigation, accessibility, forms, responsive behavior, resilience, and user-centered delivery.

Applied the highest-priority rules across authentication and marketplace screens:

- The auth logo now links home.
- Signup explains the password requirement before submission.
- Auth forms expose busy state while requests are running.
- Marketplace product cards clearly signal their destination.
- Product reservation quantity has an accessible constraint description.
- Price and quantity filters use non-negative numeric controls.
- Existing loading, error, retry, sold-out, and conflict feedback remains in place.

## Why

The principles make familiar actions easier to recognize, reduce cognitive load, prevent invalid input, improve feedback, and keep the buyer flow accessible across login, registration, verification, browsing, and reservation.

## Affected paths

- `.agents/design/web-design/DESIGN.md`
- `web/src/features/auth/components/AuthShell.tsx`
- `web/src/features/auth/components/AuthInput.tsx`
- `web/src/features/auth/components/PasswordInput.tsx`
- `web/app/(auth)/login/page.tsx`
- `web/app/(auth)/signup/page.tsx`
- `web/app/(auth)/verify-email/page.tsx`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`
- `web/src/features/marketplace/components/ProductCard.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`
- `web/src/features/marketplace/components/MarketplaceFilters.tsx`

## Verification

- `cd web && bun run typecheck` passed.
- `cd web && bun run build` passed.
- Manual browser review remains for keyboard focus, 360px layout, screen-reader announcements, and backend-connected error paths.
