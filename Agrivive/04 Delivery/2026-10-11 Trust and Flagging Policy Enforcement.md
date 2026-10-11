---
title: Trust and Flagging Policy Enforcement
type: delivery-note
status: implemented; manual validation pending
date: 2026-10-11
---

# Trust and Flagging Policy Enforcement

## What changed

- Added the `monitoring-v3` policy configuration for verified inquiry non-response, seller cancellation, and low-rating signals.
- Added auditable `trust_actions` for warning, temporary restriction, and blocked states.
- Added enforcement checks for order actions, seller operations, marketplace visibility, and buyer inquiries.
- Added scheduled expiry for temporary restrictions.
- Added public blocked-account recovery through the existing Better Auth email OTP mechanism. Recovery revokes the active trust action and restores the account only after OTP verification.
- Kept admin monitoring read-only. There is no admin restore or moderation endpoint.
- Updated the API map, environment example, and Trust and Flagging note to state that weights and thresholds are prototype settings.
- Corrected the paper reference mapping for citations [54]–[58] and stored the linked references in [[Trust and Flagging]] and [[Source and Reading Guide]].

## Why

The capstone described blocking and suspension more broadly than the earlier implementation actually enforced. This change makes the implementation boundary explicit and makes the enforcement path system-controlled. It also avoids claiming that Agrivive's exact weights, thresholds, or timers are research-proven facts. User reports remain allegations until supported by verified system events or reviewed evidence.

## Affected paths

- `backend/src/db/schema.ts`
- `backend/src/modules/trust/`
- `backend/src/modules/marketplace/services/marketplace.visibility.ts`
- `backend/src/modules/marketplace/services/marketplace.product.get.ts`
- `backend/src/modules/marketplace/services/marketplace.seller.get.ts`
- `backend/src/modules/buyer/services/buyer.product.inquiry.create.ts`
- `backend/src/modules/buyer/services/buyer.order.review.create.ts`
- `backend/src/modules/buyer/services/buyer.order.product-review.create.ts`
- `backend/src/modules/seller/services/seller.order.cancel.ts`
- `backend/src/modules/seller/services/seller.notifications*.ts`
- `backend/src/modules/seller/services/seller.trust.correct.ts`
- `backend/src/utils/trust/`
- `backend/src/utils/order-access/index.ts`
- `backend/src/utils/seller-access/index.ts`
- `backend/src/jobs/run-scheduled.ts`
- `backend/API_ENDPOINTS.md`
- `backend/README.md`
- `backend/.env.example`
- `mobile/app/(auth)/account-recovery.tsx`
- `mobile/app/(auth)/login.tsx`
- `mobile/src/features/trust/api/recovery.ts`
- `mobile/src/features/trust/`

## Verification

- `bunx tsc --noEmit` passed for the backend on 2026-10-11 and after final backend changes on 2026-10-12.
- `bun build src/index.ts --outdir dist --target bun` passed on 2026-10-12.
- `bunx drizzle-kit check` passed on 2026-10-12.
- `bun run typecheck` passed for the mobile app on 2026-10-12.
- Manual endpoint acceptance remains pending. Validate request, restriction, expiry, OTP recovery, and read-only admin behavior against a development database.

## Reference correction

- [54] reputation effects → [Jiao et al. meta-analysis](https://research-portal.uu.nl/en/publications/reputation-effects-in-peer-to-peer-online-markets-a-meta-analysis/)
- [55] fake/manipulated reviews → [He et al., INFORMS](https://pubsonline.informs.org/doi/abs/10.1287/mksc.2022.1353?journalCode=mksc)
- [56] purchase verification → [Kokkodis et al., Wiley](https://onlinelibrary.wiley.com/doi/abs/10.1111/poms.13731)
- [57] weighted trust evaluation → [Chu and Chen, Inderscience](https://www.inderscience.com/info/e_inarticle.php?artid=132356)
- [58] vegetable postharvest/time sensitivity → [Jiang et al., MDPI Agronomy](https://www.mdpi.com/2073-4395/9/11/724)

The original supplied capstone PDF is not modified. The corrected, paper-ready wording is stored in [[Trust and Flagging]].
