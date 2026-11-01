# Boost hub grouped by activity, with a Settings button (2026-11-01)

**What:**
- Tabs are only activity now: Running, Price Drops (history), History.
- Under the banner, two labelled buttons: **Settings** (gear) opens a "Boost Settings" sheet with the on/off switch for automatic price drops per listing; **How buyers find you** (bulb) opens the guide and goes back to Running when tapped again.
- Running cards are grouped by what they are doing: Needs attention, Posting now, Running, each with a count.
- Price Drops tab shows only the history; the switches moved into Settings.

**Why:** the tabs mixed things you watch with things you change. Settings are now one obvious button (Recognition over Recall, Nielsen; Hick's Law, Hick & Hyman).

**Files:** mobile marketing/index.tsx, MarketingSectionTabs, MarketingToolbar (new), AutoPriceDropSheet (new), PriceDropsSection, ActiveBoostsSection. No backend change.

**Checked:** `bun run typecheck` clean. Not seen on a device. `?section=visibility` links still open the guide.
