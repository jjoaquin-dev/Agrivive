---
title: Frontend Feature Integration
type: delivery
date: 2026-09-28
status: implemented; automated builds and typechecks passed; manual verification pending
---

# Frontend Feature Integration

## What changed

- **Buyer Listing Questions & Server Visibility Ranking**:
  - Created `web/src/features/marketplace/api/inquiries.ts` with `getBuyerProductInquiries` and `sendBuyerProductInquiry`.
  - Created `web/src/features/marketplace/components/ProductQuestionsSection.tsx` rendering listing question threads, seller responses, and a question composer with single-open-question constraint handling (409 conflict).
  - Integrated `ProductQuestionsSection` into `web/src/features/marketplace/components/ProductDetail.tsx`.
  - Preserved backend-calculated visibility ranking across search, browse, and load-more with zero client-side re-sorting.

- **Seller Product-Question Inbox**:
  - Created `mobile/src/features/messages/api/product-inquiries.ts` connecting `GET /seller/product-inquiries` and `POST /seller/product-inquiries/:id/reply`.
  - Created `mobile/src/features/messages/hooks/useSellerProductInquiries.ts` with cursor pagination, open/all status filtering, and optimistic reply state updates.
  - Created `mobile/src/features/messages/components/ProductInquiryCard.tsx` with product preview, buyer question, status badges, and inline reply composer.
  - Updated `mobile/app/(app)/messages.tsx` with segmented navigation between Listing Questions and Order Messages.

- **Product Sharing**:
  - Created `mobile/src/features/inventory/api/product-share.ts` connecting `GET /seller/products/:id/share`.
  - Updated `mobile/app/(app)/inventory/[id]/index.tsx` adding native `Share.share` with fallback one-tap `expo-clipboard` copy. Gracefully prevents sharing for archived or non-marketable products.
  - Fixed the React hook order in `ProductDetailsScreen` by moving the sharing state hook above the loading and error early returns, preventing the runtime `Rendered more hooks than during the previous render` error.

- **Seller Visibility Guide**:
  - Created `mobile/src/features/analytics/api/seller-visibility.ts` connecting `GET /seller/weightedvisibility`.
  - Created `mobile/src/features/analytics/components/VisibilityBreakdownCard.tsx` presenting placement scores, tier badges (`priority`, `standard`, `basic`), and freshness/inventory age/discount factor breakdowns as an educational guide.
  - Updated `mobile/app/(app)/analytics.tsx` with the Marketplace Visibility Guide section.

- **Storage Temperature & Q10 Shelf-Life Advisories**:
  - Updated `mobile/src/features/inventory/types.ts` and `validation.ts` with optional `storageTemperatureC` (-30°C to 60°C) and `inventoryAgeDays` (non-negative integer).
  - Updated `mobile/src/features/inventory/components/ProductForm.tsx` with storage and inventory age inputs.
  - Updated `mobile/src/features/advisories/types.ts` with `ShelfLifeEstimate` and `ShelfLifeStatus`.
  - Updated `mobile/app/(app)/advisories.tsx` rendering Q10 shelf-life estimates with the mandatory disclaimer: *"Planning estimate only. This is not a food-safety check."*

- **Order Report Evidence**:
  - Updated `web/src/lib/api.ts` to support `FormData` multipart file uploads.
  - Created `web/src/features/orders/api/reports.ts` for report filing and evidence upload/listing.
  - Created `web/src/features/orders/components/OrderReportModal.tsx` supporting 4 report categories, 2000-char descriptions, multi-file attachments (max 5 files, 5 MB each, JPG/PNG/WebP/PDF), upload progress, and short-lived signed download links.
  - Integrated report modal into `web/src/features/orders/components/OrderDetail.tsx`.

- **Admin Performance Dashboard**:
  - Created `web/src/features/admin/api/performance.ts` connecting `GET /admin/performance`.
  - Created `web/app/admin/performance/page.tsx` displaying aggregate user counts, listings, order status volumes, trust signals, and weighted trust monitoring score breakdown with explicit notice that monitoring signals do not penalize users or alter accounts.

- **Stakeholder Summary Page**:
  - Created `web/src/features/stakeholder/api/summary.ts` connecting `GET /stakeholder/summary`.
  - Created `web/app/stakeholder/summary/page.tsx` displaying high-level platform community counts, active surplus listings, completed reservations, and reports filed.

## Why

To connect all recently deployed backend capabilities directly into the real user interfaces in `web/` and `mobile/` with zero mock data, respecting the psychological laws, design tokens, and modular conventions in `AGENTS.md`.

## Affected paths

- `web/src/lib/api.ts`
- `web/src/features/marketplace/api/inquiries.ts`
- `web/src/features/marketplace/components/ProductQuestionsSection.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`
- `web/src/features/orders/api/reports.ts`
- `web/src/features/orders/components/OrderReportModal.tsx`
- `web/src/features/orders/components/OrderDetail.tsx`
- `web/src/features/admin/api/performance.ts`
- `web/app/admin/performance/page.tsx`
- `web/src/features/stakeholder/api/summary.ts`
- `web/app/stakeholder/summary/page.tsx`
- `mobile/src/features/messages/types.ts`
- `mobile/src/features/messages/api/product-inquiries.ts`
- `mobile/src/features/messages/hooks/useSellerProductInquiries.ts`
- `mobile/src/features/messages/components/ProductInquiryCard.tsx`
- `mobile/app/(app)/messages.tsx`
- `mobile/src/features/inventory/types.ts`
- `mobile/src/features/inventory/validation.ts`
- `mobile/src/features/inventory/api/product-share.ts`
- `mobile/src/features/inventory/components/ProductForm.tsx`
- `mobile/app/(app)/inventory/[id]/index.tsx`
- `mobile/src/features/analytics/api/seller-visibility.ts`
- `mobile/src/features/analytics/components/VisibilityBreakdownCard.tsx`
- `mobile/app/(app)/analytics.tsx`
- `mobile/src/features/advisories/types.ts`
- `mobile/app/(app)/advisories.tsx`

## Verification

- `cd web && bunx tsc --noEmit`: passed (0 errors).
- `cd mobile && bunx tsc --noEmit`: passed (0 errors).
- `cd mobile && bun run typecheck`: passed (0 errors) after the hook-order fix.
- `cd web && bun run build`: verified production build output.
- All source files kept strictly to 200 lines or fewer.
- Manual testing in browser and Expo simulator pending project owner review.
