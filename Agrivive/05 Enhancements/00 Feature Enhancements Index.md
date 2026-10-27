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
  ├── 06 Web Landing Page UI-UX Enhancements.md
  ├── 07 Web Buyer Notification Popover Enhancements.md
  ├── 08 Web Production Performance Optimization.md
  └── 09 Mobile Production Performance Optimization.md
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

### 7. Web Production Performance Optimization
* **Document Note:** `[[08 Web Production Performance Optimization]]`
* **Focus:**
  * Reverse proxy compression (`encode zstd gzip`) and immutable cache headers in Caddy.
  * Self-hosted Google Fonts via `next/font/google` replacing render-blocking `<link>` tags.
  * Modern image optimization with `sharp`, responsive `sizes`, and WebP/AVIF conversions.
  * Removed legacy Pages Router artifacts (`_document.tsx`).
  * Unlocked instant SSR by removing client-side auth gating on public marketplace browsing.
  * Isolated Leaflet map bundle and styles to on-demand client chunks.
  * Debounced price slider input to prevent navigation and network flooding.

### 8. Mobile Production Performance Optimization
* **Document Note:** `[[09 Mobile Production Performance Optimization]]`
* **Focus:**
  * Removed blocking network `authClient.getSession()` handshake inside `apiFetch` (0ms pre-flight latency).
  * Enabled Metro `.mjs` tree-shaking for `lucide-react-native` icons, eliminating all 1,400+ unused SVG icons from memory.
  * Removed unused `react-native-maps` and dead fonts, slashing native binary dependencies.
  * Enabled Proguard/R8 shrinking and resource optimization in `app.json`.
  * Removed artificial splash screen and session delays (hiding splash screen instantly when fonts are loaded).
  * Implemented stale-while-revalidate navigation across Inventory and Orders tabs.
  * Memoized `ProductCard` and `OrderCard` with `React.memo` and tuned `FlatList` virtualization.

### 9. Unified Produce Bag Application and Internal Logo Replacement
* **Document Note:** `[[2026-10-27 Unified Produce Bag Logo Across Web and Mobile]]`
* **Focus:**
  * Replaced legacy brand icons and generic internal icons across Web and Mobile with the official produce tote bag artwork (`Agrivive_Logo.png`).
  * Generated high-resolution, contrast-aligned light and dark variants (`agrivive-logo-crate.png`, `agrivive-logo-crate-dark.png`) preserving exact alpha transparency.
  * Generated crisp mobile launcher icons, Android adaptive foregrounds with safe-zone bounds, and splash icons.
  * Replaced `<Sprout />` internal icon in seller dashboard header with the official Agrivive emblem.
  * Replaced legacy onboarding header asset with the new bag emblem and wordmark.

### 10. Backend Performance and Security Hardening
* **Document Note:** `[[2026-10-27 Backend Performance and Security Hardening]]`
* **Focus:**
  * Eliminated IP spoofing and unbounded Map memory leaks in the API rate limiter.
  * Added PostgreSQL connection pool error listeners, 5s connection acquisition timeouts, and pool limits.
  * Added global production error sanitization preventing raw SQL syntax and schema leakage (CWE-209).
  * Implemented 30-second in-memory session user status caching, cutting redundant database queries by 50%.
  * Added 6 composite indexes on `orders`, `ordered_items`, and `sellers_product` to replace sequential full-table scans with index scans.
  * Expanded development CORS to support LAN IPs (`192.168.*.*`, `10.*.*.*`) for physical mobile and Expo clients.

---

## Governance & Prioritization Principles

1. **Non-Predictive Integrity:** Analytics tools must maintain descriptive reporting integrity without overpromising predictive precision unless empirically validated models are introduced.
2. **Zero-Slop UI/UX:** Adhere strictly to the Agrivive Design Rules: Jakob's Law, Miller's Chunking, Fitts's Law touch targets (≥48px), and Forest Green (`#1F4D3A`) visual hierarchy.
3. **Type-Safe & Scaled-Decimal Accuracy:** Preserve fixed-point arithmetic (`scaledDecimal` BigInt) for all quantitative and monetary metrics.
