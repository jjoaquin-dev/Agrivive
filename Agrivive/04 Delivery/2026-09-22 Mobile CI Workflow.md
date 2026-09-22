---
title: Mobile CI Workflow
type: delivery
date: 2026-09-22
status: implemented; local verification passing
---

# Mobile CI Workflow

## What changed and why

Added a GitHub Actions workflow for the Expo seller mobile app. The workflow runs only when `mobile/` changes or when the workflow itself changes. It checks TypeScript and exports the Android bundle so broken mobile code is caught during pushes to `development` and pull requests to `main`.

The workflow does not build or publish an APK.

## Affected paths

- `.github/workflows/mobile-ci.yml`

## Verification

- `cd mobile && bun run typecheck`: passed.
- `cd mobile && bunx expo export --platform android`: reached Android bundling but local Windows Hermes bytecode generation failed with `spawn EPERM`.
- `cd mobile && bunx expo export --platform android --no-bytecode`: passed and produced the Android JavaScript bundle. The CI workflow keeps the standard export command on Ubuntu.
- GitHub Actions execution: pending the next matching push or pull request.
