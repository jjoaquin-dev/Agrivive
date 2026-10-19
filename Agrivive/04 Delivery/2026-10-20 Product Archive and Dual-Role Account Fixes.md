---
title: Product Archive Guard, Visibility Guide Fix, and Dual-Role Account Support
type: delivery-record
status: completed
date: 2026-10-20
---

# Product Archive Guard, Visibility Guide Fix, and Dual-Role Account Support

## 1. What Changed

1. **Product Archive 404 & Active Reservation Protection**:
   * Resolved product archiving failure (HTTP 404) by adding the `POST /seller/products/:id/archive` endpoint on the backend to match the mobile client expectation.
   * Enforced an atomic guard in `archiveSellerProduct` that prevents archiving any produce with active buyer reservations (`orders.status = 'pending'`).
2. **Marketplace Visibility Guide Card Fix**:
   * Resolved the misleading *"Ensure stock is positive to receive visibility ranking"* notice on active, stocked products.
   * Added the missing `inputs` object (carrying posting age, remaining quantity, prior cycles, and recurrence) to `GET /seller/weightedvisibility` responses.
   * Normalized placement tier to lowercase (`priority`, `standard`, `basic`) and made the mobile card case-insensitive.
   * Modified `VisibilityBreakdownCard.tsx` to display factor metrics whenever `score !== null`, showing specific ineligibility reasons only when unranked.
3. **Dual-Role Account Creation & Instant Duplicate Filter**:
   * Implemented the rule restricting accounts to a maximum of **2 roles** (`buyer` and `seller`).
   * Added `POST /auth/check-email` and `POST /auth/register-role` in the backend auth module.
   * Enforced immediate pre-flight filtering during email/password entry (on blur and at the very top of submit) in both `mobile/app/(auth)/register.tsx` and `web/app/(auth)/signup/page.tsx`.
   * If an email already holds 2 roles: displays an inline error *"This email already has both Buyer and Seller profiles (maximum 2 roles reached). Please sign in instead."* and halts execution immediately (preventing any redirect to onboarding profile setup).
   * If an email already holds the target role: displays an inline error *"An account with this email is already registered as a [Seller/Buyer]. Please sign in instead."* and halts execution.
   * If an email has 1 role: verifies existing password via `POST /auth/register-role` to unlock/add the second role; if incorrect, halts with inline password error.
   * If an email is brand new (0 roles): registers the account with the appropriate target role and routes to email OTP verification.
4. **Price Change Boost Preview Post Guard**:
   * Resolved immediate dispatch to n8n upon pressing the boost action in the notification section.
   * Updated `SellerBoostPromptSection.tsx` so pressing "Preview Post" navigates to the dedicated post preview screen (`/(app)/boost/[productId]`) with `promptId` instead of queueing the webhook right away.
   * In `boost/[productId].tsx`, the seller can preview the listing card, view/edit the generated post captions, and select social channels. Dispatch to n8n occurs only after the seller confirms "Post".
   * Upon post confirmation, the active prompt is resolved/marked accepted, clearing it from the notifications section.
5. **Conversation Header & Sender Name Display**:
   * Fixed header displaying raw route string `conversations/[id]`.
   * Registered `conversations/[id]` in `mobile/app/(app)/_layout.tsx` with default title `"Conversation"`.
   * Updated `backend/src/modules/conversations/services/conversation.list.ts` to join the buyer user record via `aliasedTable(user, "buyer_user")`, returning `buyerName` and `buyerImage`.
   * In `mobile/app/(app)/conversations/[id].tsx`, dynamically bound the Stack header title to `senderName` (`conversation.buyerName || "Buyer"`), eliminating the route ID.
   * Updated `ConversationBubble.tsx` to render the sender's actual name on incoming message bubbles.

## 2. Why

* **Integrity & Fulfillment**: Sellers could not archive products due to route method mismatch, and archiving products with live reservations could strand buyers with unfulfillable orders.
* **Accuracy & Trust**: Positive-stock products were incorrectly flagged as needing positive stock in mobile analytics due to a missing response payload property.
* **Instant Duplicate Interception**: Prevented users entering duplicate/existing emails from being inadvertently forwarded to the seller profile setup screen, guaranteeing immediate inline error feedback right during email and password entry.
* **Review Before Publish**: Sellers must have full visibility and editing control over their promotional copy, channels, and pricing disclosures before content is transmitted to external n8n workflows and social media pages.
* **Professional Messaging UI**: Replaced raw technical route path `conversations/[id]` with the real buyer/sender's name in both the navigation bar and message bubbles.

## 3. Affected Files

* `backend/src/modules/seller/services/seller.product.archive.ts`
* `backend/src/modules/seller/index/seller.product.archive.ts`
* `backend/src/modules/seller/services/seller.weighted.surplus.visibility.ts`
* `backend/src/modules/auth/model/auth.role-register.ts`
* `backend/src/modules/auth/services/auth.role-check.ts`
* `backend/src/modules/auth/services/auth.role-expand.ts`
* `backend/src/modules/auth/index/auth.role-register.ts`
* `backend/src/modules/conversations/services/conversation.list.ts`
* `backend/src/utils/order-types/index.ts`
* `backend/src/index.ts`
* `backend/API_ENDPOINTS.md`
* `mobile/src/components/InputComponent.tsx`
* `mobile/src/features/analytics/components/VisibilityBreakdownCard.tsx`
* `mobile/src/features/conversations/types.ts`
* `mobile/src/features/conversations/components/ConversationBubble.tsx`
* `mobile/src/features/notifications/components/SellerBoostPromptSection.tsx`
* `mobile/app/(app)/_layout.tsx`
* `mobile/app/(app)/notifications.tsx`
* `mobile/app/(app)/boost/[productId].tsx`
* `mobile/app/(app)/conversations/[id].tsx`
* `mobile/app/(auth)/register.tsx`
* `web/app/(auth)/signup/page.tsx`

## 4. Verification Performed

* `bunx tsc --noEmit` in `backend/` passed (0 errors).
* `bun build src/index.ts --outdir dist --target bun` in `backend/` passed (4.51 MB bundled).
* `bun run typecheck` in `mobile/` passed (0 errors).
* `bun run typecheck` in `web/` passed (0 errors).
