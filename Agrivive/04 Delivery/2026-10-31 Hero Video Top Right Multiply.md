---
title: Hero Video Top Right, Multiply Blend
type: delivery
date: 2026-10-31
status: complete
---

# 2026-10-31 Hero Video Top Right, Multiply Blend

## What changed

On desktop, the hero video moves to the top right of the hero and is larger (up to 1080px wide). Its white background is hidden with `mix-blend-mode: multiply` on the white hero, so the video needs no re-encode. The text column now sits above the video (`relative z-10`).

## Files

- `web/src/components/sections/Hero.tsx`: video wrapper is `lg:absolute lg:right-0 lg:top-0` at `lg:w-[min(62vw,1080px)]`. Video has `mix-blend-multiply`. Text column has `relative z-10`.

## Verification

- Browser at 1440px emulation (pane scaled): video sits top right, text is not covered, white background is not visible.
- Mobile layout still uses the stacked layout under the text. The top-right placement applies from `lg` only.
- `bun run typecheck` in `web/` passes after this edit.
- Not checked: reduced motion and phone widths.

## Related

- [[2026-10-31 Hero Image Swapped for Video]].
