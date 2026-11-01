# 2026-11-01 Listings and Notifications Use Shared Tokens

Builds on [[2026-11-01 Mobile Type Scale Consistency]].

## What changed and why
After the type scale pass the owner saw My Listings and Notifications still looked too big and did not use the shared system. They had oversized pills (44 to 52 px tall, 999 radius), beige fills and bigger icons than the other tabs. Both screens now use the shared theme and components, like Orders.

- The theme export `type` was renamed `typography` (`mobile/src/theme/index.ts`) so it is not confused with the TypeScript keyword.
- **My Listings** (`app/(app)/(tabs)/inventory.tsx`, `ProductCard.tsx`): title 22 and subtitle 13 like Orders, icon buttons 44, search and filter chips use `colors`, `radii` and `typography`, the card uses `radii.card` and `shadows.card`, and its three buttons are `ButtonComponent`. Photo 72 px.
- **Notifications** (`src/features/notifications/components/*`): header 18 like the tab header, summary banner 22 with a `ButtonComponent`, chips and search on theme tokens, rows use 44 px icons, 15 px titles and 14 px text, and row actions are `ButtonComponent`.
- Layout changes from the earlier restyle (flat rows, unread dot, inline counts, scrolling status chips) are kept.

## Verification
`bun run typecheck` in `mobile/` passed. Not checked on a device.

## Not done
Other screens still set `fontSize` directly instead of spreading `typography` roles. See [[2026-11-01 Mobile Type Scale Consistency]].
