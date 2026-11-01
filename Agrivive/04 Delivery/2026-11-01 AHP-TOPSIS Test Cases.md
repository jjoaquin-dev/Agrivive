---
title: AHP-TOPSIS Test Cases
type: delivery
date: 2026-11-01
---

# AHP-TOPSIS Test Cases

## What changed

First automated tests in the backend, for the AHP-TOPSIS ranking engine. Each test name follows the WSV test sheet: ID, scenario, expected result. Covers WSV-001 to 005 and 007, plus AHP weights, a lone listing, an empty feed, input clamps and tier cut-offs. 11 tests.

WSV-006 (sold out), 008 (paging), 009 (Boost) and 010 (policy switch) need the API and database, so they are not in this file yet.

## Why

The owner asked for real test cases in the system in the WSV sheet format, starting with the engine. Until now the engine was checked only by hand.

## Files

- `backend/src/utils/ahp-topsis/ahp-topsis.test.ts`: new.
- `backend/package.json`: `test` script is now `bun test` (it was a placeholder that always failed).

## Verification

- `bun test`: 11 passed, 0 failed.
- `bunx tsc --noEmit`: clean.
- Manual run results for the full sheet are in `Agrivive/docs/WSV-AHP-TOPSIS-test-results.md`.

## Findings from the manual run

- Baseline policy (`visibility-v4`) paging repeats listings when scores tie, because the page marker keeps a rounded score. Not fixed yet.
- With `VISIBILITY_POLICY` unset, the API uses the baseline, not AHP-TOPSIS.
