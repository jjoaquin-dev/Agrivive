---
title: Buyer Login Navigation Performance
type: implementation-status
status: implemented
date: 2026-09-24
---

# Buyer Login Navigation Performance

## What changed

- Lazy-loaded the Better Auth browser client until the login or two-factor form is submitted.
- Removed priority loading from the decorative authentication image and added responsive image sizing.
- Added an authentication route loading state so `/login` shows immediate feedback while Next.js loads the route.

## Why

The local server returned `/login` quickly after compilation, but the first development navigation waited for route compilation, the eager auth client bundle, and a 1 MB prioritized image. The console hydration warning was caused by a browser extension injecting `fdprocessedid` attributes into form controls.

## Affected paths

- `web/app/(auth)/login/page.tsx`
- `web/app/(auth)/loading.tsx`
- `web/src/features/auth/components/AuthShell.tsx`

## Verification

- Web TypeScript check: passed with `bun run typecheck`.
- Web production build: passed with `bun run build`.
- `git diff --check`: passed for tracked changes.
- Browser-extension hydration warning: not an application markup mismatch; verify with extensions disabled or in Incognito.
