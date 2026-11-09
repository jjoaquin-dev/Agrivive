# Inventory Integrity Test Cases

How stock works today (from code): one column, `sellers_product.product_qty` (decimal 10,2, nullable, no CHECK constraint found).

| Event | Stock change | Where |
|---|---|---|
| Reserve | `product_qty - q` immediately, only if `product_qty >= q` | `buyer.order.reserve.ts` |
| Buyer cancel, seller cancel, expiry | `product_qty + item.quantity` for every line | `utils/order-stock` |
| Valid scan, full handover | no change (already deducted) | `seller.scan-order.ts` |
| Valid scan, partial handover | `+ (reserved − dispensed)`, line and total recalculated | `seller.scan-order.ts` |

Note: the vault note says "available / reserved / sold". The code has no separate reserved or sold quantity. "Sold" can only be derived from completed orders. See conflict C-09.

Common SQL for evidence (test database only):
`select product_qty from sellers_product where id = '<P1>';` and `select status, expires_at from orders where id = '<order>';`

| ID | Requirement | Scenario | Preconditions | Test Steps | Sample Data | Expected Result | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| TC-INV-01 | DOC-01 | Stock held at reservation | P1 = 10.00 | Reserve 2.5 kg | 2.5 | P1 = 7.50 immediately; order `pending`. | | Not Tested | DB before/after |
| TC-INV-02 | DOC-01 | Stock after completed pickup (full) | Order 2.5 kg pending, P1 = 7.50 | Full scan, no `items` | — | P1 stays 7.50. Order `completed`. | | Not Tested | DB |
| TC-INV-03 | DOC-03 | No negative stock, exact boundary | P1 = 1.00 | Reserve 1.00, then 0.01 | 1.00, 0.01 | First works (P1 = 0.00). Second 409. P1 never below 0. | | Not Tested | API, DB |
| TC-INV-04 | PROF-RSV | Concurrent reservations (10 parallel) | P1 = 5.00; 10 buyers, 1 kg each | Fire 10 requests at once (script or Postman runner) | 1 kg × 10 | Exactly 5 succeed, 5 get 409. P1 = 0.00. 5 orders exist. | | Not Tested | API log, DB count |
| TC-INV-05 | DOC-07 | Rollback after a failed reservation | P1 = 10, seller S2 account restricted for P2 | Cart with P1 2 kg + P2 1 kg | — | Checkout fails; **P1 still 10.00**; no checkout or order rows. | | Not Tested | API, DB |
| TC-INV-06 | DOC-02, PROF-DECL | Restoration after buyer cancel | Order 2 kg pending; P1 = 8 | Buyer cancels | — | P1 = 10.00, once. Second cancel returns 409 and P1 stays 10.00. | | Not Tested | DB |
| TC-INV-07 | DOC-05 | Restoration after expiry, no double restore | Expired pending order 2 kg; P1 = 8 | Run worker twice | — | P1 = 10.00 after both runs. | | Not Tested | DB, LOG |
| TC-INV-08 | PROF-DECL | Restoration after partial pickup | Order 4 kg; P1 = 6 | Scan with dispensed 3 | — | P1 = 7.00. Line quantity 3.00; total = 3 × price. | | Not Tested | API, DB |
| TC-INV-09 | DOC-07 (risk R1) | **Double scan race on partial pickup** | Order 4 kg pending; P1 = 6 | Send two identical scan requests at the same instant, each with dispensed 3 | — | One 200, one 409. P1 = **7.00** (not 8.00). If P1 = 8.00, a double restore bug is confirmed. | | Not Tested | API (both), DB |
| TC-INV-10 | DOC-07 (risk R2) | **Scan versus expiry race** | Order 4 kg pending with `expires_at` 5 s ahead; P1 = 6 | Scan with dispensed 3 at about the expiry moment while the worker runs | — | Order ends either `completed` (P1 = 7) or `expired` (P1 = 10), never both. P1 matches the final status exactly. | | Not Tested | DB, LOG |
| TC-INV-11 | DOC-07 | Seller cancels while buyer cancels | Order pending | Both cancel at once | — | One succeeds, the other 409. Stock restored once. | | Not Tested | DB |
| TC-INV-12 | DOC-07 | Stock edited by seller during an active reservation | Order 2 kg pending; seller sets stock via "Change Amount" | Seller changes stock, then order is cancelled | — | Cancel adds back exactly 2 kg to the new value. History shows both changes. | | Not Tested | DB, SS |
| TC-INV-13 | DOC-07 | Product archived while reserved | Order pending, seller archives P1 | Cancel order, then scan another | — | Cancel/expiry still restores to the archived product. Scan still completes. No error. | | Not Tested | API, DB |
| TC-INV-14 | CODE-04 | Decimal rounding | P1 = 10.00 | Reserve 0.01, 0.33, 3.33 | — | Each exact to 2 decimals; total price rounded to cents; stock sums back correctly after cancelling all. | | Not Tested | DB |
| TC-INV-15 | DOC-07 | Reconciliation after a test run | After all tests | Compare `product_qty` to start value − qty of pending orders − qty of completed orders (+ nothing for cancelled/expired) | — | Difference is 0 for every product used. | | Not Tested | DB query result |

Suggested reconciliation query (test database):
```sql
select p.id, p.product_qty,
  p.original_qty - coalesce(sum(i.quantity) filter (where o.status in ('pending','completed')),0) as expected
from sellers_product p
left join ordered_items i on i.product_id = p.id
left join orders o on o.id = i.orders_id
group by p.id;
```
This only matches if the seller made no manual stock changes. Record any difference with the product's stock-change history.
