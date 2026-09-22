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

The Android export later completed bundling but left the `bunx` process attached until GitHub Actions reached its one-hour limit. The workflow now installs the Node 22.13 runtime required by Expo SDK 57 and invokes the installed Expo CLI directly with Node. The export step also has a five-minute limit so a future CLI exit regression cannot hold the runner for an hour.

## Affected paths

- `.github/workflows/mobile-ci.yml`
- `Agrivive/04 Delivery/2026-09-22 Mobile CI Workflow.md`

## Verification

- `cd mobile && bun run typecheck`: passed.
- `cd mobile && bunx expo export --platform android`: reached Android bundling but local Windows Hermes bytecode generation failed with `spawn EPERM`.
- `cd mobile && bunx expo export --platform android --no-bytecode`: passed and produced the Android JavaScript bundle. The CI workflow keeps the standard export command on Ubuntu.
- The updated workflow YAML parsed successfully with the installed `yaml` package.
- `cd mobile && node ./node_modules/expo/bin/cli export --help`: passed, confirming the direct Expo CLI path resolves.
- `cd mobile && node ./node_modules/expo/bin/cli export --platform android --no-bytecode`: passed, produced the Android bundle, and exited normally after `Exported: dist`.
- `git diff --check -- .github/workflows/mobile-ci.yml`: passed apart from the repository's existing line-ending warning.
- GitHub Actions execution: pending the next matching push or pull request.
