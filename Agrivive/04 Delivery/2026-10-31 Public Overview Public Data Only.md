---
title: Public Overview Public Data Only
type: delivery
date: 2026-10-31
status: complete
---

# Public Overview Public Data Only

## What changed

- **Navbar logo:** the logo was in the header but hidden. The pre-paint script added `splash-pending` on every page, and only the home page's splash removes it, so `#header-logo` stayed `visibility: hidden` on the overview. The script now adds `splash-pending` only on `/`.
- **Marketplace link:** the right padding of the nav pill went from `pr-2` to `pr-6`, which moves the Marketplace link left. The pill is shared with the home page.
- **Stall and shopper data removed:** the "Participating Market Stalls" and "Community Buyer Participation" sections are removed from the page and the printable report. The "Community Stalls & Shoppers" KPI card is removed too. The components `MarketplaceSellerStallsComponent.tsx` and `MarketplaceBuyerImpactComponent.tsx` are deleted, because nothing else used them.
- **Layout:** Top 10 Most Purchased Produce and Surplus Crop Distribution sit side by side. Market Activity & Rescue Flow is full width below them.
- **Bigger chart:** the activity chart's viewBox height went from 200 to 300.
- **Printable report:** the stall and shopper rows are removed. The category section is now titled "Surplus Crop Distribution".

The kept public figures are Total Food Rescued, Active Surplus Listings, Pickup Fulfillment Rate, Top 10 Most Purchased Produce, Surplus Crop Distribution, and Market Activity & Rescue Flow.

## Affected files

- `web/app/layout.tsx`
- `web/src/features/home/components/LandingHeader.tsx`
- `web/app/marketplace/overview/page.tsx`
- `web/src/features/marketplace/components/MarketplaceOverviewKpiComponent.tsx`
- `web/src/features/marketplace/components/MarketplaceOverviewPrintComponent.tsx`
- `web/src/features/marketplace/components/MarketplaceActivityTrendComponent.tsx`
- Deleted: `web/src/features/marketplace/components/MarketplaceSellerStallsComponent.tsx`, `web/src/features/marketplace/components/MarketplaceBuyerImpactComponent.tsx`

## Not changed

- The backend and the overview API types still return `sellerStalls` and `buyerSummary`. The frontend no longer reads them. Removing them from the API is a separate backend change.

## Verification

- `bun run typecheck` in `web/` passed.
- Not checked in a browser.
