---
title: Parkinsans Headers Alerts and Cart Motion
type: delivery
date: 2026-10-31
status: complete
---

# Parkinsans Headers Alerts and Cart Motion

## What changed

- **Headers:** the `heading` font family in `web/tailwind.config.ts` now starts with Parkinsans, so every `font-heading` element uses it. Body text stays on Plus Jakarta Sans.
- **Footers:** the landing footer (`HomeFooter.tsx`) and the marketplace footer (`MarketplaceFooter.tsx`) use `font-brand` (Parkinsans) on the `<footer>`.
- **Marketplace hero:** `MarketplaceHero.tsx` uses `font-brand` on the section, so the eyebrow and body text use Parkinsans too.
- **Alerts:** the shared `components/ui/alert.tsx` now has 2xl radius, a soft shadow, and `success` and `warning` variants. `destructive` uses rose tones.
- **Toasts:** `OrderSuccessToast.tsx` and `OrderCancelToast.tsx` use the shared alert, have an icon tile, and show a progress bar that counts down the auto-dismiss (6s and 5s).
- **Restriction notice:** `TrustAccessNotice.tsx` uses the same soft rose surface and icon tile.
- **Cart motion:**
  - The header cart icon wiggles on hover of the Cart button.
  - The header count badge bumps when the count changes.
  - The empty-cart icon floats.
  - Cart items slide in one after another.
  - The Reserve button arrow nudges right on hover.
  - The Add to Cart icon wiggles on hover in the product card.
- All motion is disabled under `prefers-reduced-motion`. The keyframes are in `web/app/globals.css`.

## Affected files

- `web/tailwind.config.ts`
- `web/components/ui/alert.tsx`
- `web/app/globals.css`
- `web/src/features/home/components/HomeFooter.tsx`
- `web/src/features/marketplace/components/MarketplaceFooter.tsx`
- `web/src/features/marketplace/components/MarketplaceHero.tsx`
- `web/src/features/orders/components/OrderSuccessToast.tsx`
- `web/src/features/orders/components/OrderCancelToast.tsx`
- `web/src/features/trust/components/TrustAccessNotice.tsx`
- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/features/marketplace/components/ProductCardAction.tsx`
- `web/src/features/cart/components/CartDrawer.tsx`

## Not done

- Item 6 in the request was blank, so nothing was done for it.

## Verification

- `bun run typecheck` in `web/` passed.
- Not checked in a browser.
