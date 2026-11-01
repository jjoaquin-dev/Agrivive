ALTER TABLE "sellers_product" ADD COLUMN IF NOT EXISTS "price_reduction_amount" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
-- Keep each existing drop the same size at today's price: percent of the current price, at least 0.01.
UPDATE "sellers_product"
SET "price_reduction_amount" = GREATEST(ROUND("product_price" * "price_reduction_percent" / 100, 2), 0.01)
WHERE "price_reduction_percent" > 0 AND "product_price" IS NOT NULL AND "price_reduction_amount" = 0;
