---
title: No Floating Vault Notes Rule
type: delivery
date: 2026-11-08
status: active
---

# No Floating Vault Notes Rule

Up: [[Delivery Index 2026-11]] · Home: [[00 Home]] · Latest: [[00-LATEST]]

## Decision

Enforce a strict **Zero Orphan Notes Policy** across all agent guidelines (`AGENTS.md` and `.claude/CLAUDE.md`). Whenever any Markdown (`.md`) file is created or moved in the Obsidian vault (`Agrivive/`), it must not be left floating without links. Every note must be integrated into the vault's knowledge graph with valid incoming and outgoing links.

## What Changed

1. **Root Guidelines (`AGENTS.md`)**:
   - Updated the `Obsidian Vault Updates` section to define the **Zero Orphan Notes Policy (No Floating Markdown Files)**.
   - Mandated incoming links from the note's category index or hub (`Delivery Index`, `Delivery Index YYYY-MM`, `Docs Index`, `Enhancements Index`, `00 Home`, or audit indexes) and references in `00-LATEST.md` for delivery records.
   - Mandated outgoing breadcrumb links back to parent indexes (e.g., `Up: [[Delivery Index 2026-11]]`).
   - Added verification requirement to check for orphan notes after vault updates.

2. **Claude Agent Instructions (`.claude/CLAUDE.md`)**:
   - Updated development memory lifecycle steps to explicitly forbid floating vault notes and require indexing upon creation.

3. **Vault Graph Cleanup**:
   - Indexed previously unlinked test suite notes in [[Docs Index]]:
     - `[[docs/review-rating-tests/00 Implementation Audit]]`
     - `[[docs/review-rating-tests/01 Review System Test Cases]]`
     - `[[docs/review-rating-tests/02 Rating Calculation Test Cases]]`
     - `[[docs/review-rating-tests/03 Grouped Review Test Cases]]`
     - `[[docs/review-rating-tests/04 Requirements Traceability Matrix]]`
     - `[[docs/review-rating-tests/05 Conflicting Requirements Report]]`
     - `[[docs/review-rating-tests/06 Professor Clarification Questions]]`
   - Linked `[[04 Delivery/2026-11-08 Trust System Test Case Documents]]` and `[[04 Delivery/2026-11-08 One Review Per Order]]` in [[Delivery Index 2026-11]].

## Affected File Paths

- `AGENTS.md`
- `.claude/CLAUDE.md`
- `Agrivive/04 Delivery/Delivery Index 2026-11.md`
- `Agrivive/docs/Docs Index.md`
- `Agrivive/04 Delivery/2026-11-08 No Floating Vault Notes Rule.md`
- `Agrivive/04 Delivery/00-LATEST.md`

## Verification Performed

Ran automated orphan detection script across all 513 `.md` files in `Agrivive/`. Confirmed zero orphan notes remain across the entire vault.
