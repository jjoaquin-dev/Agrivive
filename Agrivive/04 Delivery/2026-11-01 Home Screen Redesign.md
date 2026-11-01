# 2026-11-01 Home Screen Redesign

Builds on [[2026-11-01 Listings and Notifications Use Shared Tokens]].

## What changed and why
The owner supplied a Home reference and asked for the design and layout only, with no data changes. All six `Dashboard*` components in `mobile/src/features/dashboard/components/` were restyled on the shared theme (`colors`, `radii`, `shadows`, `typography`, `touchTargets`). Props, data hooks and `app/(app)/(tabs)/home.tsx` are unchanged.

- **Header:** initials avatar on the left (opens Profile, green dot when verified), then greeting, seller name and a pin with the shop name, then the bell with an unread dot. The logo and brand name and the "Manage your surplus products today." line were dropped for the reference layout.
- **Add Surplus Product / Scan Pickup QR:** text on the left, a round Plus or QR icon on the right. The existing subtitles are kept.
- **Today's Overview:** a new section title over the four metric cards. Each card has the label with an icon on top, a large value, and a note. Low Amount and Out of Stock notes are tinted pills. Available Surplus shows kg as the value and sacks below it.
- **Needs Your Attention:** white bordered tiles (3 by 2) with an icon and label. Low Stock shows "N items" and Messages shows "N new" with an alert dot, both from the existing counts.
- **Recent Amount Changes:** each change is its own card with a plus or minus circle, the product name, the reason as a small pill, and the amount and time.
- **Low Amount Alerts:** card spacing, heading and "Add More" button aligned to the same tokens.

## Not done
- The reference's bottom tab bar (Dashboard, Inventory, centre +, Orders, Profile) and its "Updated 2m ago", "Manage" and per-tile hint lines have no matching data or routes, so they were not added. The app's tabs are unchanged.

## Verification
`bun run typecheck` in `mobile/` passed. Not checked on a device.
