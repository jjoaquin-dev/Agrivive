const clamp = (value: number) => Math.min(1, Math.max(0, value));
const hourMs = 60 * 60 * 1000;

export type VisibilityScoreInput = {
  evaluatedAt: Date;
  publishedAt: Date | null;
  quantity: number;
  originalQuantity: number;
  priorCycles: number;
};

export function calculateVisibilityScore(input: VisibilityScoreInput) {
  if (!input.publishedAt || input.publishedAt > input.evaluatedAt ||
    !Number.isFinite(input.quantity) || !Number.isFinite(input.originalQuantity) ||
    input.originalQuantity <= 0) return null;

  const postingAge = clamp((input.evaluatedAt.getTime() - input.publishedAt.getTime()) / (12 * hourMs));
  const remainingQuantity = clamp(input.quantity / input.originalQuantity);
  const recurrence = clamp(input.priorCycles / 3);
  const score = .40 * postingAge + .40 * remainingQuantity + .20 * recurrence;
  return {
    score,
    tier: score >= .70 ? "priority" as const : score >= .40 ? "standard" as const : "basic" as const,
    inputs: { postingAge, remainingQuantity, recurrence, priorCycles: input.priorCycles },
  };
}
import { sql } from "drizzle-orm";
import { listing_cycles, sellers_product } from "../../db/schema";


export function marketplaceVisibilityScoreSql(evaluatedAt: Date, since: Date) {
  const currentCycleId = sql`(
    select current_cycle.id from ${listing_cycles} as current_cycle
    where current_cycle.product_id = ${sellers_product.id}
      and current_cycle.started_at <= ${evaluatedAt}
    order by current_cycle.started_at desc limit 1
  )`;
  const vegetableKey = sql`coalesce(
    (select current_cycle.vegetable_key from ${listing_cycles} as current_cycle
      where current_cycle.product_id = ${sellers_product.id}
        and current_cycle.started_at <= ${evaluatedAt}
      order by current_cycle.started_at desc limit 1),
    lower(regexp_replace(btrim(${sellers_product.productName}), '[[:space:]]+', ' ', 'g'))
  )`;
  const priorCycles = sql<number>`(
    select count(*)::int from ${listing_cycles} as prior_cycle
    inner join ${sellers_product} as prior_product on prior_product.id = prior_cycle.product_id
    where prior_product.user_id = ${sellers_product.userId}
      and prior_cycle.vegetable_key = ${vegetableKey}
      and prior_cycle.started_at >= ${since}
      and prior_cycle.started_at < ${sellers_product.publishedAt}
      and prior_cycle.started_at <= ${evaluatedAt}
      and prior_cycle.id is distinct from ${currentCycleId}
  )`;
  return sql<number | null>`(case
    when ${sellers_product.originalQty} is null
      or ${sellers_product.originalQty} <= 0 or ${sellers_product.publishedAt} is null
      or ${sellers_product.publishedAt} > ${evaluatedAt} then null
    else
      .40 * least(1, greatest(0, extract(epoch from (${evaluatedAt}::timestamptz - ${sellers_product.publishedAt})) / 43200.0))
      + .40 * least(1, greatest(0, ${sellers_product.productQty} / nullif(${sellers_product.originalQty}, 0)))
      + .20 * least(1, greatest(0, ${priorCycles} / 3.0))
  end)::double precision`;
}
