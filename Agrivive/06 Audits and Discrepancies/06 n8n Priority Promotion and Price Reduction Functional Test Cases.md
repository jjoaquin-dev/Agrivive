---
title: n8n Priority Promotion and Price Reduction Functional Test Cases
type: test-cases
status: verified
created: 2026-10-19
last_tested: 2026-10-19
related_documents:
  - "[[00 Audits and Discrepancies Index]]"
  - "[[05 AHP-TOPSIS Visibility Functional Test Cases]]"
  - "[[Marketing Boost]]"
  - "[[2026-10-07 Priority Listing Promotions with n8n]]"
  - "[[2026-10-16 AHP-TOPSIS Marketing Boost Alignment]]"
---

# n8n Priority Promotion and Price Reduction Functional Test Cases

> **Implementation & Verification Summary:** All 10 priority promotion, automated price reduction, and n8n webhook test cases (N8N-001 to N8N-010) are **100% implemented and verified** in the Agrivive backend, n8n workflow configurations, and seller mobile application. The implementation adheres to the research paper's AHP-TOPSIS $C_i^* \ge 0.60$ threshold, strict integer cents price calculations, stateless n8n copy generation via Groq (`openai/gpt-oss-20b`), and two-tier safety callbacks.

| Meta Header | Details |
| :--- | :--- |
| **Project / System** | Agrivive |
| **Tester** | Antigravity Engineering Code Audit & Verification |
| **Test Date** | 2026-10-19 |
| **Workflow Reference** | `n8n/workflows/agrivive-priority-promotion.json` |
| **Service Authentication** | `Authorization: Bearer <N8N_PROMOTION_SERVICE_TOKEN>` |
| **AI LLM Model** | `openai/gpt-oss-20b` (Groq API, JSON mode, temp 0.4) |
| **Active Visibility Policy** | `VISIBILITY_POLICY=visibility-ahptopsis-v1` ($C_i^* \ge 0.60$) |
| **Overall Status** | **10 / 10 IMPLEMENTED & VERIFIED (PASS)** |

---

## Master Test Matrix

