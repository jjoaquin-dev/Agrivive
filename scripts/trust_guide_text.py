"""Static caveman-style text for the Trust Points and AHP Guide."""
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph


def intro(P, H1, H2, NOTE, table):
    return [
        Paragraph("1. Why this paper", H1),
        Paragraph("Points now are own picks. No study give them. Panel say: need a source. "
                  "Fix: get points from <b>AHP</b>. AHP is old, known way to turn judge opinion into numbers. "
                  "Judges compare two things at a time. Math make weights. Math also check judges not mixed up.", P),
        Paragraph("2. What AHP is, short", H1),
        Paragraph("<b>AHP</b> = Analytic Hierarchy Process. Made by Thomas Saaty (1980). "
                  "Big idea: people bad at ranking 15 things at once. People good at comparing 2 things. "
                  "So ask only pairs. Let math do the rest.", P),
        table([["Saaty scale", "Meaning"], ["1", "Same"], ["3", "A bit worse"], ["5", "Clearly worse"],
               ["7", "Much worse"], ["9", "Extreme"], ["2, 4, 6, 8", "In between"],
               ["1/3, 1/5 ...", "Reverse. Second thing is worse."]], [1.6 * inch, 4.2 * inch]),
        PageBreak(),
    ]


def sections(P, H1, H2, NOTE, table):
    viol = [["Violation", "Who", "Points now", "What else"],
            ["Inquiry non-response", "Seller", 1, "Reminder at 12h, warning at 24h"],
            ["Low rating (2 stars or less)", "Seller", 1, "Counts with a reason or 2nd in 30 days"],
            ["Seller cancels confirmed order", "Seller", 2, "Also adds to fault rate"],
            ["Misleading product info", "Seller", 2, "Also adds to fault rate"],
            ["Inappropriate communication", "Seller", 2, "Needs 2 different reporters"],
            ["Seller-fault decline at pickup", "Seller", 2, "Also adds to fault rate"],
            ["QR misuse", "Seller", 3, "<b>Block at once</b>"],
            ["Missed pickup", "Buyer", 2, "Always 2 points"],
            ["Late cancel", "Buyer", 1, "Cancel counter warns at 5"],
            ["Invalid decline at pickup", "Buyer", 1, "Dispute decided by system"],
            ["False decline photo", "Buyer", 2, ""],
            ["Fake reports", "Buyer", 1, ""],
            ["Order from own account", "Buyer", 3, "<b>Block at once</b>"],
            ["Chat spam", "Both", 1, ""],
            ["Personal data in chat", "Both", 1, ""],
            ["Review bomb", "Buyer", "none", "Own rule, no points"],
            ["Order flood", "Buyer", "none", "Own rule, no points"]]
    levels = [["Score", "Level", "Consequence"], ["0-1", "Good standing", "Nothing"], ["2-3", "Notice", "Notice sent"],
              ["4-5", "Warning", "Warning sent"], ["6-7", "Pause 24 hours", "Account paused 24 hours"],
              ["8-11", "Pause 3 days", "Account paused 72 hours"], ["12+", "Blocked", "Account closed (isActive false)"]]
    return [
        Paragraph("3. List of violations and points now", H1),
        Paragraph("Points below are <b>current own picks</b> from <font face='Courier'>backend/src/utils/trust/policy.ts</font>. "
                  "AHP below will replace them with points that have a source.", P),
        table(viol, [2.2 * inch, 0.7 * inch, 0.8 * inch, 3.0 * inch]),
        Paragraph("4. Trust levels and consequences (same for buyer and seller)", H1),
        table(levels, [1.0 * inch, 1.8 * inch, 3.9 * inch]),
        Paragraph("A penalty starts only when a person moves UP a level. Check again later, no second penalty. "
                  "Serious violation skip steps and block at once. Seller pause or block also needs fault rate 10% or more "
                  "over 10 or more orders. Points fade after 90 days.", P),
        Paragraph("5. Formulas", H1),
        table([["Name", "Formula"],
               ["Trust score (Eq. 1)", "S = sum of weights of verified events in last 90 days. Excused or overturned events skip."],
               ["Seller fault rate (Eq. 2)", "F = (seller cancels + confirmed wrong listings + upheld declines) / "
                                             "(completed + cancelled + declined orders) x 100"],
               ["AHP weight", "Divide each matrix cell by its column sum. Weight = average of each row."],
               ["Largest eigenvalue", "lambda max = average of ( (matrix x weights) / weights )"],
               ["Consistency index", "CI = (lambda max - n) / (n - 1)"],
               ["Consistency ratio", "CR = CI / RI. Keep if CR is 0.10 or less. RI: n=3 0.58, n=4 0.90, n=5 1.12 (Saaty)."],
               ["Points", "Points = round( weight / smallest weight ), at least 1"],
               ["Many judges", "Merged cell = geometric mean of each judge cell"]], [1.7 * inch, 5.0 * inch]),
        Paragraph("6. How to use AHP in Agrivive", H1),
        table([["Step", "Do"],
               ["1", "Split the 15 violations into groups: pickup, listing, chat, review. One big matrix is too hard."],
               ["2", "Pick 3 to 5 judges: adviser, City Agriculturist's office, some sellers, some buyers."],
               ["3", "Each judge fills a pair matrix per group with the Saaty scale."],
               ["4", "Merge judges with the geometric mean."],
               ["5", "Run AHP. Get weights and CR. If CR is over 0.10, judges redo the pairs."],
               ["6", "Run group-level AHP. Final weight = group weight x weight inside group."],
               ["7", "Turn weights into points. Set thresholds as fractions of total possible score."],
               ["8", "Put numbers in <font face='Courier'>trustPolicyWeights</font> in policy.ts. Put matrices and CR in the paper."]],
              [0.6 * inch, 6.1 * inch]),
        PageBreak(),
        Paragraph("7. Five samples with process", H1),
        Paragraph("Each sample shows: judge pairs, matrix, column sums, weights, consistency check, points. "
                  "All numbers made by script. Judge answers are <b>sample data</b>.", P),
        PageBreak(),
    ]


def limits(P, table):
    return [
        Paragraph("AHP give a <b>method</b> with a source. It does not give judge answers. "
                  "Reference is the method plus the record of who judged and what CR came out. "
                  "Write it that way in the paper. Do not say a study gave '3 points for QR misuse'.", P),
        Paragraph("Sample numbers here are NOT real. Real judges must fill the matrices.", P),
        Paragraph("<b>Sources to read in full before citing:</b> Saaty, T. L. (1980), The Analytic Hierarchy Process, McGraw-Hill. "
                  "Dodevska et al., Mathematics 2023, 11(3):604. Systems 2025, 13(5):328. "
                  "Structure of weighted trust points: Kokkodis, Lappas and Kane (2022); Chu and Chen (2022); OECD (2022); WIPO ACE/16/11 (2023).", P),
        Paragraph("Final points and thresholds still need beta testing, then tune.", P),
    ]
