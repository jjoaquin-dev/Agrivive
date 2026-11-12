"""The five worked AHP samples. All judgments are sample data, not real judge answers."""
from ahp_math import full_matrix, geomean_matrix

# (title, story, names, matrix builder). Pair keys are (row, column) for the upper triangle.
S1 = ["QR misuse", "Seller cancels order", "Inquiry non-response", "Chat spam"]
S2 = ["Missed pickup", "False decline photo", "Invalid decline", "Late cancel"]
S3 = ["Inappropriate talk", "Personal data in chat", "Chat spam"]
S4 = ["Pickup group", "Listing group", "Chat group", "Review group"]
S5 = ["QR misuse", "Seller cancels order", "Chat spam"]

J1 = {(0, 1): 3, (0, 2): 7, (1, 2): 3}
J2 = {(0, 1): 5, (0, 2): 9, (1, 2): 3}

samples = [
    {"title": "Sample 1. Seller violations", "names": S1,
     "story": "Judge ask: which fault is worse for the market? QR misuse is a bit worse than a seller cancel (3), "
              "clearly worse than a slow reply (5), much worse than chat spam (7).",
     "matrix": full_matrix(4, {(0, 1): 3, (0, 2): 5, (0, 3): 7, (1, 2): 3, (1, 3): 5, (2, 3): 3})},
    {"title": "Sample 2. Buyer violations", "names": S2,
     "story": "Missed pickup hurts the seller most: stall food waits and nobody comes. A late cancel hurts least.",
     "matrix": full_matrix(4, {(0, 1): 2, (0, 2): 3, (0, 3): 5, (1, 2): 2, (1, 3): 3, (2, 3): 2})},
    {"title": "Sample 3. Chat violations (3 items)", "names": S3,
     "story": "Small group, 3 pairs only. Easy for a judge. Insults are worse than sharing a phone number, "
              "which is worse than spam.",
     "matrix": full_matrix(3, {(0, 1): 3, (0, 2): 5, (1, 2): 3})},
    {"title": "Sample 4. Group level (which group matters more)", "names": S4,
     "story": "One 15 x 15 matrix is too big. So run AHP inside each group, then run this small AHP on top. "
              "Final weight of a violation = group weight x its weight inside the group.",
     "matrix": full_matrix(4, {(0, 1): 2, (0, 2): 4, (0, 3): 3, (1, 2): 3, (1, 3): 2, (3, 2): 2})},
    {"title": "Sample 5. Two judges combined", "names": S5,
     "story": "Judge 1 and Judge 2 each fill a matrix. Merge each cell with the geometric mean. "
              "Then run AHP once on the merged matrix.",
     "judges": [full_matrix(3, J1), full_matrix(3, J2)],
     "matrix": geomean_matrix([full_matrix(3, J1), full_matrix(3, J2)])},
]