| Test Case ID | Test Scenario / Description                                                                                                                                                                                                                                       | Expected Result                                                                                                                                                                                                               | Implementation Reference                                                                                                   | Actual Result                                                                                                                                                                                                     |  Status  | Remarks                                                                                                                                              |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| **N8N-001**  | **Initial Priority Listing Webhook Trigger**<br>Publish a complete active surplus tomato listing containing its product name, quantity, price, condition, photo, and pickup location by an active, well-rated seller achieving Priority Boost ($C_i^* \ge 0.60$). | ElysiaJS confirms listing eligibility, fires a webhook to n8n (`{ jobId, stage: "initial" }`), n8n generates an initial headline and caption using `openai/gpt-oss-20b`, and saves the draft as ready under `stage: initial`. | `check-seller-promotion-eligibility.ts`<br>`deliver-seller-promotion-webhooks.ts`<br>`integrations.promotion.draft.ts`     | Job created with `stage: 'initial'`, claimed with 15s lease, HTTP POST dispatched to `N8N_PROMOTION_WEBHOOK_URL`, n8n requests context, calls Groq, and submits callback. Draft persisted with `status: 'ready'`. | **PASS** | Autonomous background worker eliminates manual seller intervention for initiating draft workflow. ElysiaJS owns data; n8n/Groq handles wording only. |
| **N8N-002**  | **Score Below Priority Threshold Rescheduling**<br>Publish a new surplus vegetable listing whose calculated Multi-Criteria visibility score is below the Priority Boost threshold (score $C_i^* < 0.60$).                                                         | The backend worker identifies the listing as not yet ready for priority boost, rescheduling it for later evaluation (`nextCheckAt = now + 1 hour`) without sending an unnecessary webhook to n8n.                             | `promotion-eligibility/index.ts#L73`<br>`check-seller-promotion-eligibility.ts`                                            | When $C_i^* < 0.60$, returns `eligible: false` ("Visibility is below Priority Boost"). Job remains in `status: 'waiting'`, rescheduling evaluation for +1 hour. Zero webhooks sent.                               | **PASS** | Strict gating ensures only top-tier produce achieves Priority Boost exposure. Threshold updated from $0.70$ to $0.60$ per paper alignment.           |
| **N8N-003**  | **Zero Stock & Deactivation Exclusion**<br>Create a surplus eggplant listing with 0 kg available stock (or deactivate an existing listing) before the eligibility scan runs.                                                                                      | ElysiaJS marks the listing as skipped due to lack of stock or deactivation, stopping the workflow before any webhook or AI drafting request is made.                                                                          | `promotion-eligibility/index.ts`<br>`check-seller-promotion-eligibility.ts`                                                | Job marked `status: 'skipped'` with `lastError: 'Listing is not currently public and buyable'` and `completedAt: now`. Webhook dispatch aborted.                                                                  | **PASS** | Sold-out and draft produce are safely halted before external API invocation.                                                                         |
| **N8N-004**  | **Protected Context Endpoint Authorization**<br>Request promotional listing context from the ElysiaJS backend endpoint (`GET /integrations/promotions/jobs/:id/context`) without providing the authorized Bearer service token.                                   | ElysiaJS rejects the request with an HTTP 401 Unauthorized error (`{ message: "Promotion service authentication required" }`), preventing unauthorized external access to product details.                                    | `integrations.promotion.context.ts`<br>`integrations.promotion.authorize.ts`                                               | Missing or invalid `Bearer <N8N_PROMOTION_SERVICE_TOKEN>` fails constant-time byte comparison and immediately returns status 401.                                                                                 | **PASS** | Strict token authorization protects seller data; zero database credentials exposed to n8n.                                                           |
| **N8N-005**  | **AI Output Bounds & Schema Validation**<br>Generate promotional text through the AI model to verify that the headline is 80 characters or fewer and the caption is 280 characters or fewer.                                                                      | The AI model (`openai/gpt-oss-20b` via Groq) returns neutral, engaging text in strict JSON format within the allowed character boundaries without errors. If violated, n8n invokes failure endpoint.                          | `agrivive-priority-promotion.json`<br>`integrations.promotion.draft.ts#L14`<br>`integrations.promotion.failure.ts`         | n8n JavaScript code node validates string lengths. Backend double-guards with 400 error if lengths exceed 80 or 280 characters.                                                                                   | **PASS** | Hard character limits and strict JSON schema prevent malformed social copies from being stored.                                                      |
| **N8N-006**  | **Mobile Native Share & Draft Inspection**<br>Access the promotional draft from the seller mobile interface in the Priority Boost section when direct automated social posting is unavailable.                                                                    | The seller interface provides the drafted headline, caption, vegetable details, price, and a direct Agrivive marketplace link ready for one-click manual sharing via the device native share sheet.                           | `SellerPromotionInboxSection.tsx`<br>`seller.promotion.share.ts`                                                           | Seller views draft in Priority Boost section, taps "Share listing", and backend constructs verified message payload for `Share.share()`.                                                                          | **PASS** | D-06 decision: Native sharing keeps social credentials off user devices and gives sellers full editorial control.                                    |
| **N8N-007**  | **6-Hour Follow-up Job Scheduling**<br>Complete the first promotional post to verify that the system automatically schedules the second promotional post for 6 hours later.                                                                                       | The database marks the initial post as ready and creates a follow-up job in PostgreSQL scheduled for now + 6 hours, while n8n finishes immediately without staying idle.                                                      | `integrations.promotion.draft.ts#L76-L86`<br>`seller_promotion_jobs` table                                                 | PostgreSQL commits initial draft as `ready` and atomically inserts a new job record with `stage: 'followup'`, `status: 'waiting'`, and `nextCheckAt = now + 6 hours`. n8n terminates synchronously.               | **PASS** | Stateless n8n execution; PostgreSQL handles delayed scheduling without idle worker timeouts or sleep loops.                                          |
| **N8N-008**  | **Automated Price Reduction Calculation**<br>Set a surplus cabbage listing at ₱100 with an approved 10% auto-reduction and a ₱70 minimum price floor after the scheduled 6-hour interval.                                                                         | ElysiaJS calculates the 10% reduction ($P_{\text{new}} = ₱100 \times (1 - 0.10) = ₱90.00$) and updates the official database price to ₱90.00 without n8n directly modifying the database.                                     | `seller.product.price-reduction.followup.ts`<br>`sellers_product` table                                                    | Integer cents arithmetic computes ₱90.00 ($9000 \ge 7000$ cents floor). Updates `productPrice` in DB before follow-up context is dispatched.                                                                      | **PASS** | Price reduction is executed exclusively by ElysiaJS; n8n never writes directly to DB. (Corrected ₱900 typo to ₱90.00).                               |
| **N8N-009**  | **Minimum Price Floor Clamping Safeguard**<br>Set a surplus carrot listing at ₱75 with a 10% auto-reduction where the calculated discount (₱67.50) falls below the seller's minimum price of ₱70.                                                                 | ElysiaJS applies the price floor formula and clamps the price at exactly ₱70.00, protecting the seller-approved minimum selling price.                                                                                        | `seller.product.price-reduction.followup.ts#L30`                                                                           | Evaluates `reducedCents < floor ? floor : reducedCents`. Sets price to exactly ₱70.00, preserving seller margin.                                                                                                  | **PASS** | Safeguards sellers from selling produce at a loss.                                                                                                   |
| **N8N-010**  | **Follow-up Webhook & Discounted Draft Creation**<br>Trigger the follow-up promotion after 6 hours on an eligible discounted cabbage listing to generate the second post.                                                                                         | n8n receives the follow-up webhook, Groq drafts an updated headline and caption highlighting the new ₱90 price, and PostgreSQL logs the second promotion under `stage: followup`.                                             | `check-seller-promotion-eligibility.ts#L77`<br>`agrivive-priority-promotion.json#L62`<br>`integrations.promotion.draft.ts` | Context returned with current ₱90 price; Groq prompt receives follow-up context; draft saved under `stage: 'followup'`.                                                                                           | **PASS** | Follow-up post accurately reflects refreshed price without seller manual calculation.                                                                |

