---
title: Descriptive Sales Trend Analytics Enhancements
type: enhancement-specification
status: proposed
created: 2026-10-16
related_paper_section: "2.3.2.4 Descriptive Supplier Sales Trend Analytics Framework"
related_modules:
  - backend/src/modules/seller/
  - mobile/src/features/analytics/
---

# Descriptive Sales Trend Analytics Enhancements

## Context & Background

Section 2.3.2.4 of the Agrivive research paper (*Descriptive Supplier Sales Trend Analytics Framework*) defines an analytical framework to convert completed QR-based pickup records and surplus postings into numerical measures and visual presentations of historical sales. 

A thorough audit comparing Section 2.3.2.4 against the live implementation in `backend/src/modules/seller/services/seller.analytics.metrics.ts`, `seller.analytics.summary.ts`, and `mobile/app/(app)/analytics.tsx` confirms full adherence to the fundamental mathematical formulations:
- **Equation 2 (Sell-Through Rate):** $\text{STR}_{p,t} = \frac{Q_{\text{sold},p,t}}{Q_{\text{posted},p,t}} \times 100$
- **Equation 3 (Sales Trend Change):** $\text{STC}_{p,t} = \frac{Q_{\text{sold},p,t} - Q_{\text{sold},p,t-1}}{Q_{\text{sold},p,t-1}} \times 100$
- **Non-predictive boundaries & zero-division safety:** Renders "Not computable" when the denominator is zero.

However, several operational and visual gaps exist between the paper's conceptual vision (Figure 8, Table 14, literature citations [44]–[48]) and the current system implementation. This document details the specific technical and architectural enhancements required.

---

## Identified Enhancement Areas

### 1. Graphical Visualizations & Time-Series Charts (Mobile UI)
* **Gap Identified:** 
  * The research paper cites retail sales visualization literature ([44], [45], [46]) emphasizing dashboards that "convert tabular transaction records into graphs and summarized measures for easier examination of sales patterns."
  * Currently, `mobile/app/(app)/analytics.tsx` only renders static text metric tiles and summary cards. There are no graphical charts.
* **Proposed Enhancement:**
  * Implement interactive, accessible chart components (using `react-native-svg` or `victory-native`):
    * **Dual-Bar Chart:** Contrasting **Quantity Posted** vs. **Quantity Sold** across consecutive periods.
    * **Trend Line Graph:** Tracking the period-to-period **Sell-Through Rate ($STR$)** and **Sales Trend Change ($STC$)** percentage over time.
    * **Color-Coded Status Thresholds:** Forest Green (`#1F4D3A`) for positive momentum, Warm Amber for neutral, and Terracotta (`#B85450`) for declining volume.

### 2. Multi-Period & Weekly Cadence Breakdown (Table 14 Parity)
* **Gap Identified:**
  * Table 14 in the research paper presents a multi-period sequence (Week 1 to Week 5) demonstrating progressive baseline and trend changes ($+18.06\%$, $-5.88\%$, $+31.25\%$, $-6.67\%$).
  * The current system API computes only a single "current vs. immediately preceding period" comparison across coarse fixed windows (7, 30, 90 days).
* **Proposed Enhancement:**
  * Add support for weekly and monthly time-bucket slicing in `seller.analytics.metrics.ts`:
    * Query parameter `interval: "week" | "month" | "custom"`.
    * Return an array of historical interval points:
      ```typescript
      intervals: Array<{
        periodLabel: string; // e.g. "Week 1", "Week 2"
        from: string;
        to: string;
        postedQuantity: string;
        completedQuantity: string;
        sellThroughRate: number | null;
        trendChange: number | null;
        status: "Baseline" | "Sales increased" | "Sales decreased" | "No sales";
      }>;
      ```
  * Enable sellers to scroll through historical period comparisons in an interactive table or carousel matching Table 14.

### 3. Unit Conversion & Multi-Listing Normalization
* **Gap Identified:**
  * Agricultural sellers frequently list the same crop under different selling units (e.g., Cabbage sold by the `kilo` vs. bulk `sack` vs. small `pile`).
  * While the backend allows filtering by a specific unit (`kilo`, `sack`, `pile`), selecting "All units" sums quantities directly across non-interchangeable units.
* **Proposed Enhancement:**
  * Introduce standardized vegetable unit conversion factors in `vegetableCatalog` (e.g., 1 standard sack of cabbage $\approx$ 50 kg; 1 pile $\approx$ 1 kg).
  * In `seller.analytics.metrics.ts`, when `unit` is omitted (aggregate view), compute quantities in normalized kilograms as the canonical reference unit while preserving the raw breakdown in sub-records.

### 4. Accounting for Edge Cases & Carried-Over Surplus
* **Gap Identified (from Vault note `03 Intelligence/Seller Analytics.md`):**
  * How are partial pickups, unpicked expired surplus, and carried-over inventory reflected in subsequent period sell-through?
* **Proposed Enhancement:**
  * **Carried-Over Surplus Metric:** Separate newly posted surplus ($Q_{\text{new}}$) from unsold carried-over inventory ($Q_{\text{carried}}$) from preceding cycles.
  * **Partial Pickup Resolution:** Record exact verified scanned weights when partial claims occur, updating $Q_{\text{sold}}$ strictly by the net dispensed weight, and returning the remainder to $Q_{\text{remaining}}$.

### 5. Exporting and Reporting Capabilities (PDF/CSV)
* **Gap Identified:**
  * Sellers, agricultural cooperatives, and market administrators lack an export mechanism to share or archive historical performance.
* **Proposed Enhancement:**
  * Add `GET /seller/analytics/export?format=csv` and `format=pdf` in `backend/src/modules/seller/index/seller.analytics.ts`.
  * Generate tabular records formatted for cooperative reporting and audit logs.

### 6. AI Summary Resilience & Tone Adaptation
* **Gap Identified:**
  * Groq summaries must remain strictly descriptive without ever venturing into predictive forecasting.
* **Proposed Enhancement:**
  * Add unit tests verifying that Groq prompt responses strictly contain zero predictive words (e.g. banning "will sell", "forecast", "expect next week").
  * Ensure instantaneous fallback to the deterministic format in `seller.analytics.summary.ts` under high latency (>3s) or offline scenarios.

---

## Actionable Implementation Roadmap

| Priority | Feature Item | Target Layer | Estimated Scope |
| :--- | :--- | :--- | :--- |
| **P1** | Time-Series Charts (Posted vs. Sold Bar + STR Trend Line) | `mobile/` UI | 2-3 Days |
| **P1** | Multi-period historical interval slicing (Table 14 parity) | `backend/` & `mobile/` | 2 Days |
| **P2** | Unit Normalization & Canonical KG conversion | `backend/` services | 2 Days |
| **P2** | Export to CSV / Summary Report generation | `backend/` endpoint | 1-2 Days |
| **P3** | Carried-Over Surplus & Partial Pickup reconciliation | `backend/` database & logic | 3 Days |

---

## Traceability
* **Theoretical Source:** Research Paper Section 2.3.2.4, Equations 2 & 3, Table 14, Figure 8.
* **Vault References:** `[[Seller Analytics]]`, `[[2026-09-22 Seller Analytics Groq]]`, `[[Open Decisions]]`.
