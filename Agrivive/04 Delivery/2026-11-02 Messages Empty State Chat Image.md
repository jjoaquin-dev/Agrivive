---
title: Messages Empty State Chat Image
date: 2026-11-02
type: changelog
---

# Messages Empty State Chat Image

## What changed

- The "Choose a conversation" empty state on the buyer Messages page shows the green chat-bubble illustration instead of the ✦ glyph in a green square.
- The white background was removed with the same edge flood fill used for the cart and orders images.

## Files

- `web/public/brand/empty-chat-bubble.png` (new, 1133×765)
- `web/src/features/conversations/components/BuyerConversations.tsx` (glyph replaced with `next/image`, import added)

## Verification

- `bun run typecheck` in `web/` passed.
- The image URL serves HTTP 200.
- Browser pane: the image shows in the empty state on `/messages` (desktop width).
- Not checked: phone width.
