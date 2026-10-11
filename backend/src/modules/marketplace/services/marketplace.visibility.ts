import { and, eq, sql } from "drizzle-orm";
import { sellers_profile, trust_actions, user } from "../../../db/schema";

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
    sql`not exists (
      select 1 from ${trust_actions}
      where ${trust_actions.subjectId} = ${user.id}
        and ${trust_actions.actionType} = 'temporary_restriction'
        and ${trust_actions.revokedAt} is null
        and (${trust_actions.endsAt} is null or ${trust_actions.endsAt} > now())
    )`,
  );
}
