# Agrivive — Reservation and QR Pickup: System Audit and Test Cases

Audit date: 2026-11-08 · Branch: `ui-enhancements` · Method: static reading of backend, web and mobile code, DB schema, and the vault note `Agrivive/02 Product/Reservation and QR Pickup.md`. **Nothing was executed.** Every test below is `Not Tested`. No source code was changed.

Legend for feature status: **Implemented** (found in code), **Partial**, **Missing** (no field, route or screen found), **Unverified** (code exists but behavior under load or on device is unproven).

---

## Part A — Audit result

| # | Area | Status | What the code actually does (file) |
|---|---|---|---|
| A1 | Product reservation | Implemented | `POST /buyer/orders` (single product) and `POST /buyer/checkouts` (cart, split into one order per seller). Requires an `Idempotency-Key` header. Quantity 0.01–99,999,999, at most 2 decimals. (`buyer.order.create.ts`, `buyer.checkout.create.ts`, `buyer.order.reserve.ts`) |
| A2 | Stock hold | Implemented | Reserve = one conditional `UPDATE sellers_product SET product_qty = product_qty - q WHERE product_qty >= q AND is_active AND is_marketable AND price > 0 AND seller ≠ buyer`. Stock is **decremented immediately**. There are no separate "reserved" or "sold" columns. (`buyer.order.reserve.ts`) |
| A3 | Duplicate reservation prevention | Partial | Only replay protection: same buyer + same `Idempotency-Key` returns the same order (409 if the payload differs). Same product reserved again with a new key creates a second order. No per-buyer, per-product limit. A cart rejects the same product twice (400). |
| A4 | Pickup scheduling (date / time) | **Missing** | No pickup date or time on `orders`, no request field, no UI. Only free text `sellers_profile.pickup_instructions`. Web copy says "Ask the seller for the best pickup time after reserving." |
| A5 | Seller opening hours / closed days | **Missing** | No schema field. |
| A6 | Seller Away mode | **Missing** | No schema field or route. (Account pause/restriction from trust is different: it blocks reservations through `requireActiveUser`.) |
| A7 | Pickup limits per seller | **Missing** | No limit anywhere. |
| A8 | Order status | Partial | Enum is `pending, completed, cancelled, expired` only. No `confirmed`, `preparing`, `ready`, `declined`, `no_show`. The web stepper shows "Reserved → Ready for pickup → Completed", but "Ready for pickup" is just the label for `pending`. (`schema.ts` `order_status`, `OrderPickupStepper.tsx`) |
| A9 | Seller confirmation | **Missing** | Orders are live as soon as created. Seller is only notified. |
| A10 | Seller rejection | Partial | Implemented as seller cancel: `POST /seller/orders/:id/cancel` with a reason of 5+ chars, only while `pending` and not expired. Restores stock, records `seller_cancellation` (2 trust points), notifies buyer. (`seller.order.cancel.ts`) |
| A11 | Buyer cancellation | Implemented | `POST /buyer/orders/:id/cancel`, allowed any time while `pending` and before `expires_at`. **No cutoff time.** Restores stock. Counts toward a cancel counter: warning at 5, pause 12 h at 7, 24 h at 9, 72 h at 10 (90-day window). (`buyer.order.cancel.ts`, `cancellation-policy.ts`) |
| A12 | QR generation | Implemented | `v1.<orderId>.<HMAC-SHA256 base64url>`, signed with `ORDER_QR_SECRET` (min 32 chars). Returned to the buyer as `qrPayload` only while the order is `pending` and `expires_at` is in the future. The payload carries **no expiry and no slot**. (`order-qr/index.ts`, `order-read/index.ts`) |
| A13 | QR validation | Implemented | `POST /seller/orders/scan`: signature check → seller role/active/trust check → order exists → order belongs to this seller → status `pending` → not expired → completes. Errors: 400 invalid payload, 403 other seller, 404, 409 not pending, 410 expired. (`seller.scan-order.ts`) |
| A14 | QR validity window | Implemented as 24 h | `expires_at = now + 24 h` at creation (both create routes). Timer starts at order creation. |
| A15 | QR grace period | **Missing** | The table `seller_scan_grace` is **not** a QR grace period. It lets a seller whose email or profile became unverified finish scanning one order. Same word, different meaning. Do not mix them up in testing. |
| A16 | Pickup completion | Implemented | Sets `completed`, `completed_at`, notifies seller. Optional `items[].dispensedQuantity` for partial handover. |
| A17 | Partial pickup / returned portion | Implemented | If dispensed < reserved, the difference is added back to product stock and the order line and total are recalculated. Dispensed of 0 in total is rejected (400, "cancel instead"). Over-dispense is rejected (400). Restoration is unconditional (no seller choice). |
| A18 | Expiration | Implemented | Worker `expirePendingOrders` (every 60 s): `pending` and past `expires_at` → `expired`, stock restored, buyer gets 2 trust points (`buyer_failed_reservation`), notices queued. Latency up to about 60 s after expiry. |
| A19 | No-show handling | Partial | Automatic only, at expiry. **Seller cannot mark a no-show. Seller cannot excuse one.** No excused state. Penalty is applied without any seller input. |
| A20 | Declined product at pickup (buyer refuses all) | Partial | No "declined" flow. Closest paths: seller cancels the order (counts against seller, 2 points) or lets it expire (counts against buyer, 2 points). |
| A21 | Buyer account restriction | Implemented | Inactive, wrong role, or active trust restriction → 403 on reserve. Own-stall reserve → 403. |
| A22 | Stock negative protection | Partial | Guard is in the `UPDATE ... WHERE product_qty >= q`. **No database CHECK constraint** found on `product_qty` (column is nullable decimal(10,2)). |
| A23 | Automated tests | Missing | No test files for reserve, cancel, scan or expire. The repo has no test runner. |

