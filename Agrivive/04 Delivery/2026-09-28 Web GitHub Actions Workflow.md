---
title: Web GitHub Actions Workflow
type: delivery
date: 2026-09-28
status: implemented; local typecheck and production build passed
---

# Web GitHub Actions Workflow

## What changed

- Added a GitHub Actions workflow for the buyer web app.
- The workflow installs the locked Bun dependencies, runs the web TypeScript check, and creates a production Next.js build.
- The workflow runs for web changes pushed to `development` and for pull requests targeting `main`.

## Why

The buyer website needs an automatic check before changes are merged or shared through GitHub. The workflow catches dependency, TypeScript, and production-build errors without requiring deployment credentials.

## Affected paths

- `.github/workflows/web-ci.yml`

## Verification performed

- Local `cd web && bun run typecheck` — passed.
- Local `cd web && bun run build` — passed after allowing Next.js to start its local build worker.
