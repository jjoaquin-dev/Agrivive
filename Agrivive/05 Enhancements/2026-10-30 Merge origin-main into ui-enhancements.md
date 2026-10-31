# 2026-10-30 Merge origin/main into ui-enhancements

## What changed
- Committed the local `logo` work on `ui-enhancements` (new logo PNG, header/footer and auth shell updates, new brand and produce images).
- Pulled `origin/main` (`5e168bfc`) and merged it into `ui-enhancements`.
- Resolved the one conflict in `web/src/features/home/components/LandingHeader.tsx` by taking the `origin/main` version (floating pill header with inline SVG logo). The local older header layout was dropped.

## Why
- `git pull origin main` was blocked by uncommitted local changes, then conflicted in the header.
- The local header used `Image` and `PageContainer` without importing them, and `origin/main` already holds the newer header design.

## Affected files
- `web/src/features/home/components/LandingHeader.tsx` (conflict, resolved to `origin/main`)
- Other files from the `logo` commit merged automatically (e.g. `web/src/components/BuyerSiteHeader.tsx`, `web/src/features/home/components/HomeFooter.tsx`, `web/src/features/auth/components/AuthShell.tsx`).

## Verification
- `bun install --frozen-lockfile` in `web/` (added `gsap`, `lenis`, `sharp` from `main`).
- `./node_modules/.bin/tsc --noEmit` in `web/`: passes with no errors.
- Not run: browser/manual UI check of the header.

## Commits
- `6c43d7ed` logo
- `29589770` merge origin/main into ui-enhancements
