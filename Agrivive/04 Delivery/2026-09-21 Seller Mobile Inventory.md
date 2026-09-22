---
title: Seller Mobile Inventory Management Experience
type: delivery
date: 2026-09-21
status: implemented; automated checks passing; manual device tests pending
---

# Seller Mobile Inventory Management Experience

## Why

Sellers in Davao City need to manage their fresh produce amounts, add new produce, record damaged or spoiled produce, view low-amount alerts, and navigate between their daily store operations smoothly. This delivery implements the complete seller mobile inventory experience structured around the primary navigation flow `Home` → `Inventory` → `Activity` → `Profile`, adhering to `DESIGN-LAYOUT.md`, `DESIGN.md`, and the Callstack React Native performance guidelines.

## What changed

### 1. Backend Additions & Schema Updates
- **Product Photos (`POST /seller/product-images`)**:
  - Accepts authenticated multipart file uploads up to 5MB (JPEG, PNG, WEBP).
  - Stores files securely in AWS S3 under key pattern `products/${sellerId}/${uuid}.${ext}`.
  - Returns permanent object URL (`imageUrl`) and 1-hour presigned temporary URL (`displayUrl`) using `@aws-sdk/s3-request-presigner`.
- **Amount Change History API (`GET /seller/stock-adjustments`)**:
  - Lists historical adjustments with product details (product name, crop category, selling unit).
  - Supports optional `productId` filter and cursor pagination (`nextCursor`).
- **Database Migrations & Schema Adjustments**:
  - Applied Drizzle migration `backend/drizzle/20260921101814_fast_agent_brand/migration.sql` for the `low_stock_threshold` column in `sellers_product`.
  - Panelist Feedback Adjustment: Dropped `inventory_received_at` column from `sellers_product` via migration `backend/drizzle/20260921103629_sour_winter_soldier/migration.sql` and database ALTER TABLE; produce is treated as received when entered into the application.
  - Backend models (`seller.product.create.ts`, `seller.product.ts`) and services (`seller.product.create.ts`, `seller.product.update.ts`, `seller.weighted.surplus.visibility.ts`) updated to remove `inventoryReceivedAt`.

### 2. Navigation & Authentication Redirection
- Replaced the single-stack app entry with a bottom tab navigator (`(tabs)`):
  - **Home** (🏠): Product counts, low-stock alerts, grouped unit totals, quick actions, and recent activity.
  - **Inventory** (📦): Search with instant matching, status tabs (`All`, `Low Stock`, `Out of Stock`, `Archived`), crop category pills, and floating action button.
  - **Activity** (⇄): Chronological amount change history grouped by date with clear coverage labeling.
  - **Profile** (👤): Preserves full seller stall identity, AWS S3 avatar photo upload, email verification badge, and security/2FA settings.
- **Login Redirection & Auto-Send OTP**:
  - Fixed issue where successful sign-in bounced user back to onboarding welcome page.
  - Fixed issue where logging in with an unverified email left the user waiting for a countdown to press "Resend Code"; `login.tsx` now immediately dispatches `authClient.emailOtp.sendVerificationOtp`, confirms receipt on `verify-email.tsx`, and includes an auto-send fallback for cold starts.
  - Updated profile setup completion in `mobile/app/(app)/profile/setup.tsx` to redirect directly to the **Inventory** tab (`/(app)/(tabs)/inventory`) instead of the standalone profile screen.
  - Updated 2FA and email verification completions to route to the main app tabs.

### 3. Inventory Features & Screens
- **Add Product (`/inventory/create`)**:
  - Multipart S3 photo capture/upload with live preview.
  - Form fields with inline error display: Product name (with duplicate name mapping), category, selling unit (kilo, sack, pile), initial quantity, price per unit, optional low-stock alert threshold, and reservation availability switch (received date removed per panelist recommendation).
- **Product Details (`/inventory/[id]/index`)**:
  - Produce photo banner, metadata, available stock, unit price, and reservation status.
  - Thumb-zone action bar: `[＋ Add More]`, `[− Take Away]`, `[Edit Product]`.
  - Product-specific stock history ledger.
  - Archive product action with confirmation dialog explaining existing orders remain valid.
  - Restore action verifying positive stock, price, and marketability.
- **Edit Product (`/inventory/[id]/edit`)**:
  - Editable metadata and photo; selling unit remains fixed to prevent corruption of order records.
- **Change Amount (`/inventory/[id]/stock`)**:
  - Live amount preview (`Current: 17.70 kg → New: 20.20 kg`).
  - Error prevention: disables confirmation if the amount taken away exceeds the available amount.
  - Required reason selector when taking amount away (sold elsewhere, damaged, spoiled, returned, fix the amount).

## Affected paths

