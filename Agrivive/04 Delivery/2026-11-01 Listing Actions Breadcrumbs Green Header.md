---
title: Listing Actions Breadcrumbs Green Header
type: delivery
date: 2026-11-01
status: complete
---

# Listing Actions Breadcrumbs Green Header

## What changed

- **Listing actions:** the listing info card has share, save (heart), and a more menu at the top right. The heart uses the existing wishlist toggle. Share uses the device share sheet and falls back to copying the link. The more menu has "Copy link". The buttons are 44px, to meet the touch-target rule. New file: `web/src/features/marketplace/components/ProductListingActions.tsx`.
- **Breadcrumbs:** a shared `Breadcrumbs` component (`web/src/components/Breadcrumbs.tsx`) replaces the "Back to ..." links at the top left on the listing, orders, order details, saved items, notifications, messages, settings, and seller stall pages.
- **Marketplace header:** on `/marketplace` pages the buyer header is the system green (`#457D00`), with the white logo, white icons, and white category links. Other pages keep the white header.
- **Category heading:** "Browse Surplus Vegetables" is now "Browse Surplus Vegetables Categories".

## Affected files

- `web/src/components/Breadcrumbs.tsx` (new)
- `web/src/features/marketplace/components/ProductListingActions.tsx` (new)
- `web/src/features/marketplace/components/ProductInfoCard.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`
- `web/src/features/marketplace/components/SellerStorefront.tsx`
- `web/src/features/marketplace/components/MarketplaceCategories.tsx`
- `web/src/features/orders/components/BuyerOrders.tsx`
- `web/src/features/orders/components/OrderDetail.tsx`
- `web/src/features/wishlist/components/BuyerFavorites.tsx`
- `web/src/features/notifications/components/BuyerNotifications.tsx`
- `web/src/features/conversations/components/BuyerConversations.tsx`
- `web/src/features/profile/components/BuyerProfile.tsx`
- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/components/BuyerSiteHeaderNav.tsx`
- `web/app/globals.css`

## Not changed

- The chat thread's own back-arrow button (`ConversationThread.tsx`) is kept, since it sits inside the thread header rather than at the page top.
- The marketplace page itself has no breadcrumb, since it is the top-level page.

## Verification

- `bun run typecheck` in `web/` passed.
- Checked in the preview: the green header and white logo render on `/marketplace`. The listing page shows the breadcrumb and the share, save, and more buttons.
- Not checked: clicking save and share, the copy-link fallback, and desktop widths.
