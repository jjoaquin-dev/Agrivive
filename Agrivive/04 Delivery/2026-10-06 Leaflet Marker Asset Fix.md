---
title: Leaflet Marker Asset Fix
type: delivery
status: implemented
date: 2026-10-06
---

# Leaflet Marker Asset Fix

## What changed

Configured the buyer web seller map to use explicit public paths for Leaflet's default marker, retina marker, and shadow images. Copied the bundled Leaflet images into the web app's public assets so they are served by Next.js.

## Why

Leaflet was requesting `marker-icon-2x.png` and `marker-shadow.png` from the site root, producing 404 responses because Next.js does not expose the images inside `node_modules` at those runtime paths. The missing assets could leave seller pins or their shadows incomplete.

## Affected paths

- `web/src/features/marketplace/components/InteractiveSellerMap.tsx`
- `web/public/leaflet/marker-icon.png`
- `web/public/leaflet/marker-icon-2x.png`
- `web/public/leaflet/marker-shadow.png`

## Verification

- `cd web && bun run typecheck` passed.
- `git diff --check` reported no whitespace errors.
- Browser network verification was not run in this turn; the expected asset paths are now `/leaflet/marker-icon.png`, `/leaflet/marker-icon-2x.png`, and `/leaflet/marker-shadow.png`.

## Commit

Not created yet.
