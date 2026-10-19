import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { user } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";

export async function checkEmailRoleStatus(email: string, targetRole: "buyer" | "seller") {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) throw new OrderError(400, "Email is required");

  const [existing] = await db
    .select({
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    })
    .from(user)
    .where(eq(user.email, cleanEmail))
    .limit(1);

  if (!existing) {
    return {
      exists: false,
      roleCount: 0,
      currentRoles: [],
      canUseEmail: true,
      hasTargetRole: false,
      message: "Email is available for registration.",
    };
  }

  const currentRoles = existing.role ?? [];
  const roleCount = currentRoles.length;
  const hasTargetRole = currentRoles.includes(targetRole);

  if (roleCount >= 2) {
    return {
      exists: true,
      roleCount,
      currentRoles,
      canUseEmail: false,
      hasTargetRole,
      message: "This email already has both Buyer and Seller roles. Please sign in instead.",
    };
  }

  if (hasTargetRole) {
    return {
      exists: true,
      roleCount,
      currentRoles,
      canUseEmail: false,
      hasTargetRole: true,
      message: `An account with this email is already registered as a ${targetRole === "seller" ? "Seller" : "Buyer"}. Please sign in instead.`,
    };
  }

  return {
    exists: true,
    roleCount,
    currentRoles,
    canUseEmail: true,
    hasTargetRole: false,
    message: `Existing Agrivive account found. Enter your password to add the ${targetRole === "seller" ? "Seller" : "Buyer"} role.`,
  };
}
