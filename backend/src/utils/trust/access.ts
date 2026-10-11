import { and, eq, gt, isNull, or } from "drizzle-orm";
import { trust_actions } from "../../db/schema";
import { OrderError, type OrderTransaction } from "../order-types";

export async function requireNoActiveTrustRestriction(tx: OrderTransaction, userId: string) {
  const [restriction] = await tx.select({ id: trust_actions.id }).from(trust_actions).where(and(
    eq(trust_actions.subjectId, userId),
    eq(trust_actions.actionType, "temporary_restriction"),
    isNull(trust_actions.revokedAt),
    or(isNull(trust_actions.endsAt), gt(trust_actions.endsAt, new Date())),
  )).limit(1);
  if (restriction) throw new OrderError(403, "Account is temporarily restricted");
}
