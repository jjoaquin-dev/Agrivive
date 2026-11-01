---
title: Boost Retry Shows Old Failure
type: delivery
date: 2026-11-02
---

# Boost Retry Shows Old Failure

## Problem
On the Boost tab a listing showed "Boost did not post". Tapping Boost sent it again, but the next screen said "Your boost did not post" for Facebook and Instagram. Going back, the list said "Posting now".

## Cause
A retry puts the same boost row back in the queue. It kept its old `sentAt`, and the channel check read post logs from the boost's first `createdAt`. So the old try (old time, old failed logs) made both pages look failed. The screen also stopped checking, because "failed" counts as an answer.

## Change
- `seller.visibility-boost.queue.ts`: both retry paths (failed, and sent but stuck) now clear `sentAt`.
- `seller.visibility-boost.channels.ts`: no `sentAt` means not sent yet, so both pages show "Waiting to post" (or "Did not post" if the boost itself failed to send). Once sent, only logs from `sentAt` on count.
- `dist/index.js` rebuilt (tracked in git).

## Checked
`bunx tsc --noEmit` passed, 33 tests pass, API and worker builds passed. No device check yet; the API must be rebuilt and recreated.

## Test
`POST /seller/products/:id/boost` on a listing that shows "Boost did not post". Then `GET /seller/products/:id/boost`: `boost.channels.facebook.status` and `instagram.status` should be `waiting`, then `posting`, then `posted` or `failed` for the new try.
