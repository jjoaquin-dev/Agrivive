---
title: Marketing Boost
type: mechanism
status: proposed
source_pages: [14, 15]
---

# Marketing Boost

## Purpose

Prepare promotional material and alerts for active surplus listings while keeping listing facts under backend control. Priority results from [[Weighted Surplus Visibility]] may trigger extra exposure; promotion does not guarantee reach or sales.

## Proposed workflow

1. Seller publishes a complete listing; the backend stores it and sends its identifier to n8n.
2. n8n retrieves the **latest** listing details from the backend API.
3. Groq/LLaMA generates a title, short caption, and call to action pointing back to the Agrivive listing.
4. The workflow prepares supported social-channel content or a manual sharing prompt and records the activity.
5. After six hours, the workflow checks current listing status, available stock, seller activation, and whether a second promotion already ran.
6. If the seller opted into automatic reduction, the backend may apply `new price = max(current price - ₱10, seller-approved minimum)` before a second caption is prepared.

## Responsibility boundaries

- **Backend:** source of truth for availability, price, seller approval, price update, and promotion eligibility.
- **n8n:** orchestrates retrieval, timed checks, content preparation, alerts, sharing, and activity recording.
- **Text model:** writes promotional copy only; it cannot invent or change product condition, quantity, or price.
- **Seller:** approves any automated reduction and can share manually where direct posting is unavailable.

## Stop conditions

Sold out, unavailable, deactivated, non-marketable, or already promoted for the scheduled step. Repeated webhook delivery must not create duplicate second posts or price reductions.

## Open configuration

Supported channels, account permissions, review-before-post rules, rate limits, alert targeting, and how priority tiers map to promotion actions need decisions. [[Open Decisions]]

**Source:** PDF pp. 14–15.
