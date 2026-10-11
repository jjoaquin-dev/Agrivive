---
title: Vegetable Catalog and Filipino Market Naming
type: implementation-record
status: implemented
date: 2026-10-11
---

# Vegetable Catalog and Filipino Market Naming

## Decision

Agrivive now uses an approved vegetable catalog instead of allowing sellers to type an unrestricted product name and category. The seller searches by a familiar Filipino wet-market name, English name, or approved alias, then selects one catalog record. Agrivive derives the category from that record so the name and category cannot disagree.

The catalog stores the Filipino display name as the product name. English names and aliases support recognition and search; they do not replace the Filipino display name shown to buyers.

## Research reference for the paper

The category structure follows the Alliance of Bioversity International and CIAT guide, which classifies vegetables by the edible plant part. The reference is:

> Alliance of Bioversity International and CIAT. (n.d.). *Types of vegetables: Full list, categories, and classification guide*. Retrieved 11 October 2026, from https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide

Use the live page as the source for the category rationale and cite this implementation note for Agrivive's local naming and scope decisions. The source page is a classification reference; it is not evidence that every listed crop is currently sold by an Agrivive seller.

## Adopted categories

Agrivive uses these nine categories from the reference structure:

1. Leafy Greens
2. Root Vegetables
3. Bulb Vegetables
4. Stem Vegetables
5. Flower Vegetables
6. Fruit Vegetables
7. Pod Vegetables
8. Tuber Vegetables
9. Seed Vegetables

Fungi and mushrooms are excluded because this capstone's marketplace scope is vegetables. They are not selectable in the catalog and are not included in the seed records.

## Naming and classification decisions

| Agrivive decision | Rule |
|---|---|
| Filipino display name | Use the familiar Philippine wet-market name when one is available, such as Kamatis, Talong, Kalabasa, Sitaw, Pechay, and Sibuyas dahon. |
| English name | Keep an English name for recognition and search, such as Tomato, Eggplant, Squash, String bean, Bok choy, and Spring onion. |
| Search aliases | Keep common alternatives such as green onion, scallion, sweet pepper, capsicum, yardlong bean, and pumpkin. |
| Spring onion | `Sibuyas dahon` is classified as Bulb Vegetables because it is an Allium crop sold with an edible bulb/base and leaves. This is a project classification decision and should be stated in the paper if the item is discussed. |
| Pile / tumpok | `Pile` or `tumpok` is a selling unit, not a vegetable name or category. The seller still chooses it as the selling unit. |
| Scientific names | Stored as supporting identification data where available; they do not replace the market name in the seller workflow. |
| Overlapping examples | The reference notes that some vegetables can fit multiple categories. Agrivive stores one primary category per catalog record: Patatas is stored as Tuber Vegetables and Kamote as Root Vegetables; peas are stored as Pod Vegetables. |
| Fungi / mushrooms | Excluded from the active catalog and from the vegetable seed data. |

## Implemented catalog fields

- `id`: stable catalog record identifier.
- `filipinoName`: canonical wet-market display name.
- `englishName`: recognition and search name.
- `searchAliases`: alternative names used in search.
- `searchText`: normalized searchable text generated from the names and aliases.
- `category`: one of the nine adopted categories.
- `scientificName`: optional supporting identity field.
- `sourceUrl`: category reference URL retained with each record.
- `reviewStatus`: keeps catalog governance explicit; seller search currently returns approved records only.
- `isActive`: allows a record to be retired without deleting its history.
- `vegetableCatalogId` on a seller listing: links the listing to the selected catalog record.

## Implemented seller flow

1. Seller opens Add Product or Edit Product.
2. Seller searches the vegetable name in Filipino or English.
3. Agrivive shows approved catalog matches with Filipino name, English name, and category.
4. Seller selects one match.
5. Agrivive fills the canonical Filipino product name and derives the category.
6. Seller enters photo, quantity, price, selling unit, availability, and low-stock settings.
7. The API validates the catalog record, prevents an inactive or unapproved record, checks duplicate name plus selling unit, and saves the listing.
8. Marketplace search matches the Filipino name, English name, and aliases.

