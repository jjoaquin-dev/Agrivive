# Professor Clarification Questions

Each answer unlocks the named test cases. Please reply per question number.

| # | Question | Why it matters | Unblocks |
|---|---|---|---|
| Q-01 | What are the **three rating categories**? For each: name, scale (1–5 stars?), and whether it rates the product, the seller, or both. How are the three values stored, and how do they become the single star shown on listings? | The feedback mentions three categories but no document names them. We will not invent them. | GRP-06, 08, 09, 11, 20; C4 |
| Q-02 | For the **group of five**: five products within one order, or across orders? Does one button create one review per product, or one review per group? Is a group of fewer than five allowed? | Decides tables, endpoints and the expected results for every group case. | GRP-01–24 |
| Q-03 | Is the **Bayesian formula** `R = (C × m + Σ ratings) / (C + n)`, C = 5, approved to replace the simple average? Which ratings make up `n` and `m` (seller reviews only?), is `m` the average of all sellers or of all reviews, and where is it shown (seller page, ranking, both)? | Today everything uses a simple average. We cannot replace one with the other without approval. | BAY-01–10; CALC-08; C1 |
| Q-04 | Should an order with many items count more in a seller's rating than an order with one item? | Today a 5-item order adds 6 rating rows to the seller average. | CALC-13; C7 |
| Q-05 | Should **product ratings** affect seller trust points and seller ranking? The task says product condition must not penalize the seller; the current build deliberately counts both. Which source is approved? | Direct conflict between the requirement and the current design. | SEP-04, 06, 07, 09; C3 |
| Q-06 | Is the **15-day edit period** an approved rule? Does it start at order completion or at review creation? Is day 15 included? Can a seller reply or a trust warning already issued be undone by an edit? How many edits are allowed? | No document sets this and no edit feature exists. | EDT-03–13; C2 |
| Q-07 | Does "one review per completed order" mean one seller review plus one review per product, or exactly one review in total? | Current build allows both kinds on one order. | ELG-10; C8 |
| Q-08 | In a group review, must every category be answered before the button works? Can the comment be left empty? | Decides blocking versus partial save. | GRP-11, 22 |
| Q-09 | Are **photos on reviews** required? If yes: how many per review, size and type limits, and shown publicly or only to the seller? | No photo support exists for reviews. | SUB-12, 13; GRP-22 |
| Q-10 | Is the neutral value for sellers with no ratings 2.5 on the 1–5 scale, or 0.5 after scaling? | Alpha PDF and code word it differently. | CALC-11; C9 |
| Q-11 | Should every place show the same rounding (1 decimal)? | The seller rating endpoint shows 2 decimals; the rest show 1. | CALC-08; C5 |
| Q-12 | May a review be removed or hidden (for abuse) by an admin, and does that change the average? | Not covered anywhere; affects average and trust tests. | New cases once answered |
