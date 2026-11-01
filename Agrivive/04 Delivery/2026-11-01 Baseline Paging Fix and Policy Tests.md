---
title: Baseline Paging Fix and Policy Tests
type: delivery
date: 2026-11-01
---

# Baseline Paging Fix and Policy Tests

## What changed

- **Bug fixed (WSV-008).** On the baseline policy (`visibility-v4`), loading page 2 repeated page 1 whenever listings tied on score. The driver returned the page marker's score with 15 digits (0.866666666666667), which did not equal the stored score, so tied rows all counted as "after" the marker. The score is now rounded to 9 decimals in the database query, so the marker and the stored score are the same number.
- **Policy choice moved into `utils/visibility-ranking/policy.ts`** (`resolveVisibilityPolicy`, `scoreTier`) so it can be tested. Behaviour is unchanged: only the exact value `visibility-ahptopsis-v1` (any case, spaces ignored) selects AHP-TOPSIS; anything else, including unset, selects the baseline.
- **New tests (18):** WSV-008 paging for AHP-TOPSIS (page sizes 1 to 50, 12 exact ties, a listing with no score at the end) and WSV-010 policy switch and tier cut-offs (0.70 baseline, 0.60 AHP-TOPSIS). Total with the engine tests: 29.
- **CI:** `bun test` runs before the build in the backend workflow.

## Files

- `backend/src/utils/visibility-score/index.ts`: rounded score.
- `backend/src/utils/visibility-ranking/policy.ts`: new.
- `backend/src/modules/marketplace/services/marketplace.products.list.ts`: uses the policy helper (188 lines).
- `backend/src/utils/visibility-ranking/policy.test.ts`, `backend/src/modules/marketplace/services/marketplace.products.visibility.test.ts`: new.
- `.github/workflows/backend-ci.yml`: added Test step.

## Verification

- `bun test`: 29 passed, 0 failed. Also passed in Docker for the first 11.
- Breaking the paging filter on purpose made 6 tests fail; restored, all pass.
- `bunx tsc --noEmit`: clean. `bun build` of `index.ts` and `worker.ts`: built (output kept outside the repo, so tracked `dist/` was not touched).
- Read-only run against the dev database: both policies, page sizes 1 to 18, same order as the full list, no repeats, nothing missing. Before the fix the baseline gave 87 repeats.
- The API already running on :3000 needs a restart to pick up the fix.

## Not covered

WSV-006 (sold out), WSV-009 (Boost posts to the real Facebook Page) and an end-to-end feed test need a separate test database or a test seller, so they stay manual.
