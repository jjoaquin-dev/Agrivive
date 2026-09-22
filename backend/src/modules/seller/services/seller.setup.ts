import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_profile, user } from "../../../db/schema";
import { isSellerProfileComplete } from "../../../utils/seller-profile-completion";
import { OrderError } from "../../../utils/order-types";
import { getAvatarDisplayUrl } from "../../../utils/s3-avatar";

export async function getSellerSetup(userId: string) {
  return db.transaction(async (tx) => {
    const [account] = await tx.select({ id: user.id, name: user.name, email: user.email,
      image: user.image,
      emailVerified: user.emailVerified, twoFactorEnabled: user.twoFactorEnabled,
      isActive: user.isActive, role: user.role,
    }).from(user).where(eq(user.id, userId)).limit(1);
    if (!account?.isActive) throw new OrderError(403, "Account is inactive");
    const [profile] = await tx.select().from(sellers_profile).where(and(
      eq(sellers_profile.userId, userId), eq(sellers_profile.isCurrent, true),
    )).limit(1);
    const profileComplete = isSellerProfileComplete(profile);
    const sellerVerified = account.emailVerified && profileComplete && !!account.role?.includes("seller");
    return {
      account: { id: account.id, name: account.name, email: account.email, image: await getAvatarDisplayUrl(account.image) },
      profile: profile ?? null,
      emailVerified: account.emailVerified,
      profileComplete,
      sellerVerified,
      twoFactorEnabled: account.twoFactorEnabled,
      badge: sellerVerified ? {
        label: "Verified account",
        explanation: "Email verified and seller profile completed.",
      } : null,
      nextStep: !account.emailVerified ? "verify-email" as const : sellerVerified ? "ready" as const : "profile" as const,
    };
  });
}
