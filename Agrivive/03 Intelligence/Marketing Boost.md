---
title: Marketing Boost
type: mechanism
status: implemented-prototype
source_pages: [14, 15]
---

# Marketing Boost

## Purpose

Prepare promotional material and alerts for active surplus listings while keeping listing facts under backend control. Priority results from [[Weighted Surplus Visibility]] may trigger extra exposure; promotion does not guarantee reach or sales.

## Implemented beta workflow

1. The backend creates durable promotion jobs for listing cycles created after rollout. Existing cycles are marked historical in the migration.
2. The single backend worker checks initial jobs hourly using the current `visibility-v4` calculation. A listing qualifies only at a score of at least `0.70`, while it is still the current cycle, active, marketable, in stock, and publicly visible through a valid seller profile.
3. When eligible, the worker sends n8n only the job ID and stage. n8n fetches the latest public context through a protected backend route and asks Groq for a short, neutral headline and caption.
4. The backend rechecks current eligibility before accepting the callback. Duplicate delivery/callbacks do not create duplicate drafts. Delivery retries are bounded and terminal failures are recorded.
5. The seller reviews the generated wording in the mobile Priority Boost inbox. The native share sheet receives current backend product, shop, price, quantity, and listing-link facts. The seller chooses a destination or cancels.
6. Six hours after an initial draft becomes ready, the backend checks the same listing cycle again and queues no more than one follow-up if it remains eligible. The follow-up does not depend on opening or sharing the initial draft.

The scheduled draft flow above does not post automatically, notify buyers, change seller prices, or connect social accounts. Seller-initiated social publishing is a separate, explicit confirmation flow described below; it does not change the backend worker's hourly and six-hour eligibility checks.

## Seller-initiated social publishing

The seller's Marketplace Visibility Guide includes a **Boost Visibility** action. The backend rechecks Priority eligibility and prepares editable copy for Agrivive's Facebook Page, linked Instagram Professional account, and X account. The seller selects available official destinations, reviews/edits copy and confirms posting. TikTok and seller-owned account linking are not part of this release.

Provider credentials stay in the backend environment. n8n receives only the campaign ID, then selected platform names, and asks the backend to publish each destination; it never receives provider tokens or directly calls social platform APIs. The backend returns per-channel results, and retries only channels that failed. The public Agrivive media URL serves the current eligible listing photo from private S3.

Live publishing depends on valid backend credentials, Meta and X write permissions, a public HTTPS backend, the social publishing migration, and the n8n workflow/credentials. The existing visibility threshold (`visibility-v4 >= 0.70`) remains unchanged and is enforced by the backend.

## Responsibility boundaries

- **Backend:** source of truth for `visibility-v4`, current listing status, fresh share facts, job state, follow-up timing, and eligibility.
- **n8n:** the older workflow coordinates copy generation for scheduled drafts; the social workflow routes seller-approved channel selections to the backend. It does not calculate eligibility or hold provider credentials.
- **Text model:** writes wording only. The prompt prohibits factual claims about price, quantity, quality, freshness, origin, safety, discounts, or availability.
- **Seller:** reviews scheduled drafts for native sharing, and separately selects Agrivive's official destinations and confirms social posts.

## Stop conditions

Sold out, unavailable, deactivated, non-marketable, invalid seller visibility, a superseded listing cycle, a score below Priority, or an already-created stage job. A stale draft cannot be shared after the backend eligibility check fails.

## Open configuration

The owner must configure backend-only Meta/X credentials, the private n8n webhook/API credentials, Groq, the public backend origin, and approved test-channel permissions before activating publishing. The score weights and `0.70` threshold remain prototype settings pending D-07 stakeholder validation. [[Open Decisions]]

**Source:** PDF pp. 14–15.

**Implementation references:** [n8n workflow documentation](https://docs.n8n.io/workflows/sharing/), [n8n HTTP Request credentials](https://docs.n8n.io/integrations/builtin/credentials/), [Groq OpenAI compatibility](https://console.groq.com/docs/openai), [Groq supported models](https://console.groq.com/docs/models).
