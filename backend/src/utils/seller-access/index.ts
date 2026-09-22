import { and, eq, gt } from "drizzle-orm";
import { seller_scan_grace, sellers_profile, user } from "../../db/schema";
import { OrderError, type OrderTransaction } from "../order-types";
import { isSellerProfileComplete } from "../seller-profile-completion";

export async function requireVerifiedSeller(
  tx: OrderTransaction,
  sellerId: string,
  requireProfile = true,
) {
  const [account] = await tx.select({
    isActive: user.isActive,
    roles: user.role,
    emailVerified: user.emailVerified,
  }).from(user).where(eq(user.id, sellerId)).limit(1);
  if (!account?.isActive) throw new OrderError(403, "Account is inactive");
  if (!account.emailVerified) {
    throw new OrderError(403, "Email OTP verification is required");
  }
  if (requireProfile) {
    if (!account.roles?.includes("seller")) throw new OrderError(403, "Seller role required");
    const [profile] = await tx.select().from(sellers_profile)
      .where(and(eq(sellers_profile.userId, sellerId), eq(sellers_profile.isCurrent, true))).limit(1);
    if (!isSellerProfileComplete(profile)) throw new OrderError(403, "Complete seller profile required");
  }
}

export async function requireSellerScanAccess(tx: OrderTransaction, sellerId: string, orderId: string) {
  const [account] = await tx.select({ isActive: user.isActive, roles: user.role }).from(user)
    .where(eq(user.id, sellerId)).limit(1);
  if (!account?.isActive || !account.roles?.includes("seller")) {
    throw new OrderError(403, "Seller account is inactive");
  }
  try {
    await requireVerifiedSeller(tx, sellerId);
    return;
  } catch (error) {
    if (!(error instanceof OrderError) || error.statusCode !== 403) throw error;
  }
  const [grace] = await tx.select({ graceUntil: seller_scan_grace.graceUntil }).from(seller_scan_grace)
    .where(and(eq(seller_scan_grace.orderId, orderId), eq(seller_scan_grace.sellerId, sellerId)))
    .limit(1);
  if (!grace || grace.graceUntil <= new Date()) {
    throw new OrderError(403, "Email verification and a complete seller profile are required");
  }
}

export async function sellerReadableOrderIds(tx: OrderTransaction, sellerId: string): Promise<string[] | null> {
  const [account] = await tx.select({ isActive: user.isActive, roles: user.role }).from(user)
    .where(eq(user.id, sellerId)).limit(1);
  if (!account?.isActive || !account.roles?.includes("seller")) throw new OrderError(403, "Seller account is inactive");
  try {
    await requireVerifiedSeller(tx, sellerId);
    return null;
  } catch (error) {
    if (!(error instanceof OrderError) || error.statusCode !== 403) throw error;
  }
  const rows = await tx.select({ orderId: seller_scan_grace.orderId }).from(seller_scan_grace)
    .where(and(eq(seller_scan_grace.sellerId, sellerId), gt(seller_scan_grace.graceUntil, new Date())));
  return rows.map((row) => row.orderId);
}
