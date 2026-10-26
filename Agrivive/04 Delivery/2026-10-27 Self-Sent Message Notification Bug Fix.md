# 2026-10-27 Self-Sent Message Notification Bug Fix

## Overview
Resolved a bug in the mobile notification pipeline where sellers received local phone notifications for messages they sent to buyers ("New message from Buyer: [seller's own reply]").

## Root Cause
1. `backend/src/modules/conversations/services/conversation.list.ts` previously returned `lastMessageBody` without indicating `lastMessageSenderId`.
2. `mobile/src/features/notifications/hooks/useNotificationWatcher.ts` triggered notifications whenever `convo.lastMessageBody` changed and unread counts were non-zero, erroneously assuming the latest message was always authored by the buyer.

## What Changed
1. **Backend Conversation Service (`backend/src/modules/conversations/services/conversation.list.ts`)**:
   - Added `lastMessageSenderId` subquery selecting the `sender_id` of the latest conversation message.
2. **Mobile DTO Type (`mobile/src/features/conversations/types.ts`)**:
   - Added `lastMessageSenderId?: string | null` to the `Conversation` type definition.
3. **Notification Watcher (`mobile/src/features/notifications/hooks/useNotificationWatcher.ts`)**:
   - Added validation: `convo.lastMessageSenderId !== currentUserId`.
   - Notifications are now strictly suppressed when the seller sends a message, ensuring the seller is only alerted when a buyer chats with them.

## Affected Files
- `backend/src/modules/conversations/services/conversation.list.ts`
- `backend/dist/index.js`
- `mobile/src/features/conversations/types.ts`
- `mobile/src/features/notifications/hooks/useNotificationWatcher.ts`

## Verification
- `backend`: `bunx tsc --noEmit` and `bun build` passed with 0 errors.
- `mobile`: `bun run typecheck` passed with 0 errors.
- All files strictly adhere to the $\le 200$ line constraint.
