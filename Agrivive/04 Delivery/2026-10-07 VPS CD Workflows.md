# VPS CD Workflows — 2026-10-07

## What changed

Added manual GitHub Actions deployment workflows for the Bun backend and Next.js buyer web app. Both verify and build before uploading a versioned release over SSH. The deploy helper keeps production environment files outside releases, restarts systemd services, checks health, and restores the previous release after a failed check when one exists. Added a VPS setup guide.

## Why

Provide stable HTTPS-hosted backend and web services as a foundation for mobile testing and the n8n promotion callback, without relying on a development tunnel. Deployment remains manual until the first server release and configuration are verified.

## Affected files

- `.github/workflows/backend-cd.yml`
- `.github/workflows/web-cd.yml`
- `deploy/vps-release.sh`
- `deploy/README.md`

## Verification

All three workflow files parsed as YAML without errors, and `mobile/app.json` plus `mobile/eas.json` parsed as JSON. `bunx tsc --noEmit` passed in `backend/`; `bun run typecheck` passed in `web/` and `mobile/`. `bash -n deploy/vps-release.sh` passed. The local `mobile/.env` still exists, is now ignored, and has a staged removal from Git tracking only. No VPS deployment, EAS build, or manual endpoint/device test has been performed. Database migrations remain a separate release step.

## Mobile preview addition

After approval, added an EAS internal Android APK profile and manual GitHub Actions build. Set the Android app identity to `com.agrivive.seller` and display name to `Agrivive Seller`. Changed the mobile Git ignore rules to exclude local `.env` files and documented the first interactive Expo build, HTTPS API variable, and GitHub token setup. This provides a direct-install test app without a Google Play account. The first EAS build, Expo project link, and device testing are still pending.

Affected additional paths: `.github/workflows/mobile-eas-preview.yml`, `mobile/eas.json`, `mobile/app.json`, `mobile/.gitignore`, `mobile/README.md`, and the Git index entry for `mobile/.env`. The local `.env` file is preserved.
