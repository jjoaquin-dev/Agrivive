---
title: Marketing Boost
type: mechanism
status: implemented-prototype
source_pages: [14, 15]
---

# Marketing Boost

## Purpose

Prepare promotional material and alerts for active surplus listings while keeping listing facts under backend control. Priority results from the paper-aligned AHP–TOPSIS Visibility Engine may trigger extra exposure; promotion does not guarantee that buyers will view, reserve, or purchase a listing.

## Implemented beta workflow

1. The backend creates durable promotion jobs for listing cycles created after rollout. Existing cycles are marked historical in the migration.
2. The single backend worker checks initial jobs hourly with `visibility-ahptopsis-v1`. It ranks all currently eligible active surplus listings together using Freshness (40%), Stock Availability (30%), Seller Reliability (20%), and Historical Surplus Recurrence (10%). A listing qualifies for Priority Boost only at `Ci* >= 0.60`, while it is still the current cycle, active, marketable, in stock, and publicly visible through a valid seller profile.
3. When eligible, the worker sends n8n only the job ID and stage. n8n fetches the latest public context through a protected backend route and asks Groq for a short, neutral headline and caption.
4. The backend rechecks current eligibility before accepting the callback. Duplicate delivery/callbacks do not create duplicate drafts. Delivery retries are bounded and terminal failures are recorded.
5. The seller reviews the generated wording in the mobile Priority Boost inbox. The native share sheet receives current backend product, shop, price, quantity, and listing-link facts. The seller chooses a destination or cancels.
6. Six hours after an initial draft becomes ready, the backend checks the same listing cycle again. If it remains eligible, ElysiaJS applies one configured percentage price reduction toward the seller's minimum price, updates PostgreSQL, and queues no more than one follow-up with refreshed listing facts. The follow-up does not depend on opening or sharing the initial draft.

The scheduled draft flow above does not post automatically, notify buyers, change seller prices, or connect social accounts. Seller-initiated social publishing is a separate, explicit confirmation flow described below; it does not change the backend worker's hourly and six-hour eligibility checks.

## Seller-confirmed visibility boost workflow

The paper's seller flow is implemented as a separate, explicit action from the read-only visibility score:

1. After a seller adds an active, marketable listing, the mobile app asks, **"Boost Visibility?"**.
2. If the seller chooses **Boost now**, the backend records one idempotent boost for the current listing cycle and queues an n8n webhook. The webhook receives only the boost ID and reason; n8n fetches the current price, quantity, photo, seller, and listing link through the protected backend context route before posting to the configured social destination.
3. If the seller chooses **Not now**, the listing remains active and the Boost Visibility action remains available from seller analytics.
4. At each configured 12-hour price-reduction point, the scheduled worker applies the reduction only while the listing remains active, marketable, and in stock. It then creates one seller boost prompt for that reduction period and queues a seller push notification.
5. The seller may choose **Boost now** or **Not now** from the prompt. A confirmed prompt queues another idempotent n8n webhook using the updated price and current availability.

Seller confirmation is the trigger for social posting. The AHP–TOPSIS score determines promotional priority; it does not confirm food safety, freshness, quality, or a completed sale. Safety checks still reject inactive, non-marketable, sold-out, incomplete, or unauthorized listings.

## Existing scheduled-draft social publishing

The existing Marketplace Visibility Guide remains available for the scheduled-draft flow. For that flow, the backend rechecks Priority eligibility and prepares editable copy for Agrivive's Facebook Page, linked Instagram Professional account, and X account. The seller selects available official destinations, reviews/edits copy, and confirms posting. TikTok and seller-owned account linking are not part of this release.

Provider credentials stay in the backend environment. n8n receives only the campaign ID, then selected platform names, and asks the backend to publish each destination; it never receives provider tokens or directly calls social platform APIs. The backend returns per-channel results, and retries only channels that failed. The public Agrivive media URL serves the current eligible listing photo from private S3.

Live publishing for scheduled drafts depends on valid backend credentials, Meta and X write permissions, a public HTTPS backend, the social publishing migration, and the n8n workflow/credentials. The paper-aligned Priority Boost threshold (`visibility-ahptopsis-v1`, `Ci* >= 0.60`) is enforced for scheduled drafts. The separate seller-confirmed Boost Visibility flow uses the safety checks and explicit seller confirmation described above.

## Responsibility boundaries

- **Backend:** source of truth for AHP–TOPSIS eligibility, the comparison population, current listing status, price-reduction timing and calculation, boost authorization, idempotency, retries, fresh listing facts, and seller prompts.
- **n8n:** receives a promotion job, fetches the protected current context, and coordinates drafting or supported sharing. It does not calculate visibility, change prices, or hold database credentials.
- **Text model:** writes wording only. Initial copy remains neutral; follow-up copy may use only backend-provided current price, quantity, and availability. It does not determine eligibility or claim safety, freshness, quality, or guaranteed sales.
- **Seller:** reviews scheduled drafts for native sharing, and separately selects Agrivive's official destinations and confirms social posts.

## Stop conditions

Sold out, unavailable, deactivated, non-marketable, invalid seller visibility, a superseded listing cycle, an incomplete listing, or an already-created boost for the same listing-cycle trigger. A stale boost cannot fetch context or post after the backend safety check fails.

## Open configuration

The owner must configure backend-only Meta/X credentials, the private n8n webhook/API credentials, Groq when scheduled drafts are used, the public backend origin, and approved test-channel permissions before activating publishing. Figure 5's AHP matrix, weights, TOPSIS calculation, and `0.60` Priority Boost threshold are the implementation policy. The score is a visibility-priority signal only and is not a food-safety or sales guarantee. [[Open Decisions]]

**Source:** PDF pp. 14–15.

**Implementation references:** [n8n workflow documentation](https://docs.n8n.io/workflows/sharing/), [n8n HTTP Request credentials](https://docs.n8n.io/integrations/builtin/credentials/), [Groq OpenAI compatibility](https://console.groq.com/docs/openai), [Groq supported models](https://console.groq.com/docs/models).