### Risks seen while reading (all UNVERIFIED — must be proven by TC-INV-07, TC-INV-08)

- **R1 Scan race.** `scanSellerOrder` reads the order without a row lock. If two scans of the same partial-pickup QR run together, both may add the unclaimed amount back to stock before the guarded status update. The second status update then matches 0 rows and the code does not check that. Possible **double stock restore**.
- **R2 Scan versus expiry race.** Same pattern: a partial scan could restore stock while the worker expires the same order and restores the full amount.
- **R3 Stale deploy artifact.** `backend/dist/index.js` is tracked in git and is modified. Docker runs `dist`. Make sure the tested build is the current source.
- **R4 Docs versus code.** The vault note describes available / reserved / sold quantities. The code only has one quantity column.

---

## Part B — Test cases

Conventions
- **Actual Result**: blank. **Status**: `Not Tested` for all.
- Requirement IDs are listed in the Traceability Matrix (`02-Requirements-Traceability-Matrix.md`). `PROF-*` means a requirement from the professor's list. `DOC-*` means the vault note. `CODE-*` means behavior only found in code.
- **⛔ BLOCKED** = the feature does not exist or the rule is undecided. The test is written so it can run once the feature exists. The expected result says "rule pending" and points to a question in `05-Requirement-Conflicts-and-Professor-Questions.md` (Q-xx). We do **not** pick a rule.
- Sample data: Buyer **B1** (`buyer1@test.local`), Buyer **B2**, Seller **S1** (verified, profile complete), Seller **S2**. Product **P1** "Tomato" 10 kg ₱40/kg, sold by S1. Product **P2** "Eggplant" 3 kg, sold by S2. Header `Idempotency-Key: key-001`.
- Evidence column: SS = screenshot, API = request/response capture, DB = query result, VID = screen recording, LOG = server log.

### B1. Reservation

