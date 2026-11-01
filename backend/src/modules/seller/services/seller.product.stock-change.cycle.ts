import { desc, eq, sql } from "drizzle-orm";
import { listing_cycles } from "../../../db/schema";
import type { OrderTransaction } from "../../../utils/order-types";

// "Add More" on a running listing raises the product's original stock, so the current cycle's original stock must rise by the same amount.
export async function addToCurrentCycleOriginalQty(tx: OrderTransaction, productId: string, amount: string) {
  const [cycle] = await tx.select({ id: listing_cycles.id }).from(listing_cycles)
    .where(eq(listing_cycles.productId, productId))
    .orderBy(desc(listing_cycles.startedAt)).limit(1);
  if (!cycle) return;
  await tx.update(listing_cycles)
    .set({ originalQty: sql`${listing_cycles.originalQty} + ${amount}::numeric` })
    .where(eq(listing_cycles.id, cycle.id));
}
