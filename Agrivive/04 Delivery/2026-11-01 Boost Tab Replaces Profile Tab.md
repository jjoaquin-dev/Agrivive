# Boost tab replaces the Profile tab; Home picture shows the photo (2026-11-01)

**What:**
- Bottom bar: Home, Reservations, Listings, Messages, **Boost** (megaphone). The Profile tab is gone; the profile is the same screen opened from the picture at the top left of Home (`/(app)/profile`, with a back button).
- The picture button on Home now shows the seller's photo (`setup.account.image`, then `session.user.image`) and falls back to initials, same as the profile screen.
- Links into the Boost hub (Home "Promote", Analytics guide link, "See boost history") now go to `/(app)/(tabs)/marketing`.

**Files:** mobile app/(app)/(tabs)/_layout.tsx, (tabs)/marketing.tsx (new, re-exports marketing/index), (tabs)/profile.tsx (deleted), (tabs)/home.tsx, DashboardHeader.tsx, marketing/[productId].tsx, analytics.tsx. No backend change.

**Checked:** `bun run typecheck` clean. Not seen on a device. The picture is only on Home.
