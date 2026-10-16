import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../../db";
import { account } from "../../../db/schema";

export type AuthPasswordStatus = {
  hasPassword: boolean;
  passwordSetupRequired: boolean;
};

export async function readAuthPasswordStatus(userId: string): Promise<AuthPasswordStatus> {
  const accounts = await db
    .select({ providerId: account.providerId, password: account.password })
    .from(account)
    .where(and(eq(account.userId, userId), inArray(account.providerId, ["credential", "google"])));

  const hasPassword = accounts.some(
    (candidate) => candidate.providerId === "credential" && Boolean(candidate.password),
  );
  const hasGoogleAccount = accounts.some((candidate) => candidate.providerId === "google");

  return {
    hasPassword,
    passwordSetupRequired: hasGoogleAccount && !hasPassword,
  };
}
