---
title: Home Footer Logo Panel and Restyle
type: delivery
date: 2026-10-30
status: code complete, browser check pending
---

# Home Footer Logo Panel and Restyle

## What changed

- The logo now sits on its own white rounded panel. Before, the logo was forced to white (`brightness-0 invert`) on a white image background, so it showed as an empty white block.
- Logo shown in its original green colors on the panel.
- Column headings have a small gold dot. Links slide 4px right on hover instead of only changing color.
- The Seller App download is a bordered button, so it reads as the one action in that column.
- A thin gold highlight line runs along the top edge of the footer.
- Watermark, spacing and the bottom sub-bar are kept with slightly stronger contrast.

## Why

- Law of Common Region (Gestalt): the logo is enclosed on a white panel so it reads as one brand unit.
- Figure-Ground (Gestalt): the white panel lifts off the green footer.
- Affordances and Signifiers (Don Norman): the download button looks pressable; the links show their hover state.
- Von Restorff Effect: gold is reserved for headings and accents, so the seller download stands apart.

## Fields and behavior

No fields or routes changed. All category links (`/marketplace?productType=`), the section anchors, Sign In, Create Account, Market Map and the APK download (`/downloads/agrivive-seller.apk`) keep their targets.

## Affected files

- `web/src/features/home/components/HomeFooter.tsx`

## Verification

- `bun run typecheck` in `web/` passed.
- Not checked in a browser.
