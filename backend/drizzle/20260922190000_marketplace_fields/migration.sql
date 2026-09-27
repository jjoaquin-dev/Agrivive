DO $$ BEGIN
  CREATE TYPE "product_condition" AS ENUM ('good', 'fair', 'needs_inspection');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "seller_type" AS ENUM ('supplier', 'supplier_vendor', 'retail_vendor');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "sellers_product"
  ADD COLUMN IF NOT EXISTS "condition" "product_condition" NOT NULL DEFAULT 'needs_inspection',
  ADD COLUMN IF NOT EXISTS "inventory_age_days" integer,
  ADD COLUMN IF NOT EXISTS "storage_notes" text;

ALTER TABLE "sellers_profile"
  ADD COLUMN IF NOT EXISTS "seller_type" "seller_type" NOT NULL DEFAULT 'supplier',
  ADD COLUMN IF NOT EXISTS "pickup_instructions" text;

ALTER TABLE "sellers_product"
  DROP CONSTRAINT IF EXISTS "sellers_product_inventory_age_days_check";
ALTER TABLE "sellers_product"
  ADD CONSTRAINT "sellers_product_inventory_age_days_check"
  CHECK ("inventory_age_days" IS NULL OR ("inventory_age_days" >= 0 AND "inventory_age_days" <= 3650));
