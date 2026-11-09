---
title: AHP-TOPSIS and n8n Technical Specification PDF
type: delivery
date: 2026-11-08
status: active
---

# AHP-TOPSIS and n8n Technical Specification PDF (2026-11-08)

## What changed

Created an 18-page publication-quality technical specification PDF document, two high-resolution pipeline infographic diagrams, and integrated comprehensive academic research references:
- Location: `Agrivive/docs/AHP-TOPSIS and n8n Boost Engine Technical Specification.pdf` (18 pages, 68 KB)
- Visual Diagram 1: `Agrivive/docs/ahp_topsis_ipo_pipeline.png` (2400x1500 high-res IPO architecture)
- Visual Diagram 2: `Agrivive/docs/n8n_seller_flow_pipeline.png` (2400x1550 high-res seller boost execution flow)
- Generator scripts: `scripts/generate_ahp_n8n_spec_pdf.py` and `scripts/generate_pipeline_diagrams.py`

## Related

Up: [[Delivery Index 2026-11]] · [[Delivery Index]] · [[Docs Index]] · [[00-LATEST]] · [[00 Home]]
Algorithms: [[Boost Ranking Flow AHP-TOPSIS]] · [[2026-11-08 AHP-TOPSIS Raw Criteria and Six-Hour Rule]]

## Contents and Structure

The PDF follows the required progression: **Pipeline &rarr; Description &rarr; Step-by-Step Calculation / Execution (with Table, Formula, and Explanation for every step)**.

### Part 1: AHP-TOPSIS Visibility Ranking Pipeline
1. **Pipeline Overview**: 9-phase architectural diagram covering criteria extraction, AHP matrix construction, weight derivation, consistency check, TOPSIS normalization, weighting, ideal solutions, distance separation, relative closeness, and the 6-hour lock rule.
2. **System Description**: Perishability dynamics, criteria definitions (Posting Age, Price Drop, Stock Level, Seller Reliability), and justification for pure Ordinal Ranking over arbitrary score tiers.
3. **Step-by-Step Tables (Tables 1 to 13)**:
   - **Table 1**: Candidate Produce Raw Evaluation Matrix (Kalabasa, Karot, Sigarilyas)
   - **Table 2**: AHP Pairwise Comparison Matrix ($A$) on Saaty 1–9 scale
   - **Table 3**: AHP Column Summation Vector ($S_{\text{col}}$)
   - **Table 4**: Normalized AHP Comparison Matrix ($A_{\text{norm}}$)
   - **Table 5**: AHP Criteria Priority Weight Vector ($w$) ($35.07\%$, $35.07\%$, $18.92\%$, $10.93\%$)
   - **Table 6**: AHP Mathematical Consistency Verification ($\lambda_{\max} = 4.0104$, $CI = 0.00346$, $CR = 0.00384 \le 0.10$)
   - **Table 7**: TOPSIS Euclidean Vector Normalization Denominators
   - **Table 8**: TOPSIS Normalized Decision Matrix ($R$)
   - **Table 9**: TOPSIS Weighted Normalized Decision Matrix ($V$)
   - **Table 10**: Positive Ideal ($A^+$) and Negative Ideal ($A^-$) Reference Solutions
   - **Table 11**: TOPSIS Euclidean Separation Distance Vectors ($S_i^+, S_i^-$)
   - **Table 12**: Relative Closeness Coefficient ($C_i$) and Ordinal Ranking (Sigarilyas: Rank 1 [0.7240], Kalabasa: Rank 2 [0.3159], Karot: Rank 3 [0.2760])
   - **Table 13**: Agrivive 6-Hour Lock Rule & Automated Boost Selection Decision (Rank 1 locked &rarr; Rank 2 Kalabasa boosted)

