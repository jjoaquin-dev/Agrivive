---
title: Final CTA Wording and Modern Restyle
type: delivery
date: 2026-10-30
status: code complete, browser check pending
---

# Final CTA Wording and Modern Restyle

## What changed

- Headline changed to "Start Shopping Today’s Surplus". The earlier "Today’s Harvest" wording is removed.
- Subtitle changed to "Join Davao buyers who save on surplus produce straight from neighborhood stalls." The word "fresh" is removed.
- Card restyled for a cleaner, modern look: decorative blurred blobs and heavy border removed, a single soft top highlight added, rounded corners kept at 24px on phones and 32px on larger screens.
- Search bar and Search button set to a fixed 48px height for a clear primary target. Popular chips and trust row use 14px text with 36px minimum height.
- Trust row and catalog link wrap cleanly on small screens with explicit row gaps.

## Why

- Wording follows the owner's request for the final call to action.
- Fitts's Law (Paul Fitts): primary search action is 48px high.
- Law of Common Region (Gestalt): the brand card encloses the search, chips and trust content as one group.
- Figure-Ground (Gestalt): the green card stays separate from the white section background.

## Fields and behavior

No fields were added or removed. The search text input, the category select, the Search submit, the popular search chips, the trust row, and the Browse Full Marketplace Catalog link keep their existing handlers and routes (`/marketplace?search=` and `productType`).

## Affected files

- `web/src/features/home/components/HomeFinalCta.tsx`

## Verification

- `bun run typecheck` in `web/` passed.
- Not checked in a browser.
