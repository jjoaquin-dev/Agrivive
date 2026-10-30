---
title: Hero Restored to Last Commit
type: delivery
date: 2026-10-30
status: code complete, browser check done on the home page
---

# Hero Restored to Last Commit

## What changed

- Restored the hero from the last commit (HEAD, `b2886e18`): `web/src/components/sections/Hero.tsx`, `web/src/components/sections/HeroFloatingSlices.tsx`, and `web/src/lib/gsap/hero-entrance.ts`.
- The restored hero shows the photo produce slices on both sides, the "Davao City Farms & Public Market Stalls" pill, the headline "Rescue Surplus Vegetables in Davao City", and the original harvest crate photo.
- The uncommitted hero work is removed from these three files: the outline drawings, the produce chips inside "Surplus", the lime spotlight, and the surplus morph entrance.

## Why

- The owner asked to bring back the hero design. They chose the last commit over an earlier commit or keeping the current uncommitted design.

## Files kept, not deleted

- `web/src/components/sections/HeroOutlineArt.tsx`, `web/src/components/sections/HeroSurplusProduce.tsx`, and `web/src/lib/gsap/hero-surplus.ts` are untracked and no longer imported. They were kept in case the owner wants them back.
- Backups of the replaced files are in the session scratchpad, named `*.before-restore.*`.

## Verification

- `bun run typecheck` in `web/` passed.
- Home page at `localhost:3001` renders the restored hero in the built-in browser.
- Not checked: reduced motion, phone width, and the entrance animation timing.

## Open point

- The last commit still shows the "Davao City Farms & Public Market Stalls" pill. An earlier snapshot note recorded that this pill was removed. Confirm whether the pill should stay.
