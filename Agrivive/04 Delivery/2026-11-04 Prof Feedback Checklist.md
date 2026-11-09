# Prof Feedback Checklist

Date: 2026-11-04
Owners: **Jara** (AHP-TOPSIS, n8n, Analytics) and **Arianne** (everything else)

**What the prof wants, in one line:** Every number on the screen needs proof. Show a small sample, do the math by hand, and show the screen gives the same answer. The demo must run without trouble.

Tick `[x]` when done. Update the score here:

- Jara: 0 / 23 done
- Arianne: 1 / 26 done

---

# JARA

## A. Fix these first
- [ ] **6 hours or 12 hours?** The code treats a listing as fresh for 12 hours, but we told the prof 6. One note in the vault also says 12. Pick one and make the paper, the notes and the code say the same thing. (The 6 hours is typed into the code, so it can't be changed from a setting.)
- [ ] **Show the score out of 100.** The backend keeps it as 0 to 1 (like 0.974). The screen should show 97.4 / 100. Check that it does.
- [ ] **Fix the name "C".** The prof thought C means listing age. It means **closeness score** (how close a listing is to the best one). Look through the paper and notes for the wrong label.

## B. Ranking listings (AHP-TOPSIS) - do this first
What we already have: weights 40% freshness, 30% stock left, 20% seller reliability, 10% how often it was posted. Tiers: 60 and above = Priority Boost, 40 to 59 = Standard, below 40 = Basic/Hold. Some notes and spreadsheets are already in the vault (`04 Delivery`, `03 Intelligence`).
- [ ] Make a small table of 4 sample listings (A, B, C, D) with price, freshness, stock left and seller reliability.
- [ ] Do the math by hand, step by step, with real numbers: weights, scaled scores, best and worst listing, distance to each, closeness score, rank.
- [ ] Make a test table: situation, tier we expected, tier the system gave (Priority, Standard, Basic/Hold).
- [ ] Change one value on 3 products (for example freshness, which counts 40%) and show the tier changes. This proves the weights matter.
- [ ] Show one example: closeness 0.73 means 73 out of 100, which is above 60, so Priority Boost. Add a screenshot of the seller screen showing the same.
- [ ] Write in the paper: buyers do not see any rank. Sellers see only their score and tier.
- [ ] Fix the paper's word meanings so they don't overlap: recency = how fresh (how long ago it was posted), stock = how much is left, seller reliability = based on seller ratings. Move "past surplus" into the definitions part.
- [ ] Write why we pick 6 hours (the DA said so). Say if it is fixed or can change.

## C. n8n (the auto-posting tool)
What we already have: one workflow file, two picture files, and a test note. The tier check happens in our backend, before n8n is called. The prof wants to see that split.
- [ ] Update the picture of the flow and add a testing step.
- [ ] Write in the paper: the backend decides who qualifies, n8n only gets qualified listings.
- [ ] Show proof: a Hold listing does **not** get posted, a Priority listing **does** (screenshots or logs).
- [ ] Explain: a Priority listing posts by itself. The farmer clicks nothing. Say where the automation stops.
- [ ] Explain the buyer alert: when the price drops, buyers get a notification.

## D. Analytics dashboard
What we already have (mobile app): month comparison, movement chart, repeat listings table, filter row, order outcomes, unit chart. Sell-through = sold quantity divided by posted quantity.
- [ ] Sell-through rate: write the formula, use sample numbers, and check the dashboard gives the same answer.
- [ ] The "often posted surplus vegetables" table must include sell-through. Check it does.
- [ ] Test the pie chart with sample data so we can prove it is right.
- [ ] Date or month filter. Check it works.
- [ ] This month vs last month (example: carrot). Check it works.
- [ ] Inventory vs sales chart. The prof asked where it is. Check it.
- [ ] A short description under **every** chart (what the chart shows and what it means).

---

# ARIANNE

## E. Fix this first
- [x] **Trust: the prof heard "12 hours no reply".** The real steps are: reminder at 12 hours, warning at 24 hours, flagged at 48 hours. Tell the prof the real steps.

## F. QR code for reservations
What we already have: the QR is valid for 24 hours, starting when the buyer orders. Orders can be completed, cancelled or expired. Note: `02 Product/Reservation and QR Pickup.md`.
- [ ] Write the 24-hour rule: starts at order date and time, cannot be extended, a new order gives a new QR.
- [ ] Ask real sellers: do buyers pick up the same day or next day? What if ordered at 12:00 and picked up next day at 6:00? Write down the answers. If unclear, write a short disclaimer.
- [ ] Scan test: try at least 3 phones and 2 lighting conditions. Write down how fast each scan was.
- [ ] Make the QR big enough to read on a TV or projector.
- [ ] Check that scanning only takes quantity **away**, never adds it back.
- [ ] Show the QR states: available, sold, expired, cancelled, completed.
- [ ] Add one sentence: seller location on the map goes in the next objective.

### F idea: buyer picks the pickup time (not built yet)
A seller-controlled limit sits on top of the buyer's chosen time. The buyer picks the time, the seller decides how far ahead it can be. The system never judges the produce itself.

**1. Buyer picks a pickup time, within three limits**

| Limit | Set by | Solves |
|---|---|---|
| Opening hours (per day, e.g. Mon–Sat 6:00–17:00) | Seller | No 10 PM pickups. Only open times can be chosen. |
| "Pick up by" date on each product | Seller | Listed Sept 17, ordered Sept 18, buyer wants Sept 20. The seller sets the last day; the calendar greys out later days. |
| Furthest day ahead (default 2 days, seller can lower it) | Seller | Safe default if the seller sets no "Pick up by" date. |

The QR is valid only for the chosen slot, plus a short wait after it (say 30 minutes). Then it shows Expired and the stock goes back automatically. Rule: *Your QR works only in the time you picked. It cannot be extended. A new order gives a new QR.* This still answers "cannot be extended, new order = new QR".

**2. Wording (no freshness claims)**
- Label it "Pick up by" or "Seller's pickup limit". Never "fresh until".
- Show the listing date as plain information: "Listed Sept 17".
- One line at checkout: "Agrivive does not check the quality of produce. Please look at it when you pick up."

**3. Bad buyers who reserve and don't show up** (builds on the existing trust points)
- Limit open reservations per buyer, e.g. 3 at a time.
- New buyers can pick only today or tomorrow. After a few completed pickups, they can pick further ahead.
- A QR that expires unscanned gives the buyer trust points. Enough points blocks new reservations. Sellers can also mark "Did not come" for the same effect.
- Cancel only until a cutoff, e.g. 2 hours before the slot. After that, a cancel counts as a no-show.
- Reminder before pickup: "Pickup today at 3:00 PM. Tap if you can't come." This frees the stock early.
- Optional slot limit: seller sets a maximum number of reservations per slot.

**4. Fits the checklist**
- 12:00 order, 6:00 next day pickup: allowed if the seller is open at 6:00 and "Pick up by" is not before that. Ask real sellers what their usual gap is and use it as the default.
- Scan only takes quantity away: unchanged. Expiry restores stock only once.
- QR states Available, Sold, Expired, Cancelled, Completed all stay.

**Would change in code:** seller opening-hours table, product "pick up by" field, pickup start and end on orders, order-expiry job uses slot end instead of "order time + 24h", buyer slot picker on web and mobile.

## G. Calendar and reminders
What we already have (mobile): reminder card, holiday card, weather section.
- [ ] Reminders should show as a **popup**, not buttons. Check and change if needed.
- [ ] Alert one day before a holiday. Write how many days ahead it alerts.
- [ ] Show the heat alert.
- [ ] Take a screenshot of a reminder for the paper.

## H. Rating and review
Not checked yet.
- [ ] Look at the current screen and how many things the buyer rates.
- [ ] Group products (5 per group) so one button rates the whole group.
- [ ] Give 3 star questions (seller, product, and one more). Find a source to cite.

## I. Reports and trust points
What we already have: points per bad action (no reply 1, seller cancels 2, low rating 1, buyer no-show 2, misleading info 2, rude message 2, QR misuse 3). Warning at 4 points, restriction at 6, 8 and 10, block at 12. Points count for the last 90 days. A report needs 2 different people to confirm.
- [ ] Explain what happens after someone reports.
- [ ] Explain what happens if the report is false. (Not checked in the code. Check, and add it if missing.)
- [ ] Make a scenario table: what happened, points added, what action follows.
- [ ] Explain why each point value was chosen.
- [ ] Show the buyer no-show penalty (2 points).
- [ ] Say if buyers and sellers have separate trust scores. (Not checked.)
- [ ] "Reported user activity": nothing like this in the code. Say it means the person who reported, or remove it.
- [ ] Remove the last objective that came back (it repeats another).

## J. Demo
Jara joins for the full run.
- [ ] Run the whole demo from start to end with no errors.
- [ ] Put sample data in: 4 listings, some orders, one report case.
- [ ] Update the vault note and `00-LATEST.md`. No passwords or keys.

---

## Order to work in
1. Both: the "fix first" items
2. Jara: ranking proof, then analytics. Arianne: trust table, then QR seller questions
3. Then n8n, calendar, rating
4. Last: demo run together
