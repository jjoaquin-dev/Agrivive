---
title: Landing Navbar Glass, Logo Size, Hero Pill Removal, Process and Why Choose Redesign
type: delivery
date: 2026-10-30
status: code complete, browser check pending
---

# Landing Navbar and Sections Redesign

## What changed

1. **Navbar glass effect** (`web/src/features/home/components/LandingHeader.tsx`): both header pills use translucent white with `backdrop-blur-xl` and `backdrop-saturate-150`. The scrolled state is denser (`bg-white/80`).
2. **Logo size**: the cart icon went from 38x30px to 28x22px so it matches the height of the "Agrivive" wordmark at 22px.
3. **Hero pill removed** (`web/src/components/sections/Hero.tsx`): the "Davao City Farms & Public Market Stalls" eyebrow is gone. Its entrance step in `web/src/lib/gsap/hero-entrance.ts` is removed too. The footer copy of the same name is unchanged.
4. **The Process** (`web/src/features/home/components/HomeHowItWorks.tsx`): a plain numbered timeline. Step markers sit on one hairline on desktop. Images use a 4:3 rounded frame with no card border or shadow.
5. **Why Choose Agrivive** (`HomeWhySurplus.tsx`, `HomeWhySurplusCard.tsx`): a dark panel for the two buyer-trust figures (95.1%, 97.6%), then four equal benefit cards with one shared shape (media, tag, headline, description). The two photo cards keep their images. The two icon cards use an icon tile.

Copy, data and field names are unchanged. The `STAT_SOURCE` TODO is kept.

## Affected files

- `web/src/features/home/components/LandingHeader.tsx`
- `web/src/components/sections/Hero.tsx`
- `web/src/lib/gsap/hero-entrance.ts`
- `web/src/features/home/components/HomeHowItWorks.tsx`
- `web/src/features/home/components/HomeWhySurplus.tsx`
- `web/src/features/home/components/HomeWhySurplusCard.tsx`

## Verification

- `bun run typecheck` in `web/`: passed.
- `bun run build` in `web/`: passed.
- Not checked in a browser. Check the glass header over the hero and over scrolled cream sections, the logo lockup, and the Process and Why Choose layouts at phone, tablet and desktop widths.

## Related

- Snapshot: [[00-LATEST]]
