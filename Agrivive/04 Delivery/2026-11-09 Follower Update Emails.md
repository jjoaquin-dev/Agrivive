---
title: Follower Update Emails
type: changelog
date: 2026-11-09
---

# 2026-11-09 Follower Update Emails

Up: [[Delivery Index 2026-11]] · Latest: [[00-LATEST]]

**Problem:** Buyers who follow a seller got an in-app notice and a push for new listings, price drops and restocks, but no email.

**Change:** `backend/src/jobs/email-listing-notices.ts` emails each follower once per update. Only followers of that seller have a notice row, so a buyer never gets an email about a seller they do not follow. Updates older than 24 hours are not emailed, an inactive account is skipped, and an email failure retries up to 5 times without stopping other jobs. The email names the shop and product, links to the listing and says how to stop it (unfollow).

**Schema:** `buyer_listing_notices.email_sent_at` and `email_attempts`. Migration `20261109130000_follower_listing_emails` marks old notices as already sent. Not applied anywhere yet; until it is, the email step logs an error and skips.

**Verification:** `bunx tsc --noEmit` shows only the 4 old test-file errors. Not sent to a real inbox yet.

**Open:** there is no separate email on/off setting; unfollowing is the only way to stop them.
