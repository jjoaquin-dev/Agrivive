---
title: Marketing Boost
type: mechanism
status: implemented-prototype
source_pages: [14, 15]
---

# Marketing Boost

## Purpose

Post a seller's surplus listing to Agrivive's Facebook Page and Instagram, with wording written by n8n and a Groq model. The post does not guarantee that buyers will view, reserve, or buy.

## Current flow

1. **Ranking.** The backend ranks every eligible listing with AHP-TOPSIS (`visibility-ahptopsis-v1`) using four criteria: posting age, price drop, stock level, and seller reliability (weights 0.35, 0.35, 0.19, 0.11; consistency ratio 0.0038). There is no minimum score and no tiers.
2. **Pick.** The best-ranked listing that was not boosted in the last 6 hours is the one boosted next (`backend/src/utils/visibility-ranking/boost-select.load.ts`). A seller can also press Boost on their own listing. A seller who is paused or has a fault rate of 15% or more cannot boost.
3. **Send.** The backend sends n8n only the boost ID and reason. n8n fetches the current price, quantity, photo, seller and link from a protected backend route, asks Groq for a short caption, and publishes it.
4. **Retries.** The worker retries failed deliveries up to 5 times, with waits capped at 30 minutes.
5. **Follow-up.** For a listing with auto-post on, a follow-up price-drop post is scheduled 6 hours after the first post (or the seller is asked to set the drop first).

## Responsibility boundaries

- **Backend:** ranking, who may boost, the 6-hour rule, price changes, retries, and current listing facts.
- **n8n:** receives the boost ID, fetches the protected context, and coordinates drafting and posting. It does not rank, change prices, or hold database credentials.
- **Text model:** writes wording only.
- **Seller:** chooses to boost and whether auto-post is on.

## Stop conditions

Sold out, unavailable, deactivated, non-marketable, an incomplete listing, a listing boosted in the last 6 hours, or a paused or high-fault-rate seller.

## Open configuration

The owner sets the backend-only Meta credentials, the private n8n webhook and API credentials, Groq, and the public backend origin. Live posting needs these.

**Source:** PDF pp. 14–15.

**Implementation references:** [n8n workflow documentation](https://docs.n8n.io/workflows/sharing/), [n8n HTTP Request credentials](https://docs.n8n.io/integrations/builtin/credentials/), [Groq OpenAI compatibility](https://console.groq.com/docs/openai), [Groq supported models](https://console.groq.com/docs/models).
