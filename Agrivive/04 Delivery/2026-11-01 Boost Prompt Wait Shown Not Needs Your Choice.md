# Boost prompt in its wait time no longer says "Needs your choice" (2026-11-01)

**What:** A price-drop prompt made right after a price drop post is blocked for 3 hours. It used to show "Needs your choice" with nothing to press. Now:
- Running card shows "Posted" and "You can boost this lower price again in about N hours."
- Prompt card text says the price was just posted; the button is grey and reads "Wait ~N hours".
- Backend adds `waitUntil` to `progress` (boost history/read) and to each item of `GET /seller/boost-prompts`. Null when it can be boosted.

**Files:** backend seller.visibility-boost.progress.ts, seller.visibility-boost.prompts.list.ts; mobile marketing types.ts, BoostHistoryCard.tsx, PriceDropPromptList.tsx, notifications/types.ts.

**Checked:** backend `bunx tsc --noEmit` and mobile `bun run typecheck` clean. Not yet tested on a device. Owner to test: after an automatic price cut posts, open Marketing > Running.
