# 2026-10-31 Marketing Hub

Builds on [[2026-10-31 Boost Chips and Photo Check]]. Supersedes the separate Boost History screen and the Visibility Guide section inside Analytics.

## What changed and why
Boost was spread over five places with three names ("Boosts", "Marketing & Boosts", "Boost Visibility"). Owner decisions: the hub is called **Marketing**, and only the Marketing group moves (Change History, Trust and Reviews stay where they are). No backend change.

- **New hub** `mobile/app/(app)/marketing/index.tsx` with three sections: **Active** (price drops waiting for a boost, then boosts that are posting, running or did not post), **History** (every boost with filters and paging), **Visibility Guide** (how high each listing shows to buyers, each with a Boost button). `?section=active|history|visibility` opens a section.
- **Boost screen** moved to `marketing/[productId].tsx`. Its "View boost history" link opens the History section.
- **Feature folder** `src/features/boost` is now `src/features/marketing`. The Visibility Guide card, its factors grid and its API moved in from `src/features/analytics`.
- **New files:** `MarketingSectionTabs`, `ActiveBoostsSection`, `BoostHistorySection`, `PriceDropPromptList` (the old unused `SellerBoostPromptSection`, moved and reworded), `VisibilityGuideSection`, and hooks `useBoostHistory` and `useVisibilityGuide`.
- **Entry points:** the Home tile "Boosts" is now **Marketing**. The Listings menu item "Marketing & Boosts" is removed. Analytics shows one row, "Visibility Guide", that opens the hub on that section. All Boost buttons open `/(app)/marketing/[productId]`.
- Routes `boost/[productId]` and `boosts` no longer exist.

## Verification
Mobile `bun run typecheck` passes, and `bunx expo export --platform android` builds the bundle. No old route or `features/boost` references remain. Not tested on a device.

## Owner checks
Home Marketing tile opens Active; History and Visibility Guide tabs work; the Boost button and View Boost on a listing open the Boost screen; Boost Again from a notification and from Active opens it with the prompt; Analytics shows the Visibility Guide row and no list; the Listings menu has no Boost item.
