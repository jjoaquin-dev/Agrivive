# Repository Guidelines

## Project Structure & Module Organization

The application lives in `backend/`, a Bun, TypeScript, and Elysia API. `backend/src/index.ts` starts the server. Keep feature modules under `backend/src/modules/<module>/` (plural). Shared database code is in `backend/src/db/`, plugins are in `backend/src/plugins/`, and Drizzle migrations are in `backend/drizzle/`. `.github/workflows/backend-ci.yml` defines CI. `mobile/` currently contains design guidance and image assets, while `analytics/` and `web/` contain no tracked application codez.

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

Keep source code files to 200 lines or fewer for readability. When a file exceeds that limit, split it into focused files that follow the project’s module conventions.

## Plain User-Facing Words

Use short, familiar words that a five-year-old can understand in mobile labels, buttons, messages, and documentation. Prefer `Add More`, `Take Away`, `Change Amount`, and `Change History`. Avoid `Stock In`, `Stock Out`, `Stock Adjustment`, and `Correction` in user-facing text. Technical API, database, and internal code names may remain unchanged when compatibility requires them.

Use specific, professional headings and labels that name the content or action. Do not use filler headings such as "What does it do?" or vague recommendation copy. Include captions only when they add information the heading does not provide. Label synthetic content visibly as "Sample data"; never imply it reflects real purchases. Keep loading and error copy consistent with the section heading.

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

## Comprehensive UI/UX Standards, Laws & Psychological Theories

All web and mobile interfaces in Agrivive must adhere to the following laws, standards, and theories. Whenever proposing or implementing UI/UX decisions, explicitly reference the relevant law and its originating author:

### 1. Cognitive Psychology & Mental Models
- **Jakob's Law** *(Jakob Nielsen)*: Users spend most of their time on other sites. Interfaces must use familiar patterns: standard top navigation, left-aligned form labels, intuitive cart flows, and standard modal/sheet dismissal. Never reinvent standard interactions.
- **Hick-Hyman Law** *(William Edmund Hick & Ray Hyman)*: The time to make a decision increases logarithmically with the number and complexity of choices. Group filters, categorize order statuses into distinct tabs, and provide clear defaults.
- **Miller's Law & Chunking** *(George A. Miller)*: Working memory holds approximately 7 ± 2 chunks of information. Break checkout, forms, and order details into discrete logical chunks with whitespace and dividers.
- **Tesler's Law (Conservation of Complexity)** *(Larry Tesler)*: Every system has an inherent amount of complexity that cannot be removed, only shifted. The application must absorb complexity (e.g. calculating stall grouping, reservation expiration, multi-seller cart splits) so the buyer experiences seamless simplicity.
- **Postel's Law (Robustness Principle)** *(Jon Postel)*: Be conservative in what you send, liberal in what you accept. Forgiving input parsing for quantities, phone numbers, and search terms, with consistent canonical output.
- **Recognition Over Recall** *(Jakob Nielsen & Rolf Molich)*: Make actions, options, and status visible. Do not require users to remember what was in their cart, what a seller requires for pickup, or what a status means.
- **Don't Make Me Think** *(Steve Krug)*: The primary purpose and next action of every screen must be self-evident at a glance without reading lengthy documentation.

### 2. Visual Perception & Gestalt Psychology
- **Gestalt Principles** *(Max Wertheimer, Kurt Koffka, Wolfgang Köhler)*:
  - **Law of Proximity**: Related items must be physically close. Form labels sit directly above inputs; per-field errors sit directly below their affected field.
  - **Law of Common Region**: Content within a bounded surface (card, panel, pass) is perceived as a group. Use cards to enclose stall information, pickup passes, and product listings.
  - **Law of Similarity**: Elements with the same function must share visual attributes (e.g., all primary action buttons use Forest Green `#1F4D3A` with rounded corners).
  - **Law of Uniform Connectedness**: Connected elements (steppers, timeline dots) are perceived as related stages in a single journey.
  - **Figure-Ground Principle**: Foreground cards (`#FFFFFF`) must clearly lift off the Warm Cream background (`#F8F6F1`) using crisp 1px borders (`#E5E2DA`) and soft tinted shadows.
  - **Law of Prägnanz (Simplicity)**: Users perceive ambiguous images as simple and complete. Layouts must remain clean, uncluttered, and scannable.
- **Von Restorff Effect (Isolation Effect)** *(Hedwig von Restorff)*: The distinctive item is the one remembered. Reserve high-contrast primary green and terracotta accents exclusively for primary CTAs and crucial status highlights.
- **Serial Position Effect** *(Hermann Ebbinghaus)*: Users best remember the first (Primacy) and last (Recency) items in a series. Place high-value navigation and critical actions at the start and end of toolbars and cards.
- **Aesthetic-Usability Effect** *(Masaaki Kurosu & Kaori Kashimura)*: Users perceive attractive, well-proportioned interfaces as more usable and trustworthy. Precise typography, consistent 4px rhythm, and harmonious colors directly impact conversion and trust.

### 3. Ergonomics, Motor Skills & Interaction
- **Fitts's Law** *(Paul Fitts)*: The time to acquire a target is a function of the distance to and size of the target. All primary CTAs must be at least 48px high, icon-only buttons at least 44×44px, and destructive controls deliberately separated from confirmation buttons.
- **Affordances and Signifiers** *(Don Norman, The Design of Everyday Things)*: An interface element must communicate how it is operated. Buttons must look tactile and pressable (`:active` translation); inputs must clearly indicate editability.
- **Doherty Threshold** *(Walter J. Doherty & Ahrvid J. Thadhani)*: Productivity and engagement soar when system response occurs in under 400ms. Provide instant optimistic feedback, skeleton loaders, and tactile button states.
- **Touch Target Principle & Mobile-First Ergonomics** *(Luke Wroblewski)*: Design for thumb reachability, zero horizontal scroll, and explicit responsive breakpoints (<640px, <768px, <1024px, >=1200px).

### 4. Feedback, System Status & Emotional Ergonomics
- **Visibility of System Status** *(Jakob Nielsen)*: Always keep users informed about what is happening through clear status badges, polling freshness timers, and interactive progress steppers.
- **Peak-End Rule** *(Daniel Kahneman & Barbara Fredrickson)*: People judge an experience largely by how they felt at its peak and at its end. Reservation confirmation, Digital Pickup Pass presentation, and order completion must feel celebratory, polished, and reassuring.
- **Goal-Gradient Effect** *(Clark L. Hull)*: Tendency to approach a goal increases with proximity to the goal. Multi-step workflows (reservation -> seller preparation -> pickup verification) must show visible progress indicators.
- **Error Prevention & Inline Validation** *(Caroline Jarrett & Gerry Gaffney)*: Prevent errors through quantity constraints. When errors occur, show individual inline error text beneath each field—never lump errors into a single generic alert box.
- **Ten Principles for Good Design** *(Dieter Rams)*: Good design is innovative, useful, aesthetic, understandable, unobtrusive, honest, long-lasting, thorough down to the last detail, environmentally conscious, and involves as little design as possible.

