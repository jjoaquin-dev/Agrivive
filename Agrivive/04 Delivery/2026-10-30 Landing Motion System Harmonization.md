---
title: Landing Motion System Harmonization
type: delivery
date: 2026-10-30
---

# Landing Motion System Harmonization

## What changed
- One motion vocabulary: eases POP (`back.out(1.6)`), SETTLE (`power3.out`), GLIDE (`power2.inOut`); durations 0.2 / 0.45 / 0.7 / 0.9 s. Mirrored in Tailwind as `ease-pop`, `ease-settle`, `ease-glide`.
- Splash: scattered elastic/back/power eases replaced by POP and GLIDE (veggie arcs keep their physics eases).
- Staged hand-off: logo flies to the header, the header search, actions and sub-nav arrive as it lands, then the hero cascade starts (0.4 s after the exit begins).
- Hero: underline under "Surplus" draws in after the headline; slices pop in and then bob gently at rest (paused off screen, off for reduced motion).
- Scroll reveals: `data-reveal` blocks settle; `data-reveal="pop"` (category tiles, How It Works cards) scale up with a light pop.
- Hovers: card lifts 200 ms, image zooms 500 ms with `ease-settle`, Register button lifts like the hero buttons instead of scaling.
- Removed unused `src/lib/gsap/presets.ts`; unused hooks now use the shared eases.

## Not done
- Squash steps in the splash were left at their current timing: the three landings overlap, so lengthening them needs a re-time.
- Unused `components/animations/*` and hooks were kept.

## Files
`web/src/lib/gsap/{easings,hero-entrance,timelines,splash-handoff}.ts`, `web/src/hooks/{useRevealOnScroll,useFadeIn,useStagger,useScrollReveal}.ts`, `web/tailwind.config.ts`, `web/src/components/sections/Hero.tsx`, `web/src/features/home/components/{LandingHeader,HomeCategories,HomeHowItWorks,HomeWhySurplus,HomeWhySurplusCard,HomeFeaturedProduceCard}.tsx`

## Verification
`bun run typecheck` and `bun run build` in `web/` passed. Not checked in a browser.
