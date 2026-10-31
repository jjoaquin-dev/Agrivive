# 2026-10-31 Boost UI Aligned With Backend

Builds on [[2026-10-31 Boost Six-Hour Rule Repeats]]. Supersedes the Priority Promotion draft flow.

## What changed and why
The owner's phone screens still showed the old preview-and-post wording and a Boost state that never changed. Owner decision: Boost is the only marketing flow, so Priority Promotion was retired.

- **Retired Priority Promotion:** backend jobs, `/seller/promotions` and `/integrations/promotions/*` routes, services and models; `n8n/workflows/agrivive-priority-promotion.json`; `N8N_PROMOTION_*` settings and docs; the mobile inbox section, hook and API file. Database tables stay.
- **Photo fix:** the Boost photo route required the Priority tier, so a Boost on any other listing would fail at the picture. It now accepts any public, buyable listing.
- **Boost state:** new `seller.visibility-boost.progress.ts` gives each boost a plain state, its saved Facebook posts with links, rounds done, and the next price drop time. Used by `GET /seller/products/:id/boost` and `GET /seller/boosts`.
- **Notices:** new Boost Did Not Post push when a post fails (`integrations.visibility-boost.notify-failed.ts`).
- **Boost screen:** one header, product row (photo, code, price, drop rule), one status card with a post timeline, steps for the repeating rule, **Boost** / **Boost Again** button.
- **History:** photo, code, state, post timeline and links; filters All, Running, Posted, Needs your choice, Did not post; button "Open Boost".
- **Labels:** "Preview Post" is now Boost or Boost Again (listings, analytics, notification prompts); "12-Hour Drop" is Price Drop; the discount badge shows a real percent off or "Drops 5% / 6 hrs"; Listings Boost button shows for any active listing in stock; the analytics guide subtitle and card subtitle are plain; the price-change prompt reads "Boost Again?" with old and new price.
- Docs: `backend/README.md`, `backend/API_ENDPOINTS.md`, `deploy/README.md`, example env files.

## Not done
- Listing and Analytics cards do not show a Boost state chip (for example "Boosted, next drop 5:40 PM"). That needs the boost state added to the listings and analytics APIs.
- `utils/promotion-eligibility` still carries its old name; only the photo route uses it now.

## Verification
Backend `bunx tsc --noEmit` and mobile `bun run typecheck` pass. Not tested on a device or against n8n.
