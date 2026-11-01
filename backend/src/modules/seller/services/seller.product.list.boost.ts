import { and, desc, eq, inArray } from "drizzle-orm";
import { seller_visibility_boosts } from "../../../db/schema";
import type { OrderTransaction } from "../../../utils/order-types";
import { readBoostProgress, type BoostState } from "./seller.visibility-boost.progress";

export type ProductBoostChip = {
  state: BoostState;
  nextDropAt: string | null;
  roundsDone: number;
};

/** The newest first boost of each product, with its state, for the small chip on listing cards. */
export async function readProductBoostChips(tx: OrderTransaction, productIds: string[]) {
  const chips = new Map<string, ProductBoostChip>();
  if (productIds.length === 0) return chips;

  const rows = await tx.select({
    id: seller_visibility_boosts.id,
    productId: seller_visibility_boosts.productId,
    reason: seller_visibility_boosts.reason,
    status: seller_visibility_boosts.status,
    createdAt: seller_visibility_boosts.createdAt,
    sentAt: seller_visibility_boosts.sentAt,
    followUpDueAt: seller_visibility_boosts.followUpDueAt,
  }).from(seller_visibility_boosts).where(and(
    inArray(seller_visibility_boosts.productId, productIds),
    inArray(seller_visibility_boosts.status, ["queued", "sent"]),
  )).orderBy(desc(seller_visibility_boosts.createdAt));

  const firstBoosts = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    if (row.reason === "initial" && !firstBoosts.has(row.productId)) firstBoosts.set(row.productId, row);
  }

  const progress = await readBoostProgress(tx, [...firstBoosts.values()]);
  for (const [productId, row] of firstBoosts) {
    const item = progress.get(row.id);
    if (!item) continue;
    chips.set(productId, { state: item.state, nextDropAt: item.nextDropAt, roundsDone: item.roundsDone });
  }
  return chips;
}
