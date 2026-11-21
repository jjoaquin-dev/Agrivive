# 2026-11-12 Large Text and Nav Buttons

Up: [[Delivery Index 2026-11]]

**Why:** With the phone text set to largest, the bottom tab names were cut off and the labels overlapped the phone's Back/Home buttons. Older sellers use large text.

**Changed (mobile only):**
- `mobile/app/(app)/(tabs)/_layout.tsx`: the tab bar height now grows with the text size (name text grows up to 1.3x, then shrinks to fit on one line) and always sits above the phone's bottom buttons or gesture line.
- `mobile/app/(app)/_layout.tsx`: screens opened from the tabs (Boost, Stall Hours, Seller Profile, Listing Details, Edit Listing, Change History, Notifications, Advisories) keep their last content above the phone's bottom buttons.
- `DashboardHeader.tsx`, `DashboardMetrics.tsx`: seller name, shop name and stat labels wrap to two lines instead of showing "…".

**Verified:** `bun run typecheck` clean. Not yet checked on a phone at largest text with 3-button navigation; needs a new seller build.
