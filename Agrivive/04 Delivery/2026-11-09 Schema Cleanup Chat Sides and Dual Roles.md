---
title: Schema Cleanup, Chat Sides and Dual Roles
type: changelog
date: 2026-11-09
---

# 2026-11-09 Schema Cleanup, Chat Sides and Dual Roles

Up: [[Delivery Index 2026-11]] · Latest: [[00-LATEST]] · Related: [[2026-11-09 Follower Update Emails]]

**Why:** The owner asked to find and drop database tables and columns the code never uses, without changing what web and mobile do. Along the way: buyer and seller chat rules, block and archive for sellers, and one account that can both buy and sell.

**Schema cleanup (migration `20261109140000_drop_unused_columns`, not applied anywhere):**
- Dropped from schema and migration: table `product_reviews`, `seller_visibility_boosts.priority_score` and `priority_tier`, `sellers_product.price_reduction_percent`.
- Ranking reliability reads `order_reviews` only (`utils/visibility-ranking/load.ts`), so AHP-TOPSIS is unchanged. The trust feedback count in `utils/trust/score.ts` no longer reads `product_reviews`; the old scratch script `src/topsis-test.ts` and its `topsis` script were deleted.
- Kept on purpose: `seller_scan_grace`, every written-but-never-read trust and delivery column, the Better Auth tables, and `conversation_participants.archived_at` and `blocked_at` (used by chat).

**Chat sides:** `GET /conversations`, `/conversations/unread-count`, `/conversations/:id` and `POST /conversations/read-all` take `as=buyer|seller`. Web sends `as=buyer`, mobile sends `as=seller`. Shared filter: `modules/conversations/services/conversation.scope.ts`. Not filtered yet: notifications, the WebSocket and sending a message.

**Block and archive:** The seller app has a block icon and an archive icon in the chat header, long-press on a chat row for both, and an Archived tab on Messages. The buyer web shows a banner instead of the message box when a chat is blocked; only the person who blocked can unblock. Web tabs row fits; the fake "2" count is gone.

**Dual roles:** New seller sign-ups get `["seller","buyer"]`. Migration `20261109150000_sellers_can_buy` adds the buyer role to every seller (not applied anywhere). Buying from your own stall stays blocked.

**Follower emails:** `jobs/email-listing-notices.ts` waits 1.1 s between sends and gives the try back on a 429.

**Verification:** `bunx tsc --noEmit` clean in backend, web and mobile; 260 backend tests pass; `backend/dist` rebuilt. The owner reported all working in the apps. Migrations still need a backup and an apply on the real database; deploy the new backend with them.
