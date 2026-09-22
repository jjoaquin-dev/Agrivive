---
title: Weighted Surplus Visibility
type: mechanism
status: proposed
source_pages: [12, 13, 14]
---

# Weighted Surplus Visibility

## Purpose

Give eligible marketable surplus listings a consistent **promotion priority**. The score does not measure freshness, spoilage, food safety, or actual shelf life.

## Eligibility first

Only active listings that the seller confirms are still marketable are scored. Exclude unavailable, sold-out, cancelled, non-marketable, or seller-removed listings.

## Prototype score

`V = 0.30P + 0.30Q + 0.25I + 0.15R`

| Criterion | Normalized value (0–1) | Prototype reference |
|---|---|---|
| `P`: posting age | `min(hours since publication / 12, 1)` | 12 hours |
| `Q`: remaining quantity | `current available quantity / originally posted quantity` | Original posting |
| `I`: declared inventory age | `min(days held in inventory / 3, 1)` | 3 days |
| `R`: historical recurrence | `min(previous surplus instances / 3, 1)` | Same standardized vegetable and seller, previous 30 days |

The four weights sum to one. Guard against zero or invalid original quantity, clamp normalized values to `[0,1]`, and record the inputs and configuration version used for a score. The reference values and thresholds are **prototype settings**, not agricultural standards.

## Output tiers

| Score | Tier | Intended action |
|---|---|---|
| 0.00–0.39 | Basic Exposure | Normal public feed placement |
| 0.40–0.69 | Standard Exposure | Searchable listing, optional promotion |
| 0.70–1.00 | Priority Boost | Prioritized placement, buyer alert, sharing prompt |

For implementation, use exact threshold comparisons (`V >= 0.70`, `V >= 0.40`) rather than rounded display values at boundaries.

## Example from the proposal

For cabbage active for 9 hours, with 75 of 100 kg remaining, 2 days of declared inventory age, and 2 earlier surplus instances: `P=.75`, `Q=.75`, `I≈.67`, `R≈.67`, so `V≈.718`, a Priority Boost.

## Inputs the product must collect

Publication timestamp, original and current available quantity, seller-declared inventory start or age, standardized vegetable identity, seller identity, marketability and listing state. [[Feature Map]]

**Source:** PDF pp. 12–14.
