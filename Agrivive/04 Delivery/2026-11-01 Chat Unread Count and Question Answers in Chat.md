---
title: Chat Unread Count and Question Answers in Chat
type: delivery
date: 2026-11-01
status: code complete, owner tests pending
---

# Chat Unread Count and Question Answers in Chat

## Why

- The Messages tab badge counted unanswered reservation questions, not unread chats.
- The chat screen could only find its chat in page 1 of the list.
- The Questions tab had no count.
- Answering a product-page question did not show up in the buyer's chat.

## What changed (backend only, no migration)

- **B1** `GET /conversations/unread-count` returns `{ unreadMessages, unreadConversations }` from one SQL aggregate (`conversation.unread-count.ts`). Registered before `/conversations/:id`.
- **B2** `GET /conversations/:id` returns one chat in the same shape as a list item; not a participant gives 404 "Conversation not found". The big select and joins moved to `conversation.select.ts` (`buildConversationSelect`); the avatar link step to `conversation.present.ts`. `GET /conversations` uses them and returns the same result as before.
- **B3** `GET /seller/product-inquiries` adds `openCount` (all of the seller's unanswered product questions, whatever the status filter).
- **B4** `POST /seller/product-inquiries/:id/reply`, in the same transaction, finds or creates the buyer and seller chat (`conversation.direct.find-or-create.ts`), posts the answer as a seller message with `clientMessageId = inquiry-answer:<id>` (skipped if it already exists), marks it read for the seller, queues a `buyer_message` notification, and after commit publishes it to open chats. The response adds `conversationId`.

## Checked against the code

The spec matched. One detail: `conversation.create.ts` looks up an existing chat by buyer and seller, while B4 looks it up by `contextKey` (`direct:{buyer}:{seller}`). Both mean the same chat because that key is unique and always built this way. `conversation.create.ts` was not changed. No response schema existed for the inquiry list, so there was no model to update.

## Files

`backend/src/modules/conversations/`: `index/conversation.routes.ts`; `services/` `conversation.select.ts`, `conversation.present.ts`, `conversation.get.ts`, `conversation.unread-count.ts`, `conversation.direct.find-or-create.ts` (new); `conversation.list.ts` (now 37 lines).
`backend/src/modules/seller/services/`: `seller.product.inquiry.list.ts`, `seller.product.inquiry.reply.ts`.
Docs: `backend/API_ENDPOINTS.md` (new Conversations section, openCount, answer posted in chat). `README.md` does not describe conversations, so it is unchanged.

## Verification

`bunx tsc --noEmit`, `bun build` for `src/index.ts` and `src/worker.ts`, and `bunx drizzle-kit check` passed. `dist/index.js` shows as modified in git (tracked); `dist/worker.js` is unchanged. Nothing tested against a database.

## Manual tests for the owner

1. `GET /conversations/unread-count` with a seller session: 200 `{ "unreadMessages": 3, "unreadConversations": 2 }`. After `POST /conversations/:id/read` on one of them, the numbers drop.
2. `GET /conversations/{id}` with an id from the list: 200, same fields as that list item. An id from another seller: 404 "Conversation not found". `GET /conversations` still returns the same list.
3. `GET /seller/product-inquiries?status=all`: 200 `{ items, nextCursor, openCount }`; `openCount` equals the number of unanswered questions.
4. `POST /seller/product-inquiries/{id}/reply` with `{ "reply": "About 5 bundles per pile." }`: 200. Then `GET /conversations/{buyer chat id}/messages` ends with `About your question on Pechay: "How many bundles…"` and the reply from the seller. The buyer gets a `buyer_message` notification and an open buyer chat shows it live.
5. The same reply again: 409 "Product inquiry already answered", and no second chat message.
6. A buyer who asked only from the web product form (no chat yet): the reply creates the chat, and it appears in `GET /conversations` for both users.
