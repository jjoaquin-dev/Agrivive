---
title: VPS Docker Pull Rebuild Reset Runbook
type: delivery
date: 2026-10-13
status: ready
---

# VPS Docker Pull, Rebuild, and Reset Runbook — 2026-10-13

## Purpose

Use this runbook when the latest Git commit has been pulled into the VPS but the running Docker/Podman containers still show the previous application version.

The VPS uses this repository layout:

```text
/srv/agrivive/Agrivive
/srv/agrivive/Agrivive/deploy/docker-compose.production.yml
/srv/agrivive/Agrivive/deploy/compose.production.env
/srv/agrivive/Agrivive/deploy/backend.production.env
/srv/agrivive/Agrivive/deploy/web.production.env
```

Pulling Git changes the files on the VPS. It does not change an already-running container. The application code is copied into the image during `build`, so the images must be rebuilt and the containers recreated.

This runbook is written for the current Podman setup where the `docker` command emulates Docker and delegates Compose to the installed Compose provider.

## Safety rules

- Never run `git reset --hard` as part of the normal update.
- Never run `docker system prune` during a release.
- Never run `docker compose down -v`; the `-v` flag can remove persistent Caddy data.
- Do not add `--network host` to `docker compose run`; `network_mode: host` is already defined in the Compose file.
- Do not replace the production `.env` files with values from Git.
- Stop if the working tree contains local changes. Inspect them before pulling.
- Run a database migration only when the pulled commit changes `backend/drizzle/` and the migration has been approved.

## 1. Read-only preflight check

Paste this into the VPS terminal:

```bash
cd /srv/agrivive/Agrivive || exit 1

printf '\nCurrent directory:\n'
pwd

printf '\nCurrent branch:\n'
git branch --show-current

printf '\nCurrent commit:\n'
git log -1 --oneline

printf '\nLocal changes:\n'
git status --short

printf '\nCompose validation:\n'
cd /srv/agrivive/Agrivive/deploy || exit 1
docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  config --quiet

printf '\nRunning services:\n'
docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  ps
```

If `git status --short` prints project files, stop and inspect them. Do not pull over unknown local changes.

## 2. Check whether `main` has a newer commit

This fetches remote metadata without changing the working tree:

```bash
cd /srv/agrivive/Agrivive || exit 1

git fetch --prune origin main

CURRENT_SHA="$(git rev-parse HEAD)"
REMOTE_SHA="$(git rev-parse origin/main)"

printf 'Current commit: %s\n' "$CURRENT_SHA"
printf 'Remote main:    %s\n' "$REMOTE_SHA"

if [ "$CURRENT_SHA" = "$REMOTE_SHA" ]; then
  echo 'The VPS already has the current origin/main commit.'
else
  echo 'Commits available to pull:'
  git log --oneline "$CURRENT_SHA..$REMOTE_SHA"
fi
```

## 3. Pull `main` safely

Only use this when the VPS is intended to run the production `main` branch:

```bash
cd /srv/agrivive/Agrivive || exit 1

if [ -n "$(git status --porcelain)" ]; then
  echo 'STOP: local changes exist. Review git status before pulling.' >&2
  git status --short
  exit 1
fi

git fetch --prune origin main
git pull --ff-only origin main

printf '\nPulled commit:\n'
git log -1 --oneline
```

`--ff-only` prevents Git from creating an unexpected merge commit on the production VPS.

## 4. Rebuild fresh images and recreate all services

Use the explicit Compose file. Do not rely on `docker compose up -d` from an arbitrary directory.

```bash
cd /srv/agrivive/Agrivive/deploy || exit 1

docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  config --quiet

docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  build --no-cache api worker web

docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  up -d --force-recreate api worker web proxy
```

`--no-cache` ensures the new source files are copied into fresh application images. The `proxy` service uses the Caddy image and is recreated so the complete production stack has one consistent Compose state.

If the Compose provider accepts image pulling and the base images also need updating, this build command may be used instead:

```bash
docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  build --pull --no-cache api worker web
```

If `--pull` is rejected by the installed provider, use the first `build --no-cache` command.

## 5. Apply a migration only when needed

Before rebuilding, save the previous commit and compare it with the new commit:

```bash
cd /srv/agrivive/Agrivive || exit 1

OLD_SHA="$(git rev-parse HEAD@{1})"
NEW_SHA="$(git rev-parse HEAD)"

printf 'Previous commit: %s\n' "$OLD_SHA"
printf 'Current commit:  %s\n' "$NEW_SHA"

git diff --name-status "$OLD_SHA" "$NEW_SHA" -- backend/drizzle
```

If the command prints migration files and the migration is approved, run it with the newly built API image:

