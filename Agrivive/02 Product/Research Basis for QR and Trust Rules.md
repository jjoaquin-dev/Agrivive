---
title: Research Basis for QR and Trust Rules
type: justification
status: draft-for-citation-check
created: 2026-11-05
---

# Research basis for the QR, reporting, flagging and trust rules

Use this note to cite and justify each rule in the discussion. Read the honesty column first: it says how strong each source really is.

> **Check before citing.** I found these sources with a web search and read only search summaries, not the full papers. Open each one and confirm the author, year, journal and wording before you put it in your document. Sources marked "company guidance" or "vendor" are not research.

## 1. Where each rule really comes from

There are three origins. Mixing them up is the most common mistake in a defense.

| Origin | What it covers |
|---|---|
| **Your own research paper** (Section 2.3.2.6, Table 17, Table 18, Equation 3, and the reservation pages 4 to 9) | The idea of a weighted violation score, the reminder, warning and flag steps at 12, 24 and 48 hours, the 3-week and 1-month inactivity rules, and the original 24-hour QR |
| **Team design choices** (the `monitoring-v3` policy in `backend/src/utils/trust/policy.ts`, adjustable by settings) | The exact points per violation, the 4, 6, 8, 10 and 12 point levels, the 90-day window, the need for 2 reporters, and the new buyer cancel and expired ladders |
| **Outside research** (below) | Why these kinds of rules work and are fair |

No study gives universal numbers such as "block at 12 points" or "6 cancels". Do not claim that. Say the numbers are starting settings, set by the team, kept adjustable, and to be tuned with pilot data.

## 2. Rule by rule

| Rule in Agrivive | Where it comes from | Outside support | Strength |
|---|---|---|---|
| Penalties grow step by step: notice, then warning, then pause, then block | Paper (Table 18) and `policy.ts` | Ostrom's design principle of **graduated sanctions**: small first, heavier later. Banning at once tends to cause resentment | Strong idea, secondary summaries found |
| Violation points are added up (weighted score) | Paper (Equation 3) | Reputation systems add many small signals so one event does not decide a person (Resnick et al.) | Medium |
| Warnings and plain explanations before a pause | Design choice | A 2024 study of restaurant cancellation policies found that strict rules lower ratings, but **perceived fairness and awareness messages soften this** | Medium: one study, restaurants |
| Charging or pausing for no-shows works | Design choice | Oh and Su (Wharton) model suggests no-show fees raise profit on busy nights; it is a mathematical model, journal not confirmed | Weak: model only |
| A report is only an allegation (0 points) | Design choice, recorded in the vault audit notes | Flags are blunt and can be used to attack people (Crawford and Gillespie); feedback is often retaliatory (Resnick and Zeckhauser) | Strong |
| 2 different reporters needed to confirm | Design choice (adjustable) | Reports from several independent people are more reliable than one (Appelman and Leerssen on trusted flaggers) | Medium. The number 2 is your choice |
| Only 3 reasons count (wrong listing, conduct, QR misuse) | Paper's violation list, narrowed in the vault | Narrowing to provable events avoids false penalties | Design reasoning |
| Seller reply steps at 12, 24 and 48 hours | Paper (Table 17) | Airbnb asks hosts to reply within 24 hours (company guidance, not research). A 2018 study of Airbnb trust found response behavior matters, but less than reputation | Weak: the numbers are yours |
| Penalties apply to both buyers and sellers | Paper (failed reservations) | Two-sided markets need rules for both sides to build trust (Pavlou and Gefen) | Medium |
| Counts only look back 90 days | Design choice (`TRUST_SCORE_WINDOW_DAYS`) | None found. Justify as fairness: old events fade out | Design choice |
| Notices that explain why | Design principle | Nielsen's heuristics: keep users informed, explain errors in plain words. Citron on due process: people need understandable notice of automated decisions | Strong for the principle |
| Cancels count only if late (inside 3 hours) | Design choice | None found. Justify as fairness to buyers who warn sellers early | Design choice |
| Limit of 3 open reservations, 2-hour slots | Design choice | None found | Design choice |
| QR code works once, is checked by the server, and expires | Paper (QR pickup) | Time-limited, single-use codes are standard practice. NIST SP 800-63B is quoted as limiting one-time codes to about 10 minutes (secondary sources only). QR codes can hide bad links and people scan without checking (Krombholz et al.; Vidas et al.) | Medium. NIST figure is about login codes, not pickup |
| Buyer picks pickup time instead of fixed 24 hours | New design | The paper used 24 hours. Say clearly this is a change and why: sellers have open hours and buyers have plans | Design change |

## 3. Things in your own project that disagree with each other

Raise these before your defense, because a reader may notice:

