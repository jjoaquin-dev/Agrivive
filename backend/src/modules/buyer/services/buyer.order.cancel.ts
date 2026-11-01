import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "../../../db";
import { orders, trust_actions } from "../../../db/schema";
import { restoreOrderStock } from "../../../utils/order-stock";
import { OrderError } from "../../../utils/order-types";
import { getBuyerOrder } from "./buyer.order.get";
import {
  resolveCancellationCooldownHours,
  resolveCancellationRestrictionMessage,
  resolveCancellationWarning,
} from "../../../utils/trust/cancellation-policy";
import { trustPolicyVersion } from "../../../utils/trust/policy";
import { createSellerNotification } from "../../../utils/seller-notifications";

export async function cancelBuyerOrder(orderId: string, buyerId: string) {
  await db.transaction(async (tx) => {
    const now = new Date();
    const [cancelled] = await tx
      .update(orders)
      .set({ status: "cancelled", cancelledBy: "buyer", cancelledAt: now, updatedAt: now })
      .where(
        and(
          eq(orders.id, orderId),
          eq(orders.buyersId, buyerId),
          eq(orders.status, "pending"),
          gt(orders.expiresAt, now),
        ),
      )
      .returning({ id: orders.id, sellersId: orders.sellersId });

    if (!cancelled) {
      const [current] = await tx
        .select({ status: orders.status, expiresAt: orders.expiresAt })
        .from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.buyersId, buyerId)))
        .limit(1);
      if (!current) throw new OrderError(404, "Order not found");
      if (current.status === "pending" && current.expiresAt && current.expiresAt <= now) {
        throw new OrderError(410, "Order has expired");
      }
      throw new OrderError(409, "Order is no longer pending");
    }

    await restoreOrderStock(tx, cancelled.id);
    await createSellerNotification(tx, {
      sellerId: cancelled.sellersId,
      kind: "buyer_cancelled",
      dedupeKey: `buyer-cancelled:${cancelled.id}`,
      orderId: cancelled.id,
    });

    // Count all buyer cancellations to apply 5 (warning), 7 (12h), 9 (24h), 10 (3d) cooldown policy
    const [cancelRow] = await tx
      .select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .where(
        and(
          eq(orders.buyersId, buyerId),
          eq(orders.status, "cancelled"),
          eq(orders.cancelledBy, "buyer"),
        ),
      );
    const cancelCount = Number(cancelRow?.count ?? 0);
    const cooldownHours = resolveCancellationCooldownHours(cancelCount);

    if (cooldownHours > 0) {
      const endsAt = new Date(Date.now() + cooldownHours * 3600000);
      const { message } = resolveCancellationRestrictionMessage(cancelCount, endsAt);
      const actionKey = `${trustPolicyVersion}:${buyerId}:cancellation-restriction:${cancelCount}`;

      await tx.insert(trust_actions).values({
        actionKey,
        subjectId: buyerId,
        actionType: "temporary_restriction",
        weightedPoints: cancelCount,
        policyVersion: trustPolicyVersion,
        reason: message,
        sourceOrderId: cancelled.id,
        endsAt,
      }).onConflictDoNothing({ target: trust_actions.actionKey });
    } else if (cancelCount >= 5) {
      const warningMessage = resolveCancellationWarning(cancelCount);
      if (warningMessage) {
        const actionKey = `${trustPolicyVersion}:${buyerId}:cancellation-warning:${cancelCount}`;
        await tx.insert(trust_actions).values({
          actionKey,
          subjectId: buyerId,
          actionType: "warning",
          weightedPoints: cancelCount,
          policyVersion: trustPolicyVersion,
          reason: warningMessage,
          sourceOrderId: cancelled.id,
        }).onConflictDoNothing({ target: trust_actions.actionKey });
      }
    }
  });

  return getBuyerOrder(orderId, buyerId);
}
