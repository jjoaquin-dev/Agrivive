import { and, eq, sql } from "drizzle-orm";
import { sellers_profile, user } from "../../../db/schema";

const sellerRole = sql`'seller' = ANY(coalesce(${user.role}, ARRAY[]::"role"[]))`;

export function marketplaceSellerVisibility() {
  return and(
    eq(sellers_profile.isCurrent, true),
    sql`length(btrim(${sellers_profile.shopName})) > 0`,
    sql`length(btrim(${sellers_profile.detailAddress})) > 0`,
    sql`length(btrim(coalesce(${sellers_profile.phoneNumber}, ''))) >= 7`,
    eq(user.isActive, true),
    eq(user.emailVerified, true),
    sellerRole,
  );
}
