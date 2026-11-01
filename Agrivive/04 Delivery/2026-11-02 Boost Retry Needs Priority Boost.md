---
title: Boost Retry Needs Priority Boost
type: delivery
date: 2026-11-02
---

# Boost Retry Needs Priority Boost

## Why
The paper lets only Priority Boost listings (score 0.60 or higher) qualify for the boost. The app skipped that check when a boost already existed for the cycle, so a listing that had fallen to Basic/Hold could still post again by retrying a failed boost.

## Change
- `seller.visibility-boost.queue.ts`: the Priority Boost check now runs before every new post: a first boost, a retry of a failed boost, and a re-send of a stuck one. A boost that is already posted or in progress is not checked again.
- `seller.visibility-boost.read.ts`: the same rule decides `canBoost` and the headline, so the Boost screen says "Priority Boost Needed" instead of offering a retry.
- `dist/index.js` rebuilt.

## Checked
Backend typecheck passed, 33 tests pass, API and worker builds passed. No device check.

## Test
On a listing that shows "Boost did not post" and is now Basic/Hold: `GET /seller/products/:id/boost` returns `eligibility.canBoost: false` and headline "Priority Boost Needed". `POST /seller/products/:id/boost` returns 409 "Boost opens at Priority Boost. This listing is Basic/Hold right now."
