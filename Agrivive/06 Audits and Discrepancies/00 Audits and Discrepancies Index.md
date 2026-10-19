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
  ├── 03 Flagging and Trust Features Needing Enhancement.md
  ├── 04 Flagging and Trust Functional Test Cases.md
  ├── 05 AHP-TOPSIS Visibility Functional Test Cases.md
  └── 06 n8n Priority Promotion and Price Reduction Functional Test Cases.md
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
| `[[04 Flagging and Trust Functional Test Cases]]` | **Functional Testing Verification Matrix** | • Standardized test checklist covering test cases FTM-01 through FTM-10.<br>• Fields for Actual Result, Pass / Fail, and Remarks during manual verification sessions. |

### 2. AHP-TOPSIS Weighted Surplus Visibility (Section 2.3.2.5)

A comprehensive audit of Section 2.3.2.5 (Figure 5, Table 14, Table 15) against `backend/src/utils/ahp-topsis/`, `backend/src/utils/visibility-ranking/`, and `backend/src/modules/marketplace/services/`.

| Note | Focus Area | Key Findings |
| :--- | :--- | :--- |
| `[[05 AHP-TOPSIS Visibility Functional Test Cases]]` | **AHP-TOPSIS Functional Test Suite (WSV-001 to WSV-010)** | • 10/10 test cases verified and 100% implemented.<br>• Multi-criteria decision engine (freshness, stock, reliability, recurrence).<br>• Priority Boost ($C^* \ge 0.60$), Standard Exposure ($0.40 - 0.59$), Basic/Hold ($< 0.40$).<br>• Cold-start neutral seller reliability (0.5), deterministic tie-breaking, cursor pagination, and instant environment rollback (`VISIBILITY_POLICY`). |

### 3. n8n Priority Promotion & Price Reduction Automation

A verification audit of the automated promotion pipeline, Groq AI copywriting (`openai/gpt-oss-20b`), bearer service authentication, 6-hour follow-up scheduling, and seller price floor clamping.

| Note | Focus Area | Key Findings |
| :--- | :--- | :--- |
| `[[06 n8n Priority Promotion and Price Reduction Functional Test Cases]]` | **n8n Priority Promotion Functional Test Suite (N8N-001 to N8N-010)** | • 10/10 test cases verified and 100% implemented.<br>• Background scheduler claims jobs and dispatches webhooks to n8n without blocking.<br>• Groq generates headline ($\le 80$ chars) and caption ($\le 280$ chars) under strict neutrality constraints.<br>• Automated 6-hour price reduction with integer cents arithmetic and seller price floor protection.<br>• Bearer token authentication and stop conditions for sold-out produce. |

---

## Cross-Module Knowledge Base Navigation

* **Intelligence Specification:** `[[Trust and Flagging]]`, `[[Marketing Boost]]`
* **Implementation Delivery:** `[[2026-10-07 Priority Listing Promotions with n8n]]`, `[[2026-10-16 AHP-TOPSIS Marketing Boost Alignment]]`
* **Master Feature Roadmap:** `[[00 Feature Enhancements Index]]`
* **Architecture Constraints:** `[[Architecture and Integrations]]`
* **Open Design Decisions:** `[[Open Decisions#D-04]]`, `[[Open Decisions#D-05]]`, `[[Open Decisions#D-06]]`
