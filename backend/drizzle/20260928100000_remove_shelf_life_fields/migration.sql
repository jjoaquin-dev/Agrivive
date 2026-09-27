ALTER TABLE "sellers_product"
  DROP CONSTRAINT IF EXISTS "sellers_product_inventory_age_days_check";
--> statement-breakpoint
ALTER TABLE "sellers_product"
  DROP COLUMN IF EXISTS "inventory_age_days",
  DROP COLUMN IF EXISTS "storage_temperature_c",
  DROP COLUMN IF EXISTS "storage_notes";
