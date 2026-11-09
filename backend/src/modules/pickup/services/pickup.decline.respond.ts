import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { order_declines } from "../../../db/schema";
import { getOrder } from "../../../utils/order-read";
import { OrderError } from "../../../utils/order-types";
import { storeDeclinePhoto } from "../../../utils/pickup/decline-photo";
import { evaluateTrustAction } from "../../../utils/trust/evaluate-action";
import type { DeclineSellerBody } from "../model/pickup.decline";
import { finalizeDecline } from "./pickup.decline.finalize";

/** The seller accepts the decline (seller fault, 2 points), or disputes it. A dispute closes the order as
 * declined at pickup: nobody gets points and the produce is not put back in stock. The note and photo are saved with the record. */
export async function respondToDecline(sellerId: string, orderId: string, body: DeclineSellerBody) {
  const [current] = await db.select().from(order_declines).where(eq(order_declines.orderId, orderId)).limit(1);
  if (!current || current.sellerId !== sellerId) throw new OrderError(404, "Decline not found");
  const photo = body.action === "dispute" && body.photo ? await storeDeclinePhoto(orderId, body.photo, "seller", body.capturedAt) : null;
  const finalized = await db.transaction(async (tx) => {
    const [decline] = await tx.select().from(order_declines).where(eq(order_declines.id, current.id)).for("update").limit(1);
    if (!decline || decline.status !== "pending_seller") throw new OrderError(409, "This decline was already answered");
    const now = new Date();
    if (body.action === "accept") {
      await tx.update(order_declines).set({ sellerResponse: "accepted", sellerRespondedAt: now }).where(eq(order_declines.id, decline.id));
      return finalizeDecline(tx, { ...decline, sellerResponse: "accepted" }, "seller_fault");
    }
    await tx.update(order_declines).set({
      sellerResponse: "disputed", sellerRespondedAt: now, sellerNote: body.note?.trim() ?? null, sellerPhotoKey: photo?.key ?? null,
    }).where(eq(order_declines.id, decline.id));
    return finalizeDecline(tx, { ...decline, sellerResponse: "disputed" }, "disputed");
  });
  if (finalized) await evaluateTrustAction(finalized.subjectId, orderId, finalized.eventKey, finalized.kind);
  return getOrder(orderId, sellerId, "seller");
}
