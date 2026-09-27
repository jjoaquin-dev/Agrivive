# 2026-09-28 Buyer Profile Header Sign Out Removal

## Summary

Removed the redundant `Sign out` button from the upper right of the buyer's profile header card (`ProfileHeader.tsx`), eliminating visual clutter and relying on the canonical sign-out action in the global navigation menu.

## What Changed

- **`web/src/features/profile/components/ProfileHeader.tsx`**:
  - Removed the `Sign out` `<Button>` from the upper right corner of the identity card.
  - Cleaned up unused imports: `LogOut` from `lucide-react`, `Button` from `@/components/ui/button`, and `authClient` from `@/src/lib/auth-client`.
  - Maintained full identity presentation: initials badge, buyer name, verified buyer badge, email, membership year, and rebalanced pickup activity metrics.

## UX Standards & Psychological Theories

- **Hick-Hyman Law** *(William Edmund Hick & Ray Hyman)*: Reduced choice overload by eliminating duplicate controls for the same intent. Sign-out remains centrally accessible in the site navigation bar (`BuyerSiteHeader`).
- **Von Restorff Effect (Isolation Effect)** *(Hedwig von Restorff)*: Without the secondary action button competing for attention, the buyer's identity and verified status stand out cleanly.
- **Ten Principles for Good Design** *(Dieter Rams)*: "Good design involves as little design as possible." Removing unneeded UI controls enhances clarity and calmness.

## Affected Files

- `web/src/features/profile/components/ProfileHeader.tsx`

## Verification Performed

- **Line Count Limits**: `ProfileHeader.tsx` is 94 lines (strictly $\le 200$ lines).
- **TypeScript Check**: `bun run typecheck` (`tsc --noEmit`) completed with 0 errors.
- **Production Build**: `bun run build` (`next build`) compiled 11/11 pages successfully with 0 errors.
