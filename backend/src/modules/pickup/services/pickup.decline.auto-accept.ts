import { and, eq, lte } from "drizzle-orm";
import { db } from "../../../db";
import { order_declines } from "../../../db/schema";
import { evaluateTrustAction } from "../../../utils/trust/evaluate-action";
import { finalizeDecline } from "./pickup.decline.finalize";

/** Scheduled: a seller who stays silent for 24 hours counts as accepting. Each decline is closed once. */
export async function autoAcceptDeclines(limit = 100) {
  const due = await db.select({ id: order_declines.id }).from(order_declines)
    .where(and(eq(order_declines.status, "pending_seller"), lte(order_declines.sellerDueAt, new Date()))).limit(limit);
  let accepted = 0;
  for (const row of due) {
    const finalized = await db.transaction(async (tx) => {
      const [decline] = await tx.select().from(order_declines).where(eq(order_declines.id, row.id)).for("update").limit(1);
      if (!decline || decline.status !== "pending_seller") return null;
      await tx.update(order_declines).set({ sellerResponse: "auto_accepted", sellerRespondedAt: new Date() }).where(eq(order_declines.id, decline.id));
      return finalizeDecline(tx, decline, "seller_fault");
    });
    if (!finalized) continue;
    accepted++;
    await evaluateTrustAction(finalized.subjectId, null, finalized.eventKey, finalized.kind);
  }
  return accepted;
}
