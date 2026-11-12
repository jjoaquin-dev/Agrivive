---
title: Seller App Pill Controls and Quiet Borders
type: delivery
date: 2026-11-11
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]]

# Seller app pill controls and quiet borders

**App-wide (theme tokens in `mobile/src/theme/index.ts`).** Buttons are pills (`radii.button` 9999) and text fields are pills when one line, large round corners when tall (`radii.input` 28). Borders are `#EEECE6` (was `#E5E2DA`, also replaced where it was hard-coded), secondary buttons and search bars use 1 px outlines (was 1.5), muted fills are lighter (`#F7F6F2`, and `#F6F5F1` for the old `#F3F1EA`). Boxes that borrowed a button or input radius but are not controls (map, chat photo, warning and tip boxes) now use the card radius. Stack back buttons say "Back" instead of "(tabs)".

**Search and dropdowns.** Inventory search and Category, Messages search, Notification search and filter button, and the produce picker search are pills.

**Pagination.** The shared `PaginationControl` is text only: no card, no border, no pill group. The chosen size is green and underlined, Previous and Next are plain text.

**Listings pages.** Listings, Product Details, Edit Product, Change Amount, Add Product and the change history use the website white (`mobile/src/theme/surface.ts`); the Listings title is 28 like Reservations.

**Checked.** Mobile typecheck. Not seen on a phone; large radii on tall boxes and the pill search fields are the first things to look at.
