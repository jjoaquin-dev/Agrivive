# "Boost again" price drop prompt removed (2026-11-01)

**What:** The automatic 6-hour cut already posts the lower price to Facebook, so the extra "Boost Again" prompt after it was redundant. The backend no longer creates that prompt (the "Price Lowered" notification still goes out). The prompt list is gone from the Marketing > Running tab and its file was deleted. Running shows only boosts.

**Still works:** a seller can boost again by hand from the listing's Boost button (3-hour gap between price-drop posts applies). Prompt endpoints stay for old rows.

**Files:** backend integrations.visibility-boost.notify-price-lowered.ts (dist rebuilt); mobile app/(app)/marketing/index.tsx, ActiveBoostsSection.tsx; deleted PriceDropPromptList.tsx.

**Checked:** backend `bunx tsc --noEmit` and mobile `bun run typecheck` clean. Old prompt rows already in a database still show as "Needs your choice" until dismissed.