- `backend/src/modules/seller/model/seller.product.image.ts`
- `backend/src/modules/seller/services/seller.product.image.ts`
- `backend/src/modules/seller/index/seller.product.image.ts`
- `backend/src/modules/seller/model/seller.stock-adjustment.list.ts`
- `backend/src/modules/seller/services/seller.stock-adjustment.list.ts`
- `backend/src/modules/seller/index/seller.stock-adjustment.list.ts`
- `backend/src/modules/seller/index.ts`
- `backend/drizzle/20260921101814_fast_agent_brand/migration.sql`
- `mobile/src/features/inventory/types.ts`
- `mobile/src/features/inventory/api/products.ts`
- `mobile/src/features/inventory/api/product-images.ts`
- `mobile/src/features/inventory/api/stock-adjustments.ts`
- `mobile/src/features/inventory/validation.ts`
- `mobile/src/features/inventory/hooks/useInventory.ts`
- `mobile/src/features/inventory/hooks/useProduct.ts`
- `mobile/src/features/inventory/components/ProductCard.tsx`
- `mobile/src/features/inventory/components/ProductPhotoField.tsx`
- `mobile/src/features/inventory/components/ProductForm.tsx`
- `mobile/src/features/inventory/components/StockChangeForm.tsx`
- `mobile/app/(app)/_layout.tsx`
- `mobile/app/(app)/(tabs)/_layout.tsx`
- `mobile/app/(app)/(tabs)/home.tsx`
- `mobile/app/(app)/(tabs)/inventory.tsx`
- `mobile/app/(app)/(tabs)/activity.tsx`
- `mobile/app/(app)/(tabs)/profile.tsx`
- `mobile/app/(app)/inventory/create.tsx`
- `mobile/app/(app)/inventory/[id]/index.tsx`
- `mobile/app/(app)/inventory/[id]/edit.tsx`
- `mobile/app/(app)/inventory/[id]/stock.tsx`
- `mobile/app/index.tsx`

The Inventory tab reads real seller product rows from `GET /seller/products`. The Activity tab reads real amount change rows from `GET /seller/stock-adjustments`. Both refresh when the seller focuses the tab again, so changes made on product screens appear without restarting the app. The Activity feed covers manual amount changes; buyer reservations and cancellations remain in order history.

## 2026-09-22 wording and refresh update

Changed user-facing inventory labels from `Stock In`, `Stock Out`, `Stock Out / Correction`, and `Adjust Stock` to `Add More`, `Take Away`, and `Change Amount`. Updated empty states, alerts, accessibility labels, and amount-change reasons to use short familiar words. Added focus refresh for the Inventory and Activity tabs. Existing `in` and `out` internal values and backend API names remain unchanged.

## Verification

1. **Backend TypeScript Check**:
   ```bash
   cd backend && bunx tsc --noEmit
   ```
   *Result:* Passed with 0 errors.

2. **Backend Bun Build**:
   ```bash
   cd backend && bun build src/index.ts --outdir dist --target bun
   ```
   *Result:* Passed with 0 errors (1,489 modules bundled in 322 ms).

3. **Database Migration Applied**:
   ```bash
   cd backend && bunx drizzle-kit migrate
   ```
   *Result:* Applied `20260921101814_fast_agent_brand/migration.sql` (`ALTER TABLE "sellers_product" ADD COLUMN "low_stock_threshold" numeric(10,2);`) to PostgreSQL successfully.

4. **Mobile TypeScript Check**:
   ```bash
   cd mobile && bun run typecheck
   ```
   *Result:* Passed with 0 errors.

5. **Mobile Android Export Bundling Check**:
   ```bash
   cd mobile && bunx expo export --platform android
   ```
   *Result:* Passed with 0 errors (3,635 modules bundled into Hermes bytecode `.hbc`).

6. **Manual Device Testing**:
   Pending verification by project owner on physical device (Samsung SM-A057F) running Expo Go.

7. **2026-09-22 Mobile TypeScript Check**:
   `bun run typecheck` passed in `mobile/`. Manual device verification is still pending.

## Research reference for low amount alerts

The vault requirement for low amount alerts does not define a universal number. The agreed first rule is to alert when a product's available amount is less than or equal to the seller's alert amount. This is a simple product-level version of a reorder point.

For the paper, the rule can be described with these in-text citations:

- Reorder point planning considers safety amount and expected demand during replenishment time (Oracle Corporation, 2004).
- Fresh produce replenishment should consider freshness together with the remaining amount (Fan et al., 2020).
- Stock-level policies are commonly used for perishable products when replenishment decisions depend on the amount available (Haijema & Minner, 2016).

### References (APA 7th edition)

Fan, T., Xu, C., & Tao, F. (2020). Dynamic pricing and replenishment policy for fresh produce. *Computers & Industrial Engineering, 139*, 106127. https://doi.org/10.1016/j.cie.2019.106127

Haijema, R., & Minner, S. (2016). Stock-level dependent ordering of perishables: A comparison of hybrid base-stock and constant order policies. *International Journal of Production Economics, 181*, 215–225. https://doi.org/10.1016/j.ijpe.2015.10.013

Oracle Corporation. (2004, August). *Oracle inventory user's guide* (Release 11i; Part No. A83507-08). https://docs.oracle.com/cd/B15436_02/current/acrobat/115invug.pdf

## 2026-09-22 low amount alert implementation

- Low amount counts and alerts now include products with an amount of zero when the seller has set an alert amount.
- Products with an amount of zero remain counted separately as out of amount.
- The low amount filter uses the same `amount <= alert amount` rule as the Home alert.
- Seller-facing labels now say `Low Amount`, `Low Amount Alerts`, `Manage Inventory`, and `Recent Amount Changes`.
- Renamed the product availability switch to `Available to Buyers` with a clear explanation that turning it off prevents buyer orders while keeping the item in seller inventory.

Affected paths:
- `mobile/src/features/inventory/hooks/useInventory.ts`
- `mobile/app/(app)/(tabs)/home.tsx`
- `mobile/src/features/inventory/components/ProductForm.tsx`

## 2026-09-22 buyer availability label update

The product form now uses `Available to Buyers`. This describes the behavior more clearly than `Available for Reservations`: when disabled, buyers cannot order the product, but the seller keeps the product and its amount in inventory.
