# Requirement Conflict Report and Professor Clarification Questions

No rule has been chosen in this document. Where a rule is undecided, tests are written as "per approved rule" and stay blocked.

Evidence level: **Code** = read in the repo on 2026-11-08. **Doc** = vault or README text. **Unverified** = from the QA request only; the professor's original document was not found in the repo (`docs/` does not exist, although a memory note mentions a capstone PDF there).

---

## Part 1 — Conflicts

### C-01 QR validity: 24 hours versus pickup slot plus grace
| | |
|---|---|
| Existing documented rule | QR valid 24 hours from order creation (vault note; capstone summary; web copy "Reservations expire after 24 hours"). |
| New proposed rule | QR valid only during the selected pickup slot plus a grace period. |
| Current code behavior | `expires_at = now + 24 h` in both create routes. QR payload has no time in it; validity is `status = pending and expires_at > now`. No slot exists, so a slot-based rule cannot be applied today. |
| Impact on testing | TC-QR-08 tests the 24 h rule today. TC-QR-12, 13 are blocked. If the slot rule wins, TC-QR-08, TC-ORD-15, TC-NSH-01 and the stepper copy tests change. |
| Question | Q-01, Q-02 |

### C-02 Cancellation before versus after seller confirmation
| | |
|---|---|
| Existing documented rule | "Buyer cancels while eligible" (vault). Eligibility is not defined (open decision D-04). |
| New proposed rule | Different cancellation treatment before and after seller confirmation. |
| Current code behavior | No confirmation step exists. Buyer can cancel any time while the order is `pending` and not expired. |
| Impact on testing | TC-ORD-11, 12 blocked. TC-ORD-08 documents today's behavior. |
| Question | Q-03, Q-04 |

### C-03 Late cancellation penalties
| | |
|---|---|
| Existing documented rule | Buyer cancel counter: warning at 5, pause 12 h at 7, 24 h at 9, 72 h at 10, counted in a 90-day window. Every cancel counts the same. Separate: expired (unscanned) reservation = 2 trust points. |
| New proposed rule | A penalty for late cancellation (not defined). |
| Current code behavior | No "late" concept. A cancel 1 minute or 23 hours after reserving counts the same. Cancel does not add trust points. |
| Impact on testing | TC-ORD-17 covers the counter. A late-cancel test cannot be written until "late" is defined. |
| Question | Q-05, Q-15 |

### C-04 Declined or returned products: back to stock or not
| | |
|---|---|
| Existing documented rule | Cancelled, expired and partial-pickup quantities return to available stock (vault table; delivery note 2026-10-18). |
| New proposed rule | Professor's list asks whether declined or returned products go back into available stock, implying "where allowed". |
| Current code behavior | Always restored: cancel, expiry, and the unclaimed part of a partial scan. No seller choice, no reason, no "declined" state. Nothing marks produce as spoiled or not resellable. |
| Impact on testing | TC-QR-18, TC-INV-06 to 08 test unconditional restoration. If the rule is "only if still fresh", a new seller choice and tests are needed. |
| Question | Q-05b, Q-13 |

### C-05 Pickup date: today/tomorrow versus seller-configured maximum advance days
| | |
|---|---|
| Existing documented rule | None found. |
| New proposed rule | Two variants: only today or tomorrow; or the seller sets a maximum number of advance days. |
| Current code behavior | No pickup date at all. |
| Impact on testing | TC-PKP-01, 02 blocked. The valid-date range cannot be defined until one variant is chosen. |
| Question | Q-06 |

### C-06 Pickup-by date versus freshness claims
| | |
|---|---|
| Existing documented rule | Listings are surplus produce. The project owner decided not to keep a product "condition" field (memory note 2026-11-01), although the schema still has `condition` (default `needs_inspection`). The paper's shelf-life question (Q10) is not in code. |
| New proposed rule | A pickup-by date must not contradict freshness claims. |
| Current code behavior | No pickup-by field. Mobile has a "stock freshness warning" modal for sellers. Buyers only see the 24 h reservation text. |
| Impact on testing | No testable rule today. A far-future pickup date on perishable produce would be accepted without a warning once dates exist. |
| Question | Q-13 |

### C-07 Cancellation cutoff: 2 hours or 3 hours
| | |
|---|---|
| Existing documented rule | None. |
| New proposed rule | Examples of 2 hours or 3 hours before the pickup time. |
| Current code behavior | No cutoff; no pickup time to measure from. |
| Impact on testing | TC-ORD-12 uses 1 h, 2 h, 3 h, 5 h so it can work with either value. |
| Question | Q-05 |