## Seed records

The first migration adds 48 records across all nine categories, covering the named vegetable examples in the reference guide plus common Philippine market items such as Pechay, Kangkong, Sitaw, Ampalaya, and Sibuyas dahon. It intentionally does not add mushrooms or fungi. The seeded Filipino names are a practical Agrivive naming layer and should be reviewed with the project adviser or local sellers before being described as a complete regional vocabulary. The reference itself says its examples are illustrative rather than an exhaustive list of all vegetables.

## Affected paths

- `backend/src/db/schema.ts`
- `backend/drizzle/20261011120000_vegetable_catalog/migration.sql`
- `backend/drizzle/20261011121000_vegetable_catalog_category_backfill/migration.sql`
- `backend/API_ENDPOINTS.md`
- `backend/src/utils/vegetable-catalog/index.ts`
- `backend/src/modules/seller/model/seller.vegetable-catalog.ts`
- `backend/src/modules/seller/services/seller.vegetable-catalog.ts`
- `backend/src/modules/seller/index/seller.vegetable-catalog.ts`
- `backend/src/modules/seller/model/seller.product.ts`
- `backend/src/modules/seller/model/seller.product.create.ts`
- `backend/src/modules/seller/services/seller.product.create.ts`
- `backend/src/modules/seller/services/seller.product.update.ts`
- `backend/src/modules/marketplace/model/marketplace.products.ts`
- `backend/src/modules/marketplace/services/marketplace.products.list.ts`
- `backend/src/modules/marketplace/services/marketplace.sellers.map.ts`
- `mobile/src/features/inventory/types.ts`
- `mobile/src/features/inventory/api/products.ts`
- `mobile/src/features/inventory/validation.ts`
- `mobile/src/features/inventory/components/VegetableCatalogPicker.tsx`
- `mobile/src/features/inventory/components/ProductForm.tsx`
- `mobile/src/features/inventory/components/ProductFormIdentity.tsx`
- `mobile/src/features/inventory/components/ProductFormOperations.tsx`
- `mobile/src/features/inventory/components/ProductFormStyles.ts`
- `web/src/features/marketplace/types.ts`
- `web/src/components/MarketplaceHeaderSearch.tsx`

## Verification

- On 11 October 2026, updated `mobile/src/features/inventory/components/VegetableCatalogPicker.tsx` so selecting a catalog name keeps the chosen name visible while hiding other search results. Suggestions return only after the seller edits the selected name.
- `cd mobile && bun run typecheck` passed after the picker update.
- On 11 October 2026, fixed the Drizzle mapping for `reviewStatus` in `backend/src/db/schema.ts` so it explicitly targets the existing database column `review_status`. The server log had shown generated SQL using the nonexistent camelCase column `reviewStatus`.
- `cd backend && bunx tsc --noEmit` passed after the mapping fix.
- `cd backend && bun build src/index.ts --outdir dist --target bun` passed after the mapping fix.
- A read-only Drizzle query against the configured PostgreSQL database returned an approved catalog row, confirming that `vegetable_catalog.reviewStatus` now resolves through the `review_status` column.
- `cd backend && bunx tsc --noEmit` passed on 11 October 2026.
- `cd mobile && bun run typecheck` passed on 11 October 2026.
- `cd web && bun run typecheck` passed on 11 October 2026.
- `bun build src/index.ts --outdir dist-check --target bun` passed on 11 October 2026 after the required `dist` output path returned a Windows `EUNKNOWN` error while replacing its existing generated chunk. The temporary verification output was removed.
- An active-code and vault search found no remaining MBA or Market Basket Analysis references.
- Manual seller testing was completed by the project owner on 11 October 2026. The owner sold all Sitaw stock to zero, added stock again, refreshed Analytics, and confirmed the recurring-listing metric worked.
- Manual buyer endpoint testing remains pending.

