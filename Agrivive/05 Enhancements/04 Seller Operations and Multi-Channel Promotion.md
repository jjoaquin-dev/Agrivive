---
title: Seller Operations and Multi-Channel Promotion
type: enhancement-specification
status: proposed
created: 2026-10-16
related_decisions: [D-06, D-13]
related_modules:
  - backend/src/modules/integrations/
  - n8n/workflows/
  - mobile/src/features/boost/
---

# Seller Operations and Multi-Channel Promotion

## Context & Purpose

To accelerate surplus liquidation before spoil threshold, Agrivive incorporates Priority Listing Promotions and official social media publishing via n8n automation and backend worker queues.

---

## Key Enhancement Areas

### 1. Batch Surplus Price Adjustments
* **Problem:** Rapidly perishable produce requires dynamic markdowns across multiple listings at closing hours.
* **Enhancement:**
  * Implement a "Closing Hour Clearance" batch action in the seller inventory screen.
  * Allow applying a percentage markdown (e.g., 20% off all leafy greens) in one tap.

### 2. Multi-Channel Publishing Observability & Retry (D-13)
* **Problem:** Facebook Graph API, Instagram Professional API, and X API rate limits or expired tokens can cause silent publication drops.
* **Enhancement:**
  * Surface clear per-channel status tags in the mobile boost history (`Published`, `Queued`, `Token Expired`, `Failed`).
  * Implement failed-channel-only retry buttons in `mobile/src/features/boost/`.

### 3. SMS & Low-Bandwidth Fallback for Micro-Sellers
* **Problem:** Stall holders without smartphones or consistent data packages struggle with app-only promotion alerts.
* **Enhancement:**
  * Implement an SMS gateway integration (e.g., Semaphore or Twilio) for critical pickup pass confirmations and daily sales summaries.
