# Boost Ranking Flow: AHP-TOPSIS

Posting age stays honest and is never reset. A six-hour rule makes the boosts rotate: a boosted vegetable is locked for six hours, so every vegetable gets a turn. AHP keeps its four criteria.

## The flow, start to end

&#91;embedded content: boost ranking flow · 8 steps, 1 loop\]

Read top to bottom: the top-ranked vegetable is boosted only if six hours have passed since its last boost. If it is still locked, the next-ranked one is tried. After a boost, its six-hour lock starts and the ranking is re-run next round.

1. Collect the data for each vegetable: posting age, price drop, stock level and seller reliability, plus the time of its last boost.
2. AHP: compare the criteria in pairs and get the weights. Check that CR is 0.10 or less.
3. TOPSIS: normalise, apply the weights, find the ideal best and worst, then compute the closeness score.
4. Rank the vegetables from highest to lowest closeness.
5. Go down the ranking and boost the first vegetable that was last boosted at least six hours ago.
6. Record the boost time. This starts that vegetable's six-hour lock. Posting age is not touched. n8n fires with the status "initial boost".
7. n8n waits six hours, then fires with the status "follow-up" and the vegetable is unlocked. Re-run the ranking at the next round; until then the boosted vegetable is still locked, so the next-ranked ones get picked.

## The prompt

Paste this into an AI tool or give it to a developer. It describes the same flow as the chart above.

```markdown
You are building a boost-selection feature for a vegetable marketplace website.

Goal: decide which vegetable listing to boost, fairly, using AHP-TOPSIS, so that every vegetable gets a turn.

Data per vegetable (alternatives: Kalabasa, Karot, Sigarilyas):
1. Posting age (how long the product has been on the site)
2. Price per kg dropped (how much the price was dropped)
3. Stock level
4. Seller reliability (rating out of 5)
Also keep the time of each vegetable's last boost. It is not an AHP criterion; it is only used for the six-hour rule.

Steps:
1. AHP: build a pairwise comparison matrix of the criteria on Saaty's 1-9 scale, with reciprocals. Compute the weights (average of the normalised columns). Compute lambda max, CI = (lambda max - n) / (n - 1) and CR = CI / RI. Accept only if CR is 0.10 or less; otherwise ask for the judgments to be redone.
2. TOPSIS: vector-normalise the decision matrix, multiply by the AHP weights, find the ideal best and ideal worst for each criterion, compute the distances S+ and S-, then the closeness C = S- / (S+ + S-).
3. Rank the vegetables by closeness, highest first.
4. Six-hour rule: go down the ranking and pick the first vegetable whose last boost was at least six hours ago. A vegetable boosted less than six hours ago is skipped, even if it ranks first.
5. Boost the chosen vegetable and record the boost time. This starts its six-hour lock. At the same moment, send a POST to the n8n webhook ("1. Boost Confirmed") with the boost details. This is the initial boost, so the follow-up flag is false.
6. Six hours after the boost, send a second POST to the same webhook with the follow-up flag set to true, and unlock the vegetable so it goes back into the ranking. The system keeps the six-hour clock; n8n only runs the actions.
7. Never reset posting age. It must always show the real time the product has been on the site.
8. At the next round, re-run steps 1 to 5 with the updated data.

n8n workflow "Agrivive Boost - Post, 6-Hour Price Cut, Flash-Sale Post":
- Node 1, "Boost Confirmed": a webhook that receives the POST from our system.
- Node 2, "Follow-Up Call?": an IF node. False = initial boost. True = follow-up.
- Initial boost branch (false): 3. Get Boost Context, 4. Write Caption (Groq; produces the post title and description), 5. Format Caption, 6. Post to Facebook (our backend saves the post).
- Follow-up branch (true): 7. Get Latest Boost Context, 8. Ask API to Reduce Price, 9. Price Reduced? (IF node; continue only if true), 10. Write Flash-Sale Caption (Groq; produces the follow-up title and description), 11. Format Flash-Sale Caption, 12. Post Flash-Sale to Facebook (our backend saves the post).
- Both branches run independently per vegetable, so one vegetable's lock never blocks another vegetable.

Output:
- the weights and the CR
- a table with S+, S-, closeness and rank for each vegetable
- the vegetable chosen for this boost, and which vegetables are still locked and until when

Show every calculation step with the formula and the numbers, in plain language.
```

The six-hour rule replaces the idea of a fifth "days since last boost" criterion, so the AHP matrix and weights stay as they are.


## Related

- [[Weighted Surplus Visibility]] · [[Marketing Boost]]
- [[2026-11-08 AHP-TOPSIS Raw Criteria and Six-Hour Rule]] — how the code follows this flow
- [[00-LATEST]] · [[Delivery Index]] · [[00 Home]]
