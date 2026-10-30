# How It Works Step Cards on Market Photo (2026-10-30)

**What changed:** The stacking step cards moved into "The Process / How Agrivive Works" (`#how-it-works`) and replaced its three old image cards. The section now has the market photo as a background that stays in place while the cards scroll over it. The heading, eyebrow and supporting line keep their wording; their colours turned light (lime and white) to read on the photo. The separate step-cards section under the hero was removed.

**Files:**
- `web/src/features/home/components/HomeHowItWorks.tsx` (rewritten, now a client component)
- `web/src/features/home/components/HomeStepCards.tsx` (deleted)
- `web/app/page.tsx` (no longer renders the step cards)
- `web/public/how-it-works/market-background.webp` (new background)

**Leftovers:** `web/public/how-it-works/step-1-source.jpg`, `step-2-discover.png` and `step-3-collect.jpg` are no longer used anywhere.

**Open copy issue:** The supporting line still says "Three simple steps", but there are four cards.

**Verification:** `bunx tsc --noEmit` clean. Checked at 1440 width in the browser: cards stack over the photo. Mobile and tablet not rechecked after this move.
