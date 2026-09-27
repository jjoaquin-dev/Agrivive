ALTER TABLE "sellers_product"
  ADD COLUMN IF NOT EXISTS "base_price" numeric(10,2),
  ADD COLUMN IF NOT EXISTS "price_reduction_percent" numeric(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "minimum_price" numeric(10,2),
  ADD COLUMN IF NOT EXISTS "price_schedule_started_at" timestamptz,
  ADD COLUMN IF NOT EXISTS "price_reduction_periods_applied" integer NOT NULL DEFAULT 0;

UPDATE "sellers_product"
SET "base_price" = COALESCE("base_price", "product_price"),
    "price_schedule_started_at" = COALESCE("price_schedule_started_at", "published_at")
WHERE "base_price" IS NULL OR "price_schedule_started_at" IS NULL;
