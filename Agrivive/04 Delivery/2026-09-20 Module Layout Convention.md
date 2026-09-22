---
title: Module Layout Convention
type: repository-guidance
status: current
date: 2026-09-20
---

# Module Layout Convention

## What changed and why

Updated `AGENTS.md` to record the intended backend structure. Modules belong under `backend/src/modules/<module>/`. Each module has an `index.ts` that combines its routes, an `index/` directory for Elysia controllers and routes, a `model/` directory for validation schemas and DTOs, and a `services/` directory for database operations and business logic. Shared utilities belong under `backend/src/utils/<utility>/index.ts`. Corresponding files should use feature-based names, and buyer order code belongs in the buyer module.

The existing auth, buyer, and seller modules were moved from `backend/src/module/` to `backend/src/modules/` after the migration proposal was approved. The module contents and API paths remain the same.

## Affected files

- `AGENTS.md`: project structure guidance.
- `backend/src/modules/auth/`, `backend/src/modules/buyer/`, and `backend/src/modules/seller/`: moved module directories.
- `backend/src/index.ts`: server imports updated to the new module paths.
- `Agrivive/04 Delivery/2026-09-20 Module Layout Convention.md`: this vault record.

## Verification

- Compared the instruction with the current backend directory names and the user's requested structure.
- Reviewed the updated `AGENTS.md` text and confirmed the destination paths before moving the modules.
- TypeScript and build results for the module migration are recorded below.

No commit was created, so there is no commit hash to record.

## Module migration verification

`bunx tsc --noEmit` passed. `bun build src/index.ts --outdir <temporary directory> --target bun` passed. A source and documentation search found no active imports using `src/module/`; the only remaining mention records the former path in this migration history. The destination contains all 16 moved source files. No commit was created for the migration.

## 2026-09-20 agent guidance update

Updated `AGENTS.md` to make the current backend layout actionable for future agents. It now describes one exported function per new or refactored service file, matching route/model/service feature names, route composition in each module's `index.ts`, role ownership, and cross-module utilities under `backend/src/utils/`. It directs agents to use the installed ElysiaJS skill for framework work while keeping application code in `backend/src/`. The mobile directory description now reflects its design guidance and image assets.

Affected paths: `AGENTS.md` and this note. No backend source code or migration was changed. Verification: compared the instructions with the current buyer, seller, auth, and utility paths, checked the referenced files exist, and reviewed the Markdown after editing. No commit was created.
