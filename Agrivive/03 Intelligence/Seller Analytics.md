---
title: Seller Analytics
type: mechanism
status: proposed
source_pages: [6, 11, 19, 20]
---

# Seller Analytics

## Purpose

Show sellers what happened to their listed surplus: quantities posted, reserved, sold through completed pickups, cancelled, expired, and remaining; recurring surplus; completed transactions; and period-to-period patterns. Stakeholder views use aggregates only. [[People and Roles]]

## Core measures

- **Sell-through rate:** `completed pickup quantity / posted surplus quantity × 100` for a product and period. Do not count merely reserved, cancelled, or expired quantities as sales.
- **Completed-sales change:** `(current period completed-sale quantity - previous period quantity) / previous period quantity × 100`.
- If the denominator is zero, show **not computable** rather than divide by zero.

## Example from the proposal

For Week 4 cabbage, 105 kg completed from 150 kg posted gives 70% sell-through. Compared with 80 kg sold in Week 3, completed-sale quantity rose 31.25%. This describes past records; it does not predict Week 5.

## Presentation

Use a selected period, product, and unit; clearly label posted versus reserved versus completed. Show a chart or concise summary alongside the underlying counts. Make no-sales periods legible. If Groq/LangGraph is used to phrase a summary, validated backend calculations must supply every number.

## Data quality questions

Determine how partial pickups, listing edits, unit conversions, multiple listings for one vegetable, and carried-over inventory affect period totals. [[Open Decisions]]

**Source:** PDF pp. 6, 11, 19–20.
