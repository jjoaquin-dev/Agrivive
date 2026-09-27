# Buyer Web shadcn Redesign

Date: 2026-09-26

## What changed

- Added shadcn/ui with the Base UI `base-nova` preset, Tailwind CSS 3 tokens, and reusable Button, Card, Field, Input, Alert, Badge, Sheet, Separator, Empty, Skeleton, and Spinner components.
- Restyled buyer sign-in, sign-up, email verification, marketplace, listing details, reservations, and reservation details.
- Added a responsive buyer header on app pages. The landing page and its original header remain unchanged.
- Replaced the cart page with a floating lower-right cart button and a right-side sliding sheet. The sheet supports quantity edits, item removal, checkout, sign-in return, and refresh after changed-item conflicts. The existing local guest cart remains available.
- Refined each cart item into a horizontal card: image beside three detail rows for product/seller, price, and quantity actions.
- Fixed decimal quantity entry by keeping a text draft during typing and committing a valid number on blur.
- Kept source files within the repository's 200-line readability limit.

## Why

Use a consistent shadcn component system across buyer screens and make cart access available without leaving marketplace or order pages, while keeping the landing page design intact.

## Affected paths

- `web/package.json`, `web/bun.lock`, `web/components.json`, `web/tailwind.config.ts`, `web/src/styles/tokens.css`
- `web/components/ui/` (button, card, input, field, label, alert, badge, empty, separator, sheet, skeleton, spinner)
- `web/lib/utils.ts`
- `web/app/layout.tsx`, `web/app/cart/page.tsx`
- `web/app/(auth)/login/page.tsx`, `web/app/(auth)/signup/page.tsx`, `web/app/(auth)/verify-email/page.tsx`
- `web/app/marketplace/` and `web/app/orders/` pages and loading states
- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/features/auth/components/`
- `web/src/features/cart/CartProvider.tsx`, `web/src/features/cart/components/CartDrawer.tsx`, `web/src/features/cart/components/CartRoute.tsx`
- `web/src/features/marketplace/components/` (ProductCard, MarketplaceFilters, MarketplaceBrowser, ProductDetail)
- `web/src/features/orders/components/` (OrderStatusBadge, OrderCard, BuyerOrders, OrderDetail, OrderQr)

## Verification

- Reviewed route wiring, cart/auth return behavior, Tailwind component scanning, and the 200-line limit across changed application and UI component files.
- Automated tests, type checking, and browser visual review were not run.