| ID | Requirement | Scenario | Preconditions | Test Steps | Sample Data | Expected Result | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| TC-RSV-01 | DOC-01, CODE-01 | Buyer reserves an available product | B1 active; P1 has 10 kg | 1. `POST /buyer/orders` with key-001 | `{productId: P1, quantity: 2}` | 200/201. Order `pending`, total ₱80.00, `qrPayload` present, `expiresAt` ≈ now+24 h. P1 stock = 8.00. S1 gets a notification. | | Not Tested | API, DB (`product_qty`, `orders`), SS |
| TC-RSV-02 | DOC-01 | Reserve exactly the remaining stock | P1 has 2 kg | Reserve 2 kg | quantity 2 | Success. P1 stock = 0.00. Not negative. | | Not Tested | API, DB |
| TC-RSV-03 | DOC-03 | Insufficient stock | P1 has 2 kg | Reserve 2.01 kg | quantity 2.01 | 409 "Product price or quantity is unavailable". No order row. P1 stock still 2.00. | | Not Tested | API, DB |
| TC-RSV-04 | DOC-03, PROF-RSV | Two buyers race for the last stock | P1 has 5 kg; B1, B2 active | Fire both requests at the same instant, each 5 kg, different keys | quantity 5 each | Exactly one 2xx and one 409. P1 stock = 0.00. Exactly one order. | | Not Tested | API (both), DB |
| TC-RSV-05 | CODE-02 | Same request replayed (retry) | TC-RSV-01 done | Repeat TC-RSV-01 with the same key and body | key-001 | Same order id returned, `replayed: true`. Stock not reduced again. | | Not Tested | API, DB |
| TC-RSV-06 | CODE-02 | Same key, different quantity | TC-RSV-01 done | `POST` with key-001 and quantity 3 | key-001, qty 3 | 409 "Idempotency key was used for another order". | | Not Tested | API |
| TC-RSV-07 | PROF-DUP | Duplicate reservation: same buyer, same product, new key | B1 already has pending order for P1 | `POST` with key-002, same product | key-002 | **Current code behavior to record:** second order is created (no rule blocks it). Pass/fail depends on the professor's answer (Q-09). | | Not Tested | API, DB |
| TC-RSV-08 | CODE-03 | Missing / empty / 129-char Idempotency-Key | none | Send no header; then empty; then 129 chars | — | 400 each. No stock change. | | Not Tested | API |
| TC-RSV-09 | CODE-04 | Quantity validation | none | Quantity 0, 0.005, -1, 100000000, "abc" | — | 400/422 each. Valid only 0.01 to 99,999,999 with 2 decimals. | | Not Tested | API |
| TC-RSV-10 | CODE-05 | Product not reservable | P1 archived, or `isMarketable` false, or price 0 | Reserve P1 | — | 409 unavailable. Stock unchanged. | | Not Tested | API, DB |
| TC-RSV-11 | CODE-05 | Product does not exist | none | Reserve random UUID | random uuid | 404 "Product not found". | | Not Tested | API |
| TC-RSV-12 | CODE-06 | Seller reserves own product | S1 also has buyer role | S1 reserves P1 | — | 403 "You cannot reserve items from your own stall…". | | Not Tested | API |
| TC-RSV-13 | PROF-ACC, CODE-07 | Buyer paused by trust (cancel counter or violation points) | B1 has an active `temporary_restriction` | Reserve P1 | — | 403 with the pause message and remaining time. Stock unchanged. | | Not Tested | API, SS (web/mobile message) |
| TC-RSV-14 | PROF-ACC | Buyer account blocked / inactive | B1 `isActive=false` | Reserve P1 | — | 403 "buyer account is not active". | | Not Tested | API |
| TC-RSV-15 | CODE-07 | Seller account paused or unverified at reserve time | S1 restricted | B1 reserves P1 | — | 403. Whole transaction rolled back (stock not reduced). | | Not Tested | API, DB |
| TC-RSV-16 | DOC-04 | Multi-seller cart | P1 (S1), P2 (S2) | `POST /buyer/checkouts` with both | P1 2 kg, P2 1 kg | Two orders, one per seller, same checkout id. Two stock decrements. | | Not Tested | API, DB |
| TC-RSV-17 | DOC-04 | Cart where one item is short | P2 has 0.5 kg | Cart with P1 2 kg + P2 1 kg | — | Whole checkout fails (409). **P1 stock NOT reduced** (rollback). | | Not Tested | API, DB |
| TC-RSV-18 | CODE-01 | Duplicate product in cart | none | Cart with P1 twice | — | 400 "Each product can only appear once in the cart". | | Not Tested | API |