1. **Admin power.** The vault note "Flagging and Trust Scope Narrowed" says admins are read-only and cannot unblock or change points. The approved plan adds an **admin unblock** for buyers. Decide which one is true, and update the note.
2. **Recovery.** Today a trust block can be restored with an email code. You decided buyers get no self-recovery. Update the paper, the notes and the recovery screen so they agree.
3. **Seriousness of QR misuse.** The vault says QR misuse was narrowed to server errors. The code also counts confirmed reports of QR misuse (3 points, immediate block). Say which one you defend.
4. **Reservation limit.** A vault note suggests 1 open reservation at the warning level; the plan uses 3. Pick one.
5. **Inactivity rules.** The paper's 3-week warning and 1-month block are noted as implemented in a later note. Confirm they run.

## 4. References

Verify each before citing.

- Ostrom, E. (1990). *Governing the Commons.* Cambridge University Press. Eight design principles, including graduated sanctions. Summary: [pressbooks.pub](https://pressbooks.pub/cisi/?p=62). Review: Wilson, Ostrom and Cox, [Generalizing the core design principles](https://davidsloanwilson.world/wp-content/uploads/Generalizing-the-core-design-principles-for-the-efficacy-of-groups-1.pdf).
- Resnick, P., and Zeckhauser, R. (2002). Trust among strangers in internet transactions: Empirical analysis of eBay's reputation system. [Link](https://presnick.people.si.umich.edu/papers/ebayNBER/index.html).
- Resnick, P., Kuwabara, K., Zeckhauser, R., and Friedman, E. (2000). Reputation systems. *Communications of the ACM.* [PDF](https://cs.uwaterloo.ca/~klarson/teaching/F04-886/papers/p45-resnick.pdf).
- Pavlou, P. A., and Gefen, D. (2004). Building effective online marketplaces with institution-based trust. *Information Systems Research, 15*(1), 37 to 59. [Record](https://econpapers.repec.org/RePEc:inm:orisre:v:15:y:2004:i:1:p:37-59).
- Crawford, K., and Gillespie, T. (2016). What is a flag for? Social media reporting tools and the vocabulary of complaints. *New Media and Society.* [Summary](https://culturedigitally.org/2014/08/kate-crawford-and-tarleton-gillespie-on-social-media-reporting-tools-and-the-vocabulary-of-complaints/).
- Appelman, N., and Leerssen, P. On trusted flaggers. *Yale Journal of Law and Technology.* [PDF](https://yjolt.org/sites/default/files/0_-_appelman_leerssen_-_on_trusted_flaggers.pdf).
- Citron, D. K. (2008). Technological due process. *Washington University Law Review.* [Link](https://journals.library.wustl.edu/lawreview/article/id/6697). Citron, D. K., and Pasquale, F. (2014). The scored society: Due process for automated predictions. *Washington Law Review, 89.* [Link](https://cyberlaw.stanford.edu/publications/scored-society-due-process-automated-predictions).
- Tackling no-shows in fine dining: insights into cancellation policies and consumer awareness campaigns (2024). *Journal of Revenue and Pricing Management, 23*(5), 423 to 434. [Record](https://researchwith.montclair.edu/en/publications/tackling-no-shows-in-fine-dining-insights-into-cancellation-polic/).
- Oh, J., and Su, X. No-show fee model for restaurant reservations. Wharton. [Coverage](https://knowledge.wharton.upenn.edu/?p=13402). Journal not confirmed, so cite it as a working paper only if you find the original.
- Krombholz, K., et al. QR code security: A survey of attacks and challenges for usable security. [Springer](https://link.springer.com/content/pdf/10.1007/978-3-319-07620-1_8.pdf).
- Vidas, T., Owusu, E., Wang, S., Zeng, C., Cranor, L., and Christin, N. (2013). QRishing: The susceptibility of smartphone users to QR code phishing attacks. USEC 2013. [PDF](https://www.isc.meiji.ac.jp/~ethicj/USEC13/submissions/usec13_submission_02.pdf).
- NIST SP 800-63B, Digital Identity Guidelines: Authentication. Confirm the code lifetime wording at [pages.nist.gov](https://pages.nist.gov/800-63-4/sp800-63b.html).
- Nielsen, J. 10 usability heuristics for user interface design. Nielsen Norman Group. Use the original page, not a summary.
- Airbnb Help Center, response expectations for hosts (company guidance, not research). [Page](https://www.airbnb.am/help/article/2414).
- Study on guests' perceived trust toward Airbnb hosts, *Decision Support Systems* (2018). [Record](https://www.datalearner.com/academic/journal-papers/0167-9236/volumes-and-issues/277/paper-detail/4603).
- Your own research paper, Section 2.3.2.6, Tables 17 and 18 and Equation 3.

## 5. How to word the justification

> "Agrivive uses graduated sanctions, an approach Ostrom found in long-lasting community-managed resource systems. Because a single report can be mistaken or abusive, reports are treated as allegations until two independent users agree. Penalties are explained in plain words, because people need understandable notice of automated decisions. The numeric thresholds are initial settings chosen by the research team and are configurable, to be refined with pilot data."

Do not say the numbers were proven by research.
