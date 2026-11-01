---
title: Marketing Boost Hub Reference
type: delivery
date: 2026-11-01
---

# Marketing Boost Hub Reference

## What changed

Compared the Stitch "Marketing v1" frames (project `11184471743007910085`: hub Running, History, How Buyers Find You, Preview Boost, Boost started) with the app. The structure already matched from earlier Boost work, so only the gaps were changed.

- Hub title is now "Boost". The old "Marketing" header is gone; one banner ("Share your produce on the Agrivive Facebook and Instagram pages for free." with flame icon and Facebook/Instagram badges) sits above the tabs on every tab.
- Tabs: "Running" (with count), "History", "How Buyers Find You" (wraps to two lines).
- Running: "Price dropped" heading, "Not Now", "Running boosts (N)", empty "No boosts running / Boost your produce to share it on Facebook and Instagram."
- Boost cards: "Price now" and "Lowest price".
- How Buyers Find You: "How high your listings show when buyers browse."
- Preview Boost: sticky bottom bar with "Boost on Facebook & Instagram" (megaphone icon) and "See boost history"; the extra Back button is removed (the header already has one).
- Boost started: "What happens now".

Not applied: the Facebook/Instagram selector tiles on Preview (the app posts to both, a selector would add a choice that does nothing), the History filter chip row and pagination wording, and the "Why?" expand and Show 3/5/10 paging on How Buyers Find You (not compared against the current cards). Frame A2 (empty Running) could not be viewed.

## Files

- `mobile/app/(app)/marketing/index.tsx`, `[productId].tsx`, `started.tsx`, `mobile/app/(app)/_layout.tsx`
- `mobile/src/features/marketing/components/`: `SocialHubBanner.tsx`, `MarketingSectionTabs.tsx`, `ActiveBoostsSection.tsx`, `PriceDropPromptList.tsx`, `BoostHistoryCard.tsx`, `VisibilityGuideSection.tsx`

## Verification

`bun run typecheck` in `mobile/` passed. Not run on a device. Boost requests and polling are unchanged.
