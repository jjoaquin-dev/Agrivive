---
title: Research-Aligned Trust, Violation and Report Rules
type: rules-spec
status: draft-for-owner-approval
created: 2026-11-05
---

# Research-aligned rules for flagging, violations and reports

This revises the rules so each one follows a criterion from published work. It is a **spec for approval**. The code has not been changed.

Full reference list and source quality: [[Research Basis for QR and Trust Rules]]. Verify every citation against the original before you use it. I read search summaries, not the full papers.

**What research can and cannot give you.** The sources give **criteria** (graduated, proportionate, explained, corroborated, contestable). They do not give numbers such as "block at 12 points". Every number below is a team setting, marked **Setting**, and stays adjustable.

## A. The criteria used

| # | Criterion | Source |
|---|---|---|
| C1 | Penalties start small and grow with repeats; serious cases can skip steps | Ostrom (1990), principle 5, graduated sanctions "depending on the seriousness and context of the offense" |
| C2 | Rules and consequences are clear and known before they apply | Ostrom (1990), clearly defined rules; Nielsen's heuristic of keeping users informed |
| C3 | Penalties follow events the system can observe, not guesses | Ostrom (1990), monitoring; the paper's own narrowing to provable events |
| C4 | A person can ask for a review of a penalty | Ostrom (1990), conflict-resolution mechanisms; Citron (2008), notice and a chance to be heard |
| C5 | One flag is not proof; independent agreement is needed | Crawford and Gillespie (2016); Appelman and Leerssen on trusted flaggers |
| C6 | Guard against retaliation and abuse of reports | Resnick and Zeckhauser (2002) on reciprocal and retaliatory feedback; Crawford and Gillespie on strategic flagging |
| C7 | The reporter learns what happened to their report | Studies of flagging interfaces (arXiv 2309.06688, "Cleaning Up the Streets"): users who flag are often unaware of the result and give up |
| C8 | Notices state the reason, the rule, the length and how to avoid it, in plain words | Nielsen heuristics (system status, plain error messages); Citron and Pasquale (2014) |
| C9 | Strict rules are accepted better when explained and seen as fair | Montclair/JRPM (2024), restaurant cancellation policies |

## B. Violation rules

Each violation, who it applies to, and why.

| Violation | Applies to | Points or ladder | Criterion | Change |
|---|---|---|---|---|
| No reply to a buyer after 12 / 24 / 48 hours | Seller | Reminder, warning, flag at 48 hours (1 point) | C1, C2, C3. Steps from the paper (Table 17); Airbnb's 24-hour reply guidance is company advice, not research | Keep. **Setting** |
| Seller cancels a buyer's order | Seller | 2 points | C3 | Keep. **Setting** |
| Low rating (2 stars or less) on a completed order | Seller | 1 point | C3 | Keep. **Setting** |
| Confirmed wrong listing information | Seller | 2 points | C3, C5 | Keep. **Setting** |
| Confirmed inappropriate conduct | Either | 2 points | C3, C5 | Keep. **Setting** |
| Confirmed QR misuse | Either | 3 points and immediate block | C1 (serious cases skip steps) | Keep, because C1 allows this. **Setting** |
| Counted late cancel | Buyer | Ladder: 2 warning, 3 pause 12 h, 4 pause 24 h, 5 pause 3 days, 6 block | C1, C9 | New, as approved |
| Missed pickup (expired) | Buyer | Ladder: 1 notice, 2 pause 24 h, 3 pause 48 h, 4 pause 3 days, 5 block | C1, C9 | New, as approved |
| Combined cancels and expired reach 8 | Buyer | Block | C1 | New, as approved. **Setting** |
| No activity | Either | 3 weeks warning, 30 days block | The paper (Section 2.3.2.6) | Keep |

All counts use the last 90 days. **Setting**: no research was found for 90 days. Justify it as fairness, so old events fade.

**Seller-caused issues never count against buyers.** A cancel or no-show caused by a closed stall, a seller cancel, or a seller who declined a cancel and did not show is not counted. (C3, fairness.)

## C. Report rules

| Rule | Detail | Criterion | Change |
|---|---|---|---|
| A report is an allegation | Saved with 0 points. Nothing happens to the other person | C5 | Keep |
| Countable reasons | Wrong listing, conduct, QR misuse. "Pickup problem" and "other" never add points | C3 | Keep |
| Corroboration | 2 different people, same reason, same person confirm 1 violation | C5. The number 2 is a **Setting** | Keep |
| Details | A reason plus written details. Evidence photo allowed | Crawford and Gillespie: a bare flag is too blunt | Keep. Raise the minimum length above 5 characters (**Setting**, suggest 20) |
| One report per order per person | Stops repeat reporting | C6 | Keep |
| Retaliation guard | A report is ignored if the reported person already reported the reporter about the same order, until a review is done | C6 | **New** |
| Reporter feedback | The reporter gets a notice when their report is confirmed or closed, in plain words and without private details of the other person | C7 | **New** |
| False-report check | If many of one person's reports are never confirmed, their future reports wait for a second source before they are shown to reviewers | C6, Crawford and Gillespie (strategic flagging). Number is a **Setting** | **New, optional** |

## D. Flagging (system flags, not user reports)

| Flag | Trigger | Result | Criterion |
|---|---|---|---|
| Seller reminder | 12 hours without reply | Reminder to the seller, no points | C1, C2 |
| Seller warning | 24 hours without reply | Warning to the seller, notice to the buyer | C1, C2 |
| Non-responsive flag | 48 hours without reply | Flag, 1 point | C1, C3 |
| Buyer warning | 2nd counted cancel, or 1st expired | Notice with the rule and how to avoid more | C1, C2, C8, C9 |
| Pause | Ladder step | Reservations paused for the stated time; browsing and messaging still work | C1, C8 |
| Block | Ladder end, QR misuse, 8 combined | Account blocked | C1 |

## E. Notices

Every notice about a penalty must contain: **what happened**, **which rule**, **how long it lasts** or that it is permanent, **how to avoid it next time**, and **how to ask for a review** (see F). Use plain words. (C2, C8, C9)

## F. Review of penalties: your decision conflicts with the research

You decided blocked buyers get **no recovery**, and the vault says admins are read-only. Two criteria disagree with this: **C4** (a way to contest) in Ostrom's principle of conflict-resolution mechanisms, and in Citron's due-process work. Without it, a wrong penalty, for example one caused by a closed stall, cannot be corrected.

**Recommended middle path (not self-recovery):** a "Ask for a review" button on a block or pause. The buyer cannot restore the account themselves. An admin reads the order history and can lift a penalty that was wrongly applied. This needs one admin action, not general admin power. If you keep "no review at all", state in your paper that you chose not to follow criterion C4, and say why.

## G. What stays a team setting

Points per violation; levels 4, 6, 8, 10, 12; 90 days; 2 reporters; 3-hour late-cancel limit; 3 open reservations; 48 hours ahead; 2-hour slots; the false-report threshold. Say so in the document and plan to tune them after a pilot.

## H. Suggested citation sentences

- "Penalties escalate gradually, following Ostrom's principle of graduated sanctions (Ostrom, 1990)."
- "A single report is treated as an allegation until independent reports agree, because flags are a blunt and abusable signal (Crawford and Gillespie, 2016) and feedback can be retaliatory (Resnick and Zeckhauser, 2002)."
- "Notices explain the rule, duration and how to avoid it, in line with usability heuristics (Nielsen) and due process for automated scoring (Citron and Pasquale, 2014)."
- "Numeric thresholds are initial team settings, not research findings, and are configurable."
