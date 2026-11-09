---
title: Flagging Rules Without Admin
type: product-rules
status: draft-for-citation-check
created: 2026-11-08
---

# Flagging Rules Without Admin

Every rule below is run by the system. No person has to decide anything.

> **Honest note.** Research backs the *ideas* (small steps first, two people must agree, explain every penalty). It does not give the *numbers*. All points, limits and time windows are starting settings for the pilot. Tune them with real data. Rules marked **New** are not built yet.

## 1. How it works (5 steps)

1. Something happens, or a user sends a report.
2. The system checks that it was the user's own fault.
3. If it counts, points are added to the user's score.
4. The score decides the level (Table 3).
5. The user gets a short notice: what happened, which rule, how to avoid it.

A report alone is **0 points**. It is only a claim until a second, different person agrees.

## 2. Violations and weights

### Table 1. Buyer

| Violation | How the system knows | Points | Status |
|---|---|---|---|
| Reservation ended, no pickup | Timer runs out | 2 | Built |
| Cancel late (under 3 hours before pickup) | Cancel time vs pickup time | 1 | New (code counts cancels now) |
| Decline at pickup, reason not on the list | Reason picked in app | 1 | New |
| Rude or abusive messages | 2 different people report it | 2 | Built |
| QR misuse | 2 different people report it | 3 and block now | Built |
| Fake reports on sellers | 3 or more reports by one user, none confirmed in 14 days | 1 for each group of 3 | New |
| Review bomb (see 4.2) | Burst of low ratings from new accounts | 0 for the buyers, ratings ignored | New |

### Table 2. Seller

| Violation | How the system knows | Points | Status |
|---|---|---|---|
| Cancel a confirmed order | Order record | 2 | Built |
| No reply to a buyer in 48 hours | Message times | 1 | Built |
| Low rating (1 or 2 stars) | Buyer wrote a reason, or it is the 2nd low rating in 30 days | 1 | Partly (code ignores the reason rule) |
| Wrong listing (weight, type, size) | 2 different people report it | 2 | Built |
| Rude or abusive messages | 2 different people report it | 2 | Built |
| QR misuse | 2 different people report it | 3 and block now | Built |
| Bad produce, buyer declined with a good reason | Seller accepts, or stays silent for 24 hours | 2 | New |
| Orders from own account | Buyer account is the seller account | 3 and block now | New |
| Same buyer floods one seller with orders | More than 5 orders in 7 days from one buyer | 0, extra orders do not count for ranking | New |

### Table 3. Both

| Violation | How the system knows | Consequence | Status |
|---|---|---|---|
| Spam | Same message sent 5 or more times in 10 minutes | Cannot send for 10 minutes. 2nd time in 90 days: 1 point | New |
| Sharing personal data | Phone or email pattern in a chat message | Message is hidden. 3rd time in 90 days: 1 point | New |

### Stopped by design (no flag needed)

- **Price tricks:** the price is locked when the order is made.
- **Listing with no stock:** orders stop at 0 stock.

### Never counts (0 points)

One report alone. The other side caused it (seller closed the stall). An excused case. An event that was fixed after a check (section 5).

## 3. Levels

Same for buyers and sellers, so it is simple and fair.

| Score (S) | Level | Buyer | Seller |
|---|---|---|---|
| 0 to 1 | Good standing | Nothing | Nothing |
| 2 to 3 | Notice | Plain notice | Plain notice |
| 4 to 5 | Warning | Warning shown at reservation | Warning shown on dashboard |
| 6 to 7 | Pause 24 hours | No new reservations | No new listings, no Priority Boost |
| 8 to 11 | Pause 3 days | No new reservations | No new listings |
| 12 or more | Block | Account blocked | Account blocked |

- A penalty starts only when a new event moves the user **up** a level. If the score falls, the level falls with no new penalty.
- **Seller gate:** a seller is paused or blocked only if the fault rate F is 10% or more and they have at least 10 orders. Otherwise they stay at Warning and are marked "Under watch".
- **Serious cases** (QR misuse, orders from own account) skip the steps and block at once.

## 4. Formulas

### 4.1 Trust score

> **S = sum of points of all counted events in the last 90 days**

Old events drop off after 90 days, so a user can recover by behaving well. A Block lifts on its own when S falls under 12.

### 4.2 Review bomb check

> **A rating is ignored if:** its account is under 7 days old, **and** 5 or more such ratings of 1 or 2 stars hit one seller within 24 hours.

Ignored ratings do not count for the seller's score or average. The buyers get 0 points and a notice, because some may be honest.

### 4.3 Seller fault rate

> **F = (seller cancels + confirmed wrong listings + accepted declines) ÷ (completed + cancelled + declined orders)**, over 90 days, only with 10 or more orders.

A big seller with 3 faults in 500 orders has F = 0.6%, so no pause. A small seller with 4 faults in 10 orders has F = 40%, so the pause applies. Same score, fair result for both sizes.

## 5. Fixing a wrong penalty (no admin)

- **Excuse (New):** after an expired reservation, the buyer has 24 hours to press "I had a problem". The seller confirms. If yes, 0 points. Once every 30 days.
- **Check again (partly built):** within 7 days a user can ask for a re-check. The system re-reads the order record. If the record does not support the penalty, the event is removed and S is recalculated. Cancellation and no-reply events already work this way.
- **Decline at pickup, seller disagrees (New):** nobody gets points and the order closes as "Declined at pickup". The produce is not put back in stock.
- **Away mode (New):** the 48-hour reply clock stops while the seller is away. Up to 14 days each time.

