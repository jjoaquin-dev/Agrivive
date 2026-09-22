---
title: Market Basket Analysis
type: mechanism
status: proposed
source_pages: [16, 17, 18, 19]
---

# Market Basket Analysis

## Purpose

Recommend related vegetables based on products that occur together in **completed in-platform transactions**. This is an association in historical records, not a forecast of a buyer's next purchase.

## Proposed pipeline

Completed multi-item transactions → standardized vegetable identities → Boolean basket matrix → Apriori frequent itemsets → association rules → threshold filtering → backend recommendation API → buyer's current cart or product view.

The Python analysis process reads transaction data without modifying active operational records. Recommendations should resolve to currently available listings before display.

## Measures

- **Support** `P(X and Y)`: fraction of completed baskets containing both items.
- **Confidence** `P(Y | X)`: fraction of baskets containing X that also contain Y.
- **Lift** `confidence(X→Y) / support(Y)`: association relative to Y's base frequency.

## Prototype example

The PDF demonstrates eight completed baskets and example thresholds of 50% minimum support, 70% minimum confidence, and lift above 1.0. `{Squash} → {String Beans}` occurs in 5 of 8 baskets: support 62.5%, confidence 5/6 or 83.33%, and lift about 1.111. It is accepted in the example. These are demonstration settings, not validated production thresholds.

## Implementation guardrails

- Use completed pickups or transactions only; exclude active, cancelled, and expired reservations.
- Normalize vegetable names so spelling variants do not split one product category.
- Decide whether baskets can contain products from multiple sellers; this depends on [[Reservation and QR Pickup]].
- Suppress unavailable or duplicate recommendations and explain them simply as “Frequently bought together.”
- Handle sparse data with no recommendation instead of implying a learned relationship.

**Source:** PDF pp. 16–19.
