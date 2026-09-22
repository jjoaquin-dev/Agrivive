import { eq } from "drizzle-orm";
import { user } from "../../db/schema";
import { OrderError, type OrderSide, type OrderTransaction } from "../order-types";

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
