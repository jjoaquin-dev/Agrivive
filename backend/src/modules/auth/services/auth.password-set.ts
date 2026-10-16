import { auth } from "..";
import { OrderError } from "../../../utils/order-types";
import { readAuthPasswordStatus } from "./auth.password-status";
import type { AuthPasswordSetBody } from "../model/auth.password";

export async function setGoogleAccountPassword(
  userId: string,
  headers: Headers,
  input: AuthPasswordSetBody,
) {
  if (input.newPassword !== input.confirmPassword) {
    throw new OrderError(400, "Passwords do not match");
  }

  const currentStatus = await readAuthPasswordStatus(userId);
  if (!currentStatus.passwordSetupRequired) {
    throw new OrderError(409, "A local password is not required for this account");
  }

  try {
    const result = await auth.api.setPassword({
      body: { newPassword: input.newPassword },
      headers,
    });

    if (!result?.status) {
      throw new OrderError(503, "Could not set the account password");
    }
  } catch (error) {
    if (error instanceof OrderError) throw error;
    console.error("Failed to set Google account password", error);
    throw new OrderError(400, "Could not set the account password. Please sign in with Google again and retry.");
  }

  return {
    hasPassword: true,
    passwordSetupRequired: false,
  };
}
