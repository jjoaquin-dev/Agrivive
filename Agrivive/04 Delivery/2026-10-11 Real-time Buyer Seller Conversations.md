# Real-time Buyer–Seller Conversations

Date: 2026-10-11
Status: Messenger-style implementation complete; owner two-user acceptance pending

## What changed

Agrivive's Communication feature now uses persistent conversation threads instead of a single question and single reply. A buyer and seller can continue sending messages in the same product or order conversation. Messages are stored in PostgreSQL and delivered through an authenticated WebSocket while both participants are online. REST endpoints remain available for history, sending, read state, and recovery after reconnect.

The web communication surface now follows a Messenger-style layout. Buyers can open a conversation from a product page or a seller storefront, browse a searchable inbox, read message bubbles in a dedicated thread, and send follow-up questions such as a request for the latest product picture.

Existing `product_inquiries` and `order_inquiries` remain in place for trust and response-deadline behavior. The migration backfills their existing questions and replies into the new conversation message history.

## Why

The signed proposal requires Communication to be a real buyer–seller conversation. The earlier implementation only supported one question and one reply, which was not sufficient for the panel's expected messaging behavior.

## Backend behavior

- `POST /conversations` starts a buyer conversation for a public product or active order.
- `GET /conversations` lists the signed-in user's conversations and unread counts.
- `GET /conversations/:id/messages` loads message history.
- `POST /conversations/:id/messages` stores additional messages and broadcasts them to connected participants.
- `POST /conversations/:id/read` records the participant's read time.
- `GET /ws/conversations?conversationId=<uuid>` authenticates the participant and delivers `conversation.message.created` events in real time.
- `POST /conversations` also accepts a seller-level conversation, allowing a buyer to message a storefront before choosing a particular product.
- A client message ID prevents duplicate messages when a mobile device retries after a connection interruption.
- WebSocket clients must still recover history through REST after reconnecting.

## Messenger-style web behavior

- `/messages` now renders a two-pane inbox on desktop: searchable conversation list on the left and the selected message thread on the right.
- Narrow screens show one pane at a time with a back button from the thread to the inbox.
- Product pages include `Message seller` entry points that open `/messages?productId=<uuid>`.
- Seller storefronts include `Message seller` entry points that open `/messages?sellerId=<seller-id>`.
- New conversations display a product or seller context card and quick prompts for the latest picture and availability.
- The first message creates the conversation; opening a new draft does not create an empty database row.
- Existing product, order, and seller conversations use the same authenticated WebSocket thread behavior.
- The current implementation sends text messages. Actual photo attachments require a separate storage and message-attachment design.

## Affected paths

### Backend

- `backend/src/db/schema.ts`
- `backend/drizzle/20261011140921_conversation_messaging/migration.sql`
- `backend/drizzle/20261011170000_seller_conversation_context/migration.sql`
- `backend/src/index.ts`
- `backend/src/modules/conversations/index.ts`
- `backend/src/modules/conversations/index/conversation.routes.ts`
- `backend/src/modules/conversations/model/conversation.ts`
- `backend/src/modules/conversations/services/conversation.create.ts`
- `backend/src/modules/conversations/services/conversation.list.ts`
- `backend/src/modules/conversations/services/`

### Web

- `web/src/features/conversations/api.ts`
- `web/src/features/conversations/types.ts`
- `web/src/features/conversations/hooks/useConversationThread.ts`
- `web/src/features/conversations/components/BuyerConversations.tsx`
- `web/src/features/conversations/components/ConversationList.tsx`
- `web/src/features/conversations/components/ConversationThread.tsx`
- `web/src/features/conversations/components/ConversationContextCard.tsx`
- `web/app/messages/page.tsx`
- `web/src/features/marketplace/components/ProductQuestionsSection.tsx`
- `web/src/features/marketplace/components/MessageSellerButton.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`
- `web/src/features/marketplace/components/SellerStorefrontHeader.tsx`
- `web/src/features/orders/components/OrderMessages.tsx`
- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/components/BuyerSiteHeaderNav.tsx`

### Mobile

- `mobile/src/features/conversations/types.ts`
- `mobile/src/features/conversations/api.ts`
- `mobile/src/features/conversations/hooks/useSellerConversations.ts`
- `mobile/app/(app)/messages.tsx`
- `mobile/app/(app)/conversations/[id].tsx`

## Verification performed

- `backend`: `bunx tsc --noEmit` passed.
- `backend`: `bunx drizzle-kit check` passed.
- `backend`: `bun build src/index.ts --outdir dist-conversation-check --target bun` passed.
- `backend`: `bunx drizzle-kit migrate` applied `20261011170000_seller_conversation_context` successfully.
- `web`: `bunx tsc --noEmit` passed.
- `web`: `bun run build` passed with elevated workspace file access after adding the required Suspense boundary for `/messages`.
- `web`: final route output included `/messages`, `/marketplace/[id]`, and `/orders/[id]` conversation entry points.
- `mobile`: `bun run typecheck` passed.
- `mobile`: `bunx expo export --platform android --no-bytecode` passed.
- Database migration `20261011140921_conversation_messaging` applied successfully to the configured PostgreSQL database.
- Local `GET /health` returned `200` with `{ "status": "ok" }`.
- Local unauthenticated `GET /conversations` returned `401`.
- Local `GET /openapi/json` returned `200` and included the conversation routes.

## Owner acceptance still required

Use a buyer browser session and a seller mobile session to verify:

1. Buyer starts a product conversation.
2. Seller receives the message without refreshing.
3. Seller sends a reply.
4. Buyer receives the reply without refreshing.
5. Both participants can send follow-up messages.
6. Closing and reopening the screen preserves the full history.
7. A temporary reconnect does not duplicate a message.
8. A user cannot open another user's conversation.

No commit was created in this delivery.
