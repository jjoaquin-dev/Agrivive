---
title: Buyer Web Marketplace Reference Layout
type: design-decision
status: documented
date: 2026-09-24
---

# Buyer Web Marketplace Reference Layout

## What changed

- Added a commerce-layout reference section to the buyer web layout guide.
- Added a cross-reference from the buyer web design system.
- Mapped the reference screenshot's header, category row, result toolbar, filter rail, and product grid to Agrivive terminology and API capabilities.
- Explicitly excluded favorites, cart, ratings, and reviews from this first web release.

## Why

The reference gives the marketplace a clear browsing hierarchy without changing Agrivive's visual identity or approved one-item reservation scope.

## Affected paths

- `.agents/design/web-design/DESIGN-LAYOUT.md`
- `.agents/design/web-design/DESIGN.md`

## Verification

- Confirmed the design-system cross-reference points to the new layout section.
- Confirmed the documented controls map to existing marketplace query fields.
- No application code or runtime behavior changed.