## 6. Example

Ana (buyer). Day 1 reservation ends: S = 2, Notice. Day 10 cancels 2 hours before pickup: S = 3. Day 20 reservation ends: S = 5, Warning. Day 25 seller closes the stall: 0 points. Day 38 cancels 1 hour before: S = 6, Pause 24 hours. Day 70 after more events S = 12, Block.

## 7. Why each rule is fair (and the source)

| Rule | Why | Source | Strength |
|---|---|---|---|
| Small penalty first, bigger later | Banning at once breeds anger. Steps teach. | Ostrom 1990 (graduated sanctions) | Strong idea |
| Add points into one score | One event should not decide a person. | Resnick et al. 2000 | Medium |
| Report is 0 points, 2 people must agree | Flags are blunt and can be used to attack people. Feedback can be revenge. | Crawford and Gillespie 2016; Resnick and Zeckhauser 2002 | Strong |
| Only count the user's own fault | Marketplaces count seller-fault events only. | Shopee penalty pages (company, reported by sellers' tools) | Weak: company practice |
| Fault rate, with a minimum order count | Big sellers have more faults just from more orders. | Shopee non-fulfilment rate (company) | Weak: company practice |
| Plain notice, re-check, excuse | People need to understand automatic decisions and get a chance to answer. | Citron 2008; Citron and Pasquale 2014 | Strong for the principle |
| Cancel and no-show rules | Marketplaces limit habitual late cancels. | Too Good To Go partner terms (company) | Weak: company practice |
| Review bomb check | Fake reviews are common and come from weak or new accounts. Bursts and new accounts are standard warning signs. | Luca and Zervas 2016; Fei et al. 2013 (burst detection) | Medium. The 5 ratings, 24 hours and 7 days are my starting numbers |
| Orders from own account and order floods | Sellers place fake orders to climb rankings (called "brushing"). | Jin, Yang and Hosanagar 2023 | Medium. The 5 orders in 7 days is my starting number |
| Spam limit | Capping actions per time window is the usual defence. | Marketplace guidance (vendor blogs) | Weak: vendor advice |
| Hide phone and email in chat | Platforms mask contact details and payment details in messages. | eBay messaging rules; chat-moderation vendors | Weak: company practice |
| 90-day window, all point values, level cut-offs | Team settings. No study gives them. | None | Team setting |

## 8. References

Check each one against the original before you put it in your paper. I read search summaries only, not full papers.

1. Ostrom, E. (1990). *Governing the Commons.* Cambridge University Press.
2. Resnick, P., Kuwabara, K., Zeckhauser, R., and Friedman, E. (2000). Reputation systems. *Communications of the ACM, 43*(12), 45 to 48.
3. Resnick, P., and Zeckhauser, R. (2002). Trust among strangers in internet transactions: Empirical analysis of eBay's reputation system. *Advances in Applied Microeconomics, 11*, 127 to 157.
4. Crawford, K., and Gillespie, T. (2016). What is a flag for? Social media reporting tools and the vocabulary of complaint. *New Media and Society, 18*(3), 410 to 428.
5. Citron, D. K. (2008). Technological due process. *Washington University Law Review, 85*(6), 1249 to 1313. Citron, D. K., and Pasquale, F. (2014). The scored society. *Washington Law Review, 89*(1), 1 to 33.
6. Luca, M., and Zervas, G. (2016). Fake it till you make it: Reputation, competition, and Yelp review fraud. *Management Science, 62*(12), 3412 to 3427. [Record](https://open.bu.edu/items/14162aac-32a6-4296-b624-9d0e26e8f98c)
7. Jin, Y., Yang, S., and Hosanagar, K. (2023). To brush or not to brush: Product rankings, consumer search, and fake orders. *Information Systems Research, 34*(2), 532 to 552. [Link](https://pubsonline.informs.org/doi/full/10.1287/isre.2022.1128)
8. Fei, G., et al. (2013). Exploiting burstiness in reviews for review spammer detection. ICWSM. [PDF](https://cdn.aaai.org/ojs/14400/14400-28-17918-1-2-20201228.pdf). *Author list and year not confirmed. Verify.*
9. Company guidance, not research: Shopee penalty and non-fulfilment pages ([Ginee](https://ginee.com/ph/insights/shopee-seller-penalty), [BigSeller](https://www.bigseller.pro/blog/articleDetails/3618/shopee-non-fulfillment-rate.htm)); [Too Good To Go Local Hero](https://www.toogoodtogo.com/en-gb/local-hero); [eBay sharing contact details](https://pages.ebay.com.my/help/account/sharing.html); [chat moderation guide](https://cometchat.com/blog/marketplace-chat-moderation).

## 9. Not built yet

New rules need new code: late-cancel points, decline at pickup, fake-report group, review-bomb check, self-order and order-flood checks, spam limit, personal-data hiding, excuse, Away mode. The built rows already match `backend/src/utils/trust/policy.ts`. Level lengths differ today (12, 24 and 72 hours at 6, 8 and 10 points). Pick one table.
