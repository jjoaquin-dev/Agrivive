# 2026-11-01 Listings Reference Layout

Builds on [[2026-11-01 Home Screen Redesign]].

## What changed and why
The owner supplied a "Surplus Inventory" reference and chose the Listings tab with the current card buttons kept (Details, Boost, Edit Listing). Design and layout only. No data, hooks or routes changed.

- `app/(app)/(tabs)/inventory.tsx`: the listing count is now a green pill next to the title. Search and Filter sit on one row (Filter keeps its existing behavior and badge). Status chips show the count in a small bubble ("All" with 15), not in brackets. Sort moved to its own row with "Newest First".
- `ProductCard.tsx`: the status badge (Active, Low Stock, Sold Out, Archived) moved to the top right of the name line, the product code sits under the name, and the price row holds the discount or "Drops" badge. A divider now separates the top block from the stock bar. Photo is 88 px.
- Fixed a bug in my own style-edit helper that had dropped three card styles mid-edit. They were restored before typecheck.

## Not done
- The reference's Take Away, Add More and Change Amount buttons, its "N kg in stock" line, and its bottom tab bar were not copied. They would change what the card does or duplicate the stock numbers already shown.

## Verification
`bun run typecheck` in `mobile/` passed. Not checked on a device.
