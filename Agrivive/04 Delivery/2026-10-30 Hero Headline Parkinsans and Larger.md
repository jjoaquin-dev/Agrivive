---
title: Hero Headline Parkinsans and Larger
date: 2026-10-30
type: delivery
status: done
---

# Hero Headline Parkinsans and Larger

## What changed

- The hero headline uses the Parkinsans brand font (`font-brand`) instead of the heading font.
- The headline is larger: `.hero-title-line` now scales from 36px to 72px (was 36px to 56px). At the pane width tested it measured about 50px, up from about 46px.
- The headline's wrapper is wider (`max-w-5xl`, was `max-w-4xl`) so "Rescue Surplus Vegetables" stays on one line.
- Text colour is `#E2FD56` across the headline (from the earlier request), with "Surplus" in the same colour.

## Affected files

- `web/src/components/sections/Hero.tsx`
- `web/app/globals.css` (`.hero-title-line` size)

## Verification

- `bun run typecheck` in `web/`: passed.
- Browser check on the dev server at port 3002, desktop width: font computed as Parkinsans; headline on two lines with "Rescue Surplus Vegetables" on the first.
- Not run: phone and tablet widths, production build.

## Commit

Not committed.
