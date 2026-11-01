# Marketing tabs spaced out, history filtered by activity (2026-11-01)

**What:**
- The four Marketing tabs were squeezed into one boxed bar. They are now underlined tabs in a row that scrolls sideways, with space between them and bigger text (Fitts's Law, Paul Fitts: bigger, separated targets).
- History chips now filter by activity: All activity, Running, Posted, Price dropped, Did not post, each with a count. "Needs your choice" is gone (the Boost Again prompt no longer exists). "Price dropped" lists boosts that cut the price at least once or were posted after a price change.

**Files:** mobile MarketingSectionTabs.tsx, BoostHistorySection.tsx. No backend change.

**Checked:** `bun run typecheck` clean. Not seen on a device.
