# Docker VPS Deployment

Date: 2026-10-12

## What changed

Added a Docker Compose deployment for the single-VPS production setup:

- A Bun image for the backend API and scheduled worker.
- A Next.js image for the web frontend.
- Caddy as the HTTPS reverse proxy.
- Separate production environment templates for domains, frontend public API configuration, backend secrets, and the external production database.
- Docker deployment instructions in `deploy/README.md`.

The existing systemd deployment remains documented and unchanged. Docker is an additional deployment path.

## Why

The frontend and backend can run on the same VPS while remaining separate services. The public website uses the web domain, the mobile and web clients use the API domain, and the API and frontend containers communicate over the private Compose network. The PostgreSQL database stays external and is selected through the production `DATABASE_URL`, so development can continue using Supabase while production uses AWS PostgreSQL.

Only ports 80 and 443 are published by the Compose stack. Caddy handles HTTPS certificates and forwards WebSocket traffic through its reverse proxy for the messaging feature.

## Affected paths

- `backend/Dockerfile`
- `backend/.dockerignore`
- `web/Dockerfile`
- `web/.dockerignore`
- `deploy/docker-compose.production.yml`
- `deploy/Caddyfile`
- `deploy/compose.production.env.example`
- `deploy/backend.production.env.example`
- `deploy/web.production.env.example`
- `deploy/.gitignore`
- `deploy/README.md`

Real production environment files must be created only on the VPS and must not be committed:

- `deploy/compose.production.env`
- `deploy/backend.production.env`
- `deploy/web.production.env`

## Verification

- `git diff --check`: passed.
- Backend `bunx tsc --noEmit`: passed.
- Backend `bun build src/index.ts --outdir dist --target bun`: passed.
- Web `bun run build`: passed.
- Web `bun run typecheck`: passed after the production build generated `.next` type files.
- Compose YAML parsing: passed; the expected `api`, `worker`, `web`, and `proxy` services were found.
- Docker CLI validation: not run because Docker is not installed on the current Windows development machine.
- VPS deployment: pending the production VPS host, DNS records, and production environment values.

## Deployment references

- [Docker Compose in production](https://docs.docker.com/compose/how-tos/production/)
- [Docker Compose documentation](https://docs.docker.com/compose/)
- [Docker multi-stage builds](https://docs.docker.com/get-started/docker-concepts/building-images/multi-stage-builds/)