### B2. Pickup date, time, hours, limits, Away mode (⛔ all blocked: features not found)

| ID | Requirement | Scenario | Preconditions | Test Steps | Sample Data | Expected Result | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| TC-PKP-01 | PROF-DATE | ⛔ Buyer selects a pickup date | Feature does not exist | Open reserve screen; look for a date control | — | Rule pending (Q-06: today/tomorrow vs seller max advance days). First run: **record that no date control exists.** | | Not Tested | SS (web + mobile) |
| TC-PKP-02 | PROF-DATE | ⛔ Only permitted dates are selectable | Seller allowed days defined | Try a date outside the allowed range through UI and API | today+30 | Rejected in UI and API (400). Range per Q-06. | | Not Tested | SS, API |
| TC-PKP-03 | PROF-TIME | ⛔ Buyer selects a pickup time | Feature does not exist | Select a time slot | 10:00 | Slot saved on the order and shown to both sides. | | Not Tested | SS, API, DB |
| TC-PKP-04 | PROF-HRS | ⛔ Seller opening hours respected | S1 open 08:00–17:00 | Pick 07:30 and 17:30 | 07:30, 17:30 | Both rejected. Times inside hours accepted. | | Not Tested | API |
| TC-PKP-05 | PROF-CLOSED | ⛔ Seller closed day | S1 closed Sunday | Pick a Sunday | next Sunday | Date not offered. API rejects it. | | Not Tested | SS, API |
| TC-PKP-06 | PROF-LAST30 | ⛔ Last 30 minutes before closing | S1 closes 17:00 | Pick 16:45 | 16:45 | Behavior per Q-07 (blocked or allowed). Must be consistent in UI and API. | | Not Tested | SS, API |
| TC-PKP-07 | PROF-LIMIT | ⛔ Seller pickup limit reached | S1 limit N per slot/day (Q-08) | Make N+1 reservations for one slot | N+1 | The (N+1)th is rejected with a clear message; stock not reduced. | | Not Tested | API, DB |
| TC-PKP-08 | PROF-AWAY | ⛔ Seller Away mode on | S1 Away on | B1 reserves P1 | — | Rule pending (Q-10): blocked, or reserve allowed for later dates. Existing pending orders handled per Q-10. | | Not Tested | SS, API |
| TC-PKP-09 | PROF-AWAY | ⛔ Away mode turned off | S1 Away off | B1 reserves P1 | — | Reservation works again. | | Not Tested | API |
| TC-PKP-10 | PROF-DATE | ⛔ Buyer changes date after reserving | Order pending | Look for reschedule control | — | Rule pending (new question for professor, see Q-14). Record the current behavior (no control). | | Not Tested | SS |

### B3. Order management

