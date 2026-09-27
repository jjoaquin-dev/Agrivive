# Buyer Web Lucide Icon System

Date: 2026-09-24

## What changed

Added `lucide-react` and documented the buyer website icon rules in `.agents/design/web-design/DESIGN.md`.

Applied Lucide icons to shared navigation, mobile menu controls, password visibility, search and filters, location, retry and clear actions, product cards, order statuses, order actions, fallback images, home actions, and not-found recovery.

Icons remain paired with visible text wherever the action is important. Decorative icons use `aria-hidden`, and icon-only controls retain accessible labels and minimum touch targets.

## Affected paths

- `.agents/design/web-design/DESIGN.md`
- `web/package.json`
- `web/bun.lock`
- `web/src/components/SiteHeader.tsx`
- `web/src/features/auth/components/PasswordInput.tsx`
- `web/app/(auth)/login/page.tsx`
- `web/app/(auth)/signup/page.tsx`
- `web/app/(auth)/verify-email/page.tsx`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`
- `web/src/features/marketplace/components/MarketplaceFilters.tsx`
- `web/src/features/marketplace/components/ProductCard.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`
- `web/src/features/marketplace/components/ProductImage.tsx`
- `web/src/features/orders/components/BuyerOrders.tsx`
- `web/src/features/orders/components/OrderCard.tsx`
- `web/src/features/orders/components/OrderStatusBadge.tsx`
- `web/app/page.tsx`
- `web/app/not-found.tsx`

## Verification

- `cd web && bun run typecheck` passed.
- `cd web && bun run build` passed.
