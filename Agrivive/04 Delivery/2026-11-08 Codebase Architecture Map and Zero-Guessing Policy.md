---
title: Codebase Architecture Map and Zero-Guessing Policy
date: 2026-11-08
status: completed
tags:
  - architecture
  - documentation
  - ai-guidelines
  - agents
---

# Codebase Architecture Map and Zero-Guessing Policy

Up: [[Delivery Index 2026-11]] · Latest: [[00-LATEST]]

## What changed

1. Updated [`AGENTS.md`](file:///home/jarajoaquinjara/projects/Agrivive/AGENTS.md) to replace outdated statements claiming `mobile/` and `web/` contain no code with a complete, authoritative **Codebase Architecture Map**.
2. Documented exact folder boundaries and active modules for:
   - `backend/src/modules/` (`admin`, `auth`, `buyer`, `conversations`, `integrations`, `marketplace`, `notifications`, `pickup`, `seller`, `stakeholder`, `trust`)
   - `backend/src/utils/` (`ahp-topsis`, `email`, `order-access`, `order-amount`, `order-qr`, `order-read`, `order-stock`, `order-types`, `pickup`, `seller-notifications`, `trust`, `visibility-ranking`)
   - `mobile/app/` (Expo Router layout trees and screens) and `mobile/src/features/`
   - `web/app/` (Next.js 15 App Router pages) and `web/src/`
   - `Agrivive/` Obsidian vault and `n8n/workflows/`
3. Established a binding **Zero-Guessing & Map Maintenance Policy** in `AGENTS.md` and [`.claude/CLAUDE.md`](file:///home/jarajoaquinjara/projects/Agrivive/.claude/CLAUDE.md):
   - Agents must consult the architecture map first before searching.
   - Any creation, move, or deletion of a screen, route, module, or feature folder mandates updating the map in `AGENTS.md` in the same turn.
4. Created root symlink `CLAUDE.md -> .claude/CLAUDE.md` to guarantee Claude Code receives the exact same rules regardless of invocation path.

## Why

Both Antigravity and Claude Code were previously susceptible to guessing file paths or executing slow directory searches because the starting prompt in `AGENTS.md` contained stale information stating `mobile/` and `web/` were empty. By establishing a single, comprehensive source of truth that is automatically ingested at the start of every session, both AI coding assistants operate with zero guessing and zero hallucinated file paths.

## Affected files

- `AGENTS.md`
- `.claude/CLAUDE.md`
- `CLAUDE.md` (new symlink to `.claude/CLAUDE.md`)
- `Agrivive/04 Delivery/2026-11-08 Codebase Architecture Map and Zero-Guessing Policy.md`
- `Agrivive/04 Delivery/Delivery Index 2026-11.md`
- `Agrivive/04 Delivery/00-LATEST.md`

## Verification

- Symlink integrity verified via `ls -la CLAUDE.md`.
- `git diff AGENTS.md .claude/CLAUDE.md` reviewed and confirmed clean.
- Zero orphan notes policy satisfied with incoming links in `Delivery Index 2026-11.md` and breadcrumb links to parent indices.