## Paper-use note

For the methodology or system-design section, describe the catalog as a controlled reference data set. Do not describe the seeded Filipino names as survey measurements or historical market demand. The catalog supports consistent product naming and category integrity; it does not create historical transaction data.

## Recurring listing identity fix — 11 October 2026

### What changed

Listing cycles now store the stable vegetableCatalogId in addition to the existing normalized display-name key. Recurrence, visibility scoring, seller analytics, and priority-promotion eligibility use the catalog ID first and fall back to the old name key only for legacy records without a catalog link.

The zero-stock behavior is unchanged: a new cycle is created only when an active product reaches zero and positive stock is added again. The Sitaw test had already created a new cycle; its counter stayed at zero because the previous cycle was stored as morrer while the current cycle was sitaw.

### Why

Displayed names are not a reliable identity. A seller can use an alias, a translation, or a corrected catalog name for the same vegetable. The catalog record is the stable identity, so the recurrence count can recognize the same vegetable across listing cycles.

### Affected paths

- backend/src/db/schema.ts
- backend/src/utils/vegetable-identity/index.ts
- backend/src/utils/visibility-score/index.ts
- backend/src/utils/promotion-eligibility/index.ts
- backend/src/modules/seller/services/seller.product.create.ts
- backend/src/modules/seller/services/seller.product.stock-change.ts
- backend/src/modules/seller/services/seller.product.reactivate.ts
- backend/src/modules/seller/services/seller.product.update.ts
- backend/src/modules/seller/services/seller.weighted.surplus.visibility.ts
- backend/src/modules/seller/services/seller.analytics.metrics.ts
- backend/src/modules/marketplace/services/marketplace.product.get.ts
- backend/drizzle/20261011123000_listing_cycle_catalog_identity/migration.sql

### Verification

- cd backend && bunx tsc --noEmit passed on 11 October 2026.
- cd backend && bun build src/index.ts --outdir dist --target bun passed on 11 October 2026.
- The first migration attempt could not resolve the configured Supabase host from the restricted environment.
- The network-enabled migration attempt was intentionally blocked because drizzle-kit migrate would apply all pending migrations, including earlier broad vegetable-catalog and enum migrations. The new listing-cycle migration is therefore prepared locally but is not yet applied to the database.

## Selling-unit recurrence refinement — 11 October 2026

The recurring identity is now vegetable catalog ID plus selling unit. Sitaw sold by kilo is separate from Sitaw sold by sack or pile. Listing cycles save the selling unit when the cycle starts, and the same identity is used by marketplace visibility, seller analytics, and priority-promotion eligibility.

Additional migration:

- backend/drizzle/20261011124000_listing_cycle_selling_unit_identity/migration.sql

The live database still needs the pending migrations applied before this behavior can be tested against the running API.

The selling-unit migration backfill was corrected on 11 October 2026 to read the existing database column sellers_product."scalingType". The listing-cycle destination remains scaling_type.

After the migration applied, the runtime query exposed a separate Drizzle mapping issue: listing cycles were being queried as scalingType while PostgreSQL stores the new column as scaling_type. The listing-cycle schema now explicitly maps scalingType to scaling_type; the existing sellers_product mapping remains unchanged.

Verification after this correction:

- cd backend && bunx tsc --noEmit passed.
- cd backend && bun build src/index.ts --outdir dist --target bun passed.

Analytics recurrence was corrected on 11 October 2026. A current-period cycle now counts as recurring when an earlier cycle with the same vegetable catalog ID and selling unit exists before it in the loaded analytics history. This fixes the case where both Sitaw cycles fall inside the selected 30-day period; the earlier implementation compared only against cycles before the period start and returned zero.

Verification after this correction:

- cd backend && bunx tsc --noEmit passed.
- cd backend && bun build src/index.ts --outdir dist --target bun passed.
