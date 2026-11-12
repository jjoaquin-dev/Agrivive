"""AHP math (Saaty): weights, consistency ratio, points, and judge averaging."""
import math

# Saaty random index by matrix size.
RI = {3: 0.58, 4: 0.90, 5: 1.12}


def full_matrix(n, pairs):
    """Build the reciprocal matrix from the upper-triangle judgments {(i, j): value}."""
    m = [[1.0] * n for _ in range(n)]
    for (i, j), v in pairs.items():
        m[i][j], m[j][i] = float(v), 1.0 / v
    return m


def ahp(m):
    n = len(m)
    col = [sum(m[i][j] for i in range(n)) for j in range(n)]
    norm = [[m[i][j] / col[j] for j in range(n)] for i in range(n)]
    w = [sum(row) / n for row in norm]
    aw = [sum(m[i][j] * w[j] for j in range(n)) for i in range(n)]
    lam = sum(aw[i] / w[i] for i in range(n)) / n
    ci = (lam - n) / (n - 1)
    return {"col": col, "norm": norm, "w": w, "lam": lam, "ci": ci, "cr": ci / RI[n]}


def points(w):
    """Whole points: each weight divided by the smallest weight, rounded, never below 1."""
    low = min(w)
    return [max(1, round(x / low)) for x in w]


def geomean_matrix(matrices):
    """Combine several judges: geometric mean of each cell."""
    n, k = len(matrices[0]), len(matrices)
    return [[math.prod(m[i][j] for m in matrices) ** (1 / k) for j in range(n)] for i in range(n)]


def fmt(x):
    """Show a Saaty value as 3, 1/3 or 3.873."""
    if x >= 1 and abs(x - round(x)) < 1e-9:
        return str(int(round(x)))
    if x < 1 and abs(1 / x - round(1 / x)) < 1e-9:
        return "1/%d" % round(1 / x)
    return "%.3f" % x
