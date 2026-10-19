---
title: Promotional Posting Price Inclusion in n8n and Social Campaigns
date: 2026-10-19
type: delivery
status: verified
related_documents:
  - "[[06 n8n Priority Promotion and Price Reduction Functional Test Cases]]"
  - "[[2026-10-07 Priority Listing Promotions with n8n]]"
  - "[[2026-10-08 Seller Boost Visibility Social Publishing]]"
---

# Promotional Posting Price Inclusion in n8n and Social Campaigns

## What changed

1. **Social Promotion Post Content Utility**:
   - In `backend/src/utils/social-promotion-content/index.ts`, expanded `generateSocialPromotionPosts` input to require `price: string | number` and `unit: string`.
   - Updated the Groq system prompt from forbidding price (`"Do not state or imply price..."`) to mandating price inclusion:
     `"You MUST clearly state the product price (e.g., ₱XX per kg or ₱XX/unit) in each post."`
   - Formatted the price cleanly as `₱${Number(price).toFixed(2)} per ${unit}` and passed it in the user context to the AI model.

2. **Seller Social Campaign Creation**:
   - In `backend/src/modules/seller/services/seller.social-campaign.create.ts`, forwarded `eligibility.price` and `eligibility.unit` directly to `generateSocialPromotionPosts`.

3. **n8n Priority Promotion Workflow**:
   - In `n8n/workflows/agrivive-priority-promotion.json` (`Generate Draft with Groq` node), updated the system prompt for both initial and follow-up stages to require explicit inclusion of the product price (e.g. `₱{price} per {unit}`) in the generated headline or caption.
   - Expanded the user JSON payload to supply `price: '₱' + $json.listing.price + ' per ' + $json.product.unit` and `unit: $json.product.unit`.

## Why

- **Price Transparency & Buyer Conversion (Don't Make Me Think & Jakob's Law)**: Social media posts on Facebook, Instagram, and X without visible pricing increase user friction, requiring extra clicks to learn basic purchasing facts.
- **Alignment with AHP-TOPSIS Follow-Up Requirements**: Discounted follow-up promotions must showcase the reduced price floor to incentivize prompt surplus pickup.

## Affected paths

- `backend/src/utils/social-promotion-content/index.ts`
- `backend/src/modules/seller/services/seller.social-campaign.create.ts`
- `n8n/workflows/agrivive-priority-promotion.json`
- `Agrivive/04 Delivery/2026-10-19 Promotional Posting Price Inclusion in n8n and Social Campaigns.md`

## Verification performed

1. **Backend Verification**:
   - `bunx tsc --noEmit` passed with 0 errors.
   - `bun build src/index.ts --outdir dist --target bun` passed with 0 errors (bundled 1698 modules).
2. **File Length Compliance**:
   - `social-promotion-content/index.ts`: 102 lines ($\le 200$)
   - `seller.social-campaign.create.ts`: 59 lines ($\le 200$)
