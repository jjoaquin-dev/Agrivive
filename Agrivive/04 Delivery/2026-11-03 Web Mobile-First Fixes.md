# Web mobile-first fixes (2026-11-03)

## What changed
- Toasts (order reserved, order cancelled) now fit between two 16px gutters on phones and sit top-right from 640px up.
- Orders: the four filter tabs show as a 2×2 grid on phones; Cancel reservation and Report an issue stack as full-width 48px buttons; order card buttons are 48px; page gutters are 16px on phones.
- Product cards fill the width on phones (marketplace and seller storefront).
- Messages: Back and the "Messages" breadcrumb return to the list on phones (the first chat no longer reopens by itself); Archive and Block get their own row; the chat height uses `dvh` and safe-area padding.
- Phone menu: a real search bar (new `MobileHeaderSearch.tsx`, shared URL logic in `headerSearchUrl.ts`), Price and Distance as two pills, 44px category rows.
- Landing header: "How to Install" link to `/download-app`; footers and the hero no longer repeat it. The install page uses the landing header.
- Small targets raised to 44px: message seller icon, follow button, sort dropdown, order reply and review buttons.

## Why
Phone screenshots from agrivive.tech showed clipped toasts and tabs, narrow product cards, a dead Back button and a link where a search bar belonged.

## Files
`web/src/features/orders/components/*` (toasts, tabs, card, detail, cancellation), `web/src/features/marketplace/components/ProductCard.tsx`, `MarketplaceProductGrid.tsx`, `SellerStorefront.tsx`, `MarketplaceHeaderFilters.tsx`, `web/src/features/conversations/components/*`, `web/src/components/BuyerSiteHeaderNav.tsx`, `BuyerHeaderSearch.tsx`, `MobileHeaderSearch.tsx`, `headerSearchUrl.ts`, `web/src/features/home/components/LandingHeader*.tsx`.

## Verification
`bun run typecheck` and `bun run build` in `web/` pass. Not yet checked on a phone or in DevTools.
