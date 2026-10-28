# 2026-10-28 Merge Conflict Resolution (Git Pull)

## Overview
Resolved git merge conflicts resulting from pulling remote upstream changes into the `ui-enhancements` branch.

## Conflicts & Resolution
1. **`backend/src/modules/seller/services/seller.product.create.ts`**:
   - Local changes had added buyer listing notifications (`sendSellerListingNotices`) for users who follow the seller.
   - Incoming changes had added an n8n webhook notification for newly published listings (`N8N_SELLER_FLOW_WEBHOOK_URL`).
   - Merged both branches to preserve both buyer notifications and the n8n webhook call.
2. **`backend/dist/index.js`**:
   - Rebuilt cleanly from source with `bun build src/index.ts --outdir dist --target bun`.

## Commit Details
- **Commit Hash**: `75d33aeb`
- **Commit Message**: `Merge branch 'origin/main' into ui-enhancements`

## Verification Performed
- Ran `cd backend; bunx tsc --noEmit` -> Passed with 0 TypeScript errors.
- Ran `cd backend; bun build src/index.ts --outdir dist --target bun` -> Succeeded in 264ms.
- Ran `cd web; bunx tsc --noEmit` -> Passed with 0 TypeScript errors.
