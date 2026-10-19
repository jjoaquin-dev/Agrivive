import { eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { user } from "../../../db/schema";
import { auth } from "..";
import { OrderError } from "../../../utils/order-types";
import { readAuthPasswordStatus } from "./auth.password-status";

export async function registerOrExpandRole(
  headers: Headers,
  input: {
    email: string;
    password: string;
    name?: string;
    targetRole: "buyer" | "seller";
  },
) {
  const cleanEmail = input.email.trim().toLowerCase();
  const targetRole = input.targetRole;
  if (!cleanEmail) throw new OrderError(400, "Email is required");
  if (!input.password || input.password.length < 8) {
    throw new OrderError(400, "Password must be at least 8 characters");
  }
  if (targetRole !== "buyer" && targetRole !== "seller") {
    throw new OrderError(400, "Invalid target role");
  }

  const [existing] = await db
    .select({
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    })
    .from(user)
    .where(eq(user.email, cleanEmail))
    .limit(1);

  // Scenario 1: New account (0 roles)
  if (!existing) {
    try {
      const response = await auth.api.signUpEmail({
        body: {
          email: cleanEmail,
          password: input.password,
          name: input.name?.trim() || (targetRole === "seller" ? "Seller" : "Buyer"),
        },
        headers,
      });

      if (targetRole === "seller" && response?.user?.id) {
        await db
          .update(user)
          .set({ role: ["seller"] })
          .where(eq(user.id, response.user.id));
      }

      const resAny = response as any;
      return {
        isNewAccount: true,
        roleAdded: false,
        user: response?.user,
        session: resAny?.session ?? null,
        token: response?.token,
      };

    } catch (err: any) {
      if (err instanceof OrderError) throw err;
      throw new OrderError(400, err?.message || "Failed to create account");
    }
  }

  // Scenario 2: Existing account
  if (!existing.isActive) {
    throw new OrderError(403, "Account is deactivated");
  }

  const currentRoles = existing.role ?? [];

  if (currentRoles.includes(targetRole)) {
    throw new OrderError(
      409,
      `An account with this email is already registered as a ${targetRole === "seller" ? "Seller" : "Buyer"}. Please sign in instead.`,
    );
  }

  if (currentRoles.length >= 2) {
    throw new OrderError(
      409,
      "This email already has both Buyer and Seller roles. No additional roles can be created for this account. Please sign in.",
    );
  }

  const pwdStatus = await readAuthPasswordStatus(existing.id);
  if (pwdStatus.passwordSetupRequired) {
    throw new OrderError(
      400,
      "This account was registered with Google without a password. Please sign in with Google or set a password first.",
    );
  }

  let signInRes: any;
  try {
    signInRes = await auth.api.signInEmail({
      body: {
        email: cleanEmail,
        password: input.password,
      },
      headers,
    });
  } catch {
    throw new OrderError(
      401,
      `An existing Agrivive account was found for this email. Please enter your existing password to activate your ${targetRole === "seller" ? "Seller" : "Buyer"} profile.`,
    );
  }

  await db
    .update(user)
    .set({
      role: sql`array_append(coalesce(${user.role}, ARRAY[]::"role"[]), ${targetRole}::"role")`,
      updatedAt: new Date(),
    })
    .where(eq(user.id, existing.id));

  const updatedRoles = [...currentRoles, targetRole];

  return {
    isNewAccount: false,
    roleAdded: true,
    targetRole,
    user: {
      ...signInRes?.user,
      role: updatedRoles,
    },
    session: signInRes?.session,
    token: signInRes?.token,
    message: `Your account now has ${targetRole === "seller" ? "Seller" : "Buyer"} access.`,
  };
}
