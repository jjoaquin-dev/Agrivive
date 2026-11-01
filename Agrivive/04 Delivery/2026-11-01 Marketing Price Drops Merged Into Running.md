# Marketing: Price Drops tab merged into Running (2026-11-01)

**What:** The Price Drops tab is gone. Its "Price dropped · Boost Again / Not Now" cards now sit at the top of the Running tab, above the running boosts. The Running badge counts both.

**Why:** Both tabs let the seller post, so the seller had to guess which tab to use (Hick's Law, Hick & Hyman).

**Files:** mobile/app/(app)/marketing/index.tsx, mobile/src/features/marketing/components/MarketingSectionTabs.tsx, ActiveBoostsSection.tsx (comment); PriceDropsSection.tsx deleted. No backend change.

**Checked:** `bun run typecheck` clean. Old `?section=drops` links fall back to Running.
