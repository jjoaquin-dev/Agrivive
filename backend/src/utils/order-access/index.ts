import { eq } from "drizzle-orm";
import { user } from "../../db/schema";
import { OrderError, type OrderSide, type OrderTransaction } from "../order-types";
import { requireNoActiveTrustRestriction } from "../trust/access";

export async function requireActiveUser(
  tx: OrderTransaction,
  userId: string,
  role: OrderSide,
) {
  const [account] = await tx
    .select({ isActive: user.isActive, roles: user.role })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  if (!account?.isActive || !account.roles?.includes(role)) {
    throw new OrderError(403, `${role} account is not active`);
  }
}

/** A paused buyer can browse and message, but cannot reserve. The check runs on the server for every reservation. */
export async function requireCanReserve(tx: OrderTransaction, buyerId: string) {
  await requireActiveUser(tx, buyerId, "buyer");
  await requireNoActiveTrustRestriction(tx, buyerId);
}

/** A paused seller keeps serving existing orders, but cannot add new listings or use Priority Boost. */
export async function requireCanList(tx: OrderTransaction, sellerId: string) {
  await requireActiveUser(tx, sellerId, "seller");
  await requireNoActiveTrustRestriction(tx, sellerId);
}
