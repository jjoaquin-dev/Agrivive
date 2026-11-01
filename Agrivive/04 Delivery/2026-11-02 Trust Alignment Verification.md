# 2026-11-02 Trust Alignment Verification

Second pass over [[2026-11-02 Trust and Rating Paper Alignment]]. This time the code was run against a real (in-memory) PostgreSQL built from all 51 migrations, not only type-checked.

## Found and fixed
- Timer queues could be crowded out: rows that were skipped (blocked seller, chat that already had an open question) stayed in the "due" list, and with more than 100 of them later rows would never be reached. The checks are now part of the query in `process-inquiries.ts` and `process-chats.ts`.

## Checked and working
- All 51 migrations, including the table drop and `20261102140000_trust_alignment`, apply to an empty database with no errors; the three old tables are gone and the four new columns exist.
- 12h reminder, 24h warning plus buyer notice, 48h non-responsive flag for product questions and direct chats; running the job twice changes nothing; blocked sellers are not timed; 130 skipped rows no longer hide a real one.
- Correction requests check the right source for order questions, product questions and chats.
- Score steps: nothing at 3 points, warning at 4, pauses at 6, 8 and 10 (12 hours, 24 hours, 3 days) with a reason that names the real cause, block at 12, no second block while one is open. One QR-misuse violation blocks at once; after restore the old one is not counted again.
- Reports: one report or two from the same person stays an allegation; two different people confirm one violation, four confirm two; "pickup problem" never counts; two QR-misuse reports block the account.
- Chat messages: a direct chat starts waiting on the first buyer message and keeps its start, a seller reply clears it and answers all open questions; a product chat opens a question from the chat's own product; an order chat opens a question only while the reservation is active.
- Inactivity: a buyer or seller blocks at 31 days and warns at 25; admin and stakeholder accounts are untouched.
- A 5-star review does not touch the trust score; a 1-star review does and writes a "low ratings" reason.
- Product reviews: list, filter, answer once, other sellers cannot answer, the buyer product page shows the answer.
- A restricted seller sees the stored reason and the time left, with one "come back in".
- Breaking the blocking rule on purpose made the new tests fail, so they do test it.

## Not covered
Phone screens, the real server, the email sending, and the Elysia route layer (these were called through their services). The test setup lives outside the project (it needs PGlite), so only the 11 policy tests are in the repo.