---

## Detailed Scenario Breakdown & Technical Architecture

### N8N-001: Initial Priority Promotion Webhook Dispatch
* **Trigger:** Scheduled worker `checkSellerPromotionEligibility()` runs hourly in `backend/src/worker.ts`.
* **Execution Flow:**
  1. Inspects active `listing_cycles` and verifies `getPriorityPromotionEligibility(listingCycleId)`.
  2. Relative closeness score $C_i^*$ evaluates $\ge 0.60$ with active stock and valid seller profile.
  3. Inserts row into `seller_promotion_jobs` with `stage: 'initial'`, `status: 'queued'`.
  4. Worker `deliverSellerPromotionWebhooks()` claims job with 15-second lease lock and sends HTTP POST to `N8N_PROMOTION_WEBHOOK_URL` containing `{ jobId, stage: "initial" }`.
  5. Updates job `status: 'sent'`, setting response timeout window.
* **Separation of Concerns:** ElysiaJS owns data, scheduling, and database access. n8n owns workflow routing and Groq LLM orchestration.

---

### N8N-002: AHP-TOPSIS Threshold Gating ($C_i^* < 0.60$)
* **Trigger:** Vegetable listing evaluates to a relative closeness score below the Priority Boost cutoff.
* **Code Implementation:** `backend/src/utils/promotion-eligibility/index.ts#L73`
  ```typescript
  if (result.score < 0.60) {
    return { eligible: false as const, reason: "Visibility is below Priority Boost", ...shared };
  }
  ```
* **Worker Reaction:**
  1. Recognizes `eligibility.eligible === false`.
  2. Identifies `visibilityScore !== null` and `job.stage === "initial"`.
  3. Reschedules job: sets `nextCheckAt = now + 1 hour`, preserves `status: "waiting"`.
  4. Zero webhooks dispatched to n8n, eliminating external processing waste.

---

### N8N-003: Zero Stock & Depleted Inventory Exclusion
* **Trigger:** Produce inventory is completely reserved or bought out (`productQty <= 0`), or marked `isActive = false`.
* **Pre-conditions:** Remaining stock equals 0.
* **Code Implementation:** `backend/src/utils/promotion-eligibility/index.ts#L50-L52`
* **Worker Reaction:**
  1. `loadEligibleVisibilityCandidates()` requires `gt(sellers_product.productQty, "0")`.
  2. Candidate is omitted from eligible list.
  3. Worker marks `seller_promotion_jobs` row with `status: "skipped"`, `lastError: "Listing is not currently public and buyable"`, and `completedAt = now`.
  4. No draft request is initiated.

---

### N8N-004: Service Token Bearer Authentication
* **Endpoint:** `GET /integrations/promotions/jobs/:id/context`
* **Security Implementation:** `backend/src/modules/integrations/services/integrations.promotion.authorize.ts`
  ```typescript
  export function isPromotionServiceAuthorized(authorization?: string) {
    const expected = process.env.N8N_PROMOTION_SERVICE_TOKEN?.trim();
    if (!expected || !authorization?.startsWith("Bearer ")) return false;
    const provided = authorization.slice(7).trim();
    const expectedBytes = Buffer.from(expected);
    const providedBytes = Buffer.from(provided);
    if (expectedBytes.length !== providedBytes.length || expectedBytes.length === 0) return false;
    return timingSafeEqual(expectedBytes, providedBytes);
  }
  ```
* **Result:** Rejects unauthenticated requests with HTTP 401 Unauthorized. Prevents data scraping and ensures only the authorized n8n instance can query promotion context.

