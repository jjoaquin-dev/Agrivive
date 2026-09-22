# Repository Guidelines

## Project Structure & Module Organization

The application lives in `backend/`, a Bun, TypeScript, and Elysia API. `backend/src/index.ts` starts the server. Keep feature modules under `backend/src/modules/<module>/` (plural). Shared database code is in `backend/src/db/`, plugins are in `backend/src/plugins/`, and Drizzle migrations are in `backend/drizzle/`. `.github/workflows/backend-ci.yml` defines CI. `mobile/` currently contains design guidance and image assets, while `analytics/` and `web/` contain no tracked application code.

Organize each module and shared utility as follows:

```text
backend/src/
  index.ts
  db/
  plugins/
  modules/
    <module>/
      index.ts
      index/<feature>.ts
      model/<feature>.ts
      services/<feature>.ts
  utils/
    <utility>/index.ts
```

- `index/` contains Elysia route instances and HTTP handlers. Each module's `index.ts` imports and combines its routes with chained `.use(...)` calls.
- `model/` contains request body validation schemas and DTO types passed from routes to services. Define header validation in the route's `index/<feature>.ts` file, not in a body model. Keep other existing feature schemas beside the routes that use them.
- `services/` contains database operations and business logic. For new or refactored services, put **one exported function in each service file**. Private helpers may stay with that function; reusable operations should have their own file.
- Use the same feature name across `index/`, `model/`, and `services/` for a route. For example, `buyer.order.create.ts` appears in all three directories. Internal services such as `buyer.order.reserve.ts`, `buyer.order.persist.ts`, and `buyer.order.expire.ts` need no route file.
- Keep role-specific features in their owning module: buyer order creation and cancellation in `buyer/`, seller scanning in `seller/`, and authentication in `auth/`.
- Put reusable cross-module code under `backend/src/utils/<utility>/index.ts`. The current order utilities cover access checks, amounts, QR payloads, reads, stock restoration, and shared types. Seller code should use shared utilities directly rather than importing buyer services.
- After moving or splitting a feature, update all imports and remove obsolete files and duplicate schemas. Check for references to old paths before finishing.

## ElysiaJS Implementation Pattern

The project-local ElysiaJS skill is at `.agents/skills/elysiajs/SKILL.md`. Consult it and the official ElysiaJS documentation when changing routes, validation, macros, plugins, or integrations. Apply project conventions in this file when choosing file names and service boundaries. Write application code in `backend/src/`, not in the installed skill.

Create a route as a chained Elysia instance in `index/<feature>.ts`. Register body schemas from `model/<feature>.ts`, define header schemas in the route options, use `sessionAuth` and the appropriate role on protected routes, and pass validated values to the matching service. Keep database transactions, stock changes, and order state transitions in services. Use `status(...)` in handlers for HTTP responses and preserve distinct error statuses from services. Keep the module's `index.ts` limited to route composition.

Current examples are `backend/src/modules/buyer/index/buyer.order.create.ts`, its matching model and service, and `backend/src/modules/seller/index/seller.scan-order.ts`. These examples describe the present implementation; follow the rules above when a feature changes.

## Build, Test, and Development Commands

Run these from `backend/`:

- `bun install --frozen-lockfile` installs the versions in `bun.lock` (also used by CI).
- `bun run dev` starts the API in watch mode at `http://localhost:3000`.
- `bunx tsc --noEmit` checks TypeScript types without writing output.
- `bun build src/index.ts --outdir dist --target bun` builds the API as CI does.

There is no working package test script yet: `bun run test` exits with an error. Run the type check and build before submitting backend changes.

## Coding Style & Naming Conventions

Follow the existing TypeScript style: two-space indentation, double-quoted strings, semicolons, and explicit imports. Keep route handlers thin; put body validation in Elysia models, header validation in routes, and database work in services. Use `camelCase` for variables and exported functions and descriptive feature-based filenames such as `buyer.order.create.ts`. Preserve the existing database schema naming where it differs from TypeScript naming. TypeScript runs with `strict: true`; no formatter or linter is configured.

## Plain User-Facing Words

Use short, familiar words that a five-year-old can understand in mobile labels, buttons, messages, and documentation. Prefer `Add More`, `Take Away`, `Change Amount`, and `Change History`. Avoid `Stock In`, `Stock Out`, `Stock Adjustment`, and `Correction` in user-facing text. Technical API, database, and internal code names may remain unchanged when compatibility requires them.

## Implementation and Plan mode Approval

Before editing code, show the proposed code and the file path where it will go. Wait for the user's review and approval before making the edit.

## Obsidian Vault Updates

The Obsidian vault is in `Agrivive/`. After making project changes, create or update a Markdown note in the vault with the date, what changed, why, the affected file paths, and verification performed. When creating a commit, update the same note with the commit hash and message. Group related changes in one note.

## Testing Guidelines

The project owner manually tests API endpoints in Elysia OpenAPI or Postman. Do not add automated endpoint tests unless the owner requests them. For backend changes, run `bunx tsc --noEmit` and `bun build src/index.ts --outdir dist --target bun`. When an endpoint changes, provide its method, path, required headers, example request body, and expected response so the owner can test it. Record manual testing as complete only after the owner reports the result.

## Commit & Pull Request Guidelines

Recent commits use short, plain-English summaries (for example, `fixed addproduct typing issue` and `added add product route`). Use a concise subject that says what changed. For pull requests, describe the behavior, note any schema migration or configuration change, link the related issue when one exists, and include request/response examples for API changes. CI runs on pull requests targeting `main` when `backend/` changes.

## Configuration & Secrets

Put all secret keys, API tokens, passwords, database credentials, and other sensitive configuration values in a server-side `.env` file, such as `backend/.env`. Read them through environment variables; never hard-code them in source, tests, documentation, or examples. Do not put secrets in mobile or web `.env` files because client builds can expose them. Ensure every `.env` file is ignored by Git and never commit or share its contents. Use an `.env.example` with placeholder values when documenting required variables. Set `DATABASE_URL` locally for PostgreSQL-backed features and Drizzle. Commit generated migration files when changing `backend/src/db/schema.ts`.