| ID | Requirement | Scenario | Preconditions | Test Steps | Sample Data | Expected Result | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| TC-ORD-01 | DOC-01 | Order creation visible both sides | TC-RSV-01 done | Buyer opens order; seller opens orders list | — | Both see the order `pending`, correct items, total, reference `RSV-XXXX`. Buyer sees QR. Seller does not get QR. | | Not Tested | SS (web, mobile) |
| TC-ORD-02 | PROF-CONF | ⛔ Seller confirmation | Feature does not exist | Seller looks for Confirm | — | Rule pending (Q-04). Record: no status `confirmed`; order is already live at creation. | | Not Tested | SS, DB |
| TC-ORD-03 | PROF-REJ, CODE-08 | Seller rejects (cancel with reason) | Order pending | `POST /seller/orders/:id/cancel` reason "Out of stock today" | reason ≥5 chars | Status `cancelled`, `cancelledBy=seller`, stock restored, seller gets 2 trust points + warning notice, buyer notified. | | Not Tested | API, DB, SS |
| TC-ORD-04 | CODE-08 | Seller cancel with short reason | Order pending | reason "no" | "no" | 400 "Cancellation reason is required". Order stays `pending`. | | Not Tested | API |
| TC-ORD-05 | PROF-PREP | ⛔ Preparing | Feature does not exist | Look for "Preparing" status | — | Rule pending (Q-04). Record absence. | | Not Tested | SS |
| TC-ORD-06 | PROF-READY | ⛔ Ready for pickup | Only a label exists | Check order progress for a pending order | — | Today the stepper shows "Ready for pickup" for **every** pending order from the moment of reserving. Record this and compare to the professor's definition (Q-04). | | Not Tested | SS |
| TC-ORD-07 | DOC-01 | Completed order | Order pending, QR valid | Seller scans QR (see QR section) | — | Status `completed`, `completedAt` set, QR no longer shown to buyer ("Pickup pass inactive"), stepper shows Completed. | | Not Tested | SS, DB |
| TC-ORD-08 | DOC-02 | Buyer cancels while pending | Order pending, not expired | `POST /buyer/orders/:id/cancel` | — | `cancelled`, `cancelledBy=buyer`, stock restored, seller notified, cancel counter +1. | | Not Tested | API, DB |
| TC-ORD-09 | DOC-02 | Buyer cancels twice | TC-ORD-08 done | Cancel again | — | 409 "Order is no longer pending". Stock restored **only once**. | | Not Tested | API, DB |
| TC-ORD-10 | DOC-02 | Buyer cancels an expired order (before worker runs) | Order past `expires_at`, worker stopped | Cancel | — | 410 "Order has expired". | | Not Tested | API |
| TC-ORD-11 | PROF-CANC | ⛔ Buyer cancels "before seller confirmation" | Feature does not exist | — | — | Cannot run until confirmation exists (Q-03). Current code: buyer can cancel any time while pending. | | Not Tested | — |
| TC-ORD-12 | PROF-CANC, PROF-CUT | ⛔ Buyer cancels after confirmation / inside cutoff | Cutoff rule undecided (Q-03, Q-05) | Cancel 1 h, 2 h, 3 h and 5 h before the slot | — | Behavior per approved rule. Record current behavior: always allowed with no cutoff. | | Not Tested | API |
| TC-ORD-13 | CODE-09 | Another buyer cancels my order | B2 token | `POST /buyer/orders/<B1 order>/cancel` | — | 404 "Order not found". No change. | | Not Tested | API |
| TC-ORD-14 | CODE-09 | Another seller cancels or reads the order | S2 token | `POST /seller/orders/<S1 order>/cancel`, then GET | — | 403 or 404. No change. | | Not Tested | API |
| TC-ORD-15 | DOC-05 | Order expires (24 h) | Order pending, set `expires_at` to the past in a test DB | Wait for the worker (≤60 s) | — | `expired`, `expiredAt` set, stock restored once, buyer gets 2 trust points + notice, seller gets "reservation ended". | | Not Tested | DB, LOG, SS |
| TC-ORD-16 | DOC-05 | Worker run twice in a row | TC-ORD-15 done | Trigger the job again | — | No double restore, no double trust points (dedupe keys). | | Not Tested | DB |
| TC-ORD-17 | CODE-10 | Buyer cancel counter and pauses | Fresh buyer in test DB | Cancel 5, 7, 9, 10 orders in 90 days | — | 5–6: warning. 7: 12 h pause. 9: 24 h. 10: 72 h. Next reserve gets 403 with the pause message. | | Not Tested | API, SS |
| TC-ORD-18 | DOC-01 | Order list / filters / progress display | Orders in all four statuses | Open buyer orders (web), seller orders (mobile), filter tabs | — | Each order is in the right tab; badge and stepper match the DB status. | | Not Tested | SS |

