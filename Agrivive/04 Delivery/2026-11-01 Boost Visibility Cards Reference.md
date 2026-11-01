---
title: Boost Visibility Cards Reference
type: delivery
date: 2026-11-01
---

# Boost Visibility Cards Reference

## What changed

Second pass on the Stitch "Marketing v1" frames (project `11184471743007910085`). Checking the code first showed that the Facebook/Instagram selector tiles on Preview Boost and the History filter chips with paging already existed, so those were left alone. The earlier note listed them as not applied; that was wrong.

- How Buyers Find You card rebuilt: name and PRD code, badge ("Top spot" with star, "Middle", "Lower", "Not shown yet"), plain line ("Buyers see this near the top."), four-segment bar with "Score 71 of 100" (score x 100, shown to the nearest whole number), "Price lowered · ₱60 → ₱54" chip, existing boost chip, and two equal buttons "Why?" and "Boost" / "View Boost".
- "Why?" shows four bars with plain names (Fresh 40%, Amount left 30%, Reliability 20%, Sells often 10%) and "Fresher, bigger, reliable listings show higher." A missing value shows "—".
- Running empty state: flame icon, "No boosts running", "Boost a product from your Listings to share it.", "Go to Listings".
- History: a card that did not post gets a red-tinted border, an error row with an icon, and a red "Try Again" button (opens the same Boost screen as before).
- Paging label for the guide now says "listings".

## Files

- `mobile/src/features/marketing/components/`: `VisibilityBreakdownCard.tsx`, `VisibilityFactorsGrid.tsx`, `ActiveBoostsSection.tsx`, `BoostHistoryCard.tsx`, `VisibilityGuideSection.tsx`

## Verification

`bun run typecheck` in `mobile/` passed. Not run on a device. The tier names from the server ("priority", "standard", "basic") are unchanged; only the words shown to sellers changed. Not compared: Preview Boost cases C3 (not allowed) and the Boost started variants D1/D3.
