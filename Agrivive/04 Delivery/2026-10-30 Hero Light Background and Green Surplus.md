---
title: Hero Light Background and Green Surplus
date: 2026-10-30
type: delivery
status: done
---

# Hero Light Background and Green Surplus

## What changed

- Hero background is now `#F8F6F1` (the project's Warm Cream), not pure white and not the green field.
- Headline, sentence and the hero's text are near-black `#111827`.
- "Surplus" in the headline is `#457D00`. Its underline uses the same colour, so it stays visible on the light background.
- Buttons and focus rings adjusted for the light background: the outline button now has a `#457D00` border and dark text; its icon and focus ring match.
- The floating labels are unchanged.

## Affected files

- `web/src/components/sections/Hero.tsx`

## Verification

- `bun run typecheck` in `web/`: passed.
- Browser check on the dev server at port 3002, desktop width: colours applied as requested; headline, sentence, buttons and labels all readable.
- Not run: phone and tablet widths, production build.

## Commit

Not committed.
