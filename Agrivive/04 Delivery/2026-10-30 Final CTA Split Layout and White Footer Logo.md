---
title: Final CTA Split Layout and White Footer Logo
type: delivery
date: 2026-10-30
status: code complete, browser check done on the home page
---

# Final CTA Split Layout and White Footer Logo

## What changed

- **Final CTA** (`web/src/features/home/components/HomeFinalCta.tsx`): the card is now a split layout. The headline, subtitle, search, popular chips and trust row sit on the left, left-aligned. The real harvest crate photo (`agrivive-harvest-crates-enhanced.webp`) fills the right side on desktop and sits below the text on phones. The gradient overlay and the hairline rule are removed. The trust row sits on a soft tone step. The search button uses the brand Forest Green `#1F4D3A`.
- **Footer** (`web/src/features/home/components/HomeFooter.tsx`): the white panel and its shadow are removed. The logo is now a new white version, `web/public/brand/agrivive-logo-full-white.png`, placed directly on the green field. The "Davao City Farms & Public Market Stalls" pill is now a plain line with a pin icon. The gradient top line is removed. The seller download is a soft tone button. The large AGRIVIVE watermark is a little stronger.
- **New asset:** `agrivive-logo-full-white.png` was made from `agrivive-logo-full-new.png`. Its white background becomes transparent and its green becomes white, with soft edges. It was made once with a Pillow script and is not generated at build time.

## Why

- Reference screenshots from the owner: the CTA card and footer, with the logo's white block to be removed and the logo shown in white.
- Design rules from the design-taste skill: no gradients or hairlines, one real photo instead of decoration, and a tone step to separate surfaces.
- Law of Common Region (Gestalt): the photo and the message share one card, so they read as one unit.
- Figure-Ground (Gestalt): the green card and footer stay clean without shadow.

## Fields and behavior

- No fields or routes changed. The search input, category select, Search button, popular chips, trust row, catalog link, footer links, anchors, and APK download keep their handlers and targets.
- The search and category `select` now have `aria-label`s, so they are named for screen readers.

## Verification

- `bun run typecheck` in `web/` passed.
- The design-taste lint on both files passed with 0 FAIL and 0 WARN.
- Checked in the built-in browser at `localhost:3001`: the CTA card and the footer render without the white block. Checked at a phone-sized viewport only.
- Not checked: the desktop two-column layout at 1440px, reduced motion, and the full inspector run.