### B4. QR pickup

| ID | Requirement | Scenario | Preconditions | Test Steps | Sample Data | Expected Result | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| TC-QR-01 | DOC-06 | QR generated for pending order | Order pending | Buyer opens order on web and mobile | — | QR shows. Payload format `v1.<uuid>.<43 chars>`. `qrPayload` is `null` for any other status. | | Not Tested | SS, API |
| TC-QR-02 | DOC-06 | Valid scan completes pickup | Order pending, S1 token | `POST /seller/orders/scan` with payload | `{qrPayload}` | 200. Order `completed`. Stock unchanged (already deducted). | | Not Tested | API, DB |
| TC-QR-03 | DOC-06 | Valid scan with the seller app camera | Order pending | Scan on-screen QR with seller app, confirm handover | — | Handover sheet appears; confirm → "Pickup done" screen. | | Not Tested | VID |
| TC-QR-04 | DOC-06 | Invalid QR: random text | none | Scan `hello` | `hello` | 400 "Invalid order QR payload" (mobile: "Invalid Code"). No DB change. | | Not Tested | API, SS |
| TC-QR-05 | DOC-06 | Tampered signature | Order pending | Change one character of the signature | — | 400 invalid payload. Order still `pending`. | | Not Tested | API, DB |
| TC-QR-06 | DOC-06 | Tampered order id (valid format) | two pending orders | Use order A id with order B signature | — | 400 invalid payload. | | Not Tested | API |
| TC-QR-07 | DOC-06 | Wrong order QR: belongs to another seller | Order of S1; S2 token | S2 scans it | — | 403 "This order belongs to another seller". Order unchanged. | | Not Tested | API, DB |
| TC-QR-08 | DOC-06, CODE-11 | Expired QR | Order past `expires_at` | Scan | — | 410 "Order has expired". Not completed. | | Not Tested | API |
| TC-QR-09 | DOC-06 | Repeated scan | TC-QR-02 done | Scan again | — | 409 "Order is no longer pending". No second completion. | | Not Tested | API, DB |
| TC-QR-10 | DOC-06 | QR for a cancelled order | Order cancelled | Scan old QR image | — | 409. Buyer app shows no QR for this order. | | Not Tested | API, SS |
| TC-QR-11 | DOC-06 | QR for an expired (worker-processed) order | Order `expired` | Scan | — | 409. | | Not Tested | API |
| TC-QR-12 | PROF-QR-SLOT | ⛔ QR valid only in the pickup slot + grace | Slot feature missing | Scan before, inside, just after, long after the slot | — | Rule pending (Q-01, Q-02). Current code: QR works any time within 24 h of creation. | | Not Tested | API |
| TC-QR-13 | PROF-QR-GRACE | ⛔ Grace period boundary | Grace length undecided | Scan at slot end + grace − 1 s, + 1 s | — | Accepted / rejected at the boundary. | | Not Tested | API |
| TC-QR-14 | DOC-06 | QR copied to another transaction | Orders A and B pending (same seller) | Scan A's QR, then try to use A's payload for B | — | A completes. B unaffected. Payload binds one order id. | | Not Tested | API, DB |
| TC-QR-15 | DOC-06 | Scan by a non-seller (buyer token) | — | Buyer token calls scan | — | 403 (role). | | Not Tested | API |
| TC-QR-16 | DOC-06 | Scan with a paused or trust-restricted seller | S1 restricted | Scan | — | 403. Order stays `pending`. | | Not Tested | API |
| TC-QR-17 | CODE-12 | Seller lost email verification mid-order (`seller_scan_grace`) | Order has a `seller_scan_grace` row in the future | Scan | — | Scan allowed for that order only. After `grace_until`, 403. | | Not Tested | API, DB |
| TC-QR-18 | DOC-06 | Partial pickup | Order 4 kg of P1 pending | Scan with `items:[{itemId, dispensedQuantity: 3}]` | 3 of 4 kg | `completed`, line = 3.00 kg, total recalculated, **+1.00 kg to P1 stock**. | | Not Tested | API, DB |
| TC-QR-19 | DOC-06 | Dispensed more than reserved | Order 4 kg | dispensed 4.5 | — | 400. No change. | | Not Tested | API |
| TC-QR-20 | DOC-06 | Dispensed total zero | Order 4 kg | dispensed 0 | — | 400 "Cannot complete handover with 0 amount…". No change. | | Not Tested | API, DB |
| TC-QR-21 | DOC-06 | Negative dispensed | Order 4 kg | dispensed -1 | — | 400 (schema or service). | | Not Tested | API |