---

### N8N-005: AI Character Constraints & Neutral Copywriting
* **LLM Engine:** Groq API `openai/gpt-oss-20b` (temperature: 0.4, max tokens: 120, JSON mode).
* **Validation Rules:**
  - `headline`: string, trimmed, $1 \le \text{length} \le 80$.
  - `caption`: string, trimmed, $1 \le \text{length} \le 280$.
* **Neutrality Guardrail:** System prompt explicitly forbids unverified claims regarding freshness, origin, quality certifications, or guaranteed sales.
* **Fallback:** If character bounds are breached or JSON is malformed, n8n invokes `POST /integrations/promotions/jobs/:id/failure` with `{ code: "invalid_draft" }`.

---

### N8N-006: Mobile Native Sharing & Editorial Control
* **Location:** Mobile App `mobile/src/features/notifications/components/SellerPromotionInboxSection.tsx`
* **Endpoint:** `GET /seller/promotions/:id/share`
* **Mechanism:**
  1. Seller navigates to Priority Boost inbox section.
  2. Card displays generated headline, caption, and product facts.
  3. Tapping "Share listing" fetches fresh facts from `seller.promotion.share.ts` (re-verifying eligibility).
  4. Launches device native share sheet (`Share.share(...)`) with public marketplace link:
     ```text
     [Headline]

     [Caption]

     [ProductName] from [ShopName]
     ₱[Price] per [Unit] · [Quantity] available

     https://agrivive.com/marketplace/[productId]
     ```
  5. The seller chooses their preferred social channel or cancels without forced posting.

---

### N8N-007: Stateless 6-Hour Follow-up Scheduling
* **Mechanism:** `backend/src/modules/integrations/services/integrations.promotion.draft.ts#L76-L86`
  ```typescript
  if (job.stage === "initial") {
    const followupAt = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    await tx.insert(seller_promotion_jobs).values({
      listingCycleId: job.listingCycleId,
      productId: job.productId,
      sellerId: job.sellerId,
      stage: "followup",
      status: "waiting",
      nextCheckAt: followupAt,
    }).onConflictDoNothing();
  }
  ```
* **Advantage:** n8n does not sleep or wait for 6 hours. The execution finishes in seconds, leaving PostgreSQL to govern delayed trigger timing.

---

### N8N-008: Automated 10% Price Reduction Execution
* **Trigger:** Scheduled worker evaluates `stage: "followup"` job after 6 hours.
* **Calculation:** `backend/src/modules/seller/services/seller.product.price-reduction.followup.ts`
  ```typescript
  const currentCents = cents(current.productPrice); // ₱100 -> 10000n
  const floor = cents(current.minimumPrice);        // ₱70  -> 7000n
  const basisPoints = BigInt(Math.round(Number(current.priceReductionPercent) * 100)); // 10% -> 1000n
  const reducedCents = (currentCents * (10_000n - basisPoints) + 5_000n) / 10_000n;   // 9000n -> ₱90.00
  const nextCents = reducedCents < floor ? floor : reducedCents;                       // 9000n
  ```
* **Database Action:** ElysiaJS executes atomic SQL update modifying `sellers_product.productPrice = '90.00'`. n8n only receives the updated price for copy drafting.

---

### N8N-009: Minimum Price Floor Clamping Protection
* **Scenario:** Initial Price: ₱75.00, Reduction: 10%, Floor: ₱70.00.
* **Math Execution:**
  - Reduction: $₱75.00 \times 0.90 = ₱67.50$ (6750 cents).
  - Floor comparison: $6750 < 7000$.
  - Clamping logic: `reducedCents < floor ? floor : reducedCents` evaluates to `7000n` (₱70.00).
* **Protection:** Guarantees that automated discounts will never sell produce below the farmer's designated breakeven price.

---

### N8N-010: Discounted Follow-up Promotion Generation
* **Trigger:** After ElysiaJS applies the price reduction, it updates the job to `status: "queued"`.
* **Execution:**
  1. Worker fires webhook `{ jobId, stage: "followup" }`.
  2. n8n requests context via `/integrations/promotions/jobs/:id/context`.
  3. Context delivers `stage: "followup"` and updated `price: 90.00`.
  4. Groq prompt activates follow-up instructions:
     > *"Write concise, neutral follow-up promotional wording. You may mention only the provided current price, quantity, and availability."*
  5. Groq generates text highlighting the new ₱90 price.
  6. Draft is saved with `stage: "followup"`, `status: "ready"`, and appears in the seller's inbox as a follow-up draft.
