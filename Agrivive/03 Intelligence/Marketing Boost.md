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

There is no automatic posting, buyer promotion notice, seller price change, n8n schedule, or social-account connection in this version. The backend worker owns the hourly and six-hour checks.

## Responsibility boundaries

- **Backend:** source of truth for `visibility-v4`, current listing status, fresh share facts, job state, follow-up timing, and eligibility.
- **n8n:** fetches protected context and coordinates copy generation/callbacks; it does not schedule eligibility checks.
- **Text model:** writes wording only. The prompt prohibits factual claims about price, quantity, quality, freshness, origin, safety, discounts, or availability.
- **Seller:** reviews the draft and decides whether to share through the device's native share sheet.

## Stop conditions

Sold out, unavailable, deactivated, non-marketable, invalid seller visibility, a superseded listing cycle, a score below Priority, or an already-created stage job. A stale draft cannot be shared after the backend eligibility check fails.

## Open configuration

The owner must configure the private n8n webhook credential, Groq credential, an enabled Groq model ID, and the backend origin after importing the credential-free workflow. The score weights and `0.70` threshold remain prototype settings pending D-07 stakeholder validation. [[Open Decisions]]

**Source:** PDF pp. 14–15.

**Implementation references:** [n8n workflow documentation](https://docs.n8n.io/workflows/sharing/), [n8n HTTP Request credentials](https://docs.n8n.io/integrations/builtin/credentials/), [Groq OpenAI compatibility](https://console.groq.com/docs/openai), [Groq supported models](https://console.groq.com/docs/models).
