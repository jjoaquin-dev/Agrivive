---
title: Overview Page Header Fixes
type: delivery
date: 2026-10-30
---

# Overview Page Header Fixes

## Problems (owner report, `/marketplace/overview`)
1. Header section links did nothing: `#categories`, `#live-inventory`, `#how-it-works`, `#why-agrivive`, `#faq` only exist on the home page.
2. The page title and description sat under the fixed header (main had only `py-8`/`lg:py-12`).
3. "Home" showed as current on every page.

## What changed
- `LandingHeader.tsx`: off `/`, section anchors become `/#section` links (shared by desktop nav and mobile drawer).
- `LandingHeaderNav.tsx`: current state per page: Home only on `/` with no section in view; route links match their own path (so "Public Marketplace Overview" is current on the overview page); anchors match the section in view. Live Surplus dot kept for `/#live-inventory`.
- `app/marketplace/overview/page.tsx`: `main` top padding `pt-24` (phones, header is one row) and `md:pt-44` (header is two rows, about 139 px) so the title clears the header. Print styles unchanged.

## Verification
`bun run typecheck` and `bun run build` in `web/` passed. Not checked in a browser.
