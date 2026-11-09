import { db } from "../../../db";
import { requireCanReserve } from "../../../utils/order-access";
import { OrderError } from "../../../utils/order-types";
import { readTrustStanding } from "../../../utils/trust/standing";
import { describeLevelChange } from "../../../utils/trust/notice-text";
import { levelLabel } from "../../../utils/trust/level";

/** Whether the buyer may reserve right now, and why not. The product page shows exactly this. */
export async function readBuyerReservationStatus(buyerId: string) {
  const standing = await readTrustStanding(buyerId);
  try {
    await db.transaction((tx) => requireCanReserve(tx, buyerId));
    return {
      canReserve: true, reason: null, level: standing.level, levelLabel: levelLabel[standing.level], score: standing.score,
      warning: standing.level === "warning" ? describeLevelChange("warning", standing.score, "buyer") : null,
    };
  } catch (error) {
    if (!(error instanceof OrderError)) throw error;
    return { canReserve: false, reason: error.message, level: standing.level, levelLabel: levelLabel[standing.level], score: standing.score, warning: null };
  }
}
