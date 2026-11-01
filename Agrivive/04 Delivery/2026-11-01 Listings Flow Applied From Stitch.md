---
title: Listings Flow Applied From Stitch
type: delivery
date: 2026-11-01
status: code complete, no device check
---

# Listings Flow Applied From Stitch

## What changed

The eight seller Listings frames from Stitch project `AGRIVIVE MOBILE UI` (`11184471743007910085`) were applied to the mobile app. Only the look was copied. Fields, rules and wording kept from the app: peso price drop every 6 hours after Boost, Final price, no low-stock field in the forms, Boost chip, locked selling unit on edit.

Where the frames showed older rules (12-hour drops, "Alert me when stock is low" input, 10% drop), the app version won.

| Frame | Applied in |
| --- | --- |
| Listings v1 | `app/(app)/(tabs)/inventory.tsx`, `InventoryListHeader`, `CategorySheet`, `InventoryEmptyState`, `ProductCard` |
| Add Produce v1 | `ProductForm`, `ProductFormOperations`, `ProductFormStyles`, `ProductPhotoField`, `create.tsx`, `_layout.tsx` (Cancel in header) |
| Product Details | `[id]/index.tsx`, `ProductDetailsSummary`, `ProductHistoryCard`, bottom bar (Edit Product, Change Amount), Share in header |
| Archive Confirmation Bottom Sheet | `ArchiveConfirmSheet` (replaces the native alert) |
| Edit Product | same form in edit mode: locked unit row, Cancel in header, sticky Save Changes |
| Change Amount Modal Sheet | `StockActionTabs`, `StockProductBanner`, `StockQuickAmounts`, `StockProjectionCard`, `StockChangeForm` |
| Stock Freshness Warning Sheet | `StockFreshnessWarningModal` (bottom sheet, shows hours old, starting price and current price) |
| In-Sheet Saved Confirmation | `StockSavedPanel`, shown inside `stock.tsx` instead of an alert |

## Behaviour changes

- New "Selling" status filter (`InventoryFilterTab` gained `selling`). Status labels are now Selling, Running low, Sold out, Archived through one helper, `productStatus.ts`.
- Category pills replaced by a Category button that opens a bottom sheet.
- Card Boost and Edit Listing buttons now sit in the expanded section (chevron).
- Add More and Take Away buttons on Product Details were replaced by one Change Amount button; the sheet has both tabs.
- The aging-batch banner inside the form was removed; the Freshness sheet still opens on save when the batch is 12 hours or older.

## Verification

`bun run typecheck` in `mobile/` passed. Nothing was run on a device. No backend or API change.
