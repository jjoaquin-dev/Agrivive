export const boostLockHours = 6;
const hourMs = 60 * 60 * 1000;

export type RankedBoostCandidate = { id: string; productId: string; rank: number; score: number };

/**
 * The six-hour rule. Go down the ranking and pick the first listing whose last boost was at least
 * six hours ago. Listings boosted less than six hours ago are skipped, even when they rank first.
 * skipIds are listings the caller already tried or cannot boost this round.
 */
export function pickBoostCandidate(
  ranked: RankedBoostCandidate[],
  lastBoostAtByProduct: Map<string, Date>,
  now: Date,
  skipIds: ReadonlySet<string> = new Set(),
) {
  const locked: { id: string; productId: string; lockedUntil: Date }[] = [];
  for (const candidate of [...ranked].sort((left, right) => left.rank - right.rank)) {
    if (skipIds.has(candidate.id)) continue;
    const lastBoostAt = lastBoostAtByProduct.get(candidate.productId);
    const lockedUntil = lastBoostAt ? new Date(lastBoostAt.getTime() + boostLockHours * hourMs) : null;
    if (lockedUntil && lockedUntil > now) {
      locked.push({ id: candidate.id, productId: candidate.productId, lockedUntil });
      continue;
    }
    return { chosen: candidate, locked };
  }
  return { chosen: null, locked };
}
