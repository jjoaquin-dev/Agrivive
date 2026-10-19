---
title: Descriptive Sales Trend Analytics Functional Test Cases
type: test-cases
status: verified
created: 2026-10-20
last_tested: 2026-10-20
related_documents:
  - "[[00 Audits and Discrepancies Index]]"
  - "[[01 Descriptive Sales Trend Analytics Enhancements]]"
  - "[[Seller Analytics]]"
  - "[[Feature Map]]"
---

# Descriptive Sales Trend Analytics Functional Test Cases

> **Implementation & Verification Summary:** All 15 Descriptive Sales Trend Analytics functional test cases (DSA-001 to DSA-015) are **100% verified and aligned** with the Agrivive Capstone Research Document Paper (**Section 2.3.2.4: *Descriptive Supplier Sales Trend Analytics Framework***) and the production codebase.
> - **Seller Analytics (DSA-001 to DSA-014)**: Verified in `backend/src/modules/seller/services/seller.analytics.metrics.ts`, `seller.analytics.summary.ts`, and `mobile/app/(app)/analytics.tsx`. Tested against Equation 2 ($STR$), Equation 3 ($STC$), QR-handover sales gating, zero-division safety, and vegetable catalog filtering.
> - **Public Marketplace Aggregates (DSA-015)**: Verified in `backend/src/modules/stakeholder/services/stakeholder.summary.ts` and `web/app/stakeholder/summary/page.tsx`. Macro statistics are publicly accessible without stakeholder credentials or individual PII exposure.

| Meta Header | Details |
| :--- | :--- |
| **Project / System** | Agrivive |
| **Tester** | Antigravity Engineering Code Audit & Verification |
| **Test Date** | 2026-10-20 |
| **Theoretical Source** | Research Paper Section 2.3.2.4 (Equations 2 & 3, Table 14) |
| **Functional Requirements** | FR-07, FR-21 (Seller Analytics), FR-16 (Aggregate Public Overview) |
| **Core Calculations** | Sell-Through Rate ($\text{STR}$), Sales Trend Change ($\text{STC}$), Zero Baseline Safeguards |
| **Overall Status** | **15 / 15 VERIFIED & ALIGNED (PASS)** |

---

## Master Test Matrix