```bash
cd /srv/agrivive/Agrivive/deploy || exit 1

docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  run --rm api bunx drizzle-kit migrate
```

Do not add `--network host` to this Compose command. The API service already has host networking in `docker-compose.production.yml`.

If the migration fails, stop and inspect the database connection and backend environment before recreating the application services.

## 6. Verify the new image and containers

```bash
cd /srv/agrivive/Agrivive/deploy || exit 1

printf '\nContainer status:\n'
docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  ps

printf '\nCompose image list:\n'
docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  images

printf '\nAPI readiness:\n'
curl --fail --show-error --silent --retry 10 --retry-delay 2 --retry-connrefused \
  http://127.0.0.1:3000/health/ready
printf '\n'

printf '\nWeb response headers:\n'
curl --fail --show-error --silent --head --retry 10 --retry-delay 2 --retry-connrefused \
  http://127.0.0.1:3001/

printf '\nRecent application logs:\n'
docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  logs --tail=100 api worker web
```

Expected results:

- `api`, `worker`, `web`, and `proxy` are running.
- The API readiness request succeeds.
- The web request returns an HTTP success or redirect response.
- The logs do not show a crash loop, database connection error, or missing environment variable.

## 7. One-shot safe update script

This script checks the working tree, fetches and fast-forwards `main`, rebuilds fresh images, runs a migration only when `backend/drizzle/` changed, recreates the services, and performs health checks.

Paste the whole block into the VPS terminal:

```bash
set -Eeuo pipefail

APP_ROOT="/srv/agrivive/Agrivive"
DEPLOY_DIR="$APP_ROOT/deploy"
COMPOSE_ENV="$DEPLOY_DIR/compose.production.env"
COMPOSE_FILE="$DEPLOY_DIR/docker-compose.production.yml"

compose() {
  docker compose --env-file "$COMPOSE_ENV" -f "$COMPOSE_FILE" "$@"
}

cd "$APP_ROOT"

if [ "$(git branch --show-current)" != "main" ]; then
  echo 'STOP: production Docker updates must run from the main branch.' >&2
  git branch --show-current
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo 'STOP: local changes exist. Review them before pulling.' >&2
  git status --short
  exit 1
fi

OLD_SHA="$(git rev-parse HEAD)"
git fetch --prune origin main
git pull --ff-only origin main
NEW_SHA="$(git rev-parse HEAD)"

echo "Previous commit: $OLD_SHA"
echo "Current commit:  $NEW_SHA"
git log -1 --oneline

compose config --quiet

echo 'Rebuilding api, worker, and web images without cache...'
compose build --no-cache api worker web

if ! git diff --quiet "$OLD_SHA" "$NEW_SHA" -- backend/drizzle; then
  echo 'Backend migration files changed; applying approved migrations...'
  compose run --rm api bunx drizzle-kit migrate
else
  echo 'No backend migration files changed; skipping migration.'
fi

echo 'Recreating production services...'
compose up -d --force-recreate api worker web proxy

echo 'Checking container status...'
compose ps

echo 'Checking API readiness...'
curl --fail --show-error --silent --retry 10 --retry-delay 2 --retry-connrefused \
  http://127.0.0.1:3000/health/ready
printf '\n'

echo 'Checking web response...'
curl --fail --show-error --silent --head --retry 10 --retry-delay 2 --retry-connrefused \
  http://127.0.0.1:3001/

echo 'Update completed.'
```

## 8. If the new code still does not appear

Run the following fallback. It removes containers only and does not remove named volumes:

```bash
cd /srv/agrivive/Agrivive/deploy || exit 1

docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  down --remove-orphans

docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  build --no-cache api worker web

docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  up -d --force-recreate api worker web proxy
```

Do not append `-v` to `down`.

## 9. Diagnostic bundle when an update fails

Paste this to collect the information needed for troubleshooting:

```bash
cd /srv/agrivive/Agrivive/deploy || exit 1

echo '--- Git ---'
git -C .. status --short
git -C .. log -1 --oneline

echo '--- Compose config ---'
docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  config --quiet

echo '--- Compose status ---'
docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  ps

echo '--- API logs ---'
docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  logs --tail=200 api

echo '--- Worker logs ---'
docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  logs --tail=200 worker

echo '--- Web logs ---'
docker compose \
  --env-file compose.production.env \
  -f docker-compose.production.yml \
  logs --tail=200 web

echo '--- Local health checks ---'
curl -i http://127.0.0.1:3000/health/ready || true
curl -I http://127.0.0.1:3001/ || true
```

## Verification record

- Documentation added on 2026-10-13.
- Commands match `deploy/docker-compose.production.yml` and the current `/srv/agrivive/Agrivive` VPS layout.
- The runbook intentionally does not contain database URLs, API keys, private keys, or production secret values.
