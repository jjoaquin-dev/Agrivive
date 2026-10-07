# MBA Implementation

Date: 2026-10-03
Updated: 2026-10-06

## What changed

Agrivive now has a synthetic-first Market Basket Analysis pipeline under `analytics/mba/`. It supports explicit `disabled`, `synthetic`, and `live` modes. Synthetic baskets are written to CSV fixtures and analyzed into an aggregated JSON report. Live mode reads completed orders and ordered items through a read-only PostgreSQL query and remains in `collecting` status until the configured basket threshold is met.

The report is now connected to the buyer web product-detail page through `GET /marketplace/products/:id/recommendations`. The first buyer-facing version displays real active marketplace listings selected by synthetic associations with a visible demo label. The same response contract can switch to real completed-pickup rules later without changing the buyer UI. Recommendation candidates follow the existing public marketplace visibility rules; missing seller coordinates do not remove a listing from recommendations because directions are optional.

On 2026-10-06, the local demo fixture gained a Pechay–Fresh Tomatoes pair. Both names match currently available marketplace listings, so the existing product-name recommendation lookup can resolve this synthetic association to real listings. `MBA_MODE=synthetic` and `MBA_ITEM_LEVEL=product_name` were added only to the Git-ignored local `backend/.env`; the committed example still defaults to disabled. The production synthetic-mode guard remains unchanged. The API process initially retained its old environment and was subsequently restarted for verification.

The buyer-facing section copy was polished on 2026-10-06. Synthetic mode now shows "Suggested pairings" with a visible "Sample data" badge; ready live mode uses "Frequently bought together". The redundant explanatory caption was removed. `AGENTS.md` now requires specific, professional UI labels and captions that add real context, while keeping synthetic-data disclosures visible. This follows Dieter Rams's good-design principle of understandable, unobtrusive copy and Jakob Nielsen and Rolf Molich's Recognition Over Recall.

## Why it changed

Agrivive does not have historical wet-market purchasing records. The synthetic mode demonstrates the analytics method without presenting invented patterns as real buyer behavior. The live mode is ready to use first-party completed transactions when the marketplace has enough data. Synthetic records are not inserted into normal order tables, and n8n remains disabled.

## Affected paths

- `AGENTS.md`
- `analytics/.gitignore`
- `analytics/mba/requirements.txt`
- `analytics/mba/config.py`
- `analytics/mba/data_contract.py`
- `analytics/mba/generate_synthetic.py`
- `analytics/mba/mba_engine.py`
- `analytics/mba/run_mba.py`
- `analytics/mba/fixtures/synthetic_products.csv`
- `analytics/mba/fixtures/synthetic_transactions.csv` (regenerated local demo fixture)
- `analytics/mba/output/synthetic_mba_report.json` (regenerated, Git-ignored output)
- `analytics/mba/README.md`
- `backend/.env` (local, Git-ignored demo setting; do not commit)
- `backend/.env.example`
- `backend/README.md`
- `backend/API_ENDPOINTS.md`
- `backend/src/utils/mba-report/index.ts`
- `backend/src/modules/marketplace/model/marketplace.product.recommendations.ts`
- `backend/src/modules/marketplace/services/marketplace.product.recommendations.ts`
- `backend/src/modules/marketplace/index/marketplace.product.recommendations.ts`
- `backend/src/modules/marketplace/index.ts`
- `web/src/features/marketplace/types.ts`
- `web/src/features/marketplace/api/recommendations.ts`
- `web/src/features/marketplace/components/MbaRecommendationsSection.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`

## Research references

- Agrawal, Imieliński, and Swami (1993), *Mining Association Rules Between Sets of Items in Large Databases*.
- Li, Ning, Wang, and Jajodia (2001), *Generating Market Basket Data with Temporal Information*.
- Qisman, Rosadi, and Abdullah (2021), *Market Basket Analysis Using Apriori Algorithm to Find Consumer Patterns in Buying Goods Through Transaction Data*.
- Zhao, Xu, and Zhang (2021), *CTAB-GAN: Effective Table Data Synthesizing*.
- Mendikowski and Hartwig (2022), *Creating Customers That Never Existed: Synthesis of E-commerce Data Using CTGAN*.

