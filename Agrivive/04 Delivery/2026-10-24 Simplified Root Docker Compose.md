---
title: Simplified Root Docker Compose
date: 2026-10-24
type: delivery
status: verified
related_documents:
  - "[[2026-10-12 Docker VPS Deployment]]"
  - "[[2026-10-13 VPS Docker Pull Rebuild Reset Runbook]]"
  - "[[Architecture and Integrations]]"
---

# Simplified Root Docker Compose

## What changed

1. **Root-Level `docker-compose.yml`**:
   - Created `docker-compose.yml` directly in the project root.
   - Points build contexts to `./backend` and `./web`.
   - References `./deploy/Caddyfile` for reverse-proxy configuration.
   - Configured all services (`api`, `worker`, `web`, `proxy`) to read from a single, unified root `.env` file (`env_file: - .env`).

2. **Root Consolidated `.env.example`**:
   - Created `.env.example` in the project root combining domains (`WEB_DOMAIN`, `API_DOMAIN`, `NEXT_PUBLIC_API_URL`), core backend variables (`DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.), algorithm defaults (`VISIBILITY_POLICY=visibility-ahptopsis-v1`), and n8n webhook secrets into one template.

3. **Streamlined Developer Experience**:
   - Replaced multi-argument commands (`docker compose --env-file deploy/compose.production.env -f deploy/docker-compose.production.yml up -d`) with standard `docker compose up -d`.

## Why

- To reduce cognitive load and deployment friction in accordance with **Don't Make Me Think** (Steve Krug) and **Tesler's Law** (Conservation of Complexity).
- Developers and operators can now launch the complete 4-container stack using standard single-command Docker workflows without memorizing custom flags or nested file paths.

## Affected paths

- `docker-compose.yml`
- `.env.example`
- `Agrivive/04 Delivery/2026-10-24 Simplified Root Docker Compose.md`

## Verification performed

- Tested `docker compose config` against `.env.example` to confirm YAML syntax, service resolution (`api`, `worker`, `web`, `proxy`), environment interpolation, and volume bindings.
- Confirmed root `.gitignore` protects `.env` from accidental commits.