### B5. No-show and declined pickup

| ID | Requirement | Scenario | Preconditions | Test Steps | Sample Data | Expected Result | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| TC-NSH-01 | DOC-05, CODE-13 | QR expires without a scan | Order pending past `expires_at` | Wait for worker | — | `expired`; buyer gets `buyer_failed_reservation` (2 points) and a warning notice; stock restored. | | Not Tested | DB (`trust_events`), SS |
| TC-NSH-02 | PROF-NSH | ⛔ Seller marks buyer as no-show only when permitted | Feature does not exist | Look for a "Mark no-show" control | — | Rule pending (Q-11: when allowed). Record that the system flags no-shows automatically only. | | Not Tested | SS |
| TC-NSH-03 | PROF-NSH | ⛔ Seller tries to mark no-show before the slot ends | Feature missing | — | — | Must be rejected (when permitted: Q-11). | | Not Tested | API |
| TC-NSH-04 | PROF-EXC | ⛔ Seller excuses a no-show (accepted reason) | Feature missing | Excuse with a reason | — | Penalty not applied or reversed (Q-12: list of accepted reasons). | | Not Tested | API, DB |
| TC-NSH-05 | PROF-EXC | ⛔ Excused no-show leaves no wrong penalty | After TC-NSH-04 | Check buyer trust points, notices, restriction | — | Points unchanged, no warning/restriction, no violation notice. | | Not Tested | DB, SS |
| TC-NSH-06 | CODE-13 | Penalty thresholds after repeated expiry | Fresh buyer | Let 2, 3, 4, 5, 6 orders expire | — | 4 points: warning. 6 points: 12 h restriction. 8 points: 24 h. 10 points: 72 h. 12 points: blocked. | | Not Tested | DB, SS |
| TC-NSH-07 | PROF-DECL | ⛔ Buyer declines products at pickup | Feature missing | Seller records the refusal | — | Rule pending (Q-05b: stock restored or not; trust effect). Current: use partial scan or seller cancel. | | Not Tested | — |
| TC-NSH-08 | CODE-08 | Seller cancel is penalized | Order pending | Seller cancels with reason | — | Seller gets 2 points; buyer gets a notice and **no** trust points. | | Not Tested | DB |

---

## Part C — Execution notes

- Run API tests in OpenAPI (`:3000`) or Postman. Run time-based cases (expiry, grace) on a **test database**, by editing `orders.expires_at` directly. Never do this on production.
- Required env: `ORDER_QR_SECRET` (32+ chars), `DATABASE_URL`, `TRUST_ACTIONS_ENABLED` (default on). Run exactly one worker for TC-ORD-15, 16 and TC-NSH-01, 06.
- Build under test: record the git commit and whether `backend/dist` was rebuilt (risk R3).
- A test is **Passed** only after someone runs it and the evidence is attached. Until then everything stays `Not Tested`.
