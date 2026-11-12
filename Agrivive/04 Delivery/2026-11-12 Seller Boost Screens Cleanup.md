---
title: Seller Boost Screens Cleanup
type: delivery
date: 2026-11-12
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Related: [[2026-11-11 Seller Messages Screens Cleanup]]

# Seller Boost screens cleanup

**What changed.** The Boost hub (Running, Price Drops, History, How buyers find you, Boost Settings) uses the website white page and white cards with the very light border and shadow from `mobile/src/theme/surface.ts`. The banner text is darker and larger (14), the Settings and How buyers find you buttons are equal soft pills (selected one is tinted green), tabs are 15 with a small count badge, the visibility cards have bigger product names (17), 15 body text and 15 button text, the Running tab's section titles are 17, the empty state has a larger title and button, History chips are 14, and the Boost Settings sheet has a 22 title, 17 group headings and 13 captions.

**Files.** `mobile/app/(app)/marketing/index.tsx` and the components in `mobile/src/features/marketing/components/` (banner, toolbar, section tabs, visibility card and guide, active boosts, history section, settings sheet and its two switch lists).

**Checked.** Mobile typecheck. Not seen on a phone. The Boost detail and started screens were not changed.
