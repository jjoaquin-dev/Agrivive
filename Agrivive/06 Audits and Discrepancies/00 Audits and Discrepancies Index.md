---
title: Audits and Discrepancies Index
type: index
status: living
created: 2026-10-16
---

# 06 Audits & Discrepancies — Master Gap Analysis

This directory documents comprehensive gap analyses, empirical audits, narrowed implementation scopes, and discrepancy reports comparing the **Agrivive Capstone Research Document Paper** against the **Production Codebase** (`backend/src/`, `mobile/`, and database schemas).

---

## Directory Organization

```text
Agrivive/06 Audits and Discrepancies/
  ├── 00 Audits and Discrepancies Index.md
  ├── 01 Flagging and Trust Discrepancies.md
  ├── 02 Flagging and Trust Scope Narrowed.md
  └── 03 Flagging and Trust Features Needing Enhancement.md
```

---

## Core Analysis Tracks

### 1. Flagging and Trust Mechanism (Section 2.3.2.6)

A rigorous audit of Section 2.3.2.6 (Figure 10, Table 17, Equation 3, Table 18) against `backend/src/utils/trust/`, `backend/src/modules/trust/`, and `backend/src/db/schema.ts`.

| Note | Focus Area | Key Findings |
| :--- | :--- | :--- |
| `[[01 Flagging and Trust Discrepancies]]` | **Direct Contradictions & Omissions** | • 3-week warning & 1-month blocking for general account inactivity stated in paper is completely absent in code.<br>• Paper discusses buyer failed reservation penalties; code evaluates penalties strictly against sellers.<br>• Prototype safety toggles (`TRUST_ACTIONS_ENABLED=false`) vs. paper's portrayal of active enforcement. |
| `[[02 Flagging and Trust Scope Narrowed]]` | **Engineering Pruning & Safety Boundaries** | • 6+ theoretical violation types pruned down to 3 verified signals (`inquiry_non_response`, `seller_cancellation`, `low_rating`).<br>• User-submitted reports strictly classified as `allegation` (0 points) until supported by immutable database transactions.<br>• Admin moderation deliberately kept strictly read-only to prevent unilateral abuse. |
| `[[03 Flagging and Trust Features Needing Enhancement]]` | **Engineering Roadmap & Solutions** | • Architecture for a 3-week/1-month Activity Watcher.<br>• Buyer No-Show / Failed Reservation penalty engine.<br>• Multi-category evidence audit pipeline.<br>• Violation decay/half-life algorithms.<br>• Accessible, transparent UI/UX Trust Dashboards compliant with UX Laws. |

---

## Cross-Module Knowledge Base Navigation

* **Intelligence Specification:** `[[Trust and Flagging]]`
* **Implementation Delivery:** `[[2026-10-11 Trust and Flagging Policy Enforcement]]`
* **Master Feature Roadmap:** `[[00 Feature Enhancements Index]]`
* **Architecture Constraints:** `[[Architecture and Integrations]]`
* **Open Design Decisions:** `[[Open Decisions#D-04]]`, `[[Open Decisions#D-05]]`
