---
title: Deploy Folder Removed
type: delivery
date: 2026-11-01
---

# Deploy Folder Removed

## What changed

- The `deploy/` folder is deleted. Docker Compose already used the root `.env`, so the separate production env files and `docker-compose.production.yml` were not needed.
- `Caddyfile` moved to the repo root; `docker-compose.yml` mounts `./Caddyfile`.
- `deploy/vps-release.sh` moved to `scripts/vps-release.sh` because the manual Deploy Backend and Deploy Web workflows call it; both workflows now use the new path.
- Every key from the old deploy env examples is in the root `.env.example`. Where the old example differed from the code default (trust thresholds, email provider), the example now shows the code default or says what the code does when unset.
- Removed with the folder: `deploy/README.md` (systemd release steps and old compose commands, still in git history) and the `compose`, `backend` and `web` production env examples. `APP_ENV` and `TRUST_RESTRICTION_HOURS` are unused in code; `APP_ENV` stays in the example, hours were dropped.
- Local `.env`: added only keys that change nothing (`VISIBILITY_POLICY`, push window and attempts, `STAKEHOLDER_EMAILS`, `ALLOW_DEV_EMAIL_LOG`) and commented `WEB_DOMAIN` / `API_DOMAIN`. No existing line was changed.

## Files

`Caddyfile`, `docker-compose.yml`, `.env.example`, `scripts/vps-release.sh`, `.github/workflows/backend-cd.yml`, `.github/workflows/web-cd.yml`, `.claude/CLAUDE.md`.

## Verification

YAML of the compose file and both workflows parses. Compose was not run (no Docker on this machine).

## VPS step

Pull, then recreate the proxy so it mounts the new path: `sudo docker compose up -d --force-recreate --no-deps proxy`. Older notes that mention `deploy/` are history and were not edited.
