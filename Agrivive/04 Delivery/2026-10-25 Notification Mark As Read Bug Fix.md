# 2026-10-25 Notification Mark As Read Bug Fix

## Overview
Resolved a persistent bug where the notification indicator/header continuously showed **12 unread** updates even after pressing "Mark all as read" in the mobile app.

## Root Cause
1. **Unread Boost Prompts Omission**: The database contained 12 priority visibility boost prompts for the active seller account with `read_at IS NULL`. In `useUnifiedNotifications.ts`, `markAllRead()` only invoked `sellerNotices.markAllRead()` and `sellerPromotions.markAllRead()`, completely omitting visibility boost prompts and unread conversations.
2. **Missing Backend Endpoint**: The backend had individual prompt read endpoints (`POST /boost-prompts/:id/read`), but did not provide a bulk read endpoint (`POST /boost-prompts/read-all`) or conversation bulk read (`POST /conversations/read-all`).
3. **Promotion Draft Status Restriction**: `seller.promotions.read-all.ts` previously only marked rows with `status = 'ready'`, allowing unread drafts in `queued` or `skipped` states to persist indefinitely.

## Key Changes
1. **Backend Endpoints & Services**:
   - `backend/src/modules/seller/services/seller.visibility-boost.prompts.read-all.ts`: Created service to atomically mark all boost prompts for a seller as read.
   - `backend/src/modules/seller/index/seller.visibility-boost.ts`: Registered `POST /seller/boost-prompts/read-all`.
   - `backend/src/modules/conversations/services/conversation.read-all.ts`: Created service to mark all conversations for a user as read.
   - `backend/src/modules/conversations/index/conversation.routes.ts`: Registered `POST /conversations/read-all`.
   - `backend/src/modules/seller/services/seller.promotions.read-all.ts`: Updated query to mark all unread promotion records for the seller.
2. **Mobile Client Updates**:
   - `mobile/src/features/boost/api/visibility-boosts.ts`: Exported `markAllSellerBoostPromptsRead()` and `markSellerBoostPromptRead(promptId)`.
   - `mobile/src/features/conversations/api.ts`: Exported `markAllConversationsRead()`.
   - `mobile/src/features/notifications/hooks/useUnifiedNotifications.ts`: Updated `markAllRead()` to execute notice, promotion, boost prompt, and conversation bulk-reads in parallel, and mark individual boost prompts read when their action is tapped.
   - `mobile/src/features/boost/components/BoostStatusCard.tsx`: Modularized boost card component to maintain clean file size $\le 200$ lines.
   - `mobile/app/(app)/boost/[productId].tsx`: Auto-mark prompt as read on mount when opened via `promptId`.

## Affected Files
- `backend/src/modules/seller/services/seller.visibility-boost.prompts.read-all.ts`
- `backend/src/modules/seller/index/seller.visibility-boost.ts`
- `backend/src/modules/seller/services/seller.promotions.read-all.ts`
- `backend/src/modules/conversations/services/conversation.read-all.ts`
- `backend/src/modules/conversations/index/conversation.routes.ts`
- `mobile/src/features/boost/api/visibility-boosts.ts`
- `mobile/src/features/conversations/api.ts`
- `mobile/src/features/notifications/hooks/useUnifiedNotifications.ts`
- `mobile/src/features/boost/components/BoostStatusCard.tsx`
- `mobile/app/(app)/boost/[productId].tsx`

## Verification
- `backend/`: `bunx tsc --noEmit` passed with 0 errors.
- `backend/`: `bun build src/index.ts --outdir dist --target bun` completed successfully.
- `mobile/`: `bunx tsc --noEmit` passed with 0 errors.
- Database test executed against live data:
  - Boost prompts read-all: updated 12 records.
  - Promotions read-all: updated 12 records.
  - Conversations read-all: updated 2 records.
  - Subsequent verification query returned:
    - `notifsUnread: 0`
    - `promosUnread: 0`
    - `convosUnread: 0`
    - `boostsUnread: 0`
- All modified and created files strictly adhere to the $\le 200$ lines limit.
