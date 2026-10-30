---
title: Landing Nav Active State and Footer Polish
type: delivery
date: 2026-10-30
---

# Landing Nav Active State and Footer Polish

## What changed
- Section nav now highlights the section in view (scroll-spy) and sets `aria-current`. Home is current while no section is in view.
- Section nav moved out of `LandingHeader.tsx` into `LandingHeaderNav.tsx` (file was over 200 lines).
- Live Surplus dot respects reduced motion.
- Footer links: 200 ms colour transition, visible keyboard focus ring. Bottom bar text contrast raised (60% to 75%).

## Why
Brief asked for active link indicators, hover states and footer readability. Splash, hero, reveals, sections and discovery card were already refined in earlier records.

## Files
- `web/src/hooks/useActiveSection.ts` (new)
- `web/src/features/home/components/LandingHeaderNav.tsx` (new)
- `web/src/features/home/components/LandingHeader.tsx`
- `web/src/features/home/components/HomeFooter.tsx`

## Verification
`bun run typecheck` in `web/` passed. Not checked in a browser. Marketplace files untouched.
