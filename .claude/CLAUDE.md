# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@../AGENTS.md

The root `AGENTS.md` above holds the binding conventions (module layout, one-exported-function-per-service-file, 200-line file limit, plain-word UI copy, UI/UX law citations, Obsidian vault notes, manual endpoint testing). The notes below cover what it does not, and where it is out of date.

## Where AGENTS.md is stale

- It says `web/` and `analytics/` hold no application code. `web/` is a Next.js 15 buyer site and `mobile/` is a full Expo app; `analytics/` is still empty. Both have their own `AGENTS.md` (`web/AGENTS.md` scopes the buyer site; `mobile/AGENTS.md` says to read the Expo SDK docs for the installed version before writing code).
- Its list of modules is partial. `backend/src/modules/` also has `admin`, `conversations` (includes WebSocket realtime), `integrations` (protected n8n callbacks), `marketplace`, `notifications`, `stakeholder`, and `trust`.

## Working from a supplied specification

When the user provides a specification, its planning is already complete (the "Following Instructions" section of `AGENTS.md` has the full rule):

- Do not repeat the planning process, propose alternative designs, or spawn planning agents.
- Validate the spec against the codebase with targeted reads only, then implement directly.
- If the spec contradicts the codebase, explain the contradiction before changing anything.

## Development memory (Obsidian)

The vault `Agrivive/` is the persistent development record. Its snapshot is `Agrivive/04 Delivery/00-LATEST.md`; dated task records in the same folder are the historical changelog.

At the start of a session:
1. Read the applicable project instructions.
2. Read only `Agrivive/04 Delivery/00-LATEST.md`.
3. Inspect the repository files relevant to the task. Verified code wins over any note.
4. Do not read historical changelog notes unless the task directly needs them.

After each completed implementation:
1. Validate the changes (typecheck, build, or the checks the task allows).
2. Create one dated changelog note in `Agrivive/04 Delivery/` named `YYYY-MM-DD <Task>.md`. Never edit or delete existing records.
3. Replace the outdated content in `00-LATEST.md`, keeping it under 150 lines.
4. Update architecture or decision notes only when a decision changed.
5. Report whether the vault update succeeded.

Never record secrets or environment values in the vault.

## Repository layout

Monorepo, one app per top-level directory, each with its own `bun.lock` and CI workflow in `.github/workflows/` (path-filtered):

- `backend/` — Bun + Elysia + Drizzle (PostgreSQL) + Better Auth API.
- `web/` — Next.js 15 App Router buyer website (Tailwind 3, GSAP/Lenis, Leaflet, Base UI, shadcn config in `components.json`).
- `mobile/` — Expo / React Native seller-facing app (expo-router).
- `n8n/workflows/` — exported n8n workflows (promotion drafts, social publishing); contain no credentials.
- `deploy/` + root `docker-compose.yml` — VPS deployment (Caddy, API, worker, web). See `deploy/README.md`.
- `Agrivive/` — Obsidian vault of project notes; `.claude/` — design systems (`design/web-design`, `design/mobile-design`) and local skills.

## Commands

Backend (from `backend/`):

```bash
bun install --frozen-lockfile
bun run dev            # API on :3000 with watch (OpenAPI UI is enabled outside production)
bun run worker:dev     # scheduled-jobs worker (separate process)
bunx tsc --noEmit
bun build src/index.ts --outdir dist --target bun
bun build src/worker.ts --outdir dist --target bun
bunx drizzle-kit check
bunx drizzle-kit migrate   # explicit release step; never run on startup or against production unprompted
```

Web (from `web/`): `bun run dev` (port 3001), `bun run typecheck`, `bun run build`.
Mobile (from `mobile/`): `bun run start`, `bun run typecheck`, `node ./node_modules/expo/bin/cli export --platform android` (what CI runs).

There is no test runner in any package. Endpoints are verified manually by the owner in OpenAPI/Postman, so a single-test command does not exist.

## Backend architecture

**Two processes, one codebase.** `src/index.ts` is the HTTP API; `src/worker.ts` runs `jobs/run-scheduled.ts` every 60s (order expiry, trust/inquiry processing, listing notices, price reductions, promotion eligibility and n8n webhooks, push delivery). Run exactly one worker. `index.ts` also has its own 30s interval for push notifications and listing notices, so those jobs are invoked from both processes and must stay idempotent.

**Auth and roles.** `modules/auth` wraps Better Auth (email OTP, Google for web, Expo plugin for mobile). Protected routes `.use(sessionAuth)` from `modules/auth/services/auth.session.ts` and declare `{ role: ["buyer"] }` etc. (`admin | buyer | seller | stakeholder`). The macro resolves `session` and `user` into the handler context, caches account status for 30s, and returns trust-action block/restriction messages. Handlers still check `user.isActive` themselves where needed.

**Errors.** Services throw typed errors (e.g. `OrderError` in `utils/order-types`) carrying a `statusCode`; route handlers catch them and return `status(error.statusCode, { message })`, falling back to a logged 500.

**Shared logic lives in `src/utils/<name>/index.ts`**, not in modules. Beyond the order utilities named in `AGENTS.md`, this is where the ranking and trust domain logic sits: `ahp-topsis`, `visibility-score`, `visibility-ranking`, `promotion-eligibility` (the `visibility-ahptopsis-v1` policy: Priority Boost needs TOPSIS closeness >= 0.60), `trust` (weighted points for non-response, cancellation and low ratings; actions gated by `TRUST_ACTIONS_ENABLED`), plus `s3*`, `email`, `push-notifications`, `social-publishing`, and `price-reduction`. Check here before writing new cross-module code.

**Database.** Schema is `src/db/schema.ts` (+ `relations.ts`); migrations in `backend/drizzle/` are timestamp-ordered folders, some hand-written SQL without a snapshot. Commit generated migrations with schema changes. The app never applies migrations itself.

**Plugins** (`src/plugins/`): security headers, rate limiting, and a validation plugin registered last in `index.ts`. CORS origins come from `WEB_TRUSTED_ORIGINS`; localhost/LAN origins are allowed outside production.

**External integrations.** n8n (+ Groq) drafts promotion copy and publishes to Facebook/Instagram. The worker sends n8n only IDs; n8n calls back into `/integrations/*` with a Bearer service token (`N8N_*_SERVICE_TOKEN`) to fetch current context. Meta, FCM, S3, Resend/Mailtrap credentials are server-only env vars (see `backend/.env.example`). `backend/README.md` documents these flows in detail, including endpoint contracts.

## Gotchas

- `backend/dist/index.js` and `dist/worker.js` are tracked in git even though `dist/` is in `.gitignore`. Docker Compose runs `bun dist/index.js`, so a stale `dist` affects deploys; check `git status` after building.
- `web` reads the API from `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3000`). That variable is public, so never put secrets in it.
- `backend/API_ENDPOINTS.md` and `backend/README.md` are the references for existing endpoint contracts; update them when an endpoint changes.
