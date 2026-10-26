# 2026-10-27 PR 31 Merge Conflict Resolution

## Overview
Resolved git merge conflicts between branch `ui-enhancements` and `main` for Pull Request #31 across backend and web modules.

## Conflicts Resolved
1. **`backend/src/modules/conversations/services/conversation.create.ts`**:
   - Merged `main`'s unified direct conversation lookup (`direct:${buyerId}:${sellerId}`) and thread re-use logic while setting `lastReadAt: now` for the sender from `ui-enhancements`.
2. **`backend/src/modules/conversations/services/conversation.list.ts`**:
   - Combined `main`'s `coalesce` fallback to `ordered_items` for order inquiry cards and `lastMessageSenderId` with `ui-enhancements`'s `productPrice`, `scalingType`, and `productQty` fields.
3. **`web/src/features/home/components/HomeFooter.tsx`**:
   - Preserved both the Market Map link and the Seller App APK download link with unified `#FCEC9A` styling.
4. **`web/src/features/home/components/HomeSellerSection.tsx`**:
   - Preserved dual action buttons ("Download Seller App (APK)" + "Create a seller account") with responsive spacing and accessible labels.
5. **`backend/dist/index.js`**:
   - Recompiled cleanly via `bun build src/index.ts --outdir dist --target bun` and `bun build src/worker.ts --outdir dist --target bun`.

## Affected Files
- `backend/src/modules/conversations/services/conversation.create.ts`
- `backend/src/modules/conversations/services/conversation.list.ts`
- `web/src/features/home/components/HomeFooter.tsx`
- `web/src/features/home/components/HomeSellerSection.tsx`
- `backend/dist/index.js`
- `backend/dist/worker.js`

## Verification
- Backend typecheck (`cd backend && bunx tsc --noEmit`): 0 errors.
- Web typecheck (`cd web && bun run typecheck`): 0 errors.
- Mobile typecheck (`cd mobile && bun run typecheck`): 0 errors.
- GitHub PR #31 Status: `MERGEABLE` (no merge conflicts).

## Commit
- **Hash:** `3b00474`
- **Message:** `Merge branch 'main' into ui-enhancements (resolved merge conflicts)`
