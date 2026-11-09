DROP TABLE IF EXISTS "product_reviews";
ALTER TABLE "seller_visibility_boosts" DROP COLUMN IF EXISTS "priority_score";
ALTER TABLE "seller_visibility_boosts" DROP COLUMN IF EXISTS "priority_tier";
ALTER TABLE "sellers_product" DROP COLUMN IF EXISTS "price_reduction_percent";
