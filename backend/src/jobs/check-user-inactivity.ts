import { and, eq, lt, sql } from "drizzle-orm";
import { db } from "../db";
import { trust_actions, user } from "../db/schema";
import { queueTrustNotice } from "../utils/trust";
import { trustPolicyVersion } from "../utils/trust/policy";

export async function checkUserInactivity(limit = 100) {
  const now = new Date();
  const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 3_600_000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 3_600_000);

  // Only buyer and seller accounts follow the inactivity rule. Admin and stakeholder accounts are staff accounts.
  const isMarketplaceUser = sql`('buyer'::"role" = any(${user.role}) or 'seller'::"role" = any(${user.role}))`;

  let warningsIssued = 0;
  let accountsBlocked = 0;

  // FTM-08: Check 1 month (30 days) inactivity -> Block account
  const blockCandidates = await db
    .select({ id: user.id })
    .from(user)
    .where(and(eq(user.isActive, true), isMarketplaceUser, lt(user.lastActiveAt, oneMonthAgo)))
    .limit(limit);

  for (const candidate of blockCandidates) {
    await db.transaction(async (tx) => {
      await tx.update(user).set({ isActive: false }).where(eq(user.id, candidate.id));

      const actionKey = `${trustPolicyVersion}:${candidate.id}:blocked:inactivity-30d`;
      await tx
        .insert(trust_actions)
        .values({
          actionKey,
          subjectId: candidate.id,
          actionType: "blocked",
          weightedPoints: 0,
          policyVersion: trustPolicyVersion,
          reason: "Account has been inactive for more than 30 days.",
        })
        .onConflictDoNothing({ target: trust_actions.actionKey });

      await queueTrustNotice(tx, {
        noticeKey: `inactivity-blocked:${candidate.id}`,
        recipientId: candidate.id,
        kind: "inactivity_1m_blocked",
      });
    });
    accountsBlocked++;
  }

  // FTM-07: Check 3 weeks (21 days) inactivity -> Send warning
  const warnCandidates = await db
    .select({ id: user.id })
    .from(user)
    .where(
      and(
        eq(user.isActive, true),
        isMarketplaceUser,
        lt(user.lastActiveAt, threeWeeksAgo),
        sql`${user.lastActiveAt} >= ${oneMonthAgo}`,
      ),
    )
    .limit(limit);

  for (const candidate of warnCandidates) {
    const actionKey = `${trustPolicyVersion}:${candidate.id}:warning:inactivity-21d`;
    await db.transaction(async (tx) => {
      const [existing] = await tx
        .select({ id: trust_actions.id })
        .from(trust_actions)
        .where(eq(trust_actions.actionKey, actionKey))
        .limit(1);

      if (!existing) {
        await tx.insert(trust_actions).values({
          actionKey,
          subjectId: candidate.id,
          actionType: "warning",
          weightedPoints: 0,
          policyVersion: trustPolicyVersion,
          reason: "Account has been inactive for three weeks.",
        });

        await queueTrustNotice(tx, {
          noticeKey: `inactivity-warning:${candidate.id}`,
          recipientId: candidate.id,
          kind: "inactivity_3w_warning",
        });
        warningsIssued++;
      }
    });
  }

  return { warningsIssued, accountsBlocked };
}
