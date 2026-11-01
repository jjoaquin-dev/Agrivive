# 2026-11-02 Trust Numbers and Research Sources

## Decision
Keep the current trust numbers as Agrivive prototype configuration. No code changed. The paper already says the weights and thresholds are "Agrivive prototype configurations" and "not taken as fixed values from the cited studies."

## Why
A search of 2022-2025 research found no source that gives penalty-point values, a block threshold, or reply deadlines for buyer questions. Sources support only the structure of the scheme. Trade-press and practitioner pages (for example Shopee penalty-point blogs) were not used because they are not research and give conflicting numbers.

## Numbers with no research source (own settings)
- Weights: inquiry non-response 1, low rating 1, seller cancellation 2, buyer failed reservation 2, misleading listing 2, inappropriate communication 2, QR misuse 3.
- Thresholds: warning 4, pauses at 6 / 8 / 10 (12h / 24h / 3 days), block 12, QR misuse blocks at once.
- Reply timers 12h / 24h / 48h (paper Table 17: "Agrivive-defined system rules").
- Inactivity: 3 weeks warning (21 days), 1 month block (30 days).
- Low rating means 2 stars or less; 2 different reporters confirm a report; points count for 90 days (`TRUST_SCORE_WINDOW_DAYS`); buyer cancel counter warns at 5, pauses at 7 / 9 / 10.
- All are env settings or one line in `backend/src/utils/trust/policy.ts`, so tuning after beta testing needs no redesign.

## Sources that support the structure (2022-2025)
Read the full text before citing. Found through search results only.
- Weighted trust scoring: paper refs [56] Kokkodis, Lappas, Kane, POM 2022, and [57] Chu and Chen, IJEP 2022.
- Warning, then temporary restriction, then suspension or ban; some marketplaces use a points system: OECD (2022), The role of online marketplaces in protecting and empowering consumers. https://www.oecd.org/content/dam/oecd/en/publications/reports/2022/07/the-role-of-online-marketplaces-in-protecting-and-empowering-consumers_07af735e/9d8cc586-en.pdf
- 86% of 50 marketplaces have a sanctions policy that escalates from warnings to suspension: WIPO/ACE/16/11 (November 2023). https://www.wipo.int/edocs/mdocs/enforcement/en/wipo_ace_16/wipo_ace_16_11.pdf
- Method for deriving weights if ever needed (AHP, Saaty scale, consistency ratio 0.10 or less): Dodevska et al., Mathematics 2023, 11(3):604; Systems 2025, 13(5):328. https://www.mdpi.com/2079-8954/13/5/328

## How to say it in the paper
The numbers are adjustable prototype settings chosen so heavier violations count more, to be tuned from beta-test results. Research backs the weighted, escalating structure only. Do not claim the values come from research.

## Open option
If the numbers later need a method behind them: derive weights with AHP pairwise comparison using judgments from the adviser, the City Agriculturist's office, or sellers and buyers, report the consistency ratio, and set thresholds as fractions of the total possible score.

## Verification
Documentation only. No code, schema or config changed.
