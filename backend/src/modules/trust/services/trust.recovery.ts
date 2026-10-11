import { and, eq, inArray, isNull } from "drizzle-orm";
import { auth } from "../../auth";
import { db } from "../../../db";
import { trust_actions, user } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import type { TrustRecoveryRequestBody, TrustRecoveryVerifyBody } from "../model/trust.recovery";

const recoveryActionTypes = ["blocked", "temporary_restriction"] as const;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function hasRecoverableAction(email: string) {
  const [candidate] = await db.select({ id: user.id, isActive: user.isActive })
    .from(user).where(eq(user.email, email)).limit(1);
  if (!candidate || candidate.isActive) return false;
  const [action] = await db.select({ id: trust_actions.id }).from(trust_actions).where(and(
    eq(trust_actions.subjectId, candidate.id),
    inArray(trust_actions.actionType, recoveryActionTypes),
    isNull(trust_actions.revokedAt),
  )).limit(1);
  return !!action;
}

export async function requestTrustRecovery(input: TrustRecoveryRequestBody) {
  const email = normalizeEmail(input.email);
  if (await hasRecoverableAction(email)) {
    try {
      await auth.api.sendVerificationOTP({ body: { email, type: "forget-password" } });
    } catch {
      throw new OrderError(502, "Could not send the recovery code");
    }
  }
  return { success: true };
}

export async function verifyTrustRecovery(input: TrustRecoveryVerifyBody) {
  const email = normalizeEmail(input.email);
  try {
    await auth.api.checkVerificationOTP({
      body: { email, type: "forget-password", otp: input.otp.trim() },
    });
  } catch {
    throw new OrderError(400, "The recovery code is invalid or expired");
  }

  const restoredAt = new Date();
  const restored = await db.transaction(async (tx) => {
    const [candidate] = await tx.select({ id: user.id, isActive: user.isActive })
      .from(user).where(eq(user.email, email)).for("update").limit(1);
    if (!candidate || candidate.isActive) {
      throw new OrderError(400, "This account does not need recovery");
    }
    const actions = await tx.select({ id: trust_actions.id }).from(trust_actions).where(and(
      eq(trust_actions.subjectId, candidate.id),
      inArray(trust_actions.actionType, recoveryActionTypes),
      isNull(trust_actions.revokedAt),
    )).for("update");
    if (!actions.length) throw new OrderError(400, "This account does not need recovery");

    await tx.update(trust_actions).set({
      revokedAt: restoredAt,
      revokedBy: candidate.id,
      revocationReason: "Restored after email OTP verification",
    }).where(and(
      eq(trust_actions.subjectId, candidate.id),
      inArray(trust_actions.actionType, recoveryActionTypes),
      isNull(trust_actions.revokedAt),
    ));
    await tx.update(user).set({ isActive: true }).where(eq(user.id, candidate.id));
    return candidate.id;
  });

  return { success: true, userId: restored, restoredAt: restoredAt.toISOString() };
}
