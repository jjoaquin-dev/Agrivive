---
title: Agrivive MBA Synthetic Buyer UX Simulation
type: delivery
status: ready
date: 2026-09-28
---

# Agrivive MBA Synthetic Buyer UX Simulation

Prepared a classroom-ready market basket analysis (MBA) simulation for the professor's review. This is a paper prototype and data demonstration; it does not claim real buyer behavior or represent an implemented feature.

## What changed and why

- Created a four-page research and buyer UX handout that explains MBA, reports a seeded synthetic example, checks the existing buyer discovery UI, and proposes an explicitly labeled “Goes well with” panel.
- Created separate synthetic CSV files for 260 completed-pickup baskets and six directed association rules, so the calculations can be reviewed independently.
- Used six research papers published from 2020 through 2024 to support the method and discuss its limits.
- Confirmed the current web buyer experience has category-based “Similar produce”; this source path contains no co-purchase rule logic. The MBA panel is therefore shown as a proposal, not a live integration.
- No mobile, web, backend, or database application code was changed.

## Deliverables

- `../../artifacts/agrivive-ad/mba-simulation/Agrivive_MBA_Simulation_Brief.pdf`
- `../../artifacts/agrivive-ad/mba-simulation/synthetic_completed_pickups.csv`
- `../../artifacts/agrivive-ad/mba-simulation/mba_rules_synthetic_only.csv`

## Affected paths

- Created: `artifacts/agrivive-ad/mba-simulation/Agrivive_MBA_Simulation_Brief.pdf`
- Created: `artifacts/agrivive-ad/mba-simulation/synthetic_completed_pickups.csv`
- Created: `artifacts/agrivive-ad/mba-simulation/mba_rules_synthetic_only.csv`
- Inspected only: `web/src/features/marketplace/components/SimilarProduceSection.tsx`

## Verification

- Confirmed 430 item rows, 260 unique transaction baskets, 10 products, four fictional sellers, and six synthetic directed rules; every row is labeled synthetic and completed pickup.
- Confirmed the PDF is four A4 pages and rendered all pages for visual inspection. Table header contrast was corrected and checked.
- Confirmed all six cited studies are from 2020–2024.
- No app integration or live-data behavior was tested because none was changed.
