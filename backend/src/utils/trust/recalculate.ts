import { and, eq, inArray, isNull, notLike, sql } from "drizzle-orm";
import { db } from "../../db";
import { trust_actions, user } from "../../db/schema";
import { queueTrustNotice } from "./index";
import { actionLevel, readActiveActions } from "./evaluate-action";
import { levelLabel, levelRank } from "./level";
import { trustActionPolicy } from "./policy";
import { readTrustStanding, syncSellerFlags } from "./standing";

/**
 * Recalculates a person's level from the events that still count. Run after an excuse, or a dispute,
 * or when old points fade. A consequence higher than the new level ends; nothing new is ever started here.
 */
export async function recalculateTrustStanding(subjectId: string, why = "Your score fell") {
  if (!trustActionPolicy.enabled) return { revoked: 0 };
  const standing = await readTrustStanding(subjectId);
  await syncSellerFlags(standing);
  const active = await readActiveActions(subjectId);
  const above = active.filter((row) => !row.actionKey.includes("inactivity") && levelRank(actionLevel(row)) > levelRank(standing.level));
  if (!above.length) return { revoked: 0 };
  const now = new Date();
  await db.transaction(async (tx) => {
    await tx.update(trust_actions).set({ revokedAt: now, revocationReason: `${why}, so this level no longer applies.` })
      .where(inArray(trust_actions.id, above.map((row) => row.id)));
    if (above.some((row) => actionLevel(row) === "block")) {
      await tx.update(user).set({ isActive: true }).where(eq(user.id, subjectId));
    }
    await queueTrustNotice(tx, {
      noticeKey: `trust-recalc:${subjectId}:${now.getTime()}`, recipientId: subjectId, kind: "trust_level_lowered",
      detail: `${why}. Your score is now ${standing.score} and your level is ${levelLabel[standing.level]}. The earlier restriction has ended.`,
    });
  });
  return { revoked: above.length };
}

/** Scheduled: points fade 90 days after the event, so levels can come down without anyone asking. */
export async function recalculateActiveStandings(limit = 100) {
  const rows = await db.selectDistinct({ subjectId: trust_actions.subjectId }).from(trust_actions).where(and(
    isNull(trust_actions.revokedAt), notLike(trust_actions.actionKey, "%inactivity%"),
    sql`${trust_actions.level} is not null`)).limit(limit);
  let revoked = 0;
  for (const row of rows) revoked += (await recalculateTrustStanding(row.subjectId, "Old points faded")).revoked;
  return revoked;
}
