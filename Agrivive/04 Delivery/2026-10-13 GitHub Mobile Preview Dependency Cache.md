# GitHub Mobile Preview Dependency Cache

Date: 2026-10-13

## What changed

Updated the GitHub Actions mobile preview workflow to pin Bun to version 1.4.2, cache Bun's package download directory, and stop dependency installation after 15 minutes.

## Why

The mobile preview workflow was spending a long time in `bun install --frozen-lockfile` on a fresh GitHub runner. The workflow now matches the mobile EAS Bun version, reuses the dependency cache between runs, and reports a bounded failure instead of hanging indefinitely.

## Affected files

- `.github/workflows/mobile-eas-preview.yml`

## Verification

- Reviewed the workflow diff.
- Confirmed the existing `mobile/bun.lock` remains the frozen lockfile used by the job.
- Confirmed no application source code or production secrets were changed.
