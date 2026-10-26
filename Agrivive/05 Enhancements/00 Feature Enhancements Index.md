---
title: Feature Enhancements Index
type: index
status: living
created: 2026-10-16
---

# 05 Enhancements — Master Roadmap & Feature Backlog

This directory tracks structured enhancement proposals, algorithmic refinements, UX advancements, and technical debt items identified from research paper audits, user feedback, and delivery milestones.

---

## Directory Organization

```text
Agrivive/05 Enhancements/
  ├── 00 Feature Enhancements Index.md
  ├── 01 Descriptive Sales Trend Analytics Enhancements.md
  ├── 02 Marketplace Visibility and AHP-TOPSIS Refinements.md
  ├── 03 Order Lifecycle and Smart Reservation Reconciliation.md
  ├── 04 Seller Operations and Multi-Channel Promotion.md
  ├── 05 Mobile and Backend Flow Enhancements.md
  └── 06 Web Landing Page UI-UX Enhancements.md
```

---

## Key Enhancement Tracks

### 1. Analytics & Business Intelligence
* **Document Note:** `[[01 Descriptive Sales Trend Analytics Enhancements]]`
* **Focus:**
  * Interactive time-series charts on mobile and web (Posted vs. Sold dual-bars; Sell-Through Rate line charts).
  * Multi-period interval slicing (Week 1–5 trend sequence matching Research Paper Table 14).
  * Canonical unit normalization (kilo, sack, pile conversion factors).
  * Data exports (CSV and PDF cooperative summaries).
  * Guaranteed non-predictive AI narrative summarization with deterministic offline fallbacks.

### 2. Marketplace Visibility & Ranking Engine
* **Document Note:** `[[02 Marketplace Visibility and AHP-TOPSIS Refinements]]`
* **Focus:**
  * Empirical validation of the 40/40/20 AHP-TOPSIS criteria weights (Freshness, Distance, Surplus Volume) with stakeholder feedback (`[[Open Decisions#D-07]]`).
  * Dynamic decay curves for vegetable perishability based on regional temperature and ambient conditions.
  * Real-time visibility boost tracking and analytics.

### 3. Order Lifecycle & Reservation Management
* **Document Note:** `[[03 Order Lifecycle and Smart Reservation Reconciliation]]`
* **Focus:**
  * Partial pickup handling and immediate surplus replenishment (`[[Open Decisions#D-05]]`).
  * Granular 24-hour expiration countdowns with buyer re-engagement alerts (`[[Open Decisions#D-04]]`).

### 4. Web Landing Page UI/UX Enhancements
* **Document Note:** `[[06 Web Landing Page UI-UX Enhancements]]`
* **Focus:**
  * Center-aligned hero layout with 3D produce basket centerpiece and floating value cards.
  * Instant grocery search affordances and category quick-filter pills.
  * Davao City local public market orientation and surplus waste reduction clarity.
  * Offline-capable digital pickup pass with signed QR verification.

### 4. Seller Operations & Multi-Channel Outreach
* **Document Note:** `[[04 Seller Operations and Multi-Channel Promotion]]`
* **Focus:**
  * Batch inventory updates and rapid price adjustments.
  * Integration testing and monitoring for n8n-powered Priority Boost copy generation and official social page publishing (`[[Open Decisions#D-06]]`, `[[Open Decisions#D-13]]`).

### 5. Trust, Flagging & Account Lifecycle
* **Document Notes:** `[[00 Audits and Discrepancies Index]]`, `[[03 Flagging and Trust Features Needing Enhancement]]`, `[[04 Flagging and Trust Functional Test Cases]]`
* **Focus:**
  * 3-week inactivity warning and 30-day automated account blocking (Paper Section 2.3.2.6 parity).
  * Reciprocal buyer failed reservation tracking and inventory hoarding limits.
  * Multi-category evidence verification state machine (misleading produce info, QR misuse, abusive chat).
  * Violation score half-life and time-decay algorithms to support seller rehabilitation.
  * Accessible in-app Trust Health Status badges adhering to Jakob Nielsen's Visibility of System Status.

### 6. Web Marketplace UI/UX Enhancements
* **Document Note:** `[[2026-10-26 Marketplace Visual Refinements and Spacing Harmonization]]`
* **Focus:**
  * Elimination of compounding section margins and standardization to 8-point vertical rhythm (`space-y-8 lg:space-y-10`).
  * Nearby seller map de-emphasis: height reduction from 480px to balanced 310px with inline `Expand/Compact` toggle and full filter sidebar integration.
  * Product grid equal-height row alignment: reserved 2-line title height (`min-h-[2.5rem]`) and uniform `h-10` Add to Cart action bar.
  * Responsive mobile filter drawer with Base UI `Sheet` and standardized `h-10` controls.
  * Preserved 100% of existing AgriVive branding, green/cream palette, illustrations, and backend integrations.

---

## Governance & Prioritization Principles

1. **Non-Predictive Integrity:** Analytics tools must maintain descriptive reporting integrity without overpromising predictive precision unless empirically validated models are introduced.
2. **Zero-Slop UI/UX:** Adhere strictly to the Agrivive Design Rules: Jakob's Law, Miller's Chunking, Fitts's Law touch targets (≥48px), and Forest Green (`#1F4D3A`) visual hierarchy.
3. **Type-Safe & Scaled-Decimal Accuracy:** Preserve fixed-point arithmetic (`scaledDecimal` BigInt) for all quantitative and monetary metrics.