### Part 2: n8n Marketing Boost & Social Automation Engine
1. **Pipeline Overview**: High-level execution flow covering webhook ingestion, conditional branching, initial syndication, and 6-hour follow-up price drops.
2. **System Description**: Decoupled security architecture ("IDs only, never secrets"), bearer token authorization, Groq LLM prompt hygiene (anti-slop, no em dashes, no invented URLs), and PostgreSQL price persistence.
3. **Step-by-Step Tables (Tables 14 to 28)**:
   - **Table 14**: n8n Boost Workflow Node Manifest & Execution Registry (All 12 nodes)
   - **Table 15**: Node 1: Webhook Ingestion Data Contract (`1. Boost Confirmed`)
   - **Table 16**: Node 2: Conditional Branch Routing Logic (`2. Follow-Up Call?`)
   - **Table 17**: Node 3: Boost Context Data Ingestion (`3. Get Boost Context`)
   - **Table 18**: Node 3b: Idempotency Duplication Guard (`3b. Already Posted?`)
   - **Table 19**: Node 4: Groq AI Copywriting Prompt Formulation (`openai/gpt-oss-20b`)
   - **Table 20**: Node 5: Caption Sanitation & Fallback Logic (`5. Format Caption`)
   - **Table 21**: Node 6: Social Syndication & Persistence (`6. Post to Facebook`)
   - **Table 22**: Node 7: Follow-Up State Ingestion (`7. Get Latest Boost Context`)
   - **Table 23**: Node 8: Dynamic Price Reduction Execution (`8. Reduce Price`)
   - **Table 24**: Node 9: Price Reduction Verification Gate (`9. Price Reduced?`)
   - **Table 25**: Node 10: Groq Flash-Sale Copywriting Formulation
   - **Table 26**: Node 11: Flash-Sale Caption Sanitation & Fallback (`11. Format Caption`)
   - **Table 27**: Node 12: Second Post Syndication & Seller Notification (`12. Post Flash-Sale`)
   - **Table 28**: End-to-End Fault Tolerance, Safety, and Recovery Matrix

### Part 3: Algorithmic Synthesis & Verification Summary
Synthesizes mathematical proof, anti-monopoly boost guarantees, and security decoupling across Capstone test suites WSV-001–WSV-010 and N8N-001–N8N-011.

### Part 4: Research References & Theoretical Foundations
Includes full academic citations, DOIs, and their direct operational role in Agrivive:
- **4.1 MCDM Literature**: Saaty (1987) on AHP, Hwang & Yoon (1981) on TOPSIS, Derakhshan et al. (2022) on rank reversal, Dodevska et al. (2023) on food supply chain MCDM, Biswas et al. (2024) on entropy weights, Duarte (2024) on consistency vectors.
- **4.2 Perishability Economics**: Jiang et al. (2019) on agricultural decay curves, Kokkodis et al. (2022) on purchase-verified review integrity, OECD (2022) on smallholder digital platforms, WIPO (2023) on agricultural supply chain transparency.
- **4.3 Automation & Security**: Fowler (2015) and Newman (2021) on headless microservices and decoupled zero-trust security ("IDs only, never secrets").
- **4.4 Capstone Manuscript**: Bartiquien, Jara & Marundan (2026) *Agrivive: A Web and Mobile Surplus Produce Marketplace with Multi-Criteria Decision Visibility and Automated Social Promotion*, Davao City, Philippines.

## Affected files

- `scripts/generate_ahp_n8n_spec_pdf.py` (created ReportLab PDF generator)
- `scripts/generate_pipeline_diagrams.py` (created Pillow high-res diagram generator)
- `Agrivive/docs/ahp_topsis_ipo_pipeline.png` (created, 2400x1500)
- `Agrivive/docs/n8n_seller_flow_pipeline.png` (created, 2400x1550)
- `Agrivive/docs/AHP-TOPSIS and n8n Boost Engine Technical Specification.pdf` (created, 18 pages, 68 KB)
- `Agrivive/04 Delivery/2026-11-08 AHP-TOPSIS and n8n Technical Specification PDF.md` (this delivery record)

## Verification performed

1. Python PDF build: Executed with Python 3.12, ReportLab 4.4.9, and Google Carlito TrueType fonts (`exit code 0`).
2. Typography & Symbols: Verified 100% native rendering of `⁺`, `⁻`, `₱`, `∑`, `√`, `λ`, `²`, and mathematical sub/superscripts without missing glyphs or boxes.
3. Page inspection: Verified complete generation of all 18 pages using `pypdf`, checking layout balance, table alignments, zebra striping, and two-pass dynamic page numbering (`Page X of 18`).
4. Mathematical validation: Cross-checked all computed matrices ($A, \bar{A}, w, CR, X, R, V, A^+, A^-, S^+, S^-, C_i$) against `backend/src/utils/ahp-topsis/ahp-topsis.test.ts` and `bun test` outputs.