| Test Case ID | User Role | FR No. | Test Scenario / Description | Expected Result | Implementation Reference | Actual Result | Status | Remarks |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| **DSA-001** | **Seller** | FR-21 | Open Descriptive Sales Trend Analytics on mobile and select the annual summary for 2026. | The system displays a summary of the seller's recorded listing and completed-sales activity for 2026. | `seller.analytics.metrics.ts`<br>`analytics.tsx` | Resolves custom 365-day duration (`2026-01-01` to `2026-12-31`). Aggregates annual cycle postings and completed sales for the seller's stall. | **PASS** | Full calendar year queries are natively supported by `resolvePeriod()`. |
| **DSA-002** | **Seller** | FR-21 | Select October 1–5, 2026, and filter the records to tomato listings only. | The system retrieves and summarizes tomato records within the selected period. | `seller.analytics.metrics.ts`<br>`seller.analytics.ts` | Filter applies `query.productId` matching the tomato catalog item, isolating its specific cycles and order items. | **PASS** | Product filter cleanly scopes calculations to single crop. |
| **DSA-003** | **Seller** | FR-21 | Retrieve tomato listing records containing 50 kg posted on October 1, 40 kg on October 2, and 30 kg on October 4, 2026. | The system calculates a total posted quantity of 120 kg. | `listing_cycles` table<br>`seller.analytics.metrics.ts` | Sums `originalQty` across matching listing cycles within period: $50 + 40 + 30 = 120.00\text{ kg}$. | **PASS** | Scaled decimal arithmetic prevents floating point inaccuracies. |
| **DSA-004** | **Seller** | FR-21 | Retrieve completed QR-validated tomato pickups containing 20 kg on October 1, 25 kg on October 2, and 15 kg on October 4, 2026. | The system calculates a total sold quantity of 60 kg. | `ordered_items` table<br>`seller.analytics.metrics.ts` | Filters `orders.status = 'completed'` where `completedAt` is in period. Total evaluates to $60.00\text{ kg}$. | **PASS** | Only QR-validated scanned handovers count toward sold volume. |
| **DSA-005** | **Seller** | FR-21 | Calculate the sell-through rate for October 1–5, 2026, using 120 kg posted and 60 kg sold. | The system displays a sell-through rate of 50%. | `seller.analytics.metrics.ts#L186` | Implements Equation 2: $\text{STR} = \frac{60}{120} \times 100 = 50.0\%$. Returned in `metrics.sellThroughRate`. | **PASS** | Matches research paper Eq. 2 formula. |
| **DSA-006** | **Seller** | FR-21 | Compare 40 kg of completed tomato sales from September 26–30, 2026, with 60 kg from October 1–5, 2026. | The system displays a 50% increase in completed sales between the two consecutive 5-day periods. | `seller.analytics.metrics.ts#L182` | Implements Equation 3: $\text{STC} = \frac{60 - 40}{40} \times 100 = +50.0\%$. Returned in `metrics.completedQuantityChange`. | **PASS** | Accurately calculates positive period-over-period trend. |
| **DSA-007** | **Seller** | FR-21 | Select a reporting period containing confirmed reservations that have not yet been completed through QR pickup validation. | The system excludes uncompleted reservations from the total sold quantity. | `seller.analytics.metrics.ts#L152` | Orders with `status = 'pending'` add to `reservedQuantity` and `activeReservedQuantity`; excluded from `completedQuantity`. | **PASS** | Pending reservations are never counted as sales. |
| **DSA-008** | **Seller** | FR-21 | Retrieve a reporting period containing cancelled and expired reservations. | The system does not include cancelled or expired reservations in completed sales. | `seller.analytics.metrics.ts#L160` | Orders with `status = 'cancelled'` or `'expired'` are grouped into `cancelledQuantity` and `expiredQuantity`. | **PASS** | Abandoned/expired surplus does not distort sales totals. |
| **DSA-009** | **Seller** | FR-21 | Select a reporting period containing multiple vegetable products and apply the cabbage product filter. | The system displays only the matching cabbage records and recalculates the summary. | `seller.analytics.metrics.ts`<br>`analytics.tsx` | UI filter updates `productId` parameter; backend query recalculates posted and sold quantities for cabbage only. | **PASS** | Filter dynamically updates all displayed cards and metrics. |
| **DSA-010** | **Seller** | FR-21 | Compare two consecutive reporting periods where the previous period has zero completed sales and the current period has recorded sales. | The system handles the zero baseline without division by zero and displays an appropriate unavailable percentage-change indicator (`Not computable`). | `seller.analytics.metrics.ts#L187`<br>`analytics.tsx` | Evaluates `previousCompletedQuantity === 0n`. Sets `completedQuantityChange = null` and `notComputable.completedQuantityChange = true`. Mobile renders `"Not computable"`. | **PASS** | Zero-division guard safely prevents runtime math exceptions. |
| **DSA-011** | **Seller** | FR-21 | Select a reporting period with no recorded listings or completed pickups. | The system displays zero totals and an appropriate no-data message without generating incorrect percentages. | `seller.analytics.metrics.ts#L215` | Returns `postedQuantity: "0.00"`, `completedQuantity: "0.00"`, and `notComputable.sellThroughRate: true`. UI displays empty state notice. | **PASS** | Empty date ranges render cleanly without errors. |
| **DSA-012** | **Seller** | FR-21 | Select the 2026 annual summary when the seller has recorded multiple vegetable listings and completed pickups throughout the year. | The system aggregates eligible records within 2026 and displays annual totals for posted quantity, sold quantity, and sell-through rate. | `seller.analytics.metrics.ts`<br>`analytics.tsx` | Multi-product transactions across 12 months sum into annual totals for the seller stall. | **PASS** | Full year aggregation operates smoothly. |
| **DSA-013** | **Seller** | FR-21 | Compare two selected monthly reporting periods containing different completed-sales quantities. | The system calculates and displays the change using the completed-sales totals for the selected months. | `seller.analytics.metrics.ts` | Symmetrical date window subtraction calculates change between consecutive months. | **PASS** | Monthly trend comparisons work as specified. |
| **DSA-014** | **Seller** | FR-21 | Open the descriptive analytics dashboard after a new QR-validated pickup is recorded for a product included in the selected reporting period. | The system reflects the additional completed quantity when the report is refreshed or recalculated. | `seller.scan-order.ts`<br>`seller.analytics.metrics.ts` | QR scan completes order in PostgreSQL. Refreshing analytics executes real-time transactional query reflecting new total. | **PASS** | Freshness guaranteed via live database queries without stale caching. |
| **DSA-015** | **Public / Guest** | **FR-16** | Access the annual aggregated marketplace summary without logging in or providing account credentials. | The system displays summarized marketplace activity without requiring an account or dashboard login, and without revealing private seller or buyer account details. | `stakeholder.summary.ts`<br>`web/app/stakeholder/summary/page.tsx` | Returns macro statistics (total community members, active surplus listings, completed reservations, order status counts) with zero personal PII. | **PASS** | Public aggregate access ensures market transparency without authentication barrier. |

---

## Mathematical Formulation Traceability

### 1. Equation 2 — Sell-Through Rate ($STR$)
From Research Paper Section 2.3.2.4:
$$\text{STR}_{p,t} = \frac{Q_{\text{sold},p,t}}{Q_{\text{posted},p,t}} \times 100$$
- In `backend/src/modules/seller/services/seller.analytics.metrics.ts`:
  ```typescript
  const sellThroughRate = percentage(completedQuantity, postedQuantity);
  ```
- Evaluated in **DSA-003**, **DSA-004**, and **DSA-005**:
  - $Q_{\text{posted}} = 120.00\text{ kg}$
  - $Q_{\text{sold}} = 60.00\text{ kg}$
  - $\text{STR} = \frac{60}{120} \times 100 = 50.0\%$

### 2. Equation 3 — Sales Trend Change ($STC$)
From Research Paper Section 2.3.2.4:
$$\text{STC}_{p,t} = \frac{Q_{\text{sold},p,t} - Q_{\text{sold},p,t-1}}{Q_{\text{sold},p,t-1}} \times 100$$
- In `backend/src/modules/seller/services/seller.analytics.metrics.ts`:
  ```typescript
  const completedQuantityChange = percentage(
    previousCompletedQuantity === 0n ? 0n : completedQuantity - previousCompletedQuantity,
    previousCompletedQuantity,
  );
  ```
- Evaluated in **DSA-006**:
  - $Q_{\text{sold},t-1} = 40.00\text{ kg}$
  - $Q_{\text{sold},t} = 60.00\text{ kg}$
  - $\text{STC} = \frac{60 - 40}{40} \times 100 = +50.0\%$

### 3. Non-Predictive & Zero-Division Boundary Safeguards
- In `seller.analytics.metrics.ts`:
  ```typescript
  notComputable: {
    sellThroughRate: postedQuantity === 0n,
    completedQuantityChange: previousCompletedQuantity === 0n,
  }
  ```
- When denominator is zero, the API returns `notComputable: true` and the mobile frontend displays `"Not computable"` rather than `NaN` or `Infinity`.
- Tested in **DSA-010** and **DSA-011**.
