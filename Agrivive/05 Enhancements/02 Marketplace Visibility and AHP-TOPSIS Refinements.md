---
title: Marketplace Visibility and AHP-TOPSIS Refinements
type: enhancement-specification
status: proposed
created: 2026-10-16
related_decisions: [D-07]
related_modules:
  - backend/src/modules/seller/services/seller.analytics.visibility.ts
  - mobile/src/features/analytics/components/VisibilityBreakdownCard.tsx
---

# Marketplace Visibility and AHP-TOPSIS Refinements

## Context & Purpose

Agrivive uses a multi-criteria decision-making model (AHP-TOPSIS) to rank surplus produce listings in the buyer marketplace. The current prototype algorithm scores listings based on three core dimensions:
1. **Freshness / Posting Age** (Criterion Weight: 40%)
2. **Geographical Distance / Proximity** (Criterion Weight: 40%)
3. **Surplus Volume / Discount Factor** (Criterion Weight: 20%)

This note outlines needed enhancements to transition from prototype weights to production-validated operations.

---

## Key Enhancement Areas

### 1. Stakeholder Calibration of Criteria Weights (D-07)
* **Current State:** The 40/40/20 weights are initial prototype assumptions.
* **Enhancement:**
  * Implement an administrative configuration interface allowing cooperative managers to adjust weights per regional market.
  * Conduct sensitivity analysis to evaluate how weight shifts affect stall visibility and inventory clearance.

### 2. Crop-Specific Perishability Decay Curves
* **Current State:** Freshness decay is linear across all vegetables.
* **Enhancement:**
  * Differentiate decay curves by crop category (e.g., leafy greens like pechay and lettuce decay significantly faster than hardy root crops like carrots and potatoes).
  * Integrate ambient weather metrics (temperature, humidity from Open-Meteo) to accelerate decay scoring during high-heat periods.

### 3. Real-Time Seller Feedback & Optimization Prompts
* **Current State:** Sellers see their visibility breakdown score, but receive minimal prescriptive suggestions.
* **Enhancement:**
  * Provide inline suggestions on `VisibilityBreakdownCard`:
    * *Example:* "Your posting is 18 hours old. Adjust price or activate a Priority Boost to regain top placement."