### C-08 Seller-initiated no-show marking and excuses
| | |
|---|---|
| Existing documented rule | Trust rules: an unpicked reservation gives the buyer 2 points. It is applied by the system at expiry. |
| New proposed rule | Seller marks the buyer as no-show only when permitted; seller can excuse it for an accepted reason. |
| Current code behavior | Fully automatic. Seller has no control. There is a "pickup problem" report type, but a report alone is zero points until two different people confirm it. |
| Impact on testing | TC-NSH-02 to 05 blocked. Risk: with a slot-based QR, the auto penalty may fire at a different moment than the seller expects. |
| Question | Q-11, Q-12 |

### C-09 Documentation and code mismatches (not from the professor)
| Item | Doc says | Code does |
|---|---|---|
| Quantity model | Available, reserved, sold, remaining | One `product_qty`. Reserved is already subtracted. |
| Status model | Active, cancelled, expired, completed | `pending, completed, cancelled, expired` (also "pending" is shown to buyers as "Reserved / Ready for pickup") |
| Seller scan "grace" | n/a | `seller_scan_grace` is about unverified sellers, not QR timing. Name collision may confuse the test team. |
| Timer start | Open decision D-04 | At order creation (decided in code, not in docs) |

---

## Part 2 — Questions for the professor

Ask these in one meeting. Each has the choices so the answer can be one line.

| ID | Question | Choices / detail | Blocks |
|---|---|---|---|
| Q-01 | How long is the QR valid? | (a) 24 h from creation (current). (b) Only inside the selected pickup slot plus a grace. (c) Other. | TC-QR-08, 12 |
| Q-02 | If grace applies, how long is it, and does it apply before the slot, after the slot, or both? | e.g. 15 / 30 / 60 minutes. | TC-QR-13 |
| Q-03 | Can the buyer cancel before the seller confirms? After confirming? What changes after confirmation? | Free / free with limits / not allowed. | TC-ORD-11, 12 |
| Q-04 | Must there be a seller confirmation step, and which statuses are required? | Current: `pending, completed, cancelled, expired`. Proposed list: confirmed, preparing, ready, declined, no-show? Who moves each status? | TC-ORD-02, 05, 06 |
| Q-05 | What is the cancellation cutoff? | 2 h or 3 h before the pickup slot? Counted from slot start or slot end? | TC-ORD-12 |
| Q-05b | Do declined or returned products go back to available stock? | Always / only if the seller says they are still fresh / never. Who decides? | TC-NSH-07, TC-INV-08 |
| Q-06 | Which pickup dates can a buyer choose? | (a) Today and tomorrow only. (b) Up to N days set by each seller (give the maximum N). | TC-PKP-01, 02 |
| Q-07 | What happens in the last 30 minutes before closing? | Slot blocked / allowed with warning / allowed. | TC-PKP-06 |
| Q-08 | What is a "pickup limit"? | Max orders per day, per slot, or max quantity? Who sets it? What does the buyer see when it is full? | TC-PKP-07 |
| Q-09 | Is the same buyer allowed several pending reservations for the same product? | Block / allow with a limit / allow. | TC-RSV-07 |
| Q-10 | What does Away mode do? | Hides products / blocks new reservations / blocks pickups only. What happens to orders already pending? | TC-PKP-08, 09 |
| Q-11 | When may a seller mark a no-show? | After slot end + grace? After QR expiry? Can the seller mark it, or is it automatic only? | TC-NSH-02, 03 |
| Q-12 | Which reasons count as an accepted excuse? Who can excuse and until when? | e.g. weather, emergency, seller was closed. Is the 2-point penalty removed fully? | TC-NSH-04, 05 |
| Q-13 | Should the pickup-by date follow product freshness? | Seller sets a pickup-by date per product? Is there a maximum for perishables? Is the `condition` field required again? | C-06 |
| Q-14 | Can the buyer change the pickup date or time after reserving? | No / once / until cutoff. | TC-PKP-10 |
| Q-15 | What is a "late" cancellation and what is the penalty? | Points added? Counter weight? Same 5/7/9/10 steps or new ones? | C-03 |
| Q-16 | Which tests must pass for sign-off, and what is the acceptable QR scan time? | Used for the QR checklist's pass mark (suggested: 10 s timeout). | QR checklist |

Suggested order: Q-01, Q-04, Q-03, Q-05 first (they decide the order model). Everything else depends on them.
