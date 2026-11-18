---
title: Auto Updates and Login Library Fix
type: delivery
date: 2026-11-18
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Follows: [[2026-11-18 Web Break-in Fix]]

## Done
- `.github/dependabot.yml`: weekly pull requests for web, backend, mobile, the two Dockerfiles and GitHub Actions. Next and React are one group. Expo, React Native and React on mobile are left out (they move with an Expo upgrade). Nothing merges by itself.
- `.github/workflows/dependency-audit.yml`: every Monday (and on demand) runs `bun audit` on web, backend and mobile and fails on a critical hole.
- The first audit found a critical login hole in `better-auth` 1.7.3 (one user could sign in as another). Upgraded `better-auth`, `@better-auth/expo` and `@better-auth/drizzle-adapter` to 1.7.25 in all three apps, then ran `bun audit fix`. No critical holes remain.
- `backend/dist` rebuilt.

## Left on purpose
Web: 3 high (picomatch, two PostCSS copies inside Next and Tailwind) and mobile: 1 high (picomatch). They are build-time tools that read the project's own files, so they are not reachable by a visitor. Dependabot will offer the fixes.

## Owner must do
- Turn on **Dependabot security updates** and **Dependabot alerts** in the GitHub repo settings.
- Deploy API, worker and web, then sign in as buyer and seller (web and the APK) to check login still works. The mobile app needs a new APK for the library change.

## Checks
Typecheck passes on web, backend and mobile. `next build` passes. Login was not tested by hand.
