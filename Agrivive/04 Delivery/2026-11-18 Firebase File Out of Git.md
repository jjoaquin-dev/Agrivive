---
title: Firebase File Out of Git
type: delivery
date: 2026-11-18
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]]

## Why
GitHub secret scanning flagged the Firebase client API key in `mobile/google-services.json` (alert #1). The key ships inside every APK by design, but it should be restricted and the file kept out of git.

## Done
- `mobile/.gitignore`: `/google-services.json`.
- New `mobile/app.config.js`: reads `GOOGLE_SERVICES_JSON` (an EAS file secret) for `android.googleServicesFile`, falling back to `./google-services.json`. Everything else still comes from `app.json` (checked with `expo config`: owner, package and project id unchanged).
- The file is **still tracked** on purpose, so builds keep working until the secret exists.

## Owner must do (in this order)
1. Restrict the key in Google Cloud (Android app `com.agrivive.seller` plus SHA-1, and only the Firebase APIs the app uses).
2. `npx eas-cli env:create --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json --environment preview --environment production --visibility secret` (logged in to the new Expo account).
3. Build once to prove the secret works, then `git rm --cached mobile/google-services.json` and commit.
4. Close GitHub alert #1 (false positive or used in tests). The old key stays in git history, so restricting it is what protects you.