## Verification performed

- `MBA_MODE=synthetic python analytics/mba/run_mba.py` completed successfully.
- The generated report contained 500 usable completed baskets and 16 unique items.
- The initial report produced eight directional rules from four planted product pairs; all four pairs were recovered in both directions.
- Cancelled and pending synthetic rows were excluded from the basket count.
- `MBA_MODE=disabled` produced an empty disabled report.
- Synthetic mode was rejected when `APP_ENV=production`.
- Live mode read the local database without writing to it and found 6 completed baskets across 5 items; it correctly returned `collecting` with no rules because the 500-basket threshold was not met.
- Live mode failed closed with a clear error when `DATABASE_URL` was missing.
- The live query uses the repository's quoted `sellers_product."productType"` column mapping.
- `python -m compileall -q analytics/mba` passed.
- `cd backend && bunx tsc --noEmit` passed.
- `cd backend && bun build src/index.ts --outdir dist --target bun` passed.
- `cd backend && bunx drizzle-kit check` passed.
- MBA report reader returned `source=synthetic`, `status=demo`, `basketCount=500`, and 8 rules in synthetic mode.
- MBA report reader returned `source=none`, `status=disabled` in disabled mode.
- Live MBA mode read the local database without writing and returned `source=real`, `status=collecting`, 6 baskets, and 0 rules because the 500-basket threshold is not met.
- `cd web && bunx tsc --noEmit` passed.
- The final recommendation query review confirmed that coordinate availability is optional for marketplace listing eligibility; seller coordinates remain nullable for directions.
- `cd web && bun run build` was attempted; the current Windows environment stopped Next.js with `spawn EPERM` before compilation, matching the existing host-process limitation. No TypeScript error was reported.
- `git diff --check` passed.
- `analytics/.venv` now contains the declared MBA dependencies: pandas 2.3.3 and psycopg 3.3.6.
- Synthetic verification passed using `analytics/.venv/Scripts/python.exe`.
- Live verification passed using the venv and returned `collecting` for the local 6-basket dataset.
- `git diff --check` reported no whitespace errors; Git only reported existing line-ending normalization warnings.
- The 2026-10-06 demo fixture regenerated successfully with 500 usable baskets and 10 directional rules, including Pechay → Fresh Tomatoes and Fresh Tomatoes → Pechay.
- A fresh backend process using the local demo settings returned `source=synthetic`, `status=demo`, and two currently available Fresh Tomatoes listings for a Pechay product. The reverse lookup returned two available Pechay listings for a Fresh Tomatoes product.
- The backend TypeScript check passed after the local demo setup.
- Before the API restart, its existing process returned `status=disabled` because it was started before the local environment change. After restart, the HTTP endpoint returned `source=synthetic`, `status=demo`, 500 baskets, and two available Fresh Tomatoes listings for the Pechay product.
- Before the copy update, reloading the local Pechay product page showed the demo-labeled recommendation section above "Similar produce" with both Fresh Tomatoes cards. The earlier open page had retained its pre-restart disabled response until reloaded. Owner acceptance remains pending.
- `cd web && bunx tsc --noEmit` passed after the copy update.
- Browser review at a narrow viewport and at 1280px showed "Suggested pairings" and the visible "Sample data" badge above the recommendation cards, without horizontal overflow. The existing recommendation cards and "Similar produce" section remained separate.

## Remaining owner-only acceptance checks

- Confirm the synthetic product catalog is acceptable for the defense.
- Confirm the synthetic recommendation wording and demo label for the defense.
- Confirm the 500-basket readiness threshold and rule thresholds before enabling live recommendations.
- Confirm whether live MBA should group by product name, product ID, or canonical product category for the first real-data review.
- Confirm that n8n remains disabled for this phase.
- Confirm the first real-data review process after enough completed baskets exist.
- Manually call `GET /marketplace/products/:id/recommendations` with synthetic, disabled, and live-collecting modes.
- Confirm the buyer product page shows the demo label, real active recommendation cards, retry behavior, and a separate existing Similar produce section.
- Restart the local API, then confirm the Pechay product page displays the demo-labeled MBA cards. Do not mark this browser acceptance complete until the owner has checked it.

## Commit

Not created yet.
